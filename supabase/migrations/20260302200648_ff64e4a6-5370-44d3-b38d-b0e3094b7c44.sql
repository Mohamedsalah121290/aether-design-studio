-- 1) CHECK constraint on tools.status
ALTER TABLE public.tools ADD CONSTRAINT tools_status_check CHECK (status IN ('active', 'coming_soon', 'paused'));

-- 2) Waitlist table for tool-specific notifications (GDPR-friendly)
CREATE TABLE public.waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  tool_id text NOT NULL,
  source text NOT NULL DEFAULT 'store',
  consent boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Unique constraint: one email per tool
ALTER TABLE public.waitlist ADD CONSTRAINT waitlist_email_tool_unique UNIQUE (email, tool_id);

-- RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Anyone can sign up for waitlist
CREATE POLICY "Anyone can join waitlist"
ON public.waitlist
FOR INSERT
WITH CHECK (true);

-- Admins can view waitlist
CREATE POLICY "Admins can view waitlist"
ON public.waitlist
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete waitlist entries
CREATE POLICY "Admins can delete waitlist"
ON public.waitlist
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));