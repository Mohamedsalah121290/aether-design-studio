import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CheckoutDialog } from '@/components/CheckoutDialog';

// Import local logos
import perplexityLogo from '@/assets/perplexity-logo.png';
import jasperLogo from '@/assets/jasper-logo.png';
import capcutLogo from '@/assets/capcut-logo.png';
import leonardoLogo from '@/assets/leonardo-logo.png';
import runwayLogo from '@/assets/runway-logo.png';
import elevenlabsLogo from '@/assets/elevenlabs-logo.png';
import murfLogo from '@/assets/murf-logo.png';
import adobeLogo from '@/assets/adobe-logo.png';
import chatgptLogo from '@/assets/chatgpt-logo.png';
import claudeLogo from '@/assets/claude-logo.png';
import geminiLogo from '@/assets/gemini-logo.png';
import midjourneyLogo from '@/assets/midjourney-logo.png';

// Official brand logos - all using local high-resolution files
const toolLogos: Record<string, string> = {
  'chatgpt': chatgptLogo,
  'claude': claudeLogo,
  'gemini': geminiLogo,
  'perplexity': perplexityLogo,
  'jasper': jasperLogo,
  'midjourney': midjourneyLogo,
  'leonardo': leonardoLogo,
  'capcut': capcutLogo,
  'runway': runwayLogo,
  'elevenlabs': elevenlabsLogo,
  'murf': murfLogo,
  'claude-code': claudeLogo,
  'adobe': adobeLogo,
  'windows': 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Windows_logo_-_2012.svg'
};

