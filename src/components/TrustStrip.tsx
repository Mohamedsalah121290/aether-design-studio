import { Zap, ShieldCheck, Headphones } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const items = [
{ icon: Zap, labelKey: 'trust.instantDelivery' },
{ icon: ShieldCheck, labelKey: 'trust.secureCheckout' },
{ icon: Headphones, labelKey: 'trust.support' }];


const TrustStrip = () => {
  const { t } = useTranslation();
  return <div className="relative z-30 border-b border-white/5">
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
      <div className="items-center justify-center gap-8 flex flex-row text-cyan-400 mx-0 my-px py-[10px] px-0 border border-secondary border-dashed rounded-md shadow-md opacity-65">
        {items.map(({ icon: Icon, labelKey }) =>
      <div key={labelKey} className="flex items-center gap-2 text-xs text-white/40">
            <Icon className="w-3.5 h-3.5 text-white/30" />
            <span className="hidden sm:inline font-medium">{t(labelKey)}</span>
          </div>
      )}
      </div>
    </div>
  </div>;
};


export default TrustStrip;