import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Palette, Zap, Shield, Lock, Users, Headphones, CreditCard, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ToolCard, Tool } from '@/components/ToolCard';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const whyAI = [
  {
    icon: BookOpen,
    title: 'Supercharge Studying',
    description: 'AI helps students research faster, summarize notes, and understand complex topics with personalized explanations.',
  },
  {
    icon: Palette,
    title: 'Unlock Creativity',
    description: 'From generating artwork to composing music, AI tools open new creative possibilities for every project.',
  },
  {
    icon: Zap,
    title: 'Boost Productivity',
    description: 'Automate repetitive tasks, organize workflows, and get more done in less time with intelligent assistants.',
  },
];

const whySafe = [
  { icon: Shield, title: 'Curated & Vetted', description: 'Every tool is reviewed for safety and age-appropriateness.' },
  { icon: Lock, title: 'No Password Sharing', description: 'We handle all accounts — students never share credentials.' },
  { icon: Users, title: 'Parent Approved', description: 'Designed with parental trust and transparency in mind.' },
  { icon: Headphones, title: '24/7 Support', description: 'Our team is always available to help with any issue.' },
];

const forParents = [
  'We handle accounts so your child doesn\'t need credit cards',
  'Every tool is curated and safe for student use',
  'Transparent pricing — no hidden fees or surprise charges',
  'Cancel anytime, no long-term commitments',
  'Dedicated support for parents and students',
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
        {/* Hero */}
        <Hero />

        {/* Why AI for Students */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <motion.div {...fadeUp} className="text-center mb-16">
              <span className="inline-block text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                Why AI?
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                AI Gives Students a <span className="gradient-text">Superpower</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                The right AI tools help students learn faster, create better, and achieve more.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {whyAI.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass rounded-2xl p-8 text-center hover:border-primary/30 transition-all duration-300 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-display font-bold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why AI DEALS is Safe */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div {...fadeUp} className="text-center mb-16">
              <span className="inline-block text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                Trust & Safety
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                Why AI DEALS is <span className="gradient-text">Safe</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Built from the ground up with student safety and parent peace of mind at the core.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
              {whySafe.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-300"
                  >
                    <Icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-display font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Tools */}
        {featuredTools.length > 0 && (
          <section className="py-24 relative">
            <div className="container mx-auto px-4">
              <motion.div {...fadeUp} className="text-center mb-12">
                <span className="inline-block text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                  Featured
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                  Popular <span className="gradient-text">AI Tools</span>
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                  Hand-picked tools trusted by thousands of students worldwide.
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

        {/* For Parents */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto glass rounded-3xl p-8 md:p-12">
              <motion.div {...fadeUp}>
                <div className="grid md:grid-cols-2 gap-10 items-center">
                  <div>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 text-primary text-xs font-medium mb-5 glass">
                      <Users className="w-3.5 h-3.5" />
                      For Parents
                    </span>
                    <h2 className="text-2xl md:text-4xl font-display font-bold mb-4 leading-tight">
                      Your Child's AI Journey,{' '}
                      <span className="gradient-text">Made Safe</span>
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We understand your concerns about AI and young users. That's why we've built 
                      AI DEALS to be the safest way for students to access premium AI tools — with 
                      full transparency and zero risk.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {forParents.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground text-sm">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <CTA />
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
