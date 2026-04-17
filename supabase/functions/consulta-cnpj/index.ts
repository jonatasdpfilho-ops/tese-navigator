// Edge function: consulta CNPJ via BrasilAPI (proxy para evitar CORS variável)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const cnpj = (url.searchParams.get("cnpj") || "").replace(/\D/g, "");

    // Sempre 200 — frontend lê `ok`/`error` do corpo (evita overlay de erro)
    if (cnpj.length !== 14) {
      return new Response(
        JSON.stringify({ ok: false, error: "CNPJ inválido" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const r = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
    const data = await r.json();

    if (!r.ok) {
      return new Response(
        JSON.stringify({ ok: false, error: data?.message || "Falha na consulta" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ ok: true, ...data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
