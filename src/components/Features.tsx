import { Container, SectionTitle } from "./ui";

const FEATURES = [
  { n: "01", t: "IA avançada", d: "Chatbot com inteligência artificial que aprende e melhora continuamente com cada interação." },
  { n: "02", t: "Respostas instantâneas", d: "Atendimento automático em tempo real, sem fila e sem tempo de espera para o seu cliente." },
  { n: "03", t: "Mais vendas", d: "Qualifique leads automaticamente e converta mais conversas em negócios fechados." },
  { n: "04", t: "Disponível 24/7", d: "Atendimento ininterrupto, todos os dias da semana, sem custo extra de equipe." },
  { n: "05", t: "Seguro e confiável", d: "Dados criptografados e conformidade com a LGPD para a sua tranquilidade." },
  { n: "06", t: "Integração com WhatsApp", d: "Conecte o WhatsApp Business em poucos cliques e fale com o cliente onde ele já está." },
];

export default function Features() {
  return (
    <section id="funcionalidades" className="bg-white py-20 sm:py-28">
      <Container>
        <SectionTitle
          eyebrow="Por que escolher o ZumTalk"
          title={<>Recursos poderosos para <span className="text-brand-600">revolucionar</span> o seu atendimento.</>}
          lead="Tudo que uma operação de vendas pelo WhatsApp precisa, em uma plataforma só."
        />
        <div className="mt-14 grid gap-px overflow-hidden rounded-sm border border-mist-200 bg-mist-200 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article key={f.n} className="group bg-white p-8 transition-colors hover:bg-brand-50">
              <span className="font-heading text-sm font-extrabold tracking-widest text-brand-600">{f.n}</span>
              <h3 className="mt-4 text-xl font-bold text-ink-900">{f.t}</h3>
              <p className="mt-3 leading-relaxed text-mist-500">{f.d}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
