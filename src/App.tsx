import { lazy, Suspense } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import Features from "./components/Features";
import Niches from "./components/Niches";
import HowItWorks from "./components/HowItWorks";
import Plans from "./components/Plans";
import BlogPreview from "./components/BlogPreview";
import Faq from "./components/Faq";
import TutorialPage from "./components/TutorialPage";
import Footer, { FinalCta } from "./components/Footer";
import { WhatsIcon } from "./components/ui";
import { ContentProvider, initialContent, useContent, whatsappUrl } from "./content/ContentContext";

// Só baixados quando alguém abre essas páginas.
const AdminApp = lazy(() => import("./admin/AdminApp"));
const BlogListPage = lazy(() => import("./blog/BlogPages").then((m) => ({ default: m.BlogListPage })));
const BlogPostPage = lazy(() => import("./blog/BlogPages").then((m) => ({ default: m.BlogPostPage })));

const path = () => window.location.pathname.replace(/\/+$/, "");

function Page() {
  const p = path();
  // /planos mostra só a calculadora (URL já usada em links e anúncios).
  if (p === "/planos") {
    return (
      <div className="pt-12">
        <Plans />
        <Faq />
        <FinalCta />
      </div>
    );
  }
  if (p === "/tutorial") return <TutorialPage />;
  if (p === "/blog") return <BlogListPage categorySlug={null} />;
  const cat = p.match(/^\/blog\/categoria\/([\w-]+)$/);
  if (cat) return <BlogListPage categorySlug={cat[1]} />;
  const post = p.match(/^\/blog\/([\w-]+)$/);
  if (post) return <BlogPostPage slug={post[1]} />;
  return (
    <>
      <Hero />
      <TrustBar />
      <Features />
      <Niches />
      <HowItWorks />
      <Plans />
      <BlogPreview />
      <Faq />
      <FinalCta />
    </>
  );
}

export function Site() {
  const { settings } = useContent();
  return (
    <>
      <Header />
      <main className="min-h-[70vh]">
        <Suspense fallback={<div className="min-h-screen" />}>
          <Page />
        </Suspense>
      </main>
      <Footer />
      <a
        href={whatsappUrl(settings.whatsappNumber, settings.whatsappMessage)}
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

export default function App() {
  if (path().startsWith("/admin")) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-ink-950" />}>
        <AdminApp />
      </Suspense>
    );
  }
  return (
    <ContentProvider value={initialContent()}>
      <Site />
    </ContentProvider>
  );
}
