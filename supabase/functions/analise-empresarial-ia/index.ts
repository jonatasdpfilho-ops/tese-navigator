// Análise executiva empresarial via Lovable AI Gateway com streaming SSE
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { respostas, oportunidades } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurada");

    const lista = (oportunidades || [])
      .map(
        (o: any) =>
          `- [${o.urgencia}] ${o.id} ${o.nome} (${o.modulo} / impacto ${o.impacto})`,
      )
      .join("\n");

    const fatStr = respostas?.faturamento
      ? `R$ ${Number(respostas.faturamento).toLocaleString("pt-BR")}`
      : "não informado";

    const sitMap: Record<string, string> = {
      saudavel: "Saudável (crescendo e lucrativa)",
      estavel: "Estável (sem crescimento relevante)",
      fragilizada: "Fragilizada (dificuldades de caixa)",
      crise: "Em crise (inadimplência relevante)",
    };
    const tendMap: Record<string, string> = {
      melhorando: "Melhorando",
      estavel: "Estável",
      piorando: "Piorando",
    };

    const systemPrompt = `Você é especialista em direito empresarial brasileiro (societário, bancário, recuperacional e execução fiscal). Gere análise executiva objetiva em português para o tomador de decisão da empresa. Tom direto, executivo, sem juridiquês. Use "recomendamos", "análise preliminar indica", "é fundamental avaliar". NUNCA prometa resultados.`;

    const userPrompt = `DADOS DA EMPRESA:
- Razão social: ${respostas?.razao_social || "—"}
- Faturamento anual: ${fatStr}
- Setor: ${respostas?.setor || "—"}
- Regime tributário: ${respostas?.regime || "—"}
- Tempo de operação: ${respostas?.tempo_operacao || "—"}
- Número de sócios: ${respostas?.num_socios || "—"}
- Situação financeira: ${sitMap[respostas?.situacao_financeira] || "—"}
- Tendência (12m): ${tendMap[respostas?.tendencia] || "—"}

OPORTUNIDADES IDENTIFICADAS (${oportunidades?.length || 0}):
${lista}

INSTRUÇÕES — produza EXATAMENTE 4 parágrafos corridos (sem listas, sem títulos):
1) Perfil e momento da empresa com base nas informações fornecidas.
2) As 3 oportunidades mais urgentes e por que são prioritárias para este perfil.
3) Riscos imediatos que precisam ser endereçados (urgência Alta).
4) Roteiro de ação recomendado em ordem de prioridade e próximo passo concreto.

Máximo 380 palavras. Apenas parágrafos corridos.`;

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
          JSON.stringify({ error: "Créditos da IA esgotados." }),
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
    console.error("analise-empresarial-ia error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
