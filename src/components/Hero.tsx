import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Play, Zap, Shield, TrendingUp, Brain, Sparkles, Bot, Cpu, Code, MessageSquare, Wand2, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Floating 3D icon configuration
const floatingIcons = [
  { Icon: Brain, x: '10%', y: '20%', size: 48, delay: 0, parallaxFactor: 30 },
  { Icon: Sparkles, x: '85%', y: '15%', size: 36, delay: 0.5, parallaxFactor: 25 },
  { Icon: Bot, x: '5%', y: '60%', size: 40, delay: 1, parallaxFactor: 35 },
  { Icon: Cpu, x: '90%', y: '55%', size: 44, delay: 0.3, parallaxFactor: 28 },
  { Icon: Code, x: '15%', y: '80%', size: 32, delay: 0.7, parallaxFactor: 20 },
  { Icon: MessageSquare, x: '80%', y: '75%', size: 38, delay: 1.2, parallaxFactor: 32 },
  { Icon: Wand2, x: '25%', y: '10%', size: 34, delay: 0.2, parallaxFactor: 22 },
  { Icon: Lightbulb, x: '75%', y: '35%', size: 42, delay: 0.8, parallaxFactor: 26 },
];

const Hero = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const stats = [
    { value: '50K+', label: t('hero.stats.users'), icon: Zap },
    { value: '99.9%', label: t('hero.stats.accuracy'), icon: TrendingUp },
    { value: '99.99%', label: t('hero.stats.uptime'), icon: Shield },
  ];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center overflow-hidden mesh-gradient pt-20"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-tr from-secondary/20 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 100, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
        />
      </div>

      {/* Floating 3D AI Tool Icons with Parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingIcons.map((item, index) => {
          const { Icon, x, y, size, delay, parallaxFactor } = item;
          const iconX = useTransform(mouseX, [-0.5, 0.5], [-parallaxFactor, parallaxFactor]);
          const iconY = useTransform(mouseY, [-0.5, 0.5], [-parallaxFactor, parallaxFactor]);
          const springX = useSpring(iconX, { stiffness: 100, damping: 20 });
          const springY = useSpring(iconY, { stiffness: 100, damping: 20 });

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -15, 0],
              }}
              transition={{
                opacity: { duration: 0.5, delay: delay + 0.5 },
                scale: { duration: 0.5, delay: delay + 0.5, type: 'spring' },
                y: { duration: 4 + index * 0.5, repeat: Infinity, ease: 'easeInOut', delay: delay },
              }}
              style={{
                left: x,
                top: y,
                x: springX,
                y: springY,
              }}
              className="absolute"
            >
              <div className="relative group">
                {/* Glow effect behind icon */}
                <div 
                  className="absolute inset-0 rounded-full blur-xl opacity-60"
                  style={{
                    background: `radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)`,
                    transform: 'scale(2)',
                  }}
                />
                {/* Glass container */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative glass-strong rounded-2xl p-3 sm:p-4 border border-primary/20 shadow-lg"
                  style={{
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Icon 
                    size={size} 
                    className="text-primary drop-shadow-lg"
                    strokeWidth={1.5}
                  />
                </motion.div>
              </div>
            </motion.div>
          );
        })}

        {/* Central AI Brain with enhanced 3D effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
          style={{
            x: useSpring(useTransform(mouseX, [-0.5, 0.5], [-40, 40]), { stiffness: 80, damping: 25 }),
            y: useSpring(useTransform(mouseY, [-0.5, 0.5], [-40, 40]), { stiffness: 80, damping: 25 }),
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block"
        >
          <motion.div
            animate={{
              rotateY: [0, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="relative"
          >
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30 animate-[spin_20s_linear_infinite]" style={{ width: '280px', height: '280px', marginLeft: '-140px', marginTop: '-140px' }} />
            
            {/* Middle ring */}
            <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_15s_linear_infinite_reverse]" style={{ width: '220px', height: '220px', marginLeft: '-110px', marginTop: '-110px' }} />
            
            {/* Inner glow */}
            <div 
              className="absolute rounded-full blur-3xl opacity-40"
              style={{
                width: '200px',
                height: '200px',
                marginLeft: '-100px',
                marginTop: '-100px',
                background: 'radial-gradient(circle, hsl(var(--primary)) 0%, hsl(var(--secondary)) 50%, transparent 70%)',
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{t('hero.badge')}</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6"
          >
            {t('hero.title')}{' '}
            <span className="gradient-text">{t('hero.titleHighlight')}</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            {t('hero.description')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button variant="hero" size="xl" className="group w-full sm:w-auto">
              {t('hero.cta')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="heroOutline" size="xl" className="group w-full sm:w-auto">
              <Play className="w-5 h-5" />
              {t('hero.ctaSecondary')}
            </Button>
          </motion.div>

          {/* 3D Floating Card */}
          <motion.div
            style={{ rotateX, rotateY }}
            className="perspective-1000 preserve-3d"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative glass-strong rounded-3xl p-1 mx-auto max-w-4xl overflow-hidden"
            >
              {/* Gradient Border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/50 via-secondary/50 to-accent/50 opacity-50" />
              
              <div className="relative bg-card/80 rounded-[22px] p-8 backdrop-blur-xl">
                {/* Dashboard Preview */}
                <div className="aspect-video rounded-xl bg-gradient-to-br from-muted/50 to-background overflow-hidden relative">
                  {/* Mock Dashboard UI */}
                  <div className="absolute inset-4 flex gap-4">
                    {/* Sidebar */}
                    <div className="w-16 glass rounded-xl hidden sm:block" />
                    
                    {/* Main Content */}
                    <div className="flex-1 flex flex-col gap-4">
                      {/* Header */}
                      <div className="h-10 glass rounded-xl flex items-center px-4">
                        <div className="w-20 h-3 bg-muted-foreground/20 rounded" />
                      </div>
                      
                      {/* Stats Cards */}
                      <div className="grid grid-cols-3 gap-4 flex-1">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                          className="glass rounded-xl p-4 flex flex-col justify-between"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold gradient-text">2.4K</div>
                            <div className="text-xs text-muted-foreground">Tasks</div>
                          </div>
                        </motion.div>
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
                          className="glass rounded-xl p-4 flex flex-col justify-between"
                        >
                          <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-secondary" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold gradient-text-accent">89%</div>
                            <div className="text-xs text-muted-foreground">Growth</div>
                          </div>
                        </motion.div>
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
                          className="glass rounded-xl p-4 flex flex-col justify-between"
                        >
                          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-accent" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold">100%</div>
                            <div className="text-xs text-muted-foreground">Secure</div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;