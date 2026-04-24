import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, GraduationCap, Briefcase, UserCheck, Lock,
  Zap, CheckCircle, Shield, BookOpen,
  Play, Star, Plus, Minus, Mail,
  ChevronRight, Eye, Rocket, Layers, Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ToolCard, Tool } from '@/components/ToolCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SEO from '@/components/SEO';
import KeywordCluster from '@/components/KeywordCluster';
import SocialProofCarousel from '@/components/SocialProofCarousel';
import TrustBadges from '@/components/TrustBadges';

import { useNewsletterSubscribe } from '@/hooks/useNewsletterSubscribe';
import heroVideo from '@/assets/hero-video.mp4';
import heroImage from '@/assets/hero-ai-models.png';
import chatgptLogo from '@/assets/chatgpt-logo.png';
import midjourneyLogo from '@/assets/midjourney-logo.png';
import claudeLogo from '@/assets/claude-logo.png';
import geminiLogo from '@/assets/gemini-logo.png';
import logo from '@/assets/logo.png';

/* ══════════════════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════════════════ */

const trustBadges = [
  { icon: UserCheck, label: 'No Password Sharing' },
  { icon: Lock, label: 'Secure Checkout' },
  { icon: Layers, label: 'Monthly Only' },
  { icon: Zap, label: 'Fast Activation' },
];

const audiences = [
  {
    icon: GraduationCap,
    title: 'Students',
    headline: 'Study Smarter.',
    lines: ['Research faster.', 'Structure essays better.', 'Use AI responsibly.'],
    gradient: 'from-primary/20 to-secondary/20',
  },
  {
    icon: Rocket,
    title: 'Creators',
    headline: 'Create Faster.',
    lines: ['Generate ideas.', 'Design content.', 'Automate repetitive tasks.'],
    gradient: 'from-secondary/20 to-accent/20',
  },
  {
    icon: Target,
    title: 'Ambitious Professionals',
    headline: 'Work Smarter.',
    lines: ['Boost productivity.', 'Save time.', 'Stay competitive.'],
    gradient: 'from-accent/20 to-primary/20',
  },
];

const steps = [
  { num: '01', title: 'Choose your tool', desc: 'Browse our curated selection of premium AI tools.' },
  { num: '02', title: 'Complete checkout', desc: 'Simple, secure payment — no hidden fees.' },
  { num: '03', title: 'We activate your access', desc: 'Our team sets up your dedicated account.' },
  { num: '04', title: 'View login details', desc: 'Access your credentials in your dashboard.' },
];

const academyPoints = [
  'How to use each tool effectively',
  'How to avoid common mistakes',
  'How to stay responsible and efficient',
];

const testimonials = [
  {
    name: 'Lukas M.',
    role: 'University Student',
    country: 'Germany',
    flag: '🇩🇪',
    quote: 'It saved me hours on my research project. Setup took two minutes.',
    rating: 5,
  },
  {
    name: 'Sara K.',
    role: 'Content Creator',
    country: 'Netherlands',
    flag: '🇳🇱',
    quote: 'Finally a simple way to manage multiple AI tools without juggling subscriptions.',
    rating: 5,
  },
  {
    name: 'Ingrid V.',
    role: 'Parent',
    country: 'Spain',
    flag: '🇪🇸',
    quote: 'I like that it\'s structured and controlled. My daughter uses it safely for school.',
    rating: 5,
  },
];

const faqs = [
  { q: 'Do I need to share my passwords?', a: 'No. We provide secure access after activation. Your personal passwords are never involved.' },
  { q: 'When do I receive login details?', a: 'Usually within a few hours after payment confirmation. You\'ll see them in your dashboard.' },
  { q: 'Is this only for students?', a: 'No. It\'s for anyone serious about growth with AI — students, creators, professionals, and more.' },
  { q: 'Is it monthly?', a: 'Yes. Flexible. Cancel anytime. No annual lock-ins, no questions asked.' },
];

const floatingElements = [
  { icon: chatgptLogo, name: 'ChatGPT', x: '5%', y: '25%', delay: 0, size: 56 },
  { icon: midjourneyLogo, name: 'Midjourney', x: '88%', y: '20%', delay: 0.2, size: 48 },
  { icon: claudeLogo, name: 'Claude', x: '3%', y: '65%', delay: 0.4, size: 44 },
  { icon: geminiLogo, name: 'Gemini', x: '92%', y: '60%', delay: 0.6, size: 52 },
];

