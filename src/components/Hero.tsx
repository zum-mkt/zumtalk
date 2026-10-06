import { PROOF, SIGNUP_URL, WHATSAPP_URL } from "../config";
import { Container, Eyebrow, WhatsIcon } from "./ui";

function ChatMock() {
  const msgs: { from: "client" | "bot"; text: string; delay: number }[] = [
    { from: "client", text: "Oi! Vocês fazem orçamento para amanhã?", delay: 0.3 },
    { from: "bot", text: "Olá! Faço sim. Me conta rapidinho o que você precisa e já separo o melhor horário.", delay: 1.2 },
    { from: "client", text: "Preciso de 2 unidades, entrega em Lençóis.", delay: 2.4 },
    { from: "bot", text: "Perfeito! Enviei a proposta e avisei o vendedor da vez. Posso confirmar pelo PIX?", delay: 3.4 },
  ];
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-brand-400/10 blur-2xl" aria-hidden="true" />
      <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-ink-900 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-3 border-b border-white/10 bg-ink-800 px-4 py-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-white">
            <img src="/logo-mark.svg" alt="" width={22} height={22} className="h-[22px] w-[22px]" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">Atendimento ZumTalk</p>
            <p className="text-xs text-brand-400">● online agora</p>
          </div>
        </div>
        <div className="flex min-h-[19rem] flex-col gap-3 bg-[radial-gradient(circle_at_20%_0%,rgba(53,182,232,0.08),transparent_55%)] p-4">
          {msgs.map((m, i) => (
            <div
              key={i}
              className={`bubble max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-snug ${
                m.from === "client"
                  ? "self-start rounded-tl-sm bg-ink-700 text-mist-100"
                  : "self-end rounded-tr-sm bg-brand-600 text-white"
              }`}
              style={{ animationDelay: `${m.delay}s` }}
            >
              {m.text}
            </div>
          ))}
          <div className="bubble self-end rounded-2xl rounded-tr-sm bg-brand-600/60 px-4 py-3" style={{ animationDelay: "4.4s" }} aria-hidden="true">
            <span className="inline-flex gap-1">
              <i className="dot h-1.5 w-1.5 rounded-full bg-white" />
              <i className="dot h-1.5 w-1.5 rounded-full bg-white" />
              <i className="dot h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink-950 pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* Foto de fundo: 85% de transparência, máscara azul e degradê da esquerda para a direita */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <img src="/hero-bg.webp" alt="" className="h-full w-full object-cover object-right opacity-15" />
        <div className="absolute inset-0 bg-brand-600 mix-blend-color" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/60 to-transparent" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(159,182,194,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(159,182,194,.07) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, #000 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, #000 40%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <Container className="relative grid items-center gap-14 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <Eyebrow dark>Chatbot com IA e CRM para WhatsApp</Eyebrow>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl">
            Seu WhatsApp vendendo{" "}
            <span className="text-brand-400">sozinho</span>, 24 horas por dia.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist-300">
            O ZumTalk atende seus clientes na hora, qualifica cada lead e organiza tudo em um CRM visual.
            Você para de perder venda por demora, esquecimento ou falta de follow-up.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary-dark">
              <WhatsIcon /> Falar com o bot no WhatsApp
            </a>
            <a href={SIGNUP_URL} className="btn btn-ghost-dark">
              Testar grátis por 7 dias →
            </a>
          </div>
          <p className="mt-4 text-sm text-mist-500">Sem cartão de crédito · Configuração em 5 minutos · Suporte em português</p>

          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {[
              [PROOF.companies, "empresas atendidas"],
              [PROOF.rating, "avaliação média"],
              [PROOF.monthly, "atendimentos por mês"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="font-heading text-2xl font-extrabold text-white sm:text-3xl">{n}</dt>
                <dd className="mt-1 text-xs leading-snug text-mist-500 sm:text-sm">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <ChatMock />
      </Container>
    </section>
  );
}
