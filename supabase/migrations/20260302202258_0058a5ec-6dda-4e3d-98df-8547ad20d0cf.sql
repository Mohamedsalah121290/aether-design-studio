
-- 1) Add tool_id to courses for tool-course relation
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS tool_id text;

-- 2) Add is_preview to lessons
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS is_preview boolean NOT NULL DEFAULT false;

-- 3) Create academy_subscriptions table
CREATE TABLE IF NOT EXISTS public.academy_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active',
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.academy_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view own academy subscriptions
CREATE POLICY "Users can view own academy subscriptions"
ON public.academy_subscriptions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert own subscriptions
CREATE POLICY "Users can insert own academy subscriptions"
ON public.academy_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admins can manage all academy subscriptions
CREATE POLICY "Admins can manage academy subscriptions"
ON public.academy_subscriptions
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add notes column to order_credentials if not exists
ALTER TABLE public.order_credentials ADD COLUMN IF NOT EXISTS notes text;

-- Add delivered_at to orders if not exists (alias for activated_at)
-- activated_at already exists, so we'll use that
