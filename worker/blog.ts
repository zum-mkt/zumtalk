// Blog guardado no KV:
//   blog:index        -> { posts: PostMeta[] (inclui rascunhos), categories: BlogCategory[] }
//   blog:post:<id>    -> HTML do conteúdo do post
//   media:<id>        -> bytes da imagem (tipo no metadata do KV)

import { readingMinutes, slugify, type BlogCategory, type BlogIndex, type Post, type PostMeta } from "../src/blog/types";

const INDEX_KEY = "blog:index";
const postKey = (id: string) => `blog:post:${id}`;
const MAX_POST = 1024 * 1024; // 1 MB de HTML
const MAX_MEDIA = 8 * 1024 * 1024; // 8 MB por imagem
const MEDIA_TYPES = ["image/webp", "image/jpeg", "image/png", "image/gif", "image/avif"];

type Json = (data: unknown, status?: number, headers?: HeadersInit) => Response;

export async function readIndex(kv: KVNamespace): Promise<BlogIndex> {
  const idx = await kv.get<BlogIndex>(INDEX_KEY, "json");
  return { posts: idx?.posts ?? [], categories: idx?.categories ?? [] };
}

const isLive = (p: PostMeta, now = Date.now()) =>
  p.status === "published" && !!p.publishedAt && Date.parse(p.publishedAt) <= now;

// Índice público: só publicados, do mais novo para o mais antigo.
export async function publicIndex(kv: KVNamespace): Promise<BlogIndex> {
  const idx = await readIndex(kv);
  const posts = idx.posts.filter((p) => isLive(p)).sort((a, b) => Date.parse(b.publishedAt!) - Date.parse(a.publishedAt!));
  return { posts, categories: idx.categories };
}

export async function publicPost(kv: KVNamespace, slug: string): Promise<{ post: Post; recent: PostMeta[]; categories: BlogCategory[] } | null> {
  const idx = await publicIndex(kv);
  const meta = idx.posts.find((p) => p.slug === slug);
  if (!meta) return null;
  const content = (await kv.get(postKey(meta.id))) ?? "";
  const sameCat = idx.posts.filter((p) => p.id !== meta.id && p.categoryIds.some((c) => meta.categoryIds.includes(c)));
  const others = idx.posts.filter((p) => p.id !== meta.id && !sameCat.includes(p));
  return { post: { ...meta, content }, recent: [...sameCat, ...others].slice(0, 3), categories: idx.categories };
}

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.slice(0, max) : "");

function uniqueSlug(wanted: string, id: string, posts: PostMeta[]) {
  const base = slugify(wanted) || "post";
  let slug = base;
  for (let n = 2; posts.some((p) => p.slug === slug && p.id !== id); n++) slug = `${base}-${n}`;
  return slug;
}

