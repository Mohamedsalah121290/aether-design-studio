import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, CreditCard, Loader2, ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { AuthDialog } from '@/components/AuthDialog';
import { CartItem, clearCartItems, getCartItems, getCartTotal, removeCartItem } from '@/lib/cart';
import { formatEuro } from '@/lib/pricePeriod';
import { getProductLogoUrl } from '@/lib/productLogos';

const CartPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const total = useMemo(() => getCartTotal(items), [items]);

  useEffect(() => {
    setItems(getCartItems());
    const refresh = () => setItems(getCartItems());
    window.addEventListener('aiDealsCartUpdated', refresh);
    return () => window.removeEventListener('aiDealsCartUpdated', refresh);
  }, []);

  const handleRemove = (id: string) => {
    removeCartItem(id);
    setItems(getCartItems());
  };

  const handleCheckout = async () => {
    setCheckoutError(null);
    if (authLoading) return;
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    if (items.length === 0) {
      setCheckoutError('Your cart is empty.');
      return;
    }
    setLoading(true);
    try {
      const checkoutRequest = supabase.functions.invoke('create-checkout', {
        body: {
          items: items.map(item => ({ toolId: item.toolDbId || item.toolId, planId: item.planId })),
          customerEmail: user.email,
          paymentMethodTypes: ['card', 'bancontact'],
        },
      });
      const timeout = new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error('Checkout took too long. Please try again.')), 20000));
      const { data, error } = await Promise.race([checkoutRequest, timeout]);
      if (error) throw error;
      if (!data?.url) throw new Error('No checkout URL returned');
      window.location.href = data.url;
    } catch (error) {
      console.error('Cart checkout error:', error);
      const message = error instanceof Error ? error.message : 'Checkout could not be started. Please try again.';
      setCheckoutError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="container mx-auto px-4">
          <Button variant="ghost" className="mb-6" onClick={() => navigate('/store')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Continue shopping
          </Button>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary"><ShoppingCart className="h-5 w-5" /></div>
                <div>
                  <h1 className="text-2xl font-bold heading-glow">Cart / Wallet</h1>
                  <p className="text-sm text-muted-foreground">All selected apps and products</p>
                </div>
              </div>

              {items.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center">
                  <p className="text-muted-foreground">Your cart is empty.</p>
                  <Button asChild variant="hero" className="mt-5"><Link to="/store">Go to Store</Link></Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(item => {
                    const logoUrl = getProductLogoUrl(item.toolId) || item.logoUrl;
                    return (
                      <article key={item.id} className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5">
                            {logoUrl && <img src={logoUrl} alt={`${item.name} logo`} className="h-8 w-8 object-contain" />}
                          </div>
                          <div className="min-w-0">
                            <h2 className="truncate font-semibold text-foreground">{item.name}</h2>
                            {item.planName && <p className="text-xs text-muted-foreground">{item.planName}</p>}
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-4 sm:justify-end">
                          <p className="font-bold text-primary">{formatEuro(item.price)}</p>
                          <Button variant="ghost" size="icon" onClick={() => handleRemove(item.id)} aria-label={`Remove ${item.name}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </motion.div>

            <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h2 className="mb-4 text-lg font-bold">Total amount</h2>
              <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-muted-foreground">Total</span>
                <span className="text-2xl font-black text-primary">{formatEuro(total)}</span>
              </div>
              {checkoutError && (
                <div className="mb-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-foreground">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <span>{checkoutError}</span>
                </div>
              )}
              <Button variant="hero" className="w-full" disabled={authLoading || items.length === 0 || loading} onClick={handleCheckout}>
                {loading || authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                Checkout
              </Button>
              {items.length > 0 && <Button variant="ghost" className="mt-3 w-full" onClick={() => { clearCartItems(); setItems([]); }}>Clear cart</Button>}
            </aside>
          </div>
        </section>
      </main>
      <Footer />
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </div>
  );
};

export default CartPage;