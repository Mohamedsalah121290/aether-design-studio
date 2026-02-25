import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sparkles, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CheckoutDialog } from '@/components/CheckoutDialog';

// Brand colors for each tool (kept for glow effects)
const toolColors: Record<string, { primary: string; glow: string }> = {
  chatgpt: { primary: '#10a37f', glow: '160 84% 40%' },
  claude: { primary: '#cc785c', glow: '20 55% 58%' },
  gemini: { primary: '#4285f4', glow: '217 89% 61%' },
  perplexity: { primary: '#20808d', glow: '187 63% 34%' },
  jasper: { primary: '#ff5c5c', glow: '0 100% 68%' },
  midjourney: { primary: '#000000', glow: '0 0% 30%' },
  leonardo: { primary: '#8b5cf6', glow: '258 90% 66%' },
  capcut: { primary: '#00f0ff', glow: '184 100% 50%' },
  runway: { primary: '#ff2d55', glow: '349 100% 59%' },
  elevenlabs: { primary: '#000000', glow: '0 0% 40%' },
  murf: { primary: '#6366f1', glow: '239 84% 67%' },
  adobe: { primary: '#ff0000', glow: '0 100% 50%' },
  windows: { primary: '#0078d4', glow: '206 100% 42%' },
};

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

export const ToolCard = ({ tool, index, tier = 'standard' }: ToolCardProps) => {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [fallbackAttempted, setFallbackAttempted] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const logoUrl = logoError && !fallbackAttempted ? `/logos/${tool.tool_id}.svg` : tool.logo_url;
  const colors = toolColors[tool.tool_id] || { primary: '#a855f7', glow: '270 85% 65%' };
  const showLogo = logoUrl && !(logoError && fallbackAttempted);
  const price = tool.starting_price;
  const glowIntensity =
    tier === 'featured'
      ? { idle: 0.35, hover: 0.75 }
      : tier === 'popular'
      ? { idle: 0.2, hover: 0.55 }
      : { idle: 0.1, hover: 0.4 };

  const categoryLabel = CATEGORY_LABELS[tool.category] || tool.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.3) }}
      className="perspective-1000"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative group cursor-pointer"
      >
        {/* Dynamic Glow */}
        <motion.div
          animate={{ opacity: isHovered ? glowIntensity.hover : glowIntensity.idle, scale: isHovered ? 1.06 : 1 }}
          transition={{ duration: 0.3 }}
          className="absolute -inset-1 rounded-3xl blur-xl"
          style={{
            background: `radial-gradient(ellipse at center, hsl(${colors.glow} / ${tier === 'featured' ? '0.7' : '0.5'}) 0%, transparent 70%)`,
          }}
        />

        {/* Gradient Border (featured + popular) */}
        {tier !== 'standard' && (
          <div
            className="absolute -inset-[1px] rounded-3xl pointer-events-none z-0"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}${tier === 'featured' ? '70' : '40'} 0%, transparent 40%, transparent 60%, ${colors.primary}${tier === 'featured' ? '50' : '30'} 100%)`,
              opacity: isHovered ? 1 : tier === 'featured' ? 0.6 : 0.3,
              transition: 'opacity 0.3s ease',
            }}
          />
        )}

        {/* Card Container */}
        <div
          className="relative rounded-3xl overflow-hidden backdrop-blur-xl border border-white/10"
          style={{
            background: 'linear-gradient(135deg, hsl(222 47% 11% / 0.92) 0%, hsl(222 47% 8% / 0.96) 100%)',
            boxShadow: `
              0 25px 50px -12px rgba(0,0,0,0.5),
              0 0 0 1px rgba(255,255,255,0.05),
              inset 0 1px 0 rgba(255,255,255,0.1),
              inset 0 -1px 0 rgba(0,0,0,0.2)
              ${tier === 'featured' ? `, 0 0 60px ${colors.primary}20` : ''}
            `,
            transform: 'translateZ(0)',
          }}
        >
          {/* Top Shine */}
          <div
            className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
            style={{ background: `linear-gradient(180deg, ${colors.primary}12 0%, transparent 100%)` }}
          />

          {/* Content */}
          <div className="relative p-6 flex flex-col h-full" style={{ transform: 'translateZ(20px)' }}>
            {/* Logo */}
            <div className="mb-5 relative">
              <motion.div
                animate={{ y: isHovered ? 8 : 4, opacity: isHovered ? 0.35 : 0.15, scale: isHovered ? 0.88 : 0.95 }}
                className="absolute left-0 top-2 w-20 h-20 rounded-2xl blur-lg"
                style={{ background: colors.primary }}
              />

              {/* Logo Capsule */}
              <motion.div
                animate={{ y: isHovered ? -6 : 0, scale: isHovered ? 1.08 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: `0 10px 35px ${colors.primary}35, 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)`,
                }}
              >
                {showLogo ? (
                  <img
                    src={logoUrl!}
                    alt={`${tool.name} logo`}
                    className={`w-14 h-14 object-contain transition-opacity duration-300 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => { setLogoLoaded(true); setLogoError(false); }}
                    onError={() => {
                      if (!logoError) { setLogoError(true); setLogoLoaded(false); }
                      else { setFallbackAttempted(true); }
                    }}
                    loading="lazy"
                  />
                ) : null}
                {(!showLogo || !logoLoaded) && (
                  <span className="text-2xl font-bold text-white" style={{ textShadow: `0 2px 10px ${colors.primary}` }}>
                    {tool.name.charAt(0)}
                  </span>
                )}
                <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ boxShadow: `inset 0 0 20px ${colors.primary}25` }} />
              </motion.div>
            </div>

            {/* Name + Meta */}
            <h3 className="text-lg font-display font-bold mb-1 text-foreground leading-tight">{tool.name}</h3>

            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: colors.primary }} />
              <span className="text-xs text-muted-foreground">{categoryLabel}</span>

              {/* Badges */}
              {tier === 'featured' && (
                <span
                  className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}30 0%, ${colors.primary}15 100%)`,
                    color: colors.primary,
                    border: `1px solid ${colors.primary}30`,
                  }}
                >
                  <Crown className="w-2.5 h-2.5" /> Premium
                </span>
              )}
              {tier !== 'featured' && (
                <span className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted/60 text-muted-foreground">
                  <Zap className="w-2.5 h-2.5" /> Instant
                </span>
              )}
            </div>

            {/* Price */}
            {price && price > 0 ? (
              <div className="mt-auto mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-muted-foreground">{t('store.startingFrom', 'From')}</span>
                  <span className="text-2xl font-display font-bold" style={{ color: colors.primary }}>
                    ${price}
                  </span>
                  <span className="text-xs text-muted-foreground">/{t('store.perMonth')}</span>
                </div>
              </div>
            ) : (
              <div className="mt-auto mb-4">
                <span className="text-base font-display font-semibold text-muted-foreground">
                  {t('store.contactForPrice', 'Contact for pricing')}
                </span>
              </div>
            )}

            {/* CTA Button */}
            <Button
              className="w-full relative overflow-hidden group/btn rounded-xl h-11"
              style={{
                background: isHovered
                  ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}dd 100%)`
                  : `linear-gradient(135deg, ${colors.primary}cc 0%, ${colors.primary}99 100%)`,
                border: 'none',
                transition: 'background 0.3s ease',
              }}
              onClick={() => setCheckoutOpen(true)}
            >
              <span className="relative z-10 flex items-center gap-2 font-semibold text-white text-sm">
                {t('store.buyNow')}
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            </Button>
          </div>

          {/* Hover border gradient */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}40 0%, transparent 50%, ${colors.primary}20 100%)`,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'xor',
              padding: '1px',
            }}
          />
        </div>
      </motion.div>

      <CheckoutDialog tool={tool} open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </motion.div>
  );
};

export default ToolCard;
