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

  try {
    logStep("Function started");

    const { toolId, customerEmail, customerPassword } = await req.json();
    if (!toolId) throw new Error("toolId is required");
    logStep("Request parsed", { toolId });

    // Get user if authenticated
    const authHeader = req.headers.get("Authorization");
    let user = null;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      user = data.user;
    }
    logStep("Auth check", { userId: user?.id, email: user?.email });

    // Fetch tool from database using service role
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: tool, error: toolError } = await supabaseAdmin
      .from("tools")
      .select("*")
      .eq("id", toolId)
      .single();

    if (toolError || !tool) throw new Error("Tool not found");
    logStep("Tool found", { name: tool.name, price: tool.price });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const email = customerEmail || user?.email;
    if (!email) throw new Error("Email is required");

    // Check for existing Stripe customer
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }
    logStep("Customer check", { customerId, email });

    // Find or create a Stripe product for this tool
    const products = await stripe.products.search({
      query: `metadata["tool_id"]:"${tool.tool_id}"`,
    });

    let product;
    if (products.data.length > 0) {
      product = products.data[0];
      logStep("Existing product found", { productId: product.id });
    } else {
      product = await stripe.products.create({
        name: tool.name,
        metadata: { tool_id: tool.tool_id, db_id: tool.id },
      });
      logStep("Product created", { productId: product.id });
    }

    // Find or create a price for this product
    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
      limit: 1,
    });

    let priceId;
    const priceInCents = Math.round(tool.price * 100);

    if (prices.data.length > 0 && prices.data[0].unit_amount === priceInCents) {
      priceId = prices.data[0].id;
      logStep("Existing price found", { priceId });
    } else {
      const newPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: priceInCents,
        currency: "usd",
        recurring: { interval: "month" },
      });
      priceId = newPrice.id;
      logStep("Price created", { priceId });
    }

    const origin = req.headers.get("origin") || "https://id-preview--92b6864c-4966-485c-b321-32542f78bf88.lovable.app";

    // Store metadata for webhook/success handling
    const metadata: Record<string, string> = {
      tool_id: tool.id,
      tool_name: tool.name,
      delivery_type: tool.delivery_type,
    };
    if (user?.id) metadata.user_id = user.id;
    if (customerEmail) metadata.customer_email = customerEmail;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${origin}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancelled`,
      metadata,
      subscription_data: { metadata },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    // Create a pending order
    const orderData: any = {
      tool_id: tool.id,
      buyer_email: email,
      user_id: user?.id || null,
      status: "pending",
      payment_status: "pending",
      stripe_session_id: session.id,
      customer_data: {},
      activation_deadline: new Date(Date.now() + tool.activation_time * 3600000).toISOString(),
    };

    if (tool.delivery_type === "subscribe_for_them" && customerEmail) {
      orderData.customer_data = { email: customerEmail };
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert(orderData)
      .select("id")
      .single();

    if (orderError) {
      logStep("Order creation error", { error: orderError });
    } else {
      logStep("Order created", { orderId: order.id });

      // Store credentials securely if needed
      if (tool.delivery_type === "subscribe_for_them" && customerPassword && order.id) {
        // Use the same encryption approach as store-credentials
        const key = await crypto.subtle.generateKey(
          { name: "AES-GCM", length: 256 },
          true,
          ["encrypt", "decrypt"]
        );
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encoded = new TextEncoder().encode(customerPassword);
        const encrypted = await crypto.subtle.encrypt(
          { name: "AES-GCM", iv },
          key,
          encoded
        );
        const exportedKey = await crypto.subtle.exportKey("raw", key);
        const combined = new Uint8Array([
          ...iv,
          ...new Uint8Array(exportedKey),
          ...new Uint8Array(encrypted),
        ]);
        const encryptedBase64 = btoa(String.fromCharCode(...combined));

        await supabaseAdmin.from("order_credentials").insert({
          order_id: order.id,
          email: customerEmail,
          encrypted_password: encryptedBase64,
        });
        logStep("Credentials stored securely");
      }
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
