import { Highlight, useContent, whatsappUrl } from "../content/ContentContext";
import { Container, Logo, WhatsIcon } from "./ui";

export function FinalCta() {
  const { cta, settings } = useContent();
  return (
    <section className="relative overflow-hidden bg-ink-950 py-20 sm:py-28">
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-400/15 blur-3xl"
        aria-hidden="true"
      />
      <Container className="relative text-center">
        <p className="eyebrow text-brand-400">{"// "}{cta.eyebrow}</p>
        <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold leading-tight text-white sm:text-5xl">
          <Highlight text={cta.title} className="text-brand-400" />
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-mist-300">{cta.lead}</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href={whatsappUrl(settings.whatsappNumber, settings.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="btn btn-primary-dark">
            <WhatsIcon /> {cta.primary}
          </a>
          <a href={settings.signupUrl} className="btn btn-ghost-dark">{cta.secondary}</a>
        </div>
        {cta.note && <p className="mt-4 text-sm text-mist-500">{cta.note}</p>}
      </Container>
    </section>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const { footer, settings } = useContent();
  return (
    <footer className="border-t border-white/10 bg-ink-950 pb-10 pt-14 text-mist-300">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo className="h-10" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed">{footer.about}</p>
          </div>
          <nav aria-label="Produto">
            <p className="eyebrow text-brand-400">{"// "}Produto</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><a className="hover:text-white" href="/#funcionalidades">Funcionalidades</a></li>
              <li><a className="hover:text-white" href="/#planos">Planos</a></li>
              <li><a className="hover:text-white" href="/#faq">Dúvidas frequentes</a></li>
              <li><a className="hover:text-white" href={settings.loginUrl}>Entrar no sistema</a></li>
            </ul>
          </nav>
          <nav aria-label="Contato">
            <p className="eyebrow text-brand-400">{"// "}Contato</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><a className="hover:text-white" href={whatsappUrl(settings.whatsappNumber, settings.whatsappMessage)} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a className="hover:text-white" href={`mailto:${settings.email}`}>{settings.email}</a></li>
              <li><a className="hover:text-white" href={settings.agencyUrl} target="_blank" rel="noopener noreferrer">Agência ZUM</a></li>
            </ul>
          </nav>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {footer.copyright}</p>
          <p className="flex gap-5">
            <a className="hover:text-white" href={settings.privacyUrl} target="_blank" rel="noopener noreferrer">Privacidade</a>
            <a className="hover:text-white" href={settings.termsUrl} target="_blank" rel="noopener noreferrer">Termos</a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
