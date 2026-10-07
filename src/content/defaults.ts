// Conteúdo padrão da landing page. O que for salvo no painel /admin substitui estes valores.
// Nos títulos, *palavra* aparece destacada em azul.

export type Item = { title: string; text: string };

export type SiteContent = {
  settings: {
    whatsappNumber: string;
    whatsappMessage: string;
    signupUrl: string;
    loginUrl: string;
    trialUrl: string;
    email: string;
    privacyUrl: string;
    termsUrl: string;
    agencyUrl: string;
  };
  header: { loginLabel: string; ctaLabel: string };
  hero: {
    eyebrow: string;
    titleBefore: string;
    rotatingWords: string[];
    rotateSeconds: number;
    titleHighlight: string;
    titleAfter: string;
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    note: string;
    stats: { value: string; label: string }[];
    chatName: string;
    chat: { from: "client" | "bot"; text: string }[];
  };
  trust: {
    show: boolean;
    eyebrow: string;
    title: string;
    lead: string;
    pathsTitle: string;
    pathsLead: string;
    // Sempre dois caminhos: [0] API oficial com número dedicado, [1] Coexistência.
    paths: { tag: string; title: string; text: string; bullets: string[]; note: string }[];
  };
  features: { eyebrow: string; title: string; lead: string; items: Item[] };
  niches: {
    eyebrow: string;
    title: string;
    lead: string;
    ctaLabel: string;
    ctaNote: string;
    tabs: {
      label: string;
      title: string;
      lead: string;
      bullets: Item[];
      columns: { name: string; cards: string[] }[];
    }[];
  };
  steps: { eyebrow: string; title: string; ctaLabel: string; items: Item[] };
  plans: {
    eyebrow: string;
    title: string;
    lead: string;
    included: string[];
    pricing: {
      base: number;
      aiUpgrade: number;
      extraUser: number;
      extraNumber: number;
      crmFlow: number;
      maxUsers: number;
      maxNumbers: number;
      maxFlows: number;
    };
  };
  blog: { show: boolean; eyebrow: string; title: string; lead: string; ctaLabel: string };
  faq: { eyebrow: string; title: string; items: { q: string; a: string }[] };
  cta: { eyebrow: string; title: string; lead: string; primary: string; secondary: string; note: string };
  footer: { about: string; copyright: string };
};

