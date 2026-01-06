import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Play, Clock, Eye, ArrowRight, BookOpen, Video, Newspaper, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type FilterCategory = 'all' | 'tutorials' | 'news' | 'reviews';

interface ContentItem {
  id: string;
  type: 'video' | 'article';
  title: string;
  description: string;
  category: FilterCategory;
  thumbnail: string;
  duration?: string;
  readTime?: string;
  views?: string;
  author?: string;
  featured?: boolean;
  size: 'small' | 'medium' | 'large' | 'wide';
}

const ContentHub = () => {
  const { i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    window.scrollTo(0, 0);
  }, [i18n.language]);

  const filters: { key: FilterCategory; label: string; icon: typeof BookOpen }[] = [
    { key: 'all', label: 'All', icon: BookOpen },
    { key: 'tutorials', label: 'Tutorials', icon: Video },
    { key: 'news', label: 'News', icon: Newspaper },
    { key: 'reviews', label: 'Reviews', icon: Star },
  ];

  const contentItems: ContentItem[] = [
    {
      id: '1',
      type: 'video',
      title: 'Master ChatGPT: From Beginner to Pro',
      description: 'Complete guide to leveraging GPT-4 for productivity and creative work.',
      category: 'tutorials',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
      duration: '24:35',
      views: '128K',
      size: 'large',
      featured: true,
    },
    {
      id: '2',
      type: 'article',
      title: 'The Future of AI Image Generation',
      description: 'Exploring the latest advances in Midjourney, DALL-E, and Stable Diffusion.',
      category: 'news',
      thumbnail: 'https://images.unsplash.com/photo-1686191128892-3b37add1101e?w=800&q=80',
      readTime: '8 min',
      author: 'Sarah Chen',
      size: 'medium',
    },
    {
      id: '3',
      type: 'video',
      title: 'Claude AI Deep Dive',
      description: 'Understanding Anthropic\'s latest model capabilities.',
      category: 'reviews',
      thumbnail: 'https://images.unsplash.com/photo-1676299081847-c3b7c tried2cdb6?w=800&q=80',
      duration: '18:42',
      views: '89K',
      size: 'small',
    },
    {
      id: '4',
      type: 'article',
      title: 'Top 10 AI Productivity Hacks',
      description: 'Transform your workflow with these essential AI tips.',
      category: 'tutorials',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
      readTime: '5 min',
      author: 'Alex Rivera',
      size: 'wide',
    },
    {
      id: '5',
      type: 'video',
      title: 'Midjourney V6: Complete Tutorial',
      description: 'Everything new in the latest Midjourney release.',
      category: 'tutorials',
      thumbnail: 'https://images.unsplash.com/photo-1699839426298-dcb5c87df26b?w=800&q=80',
      duration: '32:15',
      views: '256K',
      size: 'medium',
    },
    {
      id: '6',
      type: 'article',
      title: 'OpenAI Announces GPT-5',
      description: 'Breaking down the next generation of language models.',
      category: 'news',
      thumbnail: 'https://images.unsplash.com/photo-1680474569854-81216b34417a?w=800&q=80',
      readTime: '6 min',
      author: 'Mike Johnson',
      size: 'small',
    },
    {
      id: '7',
      type: 'article',
      title: 'Gemini vs ChatGPT: Full Comparison',
      description: 'An in-depth analysis of Google\'s AI vs OpenAI\'s flagship.',
      category: 'reviews',
      thumbnail: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?w=800&q=80',
      readTime: '12 min',
      author: 'Emily Watson',
      size: 'medium',
    },
    {
      id: '8',
      type: 'video',
      title: 'AI for Content Creators',
      description: 'How to use AI tools for YouTube, TikTok, and Instagram.',
      category: 'tutorials',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
      duration: '28:00',
      views: '175K',
      size: 'small',
    },
  ];

  const filteredContent = activeFilter === 'all' 
    ? contentItems 
    : contentItems.filter(item => item.category === activeFilter);

  const getSizeClasses = (size: string, index: number) => {
    // Create an asymmetric bento layout
    const patterns: Record<string, string> = {
      large: 'md:col-span-2 md:row-span-2',
      wide: 'md:col-span-2',
      medium: 'md:col-span-1 md:row-span-2',
      small: 'md:col-span-1',
    };
    return patterns[size] || patterns.small;
  };

  return (
    <main className="min-h-screen mesh-gradient">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
              Content Hub
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-black mb-6 leading-tight">
              Discover the{' '}
              <span className="gradient-text">Future of AI</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Premium tutorials, breaking news, and expert reviews curated for AI enthusiasts.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Pills */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {filters.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilter === filter.key;
              return (
                <motion.button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative px-6 py-3 rounded-full font-medium text-sm flex items-center gap-2
                    transition-all duration-300 
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-lg' 
                      : 'glass text-muted-foreground hover:text-foreground hover:border-primary/30'
                    }
                  `}
                  style={{
                    boxShadow: isActive ? 'var(--glow-primary)' : 'none',
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {filter.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 rounded-full bg-primary -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]"
          >
            {filteredContent.map((item, index) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  group relative rounded-2xl overflow-hidden cursor-pointer
                  ${getSizeClasses(item.size, index)}
                `}
              >
                {/* Thumbnail with zoom effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                </div>

                {/* Video Play Button with 3D Glow */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      {/* Outer glow rings */}
                      <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-150 animate-pulse" />
                      <div className="absolute inset-0 rounded-full bg-primary/30 blur-lg scale-125" />
                      {/* Main button */}
                      <div 
                        className="relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
                          boxShadow: '0 10px 40px hsl(var(--primary) / 0.5), 0 0 60px hsl(var(--primary) / 0.3), inset 0 -4px 20px hsl(var(--secondary) / 0.4)',
                          transform: 'perspective(500px) rotateX(5deg)',
                        }}
                      >
                        <Play className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground ml-1" fill="currentColor" />
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Glassmorphism Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <div 
                    className="glass rounded-xl p-4 backdrop-blur-xl"
                    style={{
                      background: 'hsl(var(--background) / 0.7)',
                      borderColor: 'hsl(var(--foreground) / 0.1)',
                    }}
                  >
                    {/* Category & Meta */}
                    <div className="flex items-center gap-3 mb-3 text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-primary/20 text-primary font-medium capitalize">
                        {item.category}
                      </span>
                      {item.type === 'video' ? (
                        <>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3 h-3" /> {item.duration}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Eye className="w-3 h-3" /> {item.views}
                          </span>
                        </>
                      ) : (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3 h-3" /> {item.readTime} read
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-base md:text-lg leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>

                    {/* Description - only on larger cards */}
                    {(item.size === 'large' || item.size === 'wide' || item.size === 'medium') && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {item.description}
                      </p>
                    )}

                    {/* Author or CTA */}
                    <div className="flex items-center justify-between">
                      {item.author && (
                        <span className="text-xs text-muted-foreground">
                          by <span className="text-foreground">{item.author}</span>
                        </span>
                      )}
                      <motion.span
                        className="flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ x: 5 }}
                      >
                        {item.type === 'video' ? 'Watch' : 'Read'} <ArrowRight className="w-4 h-4" />
                      </motion.span>
                    </div>
                  </div>
                </div>

                {/* Featured badge */}
                {item.featured && (
                  <div className="absolute top-4 left-4">
                    <span 
                      className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                      style={{
                        background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
                        color: 'hsl(var(--primary-foreground))',
                        boxShadow: 'var(--glow-primary)',
                      }}
                    >
                      Featured
                    </span>
                  </div>
                )}
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-strong rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Stay Ahead of the AI Curve
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Get exclusive tutorials, early access to reviews, and breaking AI news delivered weekly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-xl font-semibold text-primary-foreground"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
                  boxShadow: 'var(--glow-primary)',
                }}
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ContentHub;
