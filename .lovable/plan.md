# Simplify Checkout: Remove Password Field

## What's Changing

You mentioned that **you** (the admin) will provide the customer with email and password credentials -- the customer only needs to give their email so you can send them the activation details. This means we no longer need to collect a password from the customer during checkout.

## Changes

### 1. Remove Password Field from Checkout Form

- Remove the password input field from `CheckoutDialog.tsx`
- Remove password-related validation logic and error state
- The `subscribe_for_them` delivery type will now behave like `email_only` -- only asking for the customer's email

### 2. Update Checkout Edge Function

- Remove `customerPassword` parameter handling from `create-checkout/index.ts`
- Remove the credential encryption and storage logic during checkout (the admin will handle credentials manually)

### 3. Clean Up Validation

- Remove `passwordSchema` from `CheckoutDialog.tsx`
- Remove password from `checkoutSchema` in `src/lib/validations.ts`

### 4. Clean Up Store Credentials Function

- Keep `store-credentials` edge function available for admin use if needed, but it will no longer be called during checkout

---

## Technical Details

**Files to modify:**

- `src/components/CheckoutDialog.tsx` -- Remove password state, password input field, password validation, and stop sending `customerPassword` to the edge function
- `supabase/functions/create-checkout/index.ts` -- Remove `customerPassword` from request body parsing and remove the credential encryption/storage block
- `src/lib/validations.ts` -- Remove `passwordSchema` export (optional cleanup)

**No database changes needed** -- the `order_credentials` table stays for admin manual use.

Yes this plan is correct. Please add these final requirements:

1) UI/Copy

- Rename the email input label to “Activation Email”

- Helper text: “We’ll send activation + login details to this email.”

- Add trust note: “Secure — we never ask for your passwords.”

- Add badge: “Account Provided” + “Activation within 4 hours”

2) Data

- Ensure create-checkout still stores customerEmail in the order as customer_email (or activation_email)

- Confirm order creation works end-to-end and returns order_id

3) Messaging

- Keep delivery type name internally, but display it to customers as:

  “We Provide The Account For You” (not “email_only” wording)

Deliver: updated CheckoutDialog, create-checkout function, validations, and a success screen message.