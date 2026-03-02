
-- Fix order_credentials SELECT policies: change from restrictive to permissive
-- Currently ALL are restrictive which means a customer must pass EVERY policy (including admin check) to read - this is broken

-- Drop the broken restrictive SELECT policies
DROP POLICY IF EXISTS "Customers can view own order credentials" ON public.order_credentials;
DROP POLICY IF EXISTS "Only admins can view credentials" ON public.order_credentials;

-- Recreate as PERMISSIVE (default) so either condition grants access
CREATE POLICY "Customers can view own order credentials"
ON public.order_credentials
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_credentials.order_id
    AND orders.status = 'delivered'
    AND (
      orders.user_id = auth.uid()
      OR orders.buyer_email = (current_setting('request.jwt.claims', true)::json ->> 'email')
    )
  )
);

CREATE POLICY "Admins can view all credentials"
ON public.order_credentials
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
