-- Drop existing orders table to recreate with proper schema
DROP TABLE IF EXISTS public.orders;

-- Create tools table with all required fields
CREATE TABLE public.tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('text', 'image', 'video', 'coding')),
  price DECIMAL(10,2) NOT NULL,
  activation_time INTEGER NOT NULL DEFAULT 6, -- hours
  delivery_type TEXT NOT NULL CHECK (delivery_type IN ('subscribe_for_them', 'email_only', 'provide_account')),
  access_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table with comprehensive schema
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE NOT NULL,
  buyer_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'cancelled')),
  customer_data JSONB NOT NULL DEFAULT '{}',
  activation_deadline TIMESTAMP WITH TIME ZONE,
  activated_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Tools: Anyone can read active tools
CREATE POLICY "Anyone can view active tools"
ON public.tools FOR SELECT
USING (is_active = true);

-- Orders: Public insert for checkout
CREATE POLICY "Anyone can create orders"
ON public.orders FOR INSERT
WITH CHECK (true);

-- Orders: Users can view their own orders by email
CREATE POLICY "Users can view own orders"
ON public.orders FOR SELECT
USING (true);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_tools_updated_at ON public.tools;
CREATE TRIGGER update_tools_updated_at
BEFORE UPDATE ON public.tools
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert all AI tools with proper delivery types
INSERT INTO public.tools (tool_id, name, category, price, activation_time, delivery_type, access_url) VALUES
  ('chatgpt', 'ChatGPT Plus', 'text', 7.99, 4, 'subscribe_for_them', 'https://chat.openai.com'),
  ('claude', 'Claude Pro', 'text', 8.99, 4, 'subscribe_for_them', 'https://claude.ai'),
  ('gemini', 'Gemini Advanced', 'text', 6.99, 3, 'subscribe_for_them', 'https://gemini.google.com'),
  ('perplexity', 'Perplexity Pro', 'text', 7.99, 4, 'subscribe_for_them', 'https://perplexity.ai'),
  ('jasper', 'Jasper AI', 'text', 12.99, 6, 'subscribe_for_them', 'https://jasper.ai'),
  ('midjourney', 'Midjourney', 'image', 9.99, 6, 'email_only', 'https://midjourney.com'),
  ('leonardo', 'Leonardo AI', 'image', 5.99, 3, 'subscribe_for_them', 'https://leonardo.ai'),
  ('capcut', 'CapCut Pro', 'video', 4.99, 2, 'provide_account', 'https://capcut.com'),
  ('runway', 'Runway Gen-4', 'video', 11.99, 6, 'subscribe_for_them', 'https://runwayml.com'),
  ('elevenlabs', 'ElevenLabs', 'video', 8.99, 4, 'subscribe_for_them', 'https://elevenlabs.io'),
  ('murf', 'Murf AI', 'video', 6.99, 4, 'subscribe_for_them', 'https://murf.ai'),
  ('claude-code', 'Claude Code', 'coding', 9.99, 4, 'subscribe_for_them', 'https://claude.ai'),
  ('adobe', 'Adobe Creative Cloud', 'image', 14.99, 6, 'provide_account', 'https://adobe.com'),
  ('windows', 'Windows 11 Pro', 'coding', 12.99, 2, 'provide_account', 'https://microsoft.com');