/* ══════════════════════════════════════════════════════════════
   FAQ ACCORDION ITEM
   ══════════════════════════════════════════════════════════════ */
const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-sm font-semibold text-foreground pr-4">{q}</span>
        {open ? (
          <Minus className="w-4 h-4 text-primary flex-shrink-0" />
        ) : (
          <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors" />
        )}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="pb-5"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
        </motion.div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ══════════════════════════════════════════════════════════════ */
const Index = () => {
  const { i18n } = useTranslation();
  const newsletter = useNewsletterSubscribe();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const { data: featuredTools = [] } = useQuery({
    queryKey: ['featured-tools-home'],
    queryFn: async () => {
      const { data } = await supabase
        .from('tools')
        .select('*')
        .eq('is_active', true)
        .in('tool_id', ['chatgpt', 'claude', 'gemini', 'midjourney', 'canva', 'perplexity'])
        .limit(6);
      return (data || []) as Tool[];
    },
  });

  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO page="home" jsonLd={{ '@context': 'https://schema.org', '@type': 'Organization', name: 'AI DEALS', url: 'https://aideals.be' }} />
      <Navbar />

      <main>
        {/* ═══════════════ 1) HERO ═══════════════ */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <video autoPlay loop muted playsInline poster={heroImage} className="absolute inset-0 w-full h-full object-cover">
              <source src={heroVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.7) 70%, hsl(var(--background)) 100%)' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)' }} />
          </div>

          {/* Floating Icons */}
          {floatingElements.map((el, i) => (
            <motion.div
              key={el.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + el.delay, duration: 0.5 }}
              className="absolute hidden lg:block z-20"
              style={{ left: el.x, top: el.y }}
            >
              <motion.div animate={{ y: [0, -12, 0], rotate: [0, 3, -3, 0] }} transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}>
                <div className="rounded-2xl p-3 backdrop-blur-xl border border-white/20 shadow-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)' }}>
                  <img src={el.icon} alt={el.name} style={{ width: el.size, height: el.size }} className="object-contain" />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 rounded-full blur-xl opacity-60" style={{ background: 'hsl(var(--primary))' }} />
              </motion.div>
            </motion.div>
          ))}

          <div className="container mx-auto px-4 relative z-10 pt-24">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="mb-6">
                <img src={logo} alt="AI DEALS" className="h-20 md:h-28 w-auto mx-auto drop-shadow-[0_0_40px_rgba(168,85,247,0.6)]" />
              </motion.div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg sm:text-xl md:text-2xl font-display font-semibold tracking-[0.15em] uppercase mb-6"
                style={{ 
                  color: 'rgba(232,212,139,0.9)',
                  textShadow: '0 0 30px rgba(232,212,139,0.3)',
                  letterSpacing: '0.15em',
                }}
              >
                Access. Learn. Scale.
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-6xl font-display font-black mb-5 md:mb-7 leading-[1.05] tracking-tight"
                style={{ textShadow: '0 0 60px hsl(var(--primary) / 0.5), 0 4px 20px rgba(0,0,0,0.8)' }}
              >
                <span className="gradient-text" style={{ filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.5))' }}>
                  Exclusive Access Pricing.
                </span>
                <br />
                <span className="text-white drop-shadow-2xl">Every Month.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-3"
              >
                Premium software access — at platform-level pricing you won't find elsewhere.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-xs sm:text-sm text-white/40 max-w-lg mx-auto mb-8 md:mb-10 tracking-wide"
              >
                Member-based pricing. Structured access. Simplified.
              </motion.p>

              {/* CTAs */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <Button variant="hero" size="xl" className="group min-w-[200px] shadow-2xl" asChild>
                  <Link to="/store">
                    Explore Tools
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="xl" className="backdrop-blur-md bg-white/5 border-white/20 hover:bg-white/10" asChild>
                  <a href="#how-it-works">
                    Learn How It Works
                  </a>
                </Button>
              </motion.div>
              <p className="text-[11px] text-white/45 mb-5">Secure checkout via Stripe. Final payment in EUR.</p>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
              >
                {trustBadges.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Icon className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-white/70">{label}</span>
                  </div>
                ))}
              </motion.div>
              <div className="mt-4">
                <TrustBadges compact />
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute left-1/2 -translate-x-1/2 z-30"
            style={{ bottom: '-8px' }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-medium">Scroll</span>
              <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1.5">
                <motion.div animate={{ height: ['20%', '60%', '20%'] }} transition={{ duration: 2, repeat: Infinity }} className="w-0.5 rounded-full bg-primary/60" />
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <motion.div {...fadeUp} className="text-center mb-10">
              <span className="inline-block text-primary font-semibold mb-4 text-sm uppercase tracking-wider">Customer Proof</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold">Recent buyer <span className="gradient-text">experiences</span></h2>
            </motion.div>
            <SocialProofCarousel />
          </div>
        </section>

        {/* ═══════════════ 2) PROBLEM → SOLUTION ═══════════════ */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div {...fadeUp} className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                  AI Is Powerful. <span className="gradient-text">Access Shouldn't Be Complicated.</span>
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass rounded-3xl p-8 md:p-12"
              >
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <p className="text-lg font-semibold text-foreground">The problem:</p>
                    <div className="space-y-2">
                      {['Too many tools.', 'Too many subscriptions.', 'Too much noise.'].map((line, i) => (
                        <p key={i} className="text-muted-foreground text-base">{line}</p>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-lg font-semibold text-foreground">The solution:</p>
                    <p className="text-primary font-bold text-lg mb-3">AI DEALS simplifies everything.</p>
                    <div className="space-y-3">
                      {[
                        'Curated tools — not a random marketplace',
                        'Clear activation — no guesswork',
                        'Structured learning — use AI effectively',
                        'One platform. Zero friction.',
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="text-foreground text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════ 3) WHO IT'S FOR ═══════════════ */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <motion.div {...fadeUp} className="text-center mb-16">
              <span className="inline-block text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                Built For You
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold">
                Who Uses <span className="gradient-text">AI DEALS</span>?
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {audiences.map((a, i) => {
                const Icon = a.icon;
                return (
                  <motion.div
                    key={a.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 }}
                    className="glass rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 group"
                  >
                    <div className={`bg-gradient-to-br ${a.gradient} p-6 flex items-center gap-4`}>
                      <div className="w-12 h-12 rounded-xl bg-background/30 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">{a.title}</p>
                        <h3 className="text-xl font-display font-bold">{a.headline}</h3>
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      {a.lines.map((line, j) => (
                        <div key={j} className="flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground text-sm">{line}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.p
              {...fadeUp}
              className="text-center text-xs text-muted-foreground mt-8 max-w-md mx-auto flex items-center justify-center gap-2"
            >
              <Shield className="w-3.5 h-3.5 text-primary" />
              Built with responsible use and privacy-first principles.
            </motion.p>
          </div>
        </section>

        {/* ═══════════════ 4) HOW IT WORKS ═══════════════ */}
        <section id="how-it-works" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div {...fadeUp} className="text-center mb-16">
              <span className="inline-block text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                How It Works
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold">
                Simple. Clear. <span className="gradient-text">Done.</span>
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto mb-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-6 text-center hover:border-primary/30 transition-all duration-300 relative"
                >
                  <span
                    className="text-5xl font-display font-black absolute top-4 right-4 opacity-[0.06]"
                    style={{ lineHeight: 1 }}
                  >
                    {step.num}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-display font-bold text-sm">{step.num}</span>
                  </div>
                  <h3 className="font-display font-bold text-sm mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.p
              {...fadeUp}
              className="text-center text-xs text-muted-foreground flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-primary" />
              We never ask for your passwords.
            </motion.p>
          </div>
        </section>

        {/* ═══════════════ 5) FEATURED TOOLS ═══════════════ */}
        {featuredTools.length > 0 && (
          <section className="py-24 relative">
            <div className="container mx-auto px-4">
              <motion.div {...fadeUp} className="text-center mb-12">
                <span className="inline-block text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                  Curated Selection
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                  Top AI Tools. <span className="gradient-text">Zero Noise.</span>
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                  We only list tools that actually deliver value.
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
                {featuredTools.map((tool, i) => (
                  <ToolCard key={tool.id} tool={tool} index={i} />
                ))}
              </div>


              <div className="text-center">
                <Button variant="heroOutline" size="lg" className="group" asChild>
                  <Link to="/store">
                    See All Tools
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════ 6) ACADEMY TEASER ═══════════════ */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto glass rounded-3xl p-8 md:p-14 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10" style={{ background: 'hsl(var(--primary))' }} />

              <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
                    <GraduationCap className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">Academy</span>
                  </div>

                  <h2 className="text-2xl md:text-4xl font-display font-bold mb-4">
                    Don't Just Use AI. <span className="gradient-text">Master It.</span>
                  </h2>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    Access is one thing. Knowing how to use it properly is another.
                  </p>

                  <div className="space-y-3 mb-8">
                    {academyPoints.map((point, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-foreground text-sm">{point}</span>
                      </div>
                    ))}
                  </div>

                  <Button variant="hero" size="lg" className="group" asChild>
                    <Link to="/academy">
                      Enter Academy
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>

                <div className="hidden md:flex flex-col items-center justify-center gap-4">
                  {[
                    { icon: BookOpen, title: 'Tool Guides', tag: 'Practical' },
                    { icon: Play, title: 'Video Lessons', tag: 'Step-by-step' },
                    { icon: Eye, title: 'Best Practices', tag: 'Responsible' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-background/50 border border-border/50"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.tag}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ 7) SOCIAL PROOF ═══════════════ */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <motion.div {...fadeUp} className="text-center mb-12">
              <span className="inline-block text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                Real Feedback
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold">
                Trusted by <span className="gradient-text">Thousands</span>
              </h2>
            </motion.div>

            <SocialProofCarousel />
          </div>
        </section>

        {/* ═══════════════ 8) NEWSLETTER ═══════════════ */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl mx-auto glass rounded-3xl p-8 md:p-12 text-center">
              <motion.div {...fadeUp}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl md:text-4xl font-display font-bold mb-3">
                  Stay Ahead. <span className="gradient-text">Not Overwhelmed.</span>
                </h2>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md mx-auto mb-8">
                  Weekly AI tips, smart workflows, and tool updates.
                </p>
                <form
                  onSubmit={newsletter.subscribe}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={newsletter.email}
                    onChange={(e) => newsletter.setEmail(e.target.value)}
                    className="flex-1 bg-muted/50 border-border h-12 rounded-xl text-sm"
                  />
                  <Button variant="hero" size="lg" type="submit" disabled={newsletter.loading} className="h-12 rounded-xl whitespace-nowrap">
                    <Mail className="w-4 h-4 mr-2" />
                    {newsletter.loading ? 'Joining...' : 'Join Free'}
                  </Button>
                </form>
                <p className="text-[10px] text-muted-foreground/60 mt-4">No spam. Ever.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════ 8.5) WHY OUR PRICING WORKS ═══════════════ */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <motion.div {...fadeUp} className="text-center mb-12">
                <span className="inline-block text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                  Our Model
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                  Why Our Pricing <span className="gradient-text">Works</span>
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass rounded-3xl p-8 md:p-12 space-y-6"
              >
                <p className="text-foreground text-base md:text-lg leading-relaxed">
                  AI DEALS operates on a <span className="font-semibold text-white">managed access model</span>.
                </p>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Instead of traditional retail subscriptions, we provide structured platform-level access. 
                  This allows us to offer exclusive pricing to our members — every month.
                </p>
                <div className="grid sm:grid-cols-3 gap-4 pt-4">
                  {[
                    { icon: Layers, title: 'Structured Access', desc: 'Platform-managed accounts with dedicated support.' },
                    { icon: Shield, title: 'Member Pricing', desc: 'Exclusive rates available only through our platform.' },
                    { icon: Zap, title: 'Monthly Flexibility', desc: 'No annual lock-ins. Scale up or down anytime.' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </section>


        {/* ═══════════════ 9) FAQ ═══════════════ */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <motion.div {...fadeUp} className="text-center mb-12">
              <span className="inline-block text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                Quick Answers
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold">
                Frequently <span className="gradient-text">Asked</span>
              </h2>
            </motion.div>

            <div className="max-w-2xl mx-auto glass rounded-2xl p-6 md:p-8">
              {faqs.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ 10) FINAL CTA ═══════════════ */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative max-w-5xl mx-auto"
            >
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30" />
              </div>

              <div className="relative glass-strong rounded-3xl p-8 md:p-16 text-center overflow-hidden">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                  className="absolute top-10 right-10 w-32 h-32 rounded-full border border-primary/20"
                />
                <motion.div
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                  className="absolute bottom-10 left-10 w-24 h-24 rounded-full border border-secondary/20"
                />

                <div className="relative z-10">
                  <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                    Ready to Use AI <span className="gradient-text">the Smart Way?</span>
                  </h2>
                  <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                    Join thousands of students, creators, and professionals who trust AI DEALS.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button variant="hero" size="xl" className="group" asChild>
                      <Link to="/store">
                        Explore Tools
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <Button variant="heroOutline" size="xl" asChild>
                      <Link to="/academy">
                        Start Learning
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
