import { Highlight, useContent } from "../content/ContentContext";
import { Container, SectionTitle } from "./ui";

export default function HowItWorks() {
  const { steps, settings } = useContent();
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
        <div className="mt-12 text-center">
          <a href={settings.signupUrl} className="btn btn-primary-dark">{steps.ctaLabel}</a>
        </div>
      </Container>
    </section>
  );
}
