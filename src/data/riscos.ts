// Matriz de RISCOS / Passivo Tributário — qualificação por CNAE e regime
import type { Regime } from "./teses";

export type Probabilidade = "Alta" | "Média" | "Baixa";
export type ImpactoR = "Alto" | "Médio" | "Baixo";
export type AreaR =
  | "PIS/COFINS"
  | "ICMS"
  | "IRPJ/CSLL"
  | "Previdenciário"
  | "Outros";

export interface Risco {
  id: string;
  nome: string;
  area: AreaR;
  probabilidade: Probabilidade;
  impacto: ImpactoR;
  regimes: Regime[];
  cnae_fn: (cnae: string) => boolean;
  lei: string;
  descricao: string;
  como_mitigar: string[];
  alerta: string;
  /** % conservador estimado de contingência sobre faturamento (anual) */
  pct_cont?: number;
}

const ALL: Regime[] = ["Simples Nacional", "Lucro Presumido", "Lucro Real"];
const PRES_REAL: Regime[] = ["Lucro Presumido", "Lucro Real"];
const REAL: Regime[] = ["Lucro Real"];

const sempre = () => true;
const cnaePrefix = (prefixos: string[]) => (cnae: string) => {
  const c = (cnae || "").replace(/\D/g, "");
  return prefixos.some((p) => c.slice(0, p.length) === p);
};

