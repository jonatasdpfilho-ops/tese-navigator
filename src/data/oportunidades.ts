export type Modulo =
  | "Holdings"
  | "Contratos Bancários"
  | "Execuções Fiscais"
  | "Recuperação Judicial";

export type Urgencia = "Alta" | "Média" | "Baixa";
export type Impacto = "Proteção" | "Economia" | "Defesa" | "Reestruturação";

export type NumSocios = "1" | "2-5" | "6-10" | "mais10";
export type Setor =
  | "Saúde"
  | "Construção civil"
  | "Agronegócio"
  | "Comércio varejista"
  | "Indústria"
  | "Transporte e logística"
  | "Tecnologia e serviços"
  | "Holding / Grupo"
  | "Outros";
export type RegimeEmp = "Simples Nacional" | "Lucro Presumido" | "Lucro Real";
export type TempoOperacao = "<2" | "2-5" | "5-15" | ">15";
export type SituacaoFin = "saudavel" | "estavel" | "fragilizada" | "crise";
export type Tendencia = "melhorando" | "estavel" | "piorando";

export interface RespostasEmpresa {
  razao_social: string;
  faturamento: number;
  num_socios: NumSocios;
  setor: Setor;
  regime: RegimeEmp;
  tempo_operacao: TempoOperacao;
  // Bloco A
  imoveis_pf: boolean;
  imoveis_pj: boolean;
  outros_negocios: boolean;
  distribui_lucros: boolean;
  planejamento_sucessorio: boolean;
  divergencias_socios: boolean;
  // Bloco B
  financiamentos: boolean;
  juros_elevados: boolean;
  garantias_reais: boolean;
  cheque_especial: boolean;
  renegociacao: boolean;
  // Bloco C
  execucoes: boolean;
  redirecionamento: boolean;
  penhora: boolean;
  protestos: boolean;
  trabalhistas: boolean;
  // Bloco D
  situacao_financeira: SituacaoFin;
  tendencia: Tendencia;
}

export interface Oportunidade {
  id: string;
  modulo: Modulo;
  nome: string;
  descricao: string;
  fundamento: string;
  qualifica_se: string;
  urgencia: Urgencia;
  impacto: Impacto;
  proximos_passos: string[];
  alerta: string;
  qualify: (r: RespostasEmpresa) => boolean;
}

