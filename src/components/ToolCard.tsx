import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Zap, Crown } from 'lucide-react';
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
const TierBadge = ({ tier }: { tier: CardTier }) => {
  if (tier === 'featured') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 backdrop-blur-md">
        <Crown className="w-2.5 h-2.5" />
        Premium
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 backdrop-blur-md">
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
    <div
      className="group relative overflow-hidden rounded-2xl backdrop-blur-xl border border-white/[0.08] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-cyan-400/20 hover:shadow-[0_15px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(34,211,238,0.08)]"
      style={{
        background: 'linear-gradient(180deg, rgba(24,24,27,0.85) 0%, rgba(9,9,11,0.95) 100%)',
        boxShadow: '0 10px 35px rgba(0,0,0,0.45)',
      }}
    >
      {/* Neon glow — hover only */}
      <div className="pointer-events-none absolute -inset-1 opacity-0 bg-gradient-to-r from-cyan-500/15 via-purple-500/12 to-fuchsia-500/15 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      {/* Inner top highlight (pseudo-like) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)',
        }}
      />

      {/* Subtle texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.3),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(56,189,248,0.2),transparent_40%)]" />

      {/* Content */}
      <div className="relative p-5 flex flex-col gap-4">
        {/* Logo + badge row */}
        <div className="flex items-start justify-between">
          <div
            className="h-14 w-14 rounded-xl grid place-items-center border border-white/10"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
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
          <h3 className="text-white font-semibold tracking-tight leading-tight text-base">{tool.name}</h3>
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
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white border border-white/10 transition-all duration-300 hover:border-white/20 group-hover:shadow-[0_0_0_1px_rgba(34,211,238,0.15),0_8px_25px_rgba(168,85,247,0.12)]"
          style={{
            background: 'linear-gradient(135deg, rgba(34,211,238,0.12) 0%, rgba(168,85,247,0.12) 100%)',
          }}
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
