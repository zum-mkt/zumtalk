import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  ChevronLeft, ExternalLink, FolderTree, History, LayoutGrid, Loader2, LogIn, LogOut, Menu, Newspaper, RotateCcw, Save, Undo2, X,
} from "lucide-react";
import { BlogCategories, BlogPostForm, BlogPostList, type BlogNav } from "./blog/BlogAdmin";
import { DEFAULT_CONTENT, mergeContent, type SiteContent } from "../content/defaults";
import { api, ApiError } from "./api";
import { cn, Card } from "./fields";
import { SECTIONS } from "./sections";

type Session = "loading" | "out" | "in" | "unconfigured";

export default function AdminApp() {
  const [session, setSession] = useState<Session>("loading");

  useEffect(() => {
    document.title = "Admin | ZumTalk";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    api
      .session()
      .then((s) => setSession(!s.configured ? "unconfigured" : s.authed ? "in" : "out"))
      .catch(() => setSession("out"));
    return () => meta.remove();
  }, []);

  if (session === "loading") return <FullScreenLoader />;
  if (session === "in") return <Panel onLoggedOut={() => setSession("out")} />;
  return <Login unconfigured={session === "unconfigured"} onLoggedIn={() => setSession("in")} />;
}

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50 text-ink-700">
      <Loader2 className="size-7 animate-spin" aria-label="Carregando" />
    </div>
  );
}

function Login({ unconfigured, onLoggedIn }: { unconfigured: boolean; onLoggedIn: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.login(password);
      onLoggedIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-7 text-center">
          <img src="/logo.svg" alt="ZumTalk" className="mx-auto h-10 w-auto" />
          <p className="mt-3 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-600">Painel administrativo</p>
        </div>
        {unconfigured ? (
          <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
            A senha do painel ainda não foi configurada no servidor. Rode <code>npx wrangler secret put ADMIN_PASSWORD</code>.
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-mist-500">
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                autoFocus
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-mist-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              <LogIn className="size-4" />
              {busy ? "Entrando…" : "Entrar"}
            </button>
          </form>
        )}
        <a href="/" className="mt-6 block text-center text-xs font-semibold text-mist-500 hover:text-brand-600">
          ← Voltar ao site
        </a>
      </div>
    </div>
  );
}

const slugFromPath = () => window.location.pathname.replace(/^\/admin\/?/, "").replace(/\/+$/, "");

