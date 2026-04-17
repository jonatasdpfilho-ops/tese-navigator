import { useMemo, useState } from "react";
import { useAnalise } from "@/context/AnaliseContext";
import { PROB_COLOR, type Probabilidade, type AreaR, type ImpactoR } from "@/data/riscos";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Search } from "lucide-react";

export function PassivoTributario() {
  const { riscos, faturamento, empresa } = useAnalise();
  const [fProb, setFProb] = useState<string>("all");
  const [fArea, setFArea] = useState<string>("all");
  const [fImp, setFImp] = useState<string>("all");

  const filtrados = useMemo(
    () => riscos.filter((r) =>
      (fProb === "all" || r.probabilidade === fProb) &&
      (fArea === "all" || r.area === fArea) &&
      (fImp === "all" || r.impacto === fImp),
    ),
    [riscos, fProb, fArea, fImp],
  );

  const resumo = useMemo(() => {
    const alta = riscos.filter((r) => r.probabilidade === "Alta").length;
    const media = riscos.filter((r) => r.probabilidade === "Média").length;
    const impactoAlto = riscos.filter((r) => r.impacto === "Alto").length;
    const cont = riscos.reduce((a, r) => a + (r.pct_cont || 0), 0) * faturamento;
    return { total: riscos.length, alta, media, impactoAlto, cont };
  }, [riscos, faturamento]);

  if (!empresa) return <EstadoVazio />;

  return (
    <>
      <section className="container py-6">
        <div className="bg-primary text-primary-foreground rounded-lg p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Cell label="Riscos identificados" value={resumo.total} />
          <Cell label="Probabilidade Alta" value={resumo.alta} highlight="hsl(0 70% 60%)" />
          <Cell label="Impacto Alto" value={resumo.impactoAlto} highlight="hsl(0 70% 60%)" />
          <Cell label="Contingência est. (anual)" value={faturamento > 0 && resumo.cont > 0 ? `R$ ${Math.round(resumo.cont).toLocaleString("pt-BR")}` : "—"} />
        </div>
      </section>

      <section className="container">
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Filtros:</span>
          <Select value={fProb} onValueChange={setFProb}>
            <SelectTrigger className="w-[160px] h-9 text-xs"><SelectValue placeholder="Probabilidade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {(["Alta", "Média", "Baixa"] as Probabilidade[]).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={fArea} onValueChange={setFArea}>
            <SelectTrigger className="w-[160px] h-9 text-xs"><SelectValue placeholder="Área" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas áreas</SelectItem>
              {(["PIS/COFINS", "ICMS", "IRPJ/CSLL", "Previdenciário", "Outros"] as AreaR[]).map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={fImp} onValueChange={setFImp}>
            <SelectTrigger className="w-[140px] h-9 text-xs"><SelectValue placeholder="Impacto" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {(["Alto", "Médio", "Baixo"] as ImpactoR[]).map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground ml-auto">{filtrados.length} de {riscos.length}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 pb-10">
          {filtrados.map((r) => {
            const c = PROB_COLOR[r.probabilidade];
            return (
              <article
                key={r.id}
                className="tese-card animate-fade-in"
                style={{ ["--bar-color" as string]: c.bar }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <span className="text-primary font-semibold">{r.id}</span>
                    <span>·</span>
                    <span>{r.area}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide" style={{ background: c.bg, color: c.text }}>
                      Prob. {r.probabilidade}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide bg-primary/10 text-primary">
                      Imp. {r.impacto}
                    </span>
                  </div>
                </div>
                <h3 className="text-base font-semibold text-primary-deep leading-snug mb-2">{r.nome}</h3>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{r.descricao}</p>
                <p className="text-xs text-muted-foreground mb-3"><span className="font-medium text-foreground">Base legal: </span>{r.lei}</p>
                <div className="mb-3">
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5 font-semibold">Como mitigar</div>
                  <ol className="space-y-1 text-xs text-foreground/85">
                    {r.como_mitigar.map((p, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-primary font-semibold shrink-0">{i + 1}.</span>
                        <span className="leading-relaxed">{p}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="flex gap-2 items-start text-xs leading-relaxed bg-maturity-afetacao-bg/60 border-l-2 border-maturity-afetacao rounded-r p-2.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-maturity-afetacao shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{r.alerta}</span>
                </div>
              </article>
            );
          })}
        </div>

        {riscos.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-8 text-center mb-10">
            <p className="text-muted-foreground text-sm">Nenhum risco qualificado para o perfil informado.</p>
          </div>
        )}
      </section>
    </>
  );
}

function Cell({ label, value, highlight }: { label: string; value: number | string; highlight?: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-white/60">{label}</div>
      <div className="text-2xl md:text-3xl font-bold mt-1" style={{ color: highlight || "hsl(var(--accent-light))" }}>
        {value}
      </div>
    </div>
  );
}

function EstadoVazio() {
  return (
    <section className="container py-16 grid place-items-center">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-secondary mx-auto grid place-items-center mb-4">
          <Search className="w-7 h-7 text-primary" />
        </div>
        <h3 className="font-semibold text-primary-deep mb-1">Informe o CNPJ no formulário acima</h3>
        <p className="text-sm text-muted-foreground">
          O motor avalia 10 riscos tributários contra o perfil CNAE e regime da empresa.
        </p>
      </div>
    </section>
  );
}
