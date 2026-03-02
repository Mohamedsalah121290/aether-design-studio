import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Zap, Crown, TrendingUp, Bell, Lock, GraduationCap, Shield } from 'lucide-react';
import { CheckoutDialog } from '@/components/CheckoutDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

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
  status?: string;
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

/* ── Coming Soon Glass Badge ───────────────────────────────────── */
const ComingSoonBadge = () => (
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
    <span>Coming Soon</span>
  </span>
);

/* ── Component ─────────────────────────────────────────────────── */
export const ToolCard = ({ tool, index, tier = 'standard' }: ToolCardProps) => {
  const { t } = useTranslation();
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [fallbackAttempted, setFallbackAttempted] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [showNotifyInput, setShowNotifyInput] = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [consentChecked, setConsentChecked] = useState(true);

  const logoUrl = logoError && !fallbackAttempted ? `/logos/${tool.tool_id}.svg` : tool.logo_url;
  const showLogo = logoUrl && !(logoError && fallbackAttempted);
  const price = tool.starting_price;
  const categoryLabel = CATEGORY_LABELS[tool.category] || tool.category;
  const isComingSoon = tool.status === 'coming_soon';
  const isPaused = tool.status === 'paused';

  const handleNotifyMe = async () => {
    if (!showNotifyInput) { setShowNotifyInput(true); return; }
    const trimmed = notifyEmail.trim().toLowerCase();
    const result = emailSchema.safeParse(trimmed);
    if (!result.success) { toast.error('Please enter a valid email address.'); return; }
    if (!consentChecked) { toast.error('Please agree to be notified.'); return; }

    setNotifyLoading(true);
    try {
      const { error } = await supabase.from('waitlist' as any).insert({
        email: trimmed,
        tool_id: tool.tool_id,
        source: 'store',
        consent: true,
      } as any);
      if (error) {
        if (error.code === '23505') toast.info("You're already on the waitlist for this tool!");
        else toast.error('Something went wrong.');
      } else {
        toast.success(`We'll notify you when ${tool.name} is available! 🎉`);
        setNotifyEmail('');
        setShowNotifyInput(false);
      }
    } catch { toast.error('Something went wrong.'); }
    finally { setNotifyLoading(false); }
  };

  return (
    <>
      <div className={`group relative overflow-visible transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.03] ${isPaused ? 'opacity-40 pointer-events-none' : ''}`}>
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
              <div
                className="h-11 w-11 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl grid place-items-center border border-[hsl(0_0%_100%/0.06)] backdrop-blur-sm relative"
                style={{ background: 'hsl(210 50% 50% / 0.06)' }}
              >
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
              {isComingSoon ? <ComingSoonBadge /> : isPaused ? (
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-[4px] text-[10px] font-semibold uppercase tracking-wider bg-gray-500/15 border border-gray-500/30 text-gray-400">
                  Unavailable
                </span>
              ) : <TierBadge tier={tier} />}
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

            {/* Price */}
            <div className="space-y-0.5">
              {price && price > 0 ? (
                <>
                  <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#E8D48B' }}>Member Price</p>
                  <div className="flex items-baseline">
                    <span className="text-lg sm:text-xl font-bold text-[hsl(185_80%_60%)]" style={{ textShadow: '0 0 14px hsl(185 80% 55% / 0.25)' }}>${price}</span>
                    <span className="text-xs text-foreground/40 ml-1">/{t('store.perMonth')}</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground/60">Access-based pricing model</p>
                </>
              ) : (
                <span className="text-xs text-muted-foreground">{t('store.contactForPrice', 'Contact for pricing')}</span>
              )}
            </div>

            {/* Activation Guarantee badge */}
            {!isComingSoon && !isPaused && (
              <div className="flex items-center gap-1.5 mb-1" title="If activation fails within 24 hours, you're protected with credit or refund.">
                <Shield className="w-3 h-3" style={{ color: '#E8D48B' }} />
                <span className="text-[10px] font-semibold tracking-wide" style={{ color: '#E8D48B' }}>Activation Guarantee</span>
              </div>
            )}

            {/* CTA */}
            {isComingSoon ? (
              <div className="mt-1 sm:mt-2 space-y-2">
                {showNotifyInput && (
                  <div className="space-y-2">
                    <input
                      type="email"
                      placeholder="your@email.com"
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
                        We'll only email you about this tool's availability.
                      </span>
                    </label>
                  </div>
                )}
                <button
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white transition-all duration-300 hover:shadow-[0_0_20px_hsl(45_100%_55%/0.20)]"
                  style={{
                    background: 'linear-gradient(135deg, hsl(45 90% 48% / 0.85), hsl(35 85% 42% / 0.85))',
                    boxShadow: '0 0 12px hsl(45 100% 50% / 0.10)',
                    backdropFilter: 'blur(8px)',
                  }}
                  onClick={handleNotifyMe}
                  disabled={notifyLoading}
                >
                  {notifyLoading ? 'Saving...' : showNotifyInput ? 'Get Early Access' : 'Notify Me'}
                  <Bell className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="mt-1 sm:mt-2 space-y-1">
                <button
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white transition-all duration-300 hover:shadow-[0_0_28px_hsl(210_100%_55%/0.35)]"
                  style={{
                    background: 'linear-gradient(135deg, hsl(210 100% 55%), hsl(270 65% 58%))',
                    boxShadow: '0 0 14px hsl(210 100% 55% / 0.20)',
                  }}
                  onClick={() => setCheckoutOpen(true)}
                >
                  {t('store.buyNow')}
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
                <a
                  href={`/academy?tool_id=${tool.tool_id}`}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  <GraduationCap className="w-3 h-3" />
                  Learn This Tool
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {!isComingSoon && !isPaused && (
        <CheckoutDialog tool={tool} open={checkoutOpen} onOpenChange={setCheckoutOpen} />
      )}
    </>
  );
};

export default ToolCard;
