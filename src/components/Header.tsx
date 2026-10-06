import { useEffect, useState } from "react";
import { useContent } from "../content/ContentContext";
import { Container, Logo } from "./ui";

const NAV = [
  { href: "/#funcionalidades", label: "Funcionalidades" },
  { href: "/#nichos", label: "Para quem é" },
  { href: "/#planos", label: "Planos" },
  { href: "/#faq", label: "Dúvidas" },
];

export default function Header() {
  const { header, settings } = useContent();
  const LOGIN_URL = settings.loginUrl;
  const SIGNUP_URL = settings.signupUrl;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const solid = typeof window !== "undefined" && window.location.pathname.replace(/\/+$/, "") === "/planos";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled || open || solid ? "bg-ink-950/95 backdrop-blur border-b border-white/10" : "bg-transparent"
      }`}
    >
      <Container className="flex h-16 items-center justify-between">
        <a href="/" aria-label="ZumTalk, voltar ao topo">
          <Logo />
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm font-medium text-mist-200 transition hover:text-white">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href={LOGIN_URL} className="px-3 text-sm font-semibold text-mist-200 hover:text-white">
            {header.loginLabel}
          </a>
          <a href={SIGNUP_URL} className="btn btn-primary-dark !py-2.5 !text-sm">
            {header.ctaLabel}
          </a>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg text-white md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M5 5l12 12M17 5 5 17" /> : <path d="M3 6h16M3 11h16M3 16h16" />}
          </svg>
        </button>
      </Container>

      {open && (
        <div className="border-t border-white/10 bg-ink-950 md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-base font-medium text-mist-200 hover:bg-white/5"
              >
                {n.label}
              </a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-3">
              <a href={LOGIN_URL} className="btn btn-ghost-dark !py-3 !text-sm">{header.loginLabel}</a>
              <a href={SIGNUP_URL} className="btn btn-primary-dark !py-3 !text-sm">{header.ctaLabel}</a>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
