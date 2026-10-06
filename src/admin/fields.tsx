import { useId, useState, type ReactNode } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, ChevronDown, Plus, Trash2, X } from "lucide-react";

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export function Card({ title, description, children }: { title?: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-mist-200 bg-white p-5 shadow-sm sm:p-6">
      {title ? <h2 className="text-sm font-extrabold uppercase tracking-wide text-brand-600">{title}</h2> : null}
      {description ? <p className="mt-1 text-sm text-mist-500">{description}</p> : null}
      <div className={cn("space-y-5", title || description ? "mt-5" : "")}>{children}</div>
    </section>
  );
}

const inputClass =
  "w-full rounded-lg border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

function Label({ htmlFor, label, hint }: { htmlFor: string; label: string; hint?: string }) {
  return (
    <div className="mb-1.5">
      <label htmlFor={htmlFor} className="block text-xs font-bold uppercase tracking-wide text-mist-500">
        {label}
      </label>
      {hint ? <p className="mt-0.5 text-xs text-mist-500/80">{hint}</p> : null}
    </div>
  );
}

export function TextField({
  label, value, onChange, hint, placeholder, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; hint?: string; placeholder?: string; type?: string }) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id} label={label} hint={hint} />
      <input id={id} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputClass} />
    </div>
  );
}

export function TextArea({
  label, value, onChange, hint, rows = 3,
}: { label: string; value: string; onChange: (v: string) => void; hint?: string; rows?: number }) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id} label={label} hint={hint} />
      <textarea id={id} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className={cn(inputClass, "resize-y")} />
    </div>
  );
}

export function NumberField({
  label, value, onChange, hint, min = 0, step = 1, prefix,
}: { label: string; value: number; onChange: (v: number) => void; hint?: string; min?: number; step?: number; prefix?: string }) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id} label={label} hint={hint} />
      <div className="flex items-center rounded-lg border border-mist-200 bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
        {prefix ? <span className="pl-3.5 text-sm font-semibold text-mist-500">{prefix}</span> : null}
        <input
          id={id}
          type="number"
          min={min}
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
          className="w-full rounded-lg bg-transparent px-3.5 py-2.5 text-sm text-ink-900 outline-none"
        />
      </div>
    </div>
  );
}

export function Grid({ children }: { children: ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}

// Lista de palavras curtas, como "etiquetas": digite e tecle Enter para adicionar.
export function WordList({
  label, words, onChange, hint, placeholder = "Digite e tecle Enter",
}: { label: string; words: string[]; onChange: (w: string[]) => void; hint?: string; placeholder?: string }) {
  const id = useId();
  const [draft, setDraft] = useState("");
  const add = () => {
    const w = draft.trim();
    if (w && !words.includes(w)) onChange([...words, w]);
    setDraft("");
  };
  const move = (i: number, d: -1 | 1) => {
    const next = [...words];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  return (
    <div>
      <Label htmlFor={id} label={label} hint={hint} />
      <div className="flex flex-wrap gap-2 rounded-lg border border-mist-200 bg-white p-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
        {words.map((w, i) => (
          <span key={w} className="inline-flex items-center gap-1 rounded-full bg-brand-50 py-1 pl-3 pr-1 text-sm font-semibold text-brand-700">
            {w}
            {i > 0 ? (
              <button type="button" onClick={() => move(i, -1)} aria-label={`Mover ${w} para antes`} className="rounded-full p-0.5 text-brand-600 hover:bg-brand-100">
                <ArrowLeft className="size-3" />
              </button>
            ) : null}
            <button type="button" onClick={() => onChange(words.filter((x) => x !== w))} aria-label={`Remover ${w}`} className="rounded-full p-0.5 text-brand-600 hover:bg-brand-100">
              <X className="size-3.5" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            } else if (e.key === "Backspace" && !draft && words.length) {
              onChange(words.slice(0, -1));
            }
          }}
          onBlur={add}
          className="min-w-[10rem] flex-1 bg-transparent px-1.5 py-1 text-sm outline-none"
        />
      </div>
    </div>
  );
}

// Lista de itens editáveis (adicionar, remover, reordenar, recolher).
export function ListEditor<T>({
  label, items, onChange, newItem, itemTitle, render, addLabel = "Adicionar", min = 0,
}: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  itemTitle: (item: T, index: number) => string;
  render: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
  addLabel?: string;
  min?: number;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const update = (i: number, patch: Partial<T>) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const move = (i: number, d: -1 | 1) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
    setOpen(open === i ? i + d : open);
  };
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-mist-500">{label}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="overflow-hidden rounded-xl border border-mist-200 bg-brand-50/40">
            <div className="flex items-center gap-1 px-3 py-2">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm font-semibold text-ink-900"
                aria-expanded={open === i}
              >
                <ChevronDown className={cn("size-4 shrink-0 text-mist-500 transition-transform", open === i && "rotate-180")} />
                <span className="truncate">{itemTitle(item, i) || <em className="text-mist-500">(sem título)</em>}</span>
              </button>
              <button type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Mover para cima" className="rounded-lg p-1.5 text-mist-500 hover:bg-white disabled:opacity-30">
                <ArrowUp className="size-4" />
              </button>
              <button type="button" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label="Mover para baixo" className="rounded-lg p-1.5 text-mist-500 hover:bg-white disabled:opacity-30">
                <ArrowDown className="size-4" />
              </button>
              <button
                type="button"
                disabled={items.length <= min}
                onClick={() => {
                  if (confirm("Remover este item?")) {
                    onChange(items.filter((_, j) => j !== i));
                    setOpen(null);
                  }
                }}
                aria-label="Remover"
                className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-30"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            {open === i ? <div className="space-y-4 border-t border-mist-200 bg-white p-4">{render(item, (p) => update(i, p), i)}</div> : null}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => {
          onChange([...items, newItem()]);
          setOpen(items.length);
        }}
        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-brand-600 px-3.5 py-1.5 text-sm font-bold text-brand-600 hover:bg-brand-50"
      >
        <Plus className="size-4" /> {addLabel}
      </button>
    </div>
  );
}

export function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div>
        <p className="text-sm font-bold text-ink-900">{label}</p>
        {hint ? <p className="mt-0.5 text-xs text-mist-500">{hint}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors", checked ? "bg-brand-600" : "bg-mist-200")}
      >
        <span className={cn("absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform", checked && "translate-x-5")} />
      </button>
    </div>
  );
}
