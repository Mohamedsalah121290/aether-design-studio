import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) throw new Error("No Stripe signature found");

    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");

    const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    logStep("Event received", { type: event.type, id: event.id });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout completed", { sessionId: session.id });

        // Update order to paid
        const { data: order, error: orderError } = await supabaseAdmin
          .from("orders")
          .update({ payment_status: "paid", status: "processing" })
          .eq("stripe_session_id", session.id)
          .select("id, tool_id, user_id")
          .single();

        if (orderError) {
          logStep("Order update error", { error: orderError.message });
        } else {
          logStep("Order updated to paid", { orderId: order.id });

          // Send payment confirmed email
          try {
            const { data: toolData } = await supabaseAdmin
              .from("tools")
              .select("name, price, activation_time")
              .eq("id", order.tool_id)
              .single();

            if (toolData) {
              const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);
              const dashboardUrl = "https://id-preview--92b6864c-4966-485c-b321-32542f78bf88.lovable.app/dashboard";
              const subject = `Payment confirmed — ${toolData.name}`;

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
                    <div class="sr"><span class="sl">Amount</span><span class="sv">$${Number(toolData.price).toFixed(2)}/mo</span></div>
                    <div class="sr" style="margin:0"><span class="sl">Activation</span><span class="sv">Within ${toolData.activation_time} hours</span></div>
                  </div>
                  <div class="bw"><a href="${dashboardUrl}" class="btn">View My Orders →</a></div>
                  <p class="m">You'll receive another email once your subscription is activated.</p>
                </div><hr/>
                <div class="ft"><p class="ftx">© ${new Date().getFullYear()} AI DEALS. All rights reserved.</p><p class="fm">You received this email because you placed an order with AI DEALS.</p></div>
              </div></body></html>`;

              const buyerEmail = (await supabaseAdmin.from("orders").select("buyer_email").eq("id", order.id).single()).data?.buyer_email;
              if (buyerEmail) {
                await resend.emails.send({ from: "AI DEALS <noreply@resend.dev>", to: [buyerEmail], subject, html });
                logStep("Payment confirmed email sent", { to: buyerEmail });
              }
            }
          } catch (emailErr) {
            logStep("Email send failed (non-fatal)", { error: String(emailErr) });
          }

          // Create subscription record if user exists
          if (order.user_id && session.subscription) {
            const stripeSubscription = await stripe.subscriptions.retrieve(
              session.subscription as string
            );

            const { error: subError } = await supabaseAdmin
              .from("subscriptions")
              .insert({
                user_id: order.user_id,
                order_id: order.id,
                tool_id: order.tool_id,
                stripe_subscription_id: stripeSubscription.id,
                stripe_customer_id: stripeSubscription.customer as string,
                status: "active",
                current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
                current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
              });

            if (subError) {
              logStep("Subscription insert error", { error: subError.message });
            } else {
              logStep("Subscription record created");
            }
          }
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        if (!subscriptionId) break;

        logStep("Invoice paid", { subscriptionId });

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
        else logStep("Subscription renewed");
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
        else logStep("Subscription marked past_due");
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
        else logStep("Subscription marked cancelled");
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg });
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
