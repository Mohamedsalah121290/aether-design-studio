import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Sparkles, Search, Loader2, PenTool, Palette, Film, Mic,
  Code, Zap, Briefcase, ShieldCheck, Monitor, Users, Clock, Headphones,
} from 'lucide-react';
import { ToolCard, Tool, CardTier } from './ToolCard';
import { inferPeriodFromPlan, type PricePeriod } from '@/lib/pricePeriod';
import TrustStrip from './TrustStrip';
import FeaturedCarousel from './FeaturedCarousel';
import FiltersBar, { FilterChip, SortOption } from './FiltersBar';
import TrustAndFAQ from './TrustAndFAQ';
import AIRecommendations from './AIRecommendations';
import { supabase } from '@/integrations/supabase/client';
import SocialProofCarousel from './SocialProofCarousel';

/* ── Section config ─────────────────────────────────────────────── */
const SECTION_ORDER: {
  key: string;
  label: string;
  subtitle: string;
  icon: React.ElementType;
  categories: string[];
}[] = [
  { key: 'microsoft',  label: '💻 Microsoft',                  subtitle: 'Windows, Office & Microsoft licenses',     icon: Monitor,     categories: ['os-licenses'] },
  { key: 'design',     label: '🎨 Design',                     subtitle: 'Creative design & video editing tools',    icon: Palette,     categories: ['design'] },
  { key: 'ai-tools',   label: '🤖 AI Tools',                   subtitle: 'Premium AI assistants & generators',       icon: Code,        categories: ['ai-text', 'ai-media', 'audio', 'productivity'] },
  { key: 'other',      label: '🧩 Other Software & Accounts',  subtitle: 'Security, learning & more',                icon: Briefcase,   categories: ['security', 'education', 'communication', 'stock-media'] },
];

const FEATURED_TOOL_IDS = ['chatgpt', 'perplexity', 'grok', 'elevenlabs', 'lovable', 'canva'];
const POPULAR_TOOL_IDS  = ['capcut', 'windows', 'windows_home', 'microsoft_365', 'microsoft_office', 'coursera'];

const FILTER_CATEGORY_MAP: Record<string, string[]> = {
  'os-servers': ['os-licenses'],
  'office-productivity': ['productivity'],
  'design-video': ['design'],
  'stock-media': ['stock-media'],
  'ai-text-code': ['ai-text'],
  'ai-media': ['ai-media'],
  'security-vpn': ['security'],
  'education': ['education'],
  'communication': ['communication'],
};

