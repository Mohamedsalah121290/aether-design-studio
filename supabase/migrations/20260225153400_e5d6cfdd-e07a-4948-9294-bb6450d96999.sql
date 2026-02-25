
-- Create tool_plans table
CREATE TABLE public.tool_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id text NOT NULL,
  plan_id text NOT NULL,
  plan_name text NOT NULL,
  monthly_price numeric,
  delivery_type text NOT NULL DEFAULT 'provide_account',
  activation_time integer NOT NULL DEFAULT 6,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(tool_id, plan_id)
);

-- Enable RLS
ALTER TABLE public.tool_plans ENABLE ROW LEVEL SECURITY;

-- Anyone can view active plans (public storefront)
CREATE POLICY "Anyone can view active plans"
  ON public.tool_plans
  FOR SELECT
  USING (is_active = true);

-- Admins can manage plans
CREATE POLICY "Admins can manage plans"
  ON public.tool_plans
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));
