
-- Allow admins to manage tools
CREATE POLICY "Admins can insert tools"
ON public.tools
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tools"
ON public.tools
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tools"
ON public.tools
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to see ALL tools (including inactive)
CREATE POLICY "Admins can view all tools"
ON public.tools
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
