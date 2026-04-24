import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const body = await req.json();
    const { toolId, planId, customerEmail, useWalletCredit, billingInterval, paymentMethodTypes } = body;
    if (!toolId) throw new Error("toolId is required");
    logStep("Request parsed", { toolId, planId, useWalletCredit, billingInterval });

    // --- Payment method & currency config ---
    const requestedPmTypes = Array.isArray(paymentMethodTypes) && paymentMethodTypes.length > 0
      ? paymentMethodTypes
      : ['card'];
    const euMethods = ['ideal', 'bancontact', 'sepa_debit'];
    const hasEuMethods = requestedPmTypes.some((pm: string) => euMethods.includes(pm));
    const currency = 'eur'; // كل الأسعار في DB باليورو
    const pmTypes = hasEuMethods
      ? ['card', ...requestedPmTypes.filter((pm: string) => pm !== 'card')]
      : requestedPmTypes.includes('card') ? requestedPmTypes : ['card', ...requestedPmTypes];

    // --- Authenticate user (optional) ---
    const authHeader = req.headers.get("Authorization");
    let user = null;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      user = data.user;
    }
    logStep("Auth check", { userId: user?.id, email: user?.email });

    // --- Fetch tool ---
    const { data: tool, error: toolError } = await supabaseAdmin
      .from("tools")
      .select("*")
      .eq("id", toolId)
      .single();
    if (toolError || !tool) throw new Error("Tool not found");
    logStep("Tool found", { name: tool.name, basePrice: tool.price });

    // --- Fetch selected plan (if planId provided) ---
    let planPrice = tool.price;
    let planName = tool.name;
    let activationTime = tool.activation_time;

    if (planId) {
      const { data: plan } = await supabaseAdmin
        .from("tool_plans")
        .select("*")
        .eq("plan_id", planId)
        .eq("tool_id", tool.tool_id)
        .eq("is_active", true)
        .single();
      if (plan && plan.monthly_price != null) {
        planPrice = Number(plan.monthly_price);
        planName = `${tool.name} — ${plan.plan_name}`;
        activationTime = plan.activation_time || tool.activation_time;
        logStep("Plan found", { planName: plan.plan_name, planPrice });
      }
    }

    // --- Stripe init ---
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const email = customerEmail || user?.email;
    if (!email) throw new Error("Email is required");

    // --- Find/create Stripe customer ---
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customerId = customers.data.length > 0 ? customers.data[0].id : undefined;
    logStep("Customer check", { customerId, email });

    // --- Find/create Stripe product ---
    const productSearchKey = planId ? `${tool.tool_id}_${planId}` : tool.tool_id;
    const products = await stripe.products.search({
      query: `metadata["tool_id"]:"${productSearchKey}"`,
    });

    let product;
    if (products.data.length > 0) {
      product = products.data[0];
      logStep("Existing product found", { productId: product.id });
    } else {
      product = await stripe.products.create({
        name: planName,
        metadata: { tool_id: productSearchKey, db_id: tool.id },
      });
      logStep("Product created", { productId: product.id });
    }

    // --- Find/create Stripe price ---
    const interval = billingInterval === 'annual' ? 'year' : 'month';
    const priceInCents = interval === 'year'
      ? Math.round(planPrice * 12 * 0.8 * 100) // 20% annual discount
      : Math.round(planPrice * 100);

    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
      limit: 10,
    });

    let priceId: string | undefined;
    const matchingPrice = prices.data.find(
      p => p.unit_amount === priceInCents && p.recurring?.interval === interval && p.currency === currency
    );
    if (matchingPrice) {
      priceId = matchingPrice.id;
      logStep("Existing price found", { priceId, interval });
    }

    if (!priceId) {
      const newPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: priceInCents,
        currency,
        recurring: { interval },
      });
      priceId = newPrice.id;
      logStep("Price created", { priceId, interval, priceInCents });
    }

    // --- Wallet credit handling ---
    let walletDeduction = 0;
    let currentWalletBalance = 0;
    if (useWalletCredit && user?.id) {
      const { data: walletData } = await supabaseAdmin
        .from("wallets")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      if (walletData && Number(walletData.balance) > 0) {
        currentWalletBalance = Number(walletData.balance);
        walletDeduction = Math.min(currentWalletBalance, planPrice);
        logStep("Wallet credit", { balance: currentWalletBalance, deduction: walletDeduction });
      }
    }

    const origin = req.headers.get("origin") || "https://id-preview--92b6864c-4966-485c-b321-32542f78bf88.lovable.app";

    // --- Metadata for webhook ---
    const metadata: Record<string, string> = {
      tool_id: tool.id,
      tool_name: planName,
      delivery_type: tool.delivery_type,
    };
    if (user?.id) metadata.user_id = user.id;
    if (customerEmail) metadata.customer_email = customerEmail;
    if (walletDeduction > 0) metadata.wallet_deduction = walletDeduction.toString();

    // --- Full wallet payment (no Stripe needed) ---
    if (walletDeduction >= planPrice && user?.id) {
      logStep("Full payment by wallet credit");

      await supabaseAdmin
        .from("wallets")
        .update({ balance: Number((currentWalletBalance - walletDeduction).toFixed(2)) })
        .eq("user_id", user.id);

      await supabaseAdmin.from("wallet_transactions").insert({
        user_id: user.id,
        amount: walletDeduction,
        type: "debit",
        reason: "checkout_deduction",
      });

      const { data: order } = await supabaseAdmin
        .from("orders")
        .insert({
          tool_id: tool.id,
          buyer_email: email,
          user_id: user.id,
          status: "pending_activation",
          payment_status: "paid",
          customer_data: customerEmail ? { email: customerEmail } : {},
          activation_deadline: new Date(Date.now() + activationTime * 3600000).toISOString(),
        })
        .select("id")
        .single();

      logStep("Order created via wallet", { orderId: order?.id });

      return new Response(JSON.stringify({ paidByWallet: true, orderId: order?.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // --- Create Stripe Checkout Session ---
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      payment_method_types: pmTypes,
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancelled`,
      metadata,
      subscription_data: { metadata },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    // --- Create pending order ---
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        tool_id: tool.id,
        buyer_email: email,
        user_id: user?.id || null,
        status: "pending",
        payment_status: "pending",
        stripe_session_id: session.id,
        customer_data: customerEmail ? { email: customerEmail } : {},
        activation_deadline: new Date(Date.now() + activationTime * 3600000).toISOString(),
      })
      .select("id")
      .single();

    if (orderError) {
      logStep("Order creation error (non-fatal)", { error: orderError });
    } else {
      logStep("Order created", { orderId: order.id });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg });
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
