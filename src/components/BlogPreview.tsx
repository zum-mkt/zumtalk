import { Highlight, useContent } from "../content/ContentContext";
import { formatDate } from "../blog/shared";
import { Container, SectionTitle } from "./ui";

// Últimos posts do blog na landing. Só aparece quando há post publicado.
export default function BlogPreview() {
  const { blog } = useContent();
  const posts = window.__BLOG__?.posts.slice(0, 3) ?? [];
  if (!blog.show || posts.length === 0) return null;

  return (
    <section id="blog" className="bg-white py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle eyebrow={blog.eyebrow} title={<Highlight text={blog.title} className="text-brand-600" />} lead={blog.lead} />
          <a href="/blog" className="btn btn-ghost-light shrink-0 !py-2.5 !text-sm">{blog.ctaLabel}</a>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <a key={p.id} href={`/blog/${p.slug}`} className="group flex flex-col overflow-hidden rounded-xl border border-mist-200 bg-white transition-shadow hover:shadow-lg hover:shadow-ink-900/5">
              <div className="aspect-[16/10] overflow-hidden bg-brand-50">
                {p.cover ? (
                  <img src={p.cover} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <div className="grid h-full place-items-center">
                    <img src="/logo-mark.svg" alt="" className="h-12 w-12 opacity-30" />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs text-mist-500">
                  {formatDate(p.publishedAt)} · {p.readingMinutes} min de leitura
                </p>
                <h3 className="mt-2 font-heading text-lg font-bold leading-snug text-ink-900 group-hover:text-brand-600">{p.title}</h3>
                {p.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mist-500">{p.excerpt}</p>}
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
