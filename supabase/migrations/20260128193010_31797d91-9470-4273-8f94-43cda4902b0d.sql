-- STEP 1: Drop the dangerous "Public can view orders by email" policy
DROP POLICY IF EXISTS "Public can view orders by email" ON public.orders;

-- STEP 2: Create a secure order_credentials table for encrypted passwords
CREATE TABLE IF NOT EXISTS public.order_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  encrypted_password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on order_credentials
ALTER TABLE public.order_credentials ENABLE ROW LEVEL SECURITY;

-- Only admins can access credentials (strict access control)
CREATE POLICY "Only admins can view credentials"
  ON public.order_credentials
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert credentials"
  ON public.order_credentials
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update credentials"
  ON public.order_credentials
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete credentials"
  ON public.order_credentials
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- STEP 3: Clear any existing plaintext passwords from orders table
UPDATE public.orders 
SET customer_data = customer_data - 'password'
WHERE customer_data ? 'password';

-- STEP 4: Create a better policy for orders - users can view by matching their email
CREATE POLICY "Users can view orders matching their email"
  ON public.orders
  FOR SELECT
  USING (buyer_email = current_setting('request.jwt.claims', true)::json->>'email');