/* ── Component ──────────────────────────────────────────────────── */
const Storefront = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterChip>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  useEffect(() => { fetchTools(); }, []);

  // Scroll to a specific tool card when arriving via ?scrollTo=toolId
  useEffect(() => {
    const scrollTo = searchParams.get('scrollTo');
    if (!scrollTo || loading) return;
    const el = document.querySelector(`[data-tool-id="${CSS.escape(scrollTo)}"]`);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const htmlEl = el as HTMLElement;
        htmlEl.classList.add('ring-2', 'ring-primary', 'rounded-[16px]', 'animate-[pulse_1.5s_ease-in-out_2]');
        htmlEl.style.boxShadow = '0 0 25px hsl(210 100% 55% / 0.4), 0 0 60px hsl(270 60% 50% / 0.2)';
        setTimeout(() => {
          htmlEl.classList.remove('ring-2', 'ring-primary', 'rounded-[16px]', 'animate-[pulse_1.5s_ease-in-out_2]');
          htmlEl.style.boxShadow = '';
        }, 3500);
      }, 300);
      setSearchParams({}, { replace: true });
    }
  }, [loading, searchParams]);

  const fetchTools = async () => {
    try {
      const { data: toolsData, error: toolsError } = await supabase
        .from('tools').select('*').in('status', ['active', 'coming_soon']).order('name');
      if (toolsError) throw toolsError;

      const { data: plansData, error: plansError } = await supabase
        .from('tool_plans').select('tool_id, plan_name, monthly_price').eq('is_active', true);
      if (plansError) throw plansError;

      // Determine the lowest-priced active plan per tool, and remember its plan_name
      // so we can derive the correct billing period (one-time / monthly / yearly).
      const minPriceMap: Record<string, { price: number; planName: string }> = {};
      (plansData || []).forEach(p => {
        const price = p.monthly_price != null ? Number(p.monthly_price) : null;
        if (price != null && price > 0) {
          const existing = minPriceMap[p.tool_id];
          if (!existing || price < existing.price) {
            minPriceMap[p.tool_id] = { price, planName: p.plan_name || '' };
          }
        }
      });

      setTools((toolsData || []).map(tool => {
        const entry = minPriceMap[tool.tool_id];
        const period: PricePeriod | null = entry ? inferPeriodFromPlan(entry.planName) : null;
        return {
          id: tool.id,
          tool_id: tool.tool_id,
          name: tool.name,
          category: tool.category,
          logo_url: tool.logo_url || null,
          starting_price: entry?.price ?? null,
          starting_period: period,
          status: (tool as any).status || 'active',
        };
      }));
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

    if (activeFilter !== 'all' && FILTER_CATEGORY_MAP[activeFilter]) {
      result = result.filter(t => FILTER_CATEGORY_MAP[activeFilter].includes(t.category));
    }

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => (a.starting_price ?? Infinity) - (b.starting_price ?? Infinity));
    } else if (sortBy === 'newest') {
      result = [...result].reverse();
    }

    return result;
  }, [tools, searchQuery, activeFilter, sortBy]);

  /* Split into active vs coming_soon */
  const activeTools = useMemo(() => processedTools.filter(t => t.status !== 'coming_soon'), [processedTools]);
  const comingSoonTools = useMemo(() => processedTools.filter(t => t.status === 'coming_soon'), [processedTools]);

  const activeSections = SECTION_ORDER.map(section => ({
    ...section,
    tools: activeTools.filter(t => section.categories.includes(t.category)),
  })).filter(s => s.tools.length > 0);

  const comingSoonSections = SECTION_ORDER.map(section => ({
    ...section,
    tools: comingSoonTools.filter(t => section.categories.includes(t.category)),
  })).filter(s => s.tools.length > 0);

  return (
    <>
      {/* ═══ TRUST STRIP ═══ */}
      <TrustStrip />

      <section id="store" className="relative overflow-hidden">
        {/* ═══ HERO ═══ */}
        <div className="relative py-12 lg:py-24 overflow-hidden">
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

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 tracking-tight leading-[1.1] text-white heading-glow">
                {t('store.title')}
              </h2>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.1] bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                {t('store.titleHighlight')}
              </h2>

              <p className="text-base md:text-lg text-white/40 max-w-2xl mx-auto mb-8 leading-relaxed">
                {t('store.description')}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-3">
                <a
                  href="#tools-grid"
                  className="min-h-11 inline-flex items-center px-8 py-3 rounded-xl font-medium text-sm text-white bg-white/10 border border-white/15 transition-all duration-300 hover:bg-white/15 hover:border-white/25"
                >
                  {t('store.ctaPrimary', 'Browse Deals')}
                </a>
                <a
                  href="#trust-faq"
                  className="min-h-11 inline-flex items-center px-8 py-3 rounded-xl font-medium text-sm text-white/50 border border-white/5 transition-all duration-300 hover:text-white/70 hover:border-white/10"
                >
                  {t('store.ctaSecondary', 'How It Works')}
                </a>
              </div>

              {/* Payment + delivery trust note (no design change, inline copy) */}
              <p className="text-[11px] text-white/40 mb-6">
                {t('store.paymentNote', 'Secure payment via Stripe & Bancontact')} · {t('store.monthlyAccess', 'Monthly Access')} · 24h
              </p>

              {/* Social proof */}
              <div className="flex items-center justify-center gap-2 text-xs text-white/30">
                <Users className="w-3.5 h-3.5" />
                <span>{t('store.socialProof', '1,000+ active members already saving')}</span>
              </div>
              <div className="mt-5 md:hidden flex flex-wrap items-center justify-center gap-2 text-[11px]">
                <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-semibold text-primary">🔥 High demand</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/60">23 people are viewing this now</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/60">Limited availability today</span>
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

                {/* AI Recommendations */}
                <AIRecommendations tools={tools} />

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

                {/* ═══ AVAILABLE NOW ═══ */}
                {activeSections.map((section, sectionIndex) => {
                  const Icon = section.icon;
                  return (
                    <section key={section.key} className="py-12">
                      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 relative">
                        <div
                          className="absolute -top-16 left-1/2 -translate-x-1/2 w-[600px] h-[250px] rounded-full blur-3xl pointer-events-none opacity-[0.03]"
                          style={{ background: 'rgba(139,92,246,1)' }}
                        />
                        <div className="flex items-center gap-3 relative z-10">
                          <div className="h-9 w-9 rounded-lg grid place-items-center bg-white/5 border border-white/10">
                            <Icon className="w-4 h-4 text-white/40" />
                          </div>
                          <div className="space-y-0.5">
                            <h2 className="text-white text-xl font-semibold tracking-tight heading-glow">{section.label}</h2>
                            <p className="text-white/50 text-sm">{section.subtitle}</p>
                          </div>
                          <span className="ml-auto px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 text-white/40 border border-white/10">
                            {section.tools.length}
                          </span>
                        </div>
                        <div className="h-px mt-4 mb-6 bg-gradient-to-r from-white/10 via-white/5 to-transparent relative z-10" />
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 relative z-10">
                          {section.tools.map((tool, index) => (
                            <ToolCard key={tool.id} tool={tool} index={index} tier={getTier(tool.tool_id)} />
                          ))}
                        </div>
                        {sectionIndex < activeSections.length - 1 && section.tools[0] && (
                          <Link to={`/store?scrollTo=${section.tools[0].tool_id}`} className="md:hidden mt-6 min-h-[52px] relative z-10 inline-flex w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25">
                            Get Access
                          </Link>
                        )}
                        {section.key === 'microsoft' && (
                          <div className="mt-10 relative z-10">
                            <SocialProofCarousel />
                          </div>
                        )}
                      </div>
                    </section>
                  );
                })}

                {/* ═══ COMING SOON SECTION ═══ */}
                {comingSoonTools.length > 0 && (
                  <section className="py-16">
                    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
                      {/* Section header */}
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="h-9 w-9 rounded-lg grid place-items-center border border-amber-500/20"
                          style={{ background: 'rgba(251,191,36,0.08)' }}
                        >
                          <Clock className="w-4 h-4 text-amber-400/60" />
                        </div>
                        <div className="space-y-0.5">
                          <h2 className="text-white text-xl font-semibold tracking-tight heading-glow">Coming Soon</h2>
                          <p className="text-white/50 text-sm">These tools are on their way — get early access</p>
                        </div>
                        <span className="ml-auto px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400/60 border border-amber-500/15">
                          {comingSoonTools.length}
                        </span>
                      </div>
                      <div className="h-px mt-4 mb-6 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent" />
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
                        {comingSoonTools.map((tool, index) => (
                          <ToolCard key={tool.id} tool={tool} index={index} tier={getTier(tool.tool_id)} />
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* Empty state */}
                {activeSections.length === 0 && comingSoonTools.length === 0 && (
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
