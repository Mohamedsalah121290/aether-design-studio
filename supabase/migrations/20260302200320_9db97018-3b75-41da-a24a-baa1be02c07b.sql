ALTER TABLE public.tools ADD COLUMN status text NOT NULL DEFAULT 'active';

-- Update RLS: allow public to see coming_soon tools too
DROP POLICY IF EXISTS "Anyone can view active tools" ON public.tools;
CREATE POLICY "Anyone can view active tools"
ON public.tools
FOR SELECT
USING (is_active = true OR status = 'coming_soon');