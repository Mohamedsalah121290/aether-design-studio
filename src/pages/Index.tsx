import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowRight, GraduationCap, Briefcase, ShieldCheck, UserCheck, Lock,
  Zap, Calendar, Headphones, CheckCircle, Sparkles, Palette, Shield,
  Users, ChevronDown, BookOpen, Play, Star, Globe, FileCheck,
  Video, Award, Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ToolCard, Tool } from '@/components/ToolCard';
import Navbar from '@/components/Navbar';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import heroVideo from '@/assets/hero-video.mp4';
import heroImage from '@/assets/hero-ai-models.png';
import chatgptLogo from '@/assets/chatgpt-logo.png';
import midjourneyLogo from '@/assets/midjourney-logo.png';
import claudeLogo from '@/assets/claude-logo.png';
import geminiLogo from '@/assets/gemini-logo.png';
import logo from '@/assets/logo.png';

/* ── GDPR Trust Badges ─────────────────────────────────────── */
const trustBadges = [
  { icon: Shield, label: 'GDPR Compliant' },
  { icon: FileCheck, label: 'Verified Tools' },
  { icon: Lock, label: 'EU Data Privacy' },
  { icon: Globe, label: 'Made for Europe' },
];

/* ── Audience Cards ────────────────────────────────────────── */
const audiences = [
  {
    icon: GraduationCap,
    title: 'Students',
    gradient: 'from-primary/20 to-secondary/20',
    benefits: [
      'Write better essays & research papers with AI assistants',
      'Generate visuals for projects & presentations instantly',
      'Learn faster with personalized AI tutors & summaries',
    ],
  },
  {
    icon: Briefcase,
    title: 'Creators & Marketers',
    gradient: 'from-secondary/20 to-accent/20',
    benefits: [
      'Create stunning visuals, videos & copy in minutes',
      'Scale content production without hiring more people',
      'Access premium tools at a fraction of direct cost',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Parents',
    gradient: 'from-accent/20 to-primary/20',
    benefits: [
      'No credit card or password sharing needed for your child',
      'Every tool is vetted for safety & age-appropriateness',
      'Full control — cancel anytime, no hidden charges',
    ],
  },
];

/* ── Why AI DEALS ──────────────────────────────────────────── */
const whyUs = [
  { icon: UserCheck, title: 'We Provide the Account', desc: 'We create & manage the subscription for you — no setup hassle.' },
  { icon: Lock, title: 'No Password Sharing', desc: 'Your credentials stay private. We handle everything internally.' },
  { icon: Zap, title: 'Fast Activation', desc: 'Get access within 1–6 hours after purchase. No waiting days.' },
  { icon: Calendar, title: 'Monthly Only', desc: 'Pay month-to-month. No annual lock-ins, cancel whenever you want.' },
  { icon: Headphones, title: 'Dedicated Support', desc: '24/7 support team ready to help with any tool or account issue.' },
];

/* ── Academy Preview ───────────────────────────────────────── */
const academyTracks = [
  { icon: BookOpen, title: 'AI Basics', desc: 'Understand prompts, models, and how AI really works.', tag: 'Beginner' },
  { icon: GraduationCap, title: 'Study with AI', desc: 'Use ChatGPT & Claude to ace exams and research.', tag: 'Students' },
  { icon: Palette, title: 'Creator Toolkit', desc: 'Master Midjourney, Runway, and visual AI tools.', tag: 'Creators' },
];

/* ── Video Testimonials ────────────────────────────────────── */
const testimonials = [
  { name: 'Sophie L.', role: 'University Student, Brussels', quote: 'AI DEALS made it so easy to access ChatGPT for my thesis. No setup, no stress — just instant access.', rating: 5 },
  { name: 'Marco D.', role: 'Freelance Designer, Milan', quote: 'I use Midjourney daily through AI DEALS. The price is unbeatable and support is always responsive.', rating: 5 },
  { name: 'Anne V.', role: 'Parent, Amsterdam', quote: 'Finally a platform I trust for my teenager. No password sharing, fully managed — exactly what parents need.', rating: 5 },
];

/* ── Floating Icons ────────────────────────────────────────── */
const floatingElements = [
  { icon: chatgptLogo, name: 'ChatGPT', x: '5%', y: '25%', delay: 0, size: 56 },
  { icon: midjourneyLogo, name: 'Midjourney', x: '88%', y: '20%', delay: 0.2, size: 48 },
  { icon: claudeLogo, name: 'Claude', x: '3%', y: '65%', delay: 0.4, size: 44 },
  { icon: geminiLogo, name: 'Gemini', x: '92%', y: '60%', delay: 0.6, size: 52 },
];

const Index = () => {
  const { i18n } = useTranslation();

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
      <Navbar />

      <main>
        {/* ═══════════════════ HERO ═══════════════════ */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 w-full h-full">
            <video autoPlay loop muted playsInline poster={heroImage} className="absolute inset-0 w-full h-full object-cover">
              <source src={heroVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.6) 70%, hsl(var(--background)) 100%)' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)' }} />
          </div>

          {/* Floating Glass Icons */}
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

          {/* Hero Content */}
          <div className="container mx-auto px-4 relative z-10 pt-24">
            <div className="max-w-4xl mx-auto text-center">
              {/* Logo */}
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="mb-6">
                <img src={logo} alt="AI DEALS" className="h-24 md:h-32 w-auto mx-auto drop-shadow-[0_0_40px_rgba(168,85,247,0.6)]" />
              </motion.div>

              {/* Badge */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-primary text-sm font-medium mb-6 backdrop-blur-md" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.2) 0%, rgba(168,85,247,0.05) 100%)', boxShadow: '0 4px 24px rgba(168,85,247,0.2)' }}>
                  <Shield className="w-4 h-4" />
                  Curated. Safe. For Europe's Next Generation.
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl sm:text-5xl md:text-7xl font-display font-black mb-4 md:mb-6 leading-[0.95] tracking-tight"
                style={{ textShadow: '0 0 60px hsl(var(--primary) / 0.5), 0 4px 20px rgba(0,0,0,0.8)' }}
              >
                <span className="text-white drop-shadow-2xl">AI Tools. Curated. Safe.</span>
                <br />
                <span className="gradient-text" style={{ filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.5))' }}>
                  For Europe's Next Generation.
                </span>
              </motion.h1>

              {/* Subtext */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mb-8 md:mb-10">
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed px-6 py-4 rounded-2xl backdrop-blur-md border border-white/10" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)' }}>
                  Premium AI access + a learning academy — built for European students and creators who value privacy, trust, and simplicity.
                </p>
              </motion.div>

              {/* CTAs */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Button variant="hero" size="xl" className="group min-w-[200px] shadow-2xl" asChild>
                  <a href="/store">
                    Explore Tools
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
                <Button variant="heroOutline" size="xl" className="backdrop-blur-md bg-white/5 border-white/20 hover:bg-white/10" asChild>
                  <a href="#how-it-works">
                    Learn How It Works
                    <ChevronDown className="ml-2 w-5 h-5" />
                  </a>
                </Button>
              </motion.div>

              {/* GDPR Trust Strip */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex flex-wrap items-center justify-center gap-4 md:gap-6"
              >
                {trustBadges.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Icon className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-white/70">{label}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Scroll Indicator — pinned at very bottom of hero */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30"
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

        {/* ═══════════════════ WHO IT'S FOR ═══════════════════ */}
        <section id="how-it-works" className="py-24 relative">
          <div className="container mx-auto px-4">
            <motion.div {...fadeUp} className="text-center mb-16">
              <span className="inline-block text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                Who Is It For?
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                Built for <span className="gradient-text">Everyone Who Creates</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Whether you're studying, building a brand, or keeping your kids safe online — we've got you covered.
              </p>
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
                      <h3 className="text-xl font-display font-bold">{a.title}</h3>
                    </div>
                    <div className="p-6 space-y-4">
                      {a.benefits.map((b, j) => (
                        <div key={j} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground text-sm leading-relaxed">{b}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════ WHY AI DEALS ═══════════════════ */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div {...fadeUp} className="text-center mb-16">
              <span className="inline-block text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                Trust-First Architecture
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                Why Choose <span className="gradient-text">AI DEALS</span>?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                We remove every barrier between you and premium AI tools — with European privacy standards at the core.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 max-w-6xl mx-auto">
              {whyUs.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="glass rounded-2xl p-6 text-center hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-sm mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════ FEATURED TOOLS ═══════════════════ */}
        {featuredTools.length > 0 && (
          <section className="py-24 relative">
            <div className="container mx-auto px-4">
              <motion.div {...fadeUp} className="text-center mb-12">
                <span className="inline-block text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                  Curated Selection
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                  Featured <span className="gradient-text">AI Tools</span>
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                  Hand-picked, verified tools trusted by European students & creators.
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
                {featuredTools.map((tool, i) => (
                  <ToolCard key={tool.id} tool={tool} index={i} />
                ))}
              </div>

              <div className="text-center">
                <Button variant="heroOutline" size="lg" className="group" asChild>
                  <a href="/store">
                    Browse All Tools
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════ ACADEMY PREVIEW ═══════════════════ */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div {...fadeUp} className="text-center mb-12">
              <span className="inline-block text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                Learn & Grow
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                AI <span className="gradient-text">Academy</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                Structured learning tracks to master AI tools — from basics to advanced creator workflows.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
              {academyTracks.map((track, i) => {
                const Icon = track.icon;
                return (
                  <motion.div
                    key={track.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden"
                  >
                    {/* Lock overlay hint */}
                    <div className="absolute top-4 right-4">
                      <span className="text-[10px] px-2 py-1 rounded-full bg-primary/20 text-primary font-medium border border-primary/20">
                        {track.tag}
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-display font-bold mb-2">{track.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{track.desc}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Video className="w-3.5 h-3.5" />
                      <span>Video lessons included</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center">
              <Button variant="heroOutline" size="lg" className="group" asChild>
                <a href="/academy">
                  Explore Academy
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <motion.div {...fadeUp} className="text-center mb-12">
              <span className="inline-block text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                Trusted Across Europe
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                What Our <span className="gradient-text">Community Says</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                Real feedback from students, creators, and parents who use AI DEALS daily.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 relative"
                >
                  {/* Play icon overlay */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 text-primary fill-primary" />
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-foreground text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{t.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="text-sm font-display font-bold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ PARENTS TRUST ═══════════════════ */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto glass rounded-3xl p-8 md:p-12 text-center">
              <motion.div {...fadeUp}>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl md:text-4xl font-display font-bold mb-4 leading-tight">
                  Parents: Your Child Is <span className="gradient-text">Safe With Us</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto mb-6">
                  We handle everything — account creation, billing, and security — so your child can focus on learning and creating.
                  No shared passwords, no surprise charges, and every tool is reviewed for age-appropriateness.
                  Built with European data privacy standards. You stay in control at all times.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                  {['GDPR Compliant', 'No Data Sharing', 'Parental Control', 'EU Based'].map(tag => (
                    <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <Button variant="heroOutline" size="lg" className="group" asChild>
                  <a href="/about">
                    Learn More About Our Safety
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ FINAL CTA ═══════════════════ */}
        <CTA />
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
