import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { qualificarTeses, type Tese, type Regime } from "@/data/teses";
import { qualificarRiscos, type Risco } from "@/data/riscos";
import { qualificarTransacoes, type Transacao } from "@/data/transacoes";
import {
  qualificarOportunidades,
  type Oportunidade,
  type RespostasEmpresa,
  type Setor,
  type NumSocios,
  type TempoOperacao,
} from "@/data/oportunidades";
import { unmask } from "@/lib/masks";
import { toast } from "sonner";

export type Empresa = {
  razao_social?: string;
  nome_fantasia?: string;
  cnpj?: string;
  cnae_fiscal?: string;
  cnae_fiscal_descricao?: string;
  porte?: string;
  descricao_situacao_cadastral?: string;
  opcao_pelo_simples?: boolean;
};

export type ProcessoHit = {
  tribunal: string;
  numero: string;
  classe: string;
  assuntos: string;
  orgao: string;
  dataAjuizamento: string | null;
  valorCausa: number | null;
  polo: string;
  ultimoMovimento: string;
};

export type TribunalStatus = {
  id: string;
  label: string;
  ok: boolean;
  count: number;
};

export interface FormState {
  cnpj: string;
  razao_social: string;
  regime: Regime;
  porte: string;
  faturamento: string;
  num_socios: NumSocios;
  tempo_operacao: TempoOperacao;
  setor: Setor;
}

export const FORM_INITIAL: FormState = {
  cnpj: "",
  razao_social: "",
  regime: "Lucro Presumido",
  porte: "",
  faturamento: "",
  num_socios: "1",
  tempo_operacao: "2-5",
  setor: "Outros",
};

export type ModuleStatus = "idle" | "loading" | "ok" | "error";

interface AnaliseContextValue {
  form: FormState;
  setForm: (f: FormState | ((p: FormState) => FormState)) => void;
  empresa: Empresa | null;

  teses: Tese[];
  riscos: Risco[];
  transacoes: Transacao[];
  oportunidades: Oportunidade[];
  processos: ProcessoHit[];
  tribunais: TribunalStatus[];

  status: {
    cnpj: ModuleStatus;
    tributario: ModuleStatus;
    empresarial: ModuleStatus;
    processos: ModuleStatus;
  };

  faturamento: number;
  hasAnalise: boolean;
  ultimaAnalise: Date | null;

  analisar: () => Promise<void>;
  consultarCnpj: (cnpj: string) => Promise<void>;
  resetar: () => void;
}

const AnaliseContext = createContext<AnaliseContextValue | null>(null);

