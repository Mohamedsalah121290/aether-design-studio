DROP POLICY IF EXISTS "Public can create orders" ON public.orders;

DROP POLICY IF EXISTS "Authenticated users can create orders" ON public.orders;
CREATE POLICY "Authenticated users can create own orders"
ON public.orders FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND (
    buyer_email IS NULL
    OR (
      buyer_email = (auth.jwt() ->> 'email')
      AND ((auth.jwt() ->> 'email_verified'))::boolean = true
    )
  )
);

DROP POLICY IF EXISTS "Customers can view own order credentials" ON public.order_credentials;
CREATE POLICY "Customers can view own order credentials"
ON public.order_credentials FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_credentials.order_id
      AND o.status = 'delivered'
      AND (
        o.user_id = auth.uid()
        OR (
          o.buyer_email = (auth.jwt() ->> 'email')
          AND ((auth.jwt() ->> 'email_verified'))::boolean = true
        )
      )
  )
);