import { CreditCard, Euro, Headphones, ShieldCheck, Zap } from 'lucide-react';

const badges = [
  { icon: ShieldCheck, label: 'Secure checkout' },
  { icon: Euro, label: 'EUR payment' },
  { icon: Zap, label: 'Fast digital delivery' },
  { icon: Headphones, label: 'Support available' },
  { icon: CreditCard, label: 'Verified access' },
];

const TrustBadges = ({ compact = false }: { compact?: boolean }) => (
  <div className="flex flex-wrap items-center justify-center gap-2">
    {badges.map(({ icon: Icon, label }) => (
      <span key={label} className={`${compact ? 'text-[10px] px-2 py-1' : 'text-xs px-3 py-1.5'} inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground`}>
        <Icon className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        {label}
      </span>
    ))}
  </div>
);

export default TrustBadges;