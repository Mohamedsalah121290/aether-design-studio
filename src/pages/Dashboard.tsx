import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Sparkles, Lock, Shield, Zap, ExternalLink, 
  MessageSquare, Image, Music, Video, Code, 
  Brain, Wand2, FileText, Search, Bot,
  Settings, Bell, User, LogOut, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

// 3D Icon component with depth effect
const Icon3D = ({ Icon, gradient }: { Icon: React.ElementType; gradient: string }) => (
  <div className="relative group-hover:scale-110 transition-transform duration-300">
    {/* Shadow layer */}
    <div className="absolute inset-0 translate-x-1 translate-y-1 opacity-30 blur-sm">
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient}`} />
    </div>
    {/* Main icon container */}
    <div 
      className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
      style={{
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
        transform: 'perspective(500px) rotateX(5deg)',
      }}
    >
      <Icon className="w-8 h-8 text-white drop-shadow-lg" />
    </div>
  </div>
);

const Dashboard = () => {
  const { i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    window.scrollTo(0, 0);
  }, [i18n.language]);

  const categories = [
    { id: 'all', label: 'All Tools', count: 12 },
    { id: 'text', label: 'Text AI', count: 4 },
    { id: 'image', label: 'Image AI', count: 3 },
    { id: 'audio', label: 'Audio AI', count: 2 },
    { id: 'video', label: 'Video AI', count: 2 },
    { id: 'code', label: 'Code AI', count: 1 },
  ];

  const aiTools = [
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      description: 'Advanced conversational AI for text generation and analysis.',
      icon: MessageSquare,
      gradient: 'from-emerald-500 to-teal-600',
      category: 'text',
      status: 'active',
      usage: '2,450 / 5,000 credits',
    },
    {
      id: 'midjourney',
      name: 'Midjourney',
      description: 'Create stunning AI-generated artwork and illustrations.',
      icon: Image,
      gradient: 'from-violet-500 to-purple-600',
      category: 'image',
      status: 'active',
      usage: '180 / 500 images',
    },
    {
      id: 'claude',
      name: 'Claude AI',
      description: 'Thoughtful AI assistant for complex reasoning tasks.',
      icon: Brain,
      gradient: 'from-amber-500 to-orange-600',
      category: 'text',
      status: 'active',
      usage: '1,200 / 3,000 credits',
    },
    {
      id: 'dalle',
      name: 'DALL-E 3',
      description: 'Generate photorealistic images from text descriptions.',
      icon: Wand2,
      gradient: 'from-pink-500 to-rose-600',
      category: 'image',
      status: 'active',
      usage: '95 / 200 images',
    },
    {
      id: 'suno',
      name: 'Suno AI',
      description: 'Create original music and songs with AI composition.',
      icon: Music,
      gradient: 'from-cyan-500 to-blue-600',
      category: 'audio',
      status: 'active',
      usage: '25 / 100 songs',
    },
    {
      id: 'runway',
      name: 'Runway Gen-3',
      description: 'Professional AI video generation and editing tools.',
      icon: Video,
      gradient: 'from-red-500 to-pink-600',
      category: 'video',
      status: 'active',
      usage: '15 / 50 videos',
    },
    {
      id: 'copilot',
      name: 'GitHub Copilot',
      description: 'AI-powered code completion and generation.',
      icon: Code,
      gradient: 'from-gray-600 to-gray-800',
      category: 'code',
      status: 'active',
      usage: 'Unlimited',
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      description: 'Multimodal AI for text, images, and more.',
      icon: Sparkles,
      gradient: 'from-blue-500 to-indigo-600',
      category: 'text',
      status: 'active',
      usage: '3,100 / 5,000 credits',
    },
    {
      id: 'elevenlabs',
      name: 'ElevenLabs',
      description: 'Ultra-realistic AI voice synthesis and cloning.',
      icon: Bot,
      gradient: 'from-green-500 to-emerald-600',
      category: 'audio',
      status: 'active',
      usage: '45 / 100 minutes',
    },
    {
      id: 'pika',
      name: 'Pika Labs',
      description: 'Create and edit videos with AI-powered tools.',
      icon: Video,
      gradient: 'from-yellow-500 to-amber-600',
      category: 'video',
      status: 'active',
      usage: '20 / 50 videos',
    },
    {
      id: 'perplexity',
      name: 'Perplexity',
      description: 'AI-powered search and research assistant.',
      icon: Search,
      gradient: 'from-indigo-500 to-violet-600',
      category: 'text',
      status: 'active',
      usage: '500 / 1,000 queries',
    },
    {
      id: 'stable',
      name: 'Stable Diffusion',
      description: 'Open-source image generation with custom models.',
      icon: Image,
      gradient: 'from-fuchsia-500 to-purple-600',
      category: 'image',
      status: 'active',
      usage: '300 / 500 images',
    },
  ];

  const filteredTools = activeCategory === 'all' 
    ? aiTools 
    : aiTools.filter(tool => tool.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        {/* Header */}
        <section className="relative py-8 overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-20" />
          
          {/* Vault-like decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 border border-primary/10 rounded-full" />
            <div className="absolute top-20 left-20 w-24 h-24 border border-primary/20 rounded-full" />
            <div className="absolute bottom-10 right-10 w-40 h-40 border border-secondary/10 rounded-full" />
            <div className="absolute bottom-20 right-20 w-28 h-28 border border-secondary/20 rounded-full" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-display font-bold">
                      AI Command Center
                    </h1>
                    <p className="text-muted-foreground">Your secure vault of AI tools</p>
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
                  <span className="font-medium hidden sm:block">John Doe</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Security Status Bar */}
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
                  <span className="text-sm font-medium">Vault Secured</span>
                </div>
                <div className="h-4 w-px bg-border hidden sm:block" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>256-bit encryption active</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span><strong>12</strong> tools connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-secondary" />
                  <span><strong>4,521</strong> requests today</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-4">
          <div className="container mx-auto px-4">
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
                  {category.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeCategory === category.id
                      ? 'bg-primary-foreground/20'
                      : 'bg-muted'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* AI Tools Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group"
                >
                  <div 
                    className="glass-strong rounded-3xl p-6 h-full flex flex-col hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
                    style={{
                      boxShadow: '0 4px 20px -5px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
                    }}
                  >
                    {/* Subtle gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    
                    {/* Status indicator */}
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs text-muted-foreground capitalize">{tool.status}</span>
                      </div>
                    </div>

                    {/* 3D Icon */}
                    <div className="mb-4">
                      <Icon3D Icon={tool.icon} gradient={tool.gradient} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 relative z-10">
                      <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    {/* Usage bar */}
                    <div className="mb-4 relative z-10">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Usage</span>
                        <span>{tool.usage}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: tool.usage === 'Unlimited' ? '100%' : '60%' }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.05 }}
                          className={`h-full rounded-full bg-gradient-to-r ${tool.gradient}`}
                        />
                      </div>
                    </div>

                    {/* Launch Button */}
                    <Button 
                      variant="hero" 
                      size="sm" 
                      className="w-full group/btn relative z-10"
                    >
                      Launch
                      <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-strong rounded-3xl p-6 md:p-8"
            >
              <h2 className="text-2xl font-display font-bold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Manage API Keys', icon: Lock, desc: 'View and rotate your keys' },
                  { label: 'Usage Analytics', icon: FileText, desc: 'Track your consumption' },
                  { label: 'Team Settings', icon: User, desc: 'Manage access controls' },
                  { label: 'Billing & Plans', icon: Zap, desc: 'Upgrade your limits' },
                ].map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="glass rounded-2xl p-4 text-left hover:border-primary/30 hover:bg-muted/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <action.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold group-hover:text-primary transition-colors">{action.label}</div>
                        <div className="text-xs text-muted-foreground">{action.desc}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;