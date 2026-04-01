
ALTER TABLE public.tools DROP CONSTRAINT tools_category_check;
ALTER TABLE public.tools ADD CONSTRAINT tools_category_check CHECK (category = ANY (ARRAY['text','image','video','coding','audio','automation','productivity','security','os-licenses']));

ALTER TABLE public.tools DROP CONSTRAINT tools_delivery_type_check;
ALTER TABLE public.tools ADD CONSTRAINT tools_delivery_type_check CHECK (delivery_type = ANY (ARRAY['subscribe_for_them','email_only','provide_account','provide_key']));