export const DEFAULT_CONTENT: SiteContent = {
  settings: {
    whatsappNumber: "5514996824149",
    whatsappMessage: "Olá! Gostaria de saber mais sobre o ZumTalk.",
    signupUrl: "https://sistema.zumtalk.com/pt/users/sign_up",
    loginUrl: "https://sistema.zumtalk.com/",
    trialUrl: "https://sistema.zumtalk.com/enrollment/new?product=Teste+Gr%C3%A1tis",
    email: "zum@agenciazum.com.br",
    privacyUrl: "https://www.agenciazum.com.br/privacidade",
    termsUrl: "https://www.agenciazum.com.br/termos",
    agencyUrl: "https://www.agenciazum.com.br/",
  },
  header: { loginLabel: "Entrar", ctaLabel: "Teste grátis" },
  hero: {
    eyebrow: "Chatbot com IA e CRM para WhatsApp",
    titleBefore: "Seu WhatsApp",
    rotatingWords: ["vendendo", "atendendo", "qualificando", "agendando"],
    rotateSeconds: 4,
    titleHighlight: "sozinho",
    titleAfter: ", 24 horas por dia.",
    lead:
      "O ZumTalk atende seus clientes na hora, qualifica cada lead e organiza tudo em um CRM visual. Você para de perder venda por demora, esquecimento ou falta de follow-up.",
    ctaPrimary: "Falar com o bot no WhatsApp",
    ctaSecondary: "Testar grátis por 7 dias →",
    note: "Sem cartão de crédito · Configuração em 5 minutos · Suporte em português",
    stats: [
      { value: "+500", label: "empresas atendidas" },
      { value: "4.9/5.0", label: "avaliação média" },
      { value: "+10.000", label: "atendimentos por mês" },
    ],
    chatName: "Atendimento ZumTalk",
    chat: [
      { from: "client", text: "Oi! Vocês fazem orçamento para amanhã?" },
      { from: "bot", text: "Olá! Faço sim. Me conta rapidinho o que você precisa e já separo o melhor horário." },
      { from: "client", text: "Preciso de 2 unidades, entrega em Lençóis." },
      { from: "bot", text: "Perfeito! Enviei a proposta e avisei o vendedor da vez. Posso confirmar pelo PIX?" },
    ],
  },
  trust: {
    show: true,
    eyebrow: "Tecnologia oficial",
    title: "Parceiro oficial da Meta, conectado pela *API oficial* do WhatsApp.",
    lead: "Seu número funciona pela WhatsApp Business API, dentro das regras da Meta. Mais estabilidade e segurança, sem as conexões não oficiais que colocam o número em risco de bloqueio.",
    pathsTitle: "Duas formas de conectar o seu número",
    pathsLead: "Escolha o caminho que combina com a sua operação. Os dois são oficiais da Meta.",
    paths: [
      {
        tag: "API oficial",
        title: "Número dedicado ao ZumTalk",
        text: "O número é conectado direto na WhatsApp Business API e passa a funcionar só pelo ZumTalk, com o bot e a equipe atendendo juntos.",
        bullets: [
          "Ideal para equipes e alto volume de mensagens",
          "Vários atendentes no mesmo número, sem depender de um celular",
          "Maior capacidade de envio",
        ],
        note: "O número deixa de funcionar no aplicativo do WhatsApp no celular.",
      },
      {
        tag: "Novo · Coexistência",
        title: "Mesmo número no app e no ZumTalk",
        text: "Você continua usando o WhatsApp Business no celular e conecta o mesmo número ao ZumTalk. As conversas aparecem nos dois lugares.",
        bullets: [
          "Conversas dos últimos 6 meses importadas",
          "O que você responde no celular aparece no ZumTalk, e vice-versa",
          "Sem trocar de número nem avisar os clientes",
        ],
        note: "Grupos não são sincronizados, e listas de transmissão e mensagens temporárias ficam desativadas. Abra o app no celular com frequência para a conexão continuar ativa.",
      },
    ],
  },
  features: {
    eyebrow: "Por que escolher o ZumTalk",
    title: "Recursos poderosos para *revolucionar* o seu atendimento.",
    lead: "Tudo que uma operação de vendas pelo WhatsApp precisa, em uma plataforma só.",
    items: [
      { title: "IA avançada", text: "Chatbot com inteligência artificial que aprende e melhora continuamente com cada interação." },
      { title: "Respostas instantâneas", text: "Atendimento automático em tempo real, sem fila e sem tempo de espera para o seu cliente." },
      { title: "Mais vendas", text: "Qualifique leads automaticamente e converta mais conversas em negócios fechados." },
      { title: "Disponível 24/7", text: "Atendimento ininterrupto, todos os dias da semana, sem custo extra de equipe." },
      { title: "Seguro e confiável", text: "Dados criptografados e conformidade com a LGPD para a sua tranquilidade." },
      { title: "Integração com WhatsApp", text: "Conecte o WhatsApp Business em poucos cliques e fale com o cliente onde ele já está." },
    ],
  },
  niches: {
    eyebrow: "Para quem é",
    title: "O ZumTalk trabalha do jeito que *você* trabalha.",
    lead: "Não importa o seu nicho. Otimize seu fluxo em minutos com uma interface 100% flexível.",
    ctaLabel: "Ver modelos e começar teste grátis →",
    ctaNote: "Já temos modelos prontos para o seu nicho.",
    tabs: [
      {
        label: "Times de Vendas",
        title: "Transforme o WhatsApp em um CRM de verdade.",
        lead: "Pare de perder vendas por falta de follow-up ou esquecimento.",
        bullets: [
          { title: "Pipeline visual", text: "Arraste o cliente de “Novo Lead” para “Proposta Enviada” e “Fechamento”." },
          { title: "Distribuição de leads", text: "Chegou mensagem nova? O sistema entrega para o vendedor da vez automaticamente." },
          { title: "Histórico centralizado", text: "O vendedor saiu da empresa? O histórico da negociação fica com você." },
        ],
        columns: [
          { name: "Prospecção", cards: ["Clínica Vida", "Auto Center JR"] },
          { name: "Qualificação", cards: ["Mercadão Sul"] },
          { name: "Proposta enviada", cards: ["Imob. Centro", "Pet Feliz"] },
          { name: "Negociação", cards: ["Escola Futuro"] },
          { name: "Venda fechada", cards: ["Studio Bela"] },
        ],
      },
      {
        label: "Serviços e Agendamentos",
        title: "Agenda cheia sem ficar preso ao celular.",
        lead: "O bot conversa, tira dúvidas e leva o cliente até o horário marcado.",
        bullets: [
          { title: "Qualificação automática", text: "O bot pergunta o que precisa antes de chegar até a sua equipe." },
          { title: "Tarefas e lembretes", text: "Notificações e cadência para confirmar e retomar contatos sem esforço." },
          { title: "Contatos organizados", text: "Cada paciente ou cliente com histórico completo da conversa." },
        ],
        columns: [
          { name: "Novo contato", cards: ["Maria S.", "João P."] },
          { name: "Triagem", cards: ["Carla M."] },
          { name: "Agendado", cards: ["Rafael T.", "Ana L."] },
          { name: "Confirmado", cards: ["Paulo H."] },
          { name: "Atendido", cards: ["Bia R."] },
        ],
      },
      {
        label: "Varejo e Delivery",
        title: "Pedido entra, loja responde, venda acontece.",
        lead: "Cardápio, catálogo e dúvidas respondidos na hora, a qualquer horário.",
        bullets: [
          { title: "Gestão de produtos", text: "Seu catálogo dentro da conversa, com respostas automáticas sobre itens e valores." },
          { title: "Oportunidades por etapa", text: "Acompanhe cada pedido do primeiro “oi” até a entrega." },
          { title: "Automação de rotina", text: "Mensagens de pós-venda e recompra no automático." },
        ],
        columns: [
          { name: "Pedido novo", cards: ["#1042", "#1043"] },
          { name: "Confirmado", cards: ["#1041"] },
          { name: "Em preparo", cards: ["#1039", "#1040"] },
          { name: "Saiu p/ entrega", cards: ["#1038"] },
          { name: "Entregue", cards: ["#1037"] },
        ],
      },
    ],
  },
  steps: {
    eyebrow: "Como funciona",
    title: "Em 3 passos simples, seu chatbot está no ar.",
    ctaLabel: "Começar gratuitamente",
    items: [
      { title: "Conecte seu WhatsApp", text: "Integração simples e rápida com o WhatsApp Business, em poucos cliques." },
      { title: "Configure sua IA", text: "Personalize respostas, fluxos e tom de voz de acordo com o seu negócio." },
      { title: "Comece a atender", text: "Seu chatbot está pronto para atender os clientes automaticamente." },
    ],
  },
  plans: {
    eyebrow: "Planos",
    title: "Monte o plano do tamanho do seu negócio.",
    lead: "Pague apenas pelo que usar. Ajuste usuários, números, IA e fluxos de CRM e veja o valor na hora.",
    included: [
      "Gestão de contatos",
      "Gestão de oportunidades",
      "Gestão de produtos",
      "Gestão de tarefas",
      "Automação",
      "Notificações",
      "Cadência",
    ],
    pricing: {
      base: 95,
      aiUpgrade: 90,
      extraUser: 50,
      extraNumber: 20,
      crmFlow: 15,
      maxUsers: 20,
      maxNumbers: 20,
      maxFlows: 10,
    },
  },
  blog: {
    show: true,
    eyebrow: "Blog",
    title: "Conteúdo para *vender mais* pelo WhatsApp.",
    lead: "Dicas de atendimento, automação e IA para o seu time.",
    ctaLabel: "Ver todos os artigos →",
  },
  faq: {
    eyebrow: "Dúvidas frequentes",
    title: "Perguntas que todo mundo faz.",
    items: [
      { q: "Preciso de cartão de crédito para testar?", a: "Não. O teste grátis de 7 dias não pede cartão, e a configuração leva cerca de 5 minutos." },
      { q: "O ZumTalk usa a API oficial do WhatsApp?", a: "Sim. O ZumTalk é parceiro oficial da Meta (Meta Business Partner) e conecta seu número pela WhatsApp Business API, a integração oficial. Isso traz mais estabilidade e evita os bloqueios comuns em ferramentas que usam conexões não oficiais." },
      { q: "Posso continuar usando o WhatsApp no celular?", a: "Sim, com a Coexistência. Você conecta ao ZumTalk o mesmo número que já usa no app WhatsApp Business, e as conversas ficam sincronizadas nos dois lugares, inclusive o histórico dos últimos 6 meses. Se preferir um número só para o ZumTalk, com mais capacidade de envio e vários atendentes, usamos a API oficial com número dedicado." },
      { q: "Funciona com o WhatsApp Business?", a: "Sim. Você conecta o seu WhatsApp Business em poucos cliques e começa a atender pelo ZumTalk." },
      { q: "O que o plano base inclui?", a: "1 usuário, 1 número conectado, gestão de contatos, oportunidades, produtos e tarefas, além de automação, notificações e cadência. O Agente de IA, usuários e números extras e os fluxos de CRM são adicionais e entram na calculadora de planos." },
      { q: "Meus dados estão seguros?", a: "Os dados são criptografados e a plataforma está em conformidade com a LGPD." },
      { q: "Consigo adaptar ao meu tipo de negócio?", a: "Sim. A interface é flexível e temos modelos prontos para times de vendas, serviços e agendamentos, varejo e delivery." },
      { q: "Quem está por trás do ZumTalk?", a: "O ZumTalk é um produto da Agência ZUM, de Lençóis Paulista (SP), com mais de 20 anos de experiência em marketing, tecnologia e automação com IA." },
    ],
  },
  cta: {
    eyebrow: "Vamos conversar",
    title: "Pronto para transformar seu atendimento?",
    lead: "Junte-se às empresas que já automatizaram o atendimento e aumentaram suas vendas com o ZumTalk.",
    primary: "Falar com um especialista",
    secondary: "Iniciar teste grátis",
    note: "Sem cartão de crédito · Configuração em 5 minutos · Suporte em português",
  },
  footer: {
    about: "Chatbot inteligente para WhatsApp que transforma seu atendimento e aumenta suas vendas com IA conversacional.",
    copyright: "ZumTalk, um produto da Agência ZUM · Lençóis Paulista, SP. Todos os direitos reservados.",
  },
};

// Junta o conteúdo salvo com o padrão, campo a campo, para que seções novas
// adicionadas ao código apareçam mesmo que o conteúdo salvo seja mais antigo.
export function mergeContent(saved: unknown): SiteContent {
  const merge = (base: unknown, over: unknown): unknown => {
    if (Array.isArray(base)) return Array.isArray(over) ? over : base;
    if (base && typeof base === "object") {
      const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
      if (over && typeof over === "object" && !Array.isArray(over)) {
        for (const k of Object.keys(out)) {
          if (k in (over as Record<string, unknown>)) out[k] = merge(out[k], (over as Record<string, unknown>)[k]);
        }
      }
      return out;
    }
    return over === undefined || over === null || typeof over !== typeof base ? base : over;
  };
  return merge(DEFAULT_CONTENT, saved) as SiteContent;
}
