import { useMemo, useState } from "react";
import { useAnalise } from "@/context/AnaliseContext";
import { TIPO_COLOR, type TipoTransacao, type Esfera } from "@/data/transacoes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Search } from "lucide-react";

export function TransacoesTributarias() {
  const { transacoes, empresa } = useAnalise();
  const [fTipo, setFTipo] = useState<string>("all");
  const [fEsf, setFEsf] = useState<string>("all");

  const filtradas = useMemo(
    () => transacoes.filter((t) =>
      (fTipo === "all" || t.tipo === fTipo) &&
      (fEsf === "all" || t.esfera === fEsf),
    ),
    [transacoes, fTipo, fEsf],
  );

  const resumo = useMemo(() => {
    const transacao = transacoes.filter((t) => t.tipo === "Transação").length;
    const parcelamento = transacoes.filter((t) => t.tipo === "Parcelamento").length;
    const compensacao = transacoes.filter((t) => t.tipo === "Compensação").length;
    const federal = transacoes.filter((t) => t.esfera === "Federal").length;
    return { total: transacoes.length, transacao, parcelamento, compensacao, federal };
  }, [transacoes]);

  if (!empresa) return <EstadoVazio />;

  return (
    <>
      <section className="container py-6">
        <div className="bg-primary text-primary-foreground rounded-lg p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Cell label="Instrumentos disponíveis" value={resumo.total} />
          <Cell label="Transações" value={resumo.transacao} />
          <Cell label="Parcelamentos" value={resumo.parcelamento} />
          <Cell label="Compensações" value={resumo.compensacao} />
        </div>
      </section>

      <section className="container">
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Filtros:</span>
          <Select value={fTipo} onValueChange={setFTipo}>
            <SelectTrigger className="w-[160px] h-9 text-xs"><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {(["Transação", "Parcelamento", "Remissão", "Compensação"] as TipoTransacao[]).map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={fEsf} onValueChange={setFEsf}>
            <SelectTrigger className="w-[160px] h-9 text-xs"><SelectValue placeholder="Esfera" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as esferas</SelectItem>
              {(["Federal", "Estadual", "Municipal", "Trabalhista"] as Esfera[]).map((e) => (
                <SelectItem key={e} value={e}>{e}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground ml-auto">{filtradas.length} de {transacoes.length}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 pb-10">
          {filtradas.map((t) => {
            const c = TIPO_COLOR[t.tipo];
            return (
              <article
                key={t.id}
                className="tese-card animate-fade-in"
                style={{ ["--bar-color" as string]: c.bar }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-xs text-primary font-semibold">{t.id}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide" style={{ background: c.bg, color: c.text }}>
                      {t.tipo}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide bg-primary/10 text-primary">
                      {t.esfera}
                    </span>
                  </div>
                </div>
                <h3 className="text-base font-semibold text-primary-deep leading-snug mb-2">{t.nome}</h3>
                <p className="text-xs text-muted-foreground mb-3"><span className="font-medium text-foreground">Base legal: </span>{t.lei}</p>

                <div className="mb-3">
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5 font-semibold">Benefícios</div>
                  <ul className="space-y-1 text-xs text-foreground/85">
                    {t.beneficios.slice(0, 3).map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-accent shrink-0">●</span>
                        <span className="leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-3">
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5 font-semibold">Como aderir</div>
                  <ol className="space-y-1 text-xs text-foreground/85">
                    {t.como_aderir.slice(0, 2).map((p, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-primary font-semibold shrink-0">{i + 1}.</span>
                        <span className="leading-relaxed">{p}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">
                  Prazo: <span className="text-foreground/80 normal-case">{t.prazo}</span>
                </div>

                <div className="flex gap-2 items-start text-xs leading-relaxed bg-maturity-afetacao-bg/60 border-l-2 border-maturity-afetacao rounded-r p-2.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-maturity-afetacao shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{t.alerta}</span>
                </div>
              </article>
            );
          })}
        </div>

        {transacoes.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-8 text-center mb-10">
            <p className="text-muted-foreground text-sm">Nenhum instrumento de transação aplicável ao perfil informado.</p>
          </div>
        )}
      </section>
    </>
  );
}

function Cell({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-white/60">{label}</div>
      <div className="text-3xl font-bold text-accent-light mt-1">{value}</div>
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
          O motor avalia 8 instrumentos de transação e parcelamento aplicáveis ao perfil.
        </p>
      </div>
    </section>
  );
}
