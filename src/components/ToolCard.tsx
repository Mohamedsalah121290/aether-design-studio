import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Crown, TrendingUp, Bell, Lock, Shield, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';
import { getPeriodStyle, formatEuro, type PricePeriod } from '@/lib/pricePeriod';
import { formatApproxCurrency } from '@/lib/currency';
import { useCurrency } from '@/hooks/useCurrency';
import { ProductRatingInline, ProductReviewPreview } from '@/components/ProductReviews';
import { Social3DLink, TelegramIcon, WhatsAppIcon } from '@/components/ChatbotConversion';
import { supportLinks } from '@/lib/socialLinks';
import { getStripeLink } from '@/lib/stripeLinks';
import { getProductLogoUrl } from '@/lib/productLogos';

/* ── Category labels ──────────────────────────────────────────── */
const CATEGORY_LABEL_KEYS: Record<string, string> = {
  text: 'store.category.text',
  image: 'store.category.image',
  video: 'store.category.video',
  audio: 'store.category.audio',
  coding: 'store.category.coding',
  automation: 'store.category.automation',
  productivity: 'store.category.productivity',
  security: 'store.category.security',
  'os-licenses': 'store.category.licenses',
};

/* Platform official URLs */
const PLATFORM_URLS: Record<string, string> = {
  chatgpt: 'https://chatgpt.com',
  perplexity: 'https://www.perplexity.ai',
  canva: 'https://www.canva.com',
};

const LOVABLE_PLAN_OPTIONS = [
  { planId: 'pro_monthly', titleKey: 'store.oneMonthPlan', price: 15, durationMonths: 1, durationKey: 'store.durationOneMonth', creditsKey: 'store.creditsMonthly', badgeKey: 'store.mostPopular', bestValue: false },
  { planId: 'lovable_2_months', titleKey: 'store.twoMonthsPlan', price: 28, durationMonths: 2, durationKey: 'store.durationTwoMonths', creditsKey: 'store.creditsMonthly', badgeKey: 'store.bestStarter', bestValue: false },
  { planId: 'lovable_3_months', titleKey: 'store.threeMonthsPlan', price: 40, durationMonths: 3, durationKey: 'store.durationThreeMonths', creditsKey: 'store.creditsMonthly', badgeKey: 'store.bestValue', bestValue: true },
];

const formatMonthlyValue = (price: number, months: number) => {
  const monthly = price / months;
  return `≈ €${Number.isInteger(monthly) ? monthly : monthly.toFixed(1)} / month`;
};

const emailSchema = z.string().trim().email().max(255);

/* ── Types ─────────────────────────────────────────────────────── */
export interface ToolPlan {
  id: string;
  tool_id: string;
  plan_id: string;
  plan_name: string;
  monthly_price: number | null;
  delivery_type: 'subscribe_for_them' | 'email_only' | 'provide_account';
  activation_time: number;
  is_active: boolean;
}

export interface Tool {
  id: string;
  tool_id: string;
  name: string;
  category: string;
  logo_url?: string | null;
  starting_price?: number | null;
  /** Billing period of the lowest-priced active plan ('one-time' | 'monthly' | 'yearly'). */
  starting_period?: PricePeriod | null;
  status?: string;
}

export type CardTier = 'featured' | 'popular' | 'standard';

interface ToolCardProps {
  tool: Tool;
  index: number;
  tier?: CardTier;
}

/* ── Badge ─────────────────────────────────────────────────────── */
const TIER_LABEL: Record<CardTier, { icon: typeof Crown; textKey: string }> = {
  featured: { icon: Crown, textKey: 'store.premium' },
  popular: { icon: TrendingUp, textKey: 'store.trending' },
  standard: { icon: Zap, textKey: 'store.instant' },
};

const TierBadge = ({ tier }: { tier: CardTier }) => {
  const { icon: Icon, textKey } = TIER_LABEL[tier];
  const { t } = useTranslation();
  return (
    <span
      className="relative inline-flex items-center gap-1.5 rounded-full px-3 py-[5px] text-[10px] font-semibold uppercase tracking-[0.1em] overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(184,134,11,0.10) 50%, rgba(212,175,55,0.18) 100%)',
        border: '1px solid rgba(212,175,55,0.30)',
        color: '#E8D48B',
        boxShadow: '0 0 12px rgba(212,175,55,0.12), 0 0 4px rgba(212,175,55,0.08), inset 0 1px 0 rgba(255,245,200,0.12)',
        textShadow: '0 1px 3px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_3s_ease-in-out_infinite]"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,245,200,0.12) 50%, transparent 60%)',
        }}
      />
      <Icon className="w-2.5 h-2.5 relative z-10 opacity-80" style={{ filter: 'drop-shadow(0 0 2px rgba(212,175,55,0.4))' }} />
      <span className="relative z-10">{t(textKey)}</span>
    </span>
  );
};

