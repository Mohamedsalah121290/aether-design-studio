
-- Fix 1: Replace subscriptions ALL policy with SELECT-only for users
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscriptions;

-- Fix 2: Add admin policies for user_roles management
CREATE POLICY "Admins can assign roles"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can modify roles"
  ON public.user_roles
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can remove roles"
  ON public.user_roles
  FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix 3: Replace email-based orders policy with verified email check, scoped to authenticated
DROP POLICY IF EXISTS "Users can view orders matching their email" ON public.orders;

CREATE POLICY "Users can view orders matching verified email"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (
    buyer_email = (auth.jwt()->>'email')
    AND (auth.jwt()->>'email_verified')::boolean = true
  );
