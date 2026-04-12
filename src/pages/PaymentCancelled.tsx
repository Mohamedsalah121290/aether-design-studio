import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RefreshCw, MessageCircle } from 'lucide-react';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-lg mx-auto px-4 text-center">
          {/* Cancel icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-8"
            style={{ boxShadow: '0 12px 40px rgba(245, 158, 11, 0.3)' }}
          >
            <XCircle className="w-12 h-12 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-white mb-3">Payment Cancelled</h1>
            <p className="text-muted-foreground text-lg mb-8">
              No worries — your payment was not processed. You can try again whenever you're ready.
            </p>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-5 rounded-2xl border border-white/10 bg-white/5 mb-8 text-left"
          >
            <h3 className="text-sm font-semibold text-white mb-3">Common reasons for cancellation:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                Changed your mind about the plan
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                Need to update payment information
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                Want to explore other options first
              </li>
            </ul>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              onClick={() => navigate('/store')}
              size="lg"
              className="rounded-xl"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
                boxShadow: '0 8px 30px hsl(var(--primary) / 0.3)',
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={() => navigate('/contact')}
              variant="outline"
              size="lg"
              className="rounded-xl border-white/10"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Need Help?
            </Button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentCancelled;
