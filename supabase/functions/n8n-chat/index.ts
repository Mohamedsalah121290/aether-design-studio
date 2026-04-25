import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const N8N_CHAT_WEBHOOK_URL = "https://asd202.app.n8n.cloud/webhook-test/e01e2727-e586-4b51-be17-ed1fb782b9c6";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { message, language, instruction } = await req.json();

    if (typeof message !== "string" || !message.trim()) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const n8nResponse = await fetch(N8N_CHAT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message.trim(), language, instruction }),
    });

    const contentType = n8nResponse.headers.get("content-type") || "text/plain";
    const body = contentType.includes("application/json") ? await n8nResponse.json() : await n8nResponse.text();

    return new Response(typeof body === "string" ? body : JSON.stringify(body), {
      status: n8nResponse.status,
      headers: { ...corsHeaders, "Content-Type": contentType.includes("application/json") ? "application/json" : "text/plain" },
    });
  } catch (error) {
    console.error("[n8n-chat] Request failed", error);
    return new Response(JSON.stringify({ error: "Chat connection failed" }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});