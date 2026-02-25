import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Loader2, Clock, CheckCircle, Mail, Lock, Gift, Sparkles } from 'lucide-react';
import { z } from 'zod';
import type { Tool, ToolPlan } from './ToolCard';

interface CheckoutDialogProps {
  tool: Tool | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// Validation schemas
const emailSchema = z.string().trim().email('Please enter a valid email').max(255);
const passwordSchema = z.string().min(1, 'Password is required').max(100);

export const CheckoutDialog = ({ tool, open, onOpenChange, onSuccess }: CheckoutDialogProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Plan state
  const [plans, setPlans] = useState<ToolPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ToolPlan | null>(null);
  const [plansLoading, setPlansLoading] = useState(false);

  // Fetch plans when dialog opens
  useEffect(() => {
    if (open && tool) {
      fetchPlans(tool.tool_id);
    }
  }, [open, tool]);

  const fetchPlans = async (toolId: string) => {
    setPlansLoading(true);
    try {
      const { data, error } = await supabase
        .from('tool_plans')
        .select('*')
        .eq('tool_id', toolId)
        .eq('is_active', true)
        .order('monthly_price', { ascending: true, nullsFirst: false });

      if (error) throw error;

      const mapped: ToolPlan[] = (data || []).map(p => ({
        id: p.id,
        tool_id: p.tool_id,
        plan_id: p.plan_id,
        plan_name: p.plan_name,
        monthly_price: p.monthly_price ? Number(p.monthly_price) : null,
        delivery_type: p.delivery_type as ToolPlan['delivery_type'],
        activation_time: p.activation_time,
        is_active: p.is_active,
      }));

      setPlans(mapped);
      if (mapped.length > 0) {
        setSelectedPlan(mapped[0]);
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
    } finally {
      setPlansLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (selectedPlan?.delivery_type !== 'provide_account' || !user) {
      const emailResult = emailSchema.safeParse(email);
      if (!emailResult.success) {
        newErrors.email = emailResult.error.errors[0]?.message || 'Invalid email';
      }
    }
    
    if (selectedPlan?.delivery_type === 'subscribe_for_them') {
      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) {
        newErrors.password = passwordResult.error.errors[0]?.message || 'Password is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tool || !selectedPlan) return;

    if (!validateForm()) return;

    if (!agreedToTerms) {
      toast({
        title: t('checkout.error'),
        description: t('checkout.agreeToTerms'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const buyerEmail = email || user?.email;
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          toolId: tool.id,
          planId: selectedPlan.plan_id,
          customerEmail: selectedPlan.delivery_type === 'subscribe_for_them' || selectedPlan.delivery_type === 'email_only' ? email : buyerEmail,
          customerPassword: selectedPlan.delivery_type === 'subscribe_for_them' ? password : undefined,
        }
      });

      if (error) throw error;
      if (!data?.url) throw new Error('No checkout URL returned');

      if (buyerEmail && !user) {
        localStorage.setItem('buyer_email', buyerEmail);
      }

      window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: t('checkout.error'),
        description: t('checkout.errorMessage'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setIsSuccess(false);
      setEmail('');
      setPassword('');
      setAgreedToTerms(false);
      setSelectedPlan(null);
      setPlans([]);
      onOpenChange(false);
    }
  };

  const getDeliveryInfo = () => {
    const dt = selectedPlan?.delivery_type;
    switch (dt) {
      case 'subscribe_for_them':
        return {
          icon: <Lock className="w-5 h-5" />,
          title: t('checkout.subscribeForYou'),
          description: t('checkout.subscribeDescription'),
        };
      case 'email_only':
        return {
          icon: <Mail className="w-5 h-5" />,
          title: t('checkout.emailOnlyTitle'),
          description: t('checkout.emailOnlyDescription'),
        };
      case 'provide_account':
        return {
          icon: <Gift className="w-5 h-5" />,
          title: t('checkout.provideAccountTitle'),
          description: t('checkout.provideAccountDescription'),
        };
      default:
        return null;
    }
  };

  const deliveryInfo = getDeliveryInfo();
  const displayPrice = selectedPlan?.monthly_price;
  const activationTime = selectedPlan?.activation_time || 6;

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md border-0 bg-transparent p-0 shadow-none">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsl(222 47% 11% / 0.98) 0%, hsl(222 47% 8% / 0.99) 100%)',
              boxShadow: '0 25px 80px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/5" />
            <div className="relative flex flex-col items-center justify-center py-12 px-8 text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6"
                style={{ boxShadow: '0 10px 40px rgba(34, 197, 94, 0.4)' }}
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-display font-bold mb-2 text-white">{t('checkout.orderPlaced')}</h3>
              <p className="text-muted-foreground mb-4">{t('checkout.checkVault')}</p>
              <div className="flex items-center gap-2 text-sm text-green-400">
                <Clock className="w-4 h-4" />
                <span>{t('checkout.activatingIn', { hours: activationTime })}</span>
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg border-0 bg-transparent p-0 shadow-none">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, hsl(222 47% 11% / 0.98) 0%, hsl(222 47% 8% / 0.99) 100%)',
            boxShadow: '0 25px 80px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5 pointer-events-none" />
          
          {/* Top shine effect */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          <div className="relative p-8">
            <DialogHeader className="text-center mb-6">
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <DialogTitle className="text-2xl font-display font-bold text-white mb-2">
                  {t('checkout.title')}
                </DialogTitle>
                <DialogDescription className="text-base">
                  <span className="text-primary font-semibold">{tool?.name}</span>
                  {displayPrice != null && displayPrice > 0 && (
                    <>
                      <span className="text-muted-foreground"> - </span>
                      <span className="text-white font-bold">${displayPrice}</span>
                      <span className="text-muted-foreground">/{t('store.perMonth')}</span>
                    </>
                  )}
                </DialogDescription>
              </motion.div>
            </DialogHeader>

            {/* Plan Selector */}
            {plans.length > 1 && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.12 }}
                className="mb-6"
              >
                <Label className="text-sm font-medium text-white mb-3 block">
                  {t('checkout.selectPlan', 'Select Plan')}
                </Label>
                <div className="grid gap-2">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 text-left ${
                        selectedPlan?.id === plan.id
                          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedPlan?.id === plan.id ? 'border-primary' : 'border-white/30'
                        }`}>
                          {selectedPlan?.id === plan.id && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <span className="font-semibold text-white">{plan.plan_name}</span>
                      </div>
                      {plan.monthly_price != null && plan.monthly_price > 0 ? (
                        <span className="font-bold text-white">
                          ${plan.monthly_price}<span className="text-xs text-muted-foreground">/{t('store.perMonth')}</span>
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {t('store.contactForPrice', 'Contact')}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {plansLoading && (
              <div className="flex justify-center py-6">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}

            {/* Delivery Type Info Card */}
            {deliveryInfo && !plansLoading && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="mb-6 p-4 rounded-2xl border border-white/10"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    {deliveryInfo.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{deliveryInfo.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{deliveryInfo.description}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {!plansLoading && selectedPlan && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence mode="wait">
                  {/* Email Field - For subscribe_for_them and email_only */}
                  {(selectedPlan.delivery_type === 'subscribe_for_them' || selectedPlan.delivery_type === 'email_only') && (
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="email" className="text-sm font-medium text-white flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        {t('checkout.yourEmail')}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
                        required
                        disabled={isLoading}
                        className={`h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 ${errors.email ? 'border-red-500' : ''}`}
                      />
                      {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                    </motion.div>
                  )}

                  {/* Password Field - Only for subscribe_for_them */}
                  {selectedPlan.delivery_type === 'subscribe_for_them' && (
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      transition={{ delay: 0.25 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="password" className="text-sm font-medium text-white flex items-center gap-2">
                        <Lock className="w-4 h-4 text-primary" />
                        {t('checkout.yourPassword')}
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })); }}
                        required
                        disabled={isLoading}
                        className={`h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 ${errors.password ? 'border-red-500' : ''}`}
                      />
                      {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
                      <p className="text-xs text-muted-foreground">{t('checkout.passwordNote')}</p>
                    </motion.div>
                  )}

                  {/* Provide Account Message */}
                  {selectedPlan.delivery_type === 'provide_account' && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="p-6 rounded-2xl text-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
                        border: '1px solid rgba(168, 85, 247, 0.2)',
                      }}
                    >
                      <Sparkles className="w-10 h-10 text-primary mx-auto mb-3" />
                      <p className="text-white font-medium">{t('checkout.accountProvided')}</p>
                      <p className="text-sm text-muted-foreground mt-2">{t('checkout.accountProvidedNote')}</p>
                      
                      <div className="mt-4 space-y-2 text-left">
                        <Label htmlFor="notify-email" className="text-sm font-medium text-white">
                          {t('checkout.notificationEmail')}
                        </Label>
                        <Input
                          id="notify-email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isLoading}
                          className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Terms Checkbox */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className="mt-0.5 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div className="flex-1">
                    <Label htmlFor="terms" className="text-sm text-white cursor-pointer font-medium">
                      {t('checkout.termsTitle')}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('checkout.termsDescription', { hours: activationTime })}
                    </p>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg font-semibold rounded-2xl relative overflow-hidden group"
                    disabled={isLoading || !agreedToTerms}
                    style={{
                      background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%)',
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {t('checkout.processing')}
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          {t('checkout.confirmPurchase')}
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </motion.div>

                {/* Activation Notice */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>{t('checkout.activationTime', { hours: activationTime })}</span>
                </motion.div>
              </form>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
