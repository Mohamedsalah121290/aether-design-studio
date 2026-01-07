import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ExternalLink, Lock, Sparkles,
  MessageSquare, Image, Video, Music, 
  FileText, BarChart3, Palette, Wand2,
  Settings, Bell, User, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

// Tool data with actual branding colors
const aiTools = [
  {
    id: 'chatgpt',
    name: 'ChatGPT Plus',
    description: 'GPT-4 access with all premium features including DALL-E 3 and advanced analysis.',
    icon: MessageSquare,
    gradient: 'from-emerald-500 to-teal-600',
    category: 'text',
    plan: 'starter',
    url: '#',
  },
  {
    id: 'canva',
    name: 'Canva Pro',
    description: 'Premium design platform with unlimited templates, fonts, and AI features.',
    icon: Palette,
    gradient: 'from-cyan-500 to-blue-600',
    category: 'image',
    plan: 'starter',
    url: '#',
  },
  {
    id: 'grammarly',
    name: 'Grammarly Premium',
    description: 'Advanced writing assistant with tone, clarity, and plagiarism detection.',
    icon: FileText,
    gradient: 'from-green-500 to-emerald-600',
    category: 'text',
    plan: 'starter',
    url: '#',
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: 'Create stunning AI-generated artwork and illustrations with V6.',
    icon: Image,
    gradient: 'from-violet-500 to-purple-600',
    category: 'image',
    plan: 'pro',
    url: '#',
  },
  {
    id: 'runway',
    name: 'Runway ML',
    description: 'Professional AI video generation and editing with Gen-3 Alpha.',
    icon: Video,
    gradient: 'from-pink-500 to-rose-600',
    category: 'video',
    plan: 'pro',
    url: '#',
  },
  {
    id: 'leonardo',
    name: 'Leonardo AI',
    description: 'Professional AI image generation with custom models and styles.',
    icon: Wand2,
    gradient: 'from-amber-500 to-orange-600',
    category: 'image',
    plan: 'pro',
    url: '#',
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'Ultra-realistic AI voice synthesis, cloning, and dubbing.',
    icon: Music,
    gradient: 'from-indigo-500 to-violet-600',
    category: 'video',
    plan: 'pro',
    url: '#',
  },
  {
    id: 'claude',
    name: 'Claude Pro',
    description: 'Anthropic\'s advanced AI for complex reasoning and analysis.',
    icon: MessageSquare,
    gradient: 'from-orange-500 to-amber-600',
    category: 'text',
    plan: 'pro',
    url: '#',
  },
  {
    id: 'semrush',
    name: 'Semrush',
    description: 'Complete SEO toolkit for keyword research, site audits, and competitor analysis.',
    icon: BarChart3,
    gradient: 'from-orange-600 to-red-600',
    category: 'seo',
    plan: 'agency',
    url: '#',
  },
  {
    id: 'ahrefs',
    name: 'Ahrefs',
    description: 'Powerful backlink analysis, keyword research, and SEO tools.',
    icon: BarChart3,
    gradient: 'from-blue-600 to-indigo-600',
    category: 'seo',
    plan: 'agency',
    url: '#',
  },
  {
    id: 'envato',
    name: 'Envato Elements',
    description: 'Unlimited downloads of graphics, templates, video, and audio assets.',
    icon: FileText,
    gradient: 'from-green-600 to-teal-600',
    category: 'productivity',
    plan: 'agency',
    url: '#',
  },
  {
    id: 'adobe',
    name: 'Adobe Creative Cloud',
    description: 'Full Adobe suite including Photoshop, Illustrator, Premiere Pro.',
    icon: Palette,
    gradient: 'from-red-500 to-pink-600',
    category: 'image',
    plan: 'agency',
    url: '#',
  },
];

