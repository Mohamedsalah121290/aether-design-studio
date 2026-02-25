import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ExternalLink, Search, X,
  Settings, Bell, User, Shield, Zap, Clock, Loader2,
  CreditCard, RefreshCw, CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

// Import local logos
import perplexityLogo from '@/assets/perplexity-logo.png';
import jasperLogo from '@/assets/jasper-logo.png';
import capcutLogo from '@/assets/capcut-logo.png';
import leonardoLogo from '@/assets/leonardo-logo.png';
import runwayLogo from '@/assets/runway-logo.png';
import elevenlabsLogo from '@/assets/elevenlabs-logo.png';
import murfLogo from '@/assets/murf-logo.png';
import adobeLogo from '@/assets/adobe-logo.png';
import chatgptLogo from '@/assets/chatgpt-logo.png';
import claudeLogo from '@/assets/claude-logo.png';
import geminiLogo from '@/assets/gemini-logo.png';
import midjourneyLogo from '@/assets/midjourney-logo.png';

// Official brand logos using local files
const toolLogos: Record<string, string> = {
  'chatgpt': chatgptLogo,
  'claude': claudeLogo,
  'gemini': geminiLogo,
  'perplexity': perplexityLogo,
  'jasper': jasperLogo,
  'midjourney': midjourneyLogo,
  'leonardo': leonardoLogo,
  'capcut': capcutLogo,
  'runway': runwayLogo,
  'elevenlabs': elevenlabsLogo,
  'murf': murfLogo,
  'claude-code': claudeLogo,
  'adobe': adobeLogo,
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

// Tool access URLs
const toolAccessUrls: Record<string, string> = {
  'chatgpt': 'https://chat.openai.com',
  'claude': 'https://claude.ai',
  'gemini': 'https://gemini.google.com',
  'perplexity': 'https://perplexity.ai',
  'jasper': 'https://jasper.ai',
  'midjourney': 'https://midjourney.com',
  'leonardo': 'https://leonardo.ai',
  'capcut': 'https://capcut.com',
  'runway': 'https://runwayml.com',
  'elevenlabs': 'https://elevenlabs.io',
  'murf': 'https://murf.ai',
  'adobe': 'https://adobe.com',
};

interface Order {
  id: string;
  tool_id: string;
  status: string;
  created_at: string;
  activation_deadline: string | null;
  customer_data: Record<string, string>;
  tool?: {
    tool_id: string;
    name: string;
    price: number;
    access_url: string;
    delivery_type?: string;
  };
}

// Calculate remaining time
const getRemainingTime = (deadline: string | null) => {
  if (!deadline) return null;
  const now = new Date().getTime();
  const end = new Date(deadline).getTime();
  const diff = end - now;
  
  if (diff <= 0) return { hours: 0, minutes: 0, expired: true };
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { hours, minutes, expired: false };
};

// Vault Tool Card Component
const VaultToolCard = ({ order, index }: { order: Order; index: number }) => {
  const { t } = useTranslation();
  const cardRef = { current: null as HTMLDivElement | null };
  const [isHovered, setIsHovered] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(getRemainingTime(order.activation_deadline));

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 });

  // Update countdown timer
  useEffect(() => {
    if (order.status !== 'pending') return;
    
    const interval = setInterval(() => {
      setTimeRemaining(getRemainingTime(order.activation_deadline));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [order.activation_deadline, order.status]);

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

  const toolId = order.tool?.tool_id || '';
  const logoUrl = toolLogos[toolId];
  const colors = toolColors[toolId] || { primary: '#a855f7', glow: '270 85% 65%' };
  const accessUrl = order.tool?.access_url || toolAccessUrls[toolId] || '#';
  const isPending = order.status === 'pending';
  const isProcessing = order.status === 'processing';
  const isActive = order.status === 'active';
  const deliveryType = order.tool?.delivery_type || '';

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

          {/* Status Indicator */}
          <div 
            className={`absolute top-4 end-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium z-10 ${
              isPending 
                ? 'bg-orange-500/20 text-orange-400' 
                : isProcessing 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'bg-green-500/20 text-green-400'
            }`}
          >
            {isPending ? (
              <>
                {/* Animated pulsing clock for pending */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Clock className="w-3.5 h-3.5" />
                </motion.div>
                {t('dashboard.pending')}
              </>
            ) : isProcessing ? (
              <>
                {/* Animated spinning loader for processing */}
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {t('dashboard.processing')}
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {t('dashboard.active')}
              </>
            )}
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
                    alt={`${order.tool?.name} logo`}
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
                    {order.tool?.name?.charAt(0) || '?'}
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
            <h3 className="text-xl font-display font-bold mb-2">{order.tool?.name || 'Unknown Tool'}</h3>
            
            {/* Status Info */}
            {isPending && (
              <div className="mb-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Clock className="w-4 h-4 text-orange-400" />
                  </motion.div>
                  <p className="text-xs text-orange-400 font-semibold">{t('dashboard.pending')}</p>
                </div>
                <p className="text-sm text-orange-300">{t('dashboard.pendingMessage')}</p>
              </div>
            )}
            
            {isProcessing && (
              <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  <p className="text-xs text-blue-400 font-semibold">{t('dashboard.processing')}</p>
                </div>
                <p className="text-sm text-blue-300">{t('dashboard.processingMessage')}</p>
              </div>
            )}
            
            {isActive && (
              <p className="text-xs text-muted-foreground mb-4">
                {t('dashboard.purchasedOn')}: {new Date(order.created_at).toLocaleDateString()}
              </p>
            )}

            {/* Login Credentials for Active 'provide_account' Orders */}
            {isActive && deliveryType === 'provide_account' && order.customer_data?.provided_email && (
              <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 space-y-2">
                <p className="text-xs text-green-400 font-semibold">{t('dashboard.credentials')}</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{t('dashboard.username')}:</span>
                    <span className="text-sm font-medium text-white">{order.customer_data.provided_email}</span>
                  </div>
                  {order.customer_data?.provided_password && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{t('dashboard.password')}:</span>
                      <span className="text-sm font-medium text-white font-mono">{order.customer_data.provided_password}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Launch Button - Only prominent when Active */}
            {isActive ? (
              <Button
                className="w-full relative overflow-hidden group/btn"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}cc 100%)`,
                }}
                onClick={() => window.open(accessUrl, '_blank')}
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
            ) : (
              <div className="w-full py-3 rounded-lg bg-muted/50 border border-border text-center">
                <span className="text-sm text-muted-foreground">
                  {isPending ? t('dashboard.waitingActivation') : t('dashboard.beingProcessed')}
                </span>
              </div>
            )}
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
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' || i18n.language === 'ur' ? 'rtl' : 'ltr';
    window.scrollTo(0, 0);

    // Handle checkout result query params
    const checkoutStatus = searchParams.get('checkout');
    if (checkoutStatus === 'success') {
      toast({
        title: t('checkout.successTitle', { defaultValue: '✅ Payment Successful!' }),
        description: t('checkout.successMessage', { defaultValue: 'Your order is being processed. Activation will happen within the specified time.' }),
      });
      searchParams.delete('checkout');
      setSearchParams(searchParams, { replace: true });
    } else if (checkoutStatus === 'cancelled') {
      toast({
        title: t('checkout.cancelledTitle', { defaultValue: 'Payment Cancelled' }),
        description: t('checkout.cancelledMessage', { defaultValue: 'Your payment was cancelled. No charges were made.' }),
        variant: 'destructive',
      });
      searchParams.delete('checkout');
      setSearchParams(searchParams, { replace: true });
    }

    fetchOrders();
    if (user) fetchSubscriptions();
    // Set up real-time subscription for order updates
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('Order update received:', payload);
          // Refetch orders when any change happens
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [i18n.language, user]);

  const fetchOrders = async () => {
    // Get email from localStorage (for guest users) or use authenticated user's id
    const email = localStorage.getItem('buyer_email');
    
    if (!user && !email) {
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          tool:tools(tool_id, name, price, access_url, delivery_type)
        `)
        .order('created_at', { ascending: false });

      // If authenticated, fetch by user_id; otherwise by email
      if (user) {
        query = query.eq('user_id', user.id);
      } else if (email) {
        query = query.eq('buyer_email', email);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      const mappedOrders: Order[] = (data || []).map((order: any) => ({
        id: order.id,
        tool_id: order.tool_id,
        status: order.status,
        created_at: order.created_at,
        activation_deadline: order.activation_deadline,
        customer_data: order.customer_data || {},
        tool: order.tool ? {
          tool_id: order.tool.tool_id,
          name: order.tool.name,
          price: Number(order.tool.price),
          access_url: order.tool.access_url,
          delivery_type: order.tool.delivery_type,
        } : undefined,
      }));
      
      setOrders(mappedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    if (!user) return;
    setSubsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;
      setSubscriptions(data?.subscriptions || []);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
    } finally {
      setSubsLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    setPortalLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, '_blank');
    } catch (err) {
      console.error('Error opening portal:', err);
      toast({ title: 'Error', description: 'Could not open subscription management.', variant: 'destructive' });
    } finally {
      setPortalLoading(false);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.tool?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const processingCount = orders.filter(o => o.status === 'processing').length;
  const activeCount = orders.filter(o => o.status === 'active').length;

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
              <div className="flex items-center gap-4 flex-wrap">
                {activeCount > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-sm font-medium text-green-400">{activeCount} {t('dashboard.active')}</span>
                  </div>
                )}
                {processingCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
                    <span className="text-sm font-medium text-blue-400">{processingCount} {t('dashboard.processing')}</span>
                  </div>
                )}
                {pendingCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-orange-400" />
                    <span className="text-sm font-medium text-orange-400">{pendingCount} {t('dashboard.pending')}</span>
                  </div>
                )}
                <div className="h-4 w-px bg-border hidden sm:block" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>{t('dashboard.secureAccess')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-primary" />
                <span><strong>{orders.length}</strong> {t('dashboard.toolsOwned')}</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Subscriptions Section */}
        {user && (
          <section className="py-4">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-display font-bold flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    {t('dashboard.mySubscriptions', { defaultValue: 'My Subscriptions' })}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fetchSubscriptions()}
                    disabled={subsLoading}
                  >
                    <RefreshCw className={`w-4 h-4 ${subsLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>

                {subsLoading ? (
                  <div className="glass-strong rounded-2xl p-8 flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : subscriptions.length > 0 ? (
                  <div className="grid gap-3">
                    {subscriptions.map((sub: any) => {
                      const toolId = sub.tool_id || '';
                      const colors = toolColors[toolId] || { primary: '#a855f7', glow: '270 85% 65%' };
                      return (
                        <div
                          key={sub.id}
                          className="glass-strong rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center"
                              style={{ background: `linear-gradient(135deg, ${colors.primary}40, ${colors.primary}20)` }}
                            >
                              {toolLogos[toolId] ? (
                                <img src={toolLogos[toolId]} alt="" className="w-6 h-6 object-contain" />
                              ) : (
                                <CreditCard className="w-5 h-5 text-primary" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold">{sub.tool_name || 'Subscription'}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                                  sub.cancel_at_period_end 
                                    ? 'bg-orange-500/20 text-orange-400' 
                                    : 'bg-green-500/20 text-green-400'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${sub.cancel_at_period_end ? 'bg-orange-400' : 'bg-green-400'}`} />
                                  {sub.cancel_at_period_end ? t('dashboard.cancelling', { defaultValue: 'Cancelling' }) : t('dashboard.activeSub', { defaultValue: 'Active' })}
                                </span>
                                {sub.current_period_end && (
                                  <span className="flex items-center gap-1">
                                    <CalendarDays className="w-3 h-3" />
                                    {t('dashboard.renewsOn', { defaultValue: 'Renews' })}: {new Date(sub.current_period_end).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={openCustomerPortal}
                            disabled={portalLoading}
                          >
                            {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Settings className="w-4 h-4" />}
                            <span className="ms-1">{t('dashboard.manageSub', { defaultValue: 'Manage' })}</span>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="glass rounded-2xl p-6 text-center text-muted-foreground text-sm">
                    {t('dashboard.noSubscriptions', { defaultValue: 'No active subscriptions' })}
                  </div>
                )}
              </motion.div>
            </div>
          </section>
        )}

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
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredOrders.map((order, index) => (
                  <VaultToolCard key={order.id} order={order} index={index} />
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
