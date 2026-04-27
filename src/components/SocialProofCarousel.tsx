import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, ShieldCheck } from 'lucide-react';
import { socialProofReviews } from '@/lib/socialProof';
import { getStoredRegion } from '@/lib/geo';
import { getProductLogoByName } from '@/lib/productLogos';

const Stars = ({ rating }: { rating: 4 | 5 }) => (
  <span className="flex gap-1">
    {Array.from({ length: 5 }).map((_, index) => (
      <Star key={index} className={`w-3.5 h-3.5 ${index < rating ? 'fill-current' : ''}`} style={{ color: 'hsl(45 93% 58%)' }} />
    ))}
  </span>
);

const SocialProofCarousel = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const visibleCount = 6;

  useEffect(() => {
    const timer = window.setInterval(() => setPage(current => (current + visibleCount) % socialProofReviews.length), 9000);
    return () => window.clearInterval(timer);
  }, []);

  const orderedReviews = useMemo(() => {
    const region = getStoredRegion();
    const countryByRegion = { belgium: 'Belgium', germany: 'Germany', france: 'France', netherlands: 'Netherlands', italy: 'Italy', spain: 'Spain' } as const;
    const country = countryByRegion[region as keyof typeof countryByRegion];
    return country ? [...socialProofReviews].sort((a, b) => Number(b.country === country) - Number(a.country === country)) : socialProofReviews;
  }, []);

  const visible = useMemo(
    () => Array.from({ length: visibleCount }, (_, index) => orderedReviews[(page + index) % orderedReviews.length]),
    [page, orderedReviews]
  );

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-6xl mx-auto">
      {visible.map((item) => (
        <div key={`${item.name}-${item.product}`} className="glass rounded-2xl p-5 hover:border-primary/30 transition-all duration-300">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">{item.name.charAt(0)}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-display font-bold truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground truncate">{item.flag} {item.country}</p>
              </div>
            </div>
            <Stars rating={item.rating} />
          </div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-primary">
            {getProductLogoByName(item.product) && <img src={getProductLogoByName(item.product)!} alt={`${item.product} logo`} className="h-4 w-4 object-contain" loading="lazy" />}
            <span>{item.product}</span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">“{item.quote}”</p>
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="w-3 h-3" /> {t('social.verifiedAccess', 'Verified access')}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SocialProofCarousel;