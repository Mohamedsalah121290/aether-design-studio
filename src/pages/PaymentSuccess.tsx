import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, ArrowRight, ShieldCheck, Package } from 'lucide-react';
import { openSocialUrl, TELEGRAM_URL, WHATSAPP_URL, TelegramIcon, WhatsAppIcon } from '@/components/ChatbotConversion';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-lg mx-auto px-4 text-center">
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-8"
            style={{ boxShadow: '0 12px 40px rgba(34, 197, 94, 0.4)' }}
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-white mb-3">Payment Successful!</h1>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Thank you for your purchase. Your access is being prepared and will be delivered shortly. If activation is required, our team will contact you via WhatsApp or Telegram. You can also contact us directly for faster support.
            </p>
          </motion.div>

          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4 mb-8"
          >
            <div className="p-4 rounded-2xl border border-white/10 bg-white/5 flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Activation in Progress</p>
                <p className="text-xs text-muted-foreground">Your account will be activated within the specified timeframe.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-white/10 bg-white/5 flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Payment Secured</p>
                <p className="text-xs text-muted-foreground">Your payment was processed securely via Stripe.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-white/10 bg-white/5 flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Check Your Dashboard</p>
                <p className="text-xs text-muted-foreground">Track your order status and access credentials from your dashboard.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-primary/20 bg-primary/10 text-left">
              <p className="text-sm font-semibold text-white">Need help? Contact us instantly:</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a href={WHATSAPP_URL} onClick={(event) => openSocialUrl(event, WHATSAPP_URL)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-bold text-white"><WhatsAppIcon />WhatsApp</a>
                <a href={TELEGRAM_URL} onClick={(event) => openSocialUrl(event, TELEGRAM_URL)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-bold text-white"><TelegramIcon />Telegram</a>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
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
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => navigate('/store')}
              variant="outline"
              size="lg"
              className="rounded-xl border-white/10"
            >
              Browse More Tools
            </Button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
