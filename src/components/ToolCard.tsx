import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Zap, Crown, TrendingUp } from 'lucide-react';
import { CheckoutDialog } from '@/components/CheckoutDialog';

/* ── Category labels ──────────────────────────────────────────── */
const CATEGORY_LABELS: Record<string, string> = {
  text: 'AI Writing',
  image: 'AI Design',
  video: 'AI Video',
  audio: 'AI Audio',
  coding: 'Dev Tools',
  automation: 'Automation',
  productivity: 'Productivity',
  security: 'Security',
  'os-licenses': 'Licenses',
};

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
}

export type CardTier = 'featured' | 'popular' | 'standard';

interface ToolCardProps {
  tool: Tool;
  index: number;
  tier?: CardTier;
}

/* ── Badge ─────────────────────────────────────────────────────── */
const TIER_LABEL: Record<CardTier, { icon: typeof Crown; text: string }> = {
  featured: { icon: Crown, text: 'Premium' },
  popular: { icon: TrendingUp, text: 'Trending' },
  standard: { icon: Zap, text: 'Instant' },
};

const TierBadge = ({ tier }: { tier: CardTier }) => {
  const { icon: Icon, text } = TIER_LABEL[tier];
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
      {/* Shimmer sweep */}
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_3s_ease-in-out_infinite]"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,245,200,0.12) 50%, transparent 60%)',
        }}
      />
      <Icon className="w-2.5 h-2.5 relative z-10 opacity-80" style={{ filter: 'drop-shadow(0 0 2px rgba(212,175,55,0.4))' }} />
      <span className="relative z-10">{text}</span>
    </span>
  );
};

/* ── Component ─────────────────────────────────────────────────── */
export const ToolCard = ({ tool, index, tier = 'standard' }: ToolCardProps) => {
  const { t } = useTranslation();
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [fallbackAttempted, setFallbackAttempted] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const logoUrl = logoError && !fallbackAttempted ? `/logos/${tool.tool_id}.svg` : tool.logo_url;
  const showLogo = logoUrl && !(logoError && fallbackAttempted);
  const price = tool.starting_price;
  const categoryLabel = CATEGORY_LABELS[tool.category] || tool.category;

  return (
    <>
      {/* Outer wrapper — overflow-visible for bloom */}
      <div className="group relative overflow-visible transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.03]">
        {/* Bloom glow behind card */}
        <div
          className="pointer-events-none absolute -inset-3 rounded-[22px] opacity-0 group-hover:opacity-100 transition-opacity duration-600 blur-2xl"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(210 100% 55% / 0.12), hsl(270 60% 50% / 0.08), transparent 70%)',
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
          {/* Gradient border via mask trick */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[16px] opacity-40 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              padding: '1px',
              background: 'linear-gradient(160deg, hsl(210 100% 60% / 0.25), hsl(270 60% 55% / 0.18), hsl(210 80% 50% / 0.08))',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
            }}
          />

          {/* Neon hover glow inside */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              boxShadow: 'inset 0 0 30px hsl(210 100% 55% / 0.06), 0 0 25px hsl(270 60% 55% / 0.08)',
            }}
          />

          <div className="relative p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
            {/* Logo + badge */}
            <div className="flex items-start justify-between">
              <div
                className="h-11 w-11 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl grid place-items-center border border-[hsl(0_0%_100%/0.06)] backdrop-blur-sm relative"
                style={{ background: 'hsl(210 50% 50% / 0.06)' }}
              >
                {/* Icon glow on hover */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: '0 0 16px hsl(210 100% 55% / 0.12)' }}
                />
                {showLogo ? (
                  <img
                    src={logoUrl!}
                    alt={`${tool.name} logo`}
                    className={`h-6 w-6 sm:h-8 sm:w-8 object-contain drop-shadow-sm transition-opacity duration-300 relative z-10 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
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
              </div>
              <TierBadge tier={tier} />
            </div>

            {/* Title + meta */}
            <div className="space-y-1">
              <h3 className="text-foreground font-bold tracking-tight leading-tight text-base sm:text-lg heading-glow">
                {tool.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                Monthly Access · {categoryLabel}
              </p>
            </div>

            {/* Price — bright cyan */}
            <div className="flex items-baseline">
              {price && price > 0 ? (
                <>
                  <span className="text-lg sm:text-xl font-bold text-[hsl(185_80%_60%)]" style={{ textShadow: '0 0 14px hsl(185 80% 55% / 0.25)' }}>${price}</span>
                  <span className="text-xs text-foreground/40 ml-1">
                    /{t('store.perMonth')}
                  </span>
                </>
              ) : (
                <span className="text-xs text-muted-foreground">
                  {t('store.contactForPrice', 'Contact for pricing')}
                </span>
              )}
            </div>

            {/* CTA — gradient with neon glow */}
            <button
              className="mt-1 sm:mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white transition-all duration-300 hover:shadow-[0_0_28px_hsl(210_100%_55%/0.35)]"
              style={{
                background: 'linear-gradient(135deg, hsl(210 100% 55%), hsl(270 65% 58%))',
                boxShadow: '0 0 14px hsl(210 100% 55% / 0.20)',
              }}
              onClick={() => setCheckoutOpen(true)}
            >
              {t('store.buyNow')}
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <CheckoutDialog tool={tool} open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </>
  );
};

export default ToolCard;
