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
const BADGE_VARIANTS: Record<string, string> = {
  featured: 'bg-[hsl(195_85%_55%/0.12)] border-[hsl(195_85%_55%/0.22)] text-[hsl(195_80%_75%)]',
  popular: 'bg-[hsl(30_90%_55%/0.12)] border-[hsl(30_90%_55%/0.22)] text-[hsl(30_85%_75%)]',
  standard: 'bg-[hsl(155_70%_50%/0.12)] border-[hsl(155_70%_50%/0.22)] text-[hsl(155_65%_75%)]',
};

const TierBadge = ({ tier }: { tier: CardTier }) => {
  const base =
    'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur-md border';
  const variant = BADGE_VARIANTS[tier];

  if (tier === 'featured')
    return (
      <span className={`${base} ${variant}`}>
        <Crown className="w-2.5 h-2.5" /> Premium
      </span>
    );
  if (tier === 'popular')
    return (
      <span className={`${base} ${variant}`}>
        <TrendingUp className="w-2.5 h-2.5" /> Trending
      </span>
    );
  return (
    <span className={`${base} ${variant}`}>
      <Zap className="w-2.5 h-2.5" /> Instant
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
      {/* Bloom wrapper – overflow-visible so glow spills outside */}
      <div className="group relative overflow-visible transition-all duration-300 hover:-translate-y-1">
        {/* Glow bloom */}
        <div className="pointer-events-none absolute -inset-6 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_center,hsl(265_75%_60%/0.18),hsl(195_85%_55%/0.10),transparent_70%)] blur-2xl" />

        {/* Border ring wrapper – clips gradient border */}
        <div className="relative rounded-[22px] p-px overflow-hidden">
          {/* Gradient border ring */}
          <div className="absolute inset-0 opacity-30 group-hover:opacity-70 transition-opacity duration-300 bg-gradient-to-br from-[hsl(195_85%_65%/0.5)] via-[hsl(265_75%_60%/0.4)] to-[hsl(280_60%_55%/0.3)]" />

          {/* Inner card */}
          <div
            className="relative rounded-[21px] overflow-hidden backdrop-blur-xl border-0"
            style={{
              background: 'linear-gradient(165deg, hsla(0,0%,100%,0.08) 0%, hsla(240,30%,12%,0.85) 40%, hsla(265,40%,8%,0.90) 100%)',
              boxShadow: '0 8px 32px hsla(240,60%,10%,0.45), 0 2px 8px hsla(0,0%,0%,0.35), inset 0 1px 0 hsla(0,0%,100%,0.08)',
            }}
          >
            {/* Inner top highlight */}
            <div className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_30%_0%,hsla(0,0%,100%,0.14),transparent_50%)]" />

            {/* Content */}
            <div className="relative p-6 flex flex-col gap-4">
              {/* Logo + badge */}
              <div className="flex items-start justify-between">
                <div
                  className="h-14 w-14 rounded-2xl grid place-items-center border border-[hsl(0_0%_100%/0.10)]"
                  style={{
                    background: 'linear-gradient(135deg, hsla(0,0%,100%,0.08), hsla(0,0%,100%,0.03))',
                    boxShadow: 'inset 0 1px 0 hsla(0,0%,100%,0.10)',
                  }}
                >
                  {showLogo ? (
                    <img
                      src={logoUrl!}
                      alt={`${tool.name} logo`}
                      className={`h-8 w-8 object-contain drop-shadow-sm transition-opacity duration-300 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => { setLogoLoaded(true); setLogoError(false); }}
                      onError={() => {
                        if (!logoError) { setLogoError(true); setLogoLoaded(false); }
                        else { setFallbackAttempted(true); }
                      }}
                      loading="lazy"
                    />
                  ) : null}
                  {(!showLogo || !logoLoaded) && (
                    <span className="text-base font-semibold text-foreground/80">
                      {tool.name.charAt(0)}
                    </span>
                  )}
                </div>
                <TierBadge tier={tier} />
              </div>

              {/* Title + meta */}
              <div className="space-y-1">
                <h3 className="text-foreground font-semibold tracking-tight leading-tight text-lg">
                  {tool.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Monthly Access · {categoryLabel}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline">
                {price && price > 0 ? (
                  <>
                    <span className="text-lg font-semibold text-foreground/90">${price}</span>
                    <span className="text-xs text-foreground/40 ml-1">/{t('store.perMonth')}</span>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {t('store.contactForPrice', 'Contact for pricing')}
                  </span>
                )}
              </div>

              {/* CTA */}
              <button
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-foreground transition-all duration-300 border border-[hsl(0_0%_100%/0.10)] group-hover:border-[hsl(265_75%_60%/0.30)] group-hover:shadow-[0_0_20px_hsla(265,75%,60%,0.12)]"
                style={{
                  background: 'linear-gradient(135deg, hsla(195,85%,55%,0.12), hsla(265,75%,60%,0.12))',
                }}
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
