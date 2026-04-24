import { useEffect, useMemo, useState } from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { getAverageRating, getBeforeAfterCopy, getProductReviews, type ProductReview } from '@/lib/productReviews';

const Stars = ({ rating, className = 'w-3 h-3' }: { rating: 4 | 5; className?: string }) => (
  <span className="inline-flex items-center gap-0.5" aria-label={`${rating} star rating`}>
    {Array.from({ length: 5 }).map((_, index) => (
      <Star key={index} className={`${className} ${index < rating ? 'fill-current' : ''}`} />
    ))}
  </span>
);

const Avatar = ({ review }: { review: ProductReview }) => {
  const initials = review.name.split(' ').map(part => part[0]).join('').slice(0, 2);
  return (
    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-muted-foreground">
      {initials}
    </span>
  );
};

export const ProductRatingInline = ({ toolId, productName }: { toolId?: string; productName: string }) => {
  const rating = getAverageRating(toolId, productName);
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <Stars rating={Math.round(rating) as 4 | 5} />
      <span>{rating.toFixed(1)}</span>
      <span className="inline-flex items-center gap-1">
        <ShieldCheck className="w-3 h-3" /> Verified
      </span>
    </div>
  );
};

export const ProductReviewPreview = ({ toolId, productName }: { toolId?: string; productName: string }) => {
  const reviews = useMemo(() => getProductReviews(toolId, productName), [toolId, productName]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = window.setInterval(() => setActive(current => (current + 1) % reviews.length), 5000);
    return () => window.clearInterval(timer);
  }, [reviews.length]);

  const review = reviews[active];
  if (!review) return null;

  return (
    <div className="flex items-start gap-2 rounded-xl bg-white/[0.03] border border-white/10 p-2.5">
      <Avatar review={review} />
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="truncate">{review.name} {review.flag}</span>
          <Stars rating={review.rating} className="w-2.5 h-2.5" />
        </div>
        <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">“{review.quote}”</p>
      </div>
    </div>
  );
};

export const ProductReviewsCarousel = ({ toolId, productName }: { toolId?: string; productName: string }) => {
  const reviews = useMemo(() => getProductReviews(toolId, productName), [toolId, productName]);
  const [page, setPage] = useState(0);
  const visibleCount = Math.min(3, reviews.length);

  useEffect(() => {
    if (reviews.length <= visibleCount) return;
    const timer = window.setInterval(() => setPage(current => (current + 1) % reviews.length), 6000);
    return () => window.clearInterval(timer);
  }, [reviews.length, visibleCount]);

  const visibleReviews = reviews.length <= visibleCount
    ? reviews
    : Array.from({ length: visibleCount }, (_, index) => reviews[(page + index) % reviews.length]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Stars rating={Math.round(getAverageRating(toolId, productName)) as 4 | 5} className="w-3.5 h-3.5" />
          <span>Verified reviews</span>
        </div>
        <span className="text-[11px] text-muted-foreground">{reviews.length} buyers</span>
      </div>
      <div className="space-y-2">
        {visibleReviews.map((review) => (
          <div key={`${productName}-${review.name}-${review.country}`} className="flex items-start gap-3 rounded-xl bg-white/[0.03] border border-white/10 p-3">
            <Avatar review={review} />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                <span className="font-medium text-white">{review.name}</span>
                <span className="text-muted-foreground">{review.flag} {review.country}</span>
                <span className="inline-flex items-center gap-1 text-muted-foreground"><ShieldCheck className="w-3 h-3" /> Verified</span>
              </div>
              <Stars rating={review.rating} />
              {(() => {
                const story = getBeforeAfterCopy(review, productName);
                return (
                  <div className="space-y-2 pt-1">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Before</p>
                      <p className="text-[11px] leading-relaxed text-muted-foreground">{story.before}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">After</p>
                      <p className="text-xs leading-relaxed text-muted-foreground">“{story.after}”</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};