
ALTER TABLE tools DROP CONSTRAINT IF EXISTS tools_category_check;
ALTER TABLE tools ADD CONSTRAINT tools_category_check CHECK (category IN ('text', 'image', 'video', 'audio', 'coding', 'automation', 'productivity', 'security', 'os-licenses', 'design', 'stock-media', 'ai-text', 'ai-media', 'education', 'communication'));
