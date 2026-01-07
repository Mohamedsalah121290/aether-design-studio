import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef, useEffect, useState } from 'react';
import heroVideo from '@/assets/hero-video.mp4';
import heroImage from '@/assets/hero-ai-models.png';
import chatgptLogo from '@/assets/chatgpt-logo.png';
import midjourneyLogo from '@/assets/midjourney-logo.png';
import claudeLogo from '@/assets/claude-logo.png';
import geminiLogo from '@/assets/gemini-logo.png';
import logo from '@/assets/logo.png';

const Hero = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Scroll-based parallax
  const { scrollY } = useScroll();
  const videoY = useTransform(scrollY, [0, 500], [0, 150]);
  const contentY = useTransform(scrollY, [0, 500], [0, 50]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Floating glass elements with tool icons
  const floatingElements = [
    { icon: chatgptLogo, name: 'ChatGPT', x: '5%', y: '25%', delay: 0, size: 56 },
    { icon: midjourneyLogo, name: 'Midjourney', x: '88%', y: '20%', delay: 0.2, size: 48 },
    { icon: claudeLogo, name: 'Claude', x: '3%', y: '65%', delay: 0.4, size: 44 },
    { icon: geminiLogo, name: 'Gemini', x: '92%', y: '60%', delay: 0.6, size: 52 },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Video Background with Parallax */}
      <motion.div
        style={{ y: isMobile ? 0 : videoY }}
        className="absolute inset-0 w-full h-full"
      >
        {/* The Video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster={heroImage}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Vignette & Gradient Overlay - The "Sleek" Visual Blend */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(to bottom, 
                rgba(0,0,0,0.2) 0%, 
                rgba(0,0,0,0.4) 40%,
                rgba(0,0,0,0.6) 70%, 
                hsl(var(--background)) 100%
              )
            `,
          }}
        />
        
        {/* Side vignettes for extra depth */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at center, 
                transparent 40%, 
                rgba(0,0,0,0.5) 100%
              )
            `,
          }}
        />
      </motion.div>

      {/* Floating Glass Elements */}
      {floatingElements.map((element, i) => (
        <motion.div
          key={element.name}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 + element.delay, duration: 0.5 }}
          className="absolute hidden lg:block z-20"
          style={{ left: element.x, top: element.y }}
        >
          <motion.div
            animate={{ 
              y: [0, -12, 0],
              rotate: [0, 3, -3, 0],
            }}
            transition={{ 
              duration: 4 + i * 0.5, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
          >
            {/* Glassmorphism container */}
            <div 
              className="rounded-2xl p-3 backdrop-blur-xl border border-white/20 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
            >
              <img 
                src={element.icon} 
                alt={element.name}
                style={{ width: element.size, height: element.size }}
                className="object-contain"
              />
            </div>
            {/* Glow effect under icon */}
            <div 
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 rounded-full blur-xl opacity-60"
              style={{ background: 'hsl(var(--primary))' }}
            />
          </motion.div>
        </motion.div>
      ))}

      {/* Hero Content Overlay with Parallax */}
      <motion.div 
        style={{ y: isMobile ? 0 : contentY }}
        className="container mx-auto px-4 relative z-10 pt-24"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* AI DEALS Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <img 
              src={logo} 
              alt="AI DEALS" 
              className="h-24 md:h-32 w-auto mx-auto drop-shadow-[0_0_40px_rgba(168,85,247,0.6)]"
            />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-primary text-sm font-medium mb-6 backdrop-blur-md"
              style={{
                background: 'linear-gradient(135deg, rgba(168,85,247,0.2) 0%, rgba(168,85,247,0.05) 100%)',
                boxShadow: '0 4px 24px rgba(168,85,247,0.2)',
              }}
            >
              <Shield className="w-4 h-4" />
              {t('hero.badge')}
            </span>
          </motion.div>

          {/* Main Title with Glow Effect */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-black mb-4 md:mb-6 leading-[0.95] tracking-tight"
            style={{
              textShadow: '0 0 60px hsl(var(--primary) / 0.5), 0 0 120px hsl(var(--primary) / 0.3), 0 4px 20px rgba(0,0,0,0.8)',
            }}
          >
            <span className="text-white drop-shadow-2xl">{t('hero.title')}</span>{' '}
            <span 
              className="gradient-text"
              style={{
                textShadow: '0 0 80px hsl(var(--primary) / 0.8)',
                filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.5))',
              }}
            >
              {t('hero.titleHighlight')}
            </span>
          </motion.h1>

          {/* Subtitle with Glass Background */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8 md:mb-10"
          >
            <p 
              className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed px-6 py-4 rounded-2xl backdrop-blur-md border border-white/10"
              style={{
                background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              }}
            >
              {t('hero.description')}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 md:mb-16"
          >
            <Button variant="hero" size="xl" className="group min-w-[200px] shadow-2xl" asChild>
              <a href="#store">
                {t('hero.cta')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button 
              variant="heroOutline" 
              size="xl" 
              className="backdrop-blur-md bg-white/5 border-white/20 hover:bg-white/10"
              asChild
            >
              <a href="/dashboard">
                {t('hero.ctaSecondary')}
              </a>
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2 backdrop-blur-sm"
          >
            <motion.div
              animate={{ height: ['20%', '60%', '20%'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 rounded-full bg-primary"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
