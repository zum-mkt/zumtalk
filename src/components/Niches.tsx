import { useState } from "react";
import { Highlight, useContent } from "../content/ContentContext";
import { Container, SectionTitle } from "./ui";



export default function Niches() {
  const { niches, settings } = useContent();
  const [active, setActive] = useState(0);
  const tab = niches.tabs[Math.min(active, niches.tabs.length - 1)];

  return (
    <section id="nichos" className="bg-brand-50 py-20 sm:py-28">
      <Container>
        <SectionTitle
          eyebrow={niches.eyebrow}
          title={<Highlight text={niches.title} className="text-brand-600" />}
          lead={niches.lead}
        />

        <div role="tablist" aria-label="Segmentos" className="mt-10 flex flex-wrap gap-2">
          {niches.tabs.map((t, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                active === i
                  ? "bg-ink-900 text-white"
                  : "border border-mist-200 bg-white text-ink-700 hover:border-brand-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab && <div role="tabpanel" className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center [&>*]:min-w-0">
          <div>
            <h3 className="text-2xl font-extrabold text-ink-900 sm:text-3xl">{tab.title}</h3>
            <p className="mt-3 text-lg text-mist-500">{tab.lead}</p>
            <ul className="mt-7 space-y-4">
              {tab.bullets.map(({ title: h, text: d }, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 text-brand-600" aria-hidden="true">▸</span>
                  <p className="leading-relaxed text-ink-700">
                    <strong className="font-bold text-ink-900">{h}:</strong> {d}
                  </p>
                </li>
              ))}
            </ul>
            <a href={settings.signupUrl} className="btn btn-primary-light mt-9">
              {niches.ctaLabel}
            </a>
            {niches.ctaNote && <p className="mt-3 text-sm text-mist-500">{niches.ctaNote}</p>}
          </div>

          <div className="min-w-0 overflow-x-auto rounded-xl border border-mist-200 bg-white p-4 shadow-xl shadow-ink-900/5">
            <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${Math.max(1, tab.columns.length)}, minmax(6.5rem, 1fr))` }}>
              {tab.columns.map((c, i) => (
                <div key={i} className="rounded-lg bg-brand-50 p-2">
                  <p className="mb-2 flex min-h-[2rem] items-start gap-1.5 text-[11px] font-bold leading-tight text-ink-700">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: i === tab.columns.length - 1 ? "#00638a" : "#9fb6c2" }} />
                    <span>{c.name}</span>
                  </p>
                  <div className="space-y-2">
                    {c.cards.map((card, j) => (
                      <div key={j} className="rounded-md border border-mist-200 bg-white px-2.5 py-2 text-xs font-medium text-ink-800 shadow-sm">
                        {card}
                        <div className="mt-1.5 h-1 w-8 rounded-full bg-brand-200" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>}
      </Container>
    </section>
  );
}
