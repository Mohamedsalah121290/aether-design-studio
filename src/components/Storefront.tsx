import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sparkles, Search, X, Loader2, Crown, PenTool, Palette, Film, Mic, Code, Zap, Briefcase, ShieldCheck, Monitor } from 'lucide-react';
import { ToolCard, Tool } from './ToolCard';
import { supabase } from '@/integrations/supabase/client';

const SECTION_ORDER = [
  { key: 'featured', label: 'Featured AI', icon: Crown, featured: true },
  { key: 'text', label: 'Writing & SEO', icon: PenTool },
  { key: 'image', label: 'Design & Image', icon: Palette },
  { key: 'video', label: 'Video Creation', icon: Film },
  { key: 'audio', label: 'Voice & Audio', icon: Mic },
  { key: 'coding', label: 'Coding & Dev', icon: Code },
  { key: 'automation', label: 'Automation', icon: Zap },
  { key: 'productivity', label: 'Productivity', icon: Briefcase },
  { key: 'security', label: 'Security', icon: ShieldCheck },
  { key: 'os-licenses', label: 'OS & Licenses', icon: Monitor },
] as const;

// Tools that appear in the featured section (by tool_id)
const FEATURED_TOOL_IDS = ['chatgpt', 'claude', 'gemini', 'midjourney'];

const Storefront = () => {
  const { t } = useTranslation();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const { data: toolsData, error: toolsError } = await supabase
        .from('tools')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (toolsError) throw toolsError;

      const { data: plansData, error: plansError } = await supabase
        .from('tool_plans')
        .select('tool_id, monthly_price')
        .eq('is_active', true);

      if (plansError) throw plansError;

      const minPriceMap: Record<string, number> = {};
      (plansData || []).forEach(p => {
        const price = p.monthly_price ? Number(p.monthly_price) : null;
        if (price != null && price > 0) {
          if (!(p.tool_id in minPriceMap) || price < minPriceMap[p.tool_id]) {
            minPriceMap[p.tool_id] = price;
          }
        }
      });

      const mappedTools: Tool[] = (toolsData || []).map(tool => ({
        id: tool.id,
        tool_id: tool.tool_id,
        name: tool.name,
        category: tool.category,
        logo_url: tool.logo_url || null,
        starting_price: minPriceMap[tool.tool_id] ?? null,
      }));

      setTools(mappedTools);
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Build sections
  const sections = SECTION_ORDER.map(section => {
    let sectionTools: Tool[];
    if (section.key === 'featured') {
      sectionTools = filtered.filter(t => FEATURED_TOOL_IDS.includes(t.tool_id));
    } else {
      sectionTools = filtered.filter(t => t.category === section.key);
    }
    return { ...section, tools: sectionTools };
  }).filter(s => s.tools.length > 0);

  return (
    <section id="store" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            {t('store.badge')}
          </motion.span>

          <h2 className="text-4xl md:text-6xl font-display font-black mb-4 tracking-tight">
            {t('store.title')}{' '}
            <span className="gradient-text">{t('store.titleHighlight')}</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('store.description')}
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto mb-16"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('store.searchPlaceholder')}
              className="w-full pl-12 pr-10 py-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Category Sections */}
            {sections.map((section, sectionIdx) => {
              const Icon = section.icon;
              const isFeatured = 'featured' in section && section.featured;

              return (
                <motion.div
                  key={section.key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: sectionIdx * 0.05 }}
                  className={`mb-20 ${isFeatured ? 'mb-24' : ''}`}
                >
                  {/* Section Title */}
                  <div className="flex items-center gap-3 mb-8">
                    <div
                      className={`flex items-center justify-center rounded-xl ${
                        isFeatured ? 'w-12 h-12' : 'w-10 h-10'
                      }`}
                      style={{
                        background: isFeatured
                          ? 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)'
                          : 'hsl(var(--primary) / 0.1)',
                        boxShadow: isFeatured
                          ? '0 0 30px hsl(var(--primary) / 0.4), 0 0 60px hsl(var(--primary) / 0.15)'
                          : '0 0 20px hsl(var(--primary) / 0.1)',
                      }}
                    >
                      <Icon className={`text-primary-foreground ${isFeatured ? 'w-6 h-6' : 'w-5 h-5'}`}
                        style={{ color: isFeatured ? 'white' : 'hsl(var(--primary))' }}
                      />
                    </div>
                    <h3
                      className={`font-display font-black tracking-tight ${
                        isFeatured ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'
                      }`}
                      style={{
                        textShadow: isFeatured
                          ? '0 0 40px hsl(var(--primary) / 0.3)'
                          : '0 0 20px hsl(var(--primary) / 0.15)',
                      }}
                    >
                      {section.label}
                    </h3>
                    <span className="ml-2 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      {section.tools.length}
                    </span>
                  </div>

                  {/* Tools Grid */}
                  <div
                    className={`grid gap-6 ${
                      isFeatured
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    }`}
                  >
                    {section.tools.map((tool, index) => (
                      <div
                        key={tool.id}
                        className={isFeatured ? 'sm:[&>div]:scale-[1.02]' : ''}
                      >
                        <ToolCard tool={tool} index={index} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}

            {/* Empty State */}
            {sections.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-display font-bold mb-2">{t('store.noResults')}</h3>
                <p className="text-muted-foreground">{t('store.tryAgain')}</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Storefront;
