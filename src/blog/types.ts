// Tipos do blog, compartilhados entre o site, o painel e o Worker.

export type BlogCategory = { id: string; slug: string; name: string };

export type PostStatus = "draft" | "published";

export type PostMeta = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover: string | null; // URL /media/<id>
  categoryIds: string[];
  author: string;
  status: PostStatus;
  publishedAt: string | null; // ISO
  updatedAt: string; // ISO
  readingMinutes: number;
  seoTitle: string;
  seoDescription: string;
};

export type Post = PostMeta & { content: string }; // content = HTML do editor

// Lista pública: só posts publicados, sem o conteúdo.
export type BlogIndex = { posts: PostMeta[]; categories: BlogCategory[] };

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export function readingMinutes(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
