-- Email format validation
ALTER TABLE public.orders 
ADD CONSTRAINT valid_buyer_email 
CHECK (buyer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Email length validation
ALTER TABLE public.orders
ADD CONSTRAINT buyer_email_length
CHECK (length(buyer_email) <= 255);

-- JSONB size limit for customer_data
ALTER TABLE public.orders
ADD CONSTRAINT customer_data_size
CHECK (pg_column_size(customer_data) < 10000);