export function AnaliseProvider({ children }: { children: ReactNode }) {
  const [form, setForm] = useState<FormState>(FORM_INITIAL);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [teses, setTeses] = useState<Tese[]>([]);
  const [riscos, setRiscos] = useState<Risco[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>([]);
  const [processos, setProcessos] = useState<ProcessoHit[]>([]);
  const [tribunais, setTribunais] = useState<TribunalStatus[]>([]);
  const [ultimaAnalise, setUltimaAnalise] = useState<Date | null>(null);
  const [status, setStatus] = useState<AnaliseContextValue["status"]>({
    cnpj: "idle",
    tributario: "idle",
    empresarial: "idle",
    processos: "idle",
  });

  const faturamento = Number(unmask(form.faturamento)) || 0;
  const hasAnalise = !!empresa;

  const consultarCnpj = useCallback(async (rawCnpj: string) => {
    const cnpjLimpo = unmask(rawCnpj);
    if (cnpjLimpo.length !== 14) return;
    setStatus((s) => ({ ...s, cnpj: "loading" }));
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/consulta-cnpj?cnpj=${cnpjLimpo}`;
      const r = await fetch(url, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
      });
      const data = await r.json();
      if (!r.ok || data?.ok === false || data?.error) {
        toast.error(data?.error || "Falha ao consultar CNPJ");
        setStatus((s) => ({ ...s, cnpj: "error" }));
        return;
      }
      const novoRegime: Regime = data.opcao_pelo_simples
        ? "Simples Nacional"
        : form.regime;
      setForm((p) => ({
        ...p,
        razao_social: data.razao_social || data.nome_fantasia || p.razao_social,
        porte: data.porte || p.porte,
        regime: novoRegime,
      }));
      setEmpresa({
        razao_social: data.razao_social,
        nome_fantasia: data.nome_fantasia,
        cnpj: cnpjLimpo,
        cnae_fiscal: String(data.cnae_fiscal || ""),
        cnae_fiscal_descricao: data.cnae_fiscal_descricao,
        porte: data.porte,
        descricao_situacao_cadastral: data.descricao_situacao_cadastral,
        opcao_pelo_simples: !!data.opcao_pelo_simples,
      });
      setStatus((s) => ({ ...s, cnpj: "ok" }));
    } catch (e: any) {
      toast.error(e?.message || "Erro ao consultar CNPJ");
      setStatus((s) => ({ ...s, cnpj: "error" }));
    }
  }, [form.regime]);

  const consultarDatajud = useCallback(async (razao: string, cnpj: string) => {
    setStatus((s) => ({ ...s, processos: "loading" }));
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/consulta-datajud`;
      const r = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ razao_social: razao, cnpj }),
      });
      const data = await r.json();
      if (!r.ok || data?.ok === false) {
        setProcessos([]);
        setTribunais(data?.tribunais || []);
        setStatus((s) => ({ ...s, processos: "error" }));
        return;
      }
      setProcessos(data.processos || []);
      setTribunais(data.tribunais || []);
      setStatus((s) => ({ ...s, processos: "ok" }));
    } catch (e) {
      console.error(e);
      setStatus((s) => ({ ...s, processos: "error" }));
    }
  }, []);

  const analisar = useCallback(async () => {
    const cnpjLimpo = unmask(form.cnpj);
    if (cnpjLimpo.length !== 14) {
      toast.error("Informe um CNPJ válido (14 dígitos).");
      return;
    }
    if (!form.razao_social && !empresa?.razao_social) {
      // Tenta consulta CNPJ primeiro
      await consultarCnpj(form.cnpj);
    }

    // Garante consulta CNPJ atualizada se ainda não temos
    let emp = empresa;
    if (!emp || emp.cnpj !== cnpjLimpo) {
      await consultarCnpj(form.cnpj);
      // pega valor sincronizado
      emp = empresa;
    }

    setStatus((s) => ({ ...s, tributario: "loading", empresarial: "loading" }));

    try {
      // Re-fetch empresa via state — usa setter funcional para garantir
      const empresaAtual = await new Promise<Empresa | null>((res) =>
        setEmpresa((curr) => {
          res(curr);
          return curr;
        }),
      );

      const cnaeStr = empresaAtual?.cnae_fiscal || "";
      const tesesQ = qualificarTeses(cnaeStr, form.regime);
      const riscosQ = qualificarRiscos(cnaeStr, form.regime);
      const transacoesQ = qualificarTransacoes(cnaeStr, form.regime);
      setTeses(tesesQ);
      setRiscos(riscosQ);
      setTransacoes(transacoesQ);
      setStatus((s) => ({ ...s, tributario: "ok" }));

      const respostas: RespostasEmpresa = {
        razao_social: form.razao_social || empresaAtual?.razao_social || "",
        faturamento: Number(unmask(form.faturamento)) || 0,
        num_socios: form.num_socios,
        setor: form.setor,
        regime: form.regime,
        tempo_operacao: form.tempo_operacao,
        imoveis_pf: false, imoveis_pj: false, outros_negocios: false,
        distribui_lucros: false, planejamento_sucessorio: false, divergencias_socios: false,
        financiamentos: false, juros_elevados: false, garantias_reais: false,
        cheque_especial: false, renegociacao: false,
        execucoes: false, redirecionamento: false, penhora: false,
        protestos: false, trabalhistas: false,
        situacao_financeira: "estavel", tendencia: "estavel",
      };
      const opsQ = qualificarOportunidades(respostas);
      setOportunidades(opsQ);
      setStatus((s) => ({ ...s, empresarial: "ok" }));

      // DataJud em paralelo
      const razao = form.razao_social || empresaAtual?.razao_social || "";
      consultarDatajud(razao, cnpjLimpo);

      setUltimaAnalise(new Date());
      toast.success(
        `${tesesQ.length} teses · ${riscosQ.length} riscos · ${transacoesQ.length} transações`,
      );
    } catch (e: any) {
      toast.error(e?.message || "Erro na análise.");
      setStatus((s) => ({ ...s, tributario: "error", empresarial: "error" }));
    }
  }, [form, empresa, consultarCnpj, consultarDatajud]);

  const resetar = useCallback(() => {
    setForm(FORM_INITIAL);
    setEmpresa(null);
    setTeses([]); setRiscos([]); setTransacoes([]); setOportunidades([]);
    setProcessos([]); setTribunais([]);
    setUltimaAnalise(null);
    setStatus({ cnpj: "idle", tributario: "idle", empresarial: "idle", processos: "idle" });
  }, []);

  return (
    <AnaliseContext.Provider
      value={{
        form, setForm, empresa,
        teses, riscos, transacoes, oportunidades,
        processos, tribunais,
        status, faturamento, hasAnalise, ultimaAnalise,
        analisar, consultarCnpj, resetar,
      }}
    >
      {children}
    </AnaliseContext.Provider>
  );
}

export function useAnalise() {
  const ctx = useContext(AnaliseContext);
  if (!ctx) throw new Error("useAnalise deve ser usado dentro de AnaliseProvider");
  return ctx;
}
