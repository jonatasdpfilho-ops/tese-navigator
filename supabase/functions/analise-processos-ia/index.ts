// Análise IA do perfil litigioso (DataJud) com streaming SSE
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { empresa, total, polo_ativo, polo_passivo, valor_total, classes, assuntos, tribunais } =
      await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurada");

    const systemPrompt = `Você é um advogado contencioso sênior especializado em análise de litígios empresariais. Produza análise executiva sóbria do perfil litigioso. Português do Brasil, sem juridiquês excessivo.`;

    const userPrompt = `Empresa: ${empresa || "—"}
Total de processos: ${total}
Como autor (polo ativo): ${polo_ativo}
Como réu (polo passivo): ${polo_passivo}
Valor total das causas: R$ ${Number(valor_total || 0).toLocaleString("pt-BR")}
Principais classes: ${classes || "—"}
Principais assuntos: ${assuntos || "—"}
Tribunais com retorno: ${tribunais || "—"}

Produza análise em EXATAMENTE 4 parágrafos corridos (sem listas, sem títulos):
1) Perfil litigioso geral (agressividade, tipo de litígio predominante).
2) Principais riscos identificados pelos processos como réu.
3) Oportunidades identificadas pelos processos como autor.
4) Recomendações de gestão do contencioso.

Tom executivo, direto. Máx 320 palavras.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        stream: true,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de IA atingido." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos da IA esgotados." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await resp.text();
      console.error("AI error:", resp.status, t);
      return new Response(JSON.stringify({ error: "Falha no serviço de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(resp.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