// Rotas do painel (o chamador já validou a sessão).
export async function handleBlogAdmin(request: Request, kv: KVNamespace, path: string, json: Json): Promise<Response> {
  const method = request.method;

  if (path === "/api/admin/blog" && method === "GET") {
    const idx = await readIndex(kv);
    idx.posts.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
    return json(idx);
  }

  const postMatch = path.match(/^\/api\/admin\/blog\/posts\/([\w-]+)$/);

  if (postMatch && method === "GET") {
    const idx = await readIndex(kv);
    const meta = idx.posts.find((p) => p.id === postMatch[1]);
    if (!meta) return json({ error: "Post não encontrado." }, 404);
    return json({ post: { ...meta, content: (await kv.get(postKey(meta.id))) ?? "" } });
  }

  if (path === "/api/admin/blog/posts" && method === "PUT") {
    const raw = await request.text();
    if (raw.length > MAX_POST) return json({ error: "O post ficou grande demais (máx. 1 MB de texto)." }, 413);
    let body: Partial<Post>;
    try {
      body = JSON.parse(raw);
    } catch {
      return json({ error: "JSON inválido." }, 400);
    }
    const title = str(body.title, 200).trim();
    if (!title) return json({ error: "O título é obrigatório." }, 400);

    const idx = await readIndex(kv);
    const id = typeof body.id === "string" && /^[\w-]{6,40}$/.test(body.id) ? body.id : crypto.randomUUID();
    const existing = idx.posts.find((p) => p.id === id);
    const content = str(body.content, MAX_POST);
    const status = body.status === "published" ? "published" : "draft";
    const publishedAt =
      typeof body.publishedAt === "string" && !Number.isNaN(Date.parse(body.publishedAt))
        ? new Date(body.publishedAt).toISOString()
        : status === "published"
          ? new Date().toISOString()
          : existing?.publishedAt ?? null;
    const validCats = new Set(idx.categories.map((c) => c.id));

    const meta: PostMeta = {
      id,
      slug: uniqueSlug(str(body.slug, 120) || title, id, idx.posts),
      title,
      excerpt: str(body.excerpt, 600),
      cover: typeof body.cover === "string" && body.cover.startsWith("/media/") ? body.cover : null,
      categoryIds: Array.isArray(body.categoryIds) ? body.categoryIds.filter((c): c is string => typeof c === "string" && validCats.has(c)) : [],
      author: str(body.author, 120).trim() || "Equipe ZumTalk",
      status,
      publishedAt,
      updatedAt: new Date().toISOString(),
      readingMinutes: readingMinutes(content),
      seoTitle: str(body.seoTitle, 200),
      seoDescription: str(body.seoDescription, 400),
    };

    await kv.put(postKey(id), content);
    idx.posts = existing ? idx.posts.map((p) => (p.id === id ? meta : p)) : [meta, ...idx.posts];
    await kv.put(INDEX_KEY, JSON.stringify(idx));
    return json({ post: { ...meta, content } });
  }

  if (postMatch && method === "DELETE") {
    const idx = await readIndex(kv);
    idx.posts = idx.posts.filter((p) => p.id !== postMatch[1]);
    await kv.put(INDEX_KEY, JSON.stringify(idx));
    await kv.delete(postKey(postMatch[1]));
    return json({ ok: true });
  }

  if (path === "/api/admin/blog/categories" && method === "PUT") {
    const body = (await request.json().catch(() => null)) as { categories?: unknown } | null;
    if (!Array.isArray(body?.categories)) return json({ error: "Lista inválida." }, 400);
    const seen = new Set<string>();
    const categories: BlogCategory[] = [];
    for (const c of body.categories as Partial<BlogCategory>[]) {
      const name = str(c?.name, 60).trim();
      if (!name) continue;
      let slug = slugify(str(c?.slug, 60) || name) || "categoria";
      while (seen.has(slug)) slug += "-2";
      seen.add(slug);
      categories.push({ id: typeof c?.id === "string" && c.id ? c.id : crypto.randomUUID(), slug, name });
    }
    const idx = await readIndex(kv);
    const ids = new Set(categories.map((c) => c.id));
    idx.categories = categories;
    idx.posts = idx.posts.map((p) => ({ ...p, categoryIds: p.categoryIds.filter((c) => ids.has(c)) }));
    await kv.put(INDEX_KEY, JSON.stringify(idx));
    return json({ categories });
  }

  if (path === "/api/admin/media" && method === "POST") {
    const type = (request.headers.get("content-type") ?? "").split(";")[0].trim();
    if (!MEDIA_TYPES.includes(type)) return json({ error: "Envie uma imagem (WebP, JPG, PNG, GIF ou AVIF)." }, 415);
    const bytes = await request.arrayBuffer();
    if (bytes.byteLength > MAX_MEDIA) return json({ error: "Imagem grande demais (máx. 8 MB)." }, 413);
    const id = crypto.randomUUID();
    await kv.put(`media:${id}`, bytes, { metadata: { type } });
    return json({ url: `/media/${id}` });
  }

  return json({ error: "Não encontrado." }, 404);
}

export async function serveMedia(kv: KVNamespace, id: string): Promise<Response> {
  if (!/^[\w-]{10,60}$/.test(id)) return new Response("Not found", { status: 404 });
  const { value, metadata } = await kv.getWithMetadata<{ type: string }>(`media:${id}`, "arrayBuffer");
  if (!value) return new Response("Not found", { status: 404 });
  return new Response(value, {
    headers: {
      "content-type": metadata?.type ?? "application/octet-stream",
      "cache-control": "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
    },
  });
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function rss(kv: KVNamespace, origin: string): Promise<Response> {
  const { posts } = await publicIndex(kv);
  const items = posts
    .slice(0, 30)
    .map(
      (p) => `<item><title>${esc(p.title)}</title><link>${origin}/blog/${p.slug}</link><guid>${origin}/blog/${p.slug}</guid><pubDate>${new Date(p.publishedAt!).toUTCString()}</pubDate><description>${esc(p.excerpt)}</description></item>`,
    )
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Blog ZumTalk</title><link>${origin}/blog</link><description>Atendimento, vendas e automação no WhatsApp.</description><language>pt-BR</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=600" } });
}

export async function sitemap(kv: KVNamespace, origin: string): Promise<Response> {
  const { posts, categories } = await publicIndex(kv);
  const urls = [
    `${origin}/`,
    `${origin}/planos`,
    `${origin}/blog`,
    ...categories.map((c) => `${origin}/blog/categoria/${c.slug}`),
    ...posts.map((p) => `${origin}/blog/${p.slug}`),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((u) => `<url><loc>${esc(u)}</loc></url>`).join("")}</urlset>`;
  return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=600" } });
}

// Metadados de compartilhamento das páginas do blog (o HTML é o mesmo index.html da SPA).
export function blogHead(page: { title: string; description: string; image?: string | null; url: string; type: "website" | "article"; jsonLd?: unknown }) {
  const tags = [
    `<meta property="og:title" content="${esc(page.title)}">`,
    `<meta property="og:description" content="${esc(page.description)}">`,
    `<meta property="og:type" content="${page.type}">`,
    `<meta property="og:url" content="${esc(page.url)}">`,
    `<link rel="canonical" href="${esc(page.url)}">`,
    `<link rel="alternate" type="application/rss+xml" title="Blog ZumTalk" href="/blog/rss.xml">`,
  ];
  if (page.image) tags.push(`<meta property="og:image" content="${esc(page.image)}">`, `<meta name="twitter:image" content="${esc(page.image)}">`);
  if (page.jsonLd) tags.push(`<script type="application/ld+json">${JSON.stringify(page.jsonLd).replace(/</g, "\\u003c")}</script>`);
  return tags.join("");
}
