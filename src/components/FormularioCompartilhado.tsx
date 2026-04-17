import { useEffect, useRef } from "react";
import { Sparkles, ArrowRight, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAnalise, type FormState } from "@/context/AnaliseContext";
import { maskCnpj, maskMoney, unmask } from "@/lib/masks";
import type { Regime } from "@/data/teses";
import type { Setor, NumSocios, TempoOperacao } from "@/data/oportunidades";

const SETORES: Setor[] = [
  "Saúde", "Construção civil", "Agronegócio", "Comércio varejista",
  "Indústria", "Transporte e logística", "Tecnologia e serviços", "Holding / Grupo", "Outros",
];

export function FormularioCompartilhado() {
  const { form, setForm, empresa, status, analisar, consultarCnpj } = useAnalise();
  const debRef = useRef<number | null>(null);

  // autopreenchimento via BrasilAPI
  useEffect(() => {
    const limpo = unmask(form.cnpj);
    if (limpo.length !== 14) return;
    if (empresa?.cnpj === limpo) return;
    if (debRef.current) window.clearTimeout(debRef.current);
    debRef.current = window.setTimeout(() => consultarCnpj(form.cnpj), 600);
    return () => { if (debRef.current) window.clearTimeout(debRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.cnpj]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const autoPreenchido = empresa?.cnpj === unmask(form.cnpj);

  return (
    <section className="container -mt-6 relative z-10">
      <div className="bg-card rounded-lg shadow-navy p-5 md:p-6 border border-border">
        {/* Linha 1: CNPJ + status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs flex items-center gap-2">
              CNPJ
              {status.cnpj === "loading" && <Loader2 className="w-3 h-3 animate-spin text-accent" />}
              {status.cnpj === "ok" && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
              {status.cnpj === "error" && <AlertCircle className="w-3 h-3 text-destructive" />}
            </Label>
            <Input
              value={form.cnpj}
              onChange={(e) => set("cnpj", maskCnpj(e.target.value))}
              placeholder="00.000.000/0000-00"
              inputMode="numeric"
            />
          </div>
          <div>
            <Label className="text-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-accent" /> Análise IA — todos os módulos
            </Label>
            <div className="h-10 px-3 rounded-md bg-secondary/60 border border-border flex items-center text-xs text-muted-foreground">
              Lovable AI Gateway · automático
            </div>
          </div>
        </div>

        {/* Linha 2: razão social, regime, porte */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <Label className="text-xs flex items-center gap-1.5">
              Razão social
              {autoPreenchido && (
                <span className="text-[9px] uppercase tracking-wider text-accent font-semibold">
                  ● via CNPJ
                </span>
              )}
            </Label>
            <Input
              value={form.razao_social}
              onChange={(e) => set("razao_social", e.target.value)}
              placeholder="Empresa Ltda"
            />
          </div>
          <div>
            <Label className="text-xs">Regime tributário</Label>
            <Select value={form.regime} onValueChange={(v) => set("regime", v as Regime)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Simples Nacional">Simples Nacional</SelectItem>
                <SelectItem value="Lucro Presumido">Lucro Presumido</SelectItem>
                <SelectItem value="Lucro Real">Lucro Real</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Porte</Label>
            <Input
              value={form.porte}
              onChange={(e) => set("porte", e.target.value)}
              placeholder="ME / EPP / Demais"
              readOnly={autoPreenchido}
              className={autoPreenchido ? "bg-secondary/40" : ""}
            />
          </div>
        </div>

        {/* Linha 3: campos manuais + botão */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
          <div>
            <Label className="text-xs">Faturamento anual (R$)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
              <Input
                className="pl-9"
                value={form.faturamento}
                onChange={(e) => set("faturamento", maskMoney(e.target.value))}
                placeholder="3.000.000"
                inputMode="numeric"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">Nº de sócios</Label>
            <Select value={form.num_socios} onValueChange={(v) => set("num_socios", v as NumSocios)}>
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
            <Label className="text-xs">Tempo de operação</Label>
            <Select value={form.tempo_operacao} onValueChange={(v) => set("tempo_operacao", v as TempoOperacao)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="<2">Menos de 2 anos</SelectItem>
                <SelectItem value="2-5">2 a 5 anos</SelectItem>
                <SelectItem value="5-15">5 a 15 anos</SelectItem>
                <SelectItem value=">15">Mais de 15 anos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Setor</Label>
            <Select value={form.setor} onValueChange={(v) => set("setor", v as Setor)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SETORES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={analisar}
              disabled={status.cnpj === "loading" || status.tributario === "loading"}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground h-10 font-semibold"
            >
              Analisar todos <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Badges de progresso */}
        {(status.tributario !== "idle" || status.empresarial !== "idle" || status.processos !== "idle") && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border text-[10px] uppercase tracking-wider">
            <Badge label="Tributário" s={status.tributario} />
            <Badge label="Passivo" s={status.tributario} />
            <Badge label="Transações" s={status.tributario} />
            <Badge label="Empresarial" s={status.empresarial} />
            <Badge label="DataJud" s={status.processos} />
          </div>
        )}
      </div>
    </section>
  );
}

function Badge({ label, s }: { label: string; s: "idle" | "loading" | "ok" | "error" }) {
  const cls =
    s === "ok" ? "bg-emerald-100 text-emerald-700"
    : s === "loading" ? "bg-accent/20 text-accent-foreground"
    : s === "error" ? "bg-destructive/10 text-destructive"
    : "bg-secondary text-muted-foreground";
  const icon =
    s === "ok" ? "✓"
    : s === "loading" ? "⟳"
    : s === "error" ? "!"
    : "○";
  return (
    <span className={`px-2 py-1 rounded font-semibold ${cls}`}>
      {icon} {label}
    </span>
  );
}
