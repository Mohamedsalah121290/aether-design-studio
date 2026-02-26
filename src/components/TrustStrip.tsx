import { Zap, ShieldCheck, Headphones } from 'lucide-react';

const items = [
{ icon: Zap, label: 'Instant Delivery' },
{ icon: ShieldCheck, label: 'Secure Checkout' },
{ icon: Headphones, label: '24/7 Support' }];


const TrustStrip = () =>
<div className="relative z-30 border-b border-white/5">
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
      <div className="items-center justify-center gap-8 flex flex-row text-cyan-400 mx-0 my-px py-[10px] px-0 border border-secondary border-dashed rounded-md shadow-md opacity-65">
        {items.map(({ icon: Icon, label }) =>
      <div key={label} className="flex items-center gap-2 text-xs text-white/40">
            <Icon className="w-3.5 h-3.5 text-white/30" />
            <span className="hidden sm:inline font-medium">{label}</span>
          </div>
      )}
      </div>
    </div>
  </div>;


export default TrustStrip;