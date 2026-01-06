import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Check, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Pricing = () => {
  const { t } = useTranslation();

  const plans = [
    {
      key: 'starter',
      popular: false,
      icon: Zap,
    },
    {
      key: 'pro',
      popular: true,
      icon: Sparkles,
    },
    {
      key: 'enterprise',
      popular: false,
      icon: Zap,
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

          {/* Monthly Only Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="inline-flex items-center gap-2 glass-strong px-6 py-3 rounded-full mt-8 border border-primary/30"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">Monthly Billing Only</span>
          </motion.div>
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
                className={`relative group ${plan.popular ? 'md:-mt-6 md:mb-6' : ''}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="absolute -top-5 left-1/2 -translate-x-1/2 z-20"
                  >
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground text-sm font-bold px-5 py-2 rounded-full shadow-lg">
                      <Sparkles className="w-4 h-4" />
                      {t('pricing.popular')}
                    </div>
                  </motion.div>
                )}

                {/* Card with Glassmorphism */}
                <div
                  className={`relative h-full rounded-3xl transition-all duration-500 ${
                    plan.popular
                      ? 'scale-105'
                      : 'hover:scale-[1.02]'
                  }`}
                >
                  {/* Animated Glowing Border for Pro Plan */}
                  {plan.popular && (
                    <>
                      {/* Animated gradient border */}
                      <motion.div
                        className="absolute -inset-[2px] rounded-3xl opacity-75"
                        style={{
                          background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)), hsl(var(--primary)))',
                          backgroundSize: '300% 100%',
                        }}
                        animate={{
                          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                      {/* Glow effect */}
                      <motion.div
                        className="absolute -inset-4 rounded-3xl blur-xl opacity-30"
                        style={{
                          background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)), hsl(var(--primary)))',
                          backgroundSize: '300% 100%',
                        }}
                        animate={{
                          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                    </>
                  )}

                  {/* Glass Card Content */}
                  <div
                    className={`relative h-full rounded-3xl p-8 backdrop-blur-xl border ${
                      plan.popular
                        ? 'bg-card/90 border-transparent'
                        : 'glass border-border/50 hover:border-primary/30'
                    }`}
                    style={{
                      boxShadow: plan.popular 
                        ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    {/* Plan Icon */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                      plan.popular 
                        ? 'bg-gradient-to-br from-primary to-secondary' 
                        : 'glass border border-border/50'
                    }`}>
                      <plan.icon className={`w-6 h-6 ${plan.popular ? 'text-primary-foreground' : 'text-primary'}`} />
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-2xl font-display font-bold mb-2">
                      {t(`pricing.plans.${plan.key}.name`)}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6 min-h-[40px]">
                      {t(`pricing.plans.${plan.key}.description`)}
                    </p>

                    {/* Price with Per Month */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-5xl font-display font-bold ${plan.popular ? 'gradient-text' : ''}`}>
                          ${t(`pricing.plans.${plan.key}.price`)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-primary mt-1 inline-block">
                        Per Month
                      </span>
                    </div>

                    {/* CTA Button */}
                    <Button
                      variant={plan.popular ? 'hero' : 'heroOutline'}
                      size="lg"
                      className="w-full mb-8"
                    >
                      {plan.popular ? 'Get Started Now' : t('pricing.cta')}
                    </Button>

                    {/* Features */}
                    <ul className="space-y-4">
                      {features.map((feature, i) => (
                        <motion.li 
                          key={i} 
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.1 * i }}
                          className="flex items-start gap-3"
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            plan.popular 
                              ? 'bg-gradient-to-br from-primary to-secondary' 
                              : 'bg-primary/20'
                          }`}>
                            <Check className={`w-3 h-3 ${plan.popular ? 'text-primary-foreground' : 'text-primary'}`} />
                          </div>
                          <span className={`text-sm ${plan.popular ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-12"
        >
          All plans are billed monthly. Cancel anytime with no questions asked.
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;