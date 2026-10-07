import { useEffect, useState } from "react";
import { Highlight, useContent, whatsappUrl } from "../content/ContentContext";
import { Check, Container, Eyebrow, WhatsIcon } from "./ui";

export function youtubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m?.[1] ?? (/^[\w-]{11}$/.test(url.trim()) ? url.trim() : null);
}

// Mostra só a miniatura; o player do YouTube (pesado) só carrega no clique.
export function VideoEmbed({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-ink-900 shadow-2xl shadow-ink-900/30 ring-1 ring-white/10">
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0 h-full w-full" aria-label={`Assistir: ${title}`}>
          <img
            src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
            onError={(e) => ((e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02] group-hover:brightness-90"
          />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-20 place-items-center rounded-full bg-brand-400 text-ink-950 shadow-[0_10px_40px_-6px_rgba(53,182,232,.9)] transition group-hover:scale-110 sm:size-24">
              <svg viewBox="0 0 24 24" className="ml-1 size-9 sm:size-10" fill="currentColor" aria-hidden="true">
                <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

export default function TutorialPage() {
  const { tutorial, settings } = useContent();
  const id = youtubeId(tutorial.videoUrl);
  const plainTitle = tutorial.title.replace(/\*/g, "");

  useEffect(() => {
    document.title = `${plainTitle} | ZumTalk`;
  }, [plainTitle]);

  return (
    <>
      <section className="relative overflow-hidden bg-ink-950 pb-16 pt-28 sm:pb-24 sm:pt-36">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-brand-400/15 blur-3xl" aria-hidden="true" />
        <Container className="relative max-w-5xl">
          <div className="max-w-3xl">
            <Eyebrow dark>{tutorial.eyebrow}</Eyebrow>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-5xl">
              <Highlight text={tutorial.title} className="text-brand-400" />
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-mist-300">{tutorial.lead}</p>
            {tutorial.duration && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-sm font-semibold text-brand-200">
                <span className="size-1.5 rounded-full bg-brand-400" aria-hidden="true" /> Vídeo · {tutorial.duration}
              </p>
            )}
          </div>
          <div className="mt-10">{id ? <VideoEmbed id={id} title={plainTitle} /> : null}</div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container className="grid max-w-5xl gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          {tutorial.topics.length > 0 && (
            <div>
              <h2 className="text-2xl font-extrabold text-ink-900 sm:text-3xl">{tutorial.topicsTitle}</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {tutorial.topics.map((t) => (
                  <li key={t} className="flex items-start gap-3 rounded-xl border border-mist-200 p-4">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    <span className="font-semibold text-ink-900">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="rounded-2xl bg-brand-50 p-7 sm:p-8">
            <p className="eyebrow text-brand-600">{"// "}Próximo passo</p>
            <p className="mt-3 text-2xl font-extrabold leading-tight text-ink-900">Pronto para testar no seu WhatsApp?</p>
            <p className="mt-3 text-mist-500">7 dias grátis, sem cartão de crédito.</p>
            <div className="mt-6 flex flex-col gap-3">
              <a href={settings.signupUrl} className="btn btn-primary-light">Começar teste grátis</a>
              <a href={whatsappUrl(settings.whatsappNumber, settings.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light">
                <WhatsIcon className="h-5 w-5" /> Tirar dúvidas no WhatsApp
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
