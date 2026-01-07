import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef, useEffect, useState } from 'react';
import heroImage from '@/assets/hero-ai-models.png';
import chatgptLogo from '@/assets/chatgpt-logo.png';
import midjourneyLogo from '@/assets/midjourney-logo.png';
import claudeLogo from '@/assets/claude-logo.png';
import geminiLogo from '@/assets/gemini-logo.png';

const Hero = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Mouse position for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Transform for parallax effect
  const rotateX = useTransform(y, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-5, 5]);
  const translateX = useTransform(x, [-0.5, 0.5], [-20, 20]);
  const translateY = useTransform(y, [-0.5, 0.5], [-10, 10]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background base */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Hero Image with Parallax */}
      <motion.div
        style={!isMobile ? { 
          rotateX, 
          rotateY,
          x: translateX,
          y: translateY,
        } : {}}
        className="absolute inset-0 perspective-1000 preserve-3d"
      >
        <div className="absolute inset-0 flex items-end md:items-center justify-center">
          <div className="relative w-full h-[70vh] md:h-[85vh] max-w-6xl mx-auto">
            {/* The Hero Image */}
            <img
              src={heroImage}
              alt="AI Deals Team"
              className="w-full h-full object-contain object-bottom md:object-center"
            />
            
            {/* Gradient Overlays for seamless blending */}
            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-background via-background/80 to-transparent" />
            {/* Left fade */}
            <div className="absolute top-0 bottom-0 left-0 w-[25%] bg-gradient-to-r from-background via-background/60 to-transparent" />
            {/* Right fade */}
            <div className="absolute top-0 bottom-0 right-0 w-[25%] bg-gradient-to-l from-background via-background/60 to-transparent" />
            {/* Top subtle fade */}
            <div className="absolute top-0 left-0 right-0 h-[20%] bg-gradient-to-b from-background/50 to-transparent" />
          </div>
        </div>
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

      {/* Hero Content Overlay */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 backdrop-blur-sm">
              <Shield className="w-4 h-4" />
              {t('hero.badge')}
            </span>
          </motion.div>

          {/* Main Title with Glow Effect */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-black mb-4 md:mb-6 leading-[0.95] tracking-tight"
            style={{
              textShadow: '0 0 40px hsl(var(--primary) / 0.4), 0 0 80px hsl(var(--primary) / 0.2)',
            }}
          >
            <span className="text-foreground drop-shadow-lg">{t('hero.title')}</span>{' '}
            <span 
              className="gradient-text"
              style={{
                textShadow: '0 0 60px hsl(var(--primary) / 0.6)',
              }}
            >
              {t('hero.titleHighlight')}
            </span>
          </motion.h1>

          {/* Subtitle with Glass Background */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 md:mb-10"
          >
            <p 
              className="text-lg sm:text-xl md:text-2xl text-foreground/90 max-w-2xl mx-auto leading-relaxed px-4 py-3 rounded-2xl backdrop-blur-sm"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--background) / 0.6) 0%, hsl(var(--background) / 0.3) 100%)',
                textShadow: '0 2px 10px hsl(var(--background))',
              }}
            >
              {t('hero.description')}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
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
              className="backdrop-blur-sm"
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
            className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-2 backdrop-blur-sm"
          >
            <motion.div
              animate={{ height: ['20%', '60%', '20%'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 rounded-full bg-primary"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
