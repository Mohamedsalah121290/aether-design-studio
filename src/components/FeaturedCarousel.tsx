import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Crown, TrendingUp, Star } from 'lucide-react';
import { ToolCard, Tool } from './ToolCard';

const FEATURED_TOOL_IDS = ['chatgpt', 'claude', 'gemini', 'midjourney', 'canva', 'perplexity'];

const BADGES: Record<string, { label: string; icon: React.ElementType }> = {
  chatgpt: { label: 'Most Popular', icon: Star },
  claude: { label: 'Trending', icon: TrendingUp },
  gemini: { label: 'Trending', icon: TrendingUp },
  midjourney: { label: 'Most Popular', icon: Star },
  canva: { label: 'Trending', icon: TrendingUp },
  perplexity: { label: 'Trending', icon: TrendingUp },
};

interface FeaturedCarouselProps {
  tools: Tool[];
}

const FeaturedCarousel = ({ tools }: FeaturedCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const featured = tools.filter(t => FEATURED_TOOL_IDS.includes(t.tool_id));

  if (featured.length === 0) return null;

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.6;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-20 relative"
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 flex items-center justify-center rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
              boxShadow: '0 0 40px hsl(var(--primary) / 0.4), 0 0 80px hsl(var(--primary) / 0.15)',
            }}
          >
            <Crown className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3
              className="text-3xl md:text-4xl font-display font-black tracking-tight"
              style={{ textShadow: '0 0 50px hsl(var(--primary) / 0.3)' }}
            >
              Featured AI Tools
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Handpicked for maximum impact
            </p>
          </div>
        </div>

        {/* Scroll arrows */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-muted/50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-muted/50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Divider glow */}
      <div
        className="h-px mb-8 rounded-full"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.4) 30%, hsl(var(--secondary) / 0.4) 70%, transparent 100%)',
          boxShadow: '0 0 12px hsl(var(--primary) / 0.3)',
        }}
      />

      {/* Horizontally scrollable carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {featured.map((tool, i) => {
          const badge = BADGES[tool.tool_id];
          const BadgeIcon = badge?.icon || Star;
          return (
            <div
              key={tool.id}
              className="flex-shrink-0 w-[320px] sm:w-[350px] snap-start relative"
            >
              {/* Badge */}
              {badge && (
                <div className="absolute -top-3 left-6 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
                    boxShadow: '0 4px 15px hsl(var(--primary) / 0.4)',
                    color: 'white',
                  }}
                >
                  <BadgeIcon className="w-3 h-3" />
                  {badge.label}
                </div>
              )}
              <ToolCard tool={tool} index={i} tier="featured" />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FeaturedCarousel;
