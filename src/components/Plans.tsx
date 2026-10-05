import { useMemo, useState } from "react";
import { PRICING, TRIAL_URL, WHATSAPP_NUMBER } from "../config";
import { Check, Container, SectionTitle, WhatsIcon } from "./ui";

const brl = (n: number) => `R$ ${n.toLocaleString("pt-BR")}`;

function Slider({
  id, label, hint, value, min, max, onChange, extra,
}: {
  id: string; label: string; hint: string; value: number; min: number; max: number;
  onChange: (v: number) => void; extra: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="py-6">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="font-bold text-ink-900">{label}</label>
        <span className="grid h-9 min-w-9 place-items-center rounded-full bg-brand-50 px-3 font-heading font-extrabold text-brand-700">
          {value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full accent-brand-600"
        style={{ background: `linear-gradient(to right, #00638a ${pct}%, #e4ecf0 ${pct}%)` }}
        aria-describedby={`${id}-hint`}
      />
      <p id={`${id}-hint`} className="mt-2 flex justify-between text-sm text-mist-500">
        <span>{hint}</span>
        <span className="font-semibold text-ink-700">{extra}</span>
      </p>
    </div>
  );
}

function Switch({
  label, hint, checked, onChange,
}: { label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-6 py-6">
      <div>
        <p className="font-bold text-ink-900">{label}</p>
        <p className="mt-1 text-sm text-mist-500">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? "bg-brand-600" : "bg-mist-200"}`}
      >
        <span className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}

export default function Plans() {
  const [users, setUsers] = useState(1);
  const [numbers, setNumbers] = useState(1);
  const [ai, setAi] = useState(false);
  const [crm, setCrm] = useState(false);
  const [flows, setFlows] = useState(1);

  const calc = useMemo(() => {
    const base = PRICING.base + (ai ? PRICING.aiUpgrade : 0);
    const usersCost = (users - 1) * PRICING.extraUser;
    const numbersCost = (numbers - 1) * PRICING.extraNumber;
    const flowsCost = crm ? flows * PRICING.crmFlow : 0;
    return { base, usersCost, numbersCost, flowsCost, total: base + usersCost + numbersCost + flowsCost };
  }, [users, numbers, ai, crm, flows]);

  const included = [
    `${users} usuário${users > 1 ? "s" : ""} humano${users > 1 ? "s" : ""}`,
    `${numbers} número${numbers > 1 ? "s" : ""} conectado${numbers > 1 ? "s" : ""}`,
    ...(ai ? ["Agente de IA avançado"] : []),
    ...(crm ? [`${flows} fluxo${flows > 1 ? "s" : ""} de CRM`] : []),
    "Gestão de contatos", "Gestão de oportunidades", "Gestão de produtos",
    "Gestão de tarefas", "Automação", "Notificações", "Cadência",
  ];

  const msg =
    `Olá! Quero montar meu plano do ZumTalk: ${users} usuário(s), ${numbers} número(s)` +
    `${ai ? ", com Agente de IA" : ", sem IA"}${crm ? `, ${flows} fluxo(s) de CRM` : ""}. ` +
    `Total: ${brl(calc.total)}/mês.`;
  const waUrl = `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(msg)}&type=phone_number&app_absent=0`;

  return (
    <section id="planos" className="bg-white py-20 sm:py-28">
      <Container>
        <SectionTitle
          center
          eyebrow="Planos"
          title="Monte o plano do tamanho do seu negócio."
          lead="Pague apenas pelo que usar. Ajuste usuários, números, IA e fluxos de CRM e veja o valor na hora."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 [&>*]:min-w-0 lg:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-sm border border-mist-200 bg-white p-6 shadow-xl shadow-ink-900/5 sm:p-8">
            <p className="eyebrow text-brand-600">{"// "}Calculadora de planos</p>
            <p className="mt-2 text-sm text-mist-500">Ajuste os valores para personalizar seu plano.</p>

            <div className="mt-4 divide-y divide-mist-100">
              <Slider
                id="users" label="Usuários humanos" min={1} max={PRICING.maxUsers} value={users}
                onChange={setUsers}
                hint={users === 1 ? "1 incluso no plano base" : `${users - 1} extra${users > 2 ? "s" : ""} × ${brl(PRICING.extraUser)}`}
                extra={users > 1 ? `+ ${brl(calc.usersCost)}` : ""}
              />
              <Slider
                id="numbers" label="Números conectados" min={1} max={PRICING.maxNumbers} value={numbers}
                onChange={setNumbers}
                hint={numbers === 1 ? "1 incluso no plano base" : `${numbers - 1} extra${numbers > 2 ? "s" : ""} × ${brl(PRICING.extraNumber)}`}
                extra={numbers > 1 ? `+ ${brl(calc.numbersCost)}` : ""}
              />
              <Switch
                label="Agente de IA"
                hint={ai ? `Plano base passa de ${brl(PRICING.base)} para ${brl(PRICING.base + PRICING.aiUpgrade)}` : "Adicione IA avançada ao seu plano"}
                checked={ai}
                onChange={setAi}
              />
              <div>
                <Switch
                  label="Fluxos de CRM"
                  hint="Adicione fluxos de CRM editáveis ao seu plano"
                  checked={crm}
                  onChange={setCrm}
                />
                {crm && (
                  <div className="-mt-2 pb-2">
                    <Slider
                      id="flows" label="Quantidade de fluxos" min={1} max={PRICING.maxFlows} value={flows}
                      onChange={setFlows}
                      hint={`${flows} fluxo${flows > 1 ? "s" : ""} × ${brl(PRICING.crmFlow)}`}
                      extra={`+ ${brl(calc.flowsCost)}`}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="flex flex-col rounded-sm bg-ink-900 p-6 text-white sm:p-8" aria-live="polite">
            <p className="eyebrow text-brand-400">{"// "}Seu plano personalizado</p>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-mist-300">Plano base{ai ? " (com IA)" : " (sem IA)"}</dt>
                <dd className="font-semibold">{brl(calc.base)}</dd>
              </div>
              {users > 1 && (
                <div className="flex justify-between gap-4">
                  <dt className="text-mist-300">{users - 1} usuário{users > 2 ? "s" : ""} extra{users > 2 ? "s" : ""}</dt>
                  <dd className="font-semibold">+ {brl(calc.usersCost)}</dd>
                </div>
              )}
              {numbers > 1 && (
                <div className="flex justify-between gap-4">
                  <dt className="text-mist-300">{numbers - 1} conexão{numbers > 2 ? "ões" : ""} extra{numbers > 2 ? "s" : ""}</dt>
                  <dd className="font-semibold">+ {brl(calc.numbersCost)}</dd>
                </div>
              )}
              {crm && (
                <div className="flex justify-between gap-4">
                  <dt className="text-mist-300">{flows} fluxo{flows > 1 ? "s" : ""} de CRM</dt>
                  <dd className="font-semibold">+ {brl(calc.flowsCost)}</dd>
                </div>
              )}
            </dl>

            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="text-sm text-mist-300">Total</p>
              <p className="mt-1 flex items-end gap-1">
                <span className="font-heading text-5xl font-extrabold text-white">{brl(calc.total)}</span>
                <span className="pb-1.5 text-mist-300">/mês</span>
              </p>
            </div>

            <ul className="mt-6 grid gap-2.5 text-sm text-mist-200">
              {included.map((i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>

            <a href={TRIAL_URL} className="btn btn-primary-dark mt-8 w-full">
              Preparar meu teste grátis de 7 dias
            </a>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark mt-3 w-full">
              <WhatsIcon className="h-4 w-4" /> Enviar este plano pelo WhatsApp
            </a>
            <p className="mt-4 text-center text-xs text-mist-500">Sem cartão de crédito · 7 dias grátis</p>
          </aside>
        </div>
      </Container>
    </section>
  );
}
