// Análise executiva via Lovable AI Gateway com streaming SSE
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { empresa, regime, faturamento, teses } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurada");

    const teseList = (teses || [])
      .map((t: any) => `- ${t.id} ${t.nome} (${t.area} / ${t.maturidade} / risco ${t.risco})`)
      .join("\n");

    const fatStr = faturamento
      ? `R$ ${Number(faturamento).toLocaleString("pt-BR")}`
      : "não informado";

    const systemPrompt = `Você é um consultor tributário sênior brasileiro especializado em recuperação de créditos. Produza análise executiva técnica, sóbria e cautelosa. NUNCA prometa resultados. Use sempre termos como "potencial", "estimativa preliminar", "análise inicial indica". Escreva em português do Brasil.`;

    const userPrompt = `Empresa: ${empresa?.razao_social || "—"}
CNPJ: ${empresa?.cnpj || "—"}
CNAE principal: ${empresa?.cnae_fiscal || "—"} — ${empresa?.cnae_fiscal_descricao || "—"}
Porte: ${empresa?.porte || "—"}
Regime: ${regime}
Faturamento anual estimado: ${fatStr}

Teses qualificadas pelo motor (${teses?.length || 0}):
${teseList}

Produza uma análise executiva em EXATAMENTE 4 parágrafos corridos (sem listas, sem títulos, sem bullets):
1) Diagnóstico do perfil tributário da empresa e contexto setorial.
2) As 3 teses prioritárias justificadas (preferir Pacificadas, depois Em afetação).
3) Riscos, modulações e cuidados de compliance relevantes.
4) Próximo passo concreto e objetivo (ex.: due diligence documental, MS preventivo, reunião com tributarista).

Tom executivo. Máx 350 palavras.`;

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
        return new Response(
          JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em instantes." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (resp.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos da IA esgotados. Adicione fundos no workspace Lovable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await resp.text();
      console.error("AI gateway error:", resp.status, t);
      return new Response(JSON.stringify({ error: "Falha no serviço de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(resp.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("analise-ia error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
