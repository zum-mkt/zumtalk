import type { ReactNode } from "react";
import { Ban, Info, RefreshCw, Smartphone, User } from "lucide-react";
import { Highlight, useContent } from "../content/ContentContext";
import { Check, Container, Eyebrow, WhatsIcon } from "./ui";

// Faixa logo abaixo do hero: parceria oficial com a Meta, uso da WhatsApp Business API
// e as duas formas de conexão (número dedicado x Coexistência), com um diagrama de cada.

function Node({ icon, label, tone = "light" }: { icon: ReactNode; label: string; tone?: "light" | "brand" | "whats" }) {
  const tones = {
    light: "bg-white text-ink-700 border border-mist-200",
    brand: "bg-white border-2 border-brand-500",
    whats: "bg-[#25D366] text-white",
  };
  return (
    <div className="flex w-14 shrink-0 flex-col items-center text-center sm:w-20">
      <span className={`grid size-11 place-items-center rounded-2xl shadow-sm sm:size-12 ${tones[tone]}`}>{icon}</span>
      <span className="mt-2 text-[10px] font-bold leading-tight text-ink-900 sm:text-xs">{label}</span>
    </div>
  );
}

// Linha tracejada animada entre dois nós, alinhada ao centro dos ícones.
const Link = () => <span className="flow-line mt-[1.375rem] h-0.5 min-w-4 flex-1 sm:mt-6" aria-hidden="true" />;

function ApiDiagram() {
  return (
    <div>
      <div className="flex items-start">
        <Node icon={<User className="size-5" />} label="Cliente" />
        <Link />
        <Node icon={<WhatsIcon className="size-6" />} label="WhatsApp API (Meta)" tone="whats" />
        <Link />
        <Node icon={<img src="/logo-mark.svg" alt="" className="size-7" />} label="ZumTalk (bot + equipe)" tone="brand" />
      </div>
      <p className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-mist-500">
        <span className="relative grid size-7 place-items-center rounded-full bg-white text-mist-500 ring-1 ring-mist-200">
          <Smartphone className="size-4" />
          <Ban className="absolute size-6 text-red-400/80" />
        </span>
        Número sai do app do celular
      </p>
    </div>
  );
}

// Nó com o rótulo ao lado do ícone (coluna da direita da Coexistência).
function SideNode({ icon, label, tone = "light" }: { icon: ReactNode; label: string; tone?: "light" | "brand" }) {
  return (
    <div className="flex h-12 items-center gap-2">
      <span
        className={`grid size-12 shrink-0 place-items-center rounded-2xl bg-white shadow-sm ${
          tone === "brand" ? "border-2 border-brand-500" : "border border-mist-200 text-ink-700"
        }`}
      >
        {icon}
      </span>
      <span className="max-w-[3.75rem] text-[10px] font-bold leading-tight text-ink-900 sm:max-w-none sm:text-xs">{label}</span>
    </div>
  );
}

function CoexistenceDiagram() {
  // Coluna da direita: ícone (48px) + selo (30px) + ícone (48px) = 126px.
  // Os centros dos ícones ficam em 24px e 102px; o meio da coluna em 63px.
  return (
    <div className="flex items-start justify-center">
      <div className="mt-[41px] flex min-w-0 flex-1 items-start sm:mt-[39px]">
        <Node icon={<User className="size-5" />} label="Cliente" />
        <Link />
        <Node icon={<WhatsIcon className="size-6" />} label="WhatsApp (Meta)" tone="whats" />
      </div>
      <svg viewBox="0 0 40 126" className="h-[126px] w-8 shrink-0 sm:-ml-4 sm:w-10" aria-hidden="true">
        <path d="M0 63 C 22 63, 18 24, 40 24 M0 63 C 22 63, 18 102, 40 102" className="flow-path" fill="none" />
      </svg>
      <div className="flex shrink-0 flex-col">
        <SideNode icon={<img src="/logo-mark.svg" alt="" className="size-7" />} label="ZumTalk" tone="brand" />
        <span className="flex h-[30px] items-center pl-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">
            <RefreshCw className="size-3" /> sincronizado
          </span>
        </span>
        <SideNode icon={<Smartphone className="size-5" />} label="App no celular" />
      </div>
    </div>
  );
}

export default function TrustBar() {
  const { trust } = useContent();
  if (!trust.show) return null;
  const diagrams = [<ApiDiagram key="api" />, <CoexistenceDiagram key="coex" />];

  return (
    <section aria-label="Parceria oficial e formas de conexão" className="border-b border-mist-200 bg-white py-14 sm:py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <Eyebrow>{trust.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-2xl font-extrabold leading-tight text-ink-900 sm:text-3xl">
              <Highlight text={trust.title} className="text-brand-600" />
            </h2>
            {trust.lead && <p className="mt-4 max-w-xl leading-relaxed text-mist-500">{trust.lead}</p>}
          </div>
          <div className="grid grid-cols-2 items-center gap-4 sm:gap-6">
            <div className="grid h-28 place-items-center rounded-2xl border border-mist-200 bg-white px-5 shadow-sm sm:h-32 sm:px-7">
              <img src="/meta-business-partner.webp" alt="Meta Business Partner" width={1094} height={432} loading="lazy" className="max-h-16 w-auto sm:max-h-[4.5rem]" />
            </div>
            <div className="grid h-28 place-items-center rounded-2xl border border-mist-200 bg-white px-5 shadow-sm sm:h-32 sm:px-7">
              <img src="/whatsapp-business-api.webp" alt="WhatsApp Business API" width={732} height={269} loading="lazy" className="max-h-14 w-auto sm:max-h-16" />
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-xl font-extrabold text-ink-900 sm:text-2xl">{trust.pathsTitle}</h3>
          {trust.pathsLead && <p className="mt-2 text-mist-500">{trust.pathsLead}</p>}

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {trust.paths.slice(0, 2).map((path, i) => (
              <article key={i} className="flex flex-col rounded-2xl border border-mist-200 bg-white p-6 shadow-xl shadow-ink-900/5 sm:p-7">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-heading text-sm font-extrabold tracking-widest text-brand-600">0{i + 1}</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      i === 1 ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700"
                    }`}
                  >
                    {path.tag}
                  </span>
                </div>
                <h4 className="mt-3 text-xl font-bold text-ink-900">{path.title}</h4>

                <figure className="mt-5 rounded-xl bg-brand-50 px-3 py-5 sm:px-5" aria-label={`Diagrama: ${path.title}`}>
                  {diagrams[i]}
                </figure>

                <p className="mt-5 leading-relaxed text-ink-700">{path.text}</p>
                <ul className="mt-4 flex-1 space-y-2.5">
                  {path.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-ink-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                {path.note && (
                  <p className="mt-5 flex items-start gap-2 border-t border-mist-100 pt-4 text-sm text-mist-500">
                    <Info className="mt-0.5 size-4 shrink-0" />
                    <span>{path.note}</span>
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
