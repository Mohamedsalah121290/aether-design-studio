import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { recentActivities } from '@/lib/socialProof';
import { getProductLogoByName } from '@/lib/productLogos';

const RecentActivityToast = () => {
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    let count = 0;
    let hideTimer: number | undefined;
    let loopTimer: number | undefined;

    const showNext = () => {
      if (count >= 5) return;
      setIndex(count % recentActivities.length);
      count += 1;
      hideTimer = window.setTimeout(() => setIndex(null), 5200);
      loopTimer = window.setTimeout(showNext, 36000);
    };

    const startTimer = window.setTimeout(showNext, 10000);
    return () => {
      window.clearTimeout(startTimer);
      if (hideTimer) window.clearTimeout(hideTimer);
      if (loopTimer) window.clearTimeout(loopTimer);
    };
  }, []);

  const activity = index == null ? null : recentActivities[index];
  const logoUrl = getProductLogoByName(activity?.product);

  return (
    <AnimatePresence>
      {activity && (
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.98 }}
          className="fixed z-40 start-3 end-3 bottom-4 sm:start-5 sm:end-auto sm:bottom-5 sm:max-w-[340px] rounded-2xl border border-white/10 bg-background/90 backdrop-blur-xl p-3 shadow-2xl pointer-events-none"
        >
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/5 border border-white/10 text-base">
              {activity.flag}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <ShieldCheck className="w-3 h-3" /> Recent activity
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs leading-relaxed text-foreground">
                <span>{activity.name} from {activity.country} recently purchased</span>
                {logoUrl && <img src={logoUrl} alt={`${activity.product} logo`} className="h-4 w-4 shrink-0 object-contain" loading="lazy" />}
                <span>{activity.product}</span>
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecentActivityToast;