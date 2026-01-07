import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ExternalLink, Sparkles, Search, X,
  Settings, Bell, User, Shield, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

// Official brand logos from reliable CDN sources
const toolLogos: Record<string, string> = {
  'chatgpt': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  'claude': 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Claude_AI_logo.svg',
  'gemini': 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg',
  'perplexity': 'https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1706190595/ioembezzxqjmblqoqnlw.png',
  'jasper': 'https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1673294837/ozjn5b2qcxk5c6ivddpc.png',
  'midjourney': 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png',
  'leonardo': 'https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1677753796/sjslmlpj1cjomspzavzs.png',
  'capcut': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/CapCut_logo.svg/1024px-CapCut_logo.svg.png',
  'runway': 'https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1615813352/vu1cjc3gidyrbivrqdip.png',
  'elevenlabs': 'https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1673539371/hrmn0g6eozdxcjfmqpnr.png',
  'murf': 'https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1632913011/wj4qr1d1n1lbcojthqjn.png',
  'claude-code': 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Claude_AI_logo.svg',
  'adobe': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Adobe_Experience_Cloud_logo.svg',
  'windows': 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Windows_logo_-_2012.svg',
};

// Brand colors for each tool
const toolColors: Record<string, { primary: string; glow: string }> = {
  'chatgpt': { primary: '#10a37f', glow: '160 84% 40%' },
  'claude': { primary: '#cc785c', glow: '20 55% 58%' },
  'gemini': { primary: '#4285f4', glow: '217 89% 61%' },
  'perplexity': { primary: '#20808d', glow: '187 63% 34%' },
  'jasper': { primary: '#ff5c5c', glow: '0 100% 68%' },
  'midjourney': { primary: '#000000', glow: '0 0% 30%' },
  'leonardo': { primary: '#8b5cf6', glow: '258 90% 66%' },
  'capcut': { primary: '#00f0ff', glow: '184 100% 50%' },
  'runway': { primary: '#ff2d55', glow: '349 100% 59%' },
  'elevenlabs': { primary: '#000000', glow: '0 0% 40%' },
  'murf': { primary: '#6366f1', glow: '239 84% 67%' },
  'claude-code': { primary: '#ff6b35', glow: '18 100% 60%' },
  'adobe': { primary: '#ff0000', glow: '0 100% 50%' },
  'windows': { primary: '#0078d4', glow: '206 100% 42%' },
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

// 3D Vault Tool Card with Official Logos
const VaultToolCard = ({ tool, index }: { tool: PurchasedTool; index: number }) => {
  const { t } = useTranslation();
  const cardRef = { current: null as HTMLDivElement | null };
  const [isHovered, setIsHovered] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);

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

  const logoUrl = toolLogos[tool.id];
  const colors = toolColors[tool.id] || { primary: '#a855f7', glow: '270 85% 65%' };

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
        {/* Glow Effect with Brand Color */}
        <motion.div
          animate={{
            opacity: isHovered ? 0.5 : 0.2,
            scale: isHovered ? 1.05 : 1,
          }}
          className="absolute -inset-2 rounded-3xl blur-xl"
          style={{
            background: `radial-gradient(ellipse at center, hsl(${colors.glow} / 0.5) 0%, transparent 70%)`,
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
          {/* Top Shine Effect */}
          <div 
            className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
            style={{
              background: `linear-gradient(180deg, ${colors.primary}15 0%, transparent 100%)`,
            }}
          />

          {/* Active Indicator */}
          <div 
            className="absolute top-4 end-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium z-10"
            style={{ background: `${colors.primary}20`, color: colors.primary }}
          >
            <span 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: colors.primary }}
            />
            {t('dashboard.active')}
          </div>

          <div className="p-6">
            {/* 3D Logo with Glassmorphism */}
            <div className="mb-6 relative">
              <motion.div
                animate={{
                  y: isHovered ? 6 : 3,
                  opacity: isHovered ? 0.4 : 0.2,
                }}
                className="absolute left-0 top-2 w-16 h-16 rounded-2xl blur-lg"
                style={{ background: colors.primary }}
              />
              <motion.div
                animate={{
                  y: isHovered ? -6 : 0,
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: `
                    0 10px 40px ${colors.primary}40,
                    0 0 0 1px rgba(255,255,255,0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `,
                }}
              >
                {/* Official Brand Logo */}
                {logoUrl && !logoError ? (
                  <img
                    src={logoUrl}
                    alt={`${tool.name} logo`}
                    className={`w-10 h-10 object-contain transition-opacity duration-300 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setLogoLoaded(true)}
                    onError={() => setLogoError(true)}
                    loading="lazy"
                  />
                ) : null}
                
                {/* Fallback: First letter if logo fails */}
                {(!logoUrl || logoError || !logoLoaded) && (
                  <span 
                    className="text-2xl font-bold text-white"
                    style={{ textShadow: `0 2px 10px ${colors.primary}` }}
                  >
                    {tool.name.charAt(0)}
                  </span>
                )}

                {/* Inner glow ring */}
                <div 
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 15px ${colors.primary}30`,
                  }}
                />
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
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}cc 100%)`,
              }}
              onClick={() => window.open(tool.accessUrl, '_blank')}
            >
              <span className="relative z-10 flex items-center gap-2 font-semibold text-white">
                {t('dashboard.launchTool')}
                <ExternalLink className="w-4 h-4" />
              </span>
              <motion.div
                className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}ee 0%, ${colors.primary} 100%)`,
                }}
              />
            </Button>
          </div>

          {/* Animated Border on Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}40 0%, transparent 50%, ${colors.primary}20 100%)`,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'xor',
              padding: '1px',
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' || i18n.language === 'ur' ? 'rtl' : 'ltr';
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
            <div className="absolute top-10 start-10 w-32 h-32 border border-primary/10 rounded-full" />
            <div className="absolute bottom-10 end-10 w-40 h-40 border border-secondary/10 rounded-full" />
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
                  <span className="font-medium text-sm hidden sm:block">{t('dashboard.member')}</span>
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
                <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('dashboard.searchTools')}
                  className="w-full ps-12 pe-10 py-3 rounded-xl bg-card/80 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute end-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
