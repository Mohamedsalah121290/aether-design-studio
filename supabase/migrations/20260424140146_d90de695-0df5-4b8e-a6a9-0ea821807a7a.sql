
-- 1) تعطيل كل المنتجات أولاً، ثم تفعيل المطلوبة فقط
UPDATE public.tools SET status = 'paused' WHERE status = 'active';

-- 2) تفعيل المنتجات المطلوبة + ضبط السعر المرجعي (للترتيب) والـ category
UPDATE public.tools SET status='active', price=10,  category='os-licenses'   WHERE tool_id='windows';
UPDATE public.tools SET status='active', price=45,  category='os-licenses'   WHERE tool_id='windows_server';
UPDATE public.tools SET status='active', price=10,  category='productivity'  WHERE tool_id='microsoft_365';
UPDATE public.tools SET status='active', price=10,  category='productivity'  WHERE tool_id='microsoft_office';
UPDATE public.tools SET status='active', price=80,  category='productivity'  WHERE tool_id='notion';
UPDATE public.tools SET status='active', price=5,   category='design'        WHERE tool_id='canva';
UPDATE public.tools SET status='active', price=10,  category='design'        WHERE tool_id='capcut';
UPDATE public.tools SET status='active', price=15,  category='ai-text'       WHERE tool_id='chatgpt';
UPDATE public.tools SET status='active', price=15,  category='ai-text'       WHERE tool_id='lovable';
UPDATE public.tools SET status='active', price=135, category='ai-text'       WHERE tool_id='perplexity';
UPDATE public.tools SET status='active', price=20,  category='ai-text'       WHERE tool_id='grok';
UPDATE public.tools SET status='active', price=45,  category='ai-text'       WHERE tool_id='elevenlabs';
UPDATE public.tools SET status='active', price=8.5, category='communication' WHERE tool_id='zoom';
UPDATE public.tools SET status='active', price=30,  category='security'      WHERE tool_id='eset';
UPDATE public.tools SET status='active', price=30,  category='education'     WHERE tool_id='linkedin';
UPDATE public.tools SET status='active', price=150, category='education'     WHERE tool_id='coursera';

-- 3) تعطيل كل الـ plans غير المعنية (سنبقي فقط plan واحد لكل أداة بالسعر المطلوب)
UPDATE public.tool_plans SET is_active = false;

-- 4) تفعيل/تحديث plans محددة بالأسعار الجديدة باليورو
-- Windows 10/11 Retail Online → 10€
UPDATE public.tool_plans SET is_active=true, monthly_price=10  WHERE tool_id='windows'         AND plan_id='retail_online';
-- Windows Server → 45€
UPDATE public.tool_plans SET is_active=true, monthly_price=45  WHERE tool_id='windows_server'  AND plan_id='server_key';
-- Microsoft Office 365 — 1 Year → 10€
UPDATE public.tool_plans SET is_active=true, monthly_price=10  WHERE tool_id='microsoft_365'   AND plan_id='365_1year';
-- Microsoft Office 365 — Lifetime → 100€
UPDATE public.tool_plans SET is_active=true, monthly_price=100 WHERE tool_id='microsoft_365'   AND plan_id='365_lifetime';
-- Office Pro Plus → 10€
UPDATE public.tool_plans SET is_active=true, monthly_price=10  WHERE tool_id='microsoft_office' AND plan_id='pro_plus_key';
-- Notion Education Plus → 80€
UPDATE public.tool_plans SET is_active=true, monthly_price=80  WHERE tool_id='notion'          AND plan_id='edu_plus_1y';
-- Canva Pro → 5€
UPDATE public.tool_plans SET is_active=true, monthly_price=5   WHERE tool_id='canva'           AND plan_id='team_admin';
-- CapCut Pro Personal → 10€
UPDATE public.tool_plans SET is_active=true, monthly_price=10  WHERE tool_id='capcut'          AND plan_id='personal_1m';
-- ChatGPT Business → 65€
UPDATE public.tool_plans SET is_active=true, monthly_price=65  WHERE tool_id='chatgpt'         AND plan_id='business';
-- ChatGPT Ready Account → 15€
UPDATE public.tool_plans SET is_active=true, monthly_price=15  WHERE tool_id='chatgpt'         AND plan_id='ready_account';
-- Lovable AI Pro → 15€
UPDATE public.tool_plans SET is_active=true, monthly_price=15  WHERE tool_id='lovable'         AND plan_id='pro_monthly';
-- Perplexity Pro → 135€
UPDATE public.tool_plans SET is_active=true, monthly_price=135 WHERE tool_id='perplexity'      AND plan_id='pro_1y';
-- Grok SuperGrok → 20€
UPDATE public.tool_plans SET is_active=true, monthly_price=20  WHERE tool_id='grok'            AND plan_id='supergrok_1m';
-- Zoom Pro → 8.5€
UPDATE public.tool_plans SET is_active=true, monthly_price=8.5 WHERE tool_id='zoom'            AND plan_id='pro_28d';
-- ESET Internet Security → 30€
UPDATE public.tool_plans SET is_active=true, monthly_price=30  WHERE tool_id='eset'            AND plan_id='key_1y';
-- LinkedIn Premium Career → 30€
UPDATE public.tool_plans SET is_active=true, monthly_price=30  WHERE tool_id='linkedin'        AND plan_id='career_3m';
-- Coursera Plus → 150€
UPDATE public.tool_plans SET is_active=true, monthly_price=150 WHERE tool_id='coursera'        AND plan_id='plus_upgrade';

-- 5) ElevenLabs: قد لا يحتوي على plan؛ ننشئ plan إذا لم يوجد
INSERT INTO public.tool_plans (tool_id, plan_id, plan_name, monthly_price, delivery_type, activation_time, is_active)
VALUES ('elevenlabs', 'creator_1m', 'Creator — 1 Month', 45, 'provide_account', 6, true)
ON CONFLICT (tool_id, plan_id) DO UPDATE SET monthly_price = EXCLUDED.monthly_price, is_active = true;
