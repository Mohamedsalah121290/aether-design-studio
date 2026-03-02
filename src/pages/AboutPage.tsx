import { motion } from 'framer-motion';
import { Shield, Users, Heart, Target, Sparkles, Globe, Award, Eye, BookOpen, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const values = [
  {
    icon: Shield,
    title: 'Privacy',
    description: 'We follow GDPR principles and minimise data collection. Your data is never sold or shared.',
  },
  {
    icon: BookOpen,
    title: 'Education',
    description: 'We believe AI should be learned, not just used. Our Academy promotes responsible, effective usage.',
  },
  {
    icon: Heart,
    title: 'Accessibility',
    description: 'Premium AI tools at student-friendly prices. No bundles, no commitments — pay only for what you need.',
  },
  {
    icon: Eye,
    title: 'Transparency',
    description: 'No hidden fees, no data selling, no overclaiming. We build trust through radical honesty.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Built in Europe with European standards — but designed to be accessible to anyone, anywhere in the world.',
  },
  {
    icon: Award,
    title: 'Quality',
    description: 'Every tool in our catalog is manually reviewed for quality, safety, and educational value.',
  },
];

const stats = [
  { value: '50+', label: 'Verified AI Tools' },
  { value: '24/7', label: 'Global Support' },
  { value: '100%', label: 'GDPR Principled' },
  { value: '1-6h', label: 'Activation Time' },
];

const AboutPage = () => {
  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 text-primary text-sm font-medium mb-6 glass">
              <Sparkles className="w-4 h-4" />
              Our Story
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
              Making AI{' '}
              <span className="gradient-text">Safe & Accessible</span>{' '}
              for Everyone
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              AI DEALS was born from a simple idea: students and creators everywhere deserve access to the world's best AI tools 
              without the complexity, risk, or cost that usually comes with it. We're building the trust-first AI platform 
              that Europe — and the world — needs.
            </p>
          </motion.div>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-4 mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 text-center"
              >
                <div className="text-3xl md:text-4xl font-display font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Founder Story */}
        <section className="container mx-auto px-4 mb-24">
          <div className="max-w-4xl mx-auto glass rounded-3xl p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold">Founder's Story</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    As a student in Europe, I saw how powerful AI tools could be — but also how inaccessible they were. 
                    Credit card requirements, complex setups, and privacy concerns kept most students locked out. 
                    The tools existed, but the access didn't.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    I built AI DEALS to change that. A platform where anyone — students, creators, parents — 
                    can access verified AI tools with zero friction, full privacy, and transparent pricing. 
                    Built in Europe, but designed for the world. No compromises on trust.
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    'Started as a student project in Brussels',
                    'Focus on European privacy and global accessibility',
                    'Manually curated, verified tool catalog',
                    'Community-driven with real user feedback',
                    'No overclaiming — radical transparency',
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
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="container mx-auto px-4 mb-24">
          <div className="max-w-4xl mx-auto glass rounded-3xl p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-start gap-6"
            >
              <div className="hidden md:flex w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center flex-shrink-0">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                  We exist to bridge the gap between premium AI technology and global accessibility. 
                  By handling accounts, security, and billing ourselves, we remove every barrier that 
                  keeps students and creators from using tools like ChatGPT, Midjourney, Claude, and more.
                </p>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Parents trust us because we prioritise safety. Students love us because we make it easy. 
                  Creators choose us because we respect their privacy. And everyone benefits from our 
                  commitment to European standards — no matter where they are in the world.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Pricing Model */}
        <section className="container mx-auto px-4 mb-24">
          <div className="max-w-4xl mx-auto glass rounded-3xl p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-start gap-6"
            >
              <div className="hidden md:flex w-16 h-16 rounded-2xl items-center justify-center flex-shrink-0" style={{ background: 'rgba(232,212,139,0.1)' }}>
                <Shield className="w-8 h-8" style={{ color: '#E8D48B' }} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">Our Pricing Model</h2>
                <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                  AI DEALS provides managed access to software tools. Our pricing reflects our structured 
                  access model — not traditional retail subscriptions.
                </p>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  By operating as a managed platform, we offer exclusive member pricing that makes premium 
                  AI tools accessible to students, creators, and professionals worldwide. Every price you 
                  see is our platform rate — transparent, consistent, and available to all members.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Europe Matters + Why Global Matters */}
        <section className="container mx-auto px-4 mb-24">
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <motion.div {...fadeUp} className="glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🇪🇺</span>
                <h3 className="text-xl font-display font-bold">Why Europe Matters</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Europe has set the global standard for digital privacy with GDPR. We built AI DEALS with 
                these principles at the core — not as an afterthought, but as a foundation. 
                Data minimisation, purpose limitation, and user control are baked into everything we do.
              </p>
            </motion.div>
            <motion.div {...fadeUp} className="glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-display font-bold">Why Global Access Matters</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                AI shouldn't be limited by geography. While we hold ourselves to European privacy standards, 
                our platform is open to students and creators worldwide. Premium AI access should be a 
                right — not a privilege limited by location or budget.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Trust Values */}
        <section className="container mx-auto px-4 mb-24">
          <motion.div
            {...fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Our <span className="gradient-text">Values</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything we build is guided by these principles.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-display font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default AboutPage;
