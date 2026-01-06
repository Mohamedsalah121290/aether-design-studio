import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Cpu, 
  BarChart3, 
  Wand2, 
  Plug, 
  Shield, 
  Headphones,
  ArrowRight
} from 'lucide-react';

const Features = () => {
  const { t } = useTranslation();

  const features = [
    {
      key: 'automation',
      icon: Cpu,
      gradient: 'from-primary to-primary/50',
      size: 'large',
    },
    {
      key: 'analytics',
      icon: BarChart3,
      gradient: 'from-secondary to-secondary/50',
      size: 'medium',
    },
    {
      key: 'generation',
      icon: Wand2,
      gradient: 'from-accent to-accent/50',
      size: 'medium',
    },
    {
      key: 'integration',
      icon: Plug,
      gradient: 'from-primary to-secondary',
      size: 'small',
    },
    {
      key: 'security',
      icon: Shield,
      gradient: 'from-secondary to-accent',
      size: 'small',
    },
    {
      key: 'support',
      icon: Headphones,
      gradient: 'from-accent to-primary',
      size: 'small',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

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
            {t('features.subtitle')}
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('features.description')}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isLarge = feature.size === 'large';
            const isMedium = feature.size === 'medium';

            return (
              <motion.div
                key={feature.key}
                variants={itemVariants}
                className={`bento-item group cursor-pointer ${
                  isLarge ? 'md:col-span-2 lg:col-span-2 lg:row-span-2' : ''
                } ${isMedium ? 'lg:col-span-2' : ''}`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`flex flex-col ${isLarge ? 'h-full min-h-[400px]' : 'h-full min-h-[200px]'}`}>
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className={`font-display font-bold mb-3 ${isLarge ? 'text-2xl' : 'text-xl'}`}>
                      {t(`features.items.${feature.key}.title`)}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t(`features.items.${feature.key}.description`)}
                    </p>
                  </div>

                  {/* Hover Arrow */}
                  <div className="mt-6 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>

                  {/* Large card decorative element */}
                  {isLarge && (
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-primary/5 to-transparent rounded-tl-full pointer-events-none" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;