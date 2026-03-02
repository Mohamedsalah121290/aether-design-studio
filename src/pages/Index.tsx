import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowRight, GraduationCap, Briefcase, ShieldCheck, UserCheck, Lock,
  Zap, Calendar, Headphones, CheckCircle, Shield, ChevronDown, BookOpen,
  Play, Star, Globe, FileCheck, Video, Palette, Mail, Users,
  ChevronRight, Plus, Minus, Award, CreditCard, Clock, Heart, Eye,
  MapPin, Flag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ToolCard, Tool } from '@/components/ToolCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
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
  { icon: Shield, label: 'GDPR-First Privacy' },
  { icon: Lock, label: 'Secure Checkout' },
  { icon: UserCheck, label: 'No Password Sharing' },
  { icon: Calendar, label: 'Monthly Flexible Access' },
  { icon: Globe, label: 'Global Access' },
];

const audiences = [
  {
    icon: GraduationCap,
    title: 'Students',
    gradient: 'from-primary/20 to-secondary/20',
    benefits: [
      'Study smarter with AI-powered research & summaries',
      'Research faster — find sources and insights in seconds',
      'Write better essays with intelligent writing assistants',
    ],
  },
  {
    icon: Briefcase,
    title: 'Creators & Marketers',
    gradient: 'from-secondary/20 to-accent/20',
    benefits: [
      'Create content at scale — visuals, copy, and video',
      'Automate repetitive tasks and workflows',
      'Design & produce like a team of ten, solo',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Parents',
    gradient: 'from-accent/20 to-primary/20',
    benefits: [
      'Safe, supervised AI access for your child',
      'No password or credit card sharing — ever',
      'Monthly control — cancel anytime, no surprises',
    ],
  },
];

const whyUs = [
  { icon: UserCheck, title: 'We Provide the Account', desc: 'We create & manage the subscription — zero setup on your end.' },
  { icon: Lock, title: 'No Password Sharing', desc: 'Your credentials stay private. We handle everything internally.' },
  { icon: FileCheck, title: 'Verified & Curated', desc: 'Every tool is manually reviewed for quality, safety, and value.' },
  { icon: Zap, title: 'Fast Activation', desc: 'Get access within 1–6 hours. No waiting days for approval.' },
  { icon: Calendar, title: 'Monthly — No Lock-in', desc: 'Pay month-to-month. Cancel whenever you want, no questions.' },
  { icon: BookOpen, title: 'Educational Guidance', desc: 'Academy lessons included — learn to use every tool effectively.' },
];

const privacyPillars = [
  { icon: Shield, title: 'GDPR Principles', desc: 'We follow European GDPR principles in everything we do — data minimisation, purpose limitation, and transparency.' },
  { icon: Lock, title: 'No Passwords Required', desc: 'We never ask for your personal passwords. All tool accounts are managed internally by our team.' },
  { icon: Eye, title: 'Minimal Data Collection', desc: 'We only collect what\'s necessary for service delivery — your email for activation, nothing more.' },
  { icon: Shield, title: 'Secure Processing', desc: 'All data is encrypted in transit and at rest. We use industry-standard security protocols.' },
];

const academyTracks = [
  { icon: BookOpen, title: 'AI Basics', desc: 'Understand prompts, models, and how AI really works.', tag: 'Beginner' },
  { icon: GraduationCap, title: 'Study with AI', desc: 'Use ChatGPT & Claude to ace exams and research.', tag: 'Students' },
  { icon: Palette, title: 'Creator Toolkit', desc: 'Master Midjourney, Runway, and visual AI tools.', tag: 'Creators' },
];

const testimonials = [
  {
    name: 'Lukas M.',
    role: 'University Student',
    country: 'Germany',
    flag: '🇩🇪',
    quote: 'I used ChatGPT through AI DEALS for my entire semester — essay outlines, research summaries, exam prep. Setup took 2 minutes and I never had to share any passwords.',
    rating: 5,
  },
  {
    name: 'Ingrid V.',
    role: 'Parent',
    country: 'Netherlands',
    flag: '🇳🇱',
    quote: 'My daughter uses Midjourney for school projects. No passwords shared, no credit card needed. As a parent, that privacy-first approach is exactly what I was looking for.',
    rating: 5,
  },
  {
    name: 'Carlos R.',
    role: 'Content Creator',
    country: 'Spain',
    flag: '🇪🇸',
    quote: 'I run my entire content pipeline through AI DEALS — Claude for writing, Midjourney for visuals. Saved me hundreds per month while keeping everything in one place.',
    rating: 5,
  },
];

const faqSections = [
  {
    title: 'Privacy & Security',
    icon: Shield,
    items: [
      { q: 'Is AI DEALS GDPR compliant?', a: 'We follow European GDPR principles in our data handling. We minimise data collection, never sell your data, and process everything with industry-standard encryption.' },
      { q: 'Do I need to share my passwords?', a: 'Never. We create and manage dedicated accounts for you. You never share personal credentials with us.' },
      { q: 'How is my data handled?', a: 'We store only what\'s necessary for service delivery — your email and order information. All data is encrypted and handled according to EU data protection standards.' },
    ],
  },
  {
    title: 'Academic Use',
    icon: GraduationCap,
    items: [
      { q: 'Is this allowed for academic use?', a: 'AI tools are widely used in education. We recommend following your institution\'s specific guidelines on AI-assisted work.' },
      { q: 'Can AI replace studying?', a: 'No — and it shouldn\'t. AI is a study companion that helps you research faster, write better, and learn more efficiently. We promote responsible usage through our Academy.' },
      { q: 'Is this safe for teenagers?', a: 'Yes. Every tool is reviewed for age-appropriateness. We handle all accounts — no passwords or credit cards needed from your child.' },
    ],
  },
  {
    title: 'Subscription & Billing',
    icon: CreditCard,
    items: [
      { q: 'Is it monthly only?', a: 'Yes. No annual lock-ins. Pay month-to-month and cancel whenever you want — no questions asked.' },
      { q: 'How fast is activation?', a: 'Most tools are activated within 1–6 hours after payment confirmation.' },
      { q: 'Can I cancel anytime?', a: 'Absolutely. Cancel your subscription anytime and retain access until the end of your billing period.' },
    ],
  },
  {
    title: 'Global Access',
    icon: Globe,
    items: [
      { q: 'Is this available outside Europe?', a: 'Yes! While we\'re built with European privacy standards, AI DEALS is accessible worldwide. Anyone can use our platform.' },
      { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, debit cards, and select digital wallets through our secure Stripe checkout — globally.' },
      { q: 'What if I enter the wrong email?', a: 'Contact our support team immediately. We respond within 24 hours and can update your details.' },
    ],
  },
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
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-sm font-medium text-foreground pr-4">{q}</span>
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
          className="pb-4"
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
      <Navbar />

      <main>
        {/* ═══════════════ A) HERO — Story + Authority ═══════════════ */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <video autoPlay loop muted playsInline poster={heroImage} className="absolute inset-0 w-full h-full object-cover">
              <source src={heroVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.6) 70%, hsl(var(--background)) 100%)' }} />
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
                <img src={logo} alt="AI DEALS" className="h-24 md:h-32 w-auto mx-auto drop-shadow-[0_0_40px_rgba(168,85,247,0.6)]" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl sm:text-5xl md:text-7xl font-display font-black mb-4 md:mb-6 leading-[0.95] tracking-tight"
                style={{ textShadow: '0 0 60px hsl(var(--primary) / 0.5), 0 4px 20px rgba(0,0,0,0.8)' }}
              >
  <span className="text-white drop-shadow-2xl">AI Tools Made Simple</span>
                <br />
                <span className="gradient-text" style={{ filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.5))' }}>
                  For Students & Creators
                </span>
              </motion.h1>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mb-8 md:mb-10">
                <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed px-6 py-4 rounded-2xl backdrop-blur-md border border-white/10" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)' }}>
                  Safe, affordable, guided access to premium AI tools — no complexity, no risk, no password sharing.
                </p>
              </motion.div>

              {/* CTAs */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Button variant="hero" size="xl" className="group min-w-[200px] shadow-2xl" asChild>
                  <a href="/store">
                    Explore Store
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
                <Button variant="heroOutline" size="xl" className="backdrop-blur-md bg-white/5 border-white/20 hover:bg-white/10" asChild>
                  <a href="/academy">
                    Enter Academy
                    <GraduationCap className="ml-2 w-5 h-5" />
                  </a>
                </Button>
              </motion.div>

              {/* Trust Badge Strip */}
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

        {/* ═══════════════ B) OUR STORY ═══════════════ */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div {...fadeUp} className="text-center mb-12">
                <span className="inline-block text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                  Our Story
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                  Why We Built <span className="gradient-text">AI DEALS</span>
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
                  <div className="space-y-5">
                    <p className="text-foreground leading-relaxed text-base">
                      We saw a problem that no one was solving.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Students were overwhelmed by AI tools — dozens of platforms, complex signups, credit card requirements. 
                      Parents were concerned about privacy and safety. Creators were paying too much for multiple subscriptions 
                      they barely used.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Access to powerful AI was fragmented, confusing, and often risky — especially in Europe, 
                      where privacy expectations are higher.
                    </p>
                  </div>
                  <div className="space-y-5">
                    <p className="text-foreground leading-relaxed text-base">
                      So we built the solution.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      AI DEALS is a structured, curated, safe gateway to the world's best AI tools. 
                      We handle the accounts, the billing, and the complexity — so you can focus on 
                      what matters: learning, creating, and building.
                    </p>
                    <div className="space-y-3 pt-2">
                      {[
                        'No passwords shared — ever',
                        'Curated tools, not a random marketplace',
                        'Built with European privacy in mind',
                        'Affordable, monthly, flexible',
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

        {/* ═══════════════ C) EUROPE-FIRST PRIVACY ═══════════════ */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <motion.div {...fadeUp} className="text-center mb-12">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-2xl">🇪🇺</span>
                  <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider">
                    Privacy by Design
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                  Built with <span className="gradient-text">European Privacy Standards</span> in Mind
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  We believe privacy is a right, not a feature. Every decision we make starts with data protection.
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 gap-6">
                {privacyPillars.map((pillar, i) => {
                  const Icon = pillar.icon;
                  return (
                    <motion.div
                      key={pillar.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-sm mb-1.5">{pillar.title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">{pillar.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.p
                {...fadeUp}
                className="text-center text-xs text-muted-foreground mt-8 max-w-lg mx-auto"
              >
                AI DEALS follows GDPR principles in data handling. We do not claim official GDPR certification — 
                we commit to the standards that protect our users.
              </motion.p>
            </div>
          </div>
        </section>

        {/* ═══════════════ D) WHO IT'S FOR ═══════════════ */}
        <section className="py-24 relative">
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

        {/* ═══════════════ E) WHY AI DEALS ═══════════════ */}
        <section id="how-it-works" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div {...fadeUp} className="text-center mb-16">
              <span className="inline-block text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                How It Works
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                Why Choose <span className="gradient-text">AI DEALS</span>?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                We remove every barrier between you and premium AI — with European privacy at the core.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
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

        {/* ═══════════════ F) FEATURED TOOLS ═══════════════ */}
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
                  Hand-picked, verified tools trusted by students & creators worldwide.
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

        {/* ═══════════════ G) TESTIMONIALS ═══════════════ */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div {...fadeUp} className="text-center mb-12">
              <span className="inline-block text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                Trusted Across Europe & Beyond
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                What Our <span className="gradient-text">Community Says</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                Real feedback from students, creators, and parents.
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
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                    <Play className="w-3.5 h-3.5 text-primary fill-primary" />
                  </div>

                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-current" style={{ color: 'hsl(45 93% 58%)' }} />
                    ))}
                  </div>

                  <p className="text-foreground text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{t.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-display font-bold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50 border border-border/50">
                      <span className="text-sm">{t.flag}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">{t.country}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ H) ACADEMY PREVIEW ═══════════════ */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <motion.div {...fadeUp} className="text-center mb-12">
              <span className="inline-block text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                Responsible AI Learning
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                Learn AI <span className="gradient-text">The Right Way</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                A structured learning hub for students and creators. Use AI responsibly, effectively, and creatively.
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
              <Button variant="hero" size="lg" className="group" asChild>
                <a href="/academy">
                  Enter Academy
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* ═══════════════ I) NEWSLETTER ═══════════════ */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl mx-auto glass rounded-3xl p-8 md:p-12 text-center">
              <motion.div {...fadeUp}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl md:text-4xl font-display font-bold mb-3">
                  Stay Ahead of AI — <span className="gradient-text">Responsibly</span>
                </h2>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md mx-auto mb-8">
                  Weekly insights for students and creators across Europe and beyond. Safe tools, study hacks, and responsible AI practices.
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
                    {newsletter.loading ? 'Joining...' : 'Join 1,200+ Learners'}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════ J) FAQ ═══════════════ */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <motion.div {...fadeUp} className="text-center mb-16">
              <span className="inline-block text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                Common Questions
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                Frequently <span className="gradient-text">Asked</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                Clear, honest answers — because trust starts with transparency.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {faqSections.map((section, i) => {
                const Icon = section.icon;
                return (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4.5 h-4.5 text-primary" />
                      </div>
                      <h3 className="font-display font-bold text-base">{section.title}</h3>
                    </div>
                    <div>
                      {section.items.map((item) => (
                        <FaqItem key={item.q} q={item.q} a={item.a} />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════ K) FINAL CTA ═══════════════ */}
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
                    Start Your AI Journey <span className="gradient-text">Today</span>
                  </h2>
                  <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                    Join students and creators worldwide who trust AI DEALS for safe, affordable, guided AI access.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button variant="hero" size="xl" className="group" asChild>
                      <a href="/store">
                        Explore Tools
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                    <Button variant="heroOutline" size="xl" asChild>
                      <a href="/academy">
                        Enter Academy
                        <ChevronRight className="w-5 h-5" />
                      </a>
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
