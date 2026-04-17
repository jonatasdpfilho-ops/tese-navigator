import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Building2, Download, FileText, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OportunidadeCard } from "@/components/OportunidadeCard";
import { maskMoney, unmask } from "@/lib/masks";
import {
  qualificarOportunidades,
  MODULO_ICON,
  type Modulo,
  type Oportunidade,
  type RespostasEmpresa,
  type Setor,
  type RegimeEmp,
  type NumSocios,
  type TempoOperacao,
  type SituacaoFin,
  type Tendencia,
  type Urgencia,
  type Impacto,
} from "@/data/oportunidades";
import { exportJsonEmpresarial, exportPdfEmpresarial } from "@/lib/export";

const MODULOS: Modulo[] = ["Holdings", "Contratos Bancários", "Execuções Fiscais", "Recuperação Judicial"];

const initial: RespostasEmpresa = {
  razao_social: "",
  faturamento: 0,
  num_socios: "1",
  setor: "Outros",
  regime: "Lucro Presumido",
  tempo_operacao: "2-5",
  imoveis_pf: false,
  imoveis_pj: false,
  outros_negocios: false,
  distribui_lucros: false,
  planejamento_sucessorio: false,
  divergencias_socios: false,
  financiamentos: false,
  juros_elevados: false,
  garantias_reais: false,
  cheque_especial: false,
  renegociacao: false,
  execucoes: false,
  redirecionamento: false,
  penhora: false,
  protestos: false,
  trabalhistas: false,
  situacao_financeira: "saudavel",
  tendencia: "estavel",
};

interface Props {
  onGoToTributario?: () => void;
}

