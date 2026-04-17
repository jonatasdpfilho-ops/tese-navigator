import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { URGENCIA_COLOR, type Oportunidade } from "@/data/oportunidades";

export function OportunidadeCard({ op }: { op: Oportunidade }) {
  const c = URGENCIA_COLOR[op.urgencia];

  return (
    <article
      className="tese-card animate-fade-in"
      style={{ ["--bar-color" as string]: c.bar }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <span className="text-primary font-semibold">{op.id}</span>
          <span>·</span>
          <span>{op.modulo}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide"
            style={{ background: c.bg, color: c.text }}
          >
            Urgência {op.urgencia}
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide bg-primary/10 text-primary">
            {op.impacto}
          </span>
        </div>
      </div>

      <h3 className="text-base font-semibold text-primary-deep leading-snug mb-2">
        {op.nome}
      </h3>

      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
        {op.descricao}
      </p>

      <div className="bg-secondary/60 rounded px-3 py-2 mb-3">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
          Fundamento
        </div>
        <div className="text-xs text-foreground/90 leading-relaxed">{op.fundamento}</div>
      </div>

      <div className="mb-3">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5 font-semibold">
          Próximos passos
        </div>
        <ol className="space-y-1 text-xs text-foreground/85">
          {op.proximos_passos.map((p, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-primary font-semibold shrink-0">{i + 1}.</span>
              <span className="leading-relaxed">{p}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex gap-2 items-start text-xs leading-relaxed bg-maturity-afetacao-bg/60 border-l-2 border-maturity-afetacao rounded-r p-2.5">
        <AlertTriangle className="w-3.5 h-3.5 text-maturity-afetacao shrink-0 mt-0.5" />
        <span className="text-foreground/80">{op.alerta}</span>
      </div>
    </article>
  );
}
