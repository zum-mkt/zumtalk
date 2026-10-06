import { LINKS, LOGIN_URL, SIGNUP_URL, WHATSAPP_URL } from "../config";
import { Container, Logo, WhatsIcon } from "./ui";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-20 sm:py-28">
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-400/15 blur-3xl"
        aria-hidden="true"
      />
      <Container className="relative text-center">
        <p className="eyebrow text-brand-400">{"// "}Vamos conversar</p>
        <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold leading-tight text-white sm:text-5xl">
          Pronto para transformar seu atendimento?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-mist-300">
          Junte-se às empresas que já automatizaram o atendimento e aumentaram suas vendas com o ZumTalk.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary-dark">
            <WhatsIcon /> Falar com um especialista
          </a>
          <a href={SIGNUP_URL} className="btn btn-ghost-dark">Iniciar teste grátis</a>
        </div>
        <p className="mt-4 text-sm text-mist-500">Sem cartão de crédito · Configuração em 5 minutos · Suporte em português</p>
      </Container>
    </section>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-ink-950 pb-10 pt-14 text-mist-300">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo className="h-10" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Chatbot inteligente para WhatsApp que transforma seu atendimento e aumenta suas vendas com IA conversacional.
            </p>
          </div>
          <nav aria-label="Produto">
            <p className="eyebrow text-brand-400">{"// "}Produto</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><a className="hover:text-white" href="/#funcionalidades">Funcionalidades</a></li>
              <li><a className="hover:text-white" href="/#planos">Planos</a></li>
              <li><a className="hover:text-white" href="/#faq">Dúvidas frequentes</a></li>
              <li><a className="hover:text-white" href={LOGIN_URL}>Entrar no sistema</a></li>
            </ul>
          </nav>
          <nav aria-label="Contato">
            <p className="eyebrow text-brand-400">{"// "}Contato</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><a className="hover:text-white" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a className="hover:text-white" href={LINKS.email}>zum@agenciazum.com.br</a></li>
              <li><a className="hover:text-white" href={LINKS.agency} target="_blank" rel="noopener noreferrer">Agência ZUM</a></li>
            </ul>
          </nav>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} ZumTalk, um produto da Agência ZUM · Lençóis Paulista, SP. Todos os direitos reservados.</p>
          <p className="flex gap-5">
            <a className="hover:text-white" href={LINKS.privacy} target="_blank" rel="noopener noreferrer">Privacidade</a>
            <a className="hover:text-white" href={LINKS.terms} target="_blank" rel="noopener noreferrer">Termos</a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
