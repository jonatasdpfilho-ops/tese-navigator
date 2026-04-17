// Matriz de instrumentos de Transação Tributária
import type { Regime } from "./teses";

export type TipoTransacao = "Transação" | "Parcelamento" | "Remissão" | "Compensação";
export type Esfera = "Federal" | "Estadual" | "Municipal" | "Trabalhista";

export interface Transacao {
  id: string;
  nome: string;
  tipo: TipoTransacao;
  esfera: Esfera;
  regimes: Regime[];
  cnae_fn: (cnae: string) => boolean;
  qualifica_se: string;
  lei: string;
  beneficios: string[];
  limitacoes: string[];
  prazo: string;
  como_aderir: string[];
  alerta: string;
}

const ALL: Regime[] = ["Simples Nacional", "Lucro Presumido", "Lucro Real"];
const PRES_REAL: Regime[] = ["Lucro Presumido", "Lucro Real"];
const SIMPLES: Regime[] = ["Simples Nacional"];
const sempre = () => true;

export const TRANSACOES: Transacao[] = [
  {
    id: "TR01",
    nome: "Transação Individual com a PGFN (dívidas > R$ 10 mi)",
    tipo: "Transação",
    esfera: "Federal",
    regimes: PRES_REAL,
    cnae_fn: sempre,
    qualifica_se: "Dívida ativa federal acima de R$ 10 milhões, dificuldade econômica comprovada",
    lei: "Lei 13.988/2020 · Portaria PGFN 14.402/2020 · Portaria PGFN 6.757/2022",
    beneficios: [
      "Desconto de até 100% de multas e juros (manutenção do principal)",
      "Parcelamento em até 120 meses",
      "Uso de prejuízo fiscal e base negativa de CSLL como moeda",
      "Possibilidade de uso de precatórios federais",
    ],
    limitacoes: [
      "Apenas dívidas inscritas em dívida ativa federal",
      "Empresa deve demonstrar dificuldade econômica",
      "Não abrange débitos com exigibilidade suspensa por liminar",
    ],
    prazo: "Adesão mediante proposta — programa permanente",
    como_aderir: [
      "Acessar o portal REGULARIZE da PGFN",
      "Apresentar proposta fundamentada com demonstrações",
      "Aguardar análise e contraproposta da PGFN",
      "Formalizar acordo e manter cumprimento das parcelas",
    ],
    alerta:
      "Negociação caso a caso — descontos reais variam muito. Assessoria jurídica especializada aumenta significativamente o resultado.",
  },
  {
    id: "TR02",
    nome: "Transação por Adesão PGFN (dívidas < R$ 10 mi)",
    tipo: "Transação",
    esfera: "Federal",
    regimes: ALL,
    cnae_fn: sempre,
    qualifica_se: "Dívida ativa federal em qualquer valor, dentro do edital vigente",
    lei: "Lei 13.988/2020 · Editais PGFN periódicos",
    beneficios: [
      "Descontos de 30% a 50% sobre multas e juros (editais comuns)",
      "Parcelamento em até 60 meses",
      "Entrada reduzida (5% a 10% sem desconto)",
      "Inclusão de débitos parcelados anteriores",
    ],
    limitacoes: [
      "Depende de edital específico vigente",
      "Descontos menores que a transação individual",
      "Prazo de adesão limitado ao edital",
    ],
    prazo: "Verificar edital vigente em regularize.pgfn.gov.br",
    como_aderir: [
      "Acessar regularize.pgfn.gov.br",
      "Verificar editais abertos",
      "Simular o valor da dívida e o desconto",
      "Aderir dentro do prazo do edital",
    ],
    alerta:
      "Editais têm prazo limitado — monitorar o portal REGULARIZE constantemente.",
  },
  {
    id: "TR03",
    nome: "PERT-SN (Programa de Regularização do Simples Nacional)",
    tipo: "Parcelamento",
    esfera: "Federal",
    regimes: SIMPLES,
    cnae_fn: sempre,
    qualifica_se: "Optante do Simples Nacional com débitos vencidos",
    lei: "LC 123/2006 Art. 9º · Resoluções CGSN periódicas",
    beneficios: [
      "Parcelamento em até 60 meses",
      "Redução de multas em até 100% e juros em até 100% (varia por programa)",
      "Regularização para emissão de CND",
      "Manutenção da opção pelo Simples Nacional",
    ],
    limitacoes: [
      "Depende de programa específico vigente",
      "Exclusão automática em caso de inadimplência de 3 parcelas",
    ],
    prazo: "Verificar resolução CGSN vigente",
    como_aderir: [
      "Acessar o Portal do Simples Nacional no e-CAC",
      "Consolidar os débitos elegíveis",
      "Simular e aderir ao parcelamento",
      "Monitorar pagamento das parcelas mensalmente",
    ],
    alerta:
      "Inadimplência por 3 meses consecutivos ou 6 alternados gera exclusão automática. Configurar pagamento automático.",
  },
  {
    id: "TR04",
    nome: "Parcelamento Ordinário Federal (RFB e PGFN)",
    tipo: "Parcelamento",
    esfera: "Federal",
    regimes: ALL,
    cnae_fn: sempre,
    qualifica_se: "Qualquer empresa com débitos federais vencidos",
    lei: "Lei 10.522/2002 · IN RFB 1.891/2019 · Portaria Conjunta RFB/PGFN 15/2009",
    beneficios: [
      "Até 60 meses (RFB) e 84 meses (PGFN com garantia)",
      "Suspensão da exigibilidade e emissão de CND",
      "Regulariza imediatamente a situação fiscal",
      "Adesão permanente, sem necessidade de edital",
    ],
    limitacoes: [
      "Sem descontos de multas e juros",
      "Máximo de 2 parcelamentos simultâneos por modalidade",
      "Rescisão por inadimplência de 3 consecutivas ou 6 alternadas",
    ],
    prazo: "Adesão permanente via e-CAC",
    como_aderir: [
      "Acessar e-CAC com certificado digital",
      "Consolidar os débitos no sistema",
      "Simular parcelas",
      "Aderir e efetuar o pagamento da 1ª parcela",
    ],
    alerta:
      "Sem desconto, mas regulariza para CND e licitações. Se houver edital de transação vigente, avaliar primeiro a transação por adesão.",
  },
  {
    id: "TR05",
    nome: "Transação Tributária Estadual (ICMS — Paraná)",
    tipo: "Transação",
    esfera: "Estadual",
    regimes: ALL,
    cnae_fn: sempre,
    qualifica_se: "Empresa com débitos de ICMS inscritos em dívida ativa do PR",
    lei: "Lei Estadual PR 20.656/2021 · Decreto PR 10.954/2022 · Resoluções SEFA",
    beneficios: [
      "Descontos de até 70% sobre multas, juros e encargos",
      "Parcelamento em até 120 meses",
      "Uso de créditos acumulados de ICMS como forma de pagamento",
      "Possibilidade de uso de precatórios estaduais",
    ],
    limitacoes: [
      "Apenas débitos de ICMS em dívida ativa estadual",
      "Depende de edital específico da SEFA/PR",
      "Adesão sujeita a análise da Procuradoria Geral",
    ],
    prazo: "Verificar editais vigentes na SEFA/PR",
    como_aderir: [
      "Acessar o portal da SEFA/PR e verificar editais",
      "Levantar os débitos de ICMS em dívida ativa",
      "Apresentar proposta de transação",
      "Formalizar o acordo e cumprir as parcelas",
    ],
    alerta:
      "Programas costumam abrir no 2º semestre. Créditos acumulados no SISCRED podem ser usados como moeda — verificar saldo.",
  },
  {
    id: "TR06",
    nome: "Compensação de Créditos Tributários (PER/DCOMP)",
    tipo: "Compensação",
    esfera: "Federal",
    regimes: PRES_REAL,
    cnae_fn: sempre,
    qualifica_se: "Empresa com créditos federais reconhecidos e débitos a compensar",
    lei: "Art. 74 Lei 9.430/96 · IN RFB 2.055/2021 · Arts. 168 e 170 CTN",
    beneficios: [
      "Extinção do débito sem desembolso de caixa",
      "Correção do crédito pela SELIC desde o recolhimento indevido",
      "Compensação com quaisquer tributos federais (RFB)",
      "Processo 100% eletrônico via PGD/e-CAC",
    ],
    limitacoes: [
      "Vedação para débitos parcelados, contribuições previdenciárias e débitos de terceiros",
      "Não-homologação gera cobrança automática",
      "Prazo prescricional de 5 anos (Art. 168 CTN)",
    ],
    prazo: "5 anos do recolhimento indevido (Art. 168, I, CTN)",
    como_aderir: [
      "Transmitir Declaração de Compensação via PGD DCOMP Web",
      "Aguardar homologação (até 5 anos para a RFB)",
      "Acompanhar não-homologações e impugnar administrativamente",
      "Preservar toda a documentação do crédito originário",
    ],
    alerta:
      "Compensação de débitos previdenciários (INSS sobre folha) é VEDADA — Art. 26-A Lei 11.457/2007. Acompanhar REsp 2.227.090/STJ sobre prazo de retificação.",
  },
  {
    id: "TR07",
    nome: "Transação no Contencioso Administrativo (CARF e DRJ)",
    tipo: "Transação",
    esfera: "Federal",
    regimes: PRES_REAL,
    cnae_fn: sempre,
    qualifica_se: "Empresa com processo no CARF/DRJ em teses de jurisprudência desfavorável",
    lei: "Lei 13.988/2020 Art. 11 · Portaria ME 247/2020 · Portaria PGFN 6.941/2022",
    beneficios: [
      "Desconto de até 50% sobre o valor total (principal + multa + juros)",
      "Parcelamento em até 84 meses",
      "Encerramento do processo administrativo pendente",
      "Desconto maior para teses com jurisprudência consolidada desfavorável",
    ],
    limitacoes: [
      "Apenas processos com valor acima de R$ 1 milhão (contencioso qualificado)",
      "Adesão implica desistência do processo",
      "Vedado para créditos com exigibilidade suspensa por decisão judicial favorável",
    ],
    prazo: "Verificar portarias periódicas da PGFN e RFB",
    como_aderir: [
      "Identificar processos elegíveis no e-CAC",
      "Verificar enquadramento no contencioso qualificado",
      "Apresentar proposta no portal REGULARIZE",
      "Desistir formalmente do processo como condição",
    ],
    alerta:
      "Implica desistência do processo. Avaliar se há chance real de vitória no CARF — se a tese tem precedentes favoráveis recentes, pode não compensar.",
  },
  {
    id: "TR08",
    nome: "Transação em Matéria Previdenciária (INSS e FGTS)",
    tipo: "Parcelamento",
    esfera: "Federal",
    regimes: ALL,
    cnae_fn: sempre,
    qualifica_se: "Empresa com débitos de INSS e/ou FGTS",
    lei: "Lei 10.522/2002 · Resolução CG-FGTS 913/2023 · Lei 14.438/2022 (PERT previdenciário)",
    beneficios: [
      "Parcelamento de INSS em até 60 meses (ordinário)",
      "Parcelamento de FGTS em até 36 meses com desconto de multa",
      "Regularização para emissão de CND previdenciária",
      "Possibilidade de inclusão de débitos em discussão judicial",
    ],
    limitacoes: [
      "FGTS: desconto de multa de mora mas não dos valores devidos",
      "INSS: sem desconto no parcelamento ordinário",
      "Débitos de FGTS em execução têm regras específicas",
    ],
    prazo: "Adesão permanente para parcelamento ordinário",
    como_aderir: [
      "INSS: e-CAC com certificado digital",
      "FGTS: portal Empregador Web da Caixa",
      "Consolidar débitos e simular o parcelamento",
      "Formalizar e manter pagamento das parcelas",
    ],
    alerta:
      "Débitos de FGTS têm multa de 40% sobre o não depositado. Parcelamento não suspende a multa — paga-se principal parcelado e multa integral.",
  },
];

export function qualificarTransacoes(cnae: string, regime: Regime): Transacao[] {
  return TRANSACOES.filter((t) => {
    if (!t.regimes.includes(regime)) return false;
    try {
      return t.cnae_fn(cnae);
    } catch {
      return false;
    }
  });
}

export const TIPO_COLOR: Record<TipoTransacao, { bar: string; bg: string; text: string }> = {
  Transação: { bar: "hsl(213 100% 20%)", bg: "hsl(213 100% 95%)", text: "hsl(213 100% 20%)" },
  Parcelamento: { bar: "hsl(148 62% 22%)", bg: "hsl(148 50% 92%)", text: "hsl(148 62% 22%)" },
  Remissão: { bar: "hsl(172 80% 21%)", bg: "hsl(172 40% 92%)", text: "hsl(172 80% 21%)" },
  Compensação: { bar: "hsl(43 52% 54%)", bg: "hsl(43 70% 92%)", text: "hsl(36 70% 30%)" },
};
