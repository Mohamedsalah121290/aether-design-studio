import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, Clock, CheckCircle } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  price: number;
}

interface CheckoutDialogProps {
  tool: Tool | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CheckoutDialog = ({ tool, open, onOpenChange, onSuccess }: CheckoutDialogProps) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tool || !email) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.from('orders').insert({
        tool_id: tool.id,
        tool_name: tool.name,
        tool_price: `$${tool.price}`,
        buyer_email: email,
        tool_password: password || null,
        status: 'pending',
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: t('checkout.success'),
        description: t('checkout.successMessage'),
      });
      
      // Store email in localStorage for vault access
      localStorage.setItem('buyer_email', email);
      
      setTimeout(() => {
        setIsSuccess(false);
        setEmail('');
        setPassword('');
        onOpenChange(false);
        onSuccess?.();
      }, 2000);
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
      onOpenChange(false);
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t('checkout.orderPlaced')}</h3>
            <p className="text-muted-foreground">{t('checkout.checkVault')}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{t('checkout.title')}</DialogTitle>
          <DialogDescription>
            {tool?.name} - ${tool?.price}/{t('store.perMonth')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('checkout.email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {t('checkout.toolPassword')} <span className="text-muted-foreground text-xs">({t('checkout.optional')})</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={t('checkout.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !email}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {t('checkout.processing')}
              </>
            ) : (
              t('checkout.confirmPurchase')
            )}
          </Button>

          {/* Activation Notice */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
            <Clock className="w-4 h-4" />
            <span>{t('checkout.activationTime')}</span>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
