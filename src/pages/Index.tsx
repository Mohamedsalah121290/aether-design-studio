import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, GraduationCap, Briefcase, UserCheck, Lock,
  Zap, CheckCircle, Shield, BookOpen,
  Play, Plus, Minus, Mail,
  ChevronRight, Eye, Rocket, Layers, Target, Star, CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SEO from '@/components/SEO';
import KeywordCluster from '@/components/KeywordCluster';
import TrustBadges from '@/components/TrustBadges';
import { ChatbotPromoSection } from '@/components/ChatbotConversion';
import { socialProofReviews } from '@/lib/socialProof';

import { useNewsletterSubscribe } from '@/hooks/useNewsletterSubscribe';
import { languages } from '@/lib/i18n';
import heroVideo from '@/assets/hero-video.mp4';
import heroImage from '@/assets/hero-ai-models.png';
import heroImageMobile from '@/assets/hero-ai-models-mobile.webp';
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

const mobilePopularTools = [
  { name: 'ChatGPT Plus', id: 'chatgpt', price: 'From €9.99 (excl. VAT)', badge: 'Best choice' },
  { name: 'Canva Pro', id: 'canva', price: 'From €7.99 (excl. VAT)', badge: 'Most popular' },
  { name: 'Perplexity Pro', id: 'perplexity', price: 'From €9.99 (excl. VAT)', badge: 'Starter option' },
  { name: 'CapCut Pro', id: 'capcut', price: 'From €7.99 (excl. VAT)', badge: 'Popular choice' },
];

const intentFunnels = {
  student: {
    icon: GraduationCap,
    title: 'Student',
    description: 'Study faster with the right AI stack.',
    headline: 'Study smarter with AI tools',
    products: [
      { name: 'ChatGPT Plus', id: 'chatgpt', best: true },
      { name: 'Perplexity', id: 'perplexity' },
      { name: 'Notion', id: 'notion' },
    ],
    reasons: ['faster answers', 'better understanding', 'save time'],
    cta: 'Start Learning Now',
  },
  creator: {
    icon: Play,
    title: 'Content Creator',
    description: 'Create, edit, and publish with less friction.',
    headline: 'Create content faster with AI',
    products: [
      { name: 'Canva Pro', id: 'canva', best: true },
      { name: 'CapCut', id: 'capcut' },
      { name: 'ElevenLabs', id: 'elevenlabs' },
    ],
    reasons: ['design faster', 'edit videos', 'create voice content'],
    cta: 'Start Creating',
  },
  business: {
    icon: Briefcase,
    title: 'Business',
    description: 'Automate daily work and move faster.',
    headline: 'Automate and grow your business',
    products: [
      { name: 'ChatGPT Business', id: 'chatgpt', best: true },
      { name: 'Office 365', id: 'microsoft_365' },
      { name: 'Notion', id: 'notion' },
    ],
    reasons: ['automate tasks', 'increase productivity', 'save hours daily'],
    cta: 'Start Growing',
  },
};

type IntentKey = keyof typeof intentFunnels;

const SESSION_OFFER_MS = 15 * 60 * 1000;

