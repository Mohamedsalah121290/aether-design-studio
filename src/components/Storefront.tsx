import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Image, Video, Code, Sparkles, Search, X } from 'lucide-react';
import { ToolCard, Tool } from './ToolCard';

// All available tools organized by category
const allTools: Tool[] = [
  // Text & Chat
  { id: 'chatgpt', name: 'ChatGPT Plus', price: 9, category: 'text' },
  { id: 'claude', name: 'Claude Pro', price: 9, category: 'text' },
  { id: 'gemini', name: 'Gemini Advanced', price: 8, category: 'text' },
  { id: 'perplexity', name: 'Perplexity Pro', price: 7, category: 'text' },
  { id: 'jasper', name: 'Jasper AI', price: 12, category: 'text' },
  
  // Image Generation
  { id: 'midjourney', name: 'Midjourney', price: 12, category: 'image' },
  { id: 'leonardo', name: 'Leonardo AI', price: 8, category: 'image' },
  
  // Video & Audio
  { id: 'capcut', name: 'CapCut Pro', price: 6, category: 'video' },
  { id: 'runway', name: 'Runway Gen-4', price: 15, category: 'video' },
  { id: 'elevenlabs', name: 'ElevenLabs', price: 11, category: 'video' },
  { id: 'murf', name: 'Murf.ai', price: 8, category: 'video' },
  
  // Coding & Software
  { id: 'claude-code', name: 'Claude Code', price: 10, category: 'coding' },
  { id: 'adobe', name: 'Adobe Creative Cloud', price: 18, category: 'coding' },
  { id: 'windows', name: 'Windows 11 Pro Key', price: 5, category: 'coding' },
];

const categories = [
  { id: 'all', icon: Sparkles },
  { id: 'text', icon: MessageSquare },
  { id: 'image', icon: Image },
  { id: 'video', icon: Video },
  { id: 'coding', icon: Code },
];

const Storefront = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tools
  const filteredTools = allTools.filter(tool => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="store" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            {t('store.badge')}
          </motion.span>
          
          <h2 className="text-4xl md:text-6xl font-display font-black mb-4 tracking-tight">
            {t('store.title')}{' '}
            <span className="gradient-text">{t('store.titleHighlight')}</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('store.description')}
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('store.searchPlaceholder')}
              className="w-full pl-12 pr-10 py-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const count = cat.id === 'all' 
              ? allTools.length 
              : allTools.filter(t => t.category === cat.id).length;
            
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'glass hover:bg-muted/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t(`store.categories.${cat.id}`)}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeCategory === cat.id
                    ? 'bg-primary-foreground/20'
                    : 'bg-muted'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Tools Grid - Bento Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-display font-bold mb-2">{t('store.noResults')}</h3>
            <p className="text-muted-foreground">{t('store.tryAgain')}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Storefront;