export const RISCOS: Risco[] = [
  {
    id: "R01",
    nome: "Autuação por não exclusão do ICMS Gross Up da base PIS/COFINS",
    area: "PIS/COFINS",
    probabilidade: "Média",
    impacto: "Alto",
    regimes: PRES_REAL,
    cnae_fn: sempre,
    lei: "Lei 14.592/2023 · Tema 69/STF (interpretação restritiva da RFB)",
    descricao:
      "A RFB tem autuado contribuintes que excluíram o ICMS gross up da base PIS/COFINS com base no Tema 69, por entender que a decisão do STF autorizou apenas a exclusão do ICMS destacado, não do embutido na precificação.",
    como_mitigar: [
      "Revisar metodologia de cálculo da exclusão do ICMS",
      "Verificar se a empresa utiliza gross up na precificação",
      "Provisionar contingência se já excluiu o gross up",
      "Aguardar posicionamento definitivo dos TRFs",
    ],
    alerta:
      "TRF5 já negou a tese (08031280820244058300, 29/10/2024). Se sua empresa já está excluindo o gross up, provisionar contingência imediatamente.",
    pct_cont: 0.003,
  },
  {
    id: "R02",
    nome: "Autuação por aproveitamento indevido de créditos PIS/COFINS sobre insumos",
    area: "PIS/COFINS",
    probabilidade: "Alta",
    impacto: "Alto",
    regimes: REAL,
    cnae_fn: sempre,
    lei: "STJ Tema 779 (REsp 1.221.170) · STF Tema 756 · Art. 3º, II, Leis 10.637/02 e 10.833/03",
    descricao:
      "Após o STJ definir o conceito ampliado de insumo (essencialidade e relevância), a RFB tem autuado contribuintes que aproveitaram créditos sobre itens que, na visão fiscal, não atendem os critérios — especialmente serviços de terceiros, embalagens e despesas financeiras.",
    como_mitigar: [
      "Revisar o mapeamento de insumos e confrontar com a jurisprudência do Tema 779",
      "Obter laudo técnico fundamentando a essencialidade de cada insumo",
      "Evitar aproveitamento de créditos sobre despesas financeiras (Tema 939/STF é desfavorável)",
      "Documentar a relevância de cada item para o processo produtivo",
    ],
    alerta:
      "A RFB lavra autos de infração retroativos por até 5 anos. Créditos sem documentação robusta geram autuação com multa de 75% + juros SELIC.",
    pct_cont: 0.005,
  },
  {
    id: "R03",
    nome: "Risco de redirecionamento de execução fiscal para sócios (Art. 135 CTN)",
    area: "Previdenciário",
    probabilidade: "Média",
    impacto: "Alto",
    regimes: ALL,
    cnae_fn: sempre,
    lei: "Art. 135, III, CTN · STJ Tema 630 (REsp 1.645.281) · STJ Súmula 430",
    descricao:
      "Empresas com débitos fiscais em execução estão sujeitas ao redirecionamento para os sócios administradores, especialmente em casos de dissolução irregular (encerramento sem baixa formal) ou quando a empresa não é localizada.",
    como_mitigar: [
      "Manter os dados cadastrais atualizados na Receita Federal e Junta Comercial",
      "Efetuar baixa formal da empresa se encerrar as atividades",
      "Documentar todas as decisões administrativas",
      "Evitar confusão patrimonial entre empresa e sócios",
    ],
    alerta:
      "O simples inadimplemento NÃO autoriza o redirecionamento (Súmula 430). Mas dissolução irregular autoriza automaticamente (Tema 630).",
  },
  {
    id: "R04",
    nome: "Autuação por distribuição disfarçada de lucros (DDL)",
    area: "IRPJ/CSLL",
    probabilidade: "Média",
    impacto: "Alto",
    regimes: PRES_REAL,
    cnae_fn: sempre,
    lei: "Arts. 60–63 Lei 9.249/95 · Arts. 464–469 RIR/2018 · IN RFB 1.700/2017",
    descricao:
      "A RFB autua empresas que realizam transações com partes relacionadas (sócios, familiares, coligadas) em condições divergentes do mercado — empréstimos sem juros a sócios, aluguéis abaixo do mercado, honorários excessivos.",
    como_mitigar: [
      "Revisar contratos com partes relacionadas e comparar com preços de mercado",
      "Formalizar empréstimos a sócios com taxa de juros adequada",
      "Documentar a base de cálculo de honorários de administração",
      "Contratar avaliações independentes para operações imobiliárias",
    ],
    alerta:
      "DDL implica IRPJ/CSLL sobre o valor distribuído mais multa qualificada de 150% em caso de dolo. Lei 14.596/2023 reformou o regime de TP (padrão OCDE) a partir de 2024.",
    pct_cont: 0.002,
  },
  {
    id: "R05",
    nome: "Risco de enquadramento como devedor contumaz (ICMS)",
    area: "ICMS",
    probabilidade: "Baixa",
    impacto: "Alto",
    regimes: ALL,
    cnae_fn: cnaePrefix([
      "10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","45","46","47",
    ]),
    lei: "LC 195/2023 · Decreto PR 12.066/2023 · Regulamentações estaduais",
    descricao:
      "A LC 195/2023 criou o regime diferenciado para devedores contumazes de ICMS. O enquadramento pode resultar em cassação de inscrição estadual, substituição tributária compulsória e bloqueio de operações.",
    como_mitigar: [
      "Monitorar o histórico de recolhimento de ICMS",
      "Evitar parcelamentos sucessivos sem cumprimento",
      "Regularizar débitos antes de atingir os limites da LC 195/2023",
      "Verificar regulamentação estadual específica",
    ],
    alerta:
      "Empresa enquadrada como devedora contumaz sofre substituição tributária automática — impacto severo no fluxo de caixa.",
  },
  {
    id: "R06",
    nome: "Autuação por contribuições previdenciárias sobre verbas remuneratórias",
    area: "Previdenciário",
    probabilidade: "Alta",
    impacto: "Médio",
    regimes: ALL,
    cnae_fn: sempre,
    lei: "Art. 22 Lei 8.212/91 · STF Tema 20 (RE 565.160) · IN RFB 2.110/2022",
    descricao:
      "A RFB frequentemente autua empresas que tratam como indenizatórias verbas que a Receita classifica como remuneratórias — PLR sem acordo formal, prêmios habituais, ajudas de custo excessivas e stock options.",
    como_mitigar: [
      "Revisar enquadramento das verbas conforme tabela de risco",
      "Formalizar acordos de PLR com comissão paritária",
      "Documentar habitualidade ou não-habitualidade de prêmios",
      "Obter parecer jurídico para verbas de risco alto",
    ],
    alerta:
      "Stock options: a RFB tem classificado como remuneração quando o exercício não tem risco. STJ ainda não pacificou — provisionar contingência.",
    pct_cont: 0.004,
  },
  {
    id: "R07",
    nome: "Glosa de créditos de ICMS por ausência de documentação idônea",
    area: "ICMS",
    probabilidade: "Alta",
    impacto: "Médio",
    regimes: PRES_REAL,
    cnae_fn: cnaePrefix([
      "10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33",
    ]),
    lei: "Art. 23 LC 87/1996 · Art. 136 CTN · Súmula 509 STJ",
    descricao:
      "O Fisco Estadual glosa créditos de ICMS quando o fornecedor está irregular, quando a NF-e tem vícios formais, quando o produto é inidôneo ou quando há suspeita de fraude na cadeia.",
    como_mitigar: [
      "Consultar situação cadastral do fornecedor antes de cada compra",
      "Arquivar NF-e com XML e confirmação de autorização pela SEFAZ",
      "Verificar regularidade no SINTEGRA",
      "Documentar a operação com evidências adicionais em compras de alto valor",
    ],
    alerta:
      "Súmula 509/STJ protege o comprador de boa-fé contra glosa por fraude do fornecedor — mas a boa-fé deve ser comprovada.",
    pct_cont: 0.003,
  },
  {
    id: "R08",
    nome: "Risco em operações com paraísos fiscais e offshores (Lei 14.754/2023)",
    area: "IRPJ/CSLL",
    probabilidade: "Baixa",
    impacto: "Alto",
    regimes: REAL,
    cnae_fn: cnaePrefix(["6420", "6430", "6440", "6450", "6460"]),
    lei: "Lei 14.754/2023 · IN RFB 2.180/2024 · Lei 14.596/2023 (novo TP)",
    descricao:
      "Empresas com participações em entidades no exterior estão sujeitas às novas regras: tributação automática dos lucros das controladas (mesmo sem distribuição), novas regras de TP (padrão OCDE) e disclosure ampliado.",
    como_mitigar: [
      "Mapear todas as participações societárias no exterior",
      "Avaliar a opção pelo regime de transparência fiscal (prazo: 31/07 do ano seguinte)",
      "Revisar contratos intercompany à luz da Lei 14.596/2023",
      "Garantir disclosure completo na ECF",
    ],
    alerta:
      "Prazo para opção pelo regime de transparência fiscal: 31/07/2025 para o ano-calendário 2024. Perda do prazo implica tributação pelo regime geral.",
  },
  {
    id: "R09",
    nome: "Autuação por preços de transferência (novo padrão OCDE — Lei 14.596/2023)",
    area: "IRPJ/CSLL",
    probabilidade: "Baixa",
    impacto: "Alto",
    regimes: REAL,
    cnae_fn: sempre,
    lei: "Lei 14.596/2023 · IN RFB 2.161/2023 · Portaria RFB 222/2024",
    descricao:
      "As novas regras de preços de transferência (vigência obrigatória a partir de 2025) seguem o padrão OCDE e exigem análise funcional detalhada das transações intercompany.",
    como_mitigar: [
      "Mapear todas as transações intercompany sujeitas às novas regras",
      "Realizar análise de comparabilidade (benchmarking) por categoria",
      "Atualizar a política de preços de transferência do grupo",
      "Preparar Local File e Master File conforme IN 2.161/2023",
    ],
    alerta:
      "Vigência obrigatória a partir de 01/01/2025. Multas por descumprimento: 0,2% a 5% do valor das transações.",
  },
  {
    id: "R10",
    nome: "Desconsideração de planejamento tributário (propósito negocial)",
    area: "IRPJ/CSLL",
    probabilidade: "Média",
    impacto: "Alto",
    regimes: PRES_REAL,
    cnae_fn: sempre,
    lei: "Art. 116, parágrafo único CTN · CARF Acórdão 1201-005.762 · IN RFB 1.700/2017 Arts. 5º e 6º",
    descricao:
      "A RFB tem desconsiderado operações de planejamento tributário (reorganizações, incorporações, cisões, contratos atípicos) quando entende que o único propósito é a redução de tributos, sem propósito negocial legítimo.",
    como_mitigar: [
      "Documentar o propósito negocial de cada operação com evidências objetivas",
      "Evitar sequências de operações sem justificativa econômica independente",
      "Obter parecer jurídico prévio para reestruturações relevantes",
      "Registrar atas e decisões formais que documentem as razões de negócio",
    ],
    alerta:
      "O CARF tem aplicado a norma antielisiva com frequência crescente desde 2019. Multa qualificada (150%) em caso de dolo. Documentar propósito negocial ANTES da operação.",
    pct_cont: 0.003,
  },
];

export function qualificarRiscos(cnae: string, regime: Regime): Risco[] {
  return RISCOS.filter((r) => {
    if (!r.regimes.includes(regime)) return false;
    try {
      return r.cnae_fn(cnae);
    } catch {
      return false;
    }
  });
}

export const PROB_COLOR: Record<Probabilidade, { bar: string; bg: string; text: string }> = {
  Alta: { bar: "hsl(0 70% 36%)", bg: "hsl(0 60% 95%)", text: "hsl(0 70% 36%)" },
  Média: { bar: "hsl(43 52% 54%)", bg: "hsl(43 70% 92%)", text: "hsl(36 70% 30%)" },
  Baixa: { bar: "hsl(0 0% 42%)", bg: "hsl(0 0% 93%)", text: "hsl(0 0% 30%)" },
};
