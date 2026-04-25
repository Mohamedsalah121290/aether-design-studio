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
import { Badge } from '@/components/ui/badge';
import { Loader2, Clock, CheckCircle, Mail, Gift, Sparkles, Shield as ShieldIcon, Zap, ShieldCheck, UserCheck, Wallet } from 'lucide-react';
const Shield = ShieldIcon;
import { Switch } from '@/components/ui/switch';
import { z } from 'zod';
import type { Tool, ToolPlan } from './ToolCard';
import { AuthDialog } from './AuthDialog';
import { inferPeriodFromPlan, getPeriodStyle } from '@/lib/pricePeriod';
import { FINAL_PAYMENT_EUR_NOTE, formatApproxCurrency } from '@/lib/currency';
import { useCurrency } from '@/hooks/useCurrency';
import { ProductReviewsCarousel } from '@/components/ProductReviews';
import TrustBadges from '@/components/TrustBadges';
import { Social3DLink, TelegramIcon, WhatsAppIcon } from './ChatbotConversion';
import { supportLinks } from '@/lib/socialLinks';

interface CheckoutDialogProps {
  tool: Tool | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const emailSchema = z.string().trim().email('Please enter a valid email').max(255);

const WHAT_YOU_GET = [
  'Works instantly',
  'No installation needed',
  'Fast delivery',
];

const TAX_NOTE = 'Taxes (if applicable) are calculated at checkout.';

export const CheckoutDialog = ({ tool, open, onOpenChange, onSuccess }: CheckoutDialogProps) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const [plans, setPlans] = useState<ToolPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ToolPlan | null>(null);
  const [plansLoading, setPlansLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [applyWalletCredit, setApplyWalletCredit] = useState(false);

  // Guard: prevent checkout for non-active tools
  const isNonActive = tool && tool.status && tool.status !== 'active';

  useEffect(() => {
    if (isNonActive && open) { onOpenChange(false); return; }
    if (open && tool) {
      // Auth gate: require login before checkout
      if (!user) {
        onOpenChange(false);
        setShowAuthDialog(true);
        return;
      }
      fetchPlans(tool.tool_id);
      fetchWalletBalance();
    }
  }, [open, tool, user]);

  const fetchWalletBalance = async () => {
    if (!user) return;
    try {
      await supabase.rpc('ensure_wallet_exists');
      const { data } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();
      if (data) {
        const bal = Number(data.balance);
        setWalletBalance(bal);
        setApplyWalletCredit(bal > 0);
      }
    } catch (err) {
      console.error('Error fetching wallet:', err);
    }
  };

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
    const newErrors: { email?: string } = {};
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) newErrors.email = emailResult.error.errors[0]?.message || 'Invalid email';
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
          customerEmail: email || buyerEmail,
          useWalletCredit: applyWalletCredit && walletBalance > 0,
        },
      });
      if (error) throw error;

      // If fully paid by wallet, show success
      if (data?.paidByWallet) {
        setIsSuccess(true);
        onSuccess?.();
        return;
      }

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
      setAgreedToTerms(false);
      setSelectedPlan(null);
      setPlans([]);
      setApplyWalletCredit(false);
      setWalletBalance(0);
      onOpenChange(false);
    }
  };

  const getDeliveryInfo = () => {
    switch (selectedPlan?.delivery_type) {
      case 'subscribe_for_them':
      case 'email_only':
        return { icon: <UserCheck className="w-5 h-5" />, title: 'We Provide The Account For You', description: "We'll set up your premium account and send you the login details." };
      case 'provide_account':
        return { icon: <Gift className="w-5 h-5" />, title: t('checkout.provideAccountTitle'), description: t('checkout.provideAccountDescription') };
      default:
        return null;
    }
  };

  const deliveryInfo = getDeliveryInfo();
  const displayPrice = selectedPlan?.monthly_price;
  const approxDisplayPrice = formatApproxCurrency(displayPrice, currency.code);
  const activationTime = selectedPlan?.activation_time || 6;
  const usePills = plans.length > 1 && plans.length <= 4;
  const useDropdown = plans.length > 4;

  const walletDeduction = applyWalletCredit && displayPrice ? Math.min(walletBalance, displayPrice) : 0;
  const effectivePrice = displayPrice ? Math.max(0, displayPrice - walletDeduction) : displayPrice;

  return (
    <>
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
            <h3 className="text-2xl font-display font-bold mb-2 text-white">Thank you for your purchase.</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">Your access is being prepared. You will receive it shortly.</p>
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
                  {displayPrice != null && displayPrice > 0 && (() => {
                    const period = inferPeriodFromPlan(selectedPlan?.plan_name);
                    const style = getPeriodStyle(period);
                    return (
                      <>
                        <span className="text-muted-foreground"> &mdash; </span>
                        <span className={`font-bold ${style.textClass}`}>€{displayPrice}</span>
                        <span className="text-muted-foreground text-xs font-semibold"> (excl. VAT)</span>
                        <span className={`${style.textClass} opacity-80`}> {style.suffix}</span>
                        <span className={`ml-1.5 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-[1px] rounded-md border ${style.textClass}`} style={{ borderColor: 'currentColor', opacity: 0.85 }}>
                          {style.label}
                        </span>
                        {approxDisplayPrice && <span className="ms-1.5 text-xs text-muted-foreground">{approxDisplayPrice}</span>}
                      </>
                    );
                  })()}
                </SheetDescription>
                <p className="text-xs font-medium text-muted-foreground mt-2">{TAX_NOTE}</p>
                <p className="text-xs text-muted-foreground mt-1">{FINAL_PAYMENT_EUR_NOTE}</p>
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
                          <span className="ml-1.5 opacity-80">€{plan.monthly_price} (excl. VAT)</span>
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
                        {plan.plan_name} {plan.monthly_price != null ? `- €${plan.monthly_price}/mo (excl. VAT)` : ''}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs font-medium text-muted-foreground">{TAX_NOTE}</p>
                </div>
              )}

              {plansLoading && (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}

              {/* Delivery info + badges */}
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
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                      <UserCheck className="w-3 h-3 mr-1" />
                      Account Provided
                    </Badge>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      Activation within 4 hours
                    </Badge>
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 space-y-3">
                <h4 className="text-sm font-bold text-white">How you receive your access</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">After payment, you will receive your access quickly.</p>
                <div className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                  <p>We provide one of the following depending on the product:</p>
                  <p>✔ Account access (username + password)</p>
                  <p>✔ Activation key</p>
                  <p>✔ Direct activation on your account (on request)</p>
                </div>
                <div className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-sm leading-relaxed text-muted-foreground">
                  <p className="font-semibold text-white">Important information:</p>
                  <p className="mt-1">For some services, activation can be done on your personal account. If you choose this option, you will be contacted via WhatsApp and guided step-by-step through a secure process.</p>
                  <p className="mt-1 font-semibold text-primary">We do NOT ask for your personal passwords directly on the website.</p>
                  <p className="mt-1">We may use a secure method such as temporary access, guided activation, or alternative safe methods.</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
                  <span>✔ Fast delivery</span><span>✔ Secure process</span><span>✔ Real support</span>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold text-white">Need help? Contact us instantly:</p>
                  <div className="flex flex-wrap gap-3">
                    {supportLinks.whatsapp && <Social3DLink href={supportLinks.whatsapp} label="Contact on WhatsApp" tone="social-whatsapp-3d" className="w-12 h-12"><WhatsAppIcon className="w-6 h-6" /></Social3DLink>}
                    {supportLinks.telegram && <Social3DLink href={supportLinks.telegram} label="Contact on Telegram" tone="social-telegram-3d" className="w-12 h-12"><TelegramIcon className="w-6 h-6" /></Social3DLink>}
                  </div>
                </div>
              </div>

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

              {/* Wallet Credit Toggle */}
              {walletBalance > 0 && selectedPlan && !plansLoading && (
                <div
                  className="p-4 rounded-2xl border border-white/10"
                  style={{ background: 'linear-gradient(135deg, rgba(232,212,139,0.08) 0%, rgba(232,212,139,0.02) 100%)' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(232,212,139,0.15)' }}>
                        <Wallet className="w-5 h-5" style={{ color: '#E8D48B' }} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">Apply Wallet Credit</h4>
                        <p className="text-xs text-muted-foreground">
                          Available: <span style={{ color: '#E8D48B' }} className="font-semibold">€{walletBalance.toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={applyWalletCredit}
                      onCheckedChange={setApplyWalletCredit}
                    />
                  </div>
                  {applyWalletCredit && walletDeduction > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Original price</span>
                        <span>€{displayPrice?.toFixed(2)}/mo (excl. VAT)</span>
                      </div>
                      <div className="flex justify-between text-xs" style={{ color: '#E8D48B' }}>
                        <span>Wallet credit</span>
                        <span>-€{walletDeduction.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold text-white">
                        <span>You pay</span>
                        <span>{effectivePrice === 0 ? 'Free (covered by credit)' : `€${effectivePrice?.toFixed(2)}/mo (excl. VAT)`}</span>
                      </div>
                      <p className="text-xs font-medium text-muted-foreground text-right">{TAX_NOTE}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Form */}
              {!plansLoading && selectedPlan && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {tool && <ProductReviewsCarousel toolId={tool.tool_id} productName={tool.name} />}
                  <TrustBadges compact />

                  <AnimatePresence mode="wait">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="email" className="text-sm font-medium text-white flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        Activation Email
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
                      <p className="text-xs text-muted-foreground">We'll send activation + login details to this email.</p>
                    </motion.div>

                    {/* Trust note */}
                    <div className="flex items-center gap-2 text-xs text-green-400">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>Secure — we never ask for your passwords.</span>
                    </div>
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
                  <p className="text-xs font-medium text-muted-foreground text-center">{TAX_NOTE}</p>
                  <p className="text-[11px] text-muted-foreground text-center">Secure checkout via Stripe. Final payment in EUR.</p>

                  {/* Cancel anytime + activation time */}
                  <div className="space-y-3 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{t('checkout.activationTime', { hours: activationTime })}</span>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                      <Zap className="w-3 h-3" />
                      Cancel anytime. No commitment.
                    </p>
                  {/* Trust microcopy */}
                    <p className="text-xs flex items-center justify-center gap-1.5" style={{ color: '#E8D48B' }}>
                      <Shield className="w-3 h-3" />
                      Exclusive member pricing. Structured access model.
                    </p>
                    <p className="text-xs text-primary/80 flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3 h-3" />
                      If a tool goes down, we fix it or extend — fair and simple.
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      By purchasing, you agree to our{' '}
                      <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Terms</a>
                      {' & '}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy Policy</a>.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>

    {/* Auth gate dialog */}
    <AuthDialog
      open={showAuthDialog}
      onOpenChange={(v) => {
        setShowAuthDialog(v);
        // After login, re-open checkout
        if (!v && user && tool) {
          setTimeout(() => onOpenChange(true), 300);
        }
      }}
      defaultMode="login"
    />
    </>
  );
};

export default CheckoutDialog;
