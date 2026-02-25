import { useRef } from 'react';
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
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl grid place-items-center bg-white/5 border border-white/10">
              <Crown className="w-5 h-5 text-white/60" />
            </div>
            <div className="space-y-0.5">
              <h2 className="text-white text-xl font-semibold tracking-tight">Featured AI Tools</h2>
              <p className="text-white/50 text-sm">Handpicked for maximum impact</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-9 h-9 rounded-lg grid place-items-center bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-white/50" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-9 h-9 rounded-lg grid place-items-center bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-white/50" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mt-4 mb-6 bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-5 lg:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featured.map((tool, i) => {
            const badge = BADGES[tool.tool_id];
            const BadgeIcon = badge?.icon || Star;
            return (
              <div key={tool.id} className="flex-shrink-0 w-[280px] sm:w-[300px] snap-start relative">
                {badge && (
                  <div className="absolute -top-2.5 left-5 z-20 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold bg-white/[0.07] border border-white/10 text-white/80 backdrop-blur-sm">
                    <BadgeIcon className="w-2.5 h-2.5" />
                    {badge.label}
                  </div>
                )}
                <ToolCard tool={tool} index={i} tier="featured" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCarousel;
