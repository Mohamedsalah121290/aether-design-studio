import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Play, Clock, Eye, ArrowRight, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: string;
  videoUrl: string;
}

interface ArticleItem {
  id: string;
  title: string;
  snippet: string;
  category: string;
  author: string;
  readTime: string;
  thumbnail: string;
  date: string;
}

const ContentHub = () => {
  const { i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [visibleArticles, setVisibleArticles] = useState(6);
  const [videoScrollPosition, setVideoScrollPosition] = useState(0);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    window.scrollTo(0, 0);
  }, [i18n.language]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedVideo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedVideo]);

  const featuredVideos: VideoItem[] = [
    {
      id: 'v1',
      title: 'Master ChatGPT: From Beginner to Pro',
      description: 'Complete guide to leveraging GPT-4 for productivity, creative writing, and problem-solving. Learn advanced prompting techniques used by experts.',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
      duration: '24:35',
      views: '128K',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      id: 'v2',
      title: 'Midjourney V6: Complete Tutorial',
      description: 'Everything new in the latest Midjourney release including enhanced realism, text rendering, and style controls.',
      thumbnail: 'https://images.unsplash.com/photo-1699839426298-dcb5c87df26b?w=800&q=80',
      duration: '32:15',
      views: '256K',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      id: 'v3',
      title: 'Claude AI Deep Dive',
      description: 'Understanding Anthropic\'s latest model capabilities and how to maximize its potential for complex tasks.',
      thumbnail: 'https://images.unsplash.com/photo-1676299081847-c3b7c4c9cdb6?w=800&q=80',
      duration: '18:42',
      views: '89K',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      id: 'v4',
      title: 'AI for Content Creators',
      description: 'How to use AI tools for YouTube, TikTok, and Instagram content creation workflow optimization.',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
      duration: '28:00',
      views: '175K',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      id: 'v5',
      title: 'DALL-E 3 Masterclass',
      description: 'Advanced techniques for generating stunning AI art with precise control over composition and style.',
      thumbnail: 'https://images.unsplash.com/photo-1686191128892-3b37add1101e?w=800&q=80',
      duration: '22:10',
      views: '143K',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      id: 'v6',
      title: 'Gemini Pro Tips',
      description: 'Unlock the full potential of Google\'s Gemini with these advanced prompting strategies.',
      thumbnail: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?w=800&q=80',
      duration: '19:45',
      views: '67K',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      id: 'v7',
      title: 'AI Coding Assistants Compared',
      description: 'GitHub Copilot vs Cursor vs Claude: Which AI coding assistant is right for your workflow?',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
      duration: '35:20',
      views: '198K',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
  ];

  const allArticles: ArticleItem[] = [
    {
      id: 'a1',
      title: 'The Ultimate ChatGPT Prompt Engineering Guide',
      snippet: 'Master the art of crafting prompts that get you exactly the results you need. From basic principles to advanced techniques.',
      category: 'ChatGPT Guide',
      author: 'Sarah Chen',
      readTime: '12 min',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
      date: 'Jan 5, 2026',
    },
    {
      id: 'a2',
      title: '10 Design Tips for AI-Generated Images',
      snippet: 'Elevate your AI art with these professional design principles that separate amateur work from stunning visuals.',
      category: 'Design Tips',
      author: 'Alex Rivera',
      readTime: '8 min',
      thumbnail: 'https://images.unsplash.com/photo-1686191128892-3b37add1101e?w=600&q=80',
      date: 'Jan 4, 2026',
    },
    {
      id: 'a3',
      title: 'How to Build a Side Business with AI Tools',
      snippet: 'Discover proven strategies for monetizing AI skills and building a sustainable income stream in the AI economy.',
      category: 'Business',
      author: 'Mike Johnson',
      readTime: '15 min',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
      date: 'Jan 3, 2026',
    },
    {
      id: 'a4',
      title: 'Midjourney vs DALL-E 3: Complete Comparison',
      snippet: 'An in-depth analysis of the two leading AI image generators, including use cases, pricing, and output quality.',
      category: 'Tool Review',
      author: 'Emily Watson',
      readTime: '10 min',
      thumbnail: 'https://images.unsplash.com/photo-1699839426298-dcb5c87df26b?w=600&q=80',
      date: 'Jan 2, 2026',
    },
    {
      id: 'a5',
      title: 'AI Writing Tools for Content Marketers',
      snippet: 'The essential toolkit for modern content creators: from ideation to editing, these AI tools will transform your workflow.',
      category: 'Content Marketing',
      author: 'Jessica Park',
      readTime: '9 min',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80',
      date: 'Jan 1, 2026',
    },
    {
      id: 'a6',
      title: 'Getting Started with Claude for Research',
      snippet: 'Learn how researchers are using Claude to analyze papers, synthesize findings, and accelerate discovery.',
      category: 'Research',
      author: 'Dr. James Liu',
      readTime: '11 min',
      thumbnail: 'https://images.unsplash.com/photo-1676299081847-c3b7c4c9cdb6?w=600&q=80',
      date: 'Dec 31, 2025',
    },
    {
      id: 'a7',
      title: 'Voice AI: The Next Frontier',
      snippet: 'From ElevenLabs to OpenAI\'s voice features, explore how voice AI is revolutionizing content creation.',
      category: 'Trends',
      author: 'Maria Santos',
      readTime: '7 min',
      thumbnail: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?w=600&q=80',
      date: 'Dec 30, 2025',
    },
    {
      id: 'a8',
      title: 'Automating Your Workflow with AI Agents',
      snippet: 'Step-by-step guide to setting up AI agents that handle repetitive tasks and boost your productivity.',
      category: 'Automation',
      author: 'Tom Bradley',
      readTime: '14 min',
      thumbnail: 'https://images.unsplash.com/photo-1680474569854-81216b34417a?w=600&q=80',
      date: 'Dec 29, 2025',
    },
    {
      id: 'a9',
      title: 'The Ethics of AI-Generated Content',
      snippet: 'Navigating the complex landscape of AI ethics, copyright, and best practices for responsible AI use.',
      category: 'Ethics',
      author: 'Prof. Anna Klein',
      readTime: '13 min',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
      date: 'Dec 28, 2025',
    },
    {
      id: 'a10',
      title: 'AI Tools for Small Business Owners',
      snippet: 'Budget-friendly AI solutions that can help small businesses compete with larger competitors.',
      category: 'Small Business',
      author: 'David Chen',
      readTime: '8 min',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
      date: 'Dec 27, 2025',
    },
    {
      id: 'a11',
      title: 'Prompt Libraries: Your Secret Weapon',
      snippet: 'How to build and organize a prompt library that saves time and improves your AI output consistency.',
      category: 'Productivity',
      author: 'Lisa Thompson',
      readTime: '6 min',
      thumbnail: 'https://images.unsplash.com/photo-1686191128892-3b37add1101e?w=600&q=80',
      date: 'Dec 26, 2025',
    },
    {
      id: 'a12',
      title: 'AI in Education: A Teacher\'s Guide',
      snippet: 'Practical strategies for educators to integrate AI tools while maintaining academic integrity.',
      category: 'Education',
      author: 'Robert Williams',
      readTime: '10 min',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80',
      date: 'Dec 25, 2025',
    },
  ];

  // Filter articles based on search
  const filteredArticles = allArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.snippet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedArticles = filteredArticles.slice(0, visibleArticles);
  const hasMoreArticles = visibleArticles < filteredArticles.length;

  const scrollVideos = (direction: 'left' | 'right') => {
    const container = document.getElementById('video-scroll-container');
    if (container) {
      const scrollAmount = 400;
      const newPosition = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setVideoScrollPosition(newPosition);
    }
  };

  return (
    <main className="min-h-screen mesh-gradient">
      <Navbar />

      {/* Hero Section with Search */}
      <section className="pt-32 pb-12 relative overflow-hidden">
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 leading-tight tracking-tight">
              Expert AI{' '}
              <span className="gradient-text">Knowledge</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              Curated tutorials, in-depth guides, and expert insights to master every AI tool.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative max-w-xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleArticles(6);
                  }}
                  placeholder="Search articles by topic, tool, or category..."
                  className="w-full pl-14 pr-5 py-4 rounded-2xl bg-card/80 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Videos Section */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
                Featured This Month
              </h2>
              <p className="text-muted-foreground">
                7 hand-picked video tutorials from our experts
              </p>
            </div>
            <div className="hidden md:flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollVideos('left')}
                className="rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollVideos('right')}
                className="rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          {/* Horizontal Scroll Container */}
          <div className="relative">
            <div
              id="video-scroll-container"
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {featuredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex-shrink-0 w-[320px] md:w-[380px] snap-start"
                >
                  <div
                    onClick={() => setSelectedVideo(video)}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-video"
                  >
                    {/* Thumbnail */}
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                    {/* Play Button with 3D Glow */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative"
                      >
                        <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl scale-150 group-hover:animate-pulse" />
                        <div className="absolute inset-0 rounded-full bg-primary/40 blur-lg scale-125" />
                        <div 
                          className="relative w-16 h-16 rounded-full flex items-center justify-center transition-transform"
                          style={{
                            background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
                            boxShadow: '0 8px 32px hsl(var(--primary) / 0.5), 0 0 40px hsl(var(--primary) / 0.3), inset 0 -3px 15px hsl(var(--secondary) / 0.4)',
                          }}
                        >
                          <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
                        </div>
                      </motion.div>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-2.5 py-1 rounded-lg bg-background/80 backdrop-blur-sm text-xs font-medium flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {video.duration}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="font-display font-bold text-base leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {video.views} views
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Latest Articles
            </h2>
            <p className="text-muted-foreground">
              {searchQuery 
                ? `${filteredArticles.length} results for "${searchQuery}"` 
                : 'In-depth guides and expert insights'}
            </p>
          </motion.div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <AnimatePresence mode="popLayout">
              {displayedArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <Link to={`/article/${article.id}`} className="block h-full">
                    <div className="glass rounded-2xl overflow-hidden h-full flex flex-col hover:border-primary/30 transition-all duration-300">
                      {/* Thumbnail */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={article.thumbnail}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Category Tag */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold backdrop-blur-sm">
                            {article.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        {/* Meta */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span>{article.author}</span>
                          <span>•</span>
                          <span>{article.date}</span>
                          <span>•</span>
                          <span>{article.readTime}</span>
                        </div>

                        {/* Title */}
                        <h3 className="font-display font-bold text-lg leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>

                        {/* Snippet */}
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
                          {article.snippet}
                        </p>

                        {/* Read More */}
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                          Read Article
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {/* Load More Button */}
          {hasMoreArticles && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <Button
                variant="outline"
                size="lg"
                onClick={() => setVisibleArticles(prev => prev + 6)}
                className="px-8"
              >
                Load More Articles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* No Results */}
          {filteredArticles.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-xl text-muted-foreground mb-4">No articles found for "{searchQuery}"</p>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className="rounded-3xl overflow-hidden"
                style={{
                  boxShadow: '0 25px 80px -20px hsl(var(--primary) / 0.4), 0 0 100px hsl(var(--primary) / 0.2)',
                }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute -top-12 right-0 md:top-4 md:right-4 z-20 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-all"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Video */}
                <div className="aspect-video bg-card">
                  <iframe
                    src={selectedVideo.videoUrl}
                    title={selectedVideo.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Video Info */}
                <div className="bg-card p-6 md:p-8">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> {selectedVideo.duration}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" /> {selectedVideo.views} views
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-display font-bold mb-3">
                    {selectedVideo.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedVideo.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
};

export default ContentHub;
