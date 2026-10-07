import { useEffect, useRef, useState, type ReactNode } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";
import {
  AlignCenter, AlignLeft, AlignRight, Bold, Eraser, Heading2, Heading3, ImagePlus, Italic, Link as LinkIcon, List,
  ListOrdered, Loader2, Minus, Pilcrow, Quote, Redo, Strikethrough, TvMinimalPlay as YoutubeIcon, Underline, Undo,
} from "lucide-react";
import { cn } from "../fields";
import { uploadImage } from "./upload";

function ToolButton({ label, active, disabled, onClick, children }: { label: string; active?: boolean; disabled?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "grid size-8 place-items-center rounded-md text-ink-700 transition-colors hover:bg-brand-50 disabled:opacity-30",
        active && "bg-brand-100 text-brand-700",
      )}
    >
      {children}
    </button>
  );
}

const Sep = () => <span className="mx-1 h-5 w-px bg-mist-200" aria-hidden="true" />;

function Toolbar({ editor, onError }: { editor: Editor; onError: (msg: string) => void }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      p: e.isActive("paragraph"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      ul: e.isActive("bulletList"),
      ol: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      link: e.isActive("link"),
      left: e.isActive({ textAlign: "left" }),
      center: e.isActive({ textAlign: "center" }),
      right: e.isActive({ textAlign: "right" }),
      undo: e.can().undo(),
      redo: e.can().redo(),
    }),
  });
  const c = () => editor.chain().focus();

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Endereço do link (deixe vazio para remover):", prev ?? "https://");
    if (url === null) return;
    if (!url.trim()) return void c().extendMarkRange("link").unsetLink().run();
    c().extendMarkRange("link").setLink({ href: url.trim(), target: /^https?:\/\//.test(url) ? "_blank" : null }).run();
  };

  const addVideo = () => {
    const url = window.prompt("Link do vídeo do YouTube:");
    if (url?.trim()) c().setYoutubeVideo({ src: url.trim() }).run();
  };

  const onImage = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const src = await uploadImage(file);
      c().setImage({ src, alt: "" }).run();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Falha no envio da imagem.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  return (
    <div className="sticky top-16 z-10 flex flex-wrap items-center gap-0.5 rounded-t-xl border-b border-mist-200 bg-white/95 px-2 py-1.5 backdrop-blur">
      <ToolButton label="Parágrafo" active={s.p} onClick={() => c().setParagraph().run()}><Pilcrow className="size-4" /></ToolButton>
      <ToolButton label="Título" active={s.h2} onClick={() => c().toggleHeading({ level: 2 }).run()}><Heading2 className="size-4" /></ToolButton>
      <ToolButton label="Subtítulo" active={s.h3} onClick={() => c().toggleHeading({ level: 3 }).run()}><Heading3 className="size-4" /></ToolButton>
      <Sep />
      <ToolButton label="Negrito" active={s.bold} onClick={() => c().toggleBold().run()}><Bold className="size-4" /></ToolButton>
      <ToolButton label="Itálico" active={s.italic} onClick={() => c().toggleItalic().run()}><Italic className="size-4" /></ToolButton>
      <ToolButton label="Sublinhado" active={s.underline} onClick={() => c().toggleUnderline().run()}><Underline className="size-4" /></ToolButton>
      <ToolButton label="Tachado" active={s.strike} onClick={() => c().toggleStrike().run()}><Strikethrough className="size-4" /></ToolButton>
      <ToolButton label="Link" active={s.link} onClick={setLink}><LinkIcon className="size-4" /></ToolButton>
      <Sep />
      <ToolButton label="Lista" active={s.ul} onClick={() => c().toggleBulletList().run()}><List className="size-4" /></ToolButton>
      <ToolButton label="Lista numerada" active={s.ol} onClick={() => c().toggleOrderedList().run()}><ListOrdered className="size-4" /></ToolButton>
      <ToolButton label="Citação" active={s.quote} onClick={() => c().toggleBlockquote().run()}><Quote className="size-4" /></ToolButton>
      <ToolButton label="Linha divisória" onClick={() => c().setHorizontalRule().run()}><Minus className="size-4" /></ToolButton>
      <Sep />
      <ToolButton label="Alinhar à esquerda" active={s.left} onClick={() => c().setTextAlign("left").run()}><AlignLeft className="size-4" /></ToolButton>
      <ToolButton label="Centralizar" active={s.center} onClick={() => c().setTextAlign("center").run()}><AlignCenter className="size-4" /></ToolButton>
      <ToolButton label="Alinhar à direita" active={s.right} onClick={() => c().setTextAlign("right").run()}><AlignRight className="size-4" /></ToolButton>
      <Sep />
      <ToolButton label="Inserir imagem" disabled={uploading} onClick={() => fileInput.current?.click()}>
        {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
      </ToolButton>
      <ToolButton label="Inserir vídeo do YouTube" onClick={addVideo}><YoutubeIcon className="size-4" /></ToolButton>
      <ToolButton label="Limpar formatação" onClick={() => c().unsetAllMarks().clearNodes().run()}><Eraser className="size-4" /></ToolButton>
      <Sep />
      <ToolButton label="Desfazer" disabled={!s.undo} onClick={() => c().undo().run()}><Undo className="size-4" /></ToolButton>
      <ToolButton label="Refazer" disabled={!s.redo} onClick={() => c().redo().run()}><Redo className="size-4" /></ToolButton>
      <input ref={fileInput} type="file" accept="image/*" hidden onChange={(e) => void onImage(e.target.files?.[0])} />
    </div>
  );
}

export default function BlogEditor({ value, onChange, onError }: { value: string; onChange: (html: string) => void; onError: (msg: string) => void }) {
  const last = useRef(value);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer" } },
      }),
      Image,
      Placeholder.configure({ placeholder: "Escreva o artigo aqui…" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Youtube.configure({ nocookie: true }),
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => {
      last.current = e.isEmpty ? "" : e.getHTML();
      onChange(last.current);
    },
    editorProps: { attributes: { class: "prose-blog min-h-[420px] px-5 py-5 focus:outline-none sm:px-7" } },
  });

  // Conteúdo trocado de fora (ex.: ao abrir outro post).
  useEffect(() => {
    if (!editor || value === last.current) return;
    last.current = value;
    editor.commands.setContent(value || "", { emitUpdate: false });
  }, [editor, value]);

  if (!editor) return <div className="h-96 animate-pulse rounded-xl bg-brand-50" />;
  return (
    <div className="rounded-xl border border-mist-200 bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
      <Toolbar editor={editor} onError={onError} />
      <EditorContent editor={editor} />
    </div>
  );
}
