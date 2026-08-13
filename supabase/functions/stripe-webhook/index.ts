import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Safe logging: only non-sensitive identifiers (event id, session id, customer
 * id, subscription id, order id) are logged. NEVER log the Stripe secret key,
 * the webhook signing secret, raw request bodies, or card/payment credentials.
 */
const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

const SITE_URL = "https://www.aideals.be";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } },
  );

  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) throw new Error("No Stripe signature found");

    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) throw new Error("Webhook signing secret is not configured");

    const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    logStep("Event received", { type: event.type, eventId: event.id });

    /* ────────────────────────────────────────────────────────────────
       IDEMPOTENCY GATE
       Stripe retries deliveries. We claim each event id exactly once by
       inserting it into public.stripe_events (event_id is the PRIMARY KEY).
       A duplicate delivery hits the unique violation and returns early,
       so no handler below can ever run twice for the same event — which
       prevents duplicate orders, subscriptions, emails, wallet credits
       and fulfilment.
       ──────────────────────────────────────────────────────────────── */
    const { error: claimError } = await supabaseAdmin
      .from("stripe_events")
      .insert({
        event_id: event.id,
        event_type: event.type,
        payload_summary: { object_id: (event.data.object as { id?: string })?.id ?? null },
      });

    if (claimError) {
      // 23505 = unique violation → this event was already processed.
      if (claimError.code === "23505") {
        logStep("Duplicate event ignored", { eventId: event.id, type: event.type });
        return new Response(JSON.stringify({ received: true, duplicate: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
      throw new Error(`Could not claim event: ${claimError.message}`);
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout completed", { sessionId: session.id, mode: session.mode });

        // Only flip orders that are not already paid. Combined with the event
        // gate this makes the transition safe even if verify-payment ran first.
        const { data: updatedOrders, error: orderError } = await supabaseAdmin
          .from("orders")
          .update({ payment_status: "paid", status: "processing" })
          .eq("stripe_session_id", session.id)
          .neq("payment_status", "paid")
          .select("id, tool_id, user_id, buyer_email");

        if (orderError) {
          logStep("Order update error", { sessionId: session.id, error: orderError.message });
          break;
        }

        const orders = updatedOrders ?? [];
        logStep("Orders marked paid", { sessionId: session.id, count: orders.length });
        if (orders.length === 0) {
          logStep("No unpaid orders to transition", { sessionId: session.id });
          break;
        }

        // ---- Confirmation email (one per newly transitioned order) ----
        try {
          const resendKey = Deno.env.get("RESEND_API_KEY");
          if (resendKey) {
            const resend = new Resend(resendKey);
            for (const order of orders) {
              const { data: toolData } = await supabaseAdmin
                .from("tools")
                .select("name, price, activation_time")
                .eq("id", order.tool_id)
                .single();
              if (!toolData || !order.buyer_email) continue;

              const dashboardUrl = `${SITE_URL}/dashboard`;
              const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
                body{margin:0;padding:0;background:#fff;font-family:'Inter',-apple-system,sans-serif}
                .c{max-width:520px;margin:0 auto;padding:40px 24px}
                .hdr{text-align:center;padding-bottom:24px}
                .brand{font-size:22px;font-weight:700;color:#0A0D1A;margin:12px 0 0}
                hr{border:none;border-top:1px solid #E5E7EB;margin:0}
                h1{font-size:24px;font-weight:700;color:#0A0D1A;margin:0 0 16px}
                .t{font-size:15px;color:#374151;line-height:24px;margin:0 0 20px}
                .s{background:#F3F4F6;border-radius:12px;padding:20px;margin:0 0 28px}
                .sr{display:flex;justify-content:space-between;font-size:14px;color:#374151;margin:0 0 8px}
                .sl{color:#6B7280}.sv{font-weight:600;color:#0A0D1A}
                .bw{text-align:center;margin:0 0 28px}
                .btn{display:inline-block;background:#6C3FA0;color:#fff!important;font-size:15px;font-weight:600;padding:14px 32px;border-radius:12px;text-decoration:none}
                .m{font-size:13px;color:#9CA3AF;text-align:center;margin:0}
                .ft{padding-top:24px;text-align:center}.ftx{font-size:13px;color:#6B7280;margin:0 0 8px}.fm{font-size:12px;color:#9CA3AF;margin:0}
              </style></head><body><div class="c">
                <div class="hdr"><img src="https://pilskrumnpvnvtkadbez.supabase.co/storage/v1/object/public/email-assets/logo.png?v=1" alt="AI DEALS" width="48" height="48" style="border-radius:12px"/><p class="brand">AI DEALS</p></div><hr/>
                <div style="padding:32px 0">
                  <h1>Payment Confirmed ✓</h1>
                  <p class="t">Thank you for your purchase! Your payment has been received and your order is now being processed.</p>
                  <div class="s">
                    <div class="sr"><span class="sl">Product</span><span class="sv">${toolData.name}</span></div>
                    <div class="sr"><span class="sl">Amount</span><span class="sv">€${Number(toolData.price).toFixed(2)}</span></div>
                    <div class="sr" style="margin:0"><span class="sl">Activation</span><span class="sv">Within ${toolData.activation_time} hours</span></div>
                  </div>
                  <div class="bw"><a href="${dashboardUrl}" class="btn">View My Orders →</a></div>
                  <p class="m">You'll receive another email once your subscription is activated.</p>
                </div><hr/>
                <div class="ft"><p class="ftx">© ${new Date().getFullYear()} AI DEALS. All rights reserved.</p><p class="fm">You received this email because you placed an order with AI DEALS.</p></div>
              </div></body></html>`;

              await resend.emails.send({
                from: "AI DEALS <noreply@resend.dev>",
                to: [order.buyer_email],
                subject: `Payment confirmed — ${toolData.name}`,
                html,
              });
              logStep("Payment confirmed email sent", { orderId: order.id });
            }
          }
        } catch (emailErr) {
          logStep("Email send failed (non-fatal)", { sessionId: session.id, error: String(emailErr).slice(0, 160) });
        }

        // ---- Subscription record (upsert → never duplicated) ----
        if (session.subscription) {
          const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const primary = orders[0];
          if (primary?.user_id) {
            const { error: subError } = await supabaseAdmin
              .from("subscriptions")
              .upsert(
                {
                  user_id: primary.user_id,
                  order_id: primary.id,
                  tool_id: primary.tool_id,
                  stripe_subscription_id: stripeSubscription.id,
                  stripe_customer_id: stripeSubscription.customer as string,
                  status: "active",
                  current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
                  current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
                },
                { onConflict: "stripe_subscription_id" },
              );
            if (subError) logStep("Subscription upsert error", { error: subError.message });
            else logStep("Subscription record ensured", { subscriptionId: stripeSubscription.id });
          }

          // First successful subscription payment activates access.
          const { error: activateError } = await supabaseAdmin
            .from("orders")
            .update({ status: "pending_activation" })
            .eq("stripe_session_id", session.id)
            .eq("status", "processing");
          if (activateError) logStep("Activation step error", { error: activateError.message });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        if (!subscriptionId) break;
        logStep("Invoice paid", { subscriptionId, eventId: event.id });

        const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
        const { error } = await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "active",
            current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
          })
          .eq("stripe_subscription_id", subscriptionId);

        if (error) logStep("Subscription update error", { error: error.message });
        else logStep("Subscription renewed", { subscriptionId });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        if (!subscriptionId) break;
        logStep("Invoice payment failed", { subscriptionId });

        const { error } = await supabaseAdmin
          .from("subscriptions")
          .update({ status: "past_due" })
          .eq("stripe_subscription_id", subscriptionId);

        if (error) logStep("Subscription update error", { error: error.message });
        else logStep("Subscription marked past_due", { subscriptionId });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Subscription cancelled", { subscriptionId: subscription.id });

        const { error } = await supabaseAdmin
          .from("subscriptions")
          .update({ status: "cancelled", cancel_at_period_end: false })
          .eq("stripe_subscription_id", subscription.id);

        if (error) logStep("Subscription update error", { error: error.message });
        else logStep("Subscription marked cancelled", { subscriptionId: subscription.id });
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type, eventId: event.id });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg.slice(0, 200) });
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
