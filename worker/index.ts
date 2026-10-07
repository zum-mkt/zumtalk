// Worker do site: serve a API do painel /admin, o blog e injeta o conteúdo salvo no index.html.
// Arquivos estáticos (JS, CSS, imagens) são servidos direto pelo Cloudflare sem passar por aqui.

import { blogHead, handleBlogAdmin, publicIndex, publicPost, rss, serveMedia, sitemap } from "./blog";

interface Env {
  ASSETS: Fetcher;
  CONTENT: KVNamespace;
  ADMIN_PASSWORD?: string;
}

const CONTENT_KEY = "content";
const PREVIOUS_KEY = "content:previous";
const COOKIE = "zt_admin";
const SESSION_SECONDS = 60 * 60 * 12; // 12 horas
const MAX_BODY = 256 * 1024;
const MAX_LOGIN_FAILS = 10;
const LOCKOUT_SECONDS = 15 * 60;

const enc = new TextEncoder();

const json = (data: unknown, status = 200, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });

const b64url = (buf: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function hmac(secret: string, data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

async function sameText(a: string, b: string) {
  // Compara hashes de tamanho fixo em tempo constante.
  const [ha, hb] = await Promise.all([crypto.subtle.digest("SHA-256", enc.encode(a)), crypto.subtle.digest("SHA-256", enc.encode(b))]);
  return crypto.subtle.timingSafeEqual(ha, hb);
}

// Sessão = "<expira-em>.<assinatura>". Assinada com a senha, então trocar a senha derruba todas as sessões.
async function createSession(env: Env) {
  const exp = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return `${exp}.${await hmac(env.ADMIN_PASSWORD!, exp)}`;
}

async function isAuthed(request: Request, env: Env) {
  if (!env.ADMIN_PASSWORD) return false;
  const cookie = request.headers.get("cookie") ?? "";
  const token = cookie.split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  return sameText(sig, await hmac(env.ADMIN_PASSWORD, exp));
}

const sessionCookie = (value: string, maxAge: number) =>
  `${COOKIE}=${value}; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;

async function handleApi(request: Request, env: Env, url: URL): Promise<Response> {
  const { pathname } = url;
  const method = request.method;

  if (pathname === "/api/content" && method === "GET") {
    const saved = await env.CONTENT.get(CONTENT_KEY, "json");
    return json({ content: saved ?? null });
  }

  if (pathname === "/api/session" && method === "GET") {
    if (!env.ADMIN_PASSWORD) return json({ authed: false, configured: false });
    return json({ authed: await isAuthed(request, env), configured: true });
  }

  if (pathname === "/api/login" && method === "POST") {
    if (!env.ADMIN_PASSWORD) return json({ error: "A senha do painel ainda não foi configurada no servidor." }, 503);
    const ip = request.headers.get("cf-connecting-ip") ?? "local";
    const failKey = `login-fail:${ip}`;
    const fails = Number((await env.CONTENT.get(failKey)) ?? 0);
    if (fails >= MAX_LOGIN_FAILS) return json({ error: "Muitas tentativas. Aguarde 15 minutos e tente de novo." }, 429);

    const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
    const password = typeof body?.password === "string" ? body.password : "";
    if (!(await sameText(password, env.ADMIN_PASSWORD))) {
      await env.CONTENT.put(failKey, String(fails + 1), { expirationTtl: LOCKOUT_SECONDS });
      return json({ error: "Senha incorreta." }, 401);
    }
    await env.CONTENT.delete(failKey);
    return json({ ok: true }, 200, { "set-cookie": sessionCookie(await createSession(env), SESSION_SECONDS) });
  }

  if (pathname === "/api/logout" && method === "POST") {
    return json({ ok: true }, 200, { "set-cookie": sessionCookie("", 0) });
  }

  if (pathname === "/api/content" && (method === "PUT" || method === "DELETE")) {
    if (!(await isAuthed(request, env))) return json({ error: "Sessão expirada. Entre de novo." }, 401);

    const current = await env.CONTENT.get(CONTENT_KEY);
    if (method === "DELETE") {
      // Volta ao conteúdo padrão do código, guardando o atual como versão anterior.
      if (current) await env.CONTENT.put(PREVIOUS_KEY, current);
      await env.CONTENT.delete(CONTENT_KEY);
      return json({ ok: true });
    }

    if (!(request.headers.get("content-type") ?? "").includes("application/json")) return json({ error: "Formato inválido." }, 415);
    const raw = await request.text();
    if (raw.length > MAX_BODY) return json({ error: "Conteúdo grande demais." }, 413);
    let data: unknown;
    try {
      data = JSON.parse(raw);
    } catch {
      return json({ error: "JSON inválido." }, 400);
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) return json({ error: "Conteúdo inválido." }, 400);

    if (current) await env.CONTENT.put(PREVIOUS_KEY, current);
    await env.CONTENT.put(CONTENT_KEY, JSON.stringify(data));
    return json({ ok: true, savedAt: new Date().toISOString() });
  }

  if (pathname === "/api/content/previous" && method === "POST") {
    if (!(await isAuthed(request, env))) return json({ error: "Sessão expirada. Entre de novo." }, 401);
    const previous = await env.CONTENT.get(PREVIOUS_KEY);
    if (!previous) return json({ error: "Não há versão anterior salva." }, 404);
    const current = await env.CONTENT.get(CONTENT_KEY);
    await env.CONTENT.put(CONTENT_KEY, previous);
    if (current) await env.CONTENT.put(PREVIOUS_KEY, current);
    return json({ ok: true, content: JSON.parse(previous) });
  }

  if (pathname === "/api/blog" && method === "GET") return json(await publicIndex(env.CONTENT));

  const slugMatch = pathname.match(/^\/api\/blog\/posts\/([\w-]+)$/);
  if (slugMatch && method === "GET") {
    const data = await publicPost(env.CONTENT, slugMatch[1]);
    return data ? json(data) : json({ error: "Post não encontrado." }, 404);
  }

  if (pathname.startsWith("/api/admin/")) {
    if (!(await isAuthed(request, env))) return json({ error: "Sessão expirada. Entre de novo." }, 401);
    return handleBlogAdmin(request, env.CONTENT, pathname, json);
  }

  return json({ error: "Não encontrado." }, 404);
}

// "<" escapado para o JSON não conseguir fechar a tag <script>.
const dataScript = (name: string, value: unknown) =>
  `<script>window.${name}=${JSON.stringify(value).replace(/</g, "\\u003c")}</script>`;

type Extras = { scripts: string; head?: { title: string; description: string; html: string }; status: number };

// Dados do blog e metadados de compartilhamento de cada página HTML.
async function pageExtras(env: Env, url: URL): Promise<Extras> {
  const path = url.pathname.replace(/\/+$/, "") || "/";

  if (path === "/") {
    const idx = await publicIndex(env.CONTENT);
    return { scripts: idx.posts.length ? dataScript("__BLOG__", { posts: idx.posts.slice(0, 3), categories: idx.categories }) : "", status: 200 };
  }

  if (path === "/blog" || path.startsWith("/blog/categoria/")) {
    const idx = await publicIndex(env.CONTENT);
    const cat = path.startsWith("/blog/categoria/") ? idx.categories.find((c) => c.slug === path.split("/")[3]) : null;
    const title = cat ? `${cat.name} | Blog ZumTalk` : "Blog ZumTalk | Atendimento e vendas no WhatsApp";
    const description = "Dicas, novidades e estratégias de atendimento, vendas e automação com IA no WhatsApp.";
    return {
      scripts: dataScript("__BLOG__", idx),
      head: { title, description, html: blogHead({ title, description, url: url.origin + path, type: "website" }) },
      status: path !== "/blog" && !cat ? 404 : 200,
    };
  }

  const postMatch = path.match(/^\/blog\/([\w-]+)$/);
  if (postMatch) {
    const found = await publicPost(env.CONTENT, postMatch[1]);
    if (!found) return { scripts: dataScript("__BLOG_POST__", null), status: 404 };
    const { post } = found;
    const title = post.seoTitle || post.title;
    const description = post.seoDescription || post.excerpt || post.title;
    const image = post.cover ? url.origin + post.cover : null;
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description,
      image: image ?? undefined,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      author: { "@type": "Person", name: post.author },
      publisher: { "@type": "Organization", name: "ZumTalk", logo: { "@type": "ImageObject", url: `${url.origin}/logo.svg` } },
      mainEntityOfPage: url.origin + path,
    };
    return {
      scripts: dataScript("__BLOG_POST__", found),
      head: {
        title: `${title} | Blog ZumTalk`,
        description,
        html: blogHead({ title, description, image, url: url.origin + path, type: "article", jsonLd }),
      },
      status: 200,
    };
  }

  return { scripts: "", status: 200 };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // www.zumtalk.com -> zumtalk.com (endereço único para o Google e para os links).
    if (url.hostname.startsWith("www.")) {
      url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname.startsWith("/api/")) return handleApi(request, env, url);
    if (url.pathname.startsWith("/media/")) return serveMedia(env.CONTENT, url.pathname.slice(7));
    if (url.pathname === "/blog/rss.xml") return rss(env.CONTENT, url.origin);
    if (url.pathname === "/sitemap.xml") return sitemap(env.CONTENT, url.origin);

    // Páginas HTML (/, /planos, /blog, /admin): busca o index.html e injeta o conteúdo salvo.
    const res = await env.ASSETS.fetch(request);
    if (!(res.headers.get("content-type") ?? "").includes("text/html")) return res;

    const isAdmin = url.pathname.startsWith("/admin");
    const [saved, extras] = isAdmin ? [null, null] : await Promise.all([env.CONTENT.get(CONTENT_KEY), pageExtras(env, url)]);
    const scripts = (saved ? `<script>window.__SITE_CONTENT__=${saved.replace(/</g, "\\u003c")}</script>` : "") + (extras?.scripts ?? "");
    const head = extras?.head;

    let rewriter = new HTMLRewriter().on("head", {
      element(el) {
        if (scripts) el.append(scripts, { html: true });
        if (head) el.append(head.html, { html: true });
      },
    });
    if (head) {
      rewriter = rewriter
        .on("title", { element: (el) => void el.setInnerContent(head.title) })
        .on('meta[name="description"]', { element: (el) => void el.setAttribute("content", head.description) })
        .on('meta[property^="og:"]', { element: (el) => void el.remove() });
    }
    const out = rewriter.transform(res);

    const headers = new Headers(out.headers);
    headers.set("cache-control", "no-cache");
    if (isAdmin) headers.set("x-robots-tag", "noindex, nofollow");
    return new Response(out.body, { status: extras?.status ?? out.status, headers });
  },
} satisfies ExportedHandler<Env>;
