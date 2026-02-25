import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Sparkles, Search, X, Loader2, Crown, PenTool, Palette, Film, Mic,
  Code, Zap, Briefcase, ShieldCheck, Monitor, Package, Bolt, Lock,
} from 'lucide-react';
import { ToolCard, Tool, CardTier } from './ToolCard';
import { supabase } from '@/integrations/supabase/client';

/* ── Section config ─────────────────────────────────────────────── */
const SECTION_ORDER: {
  key: string;
  label: string;
  subtitle: string;
  icon: React.ElementType;
}[] = [
  { key: 'text',         label: 'Writing & SEO',   subtitle: 'AI-powered content creation & optimization', icon: PenTool },
  { key: 'image',        label: 'Design & Image',  subtitle: 'Generate stunning visuals with AI',          icon: Palette },
  { key: 'video',        label: 'Video Creation',   subtitle: 'Professional AI video tools',                icon: Film },
  { key: 'audio',        label: 'Voice & Audio',    subtitle: 'Text-to-speech & voice cloning',             icon: Mic },
  { key: 'coding',       label: 'Coding & Dev',     subtitle: 'AI coding assistants & dev tools',           icon: Code },
  { key: 'automation',   label: 'Automation',       subtitle: 'Streamline workflows with AI',               icon: Zap },
  { key: 'productivity', label: 'Productivity',     subtitle: 'Supercharge your daily output',              icon: Briefcase },
  { key: 'security',     label: 'Security',         subtitle: 'AI-driven protection & compliance',          icon: ShieldCheck },
  { key: 'os-licenses',  label: 'OS & Licenses',    subtitle: 'Software licenses at premium rates',         icon: Monitor },
];

const FEATURED_TOOL_IDS = ['chatgpt', 'claude', 'gemini', 'midjourney', 'perplexity'];
const POPULAR_TOOL_IDS  = ['jasper', 'leonardo', 'runway', 'elevenlabs', 'adobe', 'capcut', 'murf'];

