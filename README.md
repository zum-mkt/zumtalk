# ZumTalk — nova landing page

React + Vite + Tailwind v4. Design system da Agência ZUM (Manrope/Inter, eyebrows "//", bullets ▸, botões pílula, seções escuras/claras) com a paleta do ZumTalk (#00638A / #1C3B4A / #668899).

    npm install
    npm run dev      # desenvolvimento
    npm run build    # gera /dist

Edite números, links e preço em `src/config.ts`. Cores em `src/index.css` (bloco @theme).

Pendências:
- Logo oficial: coloque em `public/logo.png` e troque o componente `Logo` em `src/components/ui.tsx` (hoje é um wordmark provisório).
- Imagem de compartilhamento 1200x630 em `public/og-image.jpg`.
- Links de Privacidade/Termos apontam para os da Agência ZUM; troque quando houver os do ZumTalk.
- Prova social (+500 empresas, 4.9/5, +10.000 atendimentos) mantida do site anterior; confirme que consegue comprovar antes de anunciar.

## Calculadora de planos
Componente `src/components/Plans.tsx`, preços em `PRICING` (`src/config.ts`), lidos de zumtalk.com/planos em 05/10/2026: base R$ 95; Agente de IA leva o base a R$ 185; usuário extra R$ 50 (máx. 20); número extra R$ 20 (máx. 20); fluxo de CRM R$ 15 (máx. 10).
Aparece na home (#planos) e na rota `/planos` (configure o fallback de SPA no servidor para servir `index.html` nessa rota).
