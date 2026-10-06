import { Highlight, useContent } from "../content/ContentContext";
import { Container, SectionTitle } from "./ui";

export default function Faq() {
  const { faq } = useContent();
  return (
    <section id="faq" className="bg-brand-50 py-20 sm:py-28">
      <Container className="max-w-3xl">
        <SectionTitle eyebrow={faq.eyebrow} title={<Highlight text={faq.title} className="text-brand-600" />} />
        <div className="mt-10 divide-y divide-mist-200 border-y border-mist-200">
          {faq.items.map((item, i) => (
            <details key={i} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-bold text-ink-900">
                {item.q}
                <span className="text-2xl font-light text-brand-600 transition group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="mt-3 max-w-2xl whitespace-pre-line leading-relaxed text-mist-500">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
