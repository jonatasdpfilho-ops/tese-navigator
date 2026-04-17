// Edge function: proxy DataJud (CNJ) — busca processos judiciais por nome/CNPJ
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DATAJUD_KEY =
  "cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==";
const DATAJUD_BASE = "https://api-publica.datajud.cnj.jus.br/";

const TRIBUNAIS: { id: string; label: string; endpoint: string }[] = [
  { id: "trf4", label: "TRF4 (PR/SC/RS)", endpoint: "api_publica_trf4" },
  { id: "tjpr", label: "TJPR", endpoint: "api_publica_tjpr" },
  { id: "tst", label: "TST", endpoint: "api_publica_tst" },
  { id: "trf1", label: "TRF1", endpoint: "api_publica_trf1" },
  { id: "trf3", label: "TRF3 (SP/MS)", endpoint: "api_publica_trf3" },
  { id: "stj", label: "STJ", endpoint: "api_publica_stj" },
];

interface Hit {
  tribunal: string;
  numero: string;
  classe: string;
  assuntos: string;
  orgao: string;
  dataAjuizamento: string | null;
  valorCausa: number | null;
  polo: string;
  ultimoMovimento: string;
}

async function consultarTribunal(
  trib: { id: string; label: string; endpoint: string },
  razao: string,
  cnpj: string,
  signal: AbortSignal,
): Promise<Hit[]> {
  const url = DATAJUD_BASE + trib.endpoint + "/_search";
  const body = {
    query: {
      bool: {
        should: [
          { nested: { path: "partes", query: { match: { "partes.nome": razao } } } },
          { nested: { path: "partes", query: { match: { "partes.documento": cnpj } } } },
        ],
        minimum_should_match: 1,
      },
    },
    size: 20,
    _source: [
      "numeroProcesso",
      "classe",
      "assuntos",
      "orgaoJulgador",
      "tribunal",
      "dataAjuizamento",
      "valorCausa",
      "partes",
      "movimentos",
    ],
  };

  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "APIKey " + DATAJUD_KEY,
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!r.ok) return [];

  const data = await r.json();
  const hits = data?.hits?.hits || [];
  const razaoLower = razao.toLowerCase().slice(0, 12);

  return hits.map((h: any): Hit => {
    const src = h._source || {};
    const partes = src.partes || [];
    const parte = partes.find(
      (p: any) =>
        (p?.nome && p.nome.toLowerCase().includes(razaoLower)) ||
        p?.documento === cnpj,
    );
    const polo = parte?.polo || "?";
    return {
      tribunal: trib.label,
      numero: src.numeroProcesso || "—",
      classe: src.classe?.nome || "—",
      assuntos: (src.assuntos || []).map((a: any) => a?.nome).filter(Boolean).join(", ") || "—",
      orgao: src.orgaoJulgador?.nome || "—",
      dataAjuizamento: src.dataAjuizamento || null,
      valorCausa: typeof src.valorCausa === "number" ? src.valorCausa : null,
      polo,
      ultimoMovimento: (src.movimentos || [])[0]?.nome || "—",
    };
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { razao_social, cnpj } = await req.json();
    const razao = (razao_social || "").trim();
    const cnpjLimpo = (cnpj || "").replace(/\D/g, "");

    if (!razao && !cnpjLimpo) {
      return new Response(
        JSON.stringify({ ok: false, error: "Informe razão social ou CNPJ" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const tribunaisStatus: { id: string; label: string; ok: boolean; count: number; error?: string }[] = [];
    const todosHits: Hit[] = [];

    for (const trib of TRIBUNAIS) {
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 8000);
      try {
        const hits = await consultarTribunal(trib, razao, cnpjLimpo, ctrl.signal);
        tribunaisStatus.push({ id: trib.id, label: trib.label, ok: true, count: hits.length });
        todosHits.push(...hits);
      } catch (e) {
        tribunaisStatus.push({
          id: trib.id,
          label: trib.label,
          ok: false,
          count: 0,
          error: e instanceof Error ? e.message : "Erro",
        });
      } finally {
        clearTimeout(timeout);
      }
      // Rate-limit: 300ms entre tribunais
      await new Promise((r) => setTimeout(r, 300));
    }

    // Ordenar por data (mais recente primeiro)
    todosHits.sort((a, b) => {
      if (!a.dataAjuizamento) return 1;
      if (!b.dataAjuizamento) return -1;
      return b.dataAjuizamento.localeCompare(a.dataAjuizamento);
    });

    return new Response(
      JSON.stringify({ ok: true, total: todosHits.length, processos: todosHits, tribunais: tribunaisStatus }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("consulta-datajud error:", e);
    return new Response(
      JSON.stringify({ ok: false, error: e instanceof Error ? e.message : "Erro interno" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
