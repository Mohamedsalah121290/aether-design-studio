import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Image, Video, Code, Sparkles, Search, X, Loader2 } from 'lucide-react';
import { ToolCard, Tool } from './ToolCard';
import { supabase } from '@/integrations/supabase/client';

const categories = [
  { id: 'all', icon: Sparkles },
  { id: 'text', icon: MessageSquare },
  { id: 'image', icon: Image },
  { id: 'video', icon: Video },
  { id: 'coding', icon: Code },
];

const Storefront = () => {
  const { t } = useTranslation();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      // Fetch tools
      const { data: toolsData, error: toolsError } = await supabase
        .from('tools')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (toolsError) throw toolsError;

      // Fetch minimum prices from tool_plans
      const { data: plansData, error: plansError } = await supabase
        .from('tool_plans')
        .select('tool_id, monthly_price')
        .eq('is_active', true);

      if (plansError) throw plansError;

      // Build min price map
      const minPriceMap: Record<string, number> = {};
      (plansData || []).forEach(p => {
        const price = p.monthly_price ? Number(p.monthly_price) : null;
        if (price != null && price > 0) {
          if (!(p.tool_id in minPriceMap) || price < minPriceMap[p.tool_id]) {
            minPriceMap[p.tool_id] = price;
          }
        }
      });

      const mappedTools: Tool[] = (toolsData || []).map(tool => ({
        id: tool.id,
        tool_id: tool.tool_id,
        name: tool.name,
        category: tool.category as Tool['category'],
        logo_url: tool.logo_url || null,
        starting_price: minPriceMap[tool.tool_id] ?? null,
      }));
      
      setTools(mappedTools);
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter tools
  const filteredTools = tools.filter(tool => {
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
              ? tools.length 
              : tools.filter(t => t.category === cat.id).length;
            
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

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </section>
  );
};

export default Storefront;
