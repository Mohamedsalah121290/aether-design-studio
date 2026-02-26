

# Stripe Webhook Edge Function

## What This Does
Automatically updates order and subscription status in your database when Stripe sends payment events (success, failure, cancellation) -- eliminating the need for manual admin updates.

## Events Handled
- **checkout.session.completed** -- Mark order as paid, create subscription record
- **invoice.payment_succeeded** -- Keep subscription active on renewal
- **invoice.payment_failed** -- Mark subscription as past_due
- **customer.subscription.deleted** -- Mark subscription as cancelled

## Implementation Steps

### 1. Add Stripe Webhook Signing Secret
You'll need to create a webhook endpoint in your Stripe Dashboard first, then provide the signing secret (`whsec_...`) so the function can verify incoming events are genuinely from Stripe.

### 2. Create `stripe-webhook` Edge Function
A new file at `supabase/functions/stripe-webhook/index.ts` that:
- Verifies the Stripe signature using the webhook secret
- Parses the event type
- On `checkout.session.completed`: updates the matching order (by `stripe_session_id`) to `payment_status = 'paid'` and `status = 'processing'`, and creates a subscription record linking the user, tool, and Stripe subscription ID
- On `invoice.payment_succeeded`: updates subscription status to `active` and refreshes period dates
- On `invoice.payment_failed`: updates subscription status to `past_due`
- On `customer.subscription.deleted`: updates subscription status to `cancelled`
- Uses `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS for admin-level writes

### 3. Update `supabase/config.toml`
Add the new function with `verify_jwt = false` (webhooks come from Stripe, not authenticated users).

### 4. Stripe Dashboard Setup
After deployment, you'll configure a webhook endpoint in Stripe pointing to:
`https://pilskrumnpvnvtkadbez.supabase.co/functions/v1/stripe-webhook`

---

## Technical Details

### Webhook Signature Verification
```text
Raw body + Stripe-Signature header --> stripe.webhooks.constructEvent()
```
This ensures only genuine Stripe events are processed.

### Database Updates (via service role)
- `orders` table: update `payment_status` and `status` columns
- `subscriptions` table: insert/update with Stripe subscription details

### No Frontend Changes Required
The webhook runs server-side. The Dashboard already displays order statuses dynamically, so once orders move from "pending" to "processing"/"active", users will see the change on refresh.

