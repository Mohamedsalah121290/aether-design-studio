import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Pricing = () => {
  const { t } = useTranslation();

  const plans = [
    {
      key: 'starter',
      popular: false,
    },
    {
      key: 'pro',
      popular: true,
    },
    {
      key: 'enterprise',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary font-semibold mb-4">
            {t('pricing.subtitle')}
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('pricing.description')}
          </p>

          {/* Monthly Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mt-8">
            <span className="text-sm font-medium text-primary">{t('pricing.monthly')}</span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const features = t(`pricing.plans.${plan.key}.features`, { returnObjects: true }) as string[];

            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative group ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-semibold px-4 py-1.5 rounded-full">
                      <Sparkles className="w-4 h-4" />
                      {t('pricing.popular')}
                    </div>
                  </div>
                )}

                {/* Card */}
                <div
                  className={`h-full rounded-3xl p-8 transition-all duration-500 ${
                    plan.popular
                      ? 'glass-strong relative overflow-hidden animate-glow-pulse'
                      : 'glass hover:border-primary/30'
                  }`}
                >
                  {/* Animated Gradient Border for Popular */}
                  {plan.popular && (
                    <>
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent opacity-20" />
                      <div className="absolute inset-[1px] rounded-[23px] bg-card" />
                    </>
                  )}

                  <div className="relative z-10">
                    {/* Plan Name */}
                    <h3 className="text-xl font-display font-bold mb-2">
                      {t(`pricing.plans.${plan.key}.name`)}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      {t(`pricing.plans.${plan.key}.description`)}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="text-5xl font-display font-bold">
                        ${t(`pricing.plans.${plan.key}.price`)}
                      </span>
                      <span className="text-muted-foreground">{t('pricing.perMonth')}</span>
                    </div>

                    {/* CTA Button */}
                    <Button
                      variant={plan.popular ? 'hero' : 'heroOutline'}
                      size="lg"
                      className="w-full mb-8"
                    >
                      {t('pricing.cta')}
                    </Button>

                    {/* Features */}
                    <ul className="space-y-4">
                      {features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                            plan.popular ? 'bg-primary/20' : 'bg-muted'
                          }`}>
                            <Check className={`w-3 h-3 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                          </div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;