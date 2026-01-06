import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Play, BookOpen, Video, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Resources = () => {
  const { t } = useTranslation();

  const articles = [
    {
      title: 'Getting Started with AI Automation',
      description: 'Learn how to set up your first AI workflow in under 10 minutes.',
      type: 'article',
      category: 'Tutorial',
      readTime: '5 min read',
      gradient: 'from-primary/20 to-secondary/20',
    },
    {
      title: 'Advanced Prompt Engineering',
      description: 'Master the art of crafting prompts that get you better results.',
      type: 'video',
      category: 'Guide',
      duration: '15 min',
      gradient: 'from-secondary/20 to-accent/20',
    },
    {
      title: 'Building Custom AI Agents',
      description: 'Create intelligent agents that understand your business context.',
      type: 'article',
      category: 'Deep Dive',
      readTime: '12 min read',
      gradient: 'from-accent/20 to-primary/20',
    },
  ];

  return (
    <section id="resources" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary font-semibold mb-4">
            {t('resources.subtitle')}
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            {t('resources.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('resources.description')}
          </p>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass rounded-3xl overflow-hidden h-full flex flex-col hover:border-primary/30 transition-all duration-300">
                {/* Image Placeholder */}
                <div className={`aspect-video bg-gradient-to-br ${article.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {article.type === 'video' ? (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-16 h-16 rounded-full glass flex items-center justify-center cursor-pointer"
                      >
                        <Play className="w-6 h-6 text-primary fill-primary" />
                      </motion.div>
                    ) : (
                      <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center">
                        {article.category === 'Tutorial' && <BookOpen className="w-8 h-8 text-primary" />}
                        {article.category === 'Guide' && <Video className="w-8 h-8 text-secondary" />}
                        {article.category === 'Deep Dive' && <Lightbulb className="w-8 h-8 text-accent" />}
                      </div>
                    )}
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="glass px-3 py-1 rounded-full text-xs font-medium">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 flex-1">
                    {article.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {article.type === 'video' ? article.duration : article.readTime}
                    </span>
                    <Button variant="ghost" size="sm" className="group/btn">
                      {article.type === 'video' ? t('resources.watchVideo') : t('resources.readMore')}
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>

                {/* Reading Progress Bar (decorative) */}
                <div className="h-1 bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
                  />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button variant="heroOutline" size="lg" className="group" asChild>
            <a href="/resources">
              View All Resources
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Resources;