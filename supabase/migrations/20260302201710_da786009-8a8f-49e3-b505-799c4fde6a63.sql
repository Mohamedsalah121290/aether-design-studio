
-- Allow customers to view credentials for their own orders
CREATE POLICY "Customers can view own order credentials"
ON public.order_credentials
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_credentials.order_id
    AND (
      orders.user_id = auth.uid()
      OR orders.buyer_email = (current_setting('request.jwt.claims', true)::json ->> 'email')
    )
  )
);