export function DiagnosticoEmpresarial({ onGoToTributario }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [r, setR] = useState<RespostasEmpresa>(initial);
  const [fatStr, setFatStr] = useState("");
  const [oportunidades, setOportunidades] = useState<Oportunidade[] | null>(null);
  const [analise, setAnalise] = useState("");
  const [streaming, setStreaming] = useState(false);

  const [fMod, setFMod] = useState<string>("all");
  const [fUrg, setFUrg] = useState<string>("all");
  const [fImp, setFImp] = useState<string>("all");

  const set = <K extends keyof RespostasEmpresa>(k: K, v: RespostasEmpresa[K]) =>
    setR((p) => ({ ...p, [k]: v }));

  const filtradas = useMemo(() => {
    if (!oportunidades) return [];
    return oportunidades.filter((o) => {
      if (fMod !== "all" && o.modulo !== fMod) return false;
      if (fUrg !== "all" && o.urgencia !== fUrg) return false;
      if (fImp !== "all" && o.impacto !== fImp) return false;
      return true;
    });
  }, [oportunidades, fMod, fUrg, fImp]);

  const resumo = useMemo(() => {
    const ops = oportunidades || [];
    const alta = ops.filter((o) => o.urgencia === "Alta").length;
    const media = ops.filter((o) => o.urgencia === "Média").length;
    const baixa = ops.filter((o) => o.urgencia === "Baixa").length;
    const modulos_ativos = new Set(ops.map((o) => o.modulo)).size;
    return { total: ops.length, alta, media, baixa, modulos_ativos };
  }, [oportunidades]);

  const grupos = useMemo(() => {
    const g: Record<Modulo, Oportunidade[]> = {
      "Holdings": [],
      "Contratos Bancários": [],
      "Execuções Fiscais": [],
      "Recuperação Judicial": [],
    };
    filtradas.forEach((o) => g[o.modulo].push(o));
    return g;
  }, [filtradas]);

  const validarPasso1 = () => {
    if (!r.razao_social.trim()) {
      toast.error("Informe a razão social.");
      return false;
    }
    if (!r.faturamento || r.faturamento <= 0) {
      toast.error("Informe o faturamento anual.");
      return false;
    }
    return true;
  };

  const gerar = async () => {
    if (!validarPasso1()) {
      setStep(1);
      return;
    }
    const ops = qualificarOportunidades(r);
    setOportunidades(ops);
    setAnalise("");
    toast.success(`${ops.length} oportunidades identificadas.`);
    streamAnalise(ops);
  };

  const streamAnalise = async (ops: Oportunidade[]) => {
    setStreaming(true);
    setAnalise("");
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analise-empresarial-ia`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          respostas: r,
          oportunidades: ops.map((o) => ({
            id: o.id, nome: o.nome, modulo: o.modulo, urgencia: o.urgencia, impacto: o.impacto,
          })),
        }),
      });
      if (!resp.ok || !resp.body) {
        if (resp.status === 429) toast.error("Limite de IA atingido. Tente em instantes.");
        else if (resp.status === 402) toast.error("Créditos da IA esgotados.");
        else toast.error("Falha ao gerar análise IA.");
        setStreaming(false);
        return;
      }
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;
      while (!done) {
        const { value, done: d } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") { done = true; break; }
          try {
            const p = JSON.parse(j);
            const c = p.choices?.[0]?.delta?.content;
            if (c) setAnalise((prev) => prev + c);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Erro no streaming.");
    } finally {
      setStreaming(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-hero text-white overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-accent/10" />
        <div className="absolute right-40 bottom-0 w-40 h-40 rounded-full bg-accent/5" />
        <div className="container relative py-12 md:py-16">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-accent mb-3">
            Direito Empresarial · Proteção Patrimonial · Reestruturação · 2026
          </span>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight max-w-2xl mb-3">
            Diagnóstico de <span className="text-accent">riscos e oportunidades</span> empresariais
          </h2>
          <p className="text-white/70 max-w-xl text-sm md:text-base leading-relaxed">
            Responda o formulário. O sistema identifica oportunidades de proteção patrimonial, reestruturação societária, revisão de contratos bancários e defesa em execuções, com análise executiva por IA.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="container -mt-6 relative z-10">
        <div className="bg-card rounded-lg shadow-navy p-5 md:p-6 border border-border">
          {/* Steps indicator */}
          <div className="flex items-center gap-2 mb-5 text-xs">
            <span className={`px-3 py-1 rounded-full font-semibold ${step === 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
              1. Perfil
            </span>
            <div className="h-px flex-1 bg-border" />
            <span className={`px-3 py-1 rounded-full font-semibold ${step === 2 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
              2. Situação atual
            </span>
          </div>

          {step === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="md:col-span-2 lg:col-span-3">
                  <Label className="text-xs">Razão social *</Label>
                  <Input value={r.razao_social} onChange={(e) => set("razao_social", e.target.value)} placeholder="Empresa Ltda" />
                </div>
                <div>
                  <Label className="text-xs">Faturamento anual estimado *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                    <Input
                      className="pl-9"
                      value={fatStr}
                      onChange={(e) => {
                        const m = maskMoney(e.target.value);
                        setFatStr(m);
                        set("faturamento", Number(unmask(m)) || 0);
                      }}
                      placeholder="3.000.000"
                      inputMode="numeric"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Número de sócios</Label>
                  <Select value={r.num_socios} onValueChange={(v) => set("num_socios", v as NumSocios)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 (sócio único)</SelectItem>
                      <SelectItem value="2-5">2 a 5</SelectItem>
                      <SelectItem value="6-10">6 a 10</SelectItem>
                      <SelectItem value="mais10">Mais de 10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Setor de atividade</Label>
                  <Select value={r.setor} onValueChange={(v) => set("setor", v as Setor)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Saúde">Saúde (clínicas, hospitais)</SelectItem>
                      <SelectItem value="Construção civil">Construção civil e incorporação</SelectItem>
                      <SelectItem value="Agronegócio">Agronegócio e rural</SelectItem>
                      <SelectItem value="Comércio varejista">Comércio varejista</SelectItem>
                      <SelectItem value="Indústria">Indústria</SelectItem>
                      <SelectItem value="Transporte e logística">Transporte e logística</SelectItem>
                      <SelectItem value="Tecnologia e serviços">Tecnologia e serviços</SelectItem>
                      <SelectItem value="Holding / Grupo">Holding / Grupo empresarial</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Regime tributário</Label>
                  <Select value={r.regime} onValueChange={(v) => set("regime", v as RegimeEmp)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Simples Nacional">Simples Nacional</SelectItem>
                      <SelectItem value="Lucro Presumido">Lucro Presumido</SelectItem>
                      <SelectItem value="Lucro Real">Lucro Real</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Tempo de operação</Label>
                  <Select value={r.tempo_operacao} onValueChange={(v) => set("tempo_operacao", v as TempoOperacao)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<2">Menos de 2 anos</SelectItem>
                      <SelectItem value="2-5">2 a 5 anos</SelectItem>
                      <SelectItem value="5-15">5 a 15 anos</SelectItem>
                      <SelectItem value=">15">Mais de 15 anos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end mt-5">
                <Button
                  onClick={() => { if (validarPasso1()) setStep(2); }}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold"
                >
                  Próximo <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-5">
                <h3 className="font-semibold text-primary-deep">Situação patrimonial e jurídica atual</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Marque todas as alternativas que se aplicam à empresa ou aos sócios.
                </p>
              </div>

              <BlocoCheckboxes
                titulo="A · Patrimônio e Estrutura"
                itens={[
                  ["imoveis_pf", "Sócios possuem imóveis em nome próprio (PF)"],
                  ["imoveis_pj", "Empresa possui imóveis ou participações em outras empresas"],
                  ["outros_negocios", "Há outros negócios no mesmo grupo familiar/societário"],
                  ["distribui_lucros", "Empresa distribui lucros regularmente aos sócios"],
                  ["planejamento_sucessorio", "Existe planejamento sucessório em andamento ou necessário"],
                  ["divergencias_socios", "Há sócios com divergências ou risco de dissolução"],
                ]}
                r={r}
                set={set}
              />
              <BlocoCheckboxes
                titulo="B · Dívidas e Contratos Bancários"
                itens={[
                  ["financiamentos", "Empresa possui financiamentos ou empréstimos ativos"],
                  ["juros_elevados", "Há contratos com juros que parecem elevados"],
                  ["garantias_reais", "Existem garantias reais (imóveis, veículos) em contratos"],
                  ["cheque_especial", "Cheque especial ou crédito rotativo utilizado"],
                  ["renegociacao", "Houve renegociação de dívida bancária nos últimos 3 anos"],
                ]}
                r={r}
                set={set}
              />
              <BlocoCheckboxes
                titulo="C · Execuções e Passivo Judicial"
                itens={[
                  ["execucoes", "Empresa possui execuções fiscais ativas"],
                  ["redirecionamento", "Sócios foram ou podem ser redirecionados (Art. 135 CTN)"],
                  ["penhora", "Há penhora ou risco de penhora sobre bens"],
                  ["protestos", "Empresa possui protestos em cartório"],
                  ["trabalhistas", "Ações trabalhistas com potencial de execução"],
                ]}
                r={r}
                set={set}
              />

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-primary-deep mb-3">D · Saúde Financeira</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Situação financeira atual</Label>
                    <Select value={r.situacao_financeira} onValueChange={(v) => set("situacao_financeira", v as SituacaoFin)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saudavel">Saudável (crescendo e lucrativa)</SelectItem>
                        <SelectItem value="estavel">Estável (sem crescimento relevante)</SelectItem>
                        <SelectItem value="fragilizada">Fragilizada (caixa apertado)</SelectItem>
                        <SelectItem value="crise">Em crise (inadimplência relevante)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Tendência dos últimos 12 meses</Label>
                    <Select value={r.tendencia} onValueChange={(v) => set("tendencia", v as Tendencia)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="melhorando">Melhorando</SelectItem>
                        <SelectItem value="estavel">Estável</SelectItem>
                        <SelectItem value="piorando">Piorando</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-5">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
                </Button>
                <Button
                  onClick={gerar}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold"
                >
                  Gerar Diagnóstico <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Resultados */}
      {oportunidades && (
        <>
          <section className="container mt-6">
            <div className="bg-primary-deep text-white rounded-lg p-5 flex flex-col md:flex-row md:items-center gap-4 animate-fade-in">
              <Building2 className="w-8 h-8 text-accent shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg leading-tight">{r.razao_social}</h3>
                <p className="text-xs text-white/70 mt-1">
                  {r.setor} · {r.regime} · Fat. R$ {r.faturamento.toLocaleString("pt-BR")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm" variant="outline"
                  onClick={() => exportJsonEmpresarial({ respostas: r, oportunidades })}
                  className="border-accent/40 text-accent-light hover:bg-accent/10 hover:text-white"
                >
                  <Download className="w-3.5 h-3.5 mr-1" /> JSON
                </Button>
                <Button
                  size="sm"
                  onClick={() => exportPdfEmpresarial({ respostas: r, oportunidades, resumo, analiseIa: analise })}
                  className="bg-accent text-primary-deep hover:bg-accent-light"
                >
                  <FileText className="w-3.5 h-3.5 mr-1" /> PDF
                </Button>
              </div>
            </div>
          </section>

          <section className="container mt-4">
            <div className="bg-primary text-primary-foreground rounded-lg p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
              <ResumoCell label="Total identificadas" value={resumo.total} />
              <ResumoCell label="Urgência Alta" value={resumo.alta} />
              <ResumoCell label="Urgência Média" value={resumo.media} />
              <ResumoCell label="Módulos ativos" value={`${resumo.modulos_ativos}/4`} />
            </div>
          </section>

          {(streaming || analise) && (
            <section className="container mt-4">
              <div className="bg-card border border-border rounded-lg p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <h3 className="font-semibold text-primary-deep">Análise Executiva</h3>
                  {streaming && <span className="streaming-dot" />}
                </div>
                <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {analise || <span className="text-muted-foreground italic">Gerando análise…</span>}
                </div>
              </div>
            </section>
          )}

          {oportunidades.length > 0 && (
            <>
              <section className="container mt-6">
                <div className="flex flex-wrap gap-3 mb-4 items-center">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Filtros:</span>
                  <Select value={fMod} onValueChange={setFMod}>
                    <SelectTrigger className="w-[180px] h-9 text-xs"><SelectValue placeholder="Módulo" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos módulos</SelectItem>
                      {MODULOS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={fUrg} onValueChange={setFUrg}>
                    <SelectTrigger className="w-[140px] h-9 text-xs"><SelectValue placeholder="Urgência" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas urgências</SelectItem>
                      {(["Alta", "Média", "Baixa"] as Urgencia[]).map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={fImp} onValueChange={setFImp}>
                    <SelectTrigger className="w-[150px] h-9 text-xs"><SelectValue placeholder="Impacto" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos impactos</SelectItem>
                      {(["Proteção", "Economia", "Defesa", "Reestruturação"] as Impacto[]).map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {filtradas.length} de {oportunidades.length}
                  </span>
                </div>

                <div className="space-y-6">
                  {MODULOS.map((m) => {
                    const items = grupos[m];
                    if (items.length === 0) return null;
                    return (
                      <div key={m}>
                        <h3 className="text-sm font-bold text-primary-deep uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span className="text-lg">{MODULO_ICON[m]}</span>
                          {m} · {items.length}
                        </h3>
                        <div className="grid lg:grid-cols-2 gap-4">
                          {items.map((o) => <OportunidadeCard key={o.id} op={o} />)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {onGoToTributario && (
                <section className="container mt-8">
                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-primary-deep mb-1">Oportunidades tributárias relacionadas</h4>
                      <p className="text-xs text-muted-foreground">
                        Este diagnóstico identificou questões que também podem gerar oportunidades de recuperação de créditos tributários.
                      </p>
                    </div>
                    <Button onClick={onGoToTributario} className="bg-primary hover:bg-primary-hover">
                      Ver Teses Tributárias <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </section>
              )}
            </>
          )}

          {oportunidades.length === 0 && (
            <section className="container mt-6">
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">
                  Nenhuma oportunidade qualificada para o perfil informado. Revise as respostas no Passo 2.
                </p>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}

function BlocoCheckboxes({
  titulo,
  itens,
  r,
  set,
}: {
  titulo: string;
  itens: [keyof RespostasEmpresa, string][];
  r: RespostasEmpresa;
  set: <K extends keyof RespostasEmpresa>(k: K, v: RespostasEmpresa[K]) => void;
}) {
  return (
    <div className="mb-5">
      <h4 className="text-sm font-semibold text-primary-deep mb-3">{titulo}</h4>
      <div className="grid md:grid-cols-2 gap-2.5">
        {itens.map(([k, label]) => (
          <label
            key={String(k)}
            className="flex items-start gap-2.5 text-sm cursor-pointer p-2 rounded hover:bg-secondary/50 transition-colors"
          >
            <Checkbox
              checked={r[k] as boolean}
              onCheckedChange={(v) => set(k, !!v as RespostasEmpresa[typeof k])}
              className="mt-0.5"
            />
            <span className="leading-snug text-foreground/85">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

const ResumoCell = ({ label, value }: { label: string; value: number | string }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wider text-white/60">{label}</div>
    <div className="text-3xl font-bold text-accent-light mt-1">{value}</div>
  </div>
);
