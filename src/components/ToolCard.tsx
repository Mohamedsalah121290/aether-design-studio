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

/* ── Tailwind constants ────────────────────────────────────────── */
// Outermost: allows bloom to spill outside
const BLOOM_WRAPPER = "group relative overflow-visible transition-all duration-300 hover:-translate-y-1";

const GLOW_BLOOM = "pointer-events-none absolute -inset-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-cyan-400/20 via-fuchsia-500/15 to-violet-500/20 blur-3xl rounded-3xl";

// Ring wrapper: clips the neon ring to card shape
const RING_WRAPPER = "relative rounded-3xl p-[1px] overflow-hidden";

const NEON_RING = "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-cyan-400/70 via-fuchsia-500/60 to-violet-500/70";

const INNER_CARD = "relative rounded-3xl overflow-hidden backdrop-blur-xl border border-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.55)]";

const TOP_HIGHLIGHT = "pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_0%,rgba(255,255,255,0.18),transparent_45%)]";

const CONTENT = "relative p-6 flex flex-col gap-4";

const LOGO_CAPSULE = "h-14 w-14 rounded-2xl grid place-items-center bg-white/[0.06] border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]";

const BUY_BTN = "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-white/[0.12] text-white py-3 text-sm font-semibold transition-all duration-300 hover:from-cyan-500/35 hover:to-violet-500/35 hover:border-white/20 group-hover:shadow-[0_0_0_1px_rgba(34,211,238,0.25),0_18px_60px_rgba(168,85,247,0.18)]";

/* ── Badge ─────────────────────────────────────────────────────── */
const BADGE_VARIANTS: Record<string, string> = {
  featured: "bg-cyan-400/10 border-cyan-300/20 text-cyan-200",
  popular: "bg-orange-400/10 border-orange-300/20 text-orange-200",
  standard: "bg-emerald-400/10 border-emerald-300/20 text-emerald-200",
};

const TierBadge = ({ tier }: { tier: CardTier }) => {
  const base = "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur-md border";
  const variant = BADGE_VARIANTS[tier];

  if (tier === 'featured') {
    return (
      <span className={`${base} ${variant}`}>
        <Crown className="w-2.5 h-2.5" />
        Premium
      </span>
    );
  }
  if (tier === 'popular') {
    return (
      <span className={`${base} ${variant}`}>
        <TrendingUp className="w-2.5 h-2.5" />
        Trending
      </span>
    );
  }
  return (
    <span className={`${base} ${variant}`}>
      <Zap className="w-2.5 h-2.5" />
      Instant
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
      {/* Outermost — bloom can spill outside */}
      <div className={BLOOM_WRAPPER}>
        {/* Glow bloom (outside card bounds) */}
        <div className={GLOW_BLOOM} />

        {/* Ring wrapper — clips neon ring to card shape */}
        <div className={RING_WRAPPER}>
          {/* Neon ring */}
          <div className={NEON_RING} />

          {/* Inner card */}
          <div
            className={INNER_CARD}
            style={{
            background: 'linear-gradient(to bottom, rgba(39,39,42,0.70), rgba(9,9,11,0.70), rgba(0,0,0,0.80))',
          }}
        >
          {/* Inner top highlight */}
          <div className={TOP_HIGHLIGHT} />

          {/* Content */}
          <div className={CONTENT}>
            {/* Logo + badge row */}
            <div className="flex items-start justify-between">
              <div className={LOGO_CAPSULE}>
                {showLogo ? (
                  <img
                    src={logoUrl!}
                    alt={`${tool.name} logo`}
                    className={`h-8 w-8 object-contain transition-opacity duration-300 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => { setLogoLoaded(true); setLogoError(false); }}
                    onError={() => {
                      if (!logoError) { setLogoError(true); setLogoLoaded(false); }
                      else { setFallbackAttempted(true); }
                    }}
                    loading="lazy"
                  />
                ) : null}
                {(!showLogo || !logoLoaded) && (
                  <span className="text-base font-semibold text-white/80">
                    {tool.name.charAt(0)}
                  </span>
                )}
              </div>

              <TierBadge tier={tier} />
            </div>

            {/* Title + meta */}
            <div className="space-y-1">
              <h3 className="text-white font-semibold tracking-tight leading-tight text-lg">{tool.name}</h3>
              <p className="text-xs text-white/60">Monthly Access · {categoryLabel}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline">
              {price && price > 0 ? (
                <>
                  <span className="text-lg font-semibold text-white/90">${price}</span>
                  <span className="text-xs text-white/40 ml-1">/{t('store.perMonth')}</span>
                </>
              ) : (
                <span className="text-xs text-white/50">{t('store.contactForPrice', 'Contact for pricing')}</span>
              )}
            </div>

            {/* CTA */}
            <button
              className={BUY_BTN}
              onClick={() => setCheckoutOpen(true)}
            >
              {t('store.buyNow')}
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        </div>
      </div>

      <CheckoutDialog tool={tool} open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </>
  );
};

export default ToolCard;
