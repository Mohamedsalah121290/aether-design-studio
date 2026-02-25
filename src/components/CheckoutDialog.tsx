import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Loader2, Clock, CheckCircle, Mail, Lock, Gift, Sparkles, Shield, Zap, X as XIcon } from 'lucide-react';
import { z } from 'zod';
import type { Tool, ToolPlan } from './ToolCard';

interface CheckoutDialogProps {
  tool: Tool | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const emailSchema = z.string().trim().email('Please enter a valid email').max(255);
const passwordSchema = z.string().min(1, 'Password is required').max(100);

const WHAT_YOU_GET = [
  'Full premium access to all features',
  'Priority activation & setup',
  'Dedicated support channel',
  'Cancel anytime, no lock-in',
];

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

  const [plans, setPlans] = useState<ToolPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ToolPlan | null>(null);
  const [plansLoading, setPlansLoading] = useState(false);

  useEffect(() => {
    if (open && tool) fetchPlans(tool.tool_id);
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
      if (mapped.length > 0) setSelectedPlan(mapped[0]);
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
      if (!emailResult.success) newErrors.email = emailResult.error.errors[0]?.message || 'Invalid email';
    }
    if (selectedPlan?.delivery_type === 'subscribe_for_them') {
      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) newErrors.password = passwordResult.error.errors[0]?.message || 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tool || !selectedPlan) return;
    if (!validateForm()) return;
    if (!agreedToTerms) {
      toast({ title: t('checkout.error'), description: t('checkout.agreeToTerms'), variant: 'destructive' });
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
        },
      });
      if (error) throw error;
      if (!data?.url) throw new Error('No checkout URL returned');
      if (buyerEmail && !user) localStorage.setItem('buyer_email', buyerEmail);
      window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast({ title: t('checkout.error'), description: t('checkout.errorMessage'), variant: 'destructive' });
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
    switch (selectedPlan?.delivery_type) {
      case 'subscribe_for_them':
        return { icon: <Lock className="w-5 h-5" />, title: t('checkout.subscribeForYou'), description: t('checkout.subscribeDescription') };
      case 'email_only':
        return { icon: <Mail className="w-5 h-5" />, title: t('checkout.emailOnlyTitle'), description: t('checkout.emailOnlyDescription') };
      case 'provide_account':
        return { icon: <Gift className="w-5 h-5" />, title: t('checkout.provideAccountTitle'), description: t('checkout.provideAccountDescription') };
      default:
        return null;
    }
  };

  const deliveryInfo = getDeliveryInfo();
  const displayPrice = selectedPlan?.monthly_price;
  const activationTime = selectedPlan?.activation_time || 6;
  const usePills = plans.length > 1 && plans.length <= 4;
  const useDropdown = plans.length > 4;

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[460px] border-l border-white/10 p-0 overflow-y-auto"
        style={{
          background: 'linear-gradient(180deg, hsl(222 47% 10% / 0.98) 0%, hsl(222 47% 6% / 0.99) 100%)',
          backdropFilter: 'blur(40px)',
        }}
      >
        {/* Success state */}
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center h-full px-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
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
        ) : (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 pb-4 border-b border-white/10">
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
              <SheetHeader className="relative z-10">
                <SheetTitle className="text-xl font-display font-bold text-white">
                  {t('checkout.title')}
                </SheetTitle>
                <SheetDescription className="text-base">
                  <span className="text-primary font-semibold">{tool?.name}</span>
                  {displayPrice != null && displayPrice > 0 && (
                    <>
                      <span className="text-muted-foreground"> &mdash; </span>
                      <span className="text-white font-bold">${displayPrice}</span>
                      <span className="text-muted-foreground">/{t('store.perMonth')}</span>
                    </>
                  )}
                </SheetDescription>
              </SheetHeader>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Plan Selector - Pills */}
              {usePills && (
                <div>
                  <Label className="text-sm font-medium text-white mb-3 block">
                    {t('checkout.selectPlan', 'Select Plan')}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {plans.map(plan => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlan(plan)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          selectedPlan?.id === plan.id
                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                            : 'bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10 hover:text-foreground'
                        }`}
                      >
                        {plan.plan_name}
                        {plan.monthly_price != null && plan.monthly_price > 0 && (
                          <span className="ml-1.5 opacity-80">${plan.monthly_price}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Plan Selector - Dropdown */}
              {useDropdown && (
                <div>
                  <Label className="text-sm font-medium text-white mb-3 block">
                    {t('checkout.selectPlan', 'Select Plan')}
                  </Label>
                  <select
                    value={selectedPlan?.id || ''}
                    onChange={e => {
                      const plan = plans.find(p => p.id === e.target.value);
                      if (plan) setSelectedPlan(plan);
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm appearance-none cursor-pointer focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {plans.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.plan_name} {plan.monthly_price != null ? `- $${plan.monthly_price}/mo` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {plansLoading && (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}

              {/* Delivery info */}
              {deliveryInfo && !plansLoading && (
                <div
                  className="p-4 rounded-2xl border border-white/10"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}
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
                </div>
              )}

              {/* What you get */}
              <div className="space-y-2.5">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  What you get
                </h4>
                {WHAT_YOU_GET.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              {/* Form */}
              {!plansLoading && selectedPlan && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <AnimatePresence mode="wait">
                    {(selectedPlan.delivery_type === 'subscribe_for_them' || selectedPlan.delivery_type === 'email_only') && (
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 20, opacity: 0 }}
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
                          onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
                          required
                          disabled={isLoading}
                          className={`h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 ${errors.email ? 'border-red-500' : ''}`}
                        />
                        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                      </motion.div>
                    )}

                    {selectedPlan.delivery_type === 'subscribe_for_them' && (
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 20, opacity: 0 }}
                        transition={{ delay: 0.05 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="password" className="text-sm font-medium text-white flex items-center gap-2">
                          <Lock className="w-4 h-4 text-primary" />
                          {t('checkout.yourPassword')}
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="********"
                          value={password}
                          onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })); }}
                          required
                          disabled={isLoading}
                          className={`h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 ${errors.password ? 'border-red-500' : ''}`}
                        />
                        {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
                        <p className="text-xs text-muted-foreground">{t('checkout.passwordNote')}</p>
                      </motion.div>
                    )}

                    {selectedPlan.delivery_type === 'provide_account' && (
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="p-5 rounded-2xl text-center"
                        style={{
                          background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(168,85,247,0.05) 100%)',
                          border: '1px solid rgba(168,85,247,0.2)',
                        }}
                      >
                        <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                        <p className="text-white font-medium text-sm">{t('checkout.accountProvided')}</p>
                        <p className="text-xs text-muted-foreground mt-2">{t('checkout.accountProvidedNote')}</p>

                        <div className="mt-4 space-y-2 text-left">
                          <Label htmlFor="notify-email" className="text-sm font-medium text-white">
                            {t('checkout.notificationEmail')}
                          </Label>
                          <Input
                            id="notify-email"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Terms */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={checked => setAgreedToTerms(checked as boolean)}
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
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full h-14 text-base font-semibold rounded-2xl relative overflow-hidden group"
                    disabled={isLoading || !agreedToTerms}
                    style={{
                      background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
                      boxShadow: '0 8px 30px hsl(var(--primary) / 0.3)',
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

                  {/* Cancel anytime + activation time */}
                  <div className="space-y-2 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{t('checkout.activationTime', { hours: activationTime })}</span>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                      <Zap className="w-3 h-3" />
                      Cancel anytime. No commitment.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CheckoutDialog;