// Brand colors for each tool (kept for glow effects)
const toolColors: Record<string, {
  primary: string;
  glow: string;
}> = {
  'chatgpt': {
    primary: '#10a37f',
    glow: '160 84% 40%'
  },
  'claude': {
    primary: '#cc785c',
    glow: '20 55% 58%'
  },
  'gemini': {
    primary: '#4285f4',
    glow: '217 89% 61%'
  },
  'perplexity': {
    primary: '#20808d',
    glow: '187 63% 34%'
  },
  'jasper': {
    primary: '#ff5c5c',
    glow: '0 100% 68%'
  },
  'midjourney': {
    primary: '#000000',
    glow: '0 0% 30%'
  },
  'leonardo': {
    primary: '#8b5cf6',
    glow: '258 90% 66%'
  },
  'capcut': {
    primary: '#00f0ff',
    glow: '184 100% 50%'
  },
  'runway': {
    primary: '#ff2d55',
    glow: '349 100% 59%'
  },
  'elevenlabs': {
    primary: '#000000',
    glow: '0 0% 40%'
  },
  'murf': {
    primary: '#6366f1',
    glow: '239 84% 67%'
  },
  'claude-code': {
    primary: '#ff6b35',
    glow: '18 100% 60%'
  },
  'adobe': {
    primary: '#ff0000',
    glow: '0 100% 50%'
  },
  'windows': {
    primary: '#0078d4',
    glow: '206 100% 42%'
  }
};
export interface Tool {
  id: string;
  name: string;
  price: number;
  category: 'text' | 'image' | 'video' | 'coding';
}
interface ToolCardProps {
  tool: Tool;
  index: number;
}
export const ToolCard = ({
  tool,
  index
}: ToolCardProps) => {
  const {
    t
  } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Mouse position for 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animations
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
    stiffness: 300,
    damping: 30
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), {
    stiffness: 300,
    damping: 30
  });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };
  const logoUrl = toolLogos[tool.id];
  const colors = toolColors[tool.id] || {
    primary: '#a855f7',
    glow: '270 85% 65%'
  };
  return <motion.div initial={{
    opacity: 0,
    y: 30
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay: index * 0.05
  }} className="perspective-1000">
      <motion.div ref={cardRef} onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovered(true)} onMouseLeave={handleMouseLeave} style={{
      rotateX,
      rotateY,
      transformStyle: 'preserve-3d'
    }} className="relative group cursor-pointer">
        {/* Dynamic Glow Effect */}
        <motion.div animate={{
        opacity: isHovered ? 0.6 : 0.2,
        scale: isHovered ? 1.05 : 1
      }} transition={{
        duration: 0.3
      }} className="absolute -inset-1 rounded-3xl blur-xl" style={{
        background: `radial-gradient(ellipse at center, hsl(${colors.glow} / 0.5) 0%, transparent 70%)`
      }} />

        {/* Card Container */}
        <div className="relative rounded-3xl overflow-hidden backdrop-blur-xl border border-white/10" style={{
        background: 'linear-gradient(135deg, hsl(222 47% 11% / 0.9) 0%, hsl(222 47% 8% / 0.95) 100%)',
        boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(255, 255, 255, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              inset 0 -1px 0 rgba(0, 0, 0, 0.2)
            `,
        transform: 'translateZ(0)'
      }}>
          {/* Top Shine Effect */}
          <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{
          background: `linear-gradient(180deg, ${colors.primary}15 0%, transparent 100%)`
        }} />

          {/* Content */}
          <div className="relative p-6 flex flex-col h-full" style={{
          transform: 'translateZ(20px)'
        }}>
            {/* 3D Floating Logo */}
            <div className="mb-6 relative">
              {/* Logo Shadow */}
              <motion.div animate={{
              y: isHovered ? 8 : 4,
              opacity: isHovered ? 0.4 : 0.2,
              scale: isHovered ? 0.9 : 0.95
            }} className="absolute left-0 top-2 w-24 h-24 rounded-2xl blur-lg" style={{
              background: colors.primary
            }} />
              
              {/* Logo Container with Glassmorphism */}
              <motion.div animate={{
              y: isHovered ? -8 : 0,
              scale: isHovered ? 1.1 : 1
            }} transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20
            }} className="relative w-24 h-24 rounded-2xl flex items-center justify-center overflow-hidden" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(10px)',
              boxShadow: `
                    0 10px 40px ${colors.primary}40,
                    0 0 0 1px rgba(255,255,255,0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2),
                    inset 0 -2px 0 rgba(0, 0, 0, 0.1)
                  `
            }}>
                {/* Official Brand Logo */}
                {logoUrl && !logoError ? <img src={logoUrl} alt={`${tool.name} logo`} className={`w-16 h-16 object-contain transition-opacity duration-300 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setLogoLoaded(true)} onError={() => setLogoError(true)} loading="lazy" /> : null}
                
                {/* Fallback: Show first letter if logo fails */}
                {(!logoUrl || logoError || !logoLoaded) && <span className="text-2xl font-bold text-white" style={{
                textShadow: `0 2px 10px ${colors.primary}`
              }}>
                    {tool.name.charAt(0)}
                  </span>}
                
                {/* Glow ring around logo */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
                boxShadow: `inset 0 0 20px ${colors.primary}30`
              }} />
              </motion.div>
            </div>

            {/* Tool Name */}
            <h3 className="text-xl font-display font-bold mb-2 text-foreground">
              {tool.name}
            </h3>

            {/* Monthly Access Label */}
            <span className="text-xs text-muted-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{
              background: colors.primary
            }} />
              {t('store.monthlyAccess')}
            </span>

            {/* Price */}
            <div className="mt-auto mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-display font-bold" style={{
                color: colors.primary
              }}>
                  ${tool.price}
                </span>
                <span className="text-sm text-muted-foreground">{t('store.perMonth')}</span>
              </div>
            </div>

            {/* Buy Now Button */}
            <Button 
              className="w-full relative overflow-hidden group/btn" 
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}cc 100%)`,
                border: 'none'
              }}
              onClick={() => setCheckoutOpen(true)}
            >
              <span className="relative z-10 flex items-center gap-2 font-semibold text-white">
                {t('store.buyNow')}
                <Sparkles className="w-4 h-4" />
              </span>
              <motion.div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity" style={{
                background: `linear-gradient(135deg, ${colors.primary}ee 0%, ${colors.primary} 100%)`
              }} />
            </Button>
          </div>

          {/* Animated Border Gradient on Hover */}
          <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: isHovered ? 1 : 0
          }} className="absolute inset-0 rounded-3xl pointer-events-none" style={{
            background: `linear-gradient(135deg, ${colors.primary}40 0%, transparent 50%, ${colors.primary}20 100%)`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            padding: '1px'
          }} />
        </div>
      </motion.div>

      {/* Checkout Dialog */}
      <CheckoutDialog 
        tool={tool} 
        open={checkoutOpen} 
        onOpenChange={setCheckoutOpen} 
      />
    </motion.div>;
};
export default ToolCard;