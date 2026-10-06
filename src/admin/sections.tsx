import type { ComponentType, ReactNode } from "react";
import {
  BadgeDollarSign, CircleHelp, Footprints, Home, LayoutGrid, Megaphone, PanelBottom, Settings, Sparkles, Users,
} from "lucide-react";
import type { SiteContent } from "../content/defaults";
import { Card, Grid, ListEditor, NumberField, TextArea, TextField, WordList } from "./fields";

type Props<K extends keyof SiteContent> = { value: SiteContent[K]; set: (patch: Partial<SiteContent[K]>) => void };

const HIGHLIGHT_HINT = "Use *asteriscos* em volta de uma palavra para destacá-la em azul.";

function HeroForm({ value: v, set }: Props<"hero">) {
  const preview = v.rotatingWords[0] ?? "";
  return (
    <>
      <Card title="Título principal" description="A frase grande do topo da página. A palavra do meio troca sozinha.">
        <div className="rounded-xl bg-ink-950 px-5 py-4 font-heading text-xl font-extrabold leading-snug text-white sm:text-2xl">
          {v.titleBefore} <span className="underline decoration-brand-400 decoration-dashed underline-offset-4">{preview}</span>{" "}
          <span className="text-brand-400">{v.titleHighlight}</span>
          {v.titleAfter}
        </div>
        <Grid>
          <TextField label="Início da frase" value={v.titleBefore} onChange={(titleBefore) => set({ titleBefore })} />
          <TextField label="Palavra em destaque (azul)" value={v.titleHighlight} onChange={(titleHighlight) => set({ titleHighlight })} />
        </Grid>
        <TextField label="Final da frase" value={v.titleAfter} onChange={(titleAfter) => set({ titleAfter })} hint="Comece com vírgula ou espaço se precisar, ex.: “, 24 horas por dia.”" />
        <WordList
          label="Palavras que giram"
          words={v.rotatingWords}
          onChange={(rotatingWords) => set({ rotatingWords })}
          hint="Aparecem nesta ordem, uma de cada vez. Use a seta para mudar a ordem."
        />
        <NumberField
          label="Trocar a palavra a cada (segundos)"
          value={v.rotateSeconds}
          min={1}
          step={0.5}
          onChange={(rotateSeconds) => set({ rotateSeconds: Math.max(1, rotateSeconds) })}
        />
      </Card>

      <Card title="Textos e botões">
        <TextField label="Chamada acima do título" value={v.eyebrow} onChange={(eyebrow) => set({ eyebrow })} />
        <TextArea label="Texto de apoio" value={v.lead} onChange={(lead) => set({ lead })} />
        <Grid>
          <TextField label="Botão principal (WhatsApp)" value={v.ctaPrimary} onChange={(ctaPrimary) => set({ ctaPrimary })} />
          <TextField label="Botão secundário (cadastro)" value={v.ctaSecondary} onChange={(ctaSecondary) => set({ ctaSecondary })} />
        </Grid>
        <TextField label="Observação abaixo dos botões" value={v.note} onChange={(note) => set({ note })} hint="Deixe em branco para esconder." />
      </Card>

      <Card title="Números de prova social">
        <ListEditor
          label="Números"
          items={v.stats}
          onChange={(stats) => set({ stats })}
          newItem={() => ({ value: "", label: "" })}
          itemTitle={(s) => [s.value, s.label].filter(Boolean).join(" · ")}
          addLabel="Adicionar número"
          render={(s, up) => (
            <Grid>
              <TextField label="Número" value={s.value} onChange={(value) => up({ value })} placeholder="+500" />
              <TextField label="Legenda" value={s.label} onChange={(label) => up({ label })} placeholder="empresas atendidas" />
            </Grid>
          )}
        />
      </Card>

      <Card title="Conversa de exemplo" description="O chat animado ao lado do título.">
        <TextField label="Nome do atendimento" value={v.chatName} onChange={(chatName) => set({ chatName })} />
        <ListEditor
          label="Mensagens"
          items={v.chat}
          onChange={(chat) => set({ chat })}
          newItem={() => ({ from: "client" as const, text: "" })}
          itemTitle={(m) => `${m.from === "client" ? "Cliente" : "ZumTalk"}: ${m.text}`}
          addLabel="Adicionar mensagem"
          render={(m, up) => (
            <>
              <div className="flex gap-2">
                {(["client", "bot"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => up({ from: f })}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-bold ${m.from === f ? "bg-ink-900 text-white" : "border border-mist-200 text-ink-700"}`}
                  >
                    {f === "client" ? "Cliente" : "ZumTalk (bot)"}
                  </button>
                ))}
              </div>
              <TextArea label="Mensagem" value={m.text} onChange={(text) => up({ text })} rows={2} />
            </>
          )}
        />
      </Card>
    </>
  );
}

function FeaturesForm({ value: v, set }: Props<"features">) {
  return (
    <>
      <Card title="Cabeçalho da seção">
        <TextField label="Chamada" value={v.eyebrow} onChange={(eyebrow) => set({ eyebrow })} />
        <TextField label="Título" value={v.title} onChange={(title) => set({ title })} hint={HIGHLIGHT_HINT} />
        <TextArea label="Texto de apoio" value={v.lead} onChange={(lead) => set({ lead })} rows={2} />
      </Card>
      <Card title="Recursos" description="A numeração (01, 02…) é automática.">
        <ListEditor
          label="Itens"
          items={v.items}
          onChange={(items) => set({ items })}
          newItem={() => ({ title: "", text: "" })}
          itemTitle={(f, i) => `${String(i + 1).padStart(2, "0")} · ${f.title}`}
          addLabel="Adicionar recurso"
          render={(f, up) => (
            <>
              <TextField label="Título" value={f.title} onChange={(title) => up({ title })} />
              <TextArea label="Descrição" value={f.text} onChange={(text) => up({ text })} rows={2} />
            </>
          )}
        />
      </Card>
    </>
  );
}

function NichesForm({ value: v, set }: Props<"niches">) {
  return (
    <>
      <Card title="Cabeçalho da seção">
        <TextField label="Chamada" value={v.eyebrow} onChange={(eyebrow) => set({ eyebrow })} />
        <TextField label="Título" value={v.title} onChange={(title) => set({ title })} hint={HIGHLIGHT_HINT} />
        <TextArea label="Texto de apoio" value={v.lead} onChange={(lead) => set({ lead })} rows={2} />
        <Grid>
          <TextField label="Texto do botão" value={v.ctaLabel} onChange={(ctaLabel) => set({ ctaLabel })} />
          <TextField label="Observação abaixo do botão" value={v.ctaNote} onChange={(ctaNote) => set({ ctaNote })} />
        </Grid>
      </Card>
      <Card title="Segmentos (abas)">
        <ListEditor
          label="Abas"
          items={v.tabs}
          onChange={(tabs) => set({ tabs })}
          min={1}
          newItem={() => ({ label: "Novo segmento", title: "", lead: "", bullets: [], columns: [{ name: "Etapa 1", cards: [] }] })}
          itemTitle={(t) => t.label}
          addLabel="Adicionar segmento"
          render={(t, up) => (
            <>
              <TextField label="Nome da aba" value={t.label} onChange={(label) => up({ label })} />
              <TextField label="Título" value={t.title} onChange={(title) => up({ title })} />
              <TextArea label="Texto de apoio" value={t.lead} onChange={(lead) => up({ lead })} rows={2} />
              <ListEditor
                label="Benefícios"
                items={t.bullets}
                onChange={(bullets) => up({ bullets })}
                newItem={() => ({ title: "", text: "" })}
                itemTitle={(b) => b.title}
                addLabel="Adicionar benefício"
                render={(b, upB) => (
                  <>
                    <TextField label="Título (em negrito)" value={b.title} onChange={(title) => upB({ title })} />
                    <TextArea label="Texto" value={b.text} onChange={(text) => upB({ text })} rows={2} />
                  </>
                )}
              />
              <ListEditor
                label="Colunas do quadro (CRM ilustrativo)"
                items={t.columns}
                onChange={(columns) => up({ columns })}
                min={1}
                newItem={() => ({ name: "", cards: [] })}
                itemTitle={(c) => `${c.name} (${c.cards.length})`}
                addLabel="Adicionar coluna"
                render={(c, upC) => (
                  <>
                    <TextField label="Nome da coluna" value={c.name} onChange={(name) => upC({ name })} />
                    <WordList label="Cartões" words={c.cards} onChange={(cards) => upC({ cards })} />
                  </>
                )}
              />
            </>
          )}
        />
      </Card>
    </>
  );
}

function StepsForm({ value: v, set }: Props<"steps">) {
  return (
    <>
      <Card title="Cabeçalho da seção">
        <TextField label="Chamada" value={v.eyebrow} onChange={(eyebrow) => set({ eyebrow })} />
        <TextField label="Título" value={v.title} onChange={(title) => set({ title })} hint={HIGHLIGHT_HINT} />
        <TextField label="Texto do botão" value={v.ctaLabel} onChange={(ctaLabel) => set({ ctaLabel })} />
      </Card>
      <Card title="Passos">
        <ListEditor
          label="Passos"
          items={v.items}
          onChange={(items) => set({ items })}
          newItem={() => ({ title: "", text: "" })}
          itemTitle={(s, i) => `${i + 1}. ${s.title}`}
          addLabel="Adicionar passo"
          render={(s, up) => (
            <>
              <TextField label="Título" value={s.title} onChange={(title) => up({ title })} />
              <TextArea label="Descrição" value={s.text} onChange={(text) => up({ text })} rows={2} />
            </>
          )}
        />
      </Card>
    </>
  );
}

function PlansForm({ value: v, set }: Props<"plans">) {
  const p = v.pricing;
  const setP = (patch: Partial<typeof p>) => set({ pricing: { ...p, ...patch } });
  return (
    <>
      <Card title="Cabeçalho da seção">
        <TextField label="Chamada" value={v.eyebrow} onChange={(eyebrow) => set({ eyebrow })} />
        <TextField label="Título" value={v.title} onChange={(title) => set({ title })} hint={HIGHLIGHT_HINT} />
        <TextArea label="Texto de apoio" value={v.lead} onChange={(lead) => set({ lead })} rows={2} />
      </Card>
      <Card title="Preços da calculadora" description="Valores mensais em reais. Mudam a calculadora na hora em que você salvar.">
        <Grid>
          <NumberField label="Plano base (sem IA)" prefix="R$" value={p.base} onChange={(base) => setP({ base })} />
          <NumberField label="Acréscimo do Agente de IA" prefix="R$" value={p.aiUpgrade} onChange={(aiUpgrade) => setP({ aiUpgrade })} hint={`Com IA, o plano base fica R$ ${p.base + p.aiUpgrade}.`} />
          <NumberField label="Por usuário extra" prefix="R$" value={p.extraUser} onChange={(extraUser) => setP({ extraUser })} />
          <NumberField label="Por número conectado extra" prefix="R$" value={p.extraNumber} onChange={(extraNumber) => setP({ extraNumber })} />
          <NumberField label="Por fluxo de CRM" prefix="R$" value={p.crmFlow} onChange={(crmFlow) => setP({ crmFlow })} />
        </Grid>
      </Card>
      <Card title="Limites da calculadora">
        <Grid>
          <NumberField label="Máximo de usuários" min={1} value={p.maxUsers} onChange={(maxUsers) => setP({ maxUsers: Math.max(1, maxUsers) })} />
          <NumberField label="Máximo de números" min={1} value={p.maxNumbers} onChange={(maxNumbers) => setP({ maxNumbers: Math.max(1, maxNumbers) })} />
          <NumberField label="Máximo de fluxos de CRM" min={1} value={p.maxFlows} onChange={(maxFlows) => setP({ maxFlows: Math.max(1, maxFlows) })} />
        </Grid>
      </Card>
      <Card title="Itens inclusos em todos os planos">
        <WordList label="Itens" words={v.included} onChange={(included) => set({ included })} />
      </Card>
    </>
  );
}

function FaqForm({ value: v, set }: Props<"faq">) {
  return (
    <>
      <Card title="Cabeçalho da seção">
        <TextField label="Chamada" value={v.eyebrow} onChange={(eyebrow) => set({ eyebrow })} />
        <TextField label="Título" value={v.title} onChange={(title) => set({ title })} hint={HIGHLIGHT_HINT} />
      </Card>
      <Card title="Perguntas">
        <ListEditor
          label="Perguntas e respostas"
          items={v.items}
          onChange={(items) => set({ items })}
          newItem={() => ({ q: "", a: "" })}
          itemTitle={(f) => f.q}
          addLabel="Adicionar pergunta"
          render={(f, up) => (
            <>
              <TextField label="Pergunta" value={f.q} onChange={(q) => up({ q })} />
              <TextArea label="Resposta" value={f.a} onChange={(a) => up({ a })} rows={4} />
            </>
          )}
        />
      </Card>
    </>
  );
}

function CtaForm({ value: v, set }: Props<"cta">) {
  return (
    <Card title="Chamada final" description="O bloco escuro antes do rodapé.">
      <TextField label="Chamada" value={v.eyebrow} onChange={(eyebrow) => set({ eyebrow })} />
      <TextField label="Título" value={v.title} onChange={(title) => set({ title })} hint={HIGHLIGHT_HINT} />
      <TextArea label="Texto de apoio" value={v.lead} onChange={(lead) => set({ lead })} rows={2} />
      <Grid>
        <TextField label="Botão principal (WhatsApp)" value={v.primary} onChange={(primary) => set({ primary })} />
        <TextField label="Botão secundário (cadastro)" value={v.secondary} onChange={(secondary) => set({ secondary })} />
      </Grid>
      <TextField label="Observação" value={v.note} onChange={(note) => set({ note })} hint="Deixe em branco para esconder." />
    </Card>
  );
}

function HeaderFooterForm({ value, set }: { value: Pick<SiteContent, "header" | "footer">; set: (patch: Partial<SiteContent>) => void }) {
  const h = value.header;
  const f = value.footer;
  return (
    <>
      <Card title="Cabeçalho">
        <Grid>
          <TextField label="Botão de login" value={h.loginLabel} onChange={(loginLabel) => set({ header: { ...h, loginLabel } })} />
          <TextField label="Botão de destaque" value={h.ctaLabel} onChange={(ctaLabel) => set({ header: { ...h, ctaLabel } })} />
        </Grid>
      </Card>
      <Card title="Rodapé">
        <TextArea label="Texto sobre o ZumTalk" value={f.about} onChange={(about) => set({ footer: { ...f, about } })} rows={2} />
        <TextField label="Linha de direitos autorais" value={f.copyright} onChange={(copyright) => set({ footer: { ...f, copyright } })} hint="O “© ano” é colocado automaticamente." />
      </Card>
    </>
  );
}

function SettingsForm({ value: v, set }: Props<"settings">) {
  return (
    <>
      <Card title="WhatsApp" description="Usado em todos os botões de WhatsApp do site.">
        <TextField label="Número com DDI e DDD" value={v.whatsappNumber} onChange={(whatsappNumber) => set({ whatsappNumber })} hint="Só números, ex.: 5514996824149" />
        <TextArea label="Mensagem inicial" value={v.whatsappMessage} onChange={(whatsappMessage) => set({ whatsappMessage })} rows={2} />
      </Card>
      <Card title="Links do sistema">
        <TextField label="Cadastro (teste grátis)" value={v.signupUrl} onChange={(signupUrl) => set({ signupUrl })} type="url" />
        <TextField label="Login" value={v.loginUrl} onChange={(loginUrl) => set({ loginUrl })} type="url" />
        <TextField label="Teste grátis a partir da calculadora" value={v.trialUrl} onChange={(trialUrl) => set({ trialUrl })} type="url" />
      </Card>
      <Card title="Contato e institucional">
        <TextField label="E-mail" value={v.email} onChange={(email) => set({ email })} type="email" />
        <Grid>
          <TextField label="Política de privacidade" value={v.privacyUrl} onChange={(privacyUrl) => set({ privacyUrl })} type="url" />
          <TextField label="Termos de uso" value={v.termsUrl} onChange={(termsUrl) => set({ termsUrl })} type="url" />
        </Grid>
        <TextField label="Site da Agência ZUM" value={v.agencyUrl} onChange={(agencyUrl) => set({ agencyUrl })} type="url" />
      </Card>
    </>
  );
}

export type SectionDef = {
  slug: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  render: (c: SiteContent, update: (patch: Partial<SiteContent>) => void) => ReactNode;
};

// Liga cada formulário à sua parte do conteúdo.
function bind<K extends keyof SiteContent>(key: K, Form: ComponentType<Props<K>>) {
  return (c: SiteContent, update: (patch: Partial<SiteContent>) => void) => (
    <Form value={c[key]} set={(patch) => update({ [key]: { ...c[key], ...patch } } as Partial<SiteContent>)} />
  );
}

export const SECTIONS: SectionDef[] = [
  { slug: "hero", label: "Topo (hero)", icon: Home, render: bind("hero", HeroForm) },
  { slug: "recursos", label: "Recursos", icon: Sparkles, render: bind("features", FeaturesForm) },
  { slug: "para-quem-e", label: "Para quem é", icon: Users, render: bind("niches", NichesForm) },
  { slug: "como-funciona", label: "Como funciona", icon: Footprints, render: bind("steps", StepsForm) },
  { slug: "planos", label: "Planos e preços", icon: BadgeDollarSign, render: bind("plans", PlansForm) },
  { slug: "duvidas", label: "Dúvidas (FAQ)", icon: CircleHelp, render: bind("faq", FaqForm) },
  { slug: "chamada-final", label: "Chamada final", icon: Megaphone, render: bind("cta", CtaForm) },
  { slug: "cabecalho-rodape", label: "Cabeçalho e rodapé", icon: PanelBottom, render: (c, u) => <HeaderFooterForm value={c} set={u} /> },
  { slug: "configuracoes", label: "Links e contato", icon: Settings, render: bind("settings", SettingsForm) },
];

export const OVERVIEW_ICON = LayoutGrid;
