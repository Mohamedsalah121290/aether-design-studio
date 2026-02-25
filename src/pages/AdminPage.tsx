import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, Clock, CheckCircle, XCircle, Eye, EyeOff, Loader2, Plus, Edit2, BarChart3, Package, DollarSign, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

interface Tool {
  id: string;
  tool_id: string;
  name: string;
  category: string;
  price: number;
  is_active: boolean;
  delivery_type: string;
  access_url: string | null;
  activation_time: number;
}

type Tab = 'orders' | 'tools' | 'stats';

const AdminPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [credentials, setCredentials] = useState<Record<string, OrderCredential>>({});
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  
  // Tool form state
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [showToolForm, setShowToolForm] = useState(false);
  const [toolForm, setToolForm] = useState({ tool_id: '', name: '', category: 'ai-text', price: 0, delivery_type: 'provide_account', access_url: '', activation_time: 6, is_active: true });

  useEffect(() => {
    fetchOrders();
    fetchTools();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`*, tool:tools(name, tool_id)`)
        .order('created_at', { ascending: false });
      if (ordersError) throw ordersError;
      setOrders(ordersData as any[] || []);

      const { data: credsData } = await supabase
        .from('order_credentials')
        .select('order_id, email, encrypted_password');
      if (credsData) {
        const credsMap: Record<string, OrderCredential> = {};
        credsData.forEach((cred: any) => {
          credsMap[cred.order_id] = { email: cred.email, encrypted_password: cred.encrypted_password };
        });
        setCredentials(credsMap);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTools = async () => {
    const { data } = await supabase.from('tools').select('*').order('name');
    if (data) setTools(data as Tool[]);
  };

  const updateStatus = async (orderId: string, status: string) => {
    await supabase.from('orders').update({ 
      status, activated_at: status === 'active' ? new Date().toISOString() : null 
    }).eq('id', orderId);
    fetchOrders();
  };

  const togglePassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openToolForm = (tool?: Tool) => {
    if (tool) {
      setEditingTool(tool);
      setToolForm({ tool_id: tool.tool_id, name: tool.name, category: tool.category, price: tool.price, delivery_type: tool.delivery_type, access_url: tool.access_url || '', activation_time: tool.activation_time, is_active: tool.is_active });
    } else {
      setEditingTool(null);
      setToolForm({ tool_id: '', name: '', category: 'ai-text', price: 0, delivery_type: 'provide_account', access_url: '', activation_time: 6, is_active: true });
    }
    setShowToolForm(true);
  };

  const saveTool = async () => {
    const payload = { ...toolForm, price: Number(toolForm.price), activation_time: Number(toolForm.activation_time) };
    if (editingTool) {
      await supabase.from('tools').update(payload).eq('id', editingTool.id);
    } else {
      await supabase.from('tools').insert(payload);
    }
    setShowToolForm(false);
    fetchTools();
  };

  const toggleToolActive = async (tool: Tool) => {
    await supabase.from('tools').update({ is_active: !tool.is_active }).eq('id', tool.id);
    fetchTools();
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const activeOrders = orders.filter(o => o.status === 'active');
  const totalRevenue = orders.filter(o => o.status === 'active').length; // Placeholder

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'orders', label: 'Orders', icon: <Package className="w-4 h-4" /> },
    { id: 'tools', label: 'Tools', icon: <Edit2 className="w-4 h-4" /> },
    { id: 'stats', label: 'Stats', icon: <BarChart3 className="w-4 h-4" /> },
  ];

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
              <p className="text-muted-foreground">Manage orders, tools, and analytics</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-border pb-4">
            {tabs.map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="gap-2"
              >
                {tab.icon} {tab.label}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <div className="space-y-8">
                  <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-yellow-500" />
                      Pending Orders ({pendingOrders.length})
                    </h2>
                    <div className="grid gap-4">
                      {pendingOrders.map((order) => (
                        <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="space-y-2">
                              <h3 className="font-bold text-lg">{order.tool?.name}</h3>
                              <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                              <p className="text-sm"><strong>Email:</strong> {credentials[order.id]?.email || order.customer_data?.email || order.buyer_email}</p>
                              {credentials[order.id]?.encrypted_password && (
                                <div className="flex items-center gap-2">
                                  <p className="text-sm"><strong>Credentials:</strong> {showPasswords[order.id] ? '🔒 Encrypted (stored securely)' : '••••••••'}</p>
                                  <button onClick={() => togglePassword(order.id)} className="text-muted-foreground hover:text-foreground">
                                    {showPasswords[order.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                              )}
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
                      {pendingOrders.length === 0 && <p className="text-center text-muted-foreground py-8">No pending orders</p>}
                    </div>
                  </section>

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

              {/* TOOLS TAB */}
              {activeTab === 'tools' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Tools Management</h2>
                    <Button onClick={() => openToolForm()} size="sm"><Plus className="w-4 h-4 mr-2" /> Add Tool</Button>
                  </div>

                  {showToolForm && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-6 mb-6">
                      <h3 className="font-bold mb-4">{editingTool ? 'Edit Tool' : 'Add New Tool'}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input placeholder="Tool ID (e.g. chatgpt)" value={toolForm.tool_id} onChange={e => setToolForm(f => ({ ...f, tool_id: e.target.value }))} className="px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none" />
                        <input placeholder="Name" value={toolForm.name} onChange={e => setToolForm(f => ({ ...f, name: e.target.value }))} className="px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none" />
                        <select value={toolForm.category} onChange={e => setToolForm(f => ({ ...f, category: e.target.value }))} className="px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none">
                          <option value="ai-text">AI Text</option>
                          <option value="ai-image">AI Image</option>
                          <option value="ai-video">AI Video</option>
                          <option value="ai-audio">AI Audio</option>
                          <option value="ai-code">AI Code</option>
                          <option value="productivity">Productivity</option>
                        </select>
                        <input type="number" placeholder="Price" value={toolForm.price} onChange={e => setToolForm(f => ({ ...f, price: Number(e.target.value) }))} className="px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none" />
                        <select value={toolForm.delivery_type} onChange={e => setToolForm(f => ({ ...f, delivery_type: e.target.value }))} className="px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none">
                          <option value="provide_account">Provide Account</option>
                          <option value="link_access">Link Access</option>
                          <option value="api_key">API Key</option>
                        </select>
                        <input placeholder="Access URL" value={toolForm.access_url} onChange={e => setToolForm(f => ({ ...f, access_url: e.target.value }))} className="px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none" />
                      </div>
                      <div className="flex gap-3 mt-4">
                        <Button onClick={saveTool}>{editingTool ? 'Update' : 'Create'}</Button>
                        <Button variant="ghost" onClick={() => setShowToolForm(false)}>Cancel</Button>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid gap-3">
                    {tools.map(tool => (
                      <div key={tool.id} className="glass rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${tool.is_active ? 'bg-green-400' : 'bg-red-400'}`} />
                          <div>
                            <p className="font-medium">{tool.name}</p>
                            <p className="text-xs text-muted-foreground">{tool.tool_id} • ${tool.price}/mo • {tool.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => toggleToolActive(tool)}>
                            {tool.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openToolForm(tool)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STATS TAB */}
              {activeTab === 'stats' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="glass-strong rounded-2xl p-6 text-center">
                    <Package className="w-8 h-8 text-primary mx-auto mb-3" />
                    <p className="text-3xl font-bold">{orders.length}</p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                  <div className="glass-strong rounded-2xl p-6 text-center">
                    <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                    <p className="text-3xl font-bold">{activeOrders.length}</p>
                    <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                  </div>
                  <div className="glass-strong rounded-2xl p-6 text-center">
                    <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                    <p className="text-3xl font-bold">{pendingOrders.length}</p>
                    <p className="text-sm text-muted-foreground">Pending Orders</p>
                  </div>
                  <div className="glass-strong rounded-2xl p-6 text-center sm:col-span-3">
                    <Edit2 className="w-8 h-8 text-primary mx-auto mb-3" />
                    <p className="text-3xl font-bold">{tools.length}</p>
                    <p className="text-sm text-muted-foreground">Total Tools</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
