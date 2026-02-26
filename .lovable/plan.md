

# Order Status Notification Emails

## Overview
Send branded notification emails to users when their order status changes (payment confirmed, order activated) using the existing Resend integration. This extends the `stripe-webhook` function and adds a new dedicated email-sending function.

## Email Types
1. **Payment Confirmed** -- Sent when `checkout.session.completed` fires and order moves to `paid/processing`
2. **Order Activated** -- Sent when an admin marks an order as `activated` (or via future automation)

## Implementation

### 1. Create `order-notification` Edge Function
A new edge function at `supabase/functions/order-notification/index.ts` that:
- Accepts `{ type, orderId }` as input
- Fetches order + tool details from the database using service role
- Renders a branded HTML email using inline styles (matching the existing email template aesthetic)
- Sends via Resend using the existing `RESEND_API_KEY`
- Supports two templates: `payment_confirmed` and `order_activated`

### 2. Update `stripe-webhook` to Trigger Notification
After successfully updating an order to `paid/processing` in the `checkout.session.completed` handler:
- Call the `order-notification` function internally (via fetch to the function URL) or inline the Resend send logic directly in the webhook
- **Chosen approach**: Inline the Resend call directly in the webhook to avoid an extra network hop and keep it simple

### 3. Add Admin-Triggered Activation Email
When the admin updates an order status to `activated`:
- Add a call from the frontend (or create a small wrapper) that invokes `order-notification` with `type: "order_activated"`
- Alternatively, add a database trigger approach -- but a direct function call from the admin page is simpler and more transparent

### 4. Update `supabase/config.toml`
Add the new function entry:
```text
[functions.order-notification]
verify_jwt = false
```

## Email Templates (Inline HTML)

### Payment Confirmed Email
- Subject: "Payment confirmed -- [Tool Name]"
- Body: Thank you message, order summary (tool name, price), expected activation time, link to dashboard

### Order Activated Email
- Subject: "Your [Tool Name] subscription is ready!"
- Body: Confirmation that the subscription is active, access instructions, link to dashboard

Both templates will use the same visual style as the existing auth email templates (clean, white background, centered layout, brand header with logo).

## Files Changed
| File | Change |
|------|--------|
| `supabase/functions/order-notification/index.ts` | **New** -- Resend-powered notification sender |
| `supabase/functions/stripe-webhook/index.ts` | **Modified** -- Add Resend call after order status update |
| `supabase/config.toml` | **Modified** -- Add `order-notification` function config |
| `src/pages/AdminPage.tsx` | **Modified** -- Call `order-notification` when admin activates an order |

## Technical Notes
- Uses existing `RESEND_API_KEY` secret (already configured)
- Sender address: `AI DEALS <noreply@resend.dev>` (same as auth emails; can be updated to custom domain later)
- No new database tables needed
- No new secrets needed
