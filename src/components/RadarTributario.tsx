import { useMemo, useState } from "react";
import { qualificarTeses, TESES, type Tese, type Regime, type Maturidade, type Area, type Risco } from "@/data/teses";
import { maskCnpj, maskMoney, unmask } from "@/lib/masks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TeseCard } from "@/components/TeseCard";
import { exportJson, exportPdf } from "@/lib/export";
import { toast } from "sonner";
import { ArrowRight, Building2, Download, FileText, Search, Sparkles } from "lucide-react";

type Empresa = {
  razao_social?: string;
  cnpj?: string;
  cnae_fiscal?: string | number;
  cnae_fiscal_descricao?: string;
  porte?: string;
  situacao_cadastral?: string;
  descricao_situacao_cadastral?: string;
};

interface Props {
  onGoToEmpresarial?: () => void;
}

export function RadarTributario({ onGoToEmpresarial }: Props) {
  const [cnpj, setCnpj] = useState("");
  const [regime, setRegime] = useState<Regime>("Lucro Presumido");
  const [faturamento, setFaturamento] = useState("");
  const [loading, setLoading] = useState(false);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [teses, setTeses] = useState<Tese[]>([]);
  const [analise, setAnalise] = useState("");
  const [streaming, setStreaming] = useState(false);

  const [fMat, setFMat] = useState<string>("all");
  const [fArea, setFArea] = useState<string>("all");
  const [fRisco, setFRisco] = useState<string>("all");

  const fatNum = Number(unmask(faturamento)) || 0;

  const tesesFiltradas = useMemo(() => {
    return teses.filter((t) => {
      if (fMat !== "all" && t.maturidade !== fMat) return false;
      if (fArea !== "all" && t.area !== fArea) return false;
      if (fRisco !== "all" && t.risco !== fRisco) return false;
      return true;
    });
  }, [teses, fMat, fArea, fRisco]);

  const resumo = useMemo(() => {
    const pacificadas = teses.filter((t) => t.maturidade === "Pacificada").length;
    const emAfetacao = teses.filter((t) => t.maturidade === "Em afetação").length;
    const reforma = teses.filter((t) => t.area === "Reforma Tributária").length;
    const pacComPct = teses.filter((t) => t.maturidade === "Pacificada" && t.pct_cons);
    const pctCons = pacComPct.reduce((a, t) => a + (t.pct_cons || 0), 0);
    const pctOt = pacComPct.reduce((a, t) => a + (t.pct_ot || 0), 0);
    const creditoCons = fatNum * pctCons * 5;
    const creditoOt = fatNum * pctOt * 5;
    return { total: teses.length, pacificadas, emAfetacao, reforma, creditoCons, creditoOt };
  }, [teses, fatNum]);

  const analisar = async () => {
    const cnpjLimpo = unmask(cnpj);
    if (cnpjLimpo.length !== 14) {
      toast.error("Informe um CNPJ válido (14 dígitos).");
      return;
    }
    setLoading(true);
    setAnalise("");
    setEmpresa(null);
    setTeses([]);

    try {
      const cnpjUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/consulta-cnpj?cnpj=${cnpjLimpo}`;
      const r = await fetch(cnpjUrl, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
      });
      const data = await r.json();

      if (!r.ok || data?.error || data?.ok === false) {
        toast.error(data?.error || "Não foi possível consultar o CNPJ.");
        setLoading(false);
        return;
      }

      const emp: Empresa = {
        razao_social: data.razao_social || data.nome_fantasia,
        cnpj: maskCnpj(cnpjLimpo),
        cnae_fiscal: String(data.cnae_fiscal || ""),
        cnae_fiscal_descricao: data.cnae_fiscal_descricao,
        porte: data.porte,
        descricao_situacao_cadastral: data.descricao_situacao_cadastral,
      };
      setEmpresa(emp);

      const cnaeStr = String(data.cnae_fiscal || "");
      const qualificadas = qualificarTeses(cnaeStr, regime);
      setTeses(qualificadas);

      toast.success(`${qualificadas.length} teses qualificadas para o perfil.`);
      streamAnalise(emp, qualificadas);
    } catch (e: any) {
      toast.error(e?.message || "Erro ao consultar.");
    } finally {
      setLoading(false);
    }
  };

  const streamAnalise = async (emp: Empresa, qualificadas: Tese[]) => {
    setStreaming(true);
    setAnalise("");
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analise-ia`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          empresa: emp,
          regime,
          faturamento: fatNum,
          teses: qualificadas.map((t) => ({
            id: t.id, nome: t.nome, area: t.area, maturidade: t.maturidade, risco: t.risco,
          })),
        }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) toast.error("Limite de IA atingido. Tente novamente em instantes.");
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
      toast.error("Erro no streaming da análise.");
    } finally {
      setStreaming(false);
    }
  };

  const handleExportPdf = () => {
    if (!empresa) return;
    exportPdf({ empresa: empresa as any, regime, faturamento: fatNum, teses, resumo, analiseIa: analise });
  };
  const handleExportJson = () => {
    if (!empresa) return;
    exportJson({ empresa: empresa as any, regime, faturamento: fatNum, teses });
  };

  return (
    <>
      <section className="relative bg-gradient-hero text-white overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-accent/10" />
        <div className="absolute right-40 bottom-0 w-40 h-40 rounded-full bg-accent/5" />
        <div className="absolute -left-10 bottom-10 w-32 h-32 rounded-full bg-accent/10" />
        <div className="container relative py-12 md:py-16">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-accent mb-3">
            Recuperação de Créditos · 2026
          </span>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight max-w-2xl mb-3">
            Identifique <span className="text-accent">oportunidades tributárias</span> a partir do CNPJ.
          </h2>
          <p className="text-white/70 max-w-xl text-sm md:text-base leading-relaxed">
            Motor com 22 teses qualificadas automaticamente por CNAE e regime, análise executiva por IA e estimativa de crédito recuperável em 5 anos (art. 168, I CTN).
          </p>
        </div>
      </section>

      <section className="container -mt-6 relative z-10">
        <div className="bg-card rounded-lg shadow-navy p-5 md:p-6 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label className="text-xs">CNPJ</Label>
              <Input value={cnpj} onChange={(e) => setCnpj(maskCnpj(e.target.value))} placeholder="00.000.000/0000-00" inputMode="numeric" />
            </div>
            <div>
              <Label className="text-xs">Regime tributário</Label>
              <Select value={regime} onValueChange={(v) => setRegime(v as Regime)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Simples Nacional">Simples Nacional</SelectItem>
                  <SelectItem value="Lucro Presumido">Lucro Presumido</SelectItem>
                  <SelectItem value="Lucro Real">Lucro Real</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Faturamento anual estimado</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                <Input className="pl-9" value={faturamento} onChange={(e) => setFaturamento(maskMoney(e.target.value))} placeholder="3.000.000" inputMode="numeric" />
              </div>
            </div>
            <div className="lg:col-span-1 md:col-span-2">
              <Label className="text-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-accent" /> Análise IA
              </Label>
              <div className="h-10 px-3 rounded-md bg-secondary/60 border border-border flex items-center text-xs text-muted-foreground">
                Lovable AI Gateway · automático
              </div>
            </div>
            <div className="flex items-end">
              <Button onClick={analisar} disabled={loading} className="w-full bg-primary hover:bg-primary-hover text-primary-foreground h-10 font-semibold">
                {loading ? "Consultando..." : (<>Analisar <ArrowRight className="w-4 h-4 ml-1" /></>)}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {empresa && (
        <section className="container mt-6">
          <div className="bg-primary-deep text-white rounded-lg p-5 flex flex-col md:flex-row md:items-center gap-4 animate-fade-in">
            <Building2 className="w-8 h-8 text-accent shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg leading-tight">{empresa.razao_social}</h3>
              <p className="text-xs text-white/70 mt-1">
                {empresa.cnpj} · CNAE {empresa.cnae_fiscal} — {empresa.cnae_fiscal_descricao}
              </p>
              <div className="flex flex-wrap gap-2 mt-2 text-[10px] uppercase tracking-wider">
                <span className="bg-white/10 px-2 py-0.5 rounded">{empresa.porte || "Porte n/d"}</span>
                <span className="bg-accent/20 text-accent-light px-2 py-0.5 rounded">{empresa.descricao_situacao_cadastral || "—"}</span>
                <span className="bg-white/10 px-2 py-0.5 rounded">{regime}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleExportJson} className="border-accent/40 text-accent-light hover:bg-accent/10 hover:text-white">
                <Download className="w-3.5 h-3.5 mr-1" /> JSON
              </Button>
              <Button size="sm" onClick={handleExportPdf} className="bg-accent text-primary-deep hover:bg-accent-light">
                <FileText className="w-3.5 h-3.5 mr-1" /> PDF
              </Button>
            </div>
          </div>
        </section>
      )}

      {empresa && teses.length > 0 && (
        <section className="container mt-4">
          <div className="bg-primary text-primary-foreground rounded-lg p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            <ResumoCell label="Teses identificadas" value={resumo.total} />
            <ResumoCell label="Pacificadas (risco baixo)" value={resumo.pacificadas} />
            <ResumoCell label="Em afetação" value={resumo.emAfetacao} />
            <ResumoCell label="Reforma Tributária" value={resumo.reforma} />
            {fatNum > 0 && resumo.creditoCons > 0 && (
              <div className="col-span-2 md:col-span-4 pt-3 border-t border-white/10 grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/60">Crédito potencial conservador (5 anos)</div>
                  <div className="text-2xl font-bold text-accent-light mt-1">R$ {Math.round(resumo.creditoCons).toLocaleString("pt-BR")}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/60">Otimista (5 anos)</div>
                  <div className="text-2xl font-bold text-accent-light mt-1">R$ {Math.round(resumo.creditoOt).toLocaleString("pt-BR")}</div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {(streaming || analise) && (
        <section className="container mt-4">
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-accent" />
              <h3 className="font-semibold text-primary-deep">Análise Executiva</h3>
              {streaming && <span className="streaming-dot" />}
            </div>
            <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {analise || (<span className="text-muted-foreground italic">Gerando análise…</span>)}
            </div>
          </div>
        </section>
      )}

      {teses.length > 0 && (
        <section className="container mt-6">
          <div className="flex flex-wrap gap-3 mb-4 items-center">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Filtros:</span>
            <Select value={fMat} onValueChange={setFMat}>
              <SelectTrigger className="w-[160px] h-9 text-xs"><SelectValue placeholder="Maturidade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas maturidades</SelectItem>
                {(["Pacificada","Em afetação","Controvertida","Desfavorável","Regulatória"] as Maturidade[]).map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={fArea} onValueChange={setFArea}>
              <SelectTrigger className="w-[180px] h-9 text-xs"><SelectValue placeholder="Área" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas áreas</SelectItem>
                {(["PIS/COFINS","ICMS","IRPJ/CSLL","IPI","Previdenciário","Subvenções","Reforma Tributária"] as Area[]).map((a) => (<SelectItem key={a} value={a}>{a}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={fRisco} onValueChange={setFRisco}>
              <SelectTrigger className="w-[140px] h-9 text-xs"><SelectValue placeholder="Risco" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos riscos</SelectItem>
                {(["Baixo","Baixo-médio","Médio","Alto","Regulatório"] as Risco[]).map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground ml-auto">{tesesFiltradas.length} de {teses.length}</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            {tesesFiltradas.map((t) => <TeseCard key={t.id} tese={t} />)}
          </div>

          {onGoToEmpresarial && (
            <div className="mt-8 bg-accent/10 border border-accent/30 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-primary-deep mb-1">Diagnóstico empresarial complementar</h4>
                <p className="text-xs text-muted-foreground">
                  Sua empresa pode ter oportunidades de proteção patrimonial ou reestruturação societária.
                </p>
              </div>
              <Button onClick={onGoToEmpresarial} className="bg-primary hover:bg-primary-hover">
                Ver Diagnóstico Empresarial <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </section>
      )}

      {!empresa && !loading && (
        <section className="container py-16 grid place-items-center">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-full bg-secondary mx-auto grid place-items-center mb-4">
              <Search className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-semibold text-primary-deep mb-1">Comece informando o CNPJ</h3>
            <p className="text-sm text-muted-foreground">
              O motor de qualificação avalia automaticamente as {TESES.length} teses tributárias contra o perfil CNAE e regime da empresa.
            </p>
          </div>
        </section>
      )}

      {loading && !empresa && (
        <section className="container py-12 grid place-items-center">
          <div className="text-center">
            <div className="dot-loader mb-3"><span/><span/><span/></div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Consultando BrasilAPI...</p>
          </div>
        </section>
      )}
    </>
  );
}

const ResumoCell = ({ label, value }: { label: string; value: number }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wider text-white/60">{label}</div>
    <div className="text-3xl font-bold text-accent-light mt-1">{value}</div>
  </div>
);
