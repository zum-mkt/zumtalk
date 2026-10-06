import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_CONTENT, mergeContent, type SiteContent } from "./defaults";

declare global {
  interface Window {
    __SITE_CONTENT__?: unknown;
  }
}

// O Worker injeta o conteúdo salvo em window.__SITE_CONTENT__ dentro do index.html,
// então a página já abre com o texto certo, sem piscar o conteúdo padrão.
export function initialContent(): SiteContent {
  return typeof window !== "undefined" && window.__SITE_CONTENT__ ? mergeContent(window.__SITE_CONTENT__) : DEFAULT_CONTENT;
}

const Ctx = createContext<SiteContent>(DEFAULT_CONTENT);

export function ContentProvider({ value, children }: { value: SiteContent; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useContent = () => useContext(Ctx);

export function whatsappUrl(number: string, message: string) {
  return `https://api.whatsapp.com/send/?phone=${number.replace(/\D/g, "")}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
}

// Renderiza "texto *destaque* texto" com o trecho entre asteriscos em azul.
export function Highlight({ text, className }: { text: string; className: string }) {
  return (
    <>
      {text.split("*").map((part, i) => (i % 2 ? <span key={i} className={className}>{part}</span> : part))}
    </>
  );
}
