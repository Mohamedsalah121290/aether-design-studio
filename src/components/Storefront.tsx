import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sparkles, Search, Loader2, PenTool, Palette, Film, Mic,
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

  const processedTools = useMemo(() => {
    let result = tools.filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (activeFilter === 'trending') {
      result = result.filter(t => FEATURED_TOOL_IDS.includes(t.tool_id) || POPULAR_TOOL_IDS.includes(t.tool_id));
    } else if (activeFilter === 'new') {
      result = [...result].reverse();
    } else if (activeFilter !== 'all' && FILTER_CATEGORY_MAP[activeFilter]) {
      result = result.filter(t => FILTER_CATEGORY_MAP[activeFilter].includes(t.category));
    }

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => (a.starting_price ?? Infinity) - (b.starting_price ?? Infinity));
    } else if (sortBy === 'newest') {
      result = [...result].reverse();
    }

    return result;
  }, [tools, searchQuery, activeFilter, sortBy]);

  const sections = SECTION_ORDER.map(section => ({
    ...section,
    tools: processedTools.filter(t => t.category === section.key),
  })).filter(s => s.tools.length > 0);

  return (
    <>
      {/* ═══ TRUST STRIP ═══ */}
      <TrustStrip />

      <section id="store" className="relative overflow-hidden">
        {/* ═══ HERO ═══ */}
        <div className="relative py-16 lg:py-24 overflow-hidden">
          {/* Aurora gradient (low opacity) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 50% 20%, rgba(139,92,246,0.08) 0%, transparent 60%),
                radial-gradient(ellipse 60% 40% at 80% 60%, rgba(34,211,238,0.06) 0%, transparent 55%),
                radial-gradient(ellipse 50% 40% at 15% 70%, rgba(168,85,247,0.04) 0%, transparent 55%)
              `,
            }}
          />
          {/* Noise overlay */}
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
            }}
          />

          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-medium mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                {t('store.badge')}
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 tracking-tight leading-[1.1] text-white">
                {t('store.title')}
              </h2>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.1] bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                {t('store.titleHighlight')}
              </h2>

              <p className="text-base md:text-lg text-white/40 max-w-2xl mx-auto mb-8 leading-relaxed">
                {t('store.description')}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <a
                  href="#tools-grid"
                  className="px-8 py-3 rounded-xl font-medium text-sm text-white bg-white/10 border border-white/15 transition-all duration-300 hover:bg-white/15 hover:border-white/25"
                >
                  Browse Tools
                </a>
                <a
                  href="#trust-faq"
                  className="px-8 py-3 rounded-xl font-medium text-sm text-white/50 border border-white/5 transition-all duration-300 hover:text-white/70 hover:border-white/10"
                >
                  How It Works
                </a>
              </div>

              {/* Social proof */}
              <div className="flex items-center justify-center gap-2 text-xs text-white/30">
                <Users className="w-3.5 h-3.5" />
                <span>1,000+ active members</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ MAIN CONTENT ═══ */}
        <div className="relative pb-8">
          <div className="relative z-10">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-white/20" />
              </div>
            ) : (
              <>
                {/* Featured carousel */}
                <FeaturedCarousel tools={tools} />

                {/* Search + Filters */}
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

                {/* Category sections */}
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <section key={section.key} className="py-12">
                      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 relative">
                        {/* Faint radial highlight */}
                        <div
                          className="absolute -top-16 left-1/2 -translate-x-1/2 w-[600px] h-[250px] rounded-full blur-3xl pointer-events-none opacity-[0.03]"
                          style={{ background: 'rgba(139,92,246,1)' }}
                        />

                        {/* Header */}
                        <div className="flex items-center gap-3 relative z-10">
                          <div className="h-9 w-9 rounded-lg grid place-items-center bg-white/5 border border-white/10">
                            <Icon className="w-4 h-4 text-white/40" />
                          </div>
                          <div className="space-y-0.5">
                            <h2 className="text-white text-xl font-semibold tracking-tight">{section.label}</h2>
                            <p className="text-white/50 text-sm">{section.subtitle}</p>
                          </div>
                          <span className="ml-auto px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 text-white/40 border border-white/10">
                            {section.tools.length}
                          </span>
                        </div>

                        {/* Divider */}
                        <div className="h-px mt-4 mb-6 bg-gradient-to-r from-white/10 via-white/5 to-transparent relative z-10" />

                        {/* Grid */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 relative z-10">
                          {section.tools.map((tool, index) => (
                            <ToolCard key={tool.id} tool={tool} index={index} tier={getTier(tool.tool_id)} />
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                })}

                {/* Empty state */}
                {sections.length === 0 && (
                  <div className="text-center py-20">
                    <Search className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white/60 mb-2">{t('store.noResults')}</h3>
                    <p className="text-sm text-white/30">{t('store.tryAgain')}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Trust & FAQ */}
      <div id="trust-faq">
        <TrustAndFAQ />
      </div>
    </>
  );
};

export default Storefront;
