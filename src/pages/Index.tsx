import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, UserCheck, Lock,
  Zap, CheckCircle, Shield,
  Plus, Minus, Mail,
  ChevronRight, Star, MessageCircle, ShoppingBag, PackageCheck, Headphones,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SEO from '@/components/SEO';

import { useNewsletterSubscribe } from '@/hooks/useNewsletterSubscribe';
import { languages } from '@/lib/i18n';
import { supportLinks } from '@/lib/socialLinks';
import heroVideo from '@/assets/hero-video.mp4';
import heroImage from '@/assets/hero-ai-models.png';
import heroImageMobile from '@/assets/hero-ai-models-mobile.webp';
import logo from '@/assets/logo.png';

/* ══════════════════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════════════════ */

const trustBadges = [
  { icon: Zap, labelKey: 'home.instantDelivery' },
  { icon: CheckCircle, labelKey: 'home.simpleActivation' },
  { icon: UserCheck, labelKey: 'home.supportIncluded' },
];

const popularTools = [
  { name: 'ChatGPT', id: 'chatgpt', benefitKey: 'home.popularBenefit.chatgpt' },
  { name: 'Microsoft Office', id: 'microsoft_office', benefitKey: 'home.popularBenefit.office' },
  { name: 'Windows', id: 'windows', benefitKey: 'home.popularBenefit.windows' },
  { name: 'Microsoft Copilot', id: 'microsoft_365', benefitKey: 'home.popularBenefit.copilot' },
  { name: 'Canva Pro', id: 'canva', benefitKey: 'home.popularBenefit.canva' },
];

const whyAiDeals = [
  { icon: Shield, titleKey: 'home.whyCards.affordableTitle', descKey: 'home.whyCards.affordableText' },
  { icon: Zap, titleKey: 'home.whyCards.deliveryTitle', descKey: 'home.whyCards.deliveryText' },
  { icon: PackageCheck, titleKey: 'home.whyCards.activationTitle', descKey: 'home.whyCards.activationText' },
  { icon: Headphones, titleKey: 'home.whyCards.supportTitle', descKey: 'home.whyCards.supportText' },
];

const SESSION_OFFER_MS = 15 * 60 * 1000;

const SessionOfferTimer = () => {
  const { t } = useTranslation();
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
      <p className="mb-1 text-[11px] font-semibold text-white/70">{t('home.sessionViewing')}</p>
      {remaining > 0 ? (
        <p className="text-xs text-white/70">{t('home.sessionLimited')} <span className="ml-1 text-lg font-black tabular-nums" style={{ color: 'hsl(25 95% 58%)' }}>{minutes}:{seconds}</span></p>
      ) : (
        <p className="text-xs font-semibold" style={{ color: 'hsl(25 95% 58%)' }}>{t('home.offerExpired')}</p>
      )}
      <p className="mt-2 text-[11px] text-white/60">{t('home.sessionTrust')}</p>
    </div>
  );
};

const steps = [
  { num: '01', title: 'Choose your tool', desc: 'Browse our curated selection of premium AI tools.' },
  { num: '02', title: 'Complete checkout', desc: 'Simple, secure payment — no hidden fees.' },
  { num: '03', title: 'We activate your access', desc: 'Activation is handled securely by our team after purchase.' },
  { num: '04', title: 'Start using it', desc: 'No sensitive information is required before payment.' },
];

const customerFeedback = [
  'Access was clear and easy to start using.',
  'The checkout felt simple and secure.',
  'Support answered quickly when I needed help.',
  'Activation instructions were easy to follow.',
  'Everything worked without complicated setup.',
  'The product page made the choice simple.',
  'Delivery was fast after payment.',
  'I liked that the process was straightforward.',
  'The store feels focused and trustworthy.',
  'I found the tool I needed very quickly.',
  'The access details were explained clearly.',
  'Support made the activation smooth.',
  'Buying software here was easy.',
  'The steps were clear from start to finish.',
  'The service saved me time.',
  'I would use AI Deals again.',
  'The experience felt professional.',
  'Everything was ready faster than expected.',
  'The activation message was simple to understand.',
  'I received exactly what I expected after checkout.',
  'The website made the buying process feel safe.',
  'The support channel was easy to find.',
  'The instructions were short and useful.',
  'I could compare the tools without confusion.',
  'The mobile checkout experience was smooth.',
  'Everything looked clean and professional.',
  'The delivery process felt transparent.',
  'It was easy to choose the right subscription.',
  'The store layout helped me decide quickly.',
  'I appreciated the clear activation steps.',
];

const realMessages = [
  'Thanks, access is working now. Very clear instructions.',
  'Payment done and activation received. Appreciate the quick support.',
  'It works perfectly on my device. Thank you.',
];

const trustStrip = [
  { icon: Zap, label: 'Instant delivery' },
  { icon: CheckCircle, label: 'Simple activation' },
  { icon: Headphones, label: 'Support available' },
];

