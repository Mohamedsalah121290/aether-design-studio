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
    en: "After payment, we send the access details you purchased, including username and password when applicable.\nYou do not need to send your personal password before payment.",
    fr: "Après le paiement, nous envoyons les accès achetés, avec identifiant et mot de passe si nécessaire.\nVous n’avez pas besoin d’envoyer votre mot de passe personnel avant le paiement.",
    nl: "Na betaling sturen we de gekochte toegangsgegevens, inclusief gebruikersnaam en wachtwoord waar nodig.\nJe hoeft je persoonlijke wachtwoord niet vóór betaling te sturen.",
    de: "Nach der Zahlung senden wir die gekauften Zugangsdaten, einschließlich Benutzername und Passwort, falls zutreffend.\nDu musst uns vor der Zahlung kein persönliches Passwort senden.",
    es: "Después del pago, enviamos los datos de acceso comprados, incluido usuario y contraseña cuando corresponda.\nNo necesitas enviarnos tu contraseña personal antes del pago.",
    it: "Dopo il pagamento inviamo i dati di accesso acquistati, inclusi username e password quando necessario.\nNon devi inviarci la tua password personale prima del pagamento.",
    tr: "Ödemeden sonra satın aldığın erişim bilgilerini, gerektiğinde kullanıcı adı ve şifreyle birlikte göndeririz.\nÖdeme öncesinde kişisel şifreni bize göndermen gerekmez.",
    ar: "بعد الدفع نرسل لك تفاصيل الوصول التي اشتريتها، بما في ذلك اسم المستخدم وكلمة المرور عند الحاجة.\nلا تحتاج إلى إرسال كلمة مرورك الشخصية قبل الدفع.",
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