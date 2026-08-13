import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Safe logging: only non-sensitive identifiers are ever logged.
 * NEVER log secrets, webhook secrets, card data, or full Stripe objects.
 */
const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
};

type VerifyStatus = "paid" | "pending" | "failed" | "invalid";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status,
  });

/** Stripe Checkout Session IDs look like cs_test_... / cs_live_... */
const isValidSessionId = (value: unknown): value is string =>
  typeof value === "string" && /^cs_(test|live)_[A-Za-z0-9]+$/.test(value) && value.length <= 255;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } },
  );

  try {
    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      return json({ status: "invalid" satisfies VerifyStatus, reason: "malformed_request" }, 400);
    }

    const sessionId = body.session_id ?? body.sessionId;

    // 1. Reject missing / malformed session IDs before touching Stripe.
    if (!isValidSessionId(sessionId)) {
      logStep("Rejected malformed session id");
      return json({ status: "invalid" satisfies VerifyStatus, reason: "missing_or_malformed_session_id" }, 400);
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("Stripe key missing");
      return json({ status: "pending" satisfies VerifyStatus, reason: "verification_unavailable" }, 503);
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // 2. Retrieve the session server-side. If the session does not belong to
    //    this Stripe account/mode, Stripe itself returns a "No such" error.
    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["subscription", "payment_intent"],
      });
    } catch (retrieveError) {
      const msg = retrieveError instanceof Error ? retrieveError.message : String(retrieveError);
      logStep("Session not retrievable", { sessionId, stripeError: msg.slice(0, 120) });
      return json({ status: "invalid" satisfies VerifyStatus, reason: "session_not_found" }, 404);
    }

    // 3. Trust anchor: the session must map to an order we created ourselves.
    //    Browser-supplied data is never used to decide fulfilment.
    const { data: orders } = await supabaseAdmin
      .from("orders")
      .select("id, status, payment_status, tool_id, user_id, buyer_email, activation_deadline")
      .eq("stripe_session_id", sessionId);

    const matchedOrders = orders ?? [];
    if (matchedOrders.length === 0) {
      logStep("No internal order for session", { sessionId });
      return json({ status: "invalid" satisfies VerifyStatus, reason: "unknown_session" }, 404);
    }

    // 4. Derive the real payment state from Stripe (never from the browser).
    let status: VerifyStatus;
    if (session.status === "expired") {
      status = "failed";
    } else if (session.payment_status === "paid" || session.payment_status === "no_payment_required") {
      status = "paid";
    } else if (session.mode === "subscription") {
      const subscription = session.subscription as Stripe.Subscription | null;
      const subStatus = typeof subscription === "object" && subscription ? subscription.status : null;
      if (subStatus === "active" || subStatus === "trialing") status = "paid";
      else if (subStatus === "incomplete_expired" || subStatus === "canceled") status = "failed";
      else status = "pending";
    } else {
      const intent = session.payment_intent as Stripe.PaymentIntent | null;
      const intentStatus = typeof intent === "object" && intent ? intent.status : null;
      if (intentStatus === "succeeded") status = "paid";
      else if (intentStatus === "canceled") status = "failed";
      else status = "pending";
    }

    logStep("Verification result", {
      sessionId,
      status,
      mode: session.mode,
      orderCount: matchedOrders.length,
      orderId: matchedOrders[0]?.id,
      customerId: typeof session.customer === "string" ? session.customer : undefined,
    });

    // 5. The webhook remains the authoritative fulfilment path. This function
    //    only performs a safe, idempotent catch-up write when Stripe already
    //    confirmed the money and the webhook has not landed yet.
    if (status === "paid") {
      const stillUnpaid = matchedOrders.filter((o) => o.payment_status !== "paid");
      if (stillUnpaid.length > 0) {
        const { error: syncError } = await supabaseAdmin
          .from("orders")
          .update({ payment_status: "paid", status: "processing" })
          .eq("stripe_session_id", sessionId)
          .neq("payment_status", "paid");
        if (syncError) logStep("Order sync failed (non-fatal)", { sessionId, error: syncError.message });
        else logStep("Orders synced to paid", { sessionId, count: stillUnpaid.length });
      }
    }

    // 6. Return only the minimal, non-sensitive shape the UI needs.
    const { data: toolRows } = await supabaseAdmin
      .from("tools")
      .select("id, name, activation_time")
      .in("id", matchedOrders.map((o) => o.tool_id));

    const items = matchedOrders.map((order) => {
      const tool = (toolRows ?? []).find((t) => t.id === order.tool_id);
      return {
        order_id: order.id,
        product_name: tool?.name ?? null,
        activation_hours: tool?.activation_time ?? null,
      };
    });

    return json({
      status,
      is_subscription: session.mode === "subscription",
      items,
      activation_deadline: matchedOrders[0]?.activation_deadline ?? null,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg.slice(0, 200) });
    return json({ status: "pending" satisfies VerifyStatus, reason: "verification_error" }, 500);
  }
});
