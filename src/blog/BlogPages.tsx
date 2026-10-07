import { useEffect, useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { Check, Link2, Search } from "lucide-react";
import { Container, WhatsIcon } from "../components/ui";
import { AuthorAvatar, CategoryBar, formatDate, PostCard } from "./shared";
import type { BlogIndex, PostMeta } from "./types";

const PER_PAGE = 10;
const EMPTY: BlogIndex = { posts: [], categories: [] };

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// Os dados vêm injetados pelo Worker; no `vite dev` (sem Worker) busca na API, se houver.
function useBlogIndex() {
  const [idx, setIdx] = useState<BlogIndex | null>(window.__BLOG__ ?? null);
  useEffect(() => {
    if (idx) return;
    fetch("/api/blog")
      .then((r) => (r.ok ? r.json() : EMPTY))
      .then(setIdx)
      .catch(() => setIdx(EMPTY));
  }, [idx]);
  return idx;
}

export function BlogListPage({ categorySlug }: { categorySlug: string | null }) {
  const idx = useBlogIndex();
  const [q, setQ] = useState(() => new URLSearchParams(window.location.search).get("q") ?? "");
  const [page, setPage] = useState(1);

  // Guarda a busca na URL para o link poder ser compartilhado.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (q) url.searchParams.set("q", q);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
    setPage(1);
  }, [q]);

  const category = idx?.categories.find((c) => c.slug === categorySlug) ?? null;
  const posts = useMemo(() => {
    if (!idx) return [];
    const term = norm(q.trim());
    return idx.posts.filter(
      (p) => (!category || p.categoryIds.includes(category.id)) && (!term || norm(`${p.title} ${p.excerpt}`).includes(term)),
    );
  }, [idx, q, category]);

  useEffect(() => {
    document.title = category ? `${category.name} | Blog ZumTalk` : "Blog ZumTalk | Atendimento e vendas no WhatsApp";
  }, [category]);

  return (
    <Container className="max-w-5xl pb-20 pt-28 sm:pt-32">
      <p className="eyebrow text-brand-600">{"// "}Blog ZumTalk</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
        {category ? category.name : "Atendimento, vendas e automação no WhatsApp"}
      </h1>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1">
          <CategoryBar categories={idx?.categories ?? []} active={categorySlug} />
        </div>
        <label className="relative block w-full lg:max-w-xs">
          <span className="sr-only">Buscar no blog</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mist-500" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar"
            className="w-full rounded-full border border-mist-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </label>
      </div>

      <div className="mt-8 space-y-5">
        {!idx ? (
          <div className="h-48 animate-pulse rounded-xl bg-brand-50" />
        ) : posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-mist-200 p-12 text-center text-sm text-mist-500">
            {categorySlug && !category ? "Categoria não encontrada." : q ? "Nenhum post encontrado para essa busca." : "Ainda não há posts publicados por aqui."}
          </div>
        ) : (
          posts.slice(0, page * PER_PAGE).map((p) => <PostCard key={p.id} post={p} />)
        )}
      </div>

      {posts.length > page * PER_PAGE && (
        <div className="mt-8 text-center">
          <button type="button" onClick={() => setPage((n) => n + 1)} className="btn btn-ghost-light !py-2.5 !text-sm">
            Carregar mais
          </button>
        </div>
      )}
    </Container>
  );
}

const Facebook = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.25-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3Z" />
  </svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M6.9 8.6H3.8V20h3.1V8.6ZM5.35 3.5a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6ZM20.2 13.3c0-3-1.6-4.9-4.3-4.9-1.5 0-2.4.8-2.8 1.4V8.6H10V20h3.1v-5.9c0-1.6.6-2.8 2.1-2.8 1.4 0 1.9 1.1 1.9 2.8V20h3.1v-6.7Z" />
  </svg>
);

