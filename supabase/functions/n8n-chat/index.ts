import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://esm.sh/zod@3.25.76";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const N8N_CHAT_WEBHOOK_URL = "https://asd202.app.n8n.cloud/webhook/f5507dd5-c620-4b55-8cd9-afe56f6bd65b";

const BodySchema = z.object({
  message: z.string().trim().min(1).max(1000),
  language: z.enum(["en", "fr", "nl", "de", "es", "it", "tr", "ar"]).optional().default("en"),
  instruction: z.string().max(2000).optional(),
});

const fallbackReply = (language: string) => {
  const replies: Record<string, string> = {
    en: "You get instant access and it’s cheaper than official pricing.\nWant me to show you the best option?",
    fr: "Vous avez un accès instantané, moins cher que le prix officiel.\nJe vous montre la meilleure option ?",
    nl: "Je krijgt direct toegang en het is goedkoper dan de officiële prijs.\nZal ik je de beste optie tonen?",
    de: "Sie erhalten Sofortzugang und zahlen weniger als beim offiziellen Preis.\nSoll ich Ihnen die beste Option zeigen?",
    es: "Tienes acceso instantáneo y es más barato que el precio oficial.\n¿Te muestro la mejor opción?",
    it: "Hai accesso immediato ed è più economico del prezzo ufficiale.\nVuoi che ti mostri l’opzione migliore?",
    tr: "Anlıyorum 👍 Resmi fiyatlara göre daha uygun ve hemen erişim sağlanır.\nSenin için en uygun seçeneği göstereyim mi?",
    ar: "تحصل على وصول فوري والسعر أقل من الرسمي.\nتحب أوريك أفضل خيار لك؟",
  };
  return replies[language] || replies.en;
};

const readResponseBody = async (response: Response) => {
  const contentType = response.headers.get("content-type") || "";
  const raw = await response.text();

  if (!raw) return null;
  if (!contentType.includes("application/json")) return raw;

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

const extractReply = (body: unknown) => {
  if (typeof body === "string") return body;
  if (Array.isArray(body)) return body.map(extractReply).find(Boolean) || null;
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    const value = record.reply || record.response || record.text || record.message || record.output || record.answer;
    return typeof value === "string" ? value : null;
  }
  return null;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const parsed = BodySchema.safeParse(await req.json());

    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { message, language } = parsed.data;

    const n8nResponse = await fetch(N8N_CHAT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const body = await readResponseBody(n8nResponse);

    if (!n8nResponse.ok) {
      console.warn("[n8n-chat] Upstream webhook unavailable", { status: n8nResponse.status, body });
      return new Response(JSON.stringify({ reply: fallbackReply(language), upstreamStatus: n8nResponse.status }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const reply = extractReply(body);
    if (!reply || /Unused Respond to Webhook node found/i.test(reply)) {
      console.warn("[n8n-chat] Upstream webhook returned no usable reply", { status: n8nResponse.status, body });
      return new Response(JSON.stringify({ reply: fallbackReply(language), upstreamStatus: n8nResponse.status }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[n8n-chat] Request failed", error);
    return new Response(JSON.stringify({ reply: fallbackReply("en"), upstreamStatus: "failed" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});