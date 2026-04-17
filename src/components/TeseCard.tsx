import { MATURIDADE_COLOR, type Tese } from "@/data/teses";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export function TeseCard({ tese }: { tese: Tese }) {
  const c = MATURIDADE_COLOR[tese.maturidade];
  const isReforma = tese.area === "Reforma Tributária";

  return (
    <article
      className="tese-card animate-fade-in"
      style={{ ["--bar-color" as string]: c.bar }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <span className="text-primary font-semibold">{tese.id}</span>
          <span>·</span>
          <span>{tese.area}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {isReforma && (
            <span className="text-[10px] italic font-medium px-2 py-0.5 rounded bg-maturity-reforma-bg text-maturity-reforma">
              LC 214/2025
            </span>
          )}
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide"
            style={{ background: c.bg, color: c.text }}
          >
            {tese.maturidade}
          </span>
        </div>
      </div>

      <h3 className="text-base font-semibold text-primary-deep leading-snug mb-2">
        {tese.nome}
      </h3>

      <div className="flex flex-wrap gap-1 mb-3">
        {tese.regimes.map((r) => (
          <Badge key={r} variant="outline" className="text-[10px] font-normal">
            {r}
          </Badge>
        ))}
        <Badge variant="outline" className="text-[10px] font-normal border-accent/40 text-accent-foreground bg-accent/10">
          Risco {tese.risco}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
        <span className="font-medium text-foreground">Perfil: </span>
        {tese.cnae_desc}
      </p>

      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
        <span className="font-medium">Base legal: </span>
        {tese.lei}
      </p>

      <div className="grid sm:grid-cols-2 gap-2 mb-3 text-xs">
        <div className="bg-secondary/60 rounded px-3 py-2">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
            Conservador
          </div>
          <div className="text-foreground font-medium">{tese.est_cons}</div>
        </div>
        <div className="bg-secondary/60 rounded px-3 py-2">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
            Otimista
          </div>
          <div className="text-foreground font-medium">{tese.est_ot}</div>
        </div>
      </div>

      {tese.via.length > 0 && (
        <div className="text-xs text-muted-foreground mb-3">
          <span className="font-medium text-foreground">Vias: </span>
          {tese.via.join(" · ")}
        </div>
      )}

      <div className="flex gap-2 items-start text-xs leading-relaxed bg-maturity-afetacao-bg/60 border-l-2 border-maturity-afetacao rounded-r p-2.5">
        <AlertTriangle className="w-3.5 h-3.5 text-maturity-afetacao shrink-0 mt-0.5" />
        <span className="text-foreground/80">{tese.alerta}</span>
      </div>
    </article>
  );
}
