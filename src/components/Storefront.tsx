import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Sparkles, Search, X, Loader2, PenTool, Palette, Film, Mic,
  Code, Zap, Briefcase, ShieldCheck, Monitor, Users,
} from 'lucide-react';
import { ToolCard, Tool, CardTier } from './ToolCard';
import TrustStrip from './TrustStrip';
import FeaturedCarousel from './FeaturedCarousel';
import FiltersBar, { FilterChip, SortOption } from './FiltersBar';
import TrustAndFAQ from './TrustAndFAQ';
import { supabase } from '@/integrations/supabase/client';

/* ── Section config ─────────────────────────────────────────────── */
const SECTION_ORDER: {
  key: string;
  label: string;
  subtitle: string;
  icon: React.ElementType;
}[] = [
  { key: 'text',         label: 'Writing & SEO',       subtitle: 'AI-powered content creation & optimization',   icon: PenTool },
  { key: 'image',        label: 'Design & Images',     subtitle: 'Generate stunning visuals with AI',            icon: Palette },
  { key: 'video',        label: 'Video Creation',      subtitle: 'Professional AI video production tools',       icon: Film },
  { key: 'audio',        label: 'Voice & Audio',       subtitle: 'Text-to-speech & voice cloning',               icon: Mic },
  { key: 'coding',       label: 'Coding & Dev',        subtitle: 'AI coding assistants & developer tools',       icon: Code },
  { key: 'automation',   label: 'Automation & Bots',   subtitle: 'Streamline workflows with AI automation',      icon: Zap },
  { key: 'productivity', label: 'Productivity',        subtitle: 'Supercharge your daily output',                icon: Briefcase },
  { key: 'security',     label: 'Security & Privacy',  subtitle: 'AI-driven protection & compliance',            icon: ShieldCheck },
  { key: 'os-licenses',  label: 'OS & Licenses',       subtitle: 'Software licenses at premium rates',           icon: Monitor },
];

const FEATURED_TOOL_IDS = ['chatgpt', 'claude', 'gemini', 'midjourney', 'canva', 'perplexity'];
const POPULAR_TOOL_IDS  = ['jasper', 'leonardo', 'runway', 'elevenlabs', 'adobe', 'capcut', 'murf'];

/* Filter mapping (client-side) */
const FILTER_CATEGORY_MAP: Record<string, string[]> = {
  creators: ['image', 'video', 'audio'],
  marketers: ['text'],
  developers: ['coding', 'automation'],
  security: ['security'],
};

