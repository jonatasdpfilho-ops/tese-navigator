import { useMemo } from "react";
import { useAnalise } from "@/context/AnaliseContext";
import { Loader2, CheckCircle2, AlertCircle, Search, Scale } from "lucide-react";

export function ProcessosJudiciais() {
  const { processos, tribunais, status, empresa } = useAnalise();

  const resumo = useMemo(() => {
    const ativo = processos.filter((p) => p.polo === "AT" || p.polo === "ATIVO").length;
    const passivo = processos.filter((p) => p.polo === "PA" || p.polo === "RE" || p.polo === "PASSIVO").length;
    const valor = processos.reduce((a, p) => a + (p.valorCausa || 0), 0);
    const exec = processos.filter((p) => /execu/i.test(p.classe)).length;
    const trab = processos.filter((p) => /trabalh|reclamatória/i.test(p.classe)).length;
    const ms = processos.filter((p) => /mandado de seguran/i.test(p.classe)).length;
    return { ativo, passivo, valor, exec, trab, ms, total: processos.length };
  }, [processos]);

  if (!empresa) return <EstadoVazio />;

  return (
    <>
      <section className="container py-6">
        <div className="bg-primary text-primary-foreground rounded-lg p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Cell label="Processos encontrados" value={resumo.total} />
          <Cell label="Como autor" value={resumo.ativo} highlight="hsl(213 90% 70%)" />
          <Cell label="Como réu" value={resumo.passivo} highlight="hsl(0 70% 60%)" />
          <Cell label="Valor total causas" value={resumo.valor > 0 ? `R$ ${Math.round(resumo.valor).toLocaleString("pt-BR")}` : "—"} />
        </div>
      </section>

      {/* Status por tribunal */}
      <section className="container">
        <div className="bg-card border border-border rounded-lg p-4 mb-4">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">
            Tribunais consultados
          </div>
          <div className="flex flex-wrap gap-2">
            {status.processos === "loading" && tribunais.length === 0 && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="w-3 h-3 animate-spin" /> Consultando tribunais...
              </span>
            )}
            {tribunais.map((t) => (
              <span key={t.id} className="flex items-center gap-1.5 text-xs px-2 py-1 rounded bg-secondary">
                {t.ok ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertCircle className="w-3 h-3 text-destructive" />}
                {t.label}
                <span className="text-muted-foreground">· {t.count}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Agrupamento */}
      {processos.length > 0 && (
        <section className="container mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Group label="Execuções Fiscais" value={resumo.exec} />
            <Group label="Trabalhistas" value={resumo.trab} />
            <Group label="Mandados de Segurança" value={resumo.ms} />
            <Group label="Outros" value={resumo.total - resumo.exec - resumo.trab - resumo.ms} />
          </div>
        </section>
      )}

      {/* Tabela */}
      <section className="container pb-10">
        {processos.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <Scale className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {status.processos === "loading"
                ? "Consultando DataJud..."
                : "Nenhum processo encontrado nos tribunais consultados. Pode indicar ausência de litígios públicos ou processos em sigilo."}
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-secondary/60">
                  <tr className="text-left">
                    <th className="px-3 py-2 font-semibold">Número</th>
                    <th className="px-3 py-2 font-semibold">Tribunal</th>
                    <th className="px-3 py-2 font-semibold">Classe</th>
                    <th className="px-3 py-2 font-semibold">Polo</th>
                    <th className="px-3 py-2 font-semibold">Valor</th>
                    <th className="px-3 py-2 font-semibold">Ajuizamento</th>
                  </tr>
                </thead>
                <tbody>
                  {processos.map((p, i) => {
                    const isAt = p.polo === "AT" || p.polo === "ATIVO";
                    const isRe = p.polo === "PA" || p.polo === "RE" || p.polo === "PASSIVO";
                    return (
                      <tr key={i} className="border-t border-border hover:bg-secondary/30">
                        <td className="px-3 py-2 font-mono text-[11px]">{p.numero}</td>
                        <td className="px-3 py-2">{p.tribunal}</td>
                        <td className="px-3 py-2">{p.classe}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${
                            isAt ? "bg-blue-100 text-blue-800" : isRe ? "bg-red-100 text-red-800" : "bg-secondary text-muted-foreground"
                          }`}>
                            {isAt ? "Autor" : isRe ? "Réu" : p.polo || "—"}
                          </span>
                        </td>
                        <td className="px-3 py-2">{p.valorCausa ? `R$ ${Math.round(p.valorCausa).toLocaleString("pt-BR")}` : "—"}</td>
                        <td className="px-3 py-2 text-muted-foreground">{p.dataAjuizamento ? new Date(p.dataAjuizamento).toLocaleDateString("pt-BR") : "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
      <div className="text-2xl md:text-3xl font-bold mt-1" style={{ color: highlight || "hsl(var(--accent-light))" }}>{value}</div>
    </div>
  );
}

function Group({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-xl font-bold text-primary-deep mt-1">{value}</div>
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
          Consultaremos o DataJud (CNJ) em vários tribunais para identificar processos da empresa.
        </p>
      </div>
    </section>
  );
}
