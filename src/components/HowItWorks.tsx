import { SIGNUP_URL } from "../config";
import { Container, SectionTitle } from "./ui";

const STEPS = [
  { k: "01", t: "Conecte seu WhatsApp", d: "Integração simples e rápida com o WhatsApp Business, em poucos cliques." },
  { k: "02", t: "Configure sua IA", d: "Personalize respostas, fluxos e tom de voz de acordo com o seu negócio." },
  { k: "03", t: "Comece a atender", d: "Seu chatbot está pronto para atender os clientes automaticamente." },
];

export default function HowItWorks() {
  return (
    <section className="bg-ink-950 py-20 sm:py-28">
      <Container>
        <SectionTitle
          dark
          center
          eyebrow="Como funciona"
          title="Em 3 passos simples, seu chatbot está no ar."
        />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.k} className="bg-ink-900 p-8">
              <span className="font-heading text-4xl font-extrabold text-brand-400">{s.k}</span>
              <p className="sr-only">Passo {i + 1}</p>
              <h3 className="mt-5 text-xl font-bold text-white">{s.t}</h3>
              <p className="mt-3 leading-relaxed text-mist-300">{s.d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 text-center">
          <a href={SIGNUP_URL} className="btn btn-primary-dark">Começar gratuitamente</a>
        </div>
      </Container>
    </section>
  );
}
