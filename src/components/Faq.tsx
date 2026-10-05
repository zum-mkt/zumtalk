import { Container, SectionTitle } from "./ui";

const ITEMS = [
  ["Preciso de cartão de crédito para testar?", "Não. O teste grátis de 7 dias não pede cartão, e a configuração leva cerca de 5 minutos."],
  ["Funciona com o WhatsApp Business?", "Sim. Você conecta o seu WhatsApp Business em poucos cliques e começa a atender pelo ZumTalk."],
  ["O que o plano base inclui?", "1 usuário, 1 número conectado, gestão de contatos, oportunidades, produtos e tarefas, além de automação, notificações e cadência. O Agente de IA, usuários e números extras e os fluxos de CRM são adicionais e entram na calculadora de planos."],
  ["Meus dados estão seguros?", "Os dados são criptografados e a plataforma está em conformidade com a LGPD."],
  ["Consigo adaptar ao meu tipo de negócio?", "Sim. A interface é flexível e temos modelos prontos para times de vendas, serviços e agendamentos, varejo e delivery."],
  ["Quem está por trás do ZumTalk?", "O ZumTalk é um produto da Agência ZUM, de Lençóis Paulista (SP), com mais de 20 anos de experiência em marketing, tecnologia e automação com IA."],
];

export default function Faq() {
  return (
    <section id="faq" className="bg-brand-50 py-20 sm:py-28">
      <Container className="max-w-3xl">
        <SectionTitle eyebrow="Dúvidas frequentes" title="Perguntas que todo mundo faz." />
        <div className="mt-10 divide-y divide-mist-200 border-y border-mist-200">
          {ITEMS.map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-bold text-ink-900">
                {q}
                <span className="text-2xl font-light text-brand-600 transition group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="mt-3 max-w-2xl leading-relaxed text-mist-500">{a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