export const OPORTUNIDADES: Oportunidade[] = [
  // ===== Módulo 1 — Holdings =====
  {
    id: "E01",
    modulo: "Holdings",
    nome: "Constituição de Holding Patrimonial",
    urgencia: "Alta",
    impacto: "Proteção",
    qualify: (r) => r.imoveis_pf || r.outros_negocios,
    descricao:
      "Transferência de imóveis e participações societárias para uma holding familiar ou patrimonial, protegendo o patrimônio pessoal dos sócios de riscos empresariais e reduzindo carga tributária na sucessão.",
    fundamento:
      "Art. 1.052 e ss. CC/2002 · Art. 20 Lei 8.884/94 · Lei 6.404/76 · Arts. 109 e 110 CTN (elisão fiscal lícita) · STJ REsp 1.459.277/SP (desconsideração — requisitos estritos)",
    qualifica_se: "Sócios com imóveis em nome próprio ou empresa com múltiplos negócios no grupo",
    proximos_passos: [
      "Levantamento patrimonial completo dos sócios",
      "Análise de viabilidade tributária (ITBI, IRPF sobre ganho de capital)",
      "Elaboração do contrato social da holding",
      "Transferência dos bens com planejamento fiscal",
    ],
    alerta:
      "A constituição de holding deve preceder qualquer evento de risco (execução, divórcio, falência). Constituída após a dívida pode ser declarada fraude à execução (Art. 792 CPC). Agir preventivamente.",
  },
  {
    id: "E02",
    modulo: "Holdings",
    nome: "Planejamento Sucessório via Holding",
    urgencia: "Média",
    impacto: "Reestruturação",
    qualify: (r) => r.imoveis_pf || r.outros_negocios || r.planejamento_sucessorio,
    descricao:
      "Estruturação da transmissão do patrimônio familiar via doação de cotas da holding com reserva de usufruto, evitando inventário, reduzindo ITCMD e garantindo continuidade dos negócios.",
    fundamento:
      "Arts. 1.784 a 2.027 CC/2002 · Art. 166 CTN · STF RE 562.045 (ITCMD progressivo) · IN RFB 1.700/2017",
    qualifica_se: "Empresa com mais de 5 anos, sócios com patrimônio relevante ou necessidade de planejamento sucessório",
    proximos_passos: [
      "Mapeamento dos herdeiros e estrutura familiar",
      "Avaliação do patrimônio para fins de doação",
      "Cláusulas de inalienabilidade e impenhorabilidade nas cotas",
      "Doação de cotas com reserva de usufruto vitalício",
    ],
    alerta:
      "Cada estado tem alíquota e regras próprias de ITCMD. Após RE 562.045/STF, alíquotas progressivas são constitucionais. Verificar legislação estadual específica.",
  },
  {
    id: "E03",
    modulo: "Holdings",
    nome: "Blindagem Patrimonial e Separação de Riscos",
    urgencia: "Alta",
    impacto: "Proteção",
    qualify: (r) => r.execucoes || r.redirecionamento || r.protestos || r.trabalhistas,
    descricao:
      "Reestruturação societária para separar o risco operacional do patrimônio dos sócios, criando camadas de proteção jurídica contra execuções, trabalhistas e redirecionamentos fiscais.",
    fundamento:
      "Art. 49-A CC/2002 · Art. 50 CC/2002 · Art. 135 CTN · STJ Tema 981 (IDPJ) · STJ REsp 1.775.269/PR",
    qualifica_se: "Empresa com execuções ativas, protestos ou risco de redirecionamento para sócios",
    proximos_passos: [
      "Mapeamento do passivo atual e riscos concretos",
      "Verificar se a separação não configura fraude à execução",
      "Reestruturação societária com criação de SPE ou holding operacional",
      "Transferência de ativos com documentação robusta",
    ],
    alerta:
      "ATENÇÃO CRÍTICA: qualquer reestruturação com dívidas existentes exige análise prévia de fraude à execução (Art. 792 CPC) e fraude contra credores (Art. 158 CC). Agir somente com assessoria jurídica e documentação completa.",
  },
  {
    id: "E04",
    modulo: "Holdings",
    nome: "Revisão do Contrato Social e Acordo de Sócios",
    urgencia: "Média",
    impacto: "Reestruturação",
    qualify: (r) =>
      r.divergencias_socios || ["2-5", "6-10", "mais10"].includes(r.num_socios),
    descricao:
      "Revisão do contrato social e elaboração de acordo de sócios com cláusulas de resolução de conflitos, direito de preferência, tag along, drag along e mecanismos de saída ordenada.",
    fundamento:
      "Arts. 1.052 a 1.087 CC/2002 · Art. 997 CC/2002 · Lei 6.404/76 Arts. 118 e ss. · STJ REsp 1.726.647/SP",
    qualifica_se: "Empresa com 2 ou mais sócios, especialmente com divergências ou perspectiva de crescimento",
    proximos_passos: [
      "Diagnóstico das relações societárias atuais",
      "Identificação de gaps no contrato social vigente",
      "Elaboração do acordo de sócios",
      "Registro e publicidade adequados",
    ],
    alerta:
      "Contrato social desatualizado é a principal causa de litígios societários que destroem empresas saudáveis. Cláusulas de deadlock e saída compulsória evitam dissolução judicial parcial (Art. 1.030 CC).",
  },

  // ===== Módulo 2 — Contratos Bancários =====
  {
    id: "E05",
    modulo: "Contratos Bancários",
    nome: "Revisão de Juros Abusivos em Contratos de Crédito Empresarial",
    urgencia: "Alta",
    impacto: "Economia",
    qualify: (r) => r.financiamentos || r.juros_elevados,
    descricao:
      "Revisão judicial ou extrajudicial de contratos bancários empresariais para identificar e restituir cobranças indevidas: capitalização sem pacto expresso, spread acima da média de mercado, tarifas abusivas e encargos ilegais.",
    fundamento:
      "STJ Tema 27 (REsp 1.061.530/RS) · STJ Súmula 530 · STJ REsp 1.112.879/PR · BACEN Resolução 4.558/2017",
    qualifica_se: "Empresa com financiamentos, empréstimos ou capital de giro bancário ativo",
    proximos_passos: [
      "Levantamento de todos os contratos bancários ativos",
      "Análise comparativa das taxas com a média BACEN do período",
      "Cálculo da diferença a restituir (revisional)",
      "Tentativa extrajudicial de revisão antes do ajuizamento",
    ],
    alerta:
      "A abusividade deve ser demonstrada caso a caso — a mera comparação com a Selic não é suficiente (STJ). Contratos empresariais têm proteção menor do que contratos de consumo. O ônus é do devedor provar a abusividade.",
  },
  {
    id: "E06",
    modulo: "Contratos Bancários",
    nome: "Revisão de Contratos com Garantias Reais (Alienação Fiduciária e Hipoteca)",
    urgencia: "Alta",
    impacto: "Defesa",
    qualify: (r) => r.garantias_reais || r.financiamentos,
    descricao:
      "Defesa em ações de busca e apreensão, consolidação de propriedade e execução hipotecária. Revisão dos valores cobrados, oportunidade de purgação da mora e negociação de novas condições antes da perda do bem.",
    fundamento:
      "Lei 9.514/1997 · Dec.-Lei 911/1969 · STJ REsp 1.418.593/MS (Tema 745) · STJ Súmula 308 · STJ REsp 1.622.555/MG (Tema 983)",
    qualifica_se: "Empresa com bens dados em garantia real em contratos bancários",
    proximos_passos: [
      "Análise do contrato e situação atual das parcelas",
      "Verificar possibilidade de purgação da mora",
      "Revisão judicial dos valores executados",
      "Negociação extrajudicial com o credor antes da consolidação",
    ],
    alerta:
      "Em alienação fiduciária de imóvel, após consolidação da propriedade (Art. 26 Lei 9.514/97) o devedor perde o bem e tem apenas 60 dias para desocupar. O prazo para agir é curto.",
  },
  {
    id: "E07",
    modulo: "Contratos Bancários",
    nome: "Renegociação e Revisão de Dívidas Bancárias (Distressed Debt)",
    urgencia: "Alta",
    impacto: "Reestruturação",
    qualify: (r) =>
      r.renegociacao || r.situacao_financeira === "fragilizada" || r.situacao_financeira === "crise",
    descricao:
      "Análise técnica das dívidas bancárias renegociadas para identificar encargos indevidos incorporados na renegociação, anatocismo e capitalização irregular.",
    fundamento:
      "Art. 395 CC/2002 · Art. 944 CC/2002 · STJ REsp 1.163.283/RS · Resolução BACEN 4.282/2013",
    qualifica_se: "Empresa que renegociou dívidas bancárias nos últimos 3 anos",
    proximos_passos: [
      "Levantamento dos contratos originais e termos de renegociação",
      "Análise comparativa: dívida original vs. renegociada",
      "Verificar incorporação de encargos abusivos na nova dívida",
      "Ação revisional se identificada abusividade",
    ],
    alerta:
      "Renegociação não significa novação automática (Art. 360 CC). Encargos abusivos do contrato original podem ser discutidos mesmo após a renegociação se não houve novação expressa. Guardar todos os contratos originais.",
  },
  {
    id: "E08",
    modulo: "Contratos Bancários",
    nome: "Revisão de Tarifas e Seguros Bancários",
    urgencia: "Média",
    impacto: "Economia",
    qualify: (r) => r.financiamentos || r.cheque_especial,
    descricao:
      "Revisão de cobranças de tarifas bancárias (TAC, TEC, avaliação de bem) e seguros vinculados a contratos de financiamento, identificando cobranças indevidas ou excessivas passíveis de restituição.",
    fundamento:
      "STJ Tema 958 (REsp 1.578.553/SP) · STJ Súmula 566 · BACEN Resolução 3.919/2010",
    qualifica_se: "Empresa com financiamentos ou crédito rotativo bancário",
    proximos_passos: [
      "Levantamento de extratos e cobranças acessórias dos contratos",
      "Identificação de tarifas vedadas pela regulação BACEN",
      "Verificação de seguros embutidos sem contratação expressa",
      "Pedido administrativo de restituição antes do judicial",
    ],
    alerta:
      "TAC e TEC: tarifas vedadas para contratos firmados após 30/04/2008 (Resolução BACEN 3.518/2007). Verificar a data do contrato antes de ajuizar.",
  },

  // ===== Módulo 3 — Execuções Fiscais =====
  {
    id: "E09",
    modulo: "Execuções Fiscais",
    nome: "Defesa contra Redirecionamento de Execução Fiscal para Sócios (Art. 135 CTN)",
    urgencia: "Alta",
    impacto: "Defesa",
    qualify: (r) => r.redirecionamento || r.execucoes,
    descricao:
      "Defesa do sócio ou ex-sócio redirecionado em execução fiscal, demonstrando ausência dos requisitos do Art. 135 CTN: redirecionamento exige ato ilícito (não mero inadimplemento) e dissolução irregular comprovada pelo Fisco.",
    fundamento:
      "Art. 135, III, CTN · STJ Tema 962 · STJ Tema 981 (IDPJ) · STJ Súmula 430 · STJ REsp 1.775.269/PR",
    qualifica_se: "Sócios que foram ou podem ser incluídos pessoalmente em execução fiscal da empresa",
    proximos_passos: [
      "Verificar a data em que o sócio era administrador vs. data do fato gerador",
      "Demonstrar que não houve ato com excesso de poderes ou infração à lei",
      "Embargos à execução fiscal ou exceção de pré-executividade",
      "Incidente de Desconsideração da Personalidade Jurídica (IDPJ) como defesa",
    ],
    alerta:
      "STJ Súmula 430: o simples inadimplemento NÃO autoriza o redirecionamento. É necessário ato ilícito específico. Documentar a saída da sociedade com alteração contratual registrada.",
  },
  {
    id: "E10",
    modulo: "Execuções Fiscais",
    nome: "Extinção da Execução Fiscal por Prescrição Intercorrente",
    urgencia: "Alta",
    impacto: "Defesa",
    qualify: (r) => r.execucoes,
    descricao:
      "Verificação e alegação da prescrição intercorrente nas execuções fiscais em andamento: após 1 ano de arquivamento por não localização do devedor ou bens, inicia-se o prazo de 5 anos para a prescrição.",
    fundamento:
      "Art. 40 Lei 6.830/80 (LEF) · Art. 174 CTN · STJ Tema 566 (REsp 1.340.553) · STJ Súmulas 314 e 409",
    qualifica_se: "Empresa com execuções fiscais em andamento, especialmente com mais de 1 ano de inatividade processual",
    proximos_passos: [
      "Levantamento de todas as execuções fiscais ativas",
      "Verificar data do despacho do Art. 40 LEF (marco inicial)",
      "Calcular se já transcorreram 5 anos de inatividade",
      "Petição requerendo reconhecimento ou embargos à execução",
    ],
    alerta:
      "STJ Tema 566 é vinculante: paralisação por mais de 5 anos após o despacho do Art. 40 implica prescrição intercorrente automática. O juiz deve declarar de ofício (Art. 40, §4º LEF).",
  },
  {
    id: "E11",
    modulo: "Execuções Fiscais",
    nome: "Defesa em Execução Fiscal por Nulidade da CDA",
    urgencia: "Alta",
    impacto: "Defesa",
    qualify: (r) => r.execucoes,
    descricao:
      "Análise da Certidão de Dívida Ativa para identificar vícios formais que autorizam a extinção da execução: ausência de requisitos do Art. 202 CTN, erro no sujeito passivo, valor incorreto ou tributo indevido.",
    fundamento:
      "Art. 202 CTN · Art. 3º Lei 6.830/80 · STJ Súmula 392 · STJ REsp 1.045.472/BA (Tema 116) · STJ REsp 1.115.501/SP (Tema 177)",
    qualifica_se: "Empresa com execuções fiscais ativas, especialmente com CDAs de origem duvidosa",
    proximos_passos: [
      "Obter cópia integral da CDA e do processo administrativo",
      "Verificar presença dos requisitos do Art. 202 CTN",
      "Verificar regular lançamento e processo administrativo",
      "Exceção de pré-executividade se o vício for documental",
    ],
    alerta:
      "A substituição da CDA é admitida pelo STJ (Súmula 392) até a sentença de embargos — mas não pode modificar o sujeito passivo ou ampliar o débito. Vícios materiais devem ser alegados em embargos.",
  },
  {
    id: "E12",
    modulo: "Execuções Fiscais",
    nome: "Parcelamento Estratégico e Uso de Precatórios na Execução Fiscal",
    urgencia: "Média",
    impacto: "Defesa",
    qualify: (r) => r.execucoes || r.penhora,
    descricao:
      "Avaliação estratégica entre parcelamento (PERT, REFIS estadual, ordinário), uso de precatórios para garantia ou pagamento da dívida e negociação de transação tributária com a PGFN.",
    fundamento:
      "Lei 13.988/2020 (transação) · Art. 156, I, CTN · Arts. 100 e 78 ADCT CF/88 · STJ REsp 1.909.451/SP · Portaria PGFN 14.402/2020",
    qualifica_se: "Empresa com execuções ativas e dívida passível de parcelamento ou transação",
    proximos_passos: [
      "Levantamento do passivo total em execução",
      "Verificar elegibilidade ao PERT ou transação individual (PGFN)",
      "Verificar precatórios cedíveis para uso na execução",
      "Análise comparativa: parcelar vs. litigar vs. transacionar",
    ],
    alerta:
      "Transação tributária individual com a PGFN (Portaria 14.402/2020) permite descontos de até 50% em multas e juros para dívidas acima de R$ 10 milhões. Parcelamento não suspende a execução sem garantia do juízo.",
  },

  // ===== Módulo 4 — Recuperação Judicial =====
  {
    id: "E13",
    modulo: "Recuperação Judicial",
    nome: "Diagnóstico de Pré-Insolvência e Recuperação Extrajudicial",
    urgencia: "Alta",
    impacto: "Reestruturação",
    qualify: (r) =>
      r.situacao_financeira === "fragilizada" ||
      r.situacao_financeira === "crise" ||
      r.tendencia === "piorando",
    descricao:
      "Análise preventiva dos indicadores de insolvência para definir a estratégia mais adequada antes da crise irreversível: recuperação extrajudicial, negociação direta com credores ou preparação para RJ.",
    fundamento:
      "Arts. 161 a 167 Lei 11.101/2005 · Art. 94 Lei 11.101/2005 · Lei 14.112/2020 · STJ REsp 1.337.989/SP",
    qualifica_se: "Empresa com dificuldades de caixa, inadimplência ou tendência de piora nos últimos 12 meses",
    proximos_passos: [
      "Levantamento do passivo total (financeiro, fiscal, trabalhista, fornecedores)",
      "Cálculo dos índices de liquidez e endividamento",
      "Mapeamento dos credores por classe e valor",
      "Elaboração do plano de reestruturação extrajudicial",
    ],
    alerta:
      "A recuperação extrajudicial é mais barata, sigilosa e rápida que a judicial — mas exige adesão de pelo menos 3/5 de cada classe de credores (Art. 163 LREF). Agir antes da insolvência aumenta as chances de sucesso.",
  },
  {
    id: "E14",
    modulo: "Recuperação Judicial",
    nome: "Recuperação Judicial — Viabilidade e Estratégia",
    urgencia: "Alta",
    impacto: "Reestruturação",
    qualify: (r) =>
      r.situacao_financeira === "crise" && (r.protestos || r.execucoes || r.penhora),
    descricao:
      "Análise de viabilidade da recuperação judicial, estratégia de ajuizamento, preparação do plano, gestão do stay period de 180 dias e defesa contra credores não sujeitos à recuperação.",
    fundamento:
      "Arts. 47 a 72 Lei 11.101/2005 · Lei 14.112/2020 · STJ Tema 1.051 · STJ REsp 1.694.261/SP · STJ Súmula 480",
    qualifica_se: "Empresa em crise com execuções ativas, dívidas vencidas com múltiplos credores e viabilidade econômica demonstrável",
    proximos_passos: [
      "Análise de viabilidade econômica (atividade rentável?)",
      "Levantamento completo do passivo por classe de credores",
      "Preparação da documentação exigida pelo Art. 51 LREF",
      "Elaboração do plano de recuperação com reestruturação operacional",
    ],
    alerta:
      "A RJ NÃO suspende execuções fiscais (STJ Tema 1.051). Também não suspende créditos extraconcursais. O stay period de 180 dias (Art. 6º LREF) é improrrogável após a Lei 14.112/2020.",
  },
  {
    id: "E15",
    modulo: "Recuperação Judicial",
    nome: "Proteção de Ativos Essenciais na Crise",
    urgencia: "Alta",
    impacto: "Proteção",
    qualify: (r) =>
      (r.situacao_financeira === "fragilizada" || r.situacao_financeira === "crise") &&
      (r.garantias_reais || r.penhora),
    descricao:
      "Identificação e proteção dos ativos essenciais à continuidade da operação durante a crise: bens de capital indispensáveis, créditos a receber, contratos em andamento e propriedade intelectual.",
    fundamento:
      "Art. 49, §3º Lei 11.101/2005 · Art. 66 Lei 11.101/2005 · STJ REsp 1.758.746/GO · Art. 833 CPC",
    qualifica_se: "Empresa em dificuldade com risco de penhora de bens essenciais à operação",
    proximos_passos: [
      "Mapeamento dos ativos essenciais vs. dispensáveis",
      "Verificar quais bens são impenhoráveis (Art. 833 CPC)",
      "Levantar quais ativos estão em garantia fiduciária (fora da RJ)",
      "Estratégia de proteção antes do ajuizamento",
    ],
    alerta:
      "Bens em alienação fiduciária NÃO ficam sujeitos à RJ (Art. 49, §3º LREF) — o credor fiduciário pode retomar o bem mesmo durante a RJ. Identificar esses bens antes de ajuizar é crítico.",
  },
  {
    id: "E16",
    modulo: "Recuperação Judicial",
    nome: "Falência Estratégica e Liquidação Ordenada",
    urgencia: "Média",
    impacto: "Reestruturação",
    qualify: (r) => r.situacao_financeira === "crise" && r.tendencia === "piorando",
    descricao:
      "Quando a recuperação não é viável, análise da autofalência como instrumento de liquidação ordenada e proteção dos sócios: encerramento com menor dano patrimonial, proteção contra responsabilização pessoal e gestão do passivo.",
    fundamento:
      "Arts. 73 a 146 Lei 11.101/2005 · Art. 96 Lei 11.101/2005 · STJ REsp 1.822.040/SP · Arts. 187 e 188 CTN",
    qualifica_se: "Empresa em crise irreversível sem viabilidade econômica demonstrável",
    proximos_passos: [
      "Análise de viabilidade: recuperação vs. liquidação ordenada",
      "Verificar responsabilidade pessoal dos sócios por atos de gestão",
      "Planejamento do encerramento com menor impacto trabalhista e fiscal",
      "Acompanhamento do processo falimentar",
    ],
    alerta:
      "A autofalência (Art. 105 LREF) pode ser estratégica: interrompe execuções individuais, permite liquidação ordenada sob supervisão judicial e pode proteger sócios de responsabilização por atos regulares de gestão.",
  },
];

export function qualificarOportunidades(r: RespostasEmpresa): Oportunidade[] {
  return OPORTUNIDADES.filter((o) => {
    try {
      return o.qualify(r);
    } catch {
      return false;
    }
  });
}

export const URGENCIA_COLOR: Record<Urgencia, { bar: string; bg: string; text: string }> = {
  Alta: { bar: "hsl(0 70% 36%)", bg: "hsl(0 60% 95%)", text: "hsl(0 70% 36%)" },
  Média: { bar: "hsl(43 52% 54%)", bg: "hsl(43 70% 92%)", text: "hsl(36 70% 30%)" },
  Baixa: { bar: "hsl(148 62% 22%)", bg: "hsl(148 50% 92%)", text: "hsl(148 62% 22%)" },
};

export const MODULO_ICON: Record<Modulo, string> = {
  Holdings: "🏛",
  "Contratos Bancários": "🏦",
  "Execuções Fiscais": "⚖️",
  "Recuperação Judicial": "🔄",
};
