import { motion } from 'framer-motion';
import { RefreshCw, Layers, Headphones, ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useTranslation } from 'react-i18next';

const trustCards = [
  {
    icon: RefreshCw,
    title: '30-Day Refund Policy',
    description:
      'Not satisfied? Get a full refund within 30 days of purchase, no questions asked.',
  },
  {
    icon: Layers,
    title: 'How It Works',
    description:
      'Pick a tool → choose a plan → checkout securely → receive access within hours.',
  },
  {
    icon: Headphones,
    title: 'Priority Support',
    description:
      'Our dedicated team is available 24/7 via chat and email to help you with anything.',
  },
];

const TrustAndFAQ = () => {
  const { t } = useTranslation();
  const faqItems = t('storeFaq.items', { returnObjects: true }) as { q: string; a: string }[];

  return (
  <section className="relative py-24 overflow-hidden">
    {/* Background glow */}
    <div className="absolute inset-0 pointer-events-none">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-20"
        style={{ background: 'hsl(var(--primary))' }}
      />
    </div>

    <div className="container mx-auto px-4 relative z-10">
      {/* ── Trust Cards ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-20"
      >
        <h3
          className="text-3xl md:text-4xl font-display font-black text-center mb-4 tracking-tight"
          style={{ textShadow: '0 0 40px hsl(var(--primary) / 0.2)' }}
        >
          {t('storeFaq.trustTitle', 'Why Thousands Trust Us')}
        </h3>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
          {t('storeFaq.trustSubtitle', 'Premium AI access backed by security, speed, and world-class support.')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trustCards.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-strong rounded-2xl p-8 text-center group hover:scale-[1.02] transition-transform duration-300"
            >
              <div
                className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'hsl(var(--primary) / 0.1)',
                  boxShadow: '0 0 25px hsl(var(--primary) / 0.1)',
                }}
              >
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-display font-bold text-lg mb-2 text-foreground">{title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h3
          className="text-3xl md:text-4xl font-display font-black text-center mb-4 tracking-tight"
          style={{ textShadow: '0 0 40px hsl(var(--primary) / 0.2)' }}
        >
          {t('storeFaq.title', 'Frequently Asked Questions')}
        </h3>
        <p className="text-muted-foreground text-center mb-10">
          {t('storeFaq.subtitle', 'Everything you need to know about our AI marketplace.')}
        </p>

        <Accordion type="single" collapsible className="space-y-3">
          {faqItems.map(({ q, a }, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="glass-strong rounded-2xl border-0 px-6 overflow-hidden"
            >
              <AccordionTrigger className="py-5 text-left font-semibold text-foreground hover:no-underline text-sm md:text-base">
                {q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm text-muted-foreground leading-relaxed">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  </section>
  );
};

export default TrustAndFAQ;