/* ── Coming Soon Glass Badge ───────────────────────────────────── */
const ComingSoonBadge = () => {
  const { t } = useTranslation();
  return (
  <span
    className="inline-flex items-center gap-1.5 rounded-full px-3 py-[5px] text-[10px] font-semibold uppercase tracking-[0.1em]"
    style={{
      background: 'linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(245,158,11,0.08) 100%)',
      border: '1px solid rgba(251,191,36,0.25)',
      color: 'rgb(253,224,139)',
      boxShadow: '0 0 10px rgba(251,191,36,0.10), inset 0 1px 0 rgba(255,255,255,0.08)',
      backdropFilter: 'blur(12px)',
    }}
  >
    <Lock className="w-2.5 h-2.5 opacity-80" />
    <span>{t('store.comingSoon')}</span>
  </span>
);
};

/* ── Component ─────────────────────────────────────────────────── */
export const ToolCard = ({ tool, index, tier = 'standard' }: ToolCardProps) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [fallbackAttempted, setFallbackAttempted] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [showNotifyInput, setShowNotifyInput] = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [consentChecked, setConsentChecked] = useState(true);
  const [selectedLovablePlan, setSelectedLovablePlan] = useState('lovable_3_months');

  const logoUrl = logoError && !fallbackAttempted ? `/logos/${tool.tool_id}.svg` : getProductLogoUrl(tool.tool_id, tool.logo_url);
  const showLogo = logoUrl && !(logoError && fallbackAttempted);
  const price = tool.starting_price;
  const approxPrice = formatApproxCurrency(price, currency.code);
  const categoryLabel = CATEGORY_LABEL_KEYS[tool.category] ? t(CATEGORY_LABEL_KEYS[tool.category]) : tool.category;
  const isComingSoon = tool.status === 'coming_soon';
  const isContactOnly = tool.tool_id === 'gemini';
  const isPaused = tool.status === 'paused' && !isContactOnly;
  const selectedLovablePlanDetails = LOVABLE_PLAN_OPTIONS.find(plan => plan.planId === selectedLovablePlan);
  const checkoutUrl = getStripeLink(tool.name, tool.tool_id === 'lovable' ? selectedLovablePlanDetails ? t(selectedLovablePlanDetails.titleKey) : undefined : undefined);
  const periodText = (period: PricePeriod) => t(`store.period.${period.replace('-', '')}`, period === 'one-time' ? 'one time' : period === 'yearly' ? '/ year' : '/ month');
  const periodLabel = (period: PricePeriod) => t(`store.periodLabel.${period.replace('-', '')}`, period === 'one-time' ? 'One-Time' : period === 'yearly' ? 'Yearly' : 'Monthly');

  const handleNotifyMe = async () => {
    if (!showNotifyInput) { setShowNotifyInput(true); return; }
    const trimmed = notifyEmail.trim().toLowerCase();
    const result = emailSchema.safeParse(trimmed);
    if (!result.success) { toast.error(t('store.validEmail')); return; }
    if (!consentChecked) { toast.error(t('store.agreeNotify')); return; }

    setNotifyLoading(true);
    try {
      const { error } = await supabase.from('waitlist' as any).insert({
        email: trimmed,
        tool_id: tool.tool_id,
        source: 'store',
        consent: true,
      } as any);
      if (error) {
        if (error.code === '23505') toast.info(t('store.alreadyWaitlist'));
        else toast.error(t('store.genericError'));
      } else {
        toast.success(t('store.notifySuccess', { tool: tool.name }));
        setNotifyEmail('');
        setShowNotifyInput(false);
      }
    } catch { toast.error(t('store.genericError')); }
    finally { setNotifyLoading(false); }
  };

  return (
    <>
      <div data-tool-id={tool.tool_id} className={`group relative overflow-visible transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.03] ${isPaused ? 'opacity-40 pointer-events-none' : ''}`}>
        {/* Bloom glow */}
        <div
          className="pointer-events-none absolute -inset-3 rounded-[22px] opacity-0 group-hover:opacity-100 transition-opacity duration-600 blur-2xl"
          style={{
            background: isComingSoon
              ? 'radial-gradient(ellipse at center, hsl(45 100% 55% / 0.08), transparent 70%)'
              : 'radial-gradient(ellipse at center, hsl(210 100% 55% / 0.12), hsl(270 60% 50% / 0.08), transparent 70%)',
          }}
        />

        {/* Card */}
        <div
          className="relative rounded-[16px] overflow-hidden backdrop-blur-[20px] transition-all duration-500"
          style={{
            background: 'rgba(20, 20, 35, 0.40)',
            boxShadow: '0 4px 30px hsl(240 40% 5% / 0.5), inset 0 1px 0 hsl(0 0% 100% / 0.04)',
          }}
        >
          {/* Gradient border */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[16px] opacity-40 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              padding: '1px',
              background: isComingSoon
                ? 'linear-gradient(160deg, hsl(45 100% 60% / 0.20), hsl(35 80% 50% / 0.12), transparent)'
                : 'linear-gradient(160deg, hsl(210 100% 60% / 0.25), hsl(270 60% 55% / 0.18), hsl(210 80% 50% / 0.08))',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
            }}
          />

          {/* Frosted overlay for Coming Soon */}
          {isComingSoon && (
            <div
              className="pointer-events-none absolute inset-0 rounded-[16px] z-[1]"
              style={{
                background: 'linear-gradient(180deg, rgba(20,20,35,0.15) 0%, rgba(20,20,35,0.25) 100%)',
                backdropFilter: 'blur(1px)',
              }}
            />
          )}

          {/* Hover glow */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              boxShadow: 'inset 0 0 30px hsl(210 100% 55% / 0.06), 0 0 25px hsl(270 60% 55% / 0.08)',
            }}
          />

          <div className="relative z-[2] p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
            {/* Logo + badge */}
            <div className="flex items-start justify-between">
              <a
                href={PLATFORM_URLS[tool.tool_id] || undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('store.visitTool', { tool: tool.name })}
                className="h-14 w-14 sm:h-[4.5rem] sm:w-[4.5rem] rounded-xl sm:rounded-2xl grid place-items-center border border-[hsl(0_0%_100%/0.06)] backdrop-blur-sm relative overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-110"
                style={{ background: 'hsl(210 50% 50% / 0.06)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!PLATFORM_URLS[tool.tool_id]) e.preventDefault();
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: '0 0 16px hsl(210 100% 55% / 0.12)' }}
                />
                {showLogo ? (
                  <img
                    src={logoUrl!}
                    alt={`${tool.name} logo`}
                    className={`h-9 w-9 sm:h-12 sm:w-12 object-contain p-0.5 transition-opacity duration-300 relative z-10 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => { setLogoLoaded(true); setLogoError(false); }}
                    onError={() => {
                      if (!logoError) { setLogoError(true); setLogoLoaded(false); }
                      else { setFallbackAttempted(true); }
                    }}
                    loading="lazy"
                  />
                ) : null}
                {(!showLogo || !logoLoaded) && (
                  <span className="text-base font-semibold text-foreground/80 relative z-10">
                    {tool.name.charAt(0)}
                  </span>
                )}
              </a>
              {isComingSoon ? <ComingSoonBadge /> : isPaused ? (
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-[4px] text-[10px] font-semibold uppercase tracking-wider bg-gray-500/15 border border-gray-500/30 text-gray-400">
                  {t('store.unavailable')}
                </span>
              ) : <TierBadge tier={tier} />}
            </div>

            {/* Title + meta */}
            <div className="space-y-1">
              <h3 className="text-foreground font-bold tracking-tight leading-tight text-base sm:text-lg heading-glow">
                {tool.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {tool.starting_period === 'one-time'
                  ? t('store.oneTimePurchase', 'One-Time Purchase')
                  : tool.starting_period === 'yearly'
                  ? t('store.yearlyAccess', 'Yearly Access')
                  : t('store.monthlyAccess', 'Monthly Access')}{' '}
                · {categoryLabel}
              </p>
              {tool.tool_id !== 'lovable' && !isComingSoon && !isPaused && (
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{t('store.mostPopular', 'Most Popular')}</p>
              )}
              <ProductRatingInline toolId={tool.tool_id} productName={tool.name} />
            </div>

            {/* Price */}
            <div className="space-y-0.5">
              {price && price > 0 ? (
                (() => {
                  const period = tool.starting_period ?? 'monthly';
                  const style = getPeriodStyle(period);
                  return (
                    <>
                      <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#E8D48B' }}>{t('store.monthlyAccess', 'Monthly Access')}</p>
                       <div className="flex items-baseline flex-wrap gap-x-1.5 gap-y-0.5">
                        <span
                          className={`text-lg sm:text-xl font-bold ${style.textClass}`}
                          style={{ textShadow: style.textShadow }}
                        >
                          {formatEuro(price)}
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground">{t('store.exclVat', '(excl. VAT)')}</span>
                        <span className={`text-xs font-medium ${style.textClass} opacity-80`}>
                          {periodText(period)}
                        </span>
                        <span
                          className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-[1px] rounded-md border ${style.textClass}`}
                          style={{ borderColor: 'currentColor', opacity: 0.85 }}
                        >
                          {periodLabel(period)}
                        </span>
                      </div>
                      {approxPrice && <p className="text-[11px] font-medium text-muted-foreground/80">{approxPrice}</p>}
                      <p className="text-[11px] font-medium leading-snug text-muted-foreground">{t('store.taxNote', 'Taxes (if applicable) are calculated at checkout.')}</p>
                      <p className="text-[11px] text-muted-foreground/80">{t('store.finalPaymentNote', 'Final payment is processed in EUR (€)')}</p>
                    </>
                  );
                })()
              ) : (
                <span className="text-xs text-muted-foreground">{t('store.contactForPrice', 'Contact for pricing')}</span>
              )}
            </div>

            {/* Activation Guarantee badge */}
            {!isComingSoon && !isPaused && (
              <div className="flex items-center gap-1.5 mb-1" title="If activation fails within 24 hours, you're protected with credit or refund.">
                <Shield className="w-3 h-3" style={{ color: '#E8D48B' }} />
                <span className="text-[10px] font-semibold tracking-wide" style={{ color: '#E8D48B' }}>{t('store.activationGuarantee', 'Activation Guarantee')}</span>
              </div>
            )}

            {!isComingSoon && !isPaused && (
              <ProductReviewPreview toolId={tool.tool_id} productName={tool.name} />
            )}

            {tool.tool_id === 'lovable' && !isComingSoon && !isPaused && (
              <div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                  {LOVABLE_PLAN_OPTIONS.map((plan) => {
                    const isSelected = selectedLovablePlan === plan.planId;
                    return (
                      <div
                        key={plan.planId}
                        onClick={() => setSelectedLovablePlan(plan.planId)}
                        className={`w-full rounded-xl border p-3 text-left transition-all duration-200 ${
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/15'
                            : plan.bestValue
                            ? 'border-primary/60 bg-primary/10 shadow-lg shadow-primary/10 hover:border-primary hover:bg-primary/15'
                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold text-white">{t(plan.titleKey)}</p>
                            <p className="text-xl font-bold text-primary">€{plan.price}</p>
                            <p className="text-[11px] font-semibold text-muted-foreground">{t('store.monthlyApprox', { price: Number.isInteger(plan.price / plan.durationMonths) ? plan.price / plan.durationMonths : (plan.price / plan.durationMonths).toFixed(1) })}</p>
                          </div>
                          <span className="shrink-0 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                            {t(plan.badgeKey)}
                          </span>
                        </div>
                        <div className="space-y-1 text-[11px] font-medium text-muted-foreground">
                          <p>{t(plan.durationKey)}</p>
                          <p>{t(plan.creditsKey)}</p>
                          <p>{t('store.creditsRenewed')}</p>
                          {plan.bestValue && <p className="font-semibold text-primary">{t('store.saveMorePlan')}</p>}
                          {plan.bestValue && <p>{t('store.mostUsersChoose')}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            const planCheckoutUrl = getStripeLink(tool.name, t(plan.titleKey));
                            if (planCheckoutUrl) window.open(planCheckoutUrl, '_blank', 'noopener,noreferrer');
                          }}
                          className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
                        >
                          {t('store.buyNow', 'Get Instant Access')}
                        </button>
                        <p className="mt-2 text-center text-[11px] font-semibold text-primary">{t('store.accessDeliveredWithinMinutes', 'Access delivered within minutes after payment')}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold text-muted-foreground">
                  <span>✔ {t('store.instantDelivery', 'Instant delivery')}</span><span>✔ {t('store.noSetupNeeded', 'No setup needed')}</span><span>✔ {t('store.supportAvailable', 'Support available')}</span>
                </div>
              </div>
            )}

            {!isComingSoon && !isPaused && (
              <div className="space-y-2 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t('store.whatYouGet', 'What you get')}</p>
                <div className="space-y-1.5 text-[11px] font-medium text-muted-foreground">
                  {[t('store.worksInstantly', 'Works instantly'), t('store.noInstallationNeeded', 'No installation needed'), t('store.fastDelivery', 'Fast delivery')].map((item) => (
                    <p key={item} className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-primary" />{item}</p>
                  ))}
                </div>
              </div>
            )}

            {!isComingSoon && !isPaused && (
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t('store.worksWellWith', 'Works well with')}</p>
                <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px]">
                  {['chatgpt', 'canva', 'microsoft_365'].filter((id) => id !== tool.tool_id).slice(0, 2).map((id) => (
                    <Link key={id} to={`/store?scrollTo=${id}`} className="font-medium text-primary hover:text-primary/80 transition-colors">{id === 'microsoft_365' ? 'Microsoft 365' : id === 'chatgpt' ? 'ChatGPT' : 'Canva'}</Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            {isContactOnly ? (
              <div className="mt-1 sm:mt-2 space-y-1">
                <div className="flex gap-3">
                  {supportLinks.whatsapp && <Social3DLink href={supportLinks.whatsapp} label="Contact on WhatsApp" tone="social-whatsapp-3d" className="w-12 h-12"><WhatsAppIcon className="w-6 h-6" /></Social3DLink>}
                  {supportLinks.telegram && <Social3DLink href={supportLinks.telegram} label="Contact on Telegram" tone="social-telegram-3d" className="w-12 h-12"><TelegramIcon className="w-6 h-6" /></Social3DLink>}
                </div>
              </div>
            ) : isComingSoon ? (
              <div className="mt-1 sm:mt-2 space-y-2">
                {showNotifyInput && (
                  <div className="space-y-2">
                    <input
                      type="email"
                      placeholder={t('store.notifyPlaceholder')}
                      value={notifyEmail}
                      onChange={e => setNotifyEmail(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleNotifyMe()}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-amber-500/20 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/40 transition-colors"
                    />
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentChecked}
                        onChange={e => setConsentChecked(e.target.checked)}
                        className="mt-0.5 rounded border-white/20 accent-amber-400"
                      />
                      <span className="text-[10px] text-white/40 leading-tight">
                        {t('store.notifyConsent')}
                      </span>
                    </label>
                  </div>
                )}
                <button
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white transition-all duration-300 hover:shadow-[0_0_20px_hsl(45_100%_55%/0.20)]"
                  style={{
                    background: 'linear-gradient(135deg, hsl(45 90% 48% / 0.85), hsl(35 85% 42% / 0.85))',
                    boxShadow: '0 0 12px hsl(45 100% 50% / 0.10)',
                    backdropFilter: 'blur(8px)',
                  }}
                  onClick={handleNotifyMe}
                  disabled={notifyLoading}
                >
                  {notifyLoading ? t('store.saving') : showNotifyInput ? t('store.getEarlyAccess') : t('store.notifyMe')}
                  <Bell className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="mt-1 sm:mt-2 space-y-1">
                <button
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white transition-all duration-300 hover:shadow-[0_0_28px_hsl(210_100%_55%/0.35)]"
                  style={{
                    background: 'linear-gradient(135deg, hsl(210 100% 55%), hsl(270 65% 58%))',
                    boxShadow: '0 0 14px hsl(210 100% 55% / 0.20)',
                  }}
                  onClick={() => checkoutUrl && window.open(checkoutUrl, '_blank', 'noopener,noreferrer')}
                  disabled={!checkoutUrl}
                >
                  {checkoutUrl ? t('store.buyNow', 'Get Instant Access') : t('store.contactSupport', 'Contact support')}
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
                <p className="text-center text-[11px] font-semibold text-primary">{t('store.accessDeliveredWithinMinutes', 'Access delivered within minutes after payment')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </>
  );
};

export default ToolCard;
