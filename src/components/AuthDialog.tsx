import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, UserPlus, LogIn, Sparkles } from 'lucide-react';
import { z } from 'zod';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: 'login' | 'signup';
}

const authSchema = z.object({
  email: z.string().trim().email('Please enter a valid email').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

export const AuthDialog = ({ open, onOpenChange, defaultMode = 'login' }: AuthDialogProps) => {
  const { t } = useTranslation();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod
    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'email') fieldErrors.email = err.message;
        if (err.path[0] === 'password') fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = mode === 'login' 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        toast({
          title: t('auth.error'),
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: mode === 'login' ? t('auth.welcomeBack') : t('auth.accountCreated'),
          description: mode === 'login' ? t('auth.loginSuccess') : t('auth.signupSuccess'),
        });
        onOpenChange(false);
        setEmail('');
        setPassword('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail('');
      setPassword('');
      setErrors({});
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md border-0 bg-transparent p-0 shadow-none">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, hsl(222 47% 11% / 0.98) 0%, hsl(222 47% 8% / 0.99) 100%)',
            boxShadow: '0 25px 80px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          <div className="relative p-8">
            <DialogHeader className="text-center mb-6">
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex justify-center mb-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  {mode === 'login' ? (
                    <LogIn className="w-8 h-8 text-white" />
                  ) : (
                    <UserPlus className="w-8 h-8 text-white" />
                  )}
                </div>
              </motion.div>
              <DialogTitle className="text-2xl font-display font-bold text-white">
                {mode === 'login' ? t('auth.loginTitle') : t('auth.signupTitle')}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {mode === 'login' ? t('auth.loginDescription') : t('auth.signupDescription')}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <Label htmlFor="auth-email" className="text-sm font-medium text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  {t('auth.email')}
                </Label>
                <Input
                  id="auth-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className={`h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-400">{errors.email}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="space-y-2"
              >
                <Label htmlFor="auth-password" className="text-sm font-medium text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  {t('auth.password')}
                </Label>
                <Input
                  id="auth-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className={`h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                />
                {errors.password && (
                  <p className="text-xs text-red-400">{errors.password}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-semibold rounded-2xl relative overflow-hidden group"
                  disabled={isLoading}
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%)',
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t('auth.processing')}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        {mode === 'login' ? t('auth.loginButton') : t('auth.signupButton')}
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-center pt-2"
              >
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}
                </button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
