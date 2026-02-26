import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LOGO_URL =
  "https://pilskrumnpvnvtkadbez.supabase.co/storage/v1/object/public/email-assets/logo.png?v=1";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[ORDER-NOTIFICATION] ${step}${detailsStr}`);
};

/* ── HTML email builder ── */

const baseStyles = `
  body { margin:0; padding:0; background:#ffffff; font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; }
  .container { max-width:520px; margin:0 auto; padding:40px 24px; }
  .header { text-align:center; padding-bottom:24px; }
  .logo { border-radius:12px; }
  .brand { font-size:22px; font-weight:700; color:#0A0D1A; margin:12px 0 0; letter-spacing:-0.5px; }
  .divider { border:none; border-top:1px solid #E5E7EB; margin:0; }
  .content { padding:32px 0; }
  h1 { font-size:24px; font-weight:700; color:#0A0D1A; margin:0 0 16px; letter-spacing:-0.5px; }
  .text { font-size:15px; color:#374151; line-height:24px; margin:0 0 20px; }
  .summary { background:#F3F4F6; border-radius:12px; padding:20px; margin:0 0 28px; }
  .summary-row { display:flex; justify-content:space-between; font-size:14px; color:#374151; margin:0 0 8px; }
  .summary-row:last-child { margin:0; }
  .summary-label { color:#6B7280; }
  .summary-value { font-weight:600; color:#0A0D1A; }
  .btn-wrap { text-align:center; margin:0 0 28px; }
  .btn { display:inline-block; background:#6C3FA0; color:#ffffff !important; font-size:15px; font-weight:600; padding:14px 32px; border-radius:12px; text-decoration:none; }
  .muted { font-size:13px; color:#9CA3AF; text-align:center; margin:0; }
  .footer { padding-top:24px; text-align:center; }
  .footer-text { font-size:13px; color:#6B7280; margin:0 0 8px; }
  .footer-muted { font-size:12px; color:#9CA3AF; margin:0; line-height:18px; }
`;

function buildEmail(subject: string, bodyHtml: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${baseStyles}</style></head><body>
<div class="container">
  <div class="header">
    <img src="${LOGO_URL}" alt="AI DEALS" width="48" height="48" class="logo"/>
    <p class="brand">AI DEALS</p>
  </div>
  <hr class="divider"/>
  <div class="content">${bodyHtml}</div>
  <hr class="divider"/>
  <div class="footer">
    <p class="footer-text">© ${new Date().getFullYear()} AI DEALS. All rights reserved.</p>
    <p class="footer-muted">You received this email because you placed an order with AI DEALS.</p>
  </div>
</div>
</body></html>`;
}

function paymentConfirmedBody(toolName: string, price: number, activationHours: number, dashboardUrl: string): string {
  return `
    <h1>Payment Confirmed ✓</h1>
    <p class="text">Thank you for your purchase! Your payment has been received and your order is now being processed.</p>
    <div class="summary">
      <div class="summary-row"><span class="summary-label">Product</span><span class="summary-value">${toolName}</span></div>
      <div class="summary-row"><span class="summary-label">Amount</span><span class="summary-value">$${price.toFixed(2)}/mo</span></div>
      <div class="summary-row"><span class="summary-label">Activation</span><span class="summary-value">Within ${activationHours} hours</span></div>
    </div>
    <div class="btn-wrap"><a href="${dashboardUrl}" class="btn">View My Orders →</a></div>
    <p class="muted">You'll receive another email once your subscription is activated and ready to use.</p>`;
}

function orderActivatedBody(toolName: string, dashboardUrl: string): string {
  return `
    <h1>Your Subscription is Ready! 🎉</h1>
    <p class="text">Great news — your <strong>${toolName}</strong> subscription has been activated and is ready to use.</p>
    <div class="summary">
      <div class="summary-row"><span class="summary-label">Product</span><span class="summary-value">${toolName}</span></div>
      <div class="summary-row"><span class="summary-label">Status</span><span class="summary-value" style="color:#16a34a;">Active</span></div>
    </div>
    <div class="btn-wrap"><a href="${dashboardUrl}" class="btn">Access My Vault →</a></div>
    <p class="muted">If you have any questions, just reply to this email.</p>`;
}

/* ── Main handler ── */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, orderId } = await req.json();
    if (!type || !orderId) throw new Error("Missing type or orderId");

    logStep("Request received", { type, orderId });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch order + tool
    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .select("*, tool:tools(name, price, activation_time)")
      .eq("id", orderId)
      .single();

    if (orderErr || !order) throw new Error("Order not found: " + (orderErr?.message ?? orderId));

    const toolName = (order as any).tool?.name ?? "AI Tool";
    const price = (order as any).tool?.price ?? 0;
    const activationHours = (order as any).tool?.activation_time ?? 6;
    const buyerEmail = order.buyer_email;
    const dashboardUrl = "https://id-preview--92b6864c-4966-485c-b321-32542f78bf88.lovable.app/dashboard";

    let subject: string;
    let html: string;

    if (type === "payment_confirmed") {
      subject = `Payment confirmed — ${toolName}`;
      html = buildEmail(subject, paymentConfirmedBody(toolName, price, activationHours, dashboardUrl));
    } else if (type === "order_activated") {
      subject = `Your ${toolName} subscription is ready!`;
      html = buildEmail(subject, orderActivatedBody(toolName, dashboardUrl));
    } else {
      throw new Error("Unknown notification type: " + type);
    }

    const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);
    const { error: sendError } = await resend.emails.send({
      from: "AI DEALS <noreply@resend.dev>",
      to: [buyerEmail],
      subject,
      html,
    });

    if (sendError) {
      logStep("Resend error", sendError);
      throw new Error("Failed to send email: " + JSON.stringify(sendError));
    }

    logStep("Email sent", { type, to: buyerEmail });

    return new Response(JSON.stringify({ success: true }), {
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