/* ── Component ──────────────────────────────────────────────────── */
const Storefront = () => {
  const { t } = useTranslation();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchTools(); }, []);

  const fetchTools = async () => {
    try {
      const { data: toolsData, error: toolsError } = await supabase
        .from('tools').select('*').eq('is_active', true).order('name');
      if (toolsError) throw toolsError;

      const { data: plansData, error: plansError } = await supabase
        .from('tool_plans').select('tool_id, monthly_price').eq('is_active', true);
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

      setTools((toolsData || []).map(tool => ({
        id: tool.id,
        tool_id: tool.tool_id,
        name: tool.name,
        category: tool.category,
        logo_url: tool.logo_url || null,
        starting_price: minPriceMap[tool.tool_id] ?? null,
      })));
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = tools.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTier = (toolId: string): CardTier =>
    FEATURED_TOOL_IDS.includes(toolId) ? 'featured'
    : POPULAR_TOOL_IDS.includes(toolId) ? 'popular'
    : 'standard';

  /* Featured tools split into top row (2 large) + second row (3 medium) */
  const featuredTools = filtered.filter(t => FEATURED_TOOL_IDS.includes(t.tool_id));
  const topFeatured   = featuredTools.slice(0, 2);
  const bottomFeatured = featuredTools.slice(2, 5);

  /* Category sections */
  const sections = SECTION_ORDER.map(section => ({
    ...section,
    tools: filtered.filter(t => t.category === section.key),
  })).filter(s => s.tools.length > 0);

  const heroBadges = [
    { icon: Package, label: `${tools.length}+ Tools` },
    { icon: Bolt,    label: 'Instant Delivery' },
    { icon: Lock,    label: 'Secure Checkout' },
  ];

  return (
    <section id="store" className="relative overflow-hidden">
      {/* ═══ MARKETPLACE HERO ═══════════════════════════════════════ */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        {/* Radial glow background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 30%, hsl(var(--primary) / 0.12) 0%, transparent 70%),
              radial-gradient(ellipse 60% 50% at 80% 60%, hsl(var(--secondary) / 0.08) 0%, transparent 60%),
              radial-gradient(ellipse 50% 40% at 20% 70%, hsl(var(--accent) / 0.06) 0%, transparent 60%)
            `,
          }}
        />
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-8"
            >
              <Sparkles className="w-4 h-4" />
              {t('store.badge')}
            </motion.span>

            <h2
              className="text-5xl sm:text-6xl md:text-7xl font-display font-black mb-6 tracking-tight leading-[1.05]"
              style={{ textShadow: '0 0 80px hsl(var(--primary) / 0.2)' }}
            >
              {t('store.title')}{' '}
              <span className="gradient-text">{t('store.titleHighlight')}</span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('store.description')}
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {heroBadges.map(({ icon: BadgeIcon, label }) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass flex items-center gap-2.5 px-5 py-3 rounded-2xl"
                >
                  <BadgeIcon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </motion.div>
              ))}
            </div>

            {/* Search Bar */}
            <div className="max-w-lg mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
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
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══ MAIN CONTENT ══════════════════════════════════════════ */}
      <div className="relative pb-24">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* ── FEATURED SECTION ─────────────────────────────── */}
              {featuredTools.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6 }}
                  className="mb-28"
                >
                  {/* Section header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-14 h-14 flex items-center justify-center rounded-2xl"
                      style={{
                        background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
                        boxShadow: '0 0 40px hsl(var(--primary) / 0.4), 0 0 80px hsl(var(--primary) / 0.15)',
                      }}
                    >
                      <Crown className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3
                        className="text-3xl md:text-4xl font-display font-black tracking-tight"
                        style={{ textShadow: '0 0 50px hsl(var(--primary) / 0.3)' }}
                      >
                        Featured AI
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">The most powerful AI tools, handpicked for you</p>
                    </div>
                  </div>

                  {/* Divider glow */}
                  <div className="h-px mb-10 rounded-full" style={{
                    background: 'linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.4) 30%, hsl(var(--secondary) / 0.4) 70%, transparent 100%)',
                    boxShadow: '0 0 12px hsl(var(--primary) / 0.3)',
                  }} />

                  {/* Top row — 2 large featured cards */}
                  {topFeatured.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      {topFeatured.map((tool, i) => (
                        <motion.div
                          key={tool.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="[&>div]:!perspective-1000"
                        >
                          <ToolCard tool={tool} index={i} tier="featured" />
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Bottom row — 3 medium cards */}
                  {bottomFeatured.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {bottomFeatured.map((tool, i) => (
                        <motion.div
                          key={tool.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: (i + 2) * 0.08 }}
                        >
                          <ToolCard tool={tool} index={i + 2} tier="featured" />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── CATEGORY SECTIONS ────────────────────────────── */}
              {sections.map((section, sectionIdx) => {
                const Icon = section.icon;
                return (
                  <motion.div
                    key={section.key}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5 }}
                    className="mb-24"
                  >
                    {/* Section header */}
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 flex items-center justify-center rounded-xl"
                        style={{
                          background: 'hsl(var(--primary) / 0.1)',
                          boxShadow: '0 0 20px hsl(var(--primary) / 0.08)',
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
                      </div>
                      <div>
                        <h3
                          className="text-2xl md:text-3xl font-display font-black tracking-tight"
                          style={{ textShadow: '0 0 30px hsl(var(--primary) / 0.15)' }}
                        >
                          {section.label}
                        </h3>
                      </div>
                      <span className="ml-auto px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        {section.tools.length}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 ml-[52px]">{section.subtitle}</p>

                    {/* Divider glow */}
                    <div className="h-px mb-8 rounded-full" style={{
                      background: 'linear-gradient(90deg, hsl(var(--primary) / 0.2) 0%, hsl(var(--border)) 50%, transparent 100%)',
                      boxShadow: '0 0 8px hsl(var(--primary) / 0.1)',
                    }} />

                    {/* Tools Grid — 4 columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {section.tools.map((tool, index) => (
                        <ToolCard key={tool.id} tool={tool} index={index} tier={getTier(tool.tool_id)} />
                      ))}
                    </div>
                  </motion.div>
                );
              })}

              {/* ── EMPTY STATE ───────────────────────────────────── */}
              {sections.length === 0 && featuredTools.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-display font-bold mb-2">{t('store.noResults')}</h3>
                  <p className="text-muted-foreground">{t('store.tryAgain')}</p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Storefront;
