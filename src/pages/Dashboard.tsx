import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ExternalLink, Sparkles, Search, X,
  MessageSquare, Image, Video, Music, 
  Code, Palette, Wand2, Bot,
  Settings, Bell, User, Shield, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

// Tool icon mapping
const toolIcons: Record<string, React.ElementType> = {
  'chatgpt': MessageSquare,
  'claude': Bot,
  'gemini': Sparkles,
  'perplexity': Search,
  'jasper': Palette,
  'midjourney': Image,
  'leonardo': Wand2,
  'capcut': Video,
  'runway': Video,
  'elevenlabs': Music,
  'murf': Music,
  'claude-code': Code,
  'adobe': Palette,
  'windows': Code,
};

// Brand colors for each tool
const toolColors: Record<string, string> = {
  'chatgpt': '#10a37f',
  'claude': '#cc785c',
  'gemini': '#4285f4',
  'perplexity': '#20808d',
  'jasper': '#ff5c5c',
  'midjourney': '#7c3aed',
  'leonardo': '#f59e0b',
  'capcut': '#00f0ff',
  'runway': '#ff2d55',
  'elevenlabs': '#8b5cf6',
  'murf': '#06b6d4',
  'claude-code': '#ff6b35',
  'adobe': '#ff0000',
  'windows': '#0078d4',
};

interface PurchasedTool {
  id: string;
  name: string;
  purchaseDate: string;
  accessUrl: string;
}

// Simulated purchased tools - in production this would come from database
const purchasedTools: PurchasedTool[] = [
  { id: 'chatgpt', name: 'ChatGPT Plus', purchaseDate: '2026-01-01', accessUrl: 'https://chat.openai.com' },
  { id: 'midjourney', name: 'Midjourney', purchaseDate: '2026-01-03', accessUrl: 'https://midjourney.com' },
  { id: 'claude', name: 'Claude Pro', purchaseDate: '2026-01-05', accessUrl: 'https://claude.ai' },
  { id: 'runway', name: 'Runway Gen-4', purchaseDate: '2026-01-06', accessUrl: 'https://runway.ml' },
];

// 3D Vault Tool Card
const VaultToolCard = ({ tool, index }: { tool: PurchasedTool; index: number }) => {
  const { t } = useTranslation();
  const cardRef = { current: null as HTMLDivElement | null };
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const Icon = toolIcons[tool.id] || Sparkles;
  const color = toolColors[tool.id] || '#a855f7';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="perspective-1000"
    >
      <motion.div
        ref={(el) => { cardRef.current = el; }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative group"
      >
        {/* Glow Effect */}
        <motion.div
          animate={{
            opacity: isHovered ? 0.5 : 0.2,
            scale: isHovered ? 1.05 : 1,
          }}
          className="absolute -inset-2 rounded-3xl blur-xl"
          style={{
            background: `radial-gradient(ellipse at center, ${color}50 0%, transparent 70%)`,
          }}
        />

        {/* Card */}
        <div
          className="relative rounded-3xl overflow-hidden backdrop-blur-xl border border-white/10"
          style={{
            background: 'linear-gradient(135deg, hsl(222 47% 11% / 0.95) 0%, hsl(222 47% 8% / 0.98) 100%)',
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(255, 255, 255, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
          }}
        >
          {/* Active Indicator */}
          <div 
            className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: `${color}20`, color }}
          >
            <span 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: color }}
            />
            Active
          </div>

          <div className="p-6">
            {/* 3D Icon */}
            <div className="mb-6 relative">
              <motion.div
                animate={{
                  y: isHovered ? 4 : 2,
                  opacity: isHovered ? 0.4 : 0.2,
                }}
                className="absolute left-0 top-2 w-16 h-16 rounded-2xl blur-lg"
                style={{ background: color }}
              />
              <motion.div
                animate={{
                  y: isHovered ? -6 : 0,
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                  boxShadow: `0 10px 40px ${color}60, inset 0 1px 0 rgba(255,255,255,0.3)`,
                }}
              >
                <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
              </motion.div>
            </div>

            {/* Tool Name */}
            <h3 className="text-xl font-display font-bold mb-2">{tool.name}</h3>
            
            {/* Purchase Date */}
            <p className="text-xs text-muted-foreground mb-6">
              {t('dashboard.purchasedOn')}: {new Date(tool.purchaseDate).toLocaleDateString()}
            </p>

            {/* Launch Button */}
            <Button
              className="w-full relative overflow-hidden group/btn"
              style={{
                background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
              }}
              onClick={() => window.open(tool.accessUrl, '_blank')}
            >
              <span className="relative z-10 flex items-center gap-2 font-semibold text-white">
                {t('dashboard.launchTool')}
                <ExternalLink className="w-4 h-4" />
              </span>
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    window.scrollTo(0, 0);
  }, [i18n.language]);

  const filteredTools = purchasedTools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        {/* Header */}
        <section className="relative py-8 overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-20" />
          
          {/* Vault decorative circles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 border border-primary/10 rounded-full" />
            <div className="absolute bottom-10 right-10 w-40 h-40 border border-secondary/10 rounded-full" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-4 mb-2">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
                      boxShadow: '0 10px 40px hsl(var(--primary) / 0.3)',
                    }}
                  >
                    <Shield className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-display font-black">
                      {t('dashboard.vaultTitle')}
                    </h1>
                    <p className="text-muted-foreground">{t('dashboard.vaultSubtitle')}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
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
                  <span className="font-medium text-sm hidden sm:block">Member</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Status Bar */}
        <section className="py-4">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-strong rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium">{t('dashboard.allToolsActive')}</span>
                </div>
                <div className="h-4 w-px bg-border hidden sm:block" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>{t('dashboard.secureAccess')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-primary" />
                <span><strong>{purchasedTools.length}</strong> {t('dashboard.toolsOwned')}</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Search */}
        <section className="py-4">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-md"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('dashboard.searchTools')}
                  className="w-full pl-12 pr-10 py-3 rounded-xl bg-card/80 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTools.map((tool, index) => (
                  <VaultToolCard key={tool.id} tool={tool} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--muted)) 100%)',
                  }}
                >
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-display font-bold mb-2">{t('dashboard.noToolsFound')}</h3>
                <p className="text-muted-foreground mb-6">{t('dashboard.browseStore')}</p>
                <Button variant="hero" asChild>
                  <a href="/#store">{t('dashboard.goToStore')}</a>
                </Button>
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
