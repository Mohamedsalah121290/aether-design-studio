import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Headphones } from 'lucide-react';

const items = [
  { icon: Zap, label: 'Instant Delivery' },
  { icon: ShieldCheck, label: 'Secure Checkout' },
  { icon: Headphones, label: '24/7 Support' },
];

const TrustStrip = () => (
  <div className="relative z-30 border-b border-border/50">
    {/* Subtle glow line */}
    <div
      className="absolute bottom-0 left-0 right-0 h-px"
      style={{
        background:
          'linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.3) 50%, transparent 100%)',
        boxShadow: '0 0 8px hsl(var(--primary) / 0.15)',
      }}
    />
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-center gap-8 py-3">
        {items.map(({ icon: Icon, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground"
          >
            <Icon className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline font-medium">{label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default TrustStrip;
