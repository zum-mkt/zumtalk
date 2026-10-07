import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, ImagePlus, Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { slugify, type BlogCategory, type Post, type PostMeta } from "../../blog/types";
import { formatDate } from "../../blog/shared";
import { ApiError } from "../api";
import { Card, cn, Grid, TextArea, TextField } from "../fields";
import { uploadImage } from "./upload";

const BlogEditor = lazy(() => import("./BlogEditor"));

export type BlogNav = {
  go: (slug: string, replace?: boolean) => void;
  notify: (kind: "ok" | "error", text: string) => void;
  onError: (err: unknown) => void;
  setDirty: (dirty: boolean) => void;
};

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, { credentials: "same-origin", ...init });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new ApiError(data.error ?? `Erro ${res.status}`, res.status);
  return data;
}
const send = (method: string, body: unknown): RequestInit => ({ method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

const blogApi = {
  index: () => call<{ posts: PostMeta[]; categories: BlogCategory[] }>("/api/admin/blog"),
  get: (id: string) => call<{ post: Post }>(`/api/admin/blog/posts/${id}`),
  save: (post: Partial<Post>) => call<{ post: Post }>("/api/admin/blog/posts", send("PUT", post)),
  remove: (id: string) => call<{ ok: true }>(`/api/admin/blog/posts/${id}`, { method: "DELETE" }),
  saveCategories: (categories: BlogCategory[]) => call<{ categories: BlogCategory[] }>("/api/admin/blog/categories", send("PUT", { categories })),
};

const isLive = (p: PostMeta) => p.status === "published" && !!p.publishedAt && Date.parse(p.publishedAt) <= Date.now();

function StatusPill({ post }: { post: PostMeta }) {
  const scheduled = post.status === "published" && !isLive(post);
  const [label, cls] = isLive(post)
    ? ["Publicado", "bg-emerald-50 text-emerald-700"]
    : scheduled
      ? ["Agendado", "bg-amber-50 text-amber-700"]
      : ["Rascunho", "bg-mist-100 text-mist-500"];
  return <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-bold ${cls}`}>{label}</span>;
}

// ---------- Lista de posts ----------

export function BlogPostList({ nav }: { nav: BlogNav }) {
  const [data, setData] = useState<{ posts: PostMeta[]; categories: BlogCategory[] } | null>(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const { onError, notify } = nav;

  const load = useCallback(() => blogApi.index().then(setData).catch(onError), [onError]);
  useEffect(() => void load(), [load]);

  const posts = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data?.posts ?? []).filter(
      (p) => (filter === "all" || p.status === filter) && (!term || `${p.title} ${p.excerpt}`.toLowerCase().includes(term)),
    );
  }, [data, q, filter]);

  async function remove(p: PostMeta) {
    if (!confirm(`Excluir o post “${p.title}”? Isso não pode ser desfeito.`)) return;
    try {
      await blogApi.remove(p.id);
      notify("ok", "Post excluído.");
      void load();
    } catch (err) {
      onError(err);
    }
  }

  const catName = (id: string) => data?.categories.find((c) => c.id === id)?.name;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5 rounded-full bg-white p-1 shadow-sm ring-1 ring-mist-200">
          {(
            [
              ["all", "Todos"],
              ["published", "Publicados"],
              ["draft", "Rascunhos"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              className={cn("rounded-full px-3.5 py-1.5 text-sm font-bold", filter === k ? "bg-ink-900 text-white" : "text-ink-700 hover:bg-brand-50")}
            >
              {label}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => nav.go("blog/novo")} className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700">
          <Plus className="size-4" /> Novo post
        </button>
      </div>

      <label className="relative block">
        <span className="sr-only">Buscar posts</span>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-mist-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por título ou resumo"
          className="w-full rounded-xl border border-mist-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
      </label>

      <section className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-sm">
        {!data ? (
          <div className="grid h-40 place-items-center"><Loader2 className="size-6 animate-spin text-mist-500" /></div>
        ) : posts.length === 0 ? (
          <p className="py-14 text-center text-sm text-mist-500">
            {data.posts.length ? "Nenhum post encontrado." : "Nenhum post ainda. Clique em “Novo post” para começar."}
          </p>
        ) : (
          <ul className="divide-y divide-mist-100">
            {posts.map((p) => (
              <li key={p.id} className="flex items-center gap-4 px-4 py-3 sm:px-5">
                <div className="hidden h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-brand-50 sm:block">
                  {p.cover ? <img src={p.cover} alt="" className="h-full w-full object-cover" /> : null}
                </div>
                <button type="button" onClick={() => nav.go(`blog/${p.id}`)} className="min-w-0 flex-1 text-left">
                  <p className="truncate font-bold text-ink-900 hover:text-brand-600">{p.title}</p>
                  <p className="mt-0.5 truncate text-xs text-mist-500">
                    {[p.publishedAt ? formatDate(p.publishedAt) : `Editado em ${formatDate(p.updatedAt)}`, ...p.categoryIds.map(catName).filter(Boolean)].join(" · ")}
                  </p>
                </button>
                <StatusPill post={p} />
                <div className="flex shrink-0 items-center">
                  {isLive(p) && (
                    <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" aria-label="Ver no site" className="rounded-lg p-2 text-mist-500 hover:bg-brand-50 hover:text-brand-600">
                      <ExternalLink className="size-4" />
                    </a>
                  )}
                  <button type="button" onClick={() => nav.go(`blog/${p.id}`)} aria-label="Editar" className="rounded-lg p-2 text-brand-600 hover:bg-brand-50">
                    <Pencil className="size-4" />
                  </button>
                  <button type="button" onClick={() => void remove(p)} aria-label="Excluir" className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

// ---------- Formulário do post ----------

const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const emptyPost = (): Partial<Post> => ({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover: null,
  categoryIds: [],
  author: "Equipe ZumTalk",
  status: "draft",
  publishedAt: null,
  seoTitle: "",
  seoDescription: "",
});

function CoverField({ value, onChange, onError }: { value: string | null; onChange: (v: string | null) => void; onError: (msg: string) => void }) {
  const [busy, setBusy] = useState(false);
  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadImage(file));
    } catch (err) {
      onError(err instanceof Error ? err.message : "Falha no envio.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-mist-500">Imagem de capa</p>
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-mist-200">
          <img src={value} alt="" className="aspect-[16/9] w-full object-cover" />
          <button type="button" onClick={() => onChange(null)} className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-red-600 shadow hover:bg-white">
            <X className="size-3.5" /> Remover
          </button>
        </div>
      ) : (
        <label className="flex aspect-[16/7] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-mist-200 bg-brand-50/40 text-sm font-semibold text-mist-500 hover:border-brand-500 hover:text-brand-600">
          {busy ? <Loader2 className="size-6 animate-spin" /> : <ImagePlus className="size-6" />}
          {busy ? "Enviando…" : "Clique para enviar (proporção 16:9 fica melhor)"}
          <input type="file" accept="image/*" hidden onChange={(e) => void pick(e.target.files?.[0])} />
        </label>
      )}
    </div>
  );
}

export function BlogPostForm({ id, nav }: { id: string | null; nav: BlogNav }) {
  const [post, setPost] = useState<Partial<Post> | null>(id ? null : emptyPost());
  const [savedJson, setSavedJson] = useState(() => (id ? "" : JSON.stringify(emptyPost())));
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [slugTouched, setSlugTouched] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const { onError, notify, setDirty } = nav;

  useEffect(() => {
    blogApi.index().then((d) => setCategories(d.categories)).catch(onError);
    if (!id) return;
    blogApi
      .get(id)
      .then(({ post: p }) => {
        setPost(p);
        setSavedJson(JSON.stringify(p));
      })
      .catch(onError);
  }, [id, onError]);

  const dirty = !!post && JSON.stringify(post) !== savedJson;
  useEffect(() => setDirty(dirty), [dirty, setDirty]);
  useEffect(() => () => setDirty(false), [setDirty]);

  if (!post) return <div className="grid h-60 place-items-center"><Loader2 className="size-6 animate-spin text-mist-500" /></div>;

  const set = (patch: Partial<Post>) => setPost((p) => ({ ...p, ...patch }));
  const live = post.status === "published";

  async function save(status: "draft" | "published") {
    if (!post?.title?.trim()) return notify("error", "Dê um título ao post antes de salvar.");
    setSaving(true);
    try {
      const { post: saved } = await blogApi.save({ ...post, status });
      setPost(saved);
      setSavedJson(JSON.stringify(saved));
      setSlugTouched(true);
      notify("ok", status === "published" ? "Post publicado." : "Rascunho salvo.");
      if (!id) nav.go(`blog/${saved.id}`, true);
    } catch (err) {
      onError(err);
    } finally {
      setSaving(false);
    }
  }

  const seoTitle = post.seoTitle || post.title || "";
  const seoDesc = post.seoDescription || post.excerpt || "";

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => nav.go("blog")} className="text-sm font-semibold text-mist-500 hover:text-brand-600">
          ← Todos os posts
        </button>
        <div className="flex flex-wrap items-center gap-2">
          {dirty ? <span className="text-xs font-semibold text-amber-700">Alterações não salvas</span> : null}
          {live && post.slug ? (
            <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-mist-200 px-3 py-2 text-xs font-bold text-brand-600 hover:bg-brand-50">
              <ExternalLink className="size-3.5" /> Ver no site
            </a>
          ) : null}
          <button type="button" disabled={saving} onClick={() => void save("draft")} className="rounded-full border border-mist-200 bg-white px-4 py-2 text-sm font-bold text-ink-700 hover:bg-brand-50 disabled:opacity-50">
            {live ? "Voltar para rascunho" : "Salvar rascunho"}
          </button>
          <button type="button" disabled={saving} onClick={() => void save("published")} className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-50">
            {saving ? <Loader2 className="size-4 animate-spin" /> : null}
            {live ? "Atualizar publicação" : "Publicar"}
          </button>
        </div>
      </div>

      <Card>
        <TextField
          label="Título"
          value={post.title ?? ""}
          onChange={(title) => set(slugTouched ? { title } : { title, slug: slugify(title) })}
        />
        <TextField
          label="Endereço (slug)"
          value={post.slug ?? ""}
          onChange={(slug) => {
            setSlugTouched(true);
            set({ slug: slugify(slug) });
          }}
          hint={`O post fica em /blog/${post.slug || "…"}${live ? ". Mudar o endereço de um post publicado quebra links já compartilhados." : ""}`}
        />
        <TextArea label="Resumo" value={post.excerpt ?? ""} onChange={(excerpt) => set({ excerpt })} rows={2} hint="Aparece na lista do blog e no compartilhamento." />
        <CoverField value={post.cover ?? null} onChange={(cover) => set({ cover })} onError={(m) => notify("error", m)} />
      </Card>

      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-white" />}>
        <BlogEditor value={post.content ?? ""} onChange={(content) => set({ content })} onError={(m) => notify("error", m)} />
      </Suspense>

      <Card title="Publicação">
        <Grid>
          <TextField label="Autor" value={post.author ?? ""} onChange={(author) => set({ author })} />
          <TextField
            label="Data de publicação"
            type="datetime-local"
            value={toLocalInput(post.publishedAt ?? null)}
            onChange={(v) => set({ publishedAt: v ? new Date(v).toISOString() : null })}
            hint="Vazio = agora, ao publicar. Data futura = agendado."
          />
        </Grid>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-mist-500">Categorias</p>
          {categories.length === 0 ? (
            <p className="text-sm text-mist-500">
              Nenhuma categoria ainda.{" "}
              <button type="button" onClick={() => nav.go("blog-categorias")} className="font-semibold text-brand-600 underline">
                Criar categorias
              </button>
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => {
                const on = post.categoryIds?.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => set({ categoryIds: on ? post.categoryIds!.filter((x) => x !== c.id) : [...(post.categoryIds ?? []), c.id] })}
                    className={cn("rounded-full px-3.5 py-1.5 text-sm font-bold", on ? "bg-ink-900 text-white" : "border border-mist-200 text-ink-700 hover:border-brand-500")}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      <Card title="SEO e compartilhamento" description="Opcional. Se ficar vazio, usamos o título e o resumo.">
        <TextField label={`Título para o Google (${seoTitle.length}/60)`} value={post.seoTitle ?? ""} onChange={(seoTitle) => set({ seoTitle })} placeholder={post.title} />
        <TextArea label={`Descrição para o Google (${seoDesc.length}/160)`} value={post.seoDescription ?? ""} onChange={(seoDescription) => set({ seoDescription })} rows={2} />
        <div className="rounded-xl border border-mist-200 p-4">
          <p className="text-xs text-mist-500">Prévia no Google</p>
          <p className="mt-1 truncate text-lg text-[#1a0dab]">{seoTitle || "Título do post"} | Blog ZumTalk</p>
          <p className="truncate text-xs text-emerald-700">zumtalk.com/blog/{post.slug || "…"}</p>
          <p className="mt-1 line-clamp-2 text-sm text-ink-700">{seoDesc || "Descrição do post."}</p>
        </div>
      </Card>
    </>
  );
}

// ---------- Categorias ----------

export function BlogCategories({ nav }: { nav: BlogNav }) {
  const [list, setList] = useState<BlogCategory[] | null>(null);
  const [saved, setSaved] = useState("");
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const { onError, notify, setDirty } = nav;

  useEffect(() => {
    blogApi
      .index()
      .then((d) => {
        setList(d.categories);
        setSaved(JSON.stringify(d.categories));
      })
      .catch(onError);
  }, [onError]);

  const dirty = !!list && JSON.stringify(list) !== saved;
  useEffect(() => setDirty(dirty), [dirty, setDirty]);
  useEffect(() => () => setDirty(false), [setDirty]);

  if (!list) return <div className="grid h-40 place-items-center"><Loader2 className="size-6 animate-spin text-mist-500" /></div>;

  const add = () => {
    const name = draft.trim();
    if (!name) return;
    setList([...list, { id: "", slug: slugify(name), name }]);
    setDraft("");
  };
  const move = (i: number, d: -1 | 1) => {
    const next = [...list];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setList(next);
  };

  async function save() {
    setSaving(true);
    try {
      const { categories } = await blogApi.saveCategories(list!);
      setList(categories);
      setSaved(JSON.stringify(categories));
      notify("ok", "Categorias salvas.");
    } catch (err) {
      onError(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card title="Categorias do blog" description="Aparecem na barra do topo do blog, nesta ordem. Excluir uma categoria não apaga os posts.">
      <ul className="space-y-2">
        {list.map((c, i) => (
          <li key={c.id || `new-${i}`} className="flex items-center gap-2 rounded-xl border border-mist-200 bg-brand-50/40 px-3 py-2">
            <input
              value={c.name}
              aria-label="Nome da categoria"
              onChange={(e) => setList(list.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
              className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-sm font-semibold text-ink-900 outline-none focus:border-brand-500 focus:bg-white"
            />
            <span className="hidden text-xs text-mist-500 sm:inline">/blog/categoria/{c.slug || slugify(c.name)}</span>
            <button type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Mover para cima" className="rounded-lg p-1.5 text-mist-500 hover:bg-white disabled:opacity-30"><ArrowUp className="size-4" /></button>
            <button type="button" disabled={i === list.length - 1} onClick={() => move(i, 1)} aria-label="Mover para baixo" className="rounded-lg p-1.5 text-mist-500 hover:bg-white disabled:opacity-30"><ArrowDown className="size-4" /></button>
            <button type="button" onClick={() => setList(list.filter((_, j) => j !== i))} aria-label="Excluir" className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"><Trash2 className="size-4" /></button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="Nova categoria, ex.: Automação"
          className="min-w-0 flex-1 rounded-lg border border-mist-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
        <button type="button" onClick={add} className="inline-flex items-center gap-1.5 rounded-full border border-brand-600 px-4 text-sm font-bold text-brand-600 hover:bg-brand-50">
          <Plus className="size-4" /> Adicionar
        </button>
      </div>
      <div className="flex justify-end">
        <button type="button" disabled={!dirty || saving} onClick={() => void save()} className="rounded-full bg-brand-600 px-5 py-2 text-sm font-bold text-white hover:bg-brand-700 disabled:bg-mist-200 disabled:text-mist-500">
          {saving ? "Salvando…" : dirty ? "Salvar categorias" : "Tudo salvo"}
        </button>
      </div>
    </Card>
  );
}
