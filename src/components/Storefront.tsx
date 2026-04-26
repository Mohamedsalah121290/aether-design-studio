import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Sparkles, Search, Loader2, Palette,
  Code, Briefcase, Monitor, Users,
} from 'lucide-react';
import { ToolCard, Tool, CardTier } from './ToolCard';
import { inferPeriodFromPlan, type PricePeriod } from '@/lib/pricePeriod';
import FiltersBar, { FilterChip, SortOption } from './FiltersBar';
import TrustAndFAQ from './TrustAndFAQ';
import { supabase } from '@/integrations/supabase/client';

/* ── Section config ─────────────────────────────────────────────── */
const SECTION_ORDER: {
  key: string;
  icon: React.ElementType;
  toolIds: string[];
}[] = [
  { key: 'licenses-productivity', icon: Monitor, toolIds: ['windows', 'windows_home', 'windows_server', 'microsoft_office', 'microsoft_365'] },
  { key: 'design-video', icon: Palette, toolIds: ['canva', 'capcut'] },
  { key: 'premium-ai', icon: Code, toolIds: ['chatgpt', 'lovable', 'perplexity', 'grok', 'elevenlabs'] },
  { key: 'education-security-business', icon: Briefcase, toolIds: ['coursera', 'linkedin', 'notion', 'zoom', 'eset'] },
];

const ALLOWED_TOOL_IDS = new Set(SECTION_ORDER.flatMap(section => section.toolIds));

const FEATURED_TOOL_IDS = ['chatgpt', 'perplexity', 'grok', 'elevenlabs', 'lovable', 'canva'];
const POPULAR_TOOL_IDS  = ['capcut', 'windows', 'windows_home', 'microsoft_365', 'microsoft_office', 'coursera'];

const FILTER_CATEGORY_MAP: Record<string, string[]> = {
  'licenses-productivity': ['windows', 'windows_home', 'windows_server', 'microsoft_office', 'microsoft_365'],
  'design-video': ['canva', 'capcut'],
  'premium-ai': ['chatgpt', 'lovable', 'perplexity', 'grok', 'elevenlabs'],
  'education-security-business': ['coursera', 'linkedin', 'notion', 'zoom', 'eset'],
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
        .from('tools').select('*').in('status', ['active', 'coming_soon', 'paused']).order('name');
      if (toolsError) throw toolsError;

      const { data: plansData, error: plansError } = await supabase
        .from('tool_plans').select('tool_id, plan_id, plan_name, monthly_price').eq('is_active', true);
      if (plansError) throw plansError;

      // Determine the lowest-priced active plan per tool, and remember its plan_name
      // so we can derive the correct billing period (one-time / monthly / yearly).
      const minPriceMap: Record<string, { price: number; planName: string }> = {};
      (plansData || []).forEach(p => {
        if (p.tool_id === 'lovable' && !['pro_monthly', 'lovable_2_months', 'lovable_3_months'].includes((p as any).plan_id || '')) return;
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
      ALLOWED_TOOL_IDS.has(t.tool_id) && (t.status !== 'paused' || t.tool_id === 'gemini') &&
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (activeFilter !== 'all' && FILTER_CATEGORY_MAP[activeFilter]) {
      result = result.filter(t => FILTER_CATEGORY_MAP[activeFilter].includes(t.tool_id));
    }

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => (a.starting_price ?? Infinity) - (b.starting_price ?? Infinity));
    } else if (sortBy === 'newest') {
      result = [...result].reverse();
    }

    return result;
  }, [tools, searchQuery, activeFilter, sortBy]);

  const orderedTools = useMemo(() => {
    const order = new Map(SECTION_ORDER.flatMap(section => section.toolIds).map((toolId, index) => [toolId, index]));
    return [...processedTools].sort((a, b) => (order.get(a.tool_id) ?? 999) - (order.get(b.tool_id) ?? 999));
  }, [processedTools]);

  return (
    <>
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
              <p className="text-sm font-semibold text-primary mb-4">
                {t('store.saveVsOfficial', 'Save up to 60% vs official subscriptions')}
              </p>
              <div className="mx-auto mb-6 max-w-2xl rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm leading-relaxed text-muted-foreground">
                <p className="font-semibold text-foreground">{t('store.activationAccessDelivery', 'After payment, we will send you the access details you purchased, including username and password when applicable.')}</p>
                <p className="mt-1 font-semibold text-primary">{t('store.neverAskPersonalCredentials', 'You do not need to send us your personal password before payment.')}</p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-3">
                <a
                  href="#tools-grid"
                  className="min-h-11 inline-flex items-center px-8 py-3 rounded-xl font-medium text-sm text-white bg-white/10 border border-white/15 transition-all duration-300 hover:bg-white/15 hover:border-white/25"
                >
                  {t('store.buyNow', 'Get Instant Access')}
                </a>
                <a
                  href="#tools-grid"
                  className="min-h-11 inline-flex items-center px-8 py-3 rounded-xl font-medium text-sm text-white/50 border border-white/5 transition-all duration-300 hover:text-white/70 hover:border-white/10"
                >
                  {t('store.buyNow', 'Get Instant Access')}
                </a>
              </div>

              {/* Payment + delivery trust note (no design change, inline copy) */}
              <p className="text-[11px] text-white/40 mb-6">
                {t('store.limitedAvailability', 'Limited availability today')} · {t('store.accessDeliveredWithinMinutes', 'Access delivered within minutes after payment')} · {t('store.supportAfterPurchase', 'Support available if you need help after purchase')}
              </p>

              {/* Social proof */}
              <div className="flex items-center justify-center gap-2 text-xs text-white/30">
                <Users className="w-3.5 h-3.5" />
                <span>{t('store.socialProof', 'Trusted by 500+ users across Europe')}</span>
              </div>
              <div className="mt-5 md:hidden flex flex-wrap items-center justify-center gap-2 text-[11px]">
                <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-semibold text-primary">🔥 {t('store.highDemand')}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/60">{t('store.viewingNow')}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/60">{t('store.limitedAvailability')}</span>
              </div>
            </div>
          </div>
        </div>

        <section className="relative z-10 pb-10" aria-label="Customer reviews">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid gap-3 md:grid-cols-3 text-center">
              {[
                { quote: t('store.reviewLucas', 'Fast delivery, got my account in minutes'), name: 'Lucas, Belgium' },
                { quote: t('store.reviewEmma', 'Much cheaper than official pricing, works perfectly'), name: 'Emma, France' },
                { quote: t('store.reviewDaniel', 'Smooth process, instant access'), name: 'Daniel, Netherlands' },
              ].map((review) => (
                <blockquote key={review.name} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="text-sm text-white/70">“{review.quote}”</p>
                  <footer className="mt-2 text-xs text-white/35">— {review.name}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>


        {/* ═══ MAIN CONTENT ═══ */}
        <div className="relative pb-8">
          <div className="relative z-10">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-white/20" />
              </div>
            ) : (
              <>
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

                <section className="py-12" aria-label="Products">
                  <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 relative">
                    <div
                      className="absolute -top-16 left-1/2 -translate-x-1/2 w-[600px] h-[250px] rounded-full blur-3xl pointer-events-none opacity-[0.03]"
                      style={{ background: 'rgba(139,92,246,1)' }}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 relative z-10">
                      {orderedTools.map((tool, index) => (
                        <div key={tool.id} className={tool.tool_id === 'lovable' ? 'lg:col-span-4' : undefined}>
                          <ToolCard tool={tool} index={index} tier={getTier(tool.tool_id)} />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Empty state */}
                {orderedTools.length === 0 && (
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
