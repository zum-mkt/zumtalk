import { Highlight, useContent } from "../content/ContentContext";
import { Container, SectionTitle } from "./ui";

export default function Features() {
  const { features } = useContent();
  return (
    <section id="funcionalidades" className="bg-white py-20 sm:py-28">
      <Container>
        <SectionTitle
          eyebrow={features.eyebrow}
          title={<Highlight text={features.title} className="text-brand-600" />}
          lead={features.lead}
        />
        <div className="mt-14 grid gap-px overflow-hidden rounded-sm border border-mist-200 bg-mist-200 sm:grid-cols-2 lg:grid-cols-3">
          {features.items.map((f, i) => (
            <article key={i} className="group bg-white p-8 transition-colors hover:bg-brand-50">
              <span className="font-heading text-sm font-extrabold tracking-widest text-brand-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-xl font-bold text-ink-900">{f.title}</h3>
              <p className="mt-3 leading-relaxed text-mist-500">{f.text}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
