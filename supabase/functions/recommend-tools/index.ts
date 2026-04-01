import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { useCases, budget, experience } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("[recommend-tools] Configuration error: Missing API key");
      return new Response(
        JSON.stringify({ error: "Service temporarily unavailable" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if user is authenticated (optional — recommendations work for anon too)
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data: claimsData } = await supabase.auth.getUser(token);
      if (claimsData?.user) userId = claimsData.user.id;
    }

    const { data: tools, error: toolsErr } = await supabase
      .from("tools")
      .select("tool_id, name, category, logo_url, status")
      .eq("status", "active");
    if (toolsErr) throw toolsErr;

    const { data: plans, error: plansErr } = await supabase
      .from("tool_plans")
      .select("tool_id, plan_name, monthly_price")
      .eq("is_active", true);
    if (plansErr) throw plansErr;

    const catalog = (tools || []).map((t) => {
      const toolPlans = (plans || [])
        .filter((p) => p.tool_id === t.tool_id)
        .map((p) => `${p.plan_name}: €${p.monthly_price}/mo`)
        .join(", ");
      return `- ${t.name} (id: ${t.tool_id}, category: ${t.category}${toolPlans ? `, plans: ${toolPlans}` : ""})`;
    }).join("\n");

    const userPrompt = `User preferences:
- Needs: ${(useCases || []).join(", ")}
- Monthly budget: ${budget}
- Experience level: ${experience}

Available tools:
${catalog}

Recommend the best 4-6 tools for this user.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You are an AI software advisor for the AI DEALS platform. Given a user's needs, budget, and experience level, recommend the best-matching tools from the catalog. Be concise and specific about why each tool fits.",
          },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "recommend_tools",
              description: "Return 4-6 tool recommendations ranked by relevance.",
              parameters: {
                type: "object",
                properties: {
                  recommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        tool_id: { type: "string", description: "The tool_id from the catalog" },
                        reason: { type: "string", description: "One-sentence explanation of why this tool fits the user" },
                      },
                      required: ["tool_id", "reason"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["recommendations"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "recommend_tools" } },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("[recommend-tools] AI gateway error:", { status: response.status, body, timestamp: new Date().toISOString() });
      return new Response(
        JSON.stringify({ error: "Unable to generate recommendations. Please try again later." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const recommendations = JSON.parse(toolCall.function.arguments);

    // Persist to recommendation_history if user is authenticated
    if (userId) {
      await supabase.from("recommendation_history").insert({
        user_id: userId,
        preferences: { useCases, budget, experience },
        recommendations: recommendations.recommendations || [],
      });
    }

    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[recommend-tools] error:", e);
    return new Response(JSON.stringify({ error: "Unable to generate recommendations. Please try again later." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
