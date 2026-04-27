import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { AuthDialog } from '@/components/AuthDialog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Loader2, CheckCircle, Mail, Shield, ShieldCheck, Sparkles,
  Clock, Zap, UserCheck, Wallet, CreditCard, Building2, ArrowLeft,
  Crown,
} from 'lucide-react';
import { z } from 'zod';
import type { ToolPlan } from '@/components/ToolCard';
import { inferPeriodFromPlan, getPeriodStyle, formatEuro } from '@/lib/pricePeriod';
import { FINAL_PAYMENT_EUR_NOTE, formatApproxCurrency } from '@/lib/currency';
import { useCurrency } from '@/hooks/useCurrency';
import { ProductRatingInline, ProductReviewsCarousel } from '@/components/ProductReviews';
import TrustBadges from '@/components/TrustBadges';
import { Social3DLink, TelegramIcon, WhatsAppIcon } from '@/components/ChatbotConversion';
import { isUsableSocialLink, supportLinks } from '@/lib/socialLinks';
import { getRegionCategory } from '@/lib/geo';
import { getStripeLink } from '@/lib/stripeLinks';
import { getProductLogoUrl } from '@/lib/productLogos';

const emailSchema = z.string().trim().email().max(255);

/* ── Payment method config ─────────────────────────────────────── */
const PAYMENT_METHODS = [
  {
    id: 'card',
    label: 'Card',
    description: 'Visa, Mastercard, Amex — paid in EUR',
    icon: CreditCard,
    stripeTypes: ['card', 'bancontact'],
  },
  {
    id: 'bancontact',
    label: 'Bancontact',
    description: 'Belgian bank payment — paid in EUR',
    icon: Building2,
    stripeTypes: ['bancontact', 'card'],
  },
] as const;

const WHAT_YOU_GET = [
  'store.worksInstantly',
  'store.noInstallationNeeded',
  'store.fastDelivery',
];

const LOVABLE_PLAN_DETAILS: Record<string, { badge: string; duration: string; credits: string; months: number }> = {
  pro_monthly: { badge: 'store.mostPopular', duration: 'store.durationOneMonth', credits: 'store.creditsMonthly', months: 1 },
  lovable_2_months: { badge: 'store.bestStarter', duration: 'store.durationTwoMonths', credits: 'store.creditsMonthly', months: 2 },
  lovable_3_months: { badge: 'store.bestValue', duration: 'store.durationThreeMonths', credits: 'store.creditsMonthly', months: 3 },
};

const getMonthlyPlanValue = (plan: ToolPlan) => {
  const details = LOVABLE_PLAN_DETAILS[plan.plan_id];
  if (!plan.monthly_price) return null;
  const monthly = Number(plan.monthly_price) / (details?.months || getPlanDurationMonths(plan.plan_name));
  return `≈ €${Number.isInteger(monthly) ? monthly : monthly.toFixed(1)} {t('store.period.monthly', '/ month')}`;
};

const getPlanDurationMonths = (planName: string) => {
  const name = planName.toLowerCase();
  const monthMatch = name.match(/\b(\d+)\s*months?\b/) || name.match(/\b(\d+)m\b/);
  if (monthMatch) return Number(monthMatch[1]);
  if (name.includes('year') || name.includes('annual') || /\b1\s*y\b/.test(name)) return 12;
  return 1;
};

const getBestValuePlan = (plans: ToolPlan[]) => {
  const pricedPlans = plans.filter(plan => plan.monthly_price && plan.monthly_price > 0);
  return pricedPlans.reduce<ToolPlan | null>((best, plan) => {
    if (!best) return plan;
    const currentValue = Number(plan.monthly_price) / (LOVABLE_PLAN_DETAILS[plan.plan_id]?.months || getPlanDurationMonths(plan.plan_name));
    const bestValue = Number(best.monthly_price) / (LOVABLE_PLAN_DETAILS[best.plan_id]?.months || getPlanDurationMonths(best.plan_name));
    return currentValue < bestValue ? plan : best;
  }, null);
};

