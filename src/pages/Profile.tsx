import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User, Mail, Calendar, Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [ordersCount, setOrdersCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const { count: total } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      const { count: active } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'active');
      setOrdersCount(total || 0);
      setActiveCount(active || 0);
    };
    fetchStats();
  }, [user]);

  const createdAt = user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link to="/dashboard"><ArrowLeft className="w-4 h-4 me-2" /> Back to Dashboard</Link>
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-3xl p-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-black">{user?.email?.split('@')[0]}</h1>
                <p className="text-muted-foreground text-sm">Member</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="font-medium">{createdAt}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-center">
                  <Package className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{ordersCount}</p>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-center">
                  <div className="w-5 h-5 mx-auto mb-2 flex items-center justify-center">
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <p className="text-2xl font-bold">{activeCount}</p>
                  <p className="text-xs text-muted-foreground">Active Tools</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
