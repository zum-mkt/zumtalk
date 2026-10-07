import { Highlight, useContent } from "../content/ContentContext";
import { Container, SectionTitle } from "./ui";

export default function HowItWorks() {
  const { steps, settings, tutorial } = useContent();
  return (
    <section className="bg-ink-950 py-20 sm:py-28">
      <Container>
        <SectionTitle
          dark
          center
          eyebrow={steps.eyebrow}
          title={<Highlight text={steps.title} className="text-brand-400" />}
        />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 md:grid-cols-3">
          {steps.items.map((s, i) => (
            <li key={i} className="bg-ink-900 p-8">
              <span className="font-heading text-4xl font-extrabold text-brand-400">{String(i + 1).padStart(2, "0")}</span>
              <p className="sr-only">Passo {i + 1}</p>
              <h3 className="mt-5 text-xl font-bold text-white">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-mist-300">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href={settings.signupUrl} className="btn btn-primary-dark">{steps.ctaLabel}</a>
          {tutorial.show && (
            <a href="/tutorial" className="btn btn-ghost-dark">
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
              </svg>
              {tutorial.linkLabel}
              {tutorial.duration ? <span className="text-mist-300">({tutorial.duration})</span> : null}
            </a>
          )}
        </div>
      </Container>
    </section>
  );
}
