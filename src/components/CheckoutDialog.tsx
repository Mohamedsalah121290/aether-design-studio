import { useState } from 'react';
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

interface Tool {
  id: string;
  tool_id: string;
  name: string;
  price: number;
  delivery_type: 'subscribe_for_them' | 'email_only' | 'provide_account';
  activation_time: number;
}

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

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    
    // Email validation
    if (tool?.delivery_type !== 'provide_account' || !user) {
      const emailResult = emailSchema.safeParse(email);
      if (!emailResult.success) {
        newErrors.email = emailResult.error.errors[0]?.message || 'Invalid email';
      }
    }
    
    // Password validation for subscribe_for_them
    if (tool?.delivery_type === 'subscribe_for_them') {
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
    if (!tool) return;

    // Validate form
    if (!validateForm()) {
      return;
    }

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
      
      // Call Stripe checkout edge function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          toolId: tool.id,
          customerEmail: tool.delivery_type === 'subscribe_for_them' || tool.delivery_type === 'email_only' ? email : buyerEmail,
          customerPassword: tool.delivery_type === 'subscribe_for_them' ? password : undefined,
        }
      });

      if (error) throw error;
      if (!data?.url) throw new Error('No checkout URL returned');

      // Store email for vault access
      if (buyerEmail && !user) {
        localStorage.setItem('buyer_email', buyerEmail);
      }

      // Redirect to Stripe Checkout
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
      onOpenChange(false);
    }
  };

  // Get delivery type icon and description
  const getDeliveryInfo = () => {
    switch (tool?.delivery_type) {
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
                <span>{t('checkout.activatingIn', { hours: tool?.activation_time || 6 })}</span>
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
                  <span className="text-muted-foreground"> - </span>
                  <span className="text-white font-bold">${tool?.price}</span>
                  <span className="text-muted-foreground">/{t('store.perMonth')}</span>
                </DialogDescription>
              </motion.div>
            </DialogHeader>

            {/* Delivery Type Info Card */}
            {deliveryInfo && (
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

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {/* Email Field - For subscribe_for_them and email_only */}
                {(tool?.delivery_type === 'subscribe_for_them' || tool?.delivery_type === 'email_only') && (
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
                {tool?.delivery_type === 'subscribe_for_them' && (
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
                {tool?.delivery_type === 'provide_account' && (
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
                    
                    {/* Still need email for notification */}
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
                    {t('checkout.termsDescription', { hours: tool?.activation_time || 6 })}
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
                <span>{t('checkout.activationTime', { hours: tool?.activation_time || 6 })}</span>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
