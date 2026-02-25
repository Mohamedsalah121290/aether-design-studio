import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Zap, Crown, TrendingUp } from 'lucide-react';
import { CheckoutDialog } from '@/components/CheckoutDialog';

/* ── Tailwind class constants ─────────────────────────────────── */
const cardClass =
  'group relative overflow-hidden rounded-2xl bg-zinc-950/70 backdrop-blur-xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.45)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20';

const glowOverlayClass =
  'pointer-events-none absolute -inset-1 opacity-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-fuchsia-500/20 blur-2xl transition-opacity duration-300 group-hover:opacity-100';

const textureClass =
  "pointer-events-none absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.3),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(56,189,248,0.25),transparent_40%)]";

const contentClass = 'relative p-5 flex flex-col gap-4';

const logoCapsuleClass =
  'h-12 w-12 rounded-xl grid place-items-center bg-white/5 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]';

const logoImgClass = 'h-7 w-7 object-contain';

const titleClass = 'text-white font-semibold tracking-tight leading-tight text-base';
const metaClass = 'text-xs text-white/50';

const priceClass = 'text-lg font-semibold text-white';
const perClass = 'text-xs text-white/45 ml-1';

const badgeBase =
  'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] bg-white/[0.07] backdrop-blur-md border border-white/10';

const buyBtnClass =
  'mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/[0.08] border border-white/10 text-white py-2.5 text-sm font-medium transition-all duration-300 hover:bg-white/[0.12] hover:border-white/20 group-hover:shadow-[0_0_0_1px_rgba(34,211,238,0.25),0_12px_30px_rgba(168,85,247,0.15)]';

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

/* ── Badge component ──────────────────────────────────────────── */
const TierBadge = ({ tier }: { tier: CardTier }) => {
  if (tier === 'featured') {
    return (
      <span className={`${badgeBase} text-cyan-300/80`}>
        <Crown className="w-2.5 h-2.5" />
        Premium
      </span>
    );
  }
  if (tier === 'popular') {
    return (
      <span className={`${badgeBase} text-white/80`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70" />
        Trending
      </span>
    );
  }
  return (
    <span className={`${badgeBase} text-white/70`}>
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

  /* Tier-specific border accent on hover */
  const hoverBorder =
    tier === 'featured'
      ? 'hover:border-cyan-400/25'
      : tier === 'popular'
      ? 'hover:border-white/25'
      : '';

  return (
    <div className={`${cardClass} ${hoverBorder}`}>
      {/* Neon glow — hover only */}
      <div className={glowOverlayClass} />

      {/* Subtle internal texture */}
      <div className={textureClass} />

      {/* Content */}
      <div className={contentClass}>
        {/* Row: logo + badge */}
        <div className="flex items-start justify-between">
          <div className={logoCapsuleClass}>
            {showLogo ? (
              <img
                src={logoUrl!}
                alt={`${tool.name} logo`}
                className={`${logoImgClass} transition-opacity duration-300 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => { setLogoLoaded(true); setLogoError(false); }}
                onError={() => {
                  if (!logoError) { setLogoError(true); setLogoLoaded(false); }
                  else { setFallbackAttempted(true); }
                }}
                loading="lazy"
              />
            ) : null}
            {(!showLogo || !logoLoaded) && (
              <span className="text-sm font-semibold text-white/80">
                {tool.name.charAt(0)}
              </span>
            )}
          </div>

          <TierBadge tier={tier} />
        </div>

        {/* Title + meta */}
        <div className="space-y-1">
          <h3 className={titleClass}>{tool.name}</h3>
          <p className={metaClass}>Monthly Access · {categoryLabel}</p>
        </div>

        {/* Price */}
        <div className="flex items-baseline">
          {price && price > 0 ? (
            <>
              <span className={priceClass}>${price}</span>
              <span className={perClass}>/{t('store.perMonth')}</span>
            </>
          ) : (
            <span className={metaClass}>{t('store.contactForPrice', 'Contact for pricing')}</span>
          )}
        </div>

        {/* CTA */}
        <button
          className={buyBtnClass}
          onClick={() => setCheckoutOpen(true)}
        >
          {t('store.buyNow')}
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      </div>

      <CheckoutDialog tool={tool} open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </div>
  );
};

export default ToolCard;
