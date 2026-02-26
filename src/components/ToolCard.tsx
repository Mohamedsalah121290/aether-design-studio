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
  featured:
    'bg-[hsl(200_60%_52%/0.10)] border-[hsl(200_60%_52%/0.18)] text-[hsl(200_55%_72%)]',
  popular:
    'bg-[hsl(28_75%_52%/0.10)] border-[hsl(28_75%_52%/0.18)] text-[hsl(28_70%_72%)]',
  standard:
    'bg-[hsl(155_50%_45%/0.10)] border-[hsl(155_50%_45%/0.18)] text-[hsl(155_45%_70%)]',
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
      <div
        className="group relative rounded-[14px] border border-[hsl(0_0%_100%/0.08)] hover:border-[hsl(0_0%_100%/0.14)] transition-all duration-300 ease-out hover:-translate-y-1 overflow-hidden"
        style={{
          background: '#121212',
          boxShadow: '0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
            <div className="p-6 flex flex-col gap-4">
              {/* Logo + badge */}
              <div className="flex items-start justify-between">
                <div
                  className="h-14 w-14 rounded-2xl grid place-items-center border border-[hsl(0_0%_100%/0.08)]"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  {showLogo ? (
                    <img
                      src={logoUrl!}
                      alt={`${tool.name} logo`}
                      className={`h-8 w-8 object-contain drop-shadow-sm transition-opacity duration-300 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => {
                        setLogoLoaded(true);
                        setLogoError(false);
                      }}
                      onError={() => {
                        if (!logoError) {
                          setLogoError(true);
                          setLogoLoaded(false);
                        } else {
                          setFallbackAttempted(true);
                        }
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
                <p className="text-xs text-[#888]">
                  Monthly Access · {categoryLabel}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline">
                {price && price > 0 ? (
                  <>
                    <span className="text-xl font-bold text-white">${price}</span>
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

              {/* CTA */}
              <button
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white bg-[#007BFF] hover:bg-[#339DFF] transition-all duration-300"
                style={{
                  boxShadow: '0 0 0 rgba(0,123,255,0)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 16px rgba(0,123,255,0.4)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 0 0 rgba(0,123,255,0)')}
                onClick={() => setCheckoutOpen(true)}
              >
                {t('store.buyNow')}
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
      </div>

      <CheckoutDialog tool={tool} open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </>
  );
};

export default ToolCard;
