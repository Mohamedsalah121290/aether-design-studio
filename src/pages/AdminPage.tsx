import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, Clock, CheckCircle, XCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';

interface OrderCredential {
  email: string;
  encrypted_password: string;
}

interface AdminOrder {
  id: string;
  status: string;
  created_at: string;
  buyer_email: string;
  customer_data: Record<string, string>;
  tool?: { name: string; tool_id: string };
  credentials?: OrderCredential;
}

const AdminPage = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [credentials, setCredentials] = useState<Record<string, OrderCredential>>({});
  const [loading, setLoading] = useState(true);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`*, tool:tools(name, tool_id)`)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData as any[] || []);

      // Fetch credentials separately from secure table (admin-only access)
      const { data: credsData, error: credsError } = await supabase
        .from('order_credentials')
        .select('order_id, email, encrypted_password');

      if (!credsError && credsData) {
        const credsMap: Record<string, OrderCredential> = {};
        credsData.forEach((cred: any) => {
          credsMap[cred.order_id] = {
            email: cred.email,
            encrypted_password: cred.encrypted_password
          };
        });
        setCredentials(credsMap);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await supabase.from('orders').update({ 
        status, 
        activated_at: status === 'active' ? new Date().toISOString() : null 
      }).eq('id', orderId);
      fetchOrders();
    } catch (error) {
      console.error('Error updating:', error);
    }
  };

  const togglePassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const activeOrders = orders.filter(o => o.status === 'active');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-black">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage orders and activations</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Pending Orders */}
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  Pending Orders ({pendingOrders.length})
                </h2>
                <div className="grid gap-4">
                  {pendingOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-strong rounded-2xl p-6"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="font-bold text-lg">{order.tool?.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleString()}
                          </p>
                          <div className="space-y-1">
                            <p className="text-sm"><strong>Email:</strong> {credentials[order.id]?.email || order.customer_data?.email || order.buyer_email}</p>
                            {credentials[order.id]?.encrypted_password && (
                              <div className="flex items-center gap-2">
                                <p className="text-sm">
                                  <strong>Credentials:</strong>{' '}
                                  {showPasswords[order.id] ? '🔒 Encrypted (stored securely)' : '••••••••'}
                                </p>
                                <button onClick={() => togglePassword(order.id)} className="text-muted-foreground hover:text-foreground">
                                  {showPasswords[order.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => updateStatus(order.id, 'active')} className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" /> Activate
                          </Button>
                          <Button variant="destructive" onClick={() => updateStatus(order.id, 'cancelled')}>
                            <XCircle className="w-4 h-4 mr-2" /> Cancel
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {pendingOrders.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No pending orders</p>
                  )}
                </div>
              </section>

              {/* Active Orders */}
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Active Orders ({activeOrders.length})
                </h2>
                <div className="grid gap-4">
                  {activeOrders.slice(0, 10).map((order) => (
                    <div key={order.id} className="glass rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <span className="font-medium">{order.tool?.name}</span>
                        <span className="text-sm text-muted-foreground ml-4">{order.buyer_email}</span>
                      </div>
                      <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full">Active</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
