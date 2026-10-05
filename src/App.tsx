import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Niches from "./components/Niches";
import HowItWorks from "./components/HowItWorks";
import Plans from "./components/Plans";
import Faq from "./components/Faq";
import Footer, { FinalCta } from "./components/Footer";
import { WHATSAPP_URL } from "./config";
import { WhatsIcon } from "./components/ui";

export default function App() {
  // Rota simples: /planos mostra só a calculadora (URL já usada em links e anúncios).
  // Em produção, configure o fallback de SPA para servir index.html em /planos.
  const isPlansPage = window.location.pathname.replace(/\/+$/, "") === "/planos";

  return (
    <>
      <Header />
      <main>
        {isPlansPage ? (
          <div className="pt-12">
            <Plans />
            <Faq />
            <FinalCta />
          </div>
        ) : (
          <>
            <Hero />
            <Features />
            <Niches />
            <HowItWorks />
            <Plans />
            <Faq />
            <FinalCta />
          </>
        )}
      </main>
      <Footer />
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco no WhatsApp"
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-brand-400 text-ink-950 shadow-[0_10px_28px_-8px_rgba(53,182,232,.8)] transition hover:scale-105"
      >
        <WhatsIcon className="h-7 w-7" />
      </a>
    </>
  );
}