const tierLabel = (index: number, total: number) => {
  if (total <= 1) return 'store.mostPopular';
  if (index === 0) return 'store.pricingTiers.starter.name';
  if (index === Math.min(1, total - 1)) return 'store.mostPopular';
  return 'store.pricingTiers.pro.name';
};

type BillingInterval = 'monthly' | 'annual';

const PaymentPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const { user } = useAuth();
  const isBelgianUser = getRegionCategory() === 'belgium';

  const [tool, setTool] = useState<any>(null);
  const [plans, setPlans] = useState<ToolPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ToolPlan | null>(null);
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(isBelgianUser ? 'bancontact' : 'card');
  const [email, setEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const [walletBalance, setWalletBalance] = useState(0);
  const [applyWalletCredit, setApplyWalletCredit] = useState(false);
  const logoUrl = getProductLogoUrl(tool?.tool_id, tool?.logo_url);

  useEffect(() => {
    if (toolId) {
      fetchToolAndPlans(toolId);
    }
  }, [toolId]);

  useEffect(() => {
    if (user) {
      fetchWalletBalance();
      setShowAuthDialog(false);
    }
  }, [user]);

  const fetchToolAndPlans = async (id: string) => {
    setPageLoading(true);
    setPageError(null);
    try {
      const timeout = <T,>(promise: Promise<T>, message: string, timeoutMs = 20000) => Promise.race([
        promise,
        new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error(message)), timeoutMs)),
      ]);
      // Fetch tool by tool_id
      const { data: toolData, error: toolError } = await timeout(supabase
        .from('tools')
        .select('*')
        .eq('tool_id', id)
        .eq('is_active', true)
        .single(), t('checkout.loadingTimeout', 'Checkout took too long to load. Please try again.'));
      if (toolError || !toolData) {
        toast({ title: t('checkout.error', 'Error'), description: t('checkout.toolNotFound', 'Tool not found'), variant: 'destructive' });
        navigate('/store');
        return;
      }
      setTool(toolData);

      // Fetch plans
      const { data: plansData } = await timeout(supabase
        .from('tool_plans')
        .select('*')
        .eq('tool_id', id)
        .eq('is_active', true)
        .order('monthly_price', { ascending: true, nullsFirst: false }), t('checkout.loadingTimeout', 'Checkout took too long to load. Please try again.'));

      const mapped: ToolPlan[] = (plansData || []).map(p => ({
        id: p.id,
        tool_id: p.tool_id,
        plan_id: p.plan_id,
        plan_name: p.plan_name,
        monthly_price: p.monthly_price ? Number(p.monthly_price) : null,
        delivery_type: p.delivery_type as ToolPlan['delivery_type'],
        activation_time: p.activation_time,
        is_active: p.is_active,
      }));
      const lovableOrder = ['pro_monthly', 'lovable_2_months', 'lovable_3_months'];
      const bestValuePlan = getBestValuePlan(mapped);
      const displayPlans = id === 'lovable'
        ? [...mapped].sort((a, b) => lovableOrder.indexOf(a.plan_id) - lovableOrder.indexOf(b.plan_id))
        : bestValuePlan
        ? [...mapped].sort((a, b) => (b.id === bestValuePlan.id ? 1 : 0) - (a.id === bestValuePlan.id ? 1 : 0))
        : mapped;
      setPlans(displayPlans);
      const requestedPlan = searchParams.get('plan');
      const defaultPlan = displayPlans.find(plan => plan.plan_id === requestedPlan) || getBestValuePlan(displayPlans);
      if (displayPlans.length > 0) setSelectedPlan(defaultPlan || displayPlans[0]);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : t('checkout.somethingWrong', 'Something went wrong. Please try again.');
      setPageError(message);
      toast({ title: t('checkout.error', 'Error'), description: message, variant: 'destructive' });
    } finally {
      setPageLoading(false);
    }
  };

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

  /* ── Period & price logic (must match storefront EXACTLY) ──
     The displayed price is ALWAYS the plan's actual stored price in EUR.
     The Monthly/Annual toggle only applies to plans that are truly
     "monthly" (we don't fabricate an annual ×0.8 price for one-time
     keys, 1-year licenses, or 3-month subscriptions).
  */
  const period = inferPeriodFromPlan(selectedPlan?.plan_name);
  const periodStyle = getPeriodStyle(period);
  const isPureMonthly = period === 'monthly' &&
    !/3\s*month|3m|90\s*day/i.test(selectedPlan?.plan_name || '');
  const showBillingToggle = isPureMonthly;

  const getDisplayPrice = () => {
    if (!selectedPlan?.monthly_price) return null;
    // Annual toggle ONLY available on pure-monthly plans.
    if (showBillingToggle && billingInterval === 'annual') {
      return Number((selectedPlan.monthly_price * 12 * 0.8).toFixed(2));
    }
    return selectedPlan.monthly_price;
  };

  const getMonthlyEquivalent = () => {
    if (!selectedPlan?.monthly_price || !showBillingToggle) return null;
    if (billingInterval === 'annual') {
      return Number((selectedPlan.monthly_price * 0.8).toFixed(2));
    }
    return selectedPlan.monthly_price;
  };

  const displayPrice = getDisplayPrice();
  const monthlyEquivalent = getMonthlyEquivalent();
  const walletDeduction = applyWalletCredit && displayPrice ? Math.min(walletBalance, displayPrice) : 0;
  const effectivePrice = displayPrice ? Math.max(0, displayPrice - walletDeduction) : displayPrice;
  const activationTime = selectedPlan?.activation_time || 6;
  const paymentMethods = isBelgianUser
    ? [...PAYMENT_METHODS].sort((a, b) => (a.id === 'bancontact' ? -1 : 0) - (b.id === 'bancontact' ? -1 : 0))
    : PAYMENT_METHODS;
  const checkoutUrl = tool && selectedPlan ? getStripeLink(tool.name, selectedPlan.plan_name) : null;
  const completedPurchases = Number(localStorage.getItem('aiDealsCompletedPurchases') || '0');

  // كل الأسعار باليورو € (no conversion)
  const formatPrice = (eur: number | null) => {
    if (eur == null) return 'N/A';
    if (eur === 0) return t('common.free', 'Free');
    return formatEuro(eur);
  };

  const formatVatPrice = (eur: number | null) => {
    const price = formatPrice(eur);
    return eur && eur > 0 ? `${price} ${t('store.exclVat', '(excl. VAT)')}` : price;
  };

  const formatApproxPrice = (eur: number | null | undefined) => formatApproxCurrency(eur, currency.code);

  const validateForm = (): boolean => {
    const newErrors: { email?: string } = {};
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) newErrors.email = emailResult.error.errors[0]?.message || t('checkout.validEmail', 'Please enter a valid email');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tool || !selectedPlan) return;
    if (!validateForm()) return;
    if (!agreedToTerms) {
      toast({ title: t('checkout.error', 'Error'), description: t('checkout.mustAgreeTerms', 'You must agree to the terms'), variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const buyerEmail = email || user?.email;

      const paymentMethod = PAYMENT_METHODS.find(m => m.id === selectedPaymentMethod);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          toolId: tool.id,
          planId: selectedPlan.plan_id,
          customerEmail: email || buyerEmail,
          useWalletCredit: applyWalletCredit && walletBalance > 0,
          billingInterval,
          paymentMethodTypes: paymentMethod?.stripeTypes || ['card'],
        },
      });
      if (error) throw error;

      if (data?.paidByWallet) {
        setIsSuccess(true);
        return;
      }

      if (!data?.url) throw new Error('No checkout URL returned');
      localStorage.setItem('aiDealsCompletedPurchases', String(completedPurchases + 1));
      window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      const fallbackPaymentLink = tool && selectedPlan ? getStripeLink(tool.name, selectedPlan.plan_name, email || user?.email || undefined) : null;
      if (fallbackPaymentLink) {
        localStorage.setItem('aiDealsCompletedPurchases', String(completedPurchases + 1));
        window.open(fallbackPaymentLink, '_blank', 'noopener,noreferrer');
      } else {
        toast({ title: t('checkout.error', 'Error'), description: t('checkout.somethingWrong', 'Something went wrong. Please try again.'), variant: 'destructive' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6"
            style={{ boxShadow: '0 10px 40px rgba(34, 197, 94, 0.4)' }}
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold mb-2 text-white">Thank you for your purchase.</h3>
          <p className="max-w-md text-muted-foreground mb-4 leading-relaxed">Your access is being prepared. You will receive it shortly.</p>
          <div className="flex items-center gap-2 text-sm text-green-400 mb-6">
            <Clock className="w-4 h-4" />
            <span>Activating within {activationTime} hours</span>
          </div>
          <Button onClick={() => navigate('/dashboard')} variant="hero" size="lg">
            Go to Dashboard
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          {/* Back button */}
          <button
            onClick={() => navigate('/store')}
            className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('checkout.backToStore', 'Back to Store')}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* ── LEFT: Plan & Payment Selection ── */}
            <div className="lg:col-span-3 space-y-6">
              {/* Tool header */}
              <div className="flex items-center gap-4 mb-2">
                {logoUrl && (
                  <div className="h-16 w-16 rounded-2xl grid place-items-center border border-white/10 bg-white/5">
                    <img src={logoUrl} alt={tool.name} className="h-10 w-10 object-contain p-0.5" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-white">{tool?.name}</h1>
                  <p className="text-sm text-muted-foreground">{t('checkout.choosePlanPayment', 'Choose your plan and payment method')}</p>
                  {tool && <ProductRatingInline toolId={tool.tool_id} productName={tool.name} />}
                </div>
              </div>

              {/* ── Billing Interval (only for pure-monthly plans) ── */}
              {showBillingToggle ? (
                <div
                  className="p-5 rounded-2xl border border-white/10"
                  style={{ background: 'rgba(20, 20, 35, 0.5)' }}
                >
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Crown className="w-4 h-4 text-primary" />
                    {t('checkout.billingPeriod', 'Billing Period')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setBillingInterval('monthly')}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        billingInterval === 'monthly'
                          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <p className="text-sm font-semibold text-white">{t('checkout.monthly', 'Monthly')}</p>
                      {selectedPlan?.monthly_price != null && (
                        <>
                          <p className="text-lg font-bold text-sky-400 mt-1">
                            €{selectedPlan.monthly_price}
                            <span className="text-xs text-muted-foreground font-semibold"> {t('store.exclVat', '(excl. VAT)')}</span>
                            <span className="text-xs text-muted-foreground font-normal"> {t('store.period.monthly', '/ month')}</span>
                          </p>
                          <p className="text-xs font-medium text-muted-foreground mt-1">{t('store.taxNote', 'Taxes (if applicable) are calculated at checkout.')}</p>
                          {formatApproxPrice(selectedPlan.monthly_price) && <p className="text-xs text-muted-foreground mt-0.5">{formatApproxPrice(selectedPlan.monthly_price)}</p>}
                        </>
                      )}
                      <p className="text-[10px] text-muted-foreground mt-1">{t('checkout.billedMonthly', 'Billed every month')}</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBillingInterval('annual')}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        billingInterval === 'annual'
                          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                        {t('checkout.savePercent', 'Save 20%')}
                      </span>
                      <p className="text-sm font-semibold text-white">{t('checkout.annual', 'Annual')}</p>
                      {selectedPlan?.monthly_price != null && (
                        <>
                          <p className="text-lg font-bold text-orange-400 mt-1">
                            €{(selectedPlan.monthly_price * 12 * 0.8).toFixed(2)}
                            <span className="text-xs text-muted-foreground font-semibold"> {t('store.exclVat', '(excl. VAT)')}</span>
                            <span className="text-xs text-muted-foreground font-normal"> {t('store.period.yearly', '/ year')}</span>
                          </p>
                          <p className="text-xs font-medium text-muted-foreground mt-1">{t('store.taxNote', 'Taxes (if applicable) are calculated at checkout.')}</p>
                          {formatApproxPrice(selectedPlan.monthly_price * 12 * 0.8) && <p className="text-xs text-muted-foreground mt-0.5">{formatApproxPrice(selectedPlan.monthly_price * 12 * 0.8)}</p>}
                          <p className="text-xs text-muted-foreground mt-1">
                            €{(selectedPlan.monthly_price * 0.8).toFixed(2)}/mo · {t('checkout.billedAnnually', 'Billed annually')}
                          </p>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Non-monthly plans show a single, fixed billing summary */
                <div
                  className="p-5 rounded-2xl border border-white/10"
                  style={{ background: 'rgba(20, 20, 35, 0.5)' }}
                >
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Crown className="w-4 h-4 text-primary" />
                    {t('checkout.billingPeriod', 'Billing Period')}
                  </h3>
                  <div className={`p-4 rounded-xl border-2 border-primary bg-primary/10`}>
                    <p className="text-sm font-semibold text-white">{periodStyle.label}</p>
                    {selectedPlan?.monthly_price != null && (
                      <>
                        <p className={`text-lg font-bold mt-1 ${periodStyle.textClass}`}>
                          €{selectedPlan.monthly_price}
                          <span className="text-xs text-muted-foreground font-semibold"> {t('store.exclVat', '(excl. VAT)')}</span>
                          <span className="text-xs text-muted-foreground font-normal"> {periodStyle.suffix}</span>
                        </p>
                        <p className="text-xs font-medium text-muted-foreground mt-1">{t('store.taxNote', 'Taxes (if applicable) are calculated at checkout.')}</p>
                        {formatApproxPrice(selectedPlan.monthly_price) && <p className="text-xs text-muted-foreground mt-0.5">{formatApproxPrice(selectedPlan.monthly_price)}</p>}
                      </>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {period === 'one-time'
                        ? t('checkout.singlePayment', 'Single payment — no recurring charges')
                        : period === 'yearly'
                        ? t('checkout.chargedYearly', 'Charged once per year')
                        : selectedPlan?.plan_name || ''}
                    </p>
                  </div>
                </div>
              )}

              {/* ── Plan Selector (if multiple plans) ── */}
              {plans.length > 1 && (
                <div
                  className="p-5 rounded-2xl border border-white/10"
                  style={{ background: 'rgba(20, 20, 35, 0.5)' }}
                >
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    {t('checkout.selectPlan', 'Select Plan')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {plans.map((plan, index) => {
                      const isLovableBestValue = tool?.tool_id === 'lovable' && getBestValuePlan(plans)?.id === plan.id;
                      const monthlyPlanValue = getMonthlyPlanValue(plan);
                      return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlan(plan)}
                        className={`relative min-h-11 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          selectedPlan?.id === plan.id
                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                            : isLovableBestValue
                            ? 'bg-primary/10 text-muted-foreground border border-primary/60 shadow-lg shadow-primary/10 hover:bg-primary/15'
                            : 'bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span className="mb-1 block text-[9px] font-bold uppercase tracking-wider opacity-80">
                          {t(tool?.tool_id === 'lovable' && LOVABLE_PLAN_DETAILS[plan.plan_id] ? LOVABLE_PLAN_DETAILS[plan.plan_id].badge : tierLabel(index, plans.length))}
                        </span>
                        <span className="block text-white">{plan.plan_name}</span>
                        {plan.monthly_price != null && plan.monthly_price > 0 && (
                          <span className="mt-1 block text-lg font-bold">€{plan.monthly_price}</span>
                        )}
                        {monthlyPlanValue && <span className="mt-0.5 block text-xs font-semibold opacity-80">{monthlyPlanValue}</span>}
                        {tool?.tool_id === 'lovable' && LOVABLE_PLAN_DETAILS[plan.plan_id] && (
                          <span className="mt-2 block space-y-1 text-xs font-medium opacity-80">
                            <span className="block">{t(LOVABLE_PLAN_DETAILS[plan.plan_id].duration)}</span>
                            <span className="block">{t(LOVABLE_PLAN_DETAILS[plan.plan_id].credits)}</span>
                            <span className="block">{t('store.creditsRenewed', '100 credits are renewed monthly')}</span>
                            {isLovableBestValue && <span className="block font-semibold text-primary">{t('store.saveMorePlan', 'Save more with this plan')}</span>}
                            {isLovableBestValue && <span className="block">{t('store.mostUsersChoose', 'Most users choose this option')}</span>}
                            <span className="mt-3 flex min-h-11 items-center justify-center rounded-xl bg-primary/20 px-3 py-2 font-bold">{t('store.buyNow', 'Get Instant Access')}</span>
                          </span>
                        )}
                      </button>
                    );})}
                  </div>
                  {tool?.tool_id === 'lovable' && (
                    <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-muted-foreground">
                      <span>✔ {t('store.instantDelivery', 'Instant delivery')}</span><span>✔ {t('store.noSetupNeeded', 'No setup needed')}</span><span>✔ {t('store.supportAvailable', 'Support available')}</span>
                    </div>
                  )}
                </div>
              )}

              {/* ── {t('checkout.paymentMethod', 'Payment Method')} ── */}
              <div
                className="p-5 rounded-2xl border border-white/10"
                style={{ background: 'rgba(20, 20, 35, 0.5)' }}
              >
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  {t('checkout.paymentMethod', 'Payment Method')}
                </h3>
                  <div className="space-y-3">
                  {paymentMethods.map(method => {
                    const Icon = method.icon;
                    const isSelected = selectedPaymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 ${
                          isSelected ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">
                            {method.id === 'card' ? t('checkout.card', method.label) : method.label}
                            {isBelgianUser && method.id === 'bancontact' && (
                              <span className="ml-2 text-xs font-semibold text-primary">{t('checkout.recommendedBelgium', 'Recommended in Belgium')}</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">{method.id === 'card' ? t('checkout.cardDescription', method.description as string) : t('checkout.bancontactDescription', method.description as string)}</p>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 grid place-items-center ${
                          isSelected ? 'border-primary' : 'border-white/20'
                        }`}>
                          {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Wallet Credit ── */}
              {walletBalance > 0 && selectedPlan && (
                <div
                  className="p-5 rounded-2xl border border-white/10"
                  style={{ background: 'linear-gradient(135deg, rgba(232,212,139,0.08) 0%, rgba(232,212,139,0.02) 100%)' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(232,212,139,0.15)' }}>
                        <Wallet className="w-5 h-5" style={{ color: '#E8D48B' }} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">{t('checkout.applyWalletCredit', 'Apply Wallet Credit')}</h4>
                        <p className="text-xs text-muted-foreground">
                          {t('checkout.available', 'Available')}: <span style={{ color: '#E8D48B' }} className="font-semibold">€{walletBalance.toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                    <Switch checked={applyWalletCredit} onCheckedChange={setApplyWalletCredit} />
                  </div>
                  {applyWalletCredit && walletDeduction > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{t('checkout.originalPrice', 'Original price')}</span>
                        <span>{formatVatPrice(displayPrice)}</span>
                      </div>
                      <div className="flex justify-between text-xs" style={{ color: '#E8D48B' }}>
                        <span>{t('checkout.walletCredit', 'Wallet credit')}</span>
                        <span>-€{walletDeduction.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold text-white">
                        <span>{t('checkout.youPay', 'You pay')}</span>
                        <span>{formatVatPrice(effectivePrice)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── RIGHT: Summary & Checkout ── */}
            <div className="lg:col-span-2">
              <div
                className="sticky top-28 p-6 rounded-2xl border border-white/10 space-y-5"
                style={{ background: 'rgba(20, 20, 35, 0.6)', backdropFilter: 'blur(20px)' }}
              >
                <h3 className="text-lg font-bold text-white">{t('checkout.orderSummary', 'Order Summary')}</h3>

                {/* Tool info */}
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  {logoUrl && (
                    <span className="h-10 w-10 rounded-lg grid place-items-center bg-white/5 border border-white/10 shrink-0">
                      <img src={logoUrl} alt={tool.name} className="h-7 w-7 object-contain p-0.5" />
                    </span>
                  )}
                  <div>
                    <p className="font-semibold text-white text-sm">{tool?.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedPlan?.plan_name || t('checkout.standard', 'Standard')}</p>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {showBillingToggle
                        ? (billingInterval === 'annual' ? t('checkout.annualSubscription', 'Annual subscription') : t('checkout.monthlySubscription', 'Monthly subscription'))
                        : period === 'one-time'
                        ? t('checkout.oneTimePurchase', 'One-time purchase')
                        : period === 'yearly'
                        ? t('checkout.yearlySubscription', 'Yearly subscription')
                        : selectedPlan?.plan_name || t('checkout.subscription', 'Subscription')}
                    </span>
                    <span className="text-white font-semibold">
                      {formatVatPrice(displayPrice)}
                    </span>
                  </div>
                  {formatApproxPrice(displayPrice) && (
                    <div className="flex justify-end text-xs text-muted-foreground">
                      <span>{formatApproxPrice(displayPrice)}</span>
                    </div>
                  )}
                  {showBillingToggle && billingInterval === 'annual' && monthlyEquivalent && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{t('checkout.monthlyEquivalent', 'Monthly equivalent')}</span>
                      <span className="text-green-400">€{monthlyEquivalent.toFixed(2)}/mo</span>
                    </div>
                  )}
                  {walletDeduction > 0 && (
                    <div className="flex justify-between text-xs" style={{ color: '#E8D48B' }}>
                      <span>{t('checkout.walletCredit', 'Wallet credit')}</span>
                      <span>-€{walletDeduction.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-white/10 flex justify-between text-base font-bold">
                    <span className="text-white">{t('checkout.total', 'Total')}</span>
                    <span className="text-primary">
                      {formatVatPrice(effectivePrice)}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground text-right">{t('store.taxNote', 'Taxes (if applicable) are calculated at checkout.')}</p>
                  {formatApproxPrice(effectivePrice) && (
                    <div className="flex justify-end text-xs text-muted-foreground">
                      <span>{formatApproxPrice(effectivePrice)}</span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground text-right">{t('store.finalPaymentNote', FINAL_PAYMENT_EUR_NOTE)}</p>
                </div>

                {/* {t('checkout.whatYouGet', 'What you get')} */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    {t('checkout.whatYouGet', 'What you get')}
                  </h4>
                  {WHAT_YOU_GET.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="w-3 h-3 text-green-500 shrink-0" />
                      {t(item)}
                    </div>
                  ))}
                </div>

                {/* Activation info */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                    <UserCheck className="w-3 h-3 mr-1" />
                    {t('checkout.accountProvidedBadge', 'Account Provided')}
                  </Badge>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {t('checkout.withinHours', { hours: activationTime })}
                  </Badge>
                </div>
                <TrustBadges compact />

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 space-y-3">
                  <h4 className="text-sm font-bold text-white">{t('checkout.howReceiveAccess', 'How you receive your access')}</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{t('store.activationAccessDelivery', 'After payment, we will send you the access details you purchased, including username and password when applicable.')}</p>
                  <div className="space-y-1.5 text-xs leading-relaxed text-muted-foreground">
                    <p className="font-semibold text-primary">{t('store.neverAskPersonalCredentials', 'You do not need to send us your personal password before payment.')}</p>
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-xs leading-relaxed text-muted-foreground">
                    <p className="font-semibold text-white">{t('store.importantInfo', 'Important information:')}</p>
                    <p className="mt-1">{t('store.activationAccessDelivery', 'After payment, we will send you the access details you purchased, including username and password when applicable.')}</p>
                    <p className="mt-1 font-semibold text-primary">{t('store.neverAskPersonalCredentials', 'You do not need to send us your personal password before payment.')}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
                    <span>✔ {t('store.instantDelivery', 'Instant delivery')}</span><span>✔ {t('store.securePayment', 'Secure payment')}</span><span>✔ {t('store.supportAvailable', 'Support available')}</span>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold text-white">{t('store.needHelp', 'Need help? Contact us instantly:')}</p>
                    <div className="flex flex-wrap gap-3">
                      {isUsableSocialLink(supportLinks.whatsapp) && <Social3DLink href={supportLinks.whatsapp} label="Contact on WhatsApp" tone="social-whatsapp-3d" className="w-12 h-12"><WhatsAppIcon className="w-6 h-6" /></Social3DLink>}
                      {isUsableSocialLink(supportLinks.telegram) && <Social3DLink href={supportLinks.telegram} label="Contact on Telegram" tone="social-telegram-3d" className="w-12 h-12"><TelegramIcon className="w-6 h-6" /></Social3DLink>}
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {tool && <ProductReviewsCarousel toolId={tool.tool_id} productName={tool.name} />}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-medium text-white flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-primary" />
                      {t('checkout.activationEmail', 'Activation Email')}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
                      required
                      disabled={isLoading}
                      className={`h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                    <p className="text-[10px] text-muted-foreground">{t('checkout.accessEmailNote', "We'll send activation details to this email.")}</p>
                  </div>

                  {!user && completedPurchases > 0 && (
                    <div className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-xs leading-relaxed text-muted-foreground">
                      <p className="font-semibold text-white">{t('auth.returningBuyerTitle', 'Buying again?')}</p>
                      <p className="mt-1">{t('auth.returningBuyerPrompt', 'Create or log in to an account to keep your order history and purchased products in one place.')}</p>
                      <Button type="button" variant="heroOutline" size="sm" className="mt-3" onClick={() => setShowAuthDialog(true)}>
                        {t('nav.login', 'Login')}
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>{t('store.neverAskPersonalCredentials', 'You do not need to send us your personal password before payment.')}</span>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={checked => setAgreedToTerms(checked as boolean)}
                      className="mt-0.5 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label htmlFor="terms" className="text-xs text-white cursor-pointer leading-relaxed">
                      {t('checkout.agreePrefix', 'I agree to the')}{' '}
                      <Link to="/terms" target="_blank" className="text-primary hover:underline">{t('checkout.terms', 'Terms')}</Link>
                      {' & '}
                      <Link to="/privacy" target="_blank" className="text-primary hover:underline">{t('checkout.privacyPolicy', 'Privacy Policy')}</Link>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-sm font-semibold rounded-xl relative overflow-hidden"
                    disabled={isLoading || !agreedToTerms || !checkoutUrl}
                    style={{
                      background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
                      boxShadow: '0 8px 30px hsl(var(--primary) / 0.3)',
                    }}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t('checkout.processing', 'Processing...')}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        {checkoutUrl ? t('store.buyNow', 'Get Instant Access') : t('checkout.contactSupport', 'Contact support')}
                      </span>
                    )}
                  </Button>
                  <p className="text-xs font-medium text-primary text-center">{t('store.accessDeliveredWithinMinutes', 'Access delivered within minutes after payment')}</p>
                  <p className="text-xs font-medium text-muted-foreground text-center">{t('store.taxNote', 'Taxes (if applicable) are calculated at checkout.')}</p>
                  <p className="text-[11px] text-muted-foreground text-center">{t('checkout.securePaymentFinal', 'Secure payment via Stripe & Bancontact. Final payment in EUR.')}</p>

                  {/* Trust microcopy */}
                  <div className="space-y-2 text-center">
                    <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                      <Zap className="w-3 h-3" />
                      {t('checkout.cancelAnytime', 'Cancel anytime. No commitment.')}
                    </p>
                    <p className="text-[10px] flex items-center justify-center gap-1" style={{ color: '#E8D48B' }}>
                      <Shield className="w-3 h-3" />
                      {t('checkout.activationGuaranteeIncluded', 'Activation Guarantee included')}
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Auth dialog */}
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={(v) => {
          setShowAuthDialog(v);
          if (!v && !user) navigate('/store');
        }}
        defaultMode="login"
      />
    </div>
  );
};

export default PaymentPage;