const faqs = [
  { q: 'Is payment safe?', a: 'Yes. Secure payment is handled by Stripe and Bancontact.' },
  { q: 'When do I receive access?', a: 'Access delivered within minutes after payment.' },
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
  const { t, i18n } = useTranslation();
  const newsletter = useNewsletterSubscribe();

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

  return (
    <div className="min-h-screen bg-background">
      <SEO page="home" jsonLd={{ '@context': 'https://schema.org', '@type': 'Organization', name: 'AI DEALS', url: 'https://aideals.be' }} />
      <Navbar />

      <main>
        {/* ═══════════════ 1) HERO ═══════════════ */}
        <section className="relative min-h-[92svh] md:min-h-[94vh] flex items-center justify-start overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <img src={heroImageMobile} alt="AI DEALS premium AI tools" className="absolute inset-0 h-full w-full object-cover object-[58%_center] md:hidden" fetchPriority="high" />
            <video autoPlay loop muted playsInline poster={heroImage} className="absolute inset-0 hidden w-full h-full object-cover object-center md:block">
              <source src={heroVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.12) 52%, hsl(var(--background) / 0.78) 100%)' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to right, hsl(var(--background) / 0.2) 0%, transparent 48%, transparent 100%)' }} />
          </div>

          <div className="container mx-auto px-4 relative z-10 pt-20 pb-10 md:pt-24 md:pb-12">
            <div className="max-w-3xl text-left rounded-[28px] border border-white/10 bg-background/62 px-4 py-6 shadow-2xl shadow-background/60 sm:px-8 md:px-10 md:py-8">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="mb-3 md:mb-5">
                <img src={logo} alt="AI DEALS" className="h-14 sm:h-16 md:h-24 w-auto drop-shadow-[0_0_40px_rgba(168,85,247,0.6)]" />
              </motion.div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xs sm:text-sm md:text-lg font-display font-semibold uppercase mb-3 md:mb-5"
                style={{ 
                  color: 'rgba(232,212,139,0.9)',
                  textShadow: '0 0 30px rgba(232,212,139,0.3)',
                  letterSpacing: '0.15em',
                }}
              >
                {t('home.tagline')}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-black mb-4 md:mb-6 leading-[0.98] tracking-tight"
                style={{ textShadow: '0 0 60px hsl(var(--primary) / 0.5), 0 4px 20px rgba(0,0,0,0.8)' }}
              >
                <span className="gradient-text block" style={{ filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.5))' }}>
                  {t('home.heroTitle')}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-base sm:text-lg md:text-2xl text-white/90 max-w-2xl leading-relaxed mb-5"
              >
                {t('home.heroSubtitle')}
              </motion.p>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }} className="mb-5 md:mb-7 flex flex-wrap items-center justify-start gap-2.5 md:gap-3">
                {trustBadges.map(({ icon: Icon, labelKey }) => (
                  <div key={labelKey} className="flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-sm font-bold text-white/85 backdrop-blur-md">
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{t(labelKey)}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-start gap-3 sm:gap-4 mb-3 md:mb-4">
                <Button variant="hero" size="xl" className="group min-h-[56px] w-full max-w-xs sm:w-auto sm:min-w-[200px] shadow-2xl" asChild>
                  <Link to="/store">
                    <span>{t('home.viewDeals')}</span>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="xl" className="min-h-[56px] w-full max-w-xs sm:w-auto sm:min-w-[200px] backdrop-blur-md bg-white/5 border-white/20 hover:bg-white/10" asChild>
                  <a href={supportLinks.whatsapp} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    {t('home.chatWhatsapp')}
                  </a>
                </Button>
              </motion.div>
              <p className="text-[11px] md:text-xs text-white/55">{t('home.secureCheckoutEur')}</p>
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
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-medium">{t('home.scroll')}</span>
              <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1.5">
                <motion.div animate={{ height: ['20%', '60%', '20%'] }} transition={{ duration: 2, repeat: Infinity }} className="w-0.5 rounded-full bg-primary/60" />
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section className="relative -mt-2 pb-12 pt-8 md:pb-16" aria-label="Popular Tools">
          <div className="container mx-auto px-4">
            <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-xs font-bold uppercase text-primary">Popular Tools</p>
                <h2 className="font-display text-2xl font-black text-foreground md:text-4xl">Buy the tools you need faster</h2>
              </div>
              <Button variant="heroOutline" size="lg" className="min-h-11 w-full sm:w-auto" asChild>
                <Link to="/store">View all products<ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {popularTools.map((product) => (
                <motion.div key={product.name} {...fadeUp} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-lg shadow-background/30 transition-all hover:border-primary/35 hover:bg-primary/10">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-black text-foreground">{product.name}</h3>
                  <p className="mt-2 min-h-[54px] text-sm leading-relaxed text-muted-foreground">{product.benefit}</p>
                  <Button variant="hero" size="sm" className="mt-4 min-h-10 w-full" asChild>
                    <Link to={`/store?scrollTo=${product.id}`}>Buy Now<ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 relative" aria-label="Why AI Deals">
          <div className="container mx-auto px-4">
            <motion.div {...fadeUp} className="text-center mb-10">
              <p className="mb-3 text-xs font-bold uppercase text-primary">Why AI Deals</p>
              <h2 className="text-3xl md:text-5xl font-display font-bold">Simple, safe, and ready to use</h2>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {whyAiDeals.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.title} {...fadeUp} className="glass rounded-2xl p-6 text-center hover:border-primary/30 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-14 md:py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div {...fadeUp} className="text-center mb-10">
              <p className="mb-3 text-xs font-bold uppercase text-primary">How It Works</p>
              <h2 className="text-3xl md:text-5xl font-display font-bold">Four simple steps</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto mb-8">
              {steps.map((step, i) => (
                <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6 text-center hover:border-primary/30 transition-all duration-300 relative">
                  <span className="text-5xl font-display font-black absolute top-4 right-4 opacity-[0.06]" style={{ lineHeight: 1 }}>{step.num}</span>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-display font-bold text-sm">{step.num}</span>
                  </div>
                  <h3 className="font-display font-bold text-sm mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
            <motion.p {...fadeUp} className="text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Lock className="w-3.5 h-3.5 text-primary" />
              No personal password is required before payment.
            </motion.p>
          </div>
        </section>

        <section className="py-14 md:py-20 relative" aria-label="Customer Feedback">
          <div className="container mx-auto px-4">
            <motion.div {...fadeUp} className="mx-auto mb-10 grid max-w-4xl gap-3 sm:grid-cols-3">
              {trustStrip.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-foreground">
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </motion.div>
            <motion.div {...fadeUp} className="text-center mb-10">
              <p className="mb-3 text-xs font-bold uppercase text-primary">Customer Feedback</p>
              <h2 className="text-3xl md:text-5xl font-display font-bold">Short messages from buyers</h2>
            </motion.div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
              {customerFeedback.map((line) => (
                <motion.div key={line} {...fadeUp} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-2 flex gap-1 text-primary" aria-label="5 stars">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-3.5 w-3.5 fill-current" />)}</div>
                  <p className="text-sm leading-relaxed text-muted-foreground">“{line}”</p>
                </motion.div>
              ))}
            </div>
            <motion.div {...fadeUp} className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] max-w-5xl mx-auto items-center">
              <div>
                <h3 className="font-display text-2xl font-bold text-foreground">Real Customer Messages</h3>
                <p className="mt-2 text-sm text-muted-foreground">WhatsApp-style feedback previews with personal details blurred for privacy.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {realMessages.map((message) => (
                  <div key={message} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-lg shadow-background/30">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-8 w-8 rounded-full bg-primary/20 blur-[1px]" />
                      <span className="h-3 w-24 rounded-full bg-white/20 blur-[2px]" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-primary/15 p-3 text-sm text-foreground">{message}</div>
                    <div className="mt-2 h-2 w-20 rounded-full bg-white/15 blur-[1px]" />
                  </div>
                ))}
              </div>
            </motion.div>
            <div className="mt-8 text-center">
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/contact">Share your feedback after purchase</Link>
              </Button>
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
                  {t('home.newsletterTitle')}
                </h2>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md mx-auto mb-8">
                  {t('home.newsletterText')}
                </p>
                <form
                  onSubmit={newsletter.subscribe}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <Input
                    type="email"
                    placeholder={t('footer.emailPlaceholder')}
                    required
                    value={newsletter.email}
                    onChange={(e) => newsletter.setEmail(e.target.value)}
                    className="flex-1 bg-muted/50 border-border h-12 rounded-xl text-sm"
                  />
                  <Button variant="hero" size="lg" type="submit" disabled={newsletter.loading} className="h-12 rounded-xl whitespace-nowrap">
                    <Mail className="w-4 h-4 mr-2" />
                    {newsletter.loading ? t('home.joining') : t('home.joinFree')}
                  </Button>
                </form>
                <p className="text-[10px] text-muted-foreground/60 mt-4">{t('home.noSpam')}</p>
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
                  {t('home.whyBuyFromUs')}
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                  {t('home.clearSimpleSafe')}
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
                  {t('home.whyText1')}
                </p>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {t('home.whyText2')}
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
                    {t('home.readyTitle')}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                    {t('home.readyText')}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button variant="hero" size="xl" className="group" asChild>
                      <Link to="/store">
                        {t('store.buyNow')}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <Button variant="heroOutline" size="xl" asChild>
                      <Link to="/store">
                        {t('store.buyNow')}
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
