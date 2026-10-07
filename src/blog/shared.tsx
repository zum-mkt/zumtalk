// Peças do blog usadas na landing e nas páginas /blog (sem dependências pesadas).
import type { BlogCategory, BlogIndex, Post, PostMeta } from "./types";

declare global {
  interface Window {
    __BLOG__?: BlogIndex;
    __BLOG_POST__?: { post: Post; recent: PostMeta[]; categories: BlogCategory[] } | null;
  }
}

const TZ = "America/Sao_Paulo";

/** "10 de set." no ano corrente; "31 de mar. de 2025" nos anteriores. */
export function formatDate(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  const year = (x: Date) => new Intl.DateTimeFormat("pt-BR", { year: "numeric", timeZone: TZ }).format(x);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    ...(year(d) === year(new Date()) ? {} : { year: "numeric" }),
    timeZone: TZ,
  }).format(d);
}

export function AuthorAvatar({ name, className = "h-7 w-7 text-[10px]" }: { name: string; className?: string }) {
  const parts = name.trim().split(/\s+/);
  const initials = ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
  return (
    <span aria-hidden="true" className={`grid shrink-0 place-items-center rounded-full bg-ink-900 font-semibold text-white ${className}`}>
      {initials || "ZT"}
    </span>
  );
}

export function PostMetaLine({ post }: { post: PostMeta }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-mist-500">
      <AuthorAvatar name={post.author} />
      <span className="font-medium text-ink-700">{post.author}</span>
      <span aria-hidden="true">·</span>
      <span>{formatDate(post.publishedAt)}</span>
      <span aria-hidden="true">·</span>
      <span>{post.readingMinutes} min de leitura</span>
    </div>
  );
}

/** Card horizontal: imagem à esquerda, texto à direita (no celular, imagem em cima). */
export function PostCard({ post }: { post: PostMeta }) {
  return (
    <a
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-mist-200 bg-white transition-shadow hover:shadow-lg hover:shadow-ink-900/5 sm:flex-row"
    >
      <div className="aspect-[16/10] overflow-hidden bg-brand-50 sm:aspect-auto sm:w-2/5 sm:shrink-0">
        {post.cover ? (
          <img src={post.cover} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="grid h-full min-h-40 place-items-center">
            <img src="/logo-mark.svg" alt="" className="h-12 w-12 opacity-30" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-5 sm:p-6">
        <PostMetaLine post={post} />
        <h2 className="font-heading text-lg font-bold leading-snug text-ink-900 group-hover:text-brand-600 sm:text-xl">{post.title}</h2>
        {post.excerpt && <p className="line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-mist-500">{post.excerpt}</p>}
      </div>
    </a>
  );
}

/** Barra de categorias com sublinhado na ativa, como no blog do Hospital Piedade. */
export function CategoryBar({ categories, active }: { categories: BlogCategory[]; active: string | null }) {
  const item = (on: boolean) =>
    `whitespace-nowrap border-b-2 px-1 pb-2.5 text-sm transition-colors ${
      on ? "border-brand-400 font-semibold text-ink-900" : "border-transparent text-mist-500 hover:text-ink-900"
    }`;
  return (
    <nav aria-label="Categorias do blog" className="flex gap-x-6 overflow-x-auto border-b border-mist-200">
      <a href="/blog" className={item(active === null)} aria-current={active === null ? "page" : undefined}>
        Todos os posts
      </a>
      {categories.map((c) => (
        <a key={c.id} href={`/blog/categoria/${c.slug}`} className={item(active === c.slug)} aria-current={active === c.slug ? "page" : undefined}>
          {c.name}
        </a>
      ))}
    </nav>
  );
}