/* ── Component ──────────────────────────────────────────────────── */
const Storefront = () => {
  const { t } = useTranslation();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterChip>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');

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

  const getTier = (toolId: string): CardTier =>
    FEATURED_TOOL_IDS.includes(toolId) ? 'featured'
    : POPULAR_TOOL_IDS.includes(toolId) ? 'popular'
    : 'standard';

  /* Filtered + sorted tools */
  const processedTools = useMemo(() => {
    let result = tools.filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Chip filters
    if (activeFilter === 'trending') {
      result = result.filter(t => FEATURED_TOOL_IDS.includes(t.tool_id) || POPULAR_TOOL_IDS.includes(t.tool_id));
    } else if (activeFilter === 'new') {
      // "New" = last added tools (we just reverse for now since no created_at on client)
      result = [...result].reverse();
    } else if (activeFilter !== 'all' && FILTER_CATEGORY_MAP[activeFilter]) {
      result = result.filter(t => FILTER_CATEGORY_MAP[activeFilter].includes(t.category));
    }

    // Sort
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => (a.starting_price ?? Infinity) - (b.starting_price ?? Infinity));
    } else if (sortBy === 'newest') {
      result = [...result].reverse();
    }
    // 'popular' = default order (alphabetical + tiers)

    return result;
  }, [tools, searchQuery, activeFilter, sortBy]);

  /* Category sections */
  const sections = SECTION_ORDER.map(section => ({
    ...section,
    tools: processedTools.filter(t => t.category === section.key),
  })).filter(s => s.tools.length > 0);

  return (
    <>
      {/* ═══ TRUST STRIP ═══════════════════════════════════════════ */}
      <TrustStrip />

      <section id="store" className="relative overflow-hidden">
        {/* ═══ CINEMATIC HERO ════════════════════════════════════════ */}
        <div className="relative pt-28 pb-16 overflow-hidden">
          {/* Aurora gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 90% 70% at 50% 20%, hsl(var(--primary) / 0.14) 0%, transparent 60%),
                radial-gradient(ellipse 70% 50% at 80% 60%, hsl(var(--secondary) / 0.1) 0%, transparent 55%),
                radial-gradient(ellipse 60% 45% at 15% 70%, hsl(var(--accent) / 0.07) 0%, transparent 55%),
                radial-gradient(ellipse 50% 50% at 50% 50%, hsl(var(--primary) / 0.04) 0%, transparent 80%)
              `,
            }}
          />
          {/* Noise */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
            }}
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
                className="text-5xl sm:text-6xl md:text-7xl font-display font-black mb-3 tracking-tight leading-[1.05]"
                style={{ textShadow: '0 0 80px hsl(var(--primary) / 0.25)' }}
              >
                {t('store.title')}
              </h2>
              <h2
                className="text-5xl sm:text-6xl md:text-7xl font-display font-black mb-6 tracking-tight leading-[1.05] gradient-text"
              >
                {t('store.titleHighlight')}
              </h2>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                {t('store.description')}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <a
                  href="#tools-grid"
                  className="px-8 py-3.5 rounded-2xl font-semibold text-sm text-white transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
                    boxShadow: '0 8px 30px hsl(var(--primary) / 0.35)',
                  }}
                >
                  Browse Tools
                </a>
                <a
                  href="#trust-faq"
                  className="px-8 py-3.5 rounded-2xl font-semibold text-sm glass text-foreground hover:bg-muted/50 transition-all duration-300"
                >
                  How It Works
                </a>
              </div>

              {/* Social proof */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
              >
                <Users className="w-4 h-4 text-primary" />
                <span>1,000+ active members</span>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ═══ MAIN CONTENT ══════════════════════════════════════════ */}
        <div className="relative pb-8">
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
                {/* ── FEATURED CAROUSEL ──────────────────────────── */}
                <FeaturedCarousel tools={tools} />

                {/* ── SEARCH & FILTERS ───────────────────────────── */}
                <div id="tools-grid">
                  <FiltersBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                  />
                </div>

                {/* ── CATEGORY SECTIONS ──────────────────────────── */}
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <motion.div
                      key={section.key}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.5 }}
                      className="mb-24 relative"
                    >
                      {/* Faint radial background highlight */}
                      <div
                        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full blur-3xl pointer-events-none opacity-[0.04]"
                        style={{ background: 'hsl(var(--primary))' }}
                      />

                      {/* Section header */}
                      <div className="flex items-center gap-3 mb-2 relative z-10">
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

                      <p className="text-sm text-muted-foreground mb-4 ml-[52px] relative z-10">
                        {section.subtitle}
                      </p>

                      {/* Divider glow */}
                      <div
                        className="h-px mb-8 rounded-full relative z-10"
                        style={{
                          background: 'linear-gradient(90deg, hsl(var(--primary) / 0.25) 0%, hsl(var(--border)) 50%, transparent 100%)',
                          boxShadow: '0 0 8px hsl(var(--primary) / 0.1)',
                        }}
                      />

                      {/* Tools Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
                        {section.tools.map((tool, index) => (
                          <ToolCard key={tool.id} tool={tool} index={index} tier={getTier(tool.tool_id)} />
                        ))}
                      </div>
                    </motion.div>
                  );
                })}

                {/* ── EMPTY STATE ────────────────────────────────── */}
                {sections.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
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

      {/* ═══ TRUST & FAQ ══════════════════════════════════════════ */}
      <div id="trust-faq">
        <TrustAndFAQ />
      </div>
    </>
  );
};

export default Storefront;
