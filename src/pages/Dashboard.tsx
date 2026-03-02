import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ExternalLink, Search, X,
  Settings, Bell, User, Shield, Clock, Loader2,
  CreditCard, RefreshCw, CalendarDays, CheckCircle, Sparkles, ArrowRight, ShieldCheck,
  Eye, EyeOff, Lock, Package, Copy, Check, GraduationCap, Play,
  AlertTriangle, MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
  activated_at: string | null;
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

interface OrderCredential {
  email: string;
  password: string;
}

interface DecryptedCredentials {
  email: string;
  password: string;
}

// Report Issue Modal
const ReportIssueModal = ({ open, onClose, toolName }: { open: boolean; onClose: () => void; toolName: string }) => {
  const [issueType, setIssueType] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const issueTypes = [
    { value: 'activation_delay', label: 'Activation delay' },
    { value: 'login_issue', label: 'Login issue' },
    { value: 'tool_outage', label: 'Tool outage / not working' },
  ];

  const handleSubmit = () => {
    if (!issueType) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onClose();
      setIssueType('');
      setDetails('');
      toast({ title: 'Issue reported', description: "We'll get back to you within 24 hours." });
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-md border-white/10" style={{ background: 'linear-gradient(180deg, hsl(222 47% 12%) 0%, hsl(222 47% 8%) 100%)' }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            Report an Issue — {toolName}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Select the type of issue and we'll resolve it within 24 hours.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Issue type</p>
            <div className="grid gap-2">
              {issueTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => setIssueType(type.value)}
                  className={`px-4 py-3 rounded-xl text-sm text-left transition-all ${
                    issueType === type.value
                      ? 'bg-primary/20 border border-primary/40 text-foreground'
                      : 'bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Additional details (optional)</p>
            <textarea
              value={details}
              onChange={e => setDetails(e.target.value)}
              placeholder="Describe what happened..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!issueType || submitting}
            className="w-full"
            style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)' }}
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <MessageCircle className="w-4 h-4 mr-2" />}
            Submit Report
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Typical response time: within 24 hours. <a href="/terms#refunds" className="text-primary hover:underline">View refund policy</a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Subscription Card Component
const SubscriptionCard = ({ order, index, onViewCredentials, onReportIssue }: { order: Order; index: number; onViewCredentials: (order: Order) => void; onReportIssue: (order: Order) => void }) => {
  const toolId = order.tool?.tool_id || '';
  const logoUrl = toolLogos[toolId];
  const colors = toolColors[toolId] || { primary: '#a855f7', glow: '270 85% 65%' };
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const isPendingActivation = order.status === 'pending' || order.status === 'pending_activation' || order.status === 'processing';
  const isDelivered = order.status === 'delivered' || order.status === 'active' || order.status === 'activated';

  const statusConfig = isPendingActivation
    ? { label: 'Pending Activation', color: 'text-orange-400', bg: 'bg-orange-500/20', icon: <Clock className="w-3.5 h-3.5" /> }
    : { label: 'Delivered', color: 'text-green-400', bg: 'bg-green-500/20', icon: <CheckCircle className="w-3.5 h-3.5" /> };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative group"
    >
      <div
        className="relative rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl"
        style={{
          background: 'linear-gradient(135deg, hsl(222 47% 11% / 0.95) 0%, hsl(222 47% 8% / 0.98) 100%)',
          boxShadow: `0 15px 40px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)`,
        }}
      >
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: `linear-gradient(180deg, ${colors.primary}12 0%, transparent 100%)` }}
        />

        {/* Status badge */}
        <div className={`absolute top-4 end-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
          {isPendingActivation ? (
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              {statusConfig.icon}
            </motion.div>
          ) : statusConfig.icon}
          {statusConfig.label}
        </div>

        <div className="p-6">
          {/* Logo */}
          <div className="mb-5 relative">
            <motion.div
              className="relative w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                boxShadow: `0 8px 30px ${colors.primary}30, 0 0 0 1px rgba(255,255,255,0.1)`,
              }}
            >
              {logoUrl && !logoError ? (
                <img
                  src={logoUrl}
                  alt={`${order.tool?.name} logo`}
                  className={`w-9 h-9 object-contain transition-opacity duration-300 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setLogoLoaded(true)}
                  onError={() => setLogoError(true)}
                  loading="lazy"
                />
              ) : null}
              {(!logoUrl || logoError || !logoLoaded) && (
                <span className="text-xl font-bold text-white" style={{ textShadow: `0 2px 10px ${colors.primary}` }}>
                  {order.tool?.name?.charAt(0) || '?'}
                </span>
              )}
            </motion.div>
          </div>

          {/* Tool name */}
          <h3 className="text-lg font-display font-bold mb-1 text-white">{order.tool?.name || 'Unknown Tool'}</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Purchased: {new Date(order.created_at).toLocaleDateString()}
          </p>

          {/* Status-specific content */}
          {isPendingActivation && (
            <div className="mb-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-1">
                <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Clock className="w-4 h-4 text-orange-400" />
                </motion.div>
                <p className="text-xs text-orange-400 font-semibold">Activation in progress</p>
              </div>
              <p className="text-sm text-orange-300">Your account is being set up. You'll receive your credentials soon.</p>
            </div>
          )}

          {isDelivered && order.activated_at && (
            <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle className="w-3.5 h-3.5 text-green-400" />
              Activated: {new Date(order.activated_at).toLocaleDateString()}
            </div>
          )}

          {/* Policy link for delivered */}
          {isDelivered && (
            <a href="/terms#refunds" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-3">
              <Shield className="w-3 h-3" />
              Downtime & refund policy
            </a>
          )}

          {/* Action buttons */}
          <div className="space-y-2">
            {isDelivered ? (
              <Button
                className="w-full relative overflow-hidden group/btn"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}cc 100%)`,
                }}
                onClick={() => onViewCredentials(order)}
              >
                <span className="relative z-10 flex items-center gap-2 font-semibold text-white">
                  <Eye className="w-4 h-4" />
                  View Credentials
                </span>
              </Button>
            ) : (
              <div className="w-full py-3 rounded-xl bg-muted/50 border border-border text-center">
                <span className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  Waiting for activation
                </span>
              </div>
            )}

            {/* Report Issue */}
            <button
              onClick={() => onReportIssue(order)}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <AlertTriangle className="w-3 h-3" />
              Report an issue
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// View Credentials Modal
const CredentialsModal = ({ open, onClose, order }: { open: boolean; onClose: () => void; order: Order | null }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState<DecryptedCredentials | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const toolId = order?.tool?.tool_id || '';
  const accessUrl = order?.tool?.access_url || toolAccessUrls[toolId] || '';

  useEffect(() => {
    if (!open) {
      setShowPassword(false);
      setCredentials(null);
      setCopiedField(null);
      return;
    }
    if (order) fetchDecryptedCredentials(order.id);
  }, [open, order]);

  const fetchDecryptedCredentials = async (orderId: string) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data, error } = await supabase.functions.invoke('get-credentials', {
        body: { order_id: orderId },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;
      setCredentials(data as DecryptedCredentials);
    } catch (err) {
      console.error('Failed to fetch credentials:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-md border-white/10" style={{ background: 'linear-gradient(180deg, hsl(222 47% 12%) 0%, hsl(222 47% 8%) 100%)' }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Shield className="w-5 h-5 text-primary" />
            Your Credentials — {order?.tool?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : credentials ? (
            <>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-muted-foreground">Login Email</p>
                    <button onClick={() => copyToClipboard(credentials.email, 'email')} className="text-muted-foreground hover:text-white transition-colors">
                      {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-sm font-medium text-white font-mono">{credentials.email}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-muted-foreground">Password</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => copyToClipboard(credentials.password, 'password')} className="text-muted-foreground hover:text-white transition-colors">
                        {copiedField === 'password' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-white transition-colors">
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-white font-mono">
                    {showPassword ? credentials.password : '••••••••••••'}
                  </p>
                </div>
              </div>

              {accessUrl && (
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => window.open(accessUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open {order?.tool?.name}
                </Button>
              )}

              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-xs text-primary flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Please change your password after first login if applicable.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Lock className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Credentials not yet available.</p>
              <p className="text-xs mt-1">They will appear once your order is delivered.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState<Record<string, boolean>>({});
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [credentialsModal, setCredentialsModal] = useState<{ open: boolean; order: Order | null }>({ open: false, order: null });
  const [activeTab, setActiveTab] = useState<'tools' | 'academy'>('tools');
  const [academySubs, setAcademySubs] = useState<any[]>([]);
  const [academyLoading, setAcademyLoading] = useState(false);
  const [reportIssueModal, setReportIssueModal] = useState<{ open: boolean; toolName: string }>({ open: false, toolName: '' });

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' || i18n.language === 'ur' ? 'rtl' : 'ltr';
    window.scrollTo(0, 0);

    const checkoutStatus = searchParams.get('checkout');
    if (checkoutStatus === 'success') {
      setShowSuccessScreen(true);
      searchParams.delete('checkout');
      searchParams.delete('session_id');
      setSearchParams(searchParams, { replace: true });
    } else if (checkoutStatus === 'cancelled') {
      toast({
        title: 'Payment Cancelled',
        description: 'Your payment was cancelled. No charges were made.',
        variant: 'destructive',
      });
      searchParams.delete('checkout');
      setSearchParams(searchParams, { replace: true });
    }

    fetchOrders();
    if (user) {
      fetchSubscriptions();
      fetchAcademySubs();
    }

    const channel = supabase
      .channel('orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchOrders())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [i18n.language, user]);

  const fetchAcademySubs = async () => {
    if (!user) return;
    setAcademyLoading(true);
    try {
      const { data } = await supabase
        .from('academy_subscriptions')
        .select('*, course:courses(*)')
        .eq('status', 'active')
        .order('started_at', { ascending: false });
      setAcademySubs(data || []);
    } catch (err) {
      console.error('Error fetching academy subs:', err);
    } finally {
      setAcademyLoading(false);
    }
  };

  const fetchOrders = async () => {
    const email = localStorage.getItem('buyer_email');
    if (!user && !email) { setLoading(false); return; }

    try {
      let query = supabase
        .from('orders')
        .select(`*, tool:tools(tool_id, name, price, access_url, delivery_type)`)
        .order('created_at', { ascending: false });

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
        activated_at: order.activated_at,
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
      if (mappedOrders.length > 0 && showSuccessScreen) setLatestOrder(mappedOrders[0]);

      // Track which orders have credentials (for badge display)
      if (user) {
        const deliveredIds = mappedOrders
          .filter(o => o.status === 'delivered' || o.status === 'active' || o.status === 'activated')
          .map(o => o.id);
        
        if (deliveredIds.length > 0) {
          const { data: credsData } = await supabase
            .from('order_credentials')
            .select('order_id')
            .in('order_id', deliveredIds);
          
          if (credsData) {
            const credsMap: Record<string, boolean> = {};
            credsData.forEach((cred: any) => {
              credsMap[cred.order_id] = true;
            });
            setCredentials(credsMap);
          }
        }
      }
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

  const handleViewCredentials = (order: Order) => {
    setCredentialsModal({ open: true, order });
  };

  const filteredOrders = orders.filter(order =>
    order.tool?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = orders.filter(o => ['pending', 'pending_activation', 'processing'].includes(o.status)).length;
  const deliveredCount = orders.filter(o => ['delivered', 'active', 'activated'].includes(o.status)).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        {/* Checkout Success Overlay */}
        <AnimatePresence>
          {showSuccessScreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: 'radial-gradient(ellipse at center, hsl(222 47% 8% / 0.97) 0%, hsl(222 47% 4% / 0.99) 100%)' }}
            >
              <motion.div
                initial={{ scale: 0.8, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-md rounded-3xl border border-white/10 overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, hsl(222 47% 14% / 0.95) 0%, hsl(222 47% 8% / 0.98) 100%)',
                  boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at top center, rgba(34,197,94,0.15) 0%, transparent 70%)' }}
                />

                <div className="relative p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2, damping: 15 }}
                    className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(16,185,129,0.1) 100%)',
                      boxShadow: '0 10px 40px rgba(34,197,94,0.3)',
                      border: '2px solid rgba(34,197,94,0.3)',
                    }}
                  >
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </motion.div>

                  <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="text-2xl font-display font-bold text-white mb-2">
                    Payment Successful!
                  </motion.h2>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                    className="text-muted-foreground mb-6">
                    Your order has been placed and is being processed.
                  </motion.p>

                  {latestOrder && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                      className="rounded-2xl p-4 mb-6 text-left border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/20">
                          {toolLogos[latestOrder.tool?.tool_id || ''] ? (
                            <img src={toolLogos[latestOrder.tool?.tool_id || '']} alt="" className="w-6 h-6 object-contain" />
                          ) : (
                            <Sparkles className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{latestOrder.tool?.name || 'AI Tool'}</p>
                          <p className="text-xs text-muted-foreground">${latestOrder.tool?.price}/mo</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Status</span>
                          <span className="text-orange-400 font-medium flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> Pending Activation
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Order ID</span>
                          <span className="text-white font-mono text-xs">{latestOrder.id.slice(0, 8)}...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Timeline */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                    className="rounded-2xl p-4 mb-6 text-left border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-xs font-semibold text-white mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" /> What happens next
                    </p>
                    <div className="space-y-3">
                      {[
                        { label: 'Payment confirmed', done: true },
                        { label: 'Account being set up', done: false, active: true },
                        { label: 'Login details sent to your email', done: false },
                        { label: 'Credentials appear in My Subscriptions', done: false },
                      ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            step.done ? 'bg-green-500/20' : step.active ? 'bg-primary/20 ring-2 ring-primary/30' : 'bg-white/5'
                          }`}>
                            {step.done ? <CheckCircle className="w-3 h-3 text-green-400" /> :
                             step.active ? <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2 h-2 rounded-full bg-primary" /> :
                             <div className="w-2 h-2 rounded-full bg-white/20" />}
                          </div>
                          <span className={`text-sm ${step.done ? 'text-green-400' : step.active ? 'text-white' : 'text-muted-foreground'}`}>{step.label}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                    <Button onClick={() => setShowSuccessScreen(false)}
                      className="w-full h-12 rounded-2xl font-semibold text-base"
                      style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)', boxShadow: '0 8px 30px hsl(var(--primary) / 0.3)' }}>
                      <span className="flex items-center gap-2">Go to My Subscriptions <ArrowRight className="w-4 h-4" /></span>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-3">We'll email you when your account is ready.</p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <section className="relative py-8 overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-20" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 start-10 w-32 h-32 border border-primary/10 rounded-full" />
            <div className="absolute bottom-10 end-10 w-40 h-40 border border-secondary/10 rounded-full" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)', boxShadow: '0 10px 40px hsl(var(--primary) / 0.3)' }}>
                    <Package className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-display font-black">My Subscriptions</h1>
                    <p className="text-muted-foreground">Your purchased tools & credentials</p>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="glass"><Bell className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="glass"><Settings className="w-5 h-5" /></Button>
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="glass-strong rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm font-medium text-green-400">{deliveredCount} Active Tools</span>
                </div>
                {pendingCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-orange-400" />
                    <span className="text-sm font-medium text-orange-400">{pendingCount} Pending</span>
                  </div>
                )}
                <div className="h-4 w-px bg-border hidden sm:block" />
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm font-medium text-primary">{academySubs.length} Academy Courses</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Secure access</span>
              </div>
            </motion.div>

            {pendingCount > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="mt-3 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <p className="text-sm text-orange-300">Activation in progress — you'll see login details here once ready.</p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Tabs */}
        <section className="py-2">
          <div className="container mx-auto px-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('tools')}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'tools'
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10'
                }`}
              >
                <Package className="w-4 h-4" /> Tool Subscriptions
              </button>
              <button
                onClick={() => setActiveTab('academy')}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'academy'
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10'
                }`}
              >
                <GraduationCap className="w-4 h-4" /> Academy
                {academySubs.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">{academySubs.length}</span>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Stripe Subscriptions */}
        {user && activeTab === 'tools' && (
          <section className="py-4">
            <div className="container mx-auto px-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-display font-bold flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" /> Billing & Subscriptions
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => fetchSubscriptions()} disabled={subsLoading}>
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
                        <div key={sub.id} className="glass-strong rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                              style={{ background: `linear-gradient(135deg, ${colors.primary}40, ${colors.primary}20)` }}>
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
                                  sub.cancel_at_period_end ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${sub.cancel_at_period_end ? 'bg-orange-400' : 'bg-green-400'}`} />
                                  {sub.cancel_at_period_end ? 'Cancelling' : 'Active'}
                                </span>
                                {sub.current_period_end && (
                                  <span className="flex items-center gap-1">
                                    <CalendarDays className="w-3 h-3" /> Renews: {new Date(sub.current_period_end).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={openCustomerPortal} disabled={portalLoading}>
                            {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Settings className="w-4 h-4" />}
                            <span className="ms-1">Manage</span>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="glass rounded-2xl p-6 text-center text-muted-foreground text-sm">
                    No active billing subscriptions
                  </div>
                )}
              </motion.div>
            </div>
          </section>
        )}

        {/* Tools Tab Content */}
        {activeTab === 'tools' && (
          <>
            {/* Search */}
            <section className="py-4">
              <div className="container mx-auto px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-md">
                  <div className="relative">
                    <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search your subscriptions..."
                      className="w-full ps-12 pe-10 py-3 rounded-xl bg-card/80 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute end-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Subscriptions Grid */}
            <section className="py-8">
              <div className="container mx-auto px-4">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : filteredOrders.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredOrders.map((order, index) => (
                      <SubscriptionCard
                        key={order.id}
                        order={order}
                        index={index}
                        onViewCredentials={handleViewCredentials}
                        onReportIssue={(o) => setReportIssueModal({ open: true, toolName: o.tool?.name || 'Tool' })}
                      />
                    ))}
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                      style={{ background: 'linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--muted)) 100%)' }}>
                      <Package className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-display font-bold mb-2">No subscriptions yet</h3>
                    <p className="text-muted-foreground mb-6">Browse the store to get started</p>
                    <Button variant="hero" asChild>
                      <a href="/#store">Go to Store</a>
                    </Button>
                  </motion.div>
                )}
              </div>
            </section>
          </>
        )}

        {/* Academy Tab Content */}
        {activeTab === 'academy' && (
          <section className="py-8">
            <div className="container mx-auto px-4">
              {academyLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : academySubs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {academySubs.map((sub: any, index: number) => {
                    const course = sub.course;
                    return (
                      <motion.div
                        key={sub.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                        className="relative group"
                      >
                        <div
                          className="relative rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl"
                          style={{
                            background: 'linear-gradient(135deg, hsl(222 47% 11% / 0.95) 0%, hsl(222 47% 8% / 0.98) 100%)',
                            boxShadow: '0 15px 40px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                          }}
                        >
                          {/* Thumbnail */}
                          {course?.thumbnail_url && (
                            <div className="aspect-video relative overflow-hidden">
                              <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
                              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(222_47%_8%)] via-transparent to-transparent" />
                            </div>
                          )}

                          {/* Status badge */}
                          <div className="absolute top-4 end-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                            <CheckCircle className="w-3.5 h-3.5" /> Enrolled
                          </div>

                          <div className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                              <GraduationCap className="w-5 h-5 text-primary" />
                              <span className="text-xs text-muted-foreground capitalize">{course?.category?.replace('-', ' ')}</span>
                            </div>
                            <h3 className="text-lg font-display font-bold mb-1 text-white">{course?.title || 'Course'}</h3>
                            <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{course?.description}</p>

                            <Button
                              className="w-full"
                              variant="hero"
                              onClick={() => window.location.href = '/academy'}
                            >
                              <Play className="w-4 h-4 mr-2" /> Continue Learning
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    style={{ background: 'linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--muted)) 100%)' }}>
                    <GraduationCap className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-2">No academy courses yet</h3>
                  <p className="text-muted-foreground mb-6">Explore the Academy to start learning</p>
                  <Button variant="hero" asChild>
                    <a href="/academy">Browse Academy</a>
                  </Button>
                </motion.div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* View Credentials Modal */}
      <CredentialsModal
        open={credentialsModal.open}
        onClose={() => setCredentialsModal({ open: false, order: null })}
        order={credentialsModal.order}
      />

      {/* Report Issue Modal */}
      <ReportIssueModal
        open={reportIssueModal.open}
        onClose={() => setReportIssueModal({ open: false, toolName: '' })}
        toolName={reportIssueModal.toolName}
      />
    </div>
  );
};

export default Dashboard;
