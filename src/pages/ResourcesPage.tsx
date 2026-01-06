import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Play, BookOpen, Video, Lightbulb, Clock, Calendar, User, TrendingUp, Zap, Brain, Code, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ResourcesPage = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    window.scrollTo(0, 0);
  }, [i18n.language]);

  const featuredArticle = {
    title: 'The Complete Guide to AI-Powered Automation',
    description: 'Discover how leading companies are transforming their operations with intelligent automation. This comprehensive guide covers everything from basic concepts to advanced implementation strategies.',
    author: 'Sarah Chen',
    date: 'Jan 5, 2026',
    readTime: '15 min read',
    category: 'Featured',
    image: 'from-primary via-secondary to-accent',
  };

  const articles = [
    {
      title: 'Getting Started with AI Automation',
      description: 'Learn how to set up your first AI workflow in under 10 minutes with our step-by-step guide.',
      author: 'Alex Rivera',
      date: 'Jan 4, 2026',
      readTime: '5 min read',
      category: 'Tutorial',
      icon: BookOpen,
      gradient: 'from-primary/30 to-secondary/30',
    },
    {
      title: 'Advanced Prompt Engineering Techniques',
      description: 'Master the art of crafting prompts that get you consistently better results from AI models.',
      author: 'Jordan Lee',
      date: 'Jan 3, 2026',
      readTime: '8 min read',
      category: 'Guide',
      icon: Brain,
      gradient: 'from-secondary/30 to-accent/30',
    },
    {
      title: 'Building Custom AI Agents',
      description: 'Create intelligent agents that understand your business context and automate complex tasks.',
      author: 'Morgan Taylor',
      date: 'Jan 2, 2026',
      readTime: '12 min read',
      category: 'Deep Dive',
      icon: Lightbulb,
      gradient: 'from-accent/30 to-primary/30',
    },
    {
      title: 'Scaling AI Infrastructure',
      description: 'Best practices for scaling your AI operations from prototype to enterprise-level deployment.',
      author: 'Chris Anderson',
      date: 'Jan 1, 2026',
      readTime: '10 min read',
      category: 'Architecture',
      icon: TrendingUp,
      gradient: 'from-primary/30 to-accent/30',
    },
    {
      title: 'AI Security Best Practices',
      description: 'Protect your AI systems with industry-leading security measures and compliance strategies.',
      author: 'Sam Mitchell',
      date: 'Dec 30, 2025',
      readTime: '7 min read',
      category: 'Security',
      icon: Zap,
      gradient: 'from-secondary/30 to-primary/30',
    },
    {
      title: 'Integrating AI with Legacy Systems',
      description: 'Strategies for seamlessly connecting modern AI capabilities with existing infrastructure.',
      author: 'Dana Brooks',
      date: 'Dec 28, 2025',
      readTime: '9 min read',
      category: 'Integration',
      icon: Code,
      gradient: 'from-accent/30 to-secondary/30',
    },
  ];

  const videoTutorials = [
    {
      title: 'NexusAI Platform Overview',
      description: 'A complete walkthrough of all platform features and capabilities.',
      duration: '12:45',
      views: '24.5K',
      gradient: 'from-primary to-secondary',
    },
    {
      title: 'Setting Up Your First Workflow',
      description: 'Step-by-step tutorial for creating automated workflows.',
      duration: '8:30',
      views: '18.2K',
      gradient: 'from-secondary to-accent',
    },
    {
      title: 'Advanced Analytics Dashboard',
      description: 'Deep dive into analytics features and custom reporting.',
      duration: '15:20',
      views: '12.8K',
      gradient: 'from-accent to-primary',
    },
    {
      title: 'API Integration Masterclass',
      description: 'Connect NexusAI with your favorite tools and services.',
      duration: '22:15',
      views: '9.4K',
      gradient: 'from-primary to-accent',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-30" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-4xl mx-auto"
            >
              <span className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Resources & Learning</span>
              </span>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6">
                Learn, Build,{' '}
                <span className="gradient-text">Succeed</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Explore our comprehensive library of tutorials, guides, and video content designed to help you master AI automation.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured Article */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group cursor-pointer"
            >
              <div className="glass-strong rounded-3xl overflow-hidden hover:border-primary/30 transition-all duration-500">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className={`aspect-video md:aspect-auto bg-gradient-to-br ${featuredArticle.image} relative overflow-hidden min-h-[300px]`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="w-32 h-32 rounded-3xl glass flex items-center justify-center"
                      >
                        <BookOpen className="w-16 h-16 text-primary-foreground" />
                      </motion.div>
                    </div>
                    <div className="absolute top-6 left-6">
                      <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold">
                        {featuredArticle.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      {featuredArticle.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{featuredArticle.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{featuredArticle.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{featuredArticle.readTime}</span>
                      </div>
                    </div>

                    <Button variant="hero" size="lg" className="w-fit group/btn">
                      Read Article
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.article>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Latest Articles
              </h2>
              <p className="text-xl text-muted-foreground">
                Stay updated with our latest insights and tutorials.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {articles.map((article, index) => (
                <motion.article
                  key={article.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="glass rounded-3xl overflow-hidden h-full flex flex-col hover:border-primary/30 hover:scale-[1.02] transition-all duration-300">
                    {/* Thumbnail */}
                    <div className={`aspect-video bg-gradient-to-br ${article.gradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl glass-strong flex items-center justify-center">
                          <article.icon className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="glass px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 flex-1 leading-relaxed">
                        {article.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{article.author}</span>
                          <span>•</span>
                          <span>{article.readTime}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center mt-12"
            >
              <Button variant="heroOutline" size="lg" className="group">
                View All Articles
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Video Tutorials Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-20" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Video className="w-6 h-6 text-primary-foreground" />
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold">
                  Video Tutorials
                </h2>
              </div>
              <p className="text-xl text-muted-foreground">
                Learn at your own pace with our in-depth video content.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {videoTutorials.map((video, index) => (
                <motion.div
                  key={video.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="glass-strong rounded-3xl overflow-hidden hover:border-primary/30 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row">
                      {/* Video Thumbnail */}
                      <div className={`sm:w-64 aspect-video sm:aspect-square bg-gradient-to-br ${video.gradient} relative overflow-hidden flex-shrink-0`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-16 h-16 rounded-full bg-background/90 backdrop-blur-xl flex items-center justify-center shadow-2xl"
                          >
                            <Play className="w-6 h-6 text-primary fill-primary ml-1" />
                          </motion.div>
                        </div>
                        <div className="absolute bottom-4 right-4">
                          <span className="bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold">
                            {video.duration}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col justify-center flex-1">
                        <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {video.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {video.views} views
                          </span>
                          <Button variant="ghost" size="sm" className="group/btn ml-auto">
                            Watch Now
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center mt-12"
            >
              <Button variant="hero" size="lg" className="group">
                <Play className="w-5 h-5" />
                Browse All Videos
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-strong rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  Stay Updated
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                  Get the latest tutorials, guides, and AI insights delivered straight to your inbox.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <Button variant="hero" size="lg">
                    Subscribe
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ResourcesPage;