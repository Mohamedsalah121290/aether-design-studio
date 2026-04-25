import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Sparkles, Search, Loader2, Palette,
  Code, Briefcase, Monitor, Users, Clock, CheckCircle,
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
import { Social3DLink, TelegramIcon, WhatsAppIcon } from './ChatbotConversion';
import { supportLinks } from '@/lib/socialLinks';

/* ── Section config ─────────────────────────────────────────────── */
const SECTION_ORDER: {
  key: string;
  icon: React.ElementType;
  toolIds: string[];
}[] = [
  { key: 'licenses-productivity', icon: Monitor, toolIds: ['windows', 'windows_home', 'windows_server', 'microsoft_office', 'microsoft_365'] },
  { key: 'design-video', icon: Palette, toolIds: ['canva', 'capcut'] },
  { key: 'premium-ai', icon: Code, toolIds: ['chatgpt', 'lovable', 'perplexity', 'grok', 'elevenlabs', 'gemini'] },
  { key: 'education-security-business', icon: Briefcase, toolIds: ['coursera', 'linkedin', 'notion', 'zoom', 'eset'] },
];

const ALLOWED_TOOL_IDS = new Set(SECTION_ORDER.flatMap(section => section.toolIds));

const FEATURED_TOOL_IDS = ['chatgpt', 'perplexity', 'grok', 'elevenlabs', 'lovable', 'canva'];
const POPULAR_TOOL_IDS  = ['capcut', 'windows', 'windows_home', 'microsoft_365', 'microsoft_office', 'coursera'];

const FILTER_CATEGORY_MAP: Record<string, string[]> = {
  'licenses-productivity': ['windows', 'windows_home', 'windows_server', 'microsoft_office', 'microsoft_365'],
  'design-video': ['canva', 'capcut'],
  'premium-ai': ['chatgpt', 'lovable', 'perplexity', 'grok', 'elevenlabs', 'gemini'],
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

  /* Split into active vs coming_soon */
  const activeTools = useMemo(() => processedTools.filter(t => t.status !== 'coming_soon'), [processedTools]);
  const comingSoonTools = useMemo(() => processedTools.filter(t => t.status === 'coming_soon'), [processedTools]);

  const activeSections = SECTION_ORDER.map(section => ({
    ...section,
    tools: section.toolIds.map(toolId => activeTools.find(t => t.tool_id === toolId)).filter(Boolean) as Tool[],
  })).filter(s => s.tools.length > 0);

  const comingSoonSections = SECTION_ORDER.map(section => ({
    ...section,
    tools: section.toolIds.map(toolId => comingSoonTools.find(t => t.tool_id === toolId)).filter(Boolean) as Tool[],
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
                {t('store.regionalTrust')} · {t('store.finalPaymentNote')} · 24h
              </p>

              {/* Social proof */}
              <div className="flex items-center justify-center gap-2 text-xs text-white/30">
                <Users className="w-3.5 h-3.5" />
                <span>{t('store.socialProof', '1,000+ active members already saving')}</span>
              </div>
              <div className="mt-5 md:hidden flex flex-wrap items-center justify-center gap-2 text-[11px]">
                <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-semibold text-primary">🔥 {t('store.highDemand')}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/60">{t('store.viewingNow')}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/60">{t('store.limitedAvailability')}</span>
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

                <section className="py-12" aria-label="Why buy from us">
                  <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
                    <div className="mb-6 text-center">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">{t('store.whyBuyFromUs')}</p>
                      <h2 className="mt-2 text-2xl md:text-4xl font-bold text-white heading-glow">{t('store.clearSimpleSafe')}</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3 items-stretch">
                      {[
                        { key: 'fastDelivery', icon: Zap },
                        { key: 'easyAccess', icon: Sparkles },
                        { key: 'realSupport', icon: Users },
                        { key: 'securePayment', icon: CheckCircle },
                      ].map(({ key, icon: Icon }) => (
                        <div key={key} className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:border-primary/35">
                          <div className="mb-4 h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <h3 className="text-xl font-bold text-white">{t(`store.trustReasons.${key}.title`)}</h3>
                          <p className="mt-2 text-sm text-white/50">{t(`store.trustReasons.${key}.text`)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="py-10" aria-label="How you receive your access">
                  <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
                      <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-start">
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{t('store.deliveryActivation')}</p>
                            <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white heading-glow">{t('store.receiveAccessTitle')}</h2>
                          </div>
                          <p className="text-base leading-relaxed text-white/70">{t('store.receiveAccessDescription')}</p>
                          <div className="space-y-2 text-sm leading-relaxed text-white/65">
                            <p>{t('store.receiveAccessIntro')}</p>
                            <p className="flex gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{t('store.accountAccess')}</p>
                            <p className="flex gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{t('store.activationKey')}</p>
                            <p className="flex gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{t('store.directActivation')}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 text-sm font-semibold text-white/75">
                            <span>✔ {t('store.fastDelivery')}</span><span>✔ {t('store.secureProcess')}</span><span>✔ {t('store.realSupport')}</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="rounded-2xl border border-primary/25 bg-primary/10 p-4">
                             <h3 className="text-base font-bold text-white">{t('store.importantInfo')}</h3>
                            <div className="mt-3 space-y-2 text-sm leading-relaxed text-white/70">
                               <p>{t('store.personalActivationInfo')}</p>
                               <p>{t('store.contactGuided')}</p>
                               <p className="font-semibold text-primary">{t('store.noPersonalPasswords')}</p>
                               <p>{t('store.secureMethods')}</p>
                            </div>
                          </div>
                          <div>
                             <p className="mb-3 text-sm font-semibold text-white">{t('store.needHelp')}</p>
                              <div className="flex flex-wrap gap-3">
                               {supportLinks.whatsapp && <Social3DLink href={supportLinks.whatsapp} label="Contact on WhatsApp" tone="social-whatsapp-3d" className="w-12 h-12"><WhatsAppIcon className="w-6 h-6" /></Social3DLink>}
                               {supportLinks.telegram && <Social3DLink href={supportLinks.telegram} label="Contact on Telegram" tone="social-telegram-3d" className="w-12 h-12"><TelegramIcon className="w-6 h-6" /></Social3DLink>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

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
                             <h2 className="text-white text-xl font-semibold tracking-tight heading-glow">{t(`store.categoriesDetailed.${section.key}.label`)}</h2>
                             <p className="text-white/50 text-sm">{t(`store.categoriesDetailed.${section.key}.subtitle`)}</p>
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
                             {t('store.getAccess')}
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
                           <h2 className="text-white text-xl font-semibold tracking-tight heading-glow">{t('store.comingSoon')}</h2>
                           <p className="text-white/50 text-sm">{t('store.comingSoonSubtitle')}</p>
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