const SessionOfferTimer = () => {
  const [remaining, setRemaining] = useState(SESSION_OFFER_MS);

  useEffect(() => {
    const key = 'aiDealsSessionOfferStartedAt';
    const now = Date.now();
    const stored = Number(localStorage.getItem(key));
    const startedAt = Number.isFinite(stored) && stored > 0 ? stored : now;
    if (!stored) localStorage.setItem(key, String(startedAt));

    const tick = () => setRemaining(Math.max(0, SESSION_OFFER_MS - (Date.now() - startedAt)));
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const minutes = String(Math.floor(remaining / 60000)).padStart(2, '0');
  const seconds = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0');

  return (
    <div className="mx-auto mt-3 max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-md">
      <p className="mb-1 text-[11px] font-semibold text-white/70">🔥 17 people are viewing this now</p>
      {remaining > 0 ? (
        <p className="text-xs text-white/70">⏳ Limited-time access for this session <span className="ml-1 text-lg font-black tabular-nums" style={{ color: 'hsl(25 95% 58%)' }}>{minutes}:{seconds}</span></p>
      ) : (
        <p className="text-xs font-semibold" style={{ color: 'hsl(25 95% 58%)' }}>Offer expired — new deals available</p>
      )}
      <p className="mt-2 text-[11px] text-white/60">✔ Real-time demand&nbsp;&nbsp; ✔ Limited daily access&nbsp;&nbsp; ✔ Secure checkout</p>
    </div>
  );
};

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

const faqs = [
  { q: 'Do I need to share my passwords?', a: 'No. We provide secure access after activation. Your personal passwords are never involved.' },
  { q: 'When do I receive login details?', a: 'Usually within a few hours after payment confirmation. You\'ll see them in your dashboard.' },
  { q: 'Is this only for students?', a: 'No. It\'s for anyone serious about growth with AI — students, creators, professionals, and more.' },
  { q: 'Is it monthly?', a: 'Yes. Flexible. Cancel anytime. No annual lock-ins, no questions asked.' },
];

const floatingElements: { name: string; x: string; y: string; delay: number; size: number }[] = [];

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
  const [activeIntent, setActiveIntent] = useState<IntentKey>('student');

  useEffect(() => {
    const lang = languages.find(l => l.code === i18n.language);
    document.documentElement.dir = lang?.rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang?.code || 'en';
  }, [i18n.language]);

  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  const enterFunnel = (key: IntentKey) => {
    setActiveIntent(key);
    localStorage.setItem('aiDealsActiveFunnel', key);
    window.dispatchEvent(new CustomEvent('aiDeals:funnel', { detail: key }));
  };

  const activeFunnel = intentFunnels[activeIntent];
  const ActiveFunnelIcon = activeFunnel.icon;

  return (
    <div className="min-h-screen bg-background">
      <SEO page="home" jsonLd={{ '@context': 'https://schema.org', '@type': 'Organization', name: 'AI DEALS', url: 'https://aideals.be' }} />
      <Navbar />

      <main>
        {/* ═══════════════ 1) HERO ═══════════════ */}
        <section className="relative min-h-[100svh] md:min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <img src={heroImageMobile} alt="AI DEALS premium AI tools" className="absolute inset-0 h-full w-full object-cover md:hidden" fetchPriority="high" />
            <video autoPlay loop muted playsInline poster={heroImage} className="absolute inset-0 hidden w-full h-full object-cover md:block">
              <source src={heroVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.7) 70%, hsl(var(--background)) 100%)' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)' }} />
          </div>

          <div className="container mx-auto px-4 relative z-10 pt-20 pb-24 md:pt-24 md:pb-0">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="hidden md:block mb-6">
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
                  Get instant access to premium AI tools — no setup needed.
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
                Buy faster, start easier, and get real support when you need it.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-xs sm:text-sm text-white/40 max-w-lg mx-auto mb-8 md:mb-10 tracking-wide"
              >
                Simple access. Fast delivery. Secure checkout.
              </motion.p>

              {/* CTAs */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 md:mb-10">
                <Button variant="hero" size="xl" className="group min-h-[56px] w-full max-w-xs sm:w-auto sm:min-w-[200px] shadow-2xl" asChild>
                  <Link to="/store">
                    <span className="sm:hidden">Get Access Now</span><span className="hidden sm:inline">Explore Tools</span>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="xl" className="hidden sm:inline-flex backdrop-blur-md bg-white/5 border-white/20 hover:bg-white/10" asChild>
                  <a href="#how-it-works">
                    Learn How It Works
                  </a>
                </Button>
              </motion.div>
              <div className="md:hidden mb-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] font-medium text-white/75">
                <span>✔ Instant access</span><span>✔ Works worldwide</span><span>✔ Secure payment</span>
              </div>
              <SessionOfferTimer />
              <p className="mt-3 text-[11px] text-white/45 mb-5">Secure checkout via Stripe. Final payment in EUR.</p>

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
              <div className="mt-4 hidden md:block">
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

        <section className="py-16 md:py-20 relative" aria-label="Choose what fits you">
          <div className="container mx-auto px-4">
            <motion.div {...fadeUp} className="text-center mb-10">
              <h2 className="text-3xl md:text-5xl font-display font-bold">Choose what fits you</h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-8">
              {(Object.entries(intentFunnels) as [IntentKey, typeof intentFunnels[IntentKey]][]).map(([key, funnel], index) => {
                const Icon = funnel.icon;
                const isActive = activeIntent === key;
                return (
                  <motion.button
                    key={key}
                    type="button"
                    onClick={() => enterFunnel(key)}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className={`glass min-h-[164px] rounded-2xl p-5 text-left transition-all duration-300 active:scale-[0.99] ${isActive ? 'border-primary/45 bg-primary/10' : 'hover:border-primary/30'}`}
                    aria-pressed={isActive}
                  >
                    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-6 w-6" /></span>
                    <h3 className="font-display text-xl font-bold text-foreground">{funnel.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{funnel.description}</p>
                    <span className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground">Start</span>
                  </motion.button>
                );
              })}
            </div>

            <motion.div key={activeIntent} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="glass rounded-3xl p-5 md:p-8 max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6 lg:gap-8 items-start">
                <div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><ActiveFunnelIcon className="h-6 w-6" /></div>
                  <h3 className="text-2xl md:text-4xl font-display font-bold leading-tight">{activeFunnel.headline}</h3>
                  <div className="mt-5 space-y-3">
                    {activeFunnel.reasons.map((reason) => (
                      <div key={reason} className="flex items-center gap-3 text-sm text-foreground"><CheckCircle className="h-4 w-4 shrink-0 text-primary" />{reason}</div>
                    ))}
                  </div>
                  <Button variant="hero" size="lg" className="mt-7 min-h-[52px] w-full sm:w-auto" asChild>
                    <Link to={`/store?scrollTo=${activeFunnel.products[0].id}`} onClick={() => enterFunnel(activeIntent)}>{activeFunnel.cta}<ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>

                <div className="grid gap-3">
                  {activeFunnel.products.map((product) => (
                    <Link key={`${activeIntent}-${product.id}-${product.name}`} to={`/store?scrollTo=${product.id}`} onClick={() => enterFunnel(activeIntent)} className={`rounded-2xl border p-4 transition-all hover:border-primary/35 active:scale-[0.99] ${product.best ? 'border-primary/35 bg-primary/10' : 'border-border bg-muted/20'}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            {product.best && <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">Best choice</span>}
                            {product.best && <span className="text-[11px] font-medium text-muted-foreground">Most users like you choose this</span>}
                          </div>
                          <h4 className="truncate font-display text-lg font-bold text-foreground">{product.name}</h4>
                        </div>
                        <span className="min-h-11 shrink-0 inline-flex items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground">Start</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="md:hidden py-10 relative" aria-label="Mobile conversion shortcuts">
          <div className="container mx-auto px-4 space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">Most Popular Tools</p>
                <h2 className="text-2xl font-display font-bold">Buy faster on mobile</h2>
              </div>
              <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">23 viewing now</span>
            </div>
            <div className="grid gap-3">
              {mobilePopularTools.map((tool) => (
                <Link key={tool.id} to={`/store?scrollTo=${tool.id}`} className="glass min-h-[104px] rounded-2xl p-4 flex items-center justify-between gap-4 active:scale-[0.99] transition-transform">
                  <div className="min-w-0">
                    <span className="inline-flex mb-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-muted-foreground">{tool.badge}</span>
                    <h3 className="text-base font-display font-bold text-foreground truncate">{tool.name}</h3>
                    <p className="text-sm font-semibold text-primary mt-1">{tool.price}</p>
                    <p className="mt-1 text-xs font-medium text-muted-foreground">Taxes (if applicable) are calculated at checkout.</p>
                  </div>
                  <span className="min-h-11 shrink-0 inline-flex items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground">Buy Now</span>
                </Link>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground">Limited availability today · secure checkout · activation support</p>
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

        <section className="md:hidden py-10 relative" aria-label="Mobile trust and reviews">
          <div className="container mx-auto px-4 space-y-6">
            <div className="glass rounded-2xl p-5 text-center">
              <div className="flex items-center justify-center gap-1 mb-2" aria-label="4.8 out of 5 rating">
                {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current text-primary" />)}
              </div>
              <h2 className="text-xl font-display font-bold">Trusted by 1000+ users</h2>
              <p className="mt-2 text-sm text-muted-foreground">Secure payment, EUR checkout, and verified digital access.</p>
              <div className="mt-4 flex items-center justify-center gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-primary" />Protected</span>
                <span className="inline-flex items-center gap-1"><CreditCard className="h-3.5 w-3.5 text-primary" />Stripe</span>
                <span className="inline-flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-primary" />Fast activation</span>
              </div>
            </div>
            <div className="overflow-x-auto -mx-4 px-4 pb-1">
              <div className="flex gap-3 min-w-max">
                {socialProofReviews.slice(0, 8).map((review) => (
                  <div key={`${review.name}-${review.product}`} className="glass w-64 rounded-2xl p-4">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="min-w-0"><p className="text-sm font-bold truncate">{review.name}</p><p className="text-xs text-muted-foreground">{review.flag} {review.country}</p></div>
                      <span className="text-xs text-primary">★★★★★</span>
                    </div>
                    <p className="text-[11px] font-semibold text-primary mb-2">{review.product}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">“{review.quote}”</p>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/store" className="min-h-[52px] inline-flex w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25">See more reviews →</Link>
          </div>
        </section>

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

        {/* ═══════════════ 8.5) WHY BUY FROM US ═══════════════ */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <motion.div {...fadeUp} className="text-center mb-12">
                <span className="inline-block text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                  Why buy from us
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                  Clear. Simple. <span className="gradient-text">Safe.</span>
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
                  Get the AI tool you need without setup, installation, or technical steps.
                </p>
                <p className="text-muted-foreground text-base leading-relaxed">
                  We prepare your access quickly and keep support available if you need help.
                </p>
                <div className="grid sm:grid-cols-3 gap-4 pt-4">
                  {[
                    { icon: Zap, title: 'Instant access', desc: 'Start faster without waiting through setup steps.' },
                    { icon: UserCheck, title: 'No setup required', desc: 'We keep access simple so you can use your tool quickly.' },
                    { icon: Shield, title: 'Support included', desc: 'Real help is available when you need it.' },
                    { icon: CheckCircle, title: 'Works immediately', desc: 'Everything is prepared so access feels easy and safe.' },
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

        <ChatbotPromoSection />


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