function Panel({ onLoggedOut }: { onLoggedOut: () => void }) {
  const [saved, setSaved] = useState<SiteContent | null>(null);
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [slug, setSlug] = useState(slugFromPath());
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const dirty = useMemo(() => !!saved && !!draft && JSON.stringify(saved) !== JSON.stringify(draft), [saved, draft]);
  const section = SECTIONS.find((s) => s.slug === slug);
  // Telas do blog: salvam por conta própria (não usam o "Salvar e publicar" do conteúdo).
  const blogView = slug === "blog" || slug.startsWith("blog/") || slug === "blog-categorias";
  const blogDirty = useRef(false);
  const setBlogDirty = useCallback((d: boolean) => {
    blogDirty.current = d;
  }, []);

  // Aviso ao fechar a aba com post ou categorias não salvos.
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (blogDirty.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  const handleError = useCallback(
    (err: unknown) => {
      if (err instanceof ApiError && err.status === 401) return onLoggedOut();
      setToast({ kind: "error", text: err instanceof Error ? err.message : "Algo deu errado." });
    },
    [onLoggedOut],
  );

  useEffect(() => {
    api
      .getContent()
      .then(({ content }) => {
        const c = mergeContent(content);
        setSaved(c);
        setDraft(c);
      })
      .catch(handleError);
  }, [handleError]);

  useEffect(() => {
    const onPop = () => setSlug(slugFromPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(id);
  }, [toast]);

  const save = useCallback(async () => {
    if (!draft || saving) return;
    setSaving(true);
    try {
      await api.saveContent(draft);
      setSaved(draft);
      setToast({ kind: "ok", text: "Salvo e publicado no site." });
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  }, [draft, saving, handleError]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  const go = (next: string, replace = false) => {
    if (!replace && blogDirty.current && !confirm("Há alterações não salvas neste post. Sair mesmo assim?")) return;
    blogDirty.current = false;
    window.history[replace ? "replaceState" : "pushState"](null, "", next ? `/admin/${next}` : "/admin");
    setSlug(next);
    setMobileNav(false);
    window.scrollTo(0, 0);
  };

  async function logout() {
    if (dirty && !confirm("Há alterações não salvas. Sair mesmo assim?")) return;
    await api.logout().catch(() => undefined);
    onLoggedOut();
  }

  async function restorePrevious() {
    if (!confirm("Voltar para a versão salva antes da última? A versão atual vira a “anterior”.")) return;
    try {
      const { content } = await api.restorePrevious();
      const c = mergeContent(content);
      setSaved(c);
      setDraft(c);
      setToast({ kind: "ok", text: "Versão anterior restaurada e publicada." });
    } catch (err) {
      handleError(err);
    }
  }

  async function resetDefaults() {
    if (!confirm("Restaurar todos os textos originais do site? O conteúdo atual fica guardado como versão anterior.")) return;
    try {
      await api.resetContent();
      setSaved(DEFAULT_CONTENT);
      setDraft(DEFAULT_CONTENT);
      setToast({ kind: "ok", text: "Conteúdo original restaurado." });
    } catch (err) {
      handleError(err);
    }
  }

  const blogNav: BlogNav = {
    go,
    notify: (kind, text) => setToast({ kind, text }),
    onError: handleError,
    setDirty: setBlogDirty,
  };

  if (!draft) return <FullScreenLoader />;

  const blogTitle = slug === "blog-categorias" ? "Categorias do blog" : slug === "blog/novo" ? "Novo post" : slug.startsWith("blog/") ? "Editar post" : "Blog";

  const nav = (
    <nav aria-label="Seções do site" className="flex-1 overflow-y-auto px-2.5 py-3">
      <ul className="space-y-0.5">
        {[
          { slug: "", label: "Visão geral", icon: LayoutGrid },
          { slug: "blog", label: "Blog: posts", icon: Newspaper },
          { slug: "blog-categorias", label: "Blog: categorias", icon: FolderTree },
          ...SECTIONS,
        ].map((item, i) => {
          const Icon = item.icon;
          const active =
            item.slug === "blog" ? slug === "blog" || slug.startsWith("blog/") : item.slug === slug || (!item.slug && !section && !blogView);
          return (
            <li key={item.slug}>
              {i === 3 ? <p className={cn("px-3 pb-1 pt-4 text-[10px] font-bold uppercase tracking-widest text-white/40", collapsed && "sr-only")}>Página inicial</p> : null}
              <button
                type="button"
                onClick={() => go(item.slug)}
                title={collapsed ? item.label : undefined}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors",
                  active ? "bg-brand-400 text-ink-950" : "text-white/75 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="size-[18px] shrink-0" />
                {!collapsed ? <span className="truncate">{item.label}</span> : null}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-brand-50 font-body text-ink-700">
      {/* Barra lateral (desktop) */}
      <aside className={cn("sticky top-0 hidden h-screen shrink-0 flex-col bg-ink-950 text-white transition-[width] duration-200 lg:flex", collapsed ? "w-[76px]" : "w-64")}>
        <div className="flex h-16 items-center justify-between gap-2 border-b border-white/10 px-4">
          {collapsed ? <img src="/favicon.svg" alt="ZumTalk" className="h-7 w-auto brightness-0 invert" /> : <img src="/logo-white.svg" alt="ZumTalk" className="h-7 w-auto" />}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            className="rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>
        {nav}
        <div className="border-t border-white/10 p-3">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-white/60 hover:bg-white/10 hover:text-white">
            <ExternalLink className="size-3.5" />
            {!collapsed ? "Ver site público" : null}
          </a>
        </div>
      </aside>

      {/* Menu no celular */}
      {mobileNav ? (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="flex w-72 flex-col bg-ink-950 text-white">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
              <img src="/logo-white.svg" alt="ZumTalk" className="h-7 w-auto" />
              <button type="button" onClick={() => setMobileNav(false)} aria-label="Fechar menu" className="rounded-full p-1.5 hover:bg-white/10">
                <X className="size-5" />
              </button>
            </div>
            {nav}
          </div>
          <button type="button" aria-label="Fechar menu" className="flex-1 bg-black/40" onClick={() => setMobileNav(false)} />
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-mist-200 bg-white px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <button type="button" onClick={() => setMobileNav(true)} aria-label="Abrir menu" className="rounded-lg p-2 text-ink-700 hover:bg-brand-50 lg:hidden">
              <Menu className="size-5" />
            </button>
            <h1 className="truncate font-heading text-lg font-extrabold text-ink-900">{blogView ? blogTitle : section?.label ?? "Visão geral"}</h1>
          </div>
          <div className="flex items-center gap-2">
            {blogView ? null : dirty ? (
              <>
                <span className="hidden text-xs font-semibold text-amber-700 md:inline">Alterações não salvas</span>
                <button
                  type="button"
                  onClick={() => saved && setDraft(saved)}
                  className="hidden items-center gap-1.5 rounded-full border border-mist-200 px-3 py-1.5 text-xs font-bold text-ink-700 hover:bg-brand-50 sm:inline-flex"
                >
                  <Undo2 className="size-3.5" /> Descartar
                </button>
              </>
            ) : null}
            <button
              type="button"
              onClick={() => void save()}
              hidden={blogView}
              disabled={!dirty || saving}
              title="Ctrl+S"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-mist-200 disabled:text-mist-500"
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              {saving ? "Salvando…" : dirty ? "Salvar e publicar" : "Tudo salvo"}
            </button>
            <a href="/" target="_blank" rel="noreferrer" className="hidden items-center gap-1.5 rounded-full border border-mist-200 px-3 py-2 text-xs font-bold text-brand-600 hover:bg-brand-50 md:inline-flex">
              <ExternalLink className="size-3.5" /> Ver site
            </a>
            <button type="button" onClick={() => void logout()} aria-label="Sair" title="Sair" className="rounded-full p-2 text-mist-500 hover:bg-red-50 hover:text-red-600">
              <LogOut className="size-4" />
            </button>
          </div>
        </header>

        <main className={cn("mx-auto w-full flex-1 space-y-5 p-4 sm:p-6", slug.startsWith("blog/") ? "max-w-4xl" : "max-w-3xl")}>
          {slug === "blog" ? (
            <BlogPostList nav={blogNav} />
          ) : slug === "blog-categorias" ? (
            <BlogCategories nav={blogNav} />
          ) : slug.startsWith("blog/") ? (
            <BlogPostForm key={slug} id={slug === "blog/novo" ? null : slug.slice(5)} nav={blogNav} />
          ) : section ? (
            section.render(draft, (patch) => setDraft((d) => (d ? { ...d, ...patch } : d)))
          ) : (
            <Overview onGo={go} onRestorePrevious={restorePrevious} onReset={resetDefaults} />
          )}
        </main>
      </div>

      {toast ? (
        <div
          role="status"
          className={cn(
            "fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-lg",
            toast.kind === "ok" ? "bg-ink-900 text-white" : "bg-red-600 text-white",
          )}
        >
          {toast.text}
        </div>
      ) : null}
    </div>
  );
}

function Overview({ onGo, onRestorePrevious, onReset }: { onGo: (slug: string) => void; onRestorePrevious: () => void; onReset: () => void }) {
  return (
    <>
      <Card title="Conteúdo do site" description="Escolha uma seção para editar. Nada muda no site até você clicar em “Salvar e publicar”.">
        <div className="grid gap-3 sm:grid-cols-2">
          {SECTIONS.map(({ slug, label, icon: Icon }) => (
            <button
              key={slug}
              type="button"
              onClick={() => onGo(slug)}
              className="flex items-center gap-3 rounded-xl border border-mist-200 p-4 text-left transition hover:border-brand-500 hover:bg-brand-50"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="size-5" />
              </span>
              <span className="font-bold text-ink-900">{label}</span>
            </button>
          ))}
        </div>
      </Card>
      <Card title="Histórico" description="O painel guarda a versão salva antes da última, para você poder voltar atrás.">
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={onRestorePrevious} className="inline-flex items-center gap-2 rounded-full border border-mist-200 px-4 py-2 text-sm font-bold text-ink-700 hover:bg-brand-50">
            <History className="size-4" /> Voltar à versão anterior
          </button>
          <button type="button" onClick={onReset} className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50">
            <RotateCcw className="size-4" /> Restaurar textos originais
          </button>
        </div>
      </Card>
    </>
  );
}
