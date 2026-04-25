import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://esm.sh/zod@3.25.76";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const N8N_CHAT_WEBHOOK_URL = "https://asd202.app.n8n.cloud/webhook-test/e01e2727-e586-4b51-be17-ed1fb782b9c6";

const BodySchema = z.object({
  message: z.string().trim().min(1).max(1000),
  language: z.enum(["en", "fr", "nl", "de", "es", "it", "ar"]).optional().default("en"),
  instruction: z.string().max(2000).optional(),
});

const fallbackReply = (language: string) => {
  const replies: Record<string, string> = {
    en: "I can help you choose now 👍 Instant access, secure payment, and support are available.\nWhat do you need: content, design, or productivity?",
    fr: "Je peux vous aider à choisir maintenant 👍 Accès instantané, paiement sécurisé et support disponible.\nVous cherchez contenu, design ou productivité ?",
    nl: "Ik help je nu kiezen 👍 Directe toegang, veilige betaling en support beschikbaar.\nZoek je content, design of productiviteit?",
    de: "Ich helfe Ihnen jetzt bei der Auswahl 👍 Sofortzugang, sichere Zahlung und Support sind verfügbar.\nGeht es um Content, Design oder Produktivität?",
    es: "Te ayudo a elegir ahora 👍 Acceso instantáneo, pago seguro y soporte disponible.\n¿Buscas contenido, diseño o productividad?",
    it: "Ti aiuto a scegliere ora 👍 Accesso immediato, pagamento sicuro e supporto disponibile.\nCerchi contenuti, design o produttività?",
    ar: "أساعدك تختار الآن 👍 الوصول فوري، الدفع آمن، والدعم متاح.\nتحتاج أداة للمحتوى، التصميم، أم الإنتاجية؟",
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

    const { message, language, instruction } = parsed.data;

    const n8nResponse = await fetch(N8N_CHAT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, language, instruction }),
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