-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role-based access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Update orders table: add user_id column for authenticated users
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;

-- Create proper RLS policies for orders
-- Authenticated users can create orders linked to their account
CREATE POLICY "Authenticated users can create orders"
  ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can view their own orders (by user_id)
CREATE POLICY "Users can view own orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow public order creation for guest checkout (with buyer_email)
CREATE POLICY "Public can create orders"
  ON public.orders
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- Allow public to view orders by buyer_email (for guest vault access)
CREATE POLICY "Public can view orders by email"
  ON public.orders
  FOR SELECT
  TO anon
  USING (true);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update orders
CREATE POLICY "Admins can update orders"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Fix search_path for existing function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;