// Tudo que muda com frequência fica aqui.

export const WHATSAPP_NUMBER = "5514996824149";
export const WHATSAPP_URL =
  `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}` +
  `&text=${encodeURIComponent("Olá! Gostaria de saber mais sobre o ZumTalk.")}&type=phone_number&app_absent=0`;

export const SIGNUP_URL = "https://sistema.zumtalk.com/pt/users/sign_up";
export const LOGIN_URL = "https://sistema.zumtalk.com/";
export const TRIAL_URL = "https://sistema.zumtalk.com/enrollment/new?product=Teste+Gr%C3%A1tis";

// Preços da calculadora (lidos de zumtalk.com/planos em 05/10/2026).
// Confirmados com +1 unidade de cada item; confira se há desconto por volume.
export const PRICING = {
  base: 95,          // plano base, sem IA
  aiUpgrade: 90,     // com Agente de IA o base passa de R$ 95 para R$ 185
  extraUser: 50,     // por usuário humano extra (máx. 20)
  extraNumber: 20,   // por número conectado extra (máx. 20)
  crmFlow: 15,       // por fluxo de CRM (máx. 10)
  maxUsers: 20,
  maxNumbers: 20,
  maxFlows: 10,
};
export const BASE_PRICE = PRICING.base;

// Números de prova social mantidos do site anterior.
// Atenção: a Meta pode reprovar anúncios com alegações que você não consiga comprovar.
export const PROOF = {
  companies: "+500",
  rating: "4.9/5.0",
  monthly: "+10.000",
};

// Links do rodapé. Troque quando as páginas do ZumTalk existirem.
export const LINKS = {
  privacy: "https://www.agenciazum.com.br/privacidade",
  terms: "https://www.agenciazum.com.br/termos",
  agency: "https://www.agenciazum.com.br/",
  email: "mailto:zum@agenciazum.com.br",
};