function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = window.location.href.split("?")[0];
  const enc = encodeURIComponent(url);
  const btn = "grid h-10 w-10 place-items-center rounded-full border border-mist-200 text-mist-500 transition-colors hover:border-brand-600 hover:text-brand-600";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 text-sm font-semibold text-ink-700">Compartilhe:</span>
      <a className={btn} href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`} target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no WhatsApp">
        <WhatsIcon className="h-4 w-4" />
      </a>
      <a className={btn} href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc}`} target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no LinkedIn">
        <Linkedin className="size-4" />
      </a>
      <a className={btn} href={`https://www.facebook.com/sharer/sharer.php?u=${enc}`} target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no Facebook">
        <Facebook className="size-4" />
      </a>
      <button
        type="button"
        className={btn}
        aria-label="Copiar link"
        onClick={() =>
          navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          })
        }
      >
        {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
      </button>
    </div>
  );
}

// Iframes só do YouTube (vídeos inseridos pelo editor).
DOMPurify.addHook("uponSanitizeElement", (node, data) => {
  if (data.tagName === "iframe") {
    const src = (node as Element).getAttribute("src") ?? "";
    if (!/^https:\/\/www\.youtube(-nocookie)?\.com\/embed\//.test(src)) node.parentNode?.removeChild(node);
  }
});
export const sanitize = (html: string) =>
  DOMPurify.sanitize(html, { ADD_TAGS: ["iframe"], ADD_ATTR: ["allowfullscreen", "frameborder", "target"] });

export function BlogPostPage({ slug }: { slug: string }) {
  const [data, setData] = useState(window.__BLOG_POST__);
  useEffect(() => {
    if (data !== undefined) return;
    fetch(`/api/blog/posts/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => setData(null));
  }, [data, slug]);

  const post = data?.post;
  useEffect(() => {
    if (post) document.title = `${post.seoTitle || post.title} | Blog ZumTalk`;
  }, [post]);

  if (data === undefined) return <Container className="max-w-3xl pb-20 pt-32"><div className="h-64 animate-pulse rounded-xl bg-brand-50" /></Container>;

  if (!data || !post) {
    return (
      <Container className="max-w-2xl pb-24 pt-36 text-center">
        <h1 className="text-2xl font-extrabold text-ink-900">Artigo não encontrado</h1>
        <p className="mt-2 text-mist-500">Este conteúdo não existe ou foi removido.</p>
        <a href="/blog" className="btn btn-primary-light mt-8">Voltar para o blog</a>
      </Container>
    );
  }

  const cats = data.categories.filter((c) => post.categoryIds.includes(c.id));
  const updated = formatDate(post.updatedAt);
  const published = formatDate(post.publishedAt);

  return (
    <Container className="max-w-3xl pb-20 pt-28 sm:pt-32">
      <CategoryBar categories={data.categories} active={cats[0]?.slug ?? null} />

      <article className="mt-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-mist-500">
          <AuthorAvatar name={post.author} className="h-8 w-8 text-[11px]" />
          <span className="font-medium text-ink-700">{post.author}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.publishedAt ?? undefined}>{published}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingMinutes} min de leitura</span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2.6rem]">{post.title}</h1>
        {updated && updated !== published && <p className="mt-2 text-sm text-mist-500">Atualizado em {updated}</p>}

        {cats.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {cats.map((c) => (
              <a key={c.id} href={`/blog/categoria/${c.slug}`} className="rounded-full border border-mist-200 px-3 py-1 text-xs font-semibold text-ink-700 hover:border-brand-600 hover:text-brand-600">
                {c.name}
              </a>
            ))}
          </div>
        )}

        {post.cover && <img src={post.cover} alt="" className="mt-8 aspect-[16/9] w-full rounded-xl object-cover" />}

        <div className="prose-blog mt-8" dangerouslySetInnerHTML={{ __html: sanitize(post.content) }} />

        <div className="mt-12 border-t border-mist-200 pt-6">
          <ShareButtons title={post.title} />
        </div>
      </article>

      <RecentPosts posts={data.recent} />
    </Container>
  );
}

function RecentPosts({ posts }: { posts: PostMeta[] }) {
  if (!posts.length) return null;
  return (
    <section className="mt-16 border-t border-mist-200 pt-10">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-extrabold text-ink-900">Leia também</h2>
        <a href="/blog" className="text-sm font-semibold text-brand-600 hover:text-brand-700">Ver tudo →</a>
      </div>
      <div className="mt-6 space-y-5">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </section>
  );
}
