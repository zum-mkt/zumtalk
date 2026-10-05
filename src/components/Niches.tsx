import { useState } from "react";
import { SIGNUP_URL } from "../config";
import { Container, SectionTitle } from "./ui";

const TABS = [
  {
    id: "vendas",
    label: "Times de Vendas",
    title: "Transforme o WhatsApp em um CRM de verdade.",
    lead: "Pare de perder vendas por falta de follow-up ou esquecimento.",
    bullets: [
      ["Pipeline visual", "Arraste o cliente de “Novo Lead” para “Proposta Enviada” e “Fechamento”."],
      ["Distribuição de leads", "Chegou mensagem nova? O sistema entrega para o vendedor da vez automaticamente."],
      ["Histórico centralizado", "O vendedor saiu da empresa? O histórico da negociação fica com você."],
    ],
    columns: [
      { name: "Prospecção", cards: ["Clínica Vida", "Auto Center JR"] },
      { name: "Qualificação", cards: ["Mercadão Sul"] },
      { name: "Proposta enviada", cards: ["Imob. Centro", "Pet Feliz"] },
      { name: "Negociação", cards: ["Escola Futuro"] },
      { name: "Venda fechada", cards: ["Studio Bela"] },
    ],
  },
  {
    id: "servicos",
    label: "Serviços e Agendamentos",
    title: "Agenda cheia sem ficar preso ao celular.",
    lead: "O bot conversa, tira dúvidas e leva o cliente até o horário marcado.",
    bullets: [
      ["Qualificação automática", "O bot pergunta o que precisa antes de chegar até a sua equipe."],
      ["Tarefas e lembretes", "Notificações e cadência para confirmar e retomar contatos sem esforço."],
      ["Contatos organizados", "Cada paciente ou cliente com histórico completo da conversa."],
    ],
    columns: [
      { name: "Novo contato", cards: ["Maria S.", "João P."] },
      { name: "Triagem", cards: ["Carla M."] },
      { name: "Agendado", cards: ["Rafael T.", "Ana L."] },
      { name: "Confirmado", cards: ["Paulo H."] },
      { name: "Atendido", cards: ["Bia R."] },
    ],
  },
  {
    id: "varejo",
    label: "Varejo e Delivery",
    title: "Pedido entra, loja responde, venda acontece.",
    lead: "Cardápio, catálogo e dúvidas respondidos na hora, a qualquer horário.",
    bullets: [
      ["Gestão de produtos", "Seu catálogo dentro da conversa, com respostas automáticas sobre itens e valores."],
      ["Oportunidades por etapa", "Acompanhe cada pedido do primeiro “oi” até a entrega."],
      ["Automação de rotina", "Mensagens de pós-venda e recompra no automático."],
    ],
    columns: [
      { name: "Pedido novo", cards: ["#1042", "#1043"] },
      { name: "Confirmado", cards: ["#1041"] },
      { name: "Em preparo", cards: ["#1039", "#1040"] },
      { name: "Saiu p/ entrega", cards: ["#1038"] },
      { name: "Entregue", cards: ["#1037"] },
    ],
  },
] as const;

export default function Niches() {
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>("vendas");
  const tab = TABS.find((t) => t.id === active)!;

  return (
    <section id="nichos" className="bg-brand-50 py-20 sm:py-28">
      <Container>
        <SectionTitle
          eyebrow="Para quem é"
          title={<>O ZumTalk trabalha do jeito que <span className="text-brand-600">você</span> trabalha.</>}
          lead="Não importa o seu nicho. Otimize seu fluxo em minutos com uma interface 100% flexível."
        />

        <div role="tablist" aria-label="Segmentos" className="mt-10 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={active === t.id}
              onClick={() => setActive(t.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                active === t.id
                  ? "bg-ink-900 text-white"
                  : "border border-mist-200 bg-white text-ink-700 hover:border-brand-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div role="tabpanel" className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center [&>*]:min-w-0">
          <div>
            <h3 className="text-2xl font-extrabold text-ink-900 sm:text-3xl">{tab.title}</h3>
            <p className="mt-3 text-lg text-mist-500">{tab.lead}</p>
            <ul className="mt-7 space-y-4">
              {tab.bullets.map(([h, d]) => (
                <li key={h} className="flex gap-3">
                  <span className="mt-0.5 text-brand-600" aria-hidden="true">▸</span>
                  <p className="leading-relaxed text-ink-700">
                    <strong className="font-bold text-ink-900">{h}:</strong> {d}
                  </p>
                </li>
              ))}
            </ul>
            <a href={SIGNUP_URL} className="btn btn-primary-light mt-9">
              Ver modelos e começar teste grátis →
            </a>
            <p className="mt-3 text-sm text-mist-500">Já temos modelos prontos para o seu nicho.</p>
          </div>

          <div className="min-w-0 overflow-x-auto rounded-xl border border-mist-200 bg-white p-4 shadow-xl shadow-ink-900/5">
            <div className="grid min-w-[34rem] grid-cols-5 gap-2.5">
              {tab.columns.map((c, i) => (
                <div key={c.name} className="rounded-lg bg-brand-50 p-2">
                  <p className="mb-2 flex min-h-[2rem] items-start gap-1.5 text-[11px] font-bold leading-tight text-ink-700">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: i === 4 ? "#00638a" : "#9fb6c2" }} />
                    <span>{c.name}</span>
                  </p>
                  <div className="space-y-2">
                    {c.cards.map((card) => (
                      <div key={card} className="rounded-md border border-mist-200 bg-white px-2.5 py-2 text-xs font-medium text-ink-800 shadow-sm">
                        {card}
                        <div className="mt-1.5 h-1 w-8 rounded-full bg-brand-200" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
