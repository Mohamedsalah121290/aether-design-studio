import { useCallback, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, ArrowRight, ShieldCheck, Package, Loader2, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Social3DLink, TelegramIcon, WhatsAppIcon } from '@/components/ChatbotConversion';
import { isUsableSocialLink, supportLinks } from '@/lib/socialLinks';
import { clearCartItems } from '@/lib/cart';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/lib/i18n';

type VerificationState = 'verifying' | 'paid' | 'pending' | 'failed' | 'invalid';

interface VerifiedItem {
  order_id: string;
  product_name: string | null;
  activation_hours: number | null;
}

const SupportBlock = ({ title }: { title: string }) => (
  <div className="p-4 rounded-2xl border border-primary/20 bg-primary/10 text-left">
    <p className="text-sm font-semibold text-foreground">{title}</p>
    <div className="mt-3 flex flex-wrap gap-3">
      {isUsableSocialLink(supportLinks.whatsapp) && (
        <Social3DLink href={supportLinks.whatsapp} label="Contact on WhatsApp" tone="social-whatsapp-3d" className="w-12 h-12">
          <WhatsAppIcon className="w-6 h-6" />
        </Social3DLink>
      )}
      {isUsableSocialLink(supportLinks.telegram) && (
        <Social3DLink href={supportLinks.telegram} label="Contact on Telegram" tone="social-telegram-3d" className="w-12 h-12">
          <TelegramIcon className="w-6 h-6" />
        </Social3DLink>
      )}
    </div>
  </div>
);

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const sessionId = searchParams.get('session_id');

  const [state, setState] = useState<VerificationState>('verifying');
  const [items, setItems] = useState<VerifiedItem[]>([]);
  const [isSubscription, setIsSubscription] = useState(false);
  const [attempt, setAttempt] = useState(0);

  /**
   * Payment state is decided ONLY by the backend verify-payment function,
   * which reads the real status from Stripe with the server-side secret key.
   * The presence of session_id in the URL never implies success.
   */
  const verify = useCallback(async () => {
    if (!sessionId) {
      setState('invalid');
      return;
    }
    setState('verifying');
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { session_id: sessionId },
      });

      // Non-2xx responses still carry a JSON body with a status field.
      const payload = (data ?? (error as { context?: { status?: string } } | null)?.context) as
        | { status?: VerificationState; items?: VerifiedItem[]; is_subscription?: boolean }
        | undefined;

      if (payload?.status === 'paid') {
        setItems(payload.items ?? []);
        setIsSubscription(Boolean(payload.is_subscription));
        setState('paid');
        if (searchParams.get('cart') === '1') clearCartItems();
        return;
      }
      if (payload?.status === 'pending') {
        setState('pending');
        return;
      }
      if (payload?.status === 'failed') {
        setState('failed');
        return;
      }
      if (payload?.status === 'invalid') {
        setState('invalid');
        return;
      }
      setState(error ? 'pending' : 'invalid');
    } catch (err) {
      console.error('Payment verification error:', err);
      setState('pending');
    }
  }, [sessionId, searchParams]);

  useEffect(() => {
    verify();
  }, [verify, attempt]);

  // While Stripe/webhook settles, re-check a few times automatically.
  useEffect(() => {
    if (state !== 'pending' || attempt >= 4) return;
    const timer = window.setTimeout(() => setAttempt(a => a + 1), 4000);
    return () => window.clearTimeout(timer);
  }, [state, attempt]);

  const renderVerifying = () => (
    <div className="text-center">
      <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-3">{t('paymentStatus.verifyingTitle', 'Verifying your payment…')}</h1>
      <p className="text-muted-foreground text-lg">{t('paymentStatus.verifyingBody', 'Please wait while we confirm your payment securely. Do not close this page.')}</p>
    </div>
  );

  const renderPending = () => (
    <div className="text-center">
      <div className="w-24 h-24 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-8">
        <Clock className="w-10 h-10 text-amber-400" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-3">{t('paymentStatus.pendingTitle', 'Payment is being processed')}</h1>
      <p className="text-muted-foreground text-lg mb-8">
        {t('paymentStatus.pendingBody', 'Your payment has not been confirmed yet. Some payment methods take a little longer. We will update your order automatically once the bank confirms it.')}
      </p>
      <div className="space-y-4 mb-8">
        <SupportBlock title={t('paymentStatus.supportTitle', 'Need help? Contact us instantly:')} />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={() => setAttempt(a => a + 1)} size="lg" variant="hero" className="rounded-xl">
          <RefreshCw className="w-4 h-4 mr-2" />
          {t('paymentStatus.checkAgain', 'Check again')}
        </Button>
        <Button onClick={() => navigate('/dashboard')} variant="outline" size="lg" className="rounded-xl border-white/10">
          {t('paymentStatus.goToDashboard', 'Go to Dashboard')}
        </Button>
      </div>
    </div>
  );

  const renderFailed = () => (
    <div className="text-center">
      <div className="w-24 h-24 rounded-full bg-destructive/15 border border-destructive/30 flex items-center justify-center mx-auto mb-8">
        <XCircle className="w-10 h-10 text-destructive" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-3">{t('paymentStatus.failedTitle', 'Payment was not completed')}</h1>
      <p className="text-muted-foreground text-lg mb-8">
        {t('paymentStatus.failedBody', 'We could not confirm a successful payment for this checkout. You have not been charged for an active order. Please try again or contact support.')}
      </p>
      <div className="space-y-4 mb-8">
        <SupportBlock title={t('paymentStatus.supportTitle', 'Need help? Contact us instantly:')} />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={() => navigate('/store')} size="lg" variant="hero" className="rounded-xl">
          {t('paymentStatus.backToStore', 'Back to Store')}
        </Button>
        <Button onClick={() => setAttempt(a => a + 1)} variant="outline" size="lg" className="rounded-xl border-white/10">
          <RefreshCw className="w-4 h-4 mr-2" />
          {t('paymentStatus.checkAgain', 'Check again')}
        </Button>
      </div>
    </div>
  );

  const renderInvalid = () => (
    <div className="text-center">
      <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
        <AlertTriangle className="w-10 h-10 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-3">{t('paymentStatus.invalidTitle', 'This payment link is not valid')}</h1>
      <p className="text-muted-foreground text-lg mb-8">
        {t('paymentStatus.invalidBody', 'We could not find a checkout matching this link. If you completed a payment, please check your dashboard or contact support.')}
      </p>
      <div className="space-y-4 mb-8">
        <SupportBlock title={t('paymentStatus.supportTitle', 'Need help? Contact us instantly:')} />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={() => navigate('/store')} size="lg" variant="hero" className="rounded-xl">
          {t('paymentStatus.backToStore', 'Back to Store')}
        </Button>
        <Button onClick={() => navigate('/dashboard')} variant="outline" size="lg" className="rounded-xl border-white/10">
          {t('paymentStatus.goToDashboard', 'Go to Dashboard')}
        </Button>
      </div>
    </div>
  );

  const renderPaid = () => (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-8"
        style={{ boxShadow: '0 12px 40px rgba(34, 197, 94, 0.4)' }}
      >
        <CheckCircle className="w-12 h-12 text-white" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h1 className="text-3xl font-bold text-foreground mb-3">{t('paymentStatus.paidTitle', 'Payment Successful!')}</h1>
        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          {t('paymentStatus.paidBody', 'Your access is being prepared. You will receive it shortly.')}
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-4 mb-8">
        {items.length > 0 && (
          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 text-left">
            <p className="text-sm font-semibold text-foreground mb-2">{t('paymentStatus.orderSummary', 'Confirmed order')}</p>
            <ul className="space-y-1">
              {items.map(item => (
                <li key={item.order_id} className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.product_name || t('paymentStatus.product', 'Product')}</span>
                  {item.activation_hours != null && (
                    <span>{t('paymentStatus.withinHours', 'within')} {item.activation_hours}h</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-4 rounded-2xl border border-white/10 bg-white/5 flex items-center gap-4 text-left">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{t('paymentStatus.activationTitle', 'Activation in Progress')}</p>
            <p className="text-xs text-muted-foreground">{t('paymentStatus.activationBody', 'Your account will be activated within the specified timeframe.')}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-white/10 bg-white/5 flex items-center gap-4 text-left">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{t('paymentStatus.securedTitle', 'Payment Verified')}</p>
            <p className="text-xs text-muted-foreground">
              {isSubscription
                ? t('paymentStatus.securedSubscription', 'Your subscription was confirmed securely via Stripe.')
                : t('paymentStatus.securedBody', 'Your payment was confirmed securely via Stripe.')}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-white/10 bg-white/5 flex items-center gap-4 text-left">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{t('paymentStatus.dashboardTitle', 'Check Your Dashboard')}</p>
            <p className="text-xs text-muted-foreground">{t('paymentStatus.dashboardBody', 'Track your order status and secure access from your dashboard.')}</p>
          </div>
        </div>

        <SupportBlock title={t('paymentStatus.supportTitle', 'Need help? Contact us instantly:')} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <Button
          onClick={() => navigate('/dashboard')}
          size="lg"
          className="rounded-xl"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
            boxShadow: '0 8px 30px hsl(var(--primary) / 0.3)',
          }}
        >
          {t('paymentStatus.goToDashboard', 'Go to Dashboard')}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button onClick={() => navigate('/store')} variant="outline" size="lg" className="rounded-xl border-white/10">
          {t('paymentStatus.browseMore', 'Browse More Tools')}
        </Button>
      </motion.div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-lg mx-auto px-4 text-center">
          {state === 'verifying' && renderVerifying()}
          {state === 'paid' && renderPaid()}
          {state === 'pending' && renderPending()}
          {state === 'failed' && renderFailed()}
          {state === 'invalid' && renderInvalid()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