// 3D Tool Card component
const ToolCard = ({ tool, index, userPlan }: { tool: typeof aiTools[0]; index: number; userPlan: string }) => {
  const { t } = useTranslation();
  const planOrder = { starter: 1, pro: 2, agency: 3 };
  const userPlanLevel = planOrder[userPlan as keyof typeof planOrder] || 1;
  const toolPlanLevel = planOrder[tool.plan as keyof typeof planOrder];
  const isLocked = toolPlanLevel > userPlanLevel;
  const Icon = tool.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group"
    >
      <div 
        className={`relative glass-strong rounded-3xl p-6 h-full flex flex-col transition-all duration-300 overflow-hidden ${
          isLocked ? 'opacity-60' : 'hover:border-primary/30'
        }`}
        style={{
          boxShadow: '0 4px 20px -5px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Gradient overlay on hover */}
        {!isLocked && (
          <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
        )}
        
        {/* Locked overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="text-center">
              <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <span className="text-sm font-medium text-muted-foreground capitalize">
                {tool.plan} Plan
              </span>
            </div>
          </div>
        )}

        {/* 3D Tool Icon */}
        <div className="mb-4 relative">
          <div className="absolute inset-0 translate-x-1 translate-y-1 opacity-30 blur-sm">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.gradient}`} />
          </div>
          <div 
            className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-lg`}
            style={{
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
              transform: 'perspective(500px) rotateX(5deg)',
            }}
          >
            <Icon className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative z-0">
          <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors">
            {tool.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
            {tool.description}
          </p>
        </div>

        {/* Plan badge */}
        <div className="mb-4">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
            tool.plan === 'starter' ? 'bg-blue-500/20 text-blue-400' :
            tool.plan === 'pro' ? 'bg-purple-500/20 text-purple-400' :
            'bg-amber-500/20 text-amber-400'
          }`}>
            <Sparkles className="w-3 h-3" />
            {tool.plan}
          </span>
        </div>

        {/* Launch Button */}
        <Button 
          variant="hero" 
          size="sm" 
          className="w-full group/btn relative z-0"
          disabled={isLocked}
        >
          {t('dashboard.launchTool')}
          <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Simulated user plan - in real app this would come from auth/subscription
  const userPlan = 'pro';

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    window.scrollTo(0, 0);
  }, [i18n.language]);

  const categories = [
    { id: 'all', labelKey: 'all' },
    { id: 'text', labelKey: 'text' },
    { id: 'image', labelKey: 'image' },
    { id: 'video', labelKey: 'video' },
    { id: 'seo', labelKey: 'seo' },
    { id: 'productivity', labelKey: 'productivity' },
  ];

  // Filter tools
  const filteredTools = aiTools.filter(tool => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Count tools per category
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return aiTools.length;
    return aiTools.filter(t => t.category === categoryId).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        {/* Header */}
        <section className="relative py-8 overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-20" />
          
          {/* Vault decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 border border-primary/10 rounded-full" />
            <div className="absolute top-20 left-20 w-24 h-24 border border-primary/20 rounded-full" />
            <div className="absolute bottom-10 right-10 w-40 h-40 border border-secondary/10 rounded-full" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-display font-bold">
                      {t('dashboard.title')}
                    </h1>
                    <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-3"
              >
                <Button variant="ghost" size="icon" className="glass">
                  <Bell className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="glass">
                  <Settings className="w-5 h-5" />
                </Button>
                <div className="h-8 w-px bg-border" />
                <div className="flex items-center gap-3 glass rounded-full px-4 py-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="hidden sm:block">
                    <span className="font-medium block text-sm">Pro Member</span>
                    <span className="text-xs text-muted-foreground capitalize">{userPlan} Plan</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Tools Status Bar */}
        <section className="py-4">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-strong rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium">All Tools Available</span>
                </div>
                <div className="h-4 w-px bg-border hidden sm:block" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>Secure Access</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span><strong>{aiTools.length}</strong> {t('dashboard.toolsConnected')}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Search & Category Filter */}
        <section className="py-4">
          <div className="container mx-auto px-4">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mb-4"
            >
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tools..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-card/80 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'glass hover:bg-muted'
                  }`}
                >
                  {t(`dashboard.categories.${category.labelKey}`)}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeCategory === category.id
                      ? 'bg-primary-foreground/20'
                      : 'bg-muted'
                  }`}>
                    {getCategoryCount(category.id)}
                  </span>
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool, index) => (
                <ToolCard 
                  key={tool.id} 
                  tool={tool} 
                  index={index} 
                  userPlan={userPlan}
                />
              ))}
            </div>

            {filteredTools.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tools found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
