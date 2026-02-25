import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Zap, Crown } from 'lucide-react';
import { CheckoutDialog } from '@/components/CheckoutDialog';

/* ── Tailwind class constants (Neon Cyber Luxury) ─────────────── */
const toolCardClass =
  'group relative overflow-hidden rounded-2xl bg-zinc-950/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20';

const neonGlowOverlayClass =
  'pointer-events-none absolute -inset-1 opacity-0 bg-gradient-to-r from-fuchsia-500/25 via-cyan-400/20 to-violet-500/25 blur-2xl transition-opacity duration-300 group-hover:opacity-100';

const subtleTextureClass =
  "pointer-events-none absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.35),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(56,189,248,0.35),transparent_40%)]";

const cardContentClass = 'relative p-5 flex flex-col gap-4';

const logoCapsuleClass =
  'h-12 w-12 rounded-xl grid place-items-center bg-white/5 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]';

const logoImgClass = 'h-7 w-7 object-contain';

const titleClass = 'text-white font-semibold tracking-tight leading-tight';

const metaClass = 'text-xs text-white/50';

const priceRowClass = 'mt-1 flex items-end justify-between';

const priceClass = 'text-lg font-semibold text-white';

const perClass = 'text-xs text-white/45 ml-1';

const badgeClass =
  'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] bg-white/[0.07] border border-white/10 text-white/80';

const buyBtnClass =
  'mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/[0.08] border border-white/10 text-white py-2.5 text-sm font-medium transition-all duration-300 hover:bg-white/[0.12] hover:border-white/20 group-hover:shadow-[0_0_0_1px_rgba(34,211,238,0.25),0_12px_30px_rgba(168,85,247,0.15)]';

/* ── Category labels ──────────────────────────────────────────── */
const CATEGORY_LABELS: Record<string, string> = {
  text: 'Writing & SEO',
  image: 'Design & Image',
  video: 'Video',
  audio: 'Voice & Audio',
  coding: 'Coding & Dev',
  automation: 'Automation',
  productivity: 'Productivity',
  security: 'Security',
  'os-licenses': 'OS & Licenses',
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

  /* tier-specific glow strength */
  const glowExtra =
    tier === 'featured'
      ? 'group-hover:opacity-100'
      : tier === 'popular'
      ? 'group-hover:opacity-75'
      : 'group-hover:opacity-60';

  const borderExtra =
    tier === 'featured'
      ? 'border-white/15 hover:border-cyan-400/30'
      : tier === 'popular'
      ? 'border-white/10 hover:border-white/20'
      : '';

  return (
    <div
      className={`${toolCardClass} ${borderExtra}`}
      style={{
        animationDelay: `${Math.min(index * 40, 300)}ms`,
      }}
    >
      {/* Neon glow overlay (hover only) */}
      <div className={`${neonGlowOverlayClass} ${glowExtra}`} />

      {/* Subtle texture */}
      <div className={subtleTextureClass} />

      {/* Content */}
      <div className={cardContentClass}>
        {/* Logo capsule */}
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
              <span className="text-sm font-bold text-white/70">{tool.name.charAt(0)}</span>
            )}
          </div>

          {/* Badge */}
          {tier === 'featured' ? (
            <span className={badgeClass}>
              <Crown className="w-2.5 h-2.5" /> Premium
            </span>
          ) : (
            <span className={badgeClass}>
              <Zap className="w-2.5 h-2.5" /> Instant
            </span>
          )}
        </div>

        {/* Name + category */}
        <div>
          <h3 className={titleClass}>{tool.name}</h3>
          <p className={metaClass}>{categoryLabel}</p>
        </div>

        {/* Price */}
        <div className={priceRowClass}>
          {price && price > 0 ? (
            <div className="flex items-baseline">
              <span className={priceClass}>${price}</span>
              <span className={perClass}>/{t('store.perMonth')}</span>
            </div>
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
