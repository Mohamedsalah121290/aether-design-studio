import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, Clock, CheckCircle, XCircle, Eye, EyeOff, Loader2, Plus, Edit2, BarChart3, Package, DollarSign, Users, Layers, Trash2, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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

interface ToolPlan {
  id: string;
  tool_id: string;
  plan_id: string;
  plan_name: string;
  monthly_price: number | null;
  delivery_type: string;
  activation_time: number;
  is_active: boolean;
}

type Tab = 'orders' | 'tools' | 'plans' | 'stats';

const AdminPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [credentials, setCredentials] = useState<Record<string, OrderCredential>>({});
  const [tools, setTools] = useState<Tool[]>([]);
  const [plans, setPlans] = useState<ToolPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  
  // Tool form state
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [showToolForm, setShowToolForm] = useState(false);
  const [toolForm, setToolForm] = useState({ tool_id: '', name: '', category: 'ai-text', price: 0, delivery_type: 'provide_account', access_url: '', activation_time: 6, is_active: true });

  // Plan form state
  const [editingPlan, setEditingPlan] = useState<ToolPlan | null>(null);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [planFilter, setPlanFilter] = useState('');
  const [planForm, setPlanForm] = useState({ tool_id: '', plan_id: '', plan_name: '', monthly_price: '' as string, delivery_type: 'provide_account', activation_time: 6, is_active: true });

  // Import preview state
  const [importPreview, setImportPreview] = useState<{
    show: boolean;
    replaceExisting: boolean;
    payloads: any[];
    toCreate: any[];
    toUpdate: any[];
  }>({ show: false, replaceExisting: false, payloads: [], toCreate: [], toUpdate: [] });

  useEffect(() => {
    fetchOrders();
    fetchTools();
    fetchPlans();
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

  const fetchPlans = async () => {
    const { data } = await supabase.from('tool_plans').select('*').order('tool_id').order('monthly_price', { ascending: true, nullsFirst: false });
    if (data) setPlans(data as ToolPlan[]);
  };

  const openPlanForm = (plan?: ToolPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setPlanForm({ tool_id: plan.tool_id, plan_id: plan.plan_id, plan_name: plan.plan_name, monthly_price: plan.monthly_price?.toString() ?? '', delivery_type: plan.delivery_type, activation_time: plan.activation_time, is_active: plan.is_active });
    } else {
      setEditingPlan(null);
      setPlanForm({ tool_id: planFilter || '', plan_id: '', plan_name: '', monthly_price: '', delivery_type: 'provide_account', activation_time: 6, is_active: true });
    }
    setShowPlanForm(true);
  };

  const savePlan = async () => {
    const payload = {
      tool_id: planForm.tool_id.trim(),
      plan_id: planForm.plan_id.trim(),
      plan_name: planForm.plan_name.trim(),
      monthly_price: planForm.monthly_price ? Number(planForm.monthly_price) : null,
      delivery_type: planForm.delivery_type,
      activation_time: Number(planForm.activation_time),
      is_active: planForm.is_active,
    };
    if (editingPlan) {
      await supabase.from('tool_plans').update(payload).eq('id', editingPlan.id);
    } else {
      await supabase.from('tool_plans').insert(payload);
    }
    setShowPlanForm(false);
    fetchPlans();
  };

  const deletePlan = async (plan: ToolPlan) => {
    if (!confirm(`Delete plan "${plan.plan_name}" for ${plan.tool_id}?`)) return;
    await supabase.from('tool_plans').delete().eq('id', plan.id);
    fetchPlans();
  };

  const togglePlanActive = async (plan: ToolPlan) => {
    await supabase.from('tool_plans').update({ is_active: !plan.is_active }).eq('id', plan.id);
    fetchPlans();
  };

  const exportPlansCSV = () => {
    const filtered = planFilter ? plans.filter(p => p.tool_id === planFilter) : plans;
    const headers = ['tool_id', 'plan_id', 'plan_name', 'monthly_price', 'delivery_type', 'activation_time', 'is_active'];
    const rows = filtered.map(p => [
      p.tool_id, p.plan_id, p.plan_name,
      p.monthly_price !== null ? p.monthly_price : '',
      p.delivery_type, p.activation_time, p.is_active
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plans${planFilter ? `-${planFilter}` : ''}-export.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importPlansCSV = (e: React.ChangeEvent<HTMLInputElement>, replaceExisting: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const text = ev.target?.result as string;
      const lines = text.trim().split('\n');
      if (lines.length < 2) return;
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      const required = ['tool_id', 'plan_id', 'plan_name'];
      if (!required.every(r => headers.includes(r))) {
        alert('CSV must include columns: tool_id, plan_id, plan_name');
        return;
      }
      const rows = lines.slice(1).map(line => {
        const vals = line.match(/(".*?"|[^",]+|(?<=,)(?=,))/g)?.map(v => v.replace(/^"|"$/g, '').trim()) || [];
        const obj: Record<string, any> = {};
        headers.forEach((h, i) => { obj[h] = vals[i] ?? ''; });
        return obj;
      });
      const payloads = rows.filter(r => r.tool_id && r.plan_id && r.plan_name).map(r => ({
        tool_id: r.tool_id,
        plan_id: r.plan_id,
        plan_name: r.plan_name,
        monthly_price: r.monthly_price !== undefined && r.monthly_price !== '' ? Number(r.monthly_price) : null,
        delivery_type: r.delivery_type || 'provide_account',
        activation_time: r.activation_time ? Number(r.activation_time) : 6,
        is_active: r.is_active !== undefined ? r.is_active === 'true' : true,
      }));
      if (payloads.length === 0) { alert('No valid rows found'); return; }

      const existingKeys = new Set(plans.map(p => `${p.tool_id}::${p.plan_id}`));
      const toUpdate = payloads.filter(p => existingKeys.has(`${p.tool_id}::${p.plan_id}`));
      const toCreate = payloads.filter(p => !existingKeys.has(`${p.tool_id}::${p.plan_id}`));

      setImportPreview({ show: true, replaceExisting, payloads, toCreate, toUpdate });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const confirmImport = async () => {
    const { replaceExisting, payloads } = importPreview;
    let error;
    if (replaceExisting) {
      ({ error } = await supabase.from('tool_plans').upsert(payloads, { onConflict: 'tool_id,plan_id' }));
    } else {
      ({ error } = await supabase.from('tool_plans').insert(payloads));
    }
    setImportPreview(p => ({ ...p, show: false }));
    if (error) { alert('Import error: ' + error.message); } else { fetchPlans(); }
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
    { id: 'plans', label: 'Plans', icon: <Layers className="w-4 h-4" /> },
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

              {/* PLANS TAB */}
              {activeTab === 'plans' && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-xl font-bold">Plans Management</h2>
                    <div className="flex items-center gap-3">
                      <select
                        value={planFilter}
                        onChange={e => setPlanFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none text-sm"
                      >
                        <option value="">All Tools</option>
                        {tools.map(t => (
                          <option key={t.tool_id} value={t.tool_id}>{t.name}</option>
                        ))}
                      </select>
                      <Button onClick={exportPlansCSV} variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
                      <label className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild><span><Upload className="w-4 h-4 mr-2" /> Import (Add)</span></Button>
                        <input type="file" accept=".csv" onChange={e => importPlansCSV(e, false)} className="hidden" />
                      </label>
                      <label className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild><span><Upload className="w-4 h-4 mr-2" /> Import (Replace)</span></Button>
                        <input type="file" accept=".csv" onChange={e => importPlansCSV(e, true)} className="hidden" />
                      </label>
                      <Button onClick={() => openPlanForm()} size="sm"><Plus className="w-4 h-4 mr-2" /> Add Plan</Button>
                    </div>
                  </div>

                  {showPlanForm && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-6 mb-6">
                      <h3 className="font-bold mb-4">{editingPlan ? 'Edit Plan' : 'Add New Plan'}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Tool ID</label>
                          <select
                            value={planForm.tool_id}
                            onChange={e => setPlanForm(f => ({ ...f, tool_id: e.target.value }))}
                            className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none"
                            disabled={!!editingPlan}
                          >
                            <option value="">Select tool...</option>
                            {tools.map(t => (
                              <option key={t.tool_id} value={t.tool_id}>{t.name} ({t.tool_id})</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Plan ID (slug)</label>
                          <input
                            placeholder="e.g. pro, basic, premium"
                            value={planForm.plan_id}
                            onChange={e => setPlanForm(f => ({ ...f, plan_id: e.target.value }))}
                            className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none"
                            disabled={!!editingPlan}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Plan Name</label>
                          <input
                            placeholder="e.g. Pro, Basic, Premium"
                            value={planForm.plan_name}
                            onChange={e => setPlanForm(f => ({ ...f, plan_name: e.target.value }))}
                            className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Monthly Price ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Leave empty for contact pricing"
                            value={planForm.monthly_price}
                            onChange={e => setPlanForm(f => ({ ...f, monthly_price: e.target.value }))}
                            className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Delivery Type</label>
                          <select
                            value={planForm.delivery_type}
                            onChange={e => setPlanForm(f => ({ ...f, delivery_type: e.target.value }))}
                            className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none"
                          >
                            <option value="provide_account">Provide Account</option>
                            <option value="subscribe_for_them">Subscribe For Them</option>
                            <option value="email_only">Email Only</option>
                            <option value="link_access">Link Access</option>
                            <option value="api_key">API Key</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Activation Time (hours)</label>
                          <input
                            type="number"
                            value={planForm.activation_time}
                            onChange={e => setPlanForm(f => ({ ...f, activation_time: Number(e.target.value) }))}
                            className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-4">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={planForm.is_active}
                            onChange={e => setPlanForm(f => ({ ...f, is_active: e.target.checked }))}
                            className="rounded"
                          />
                          Active
                        </label>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <Button onClick={savePlan}>{editingPlan ? 'Update' : 'Create'}</Button>
                        <Button variant="ghost" onClick={() => setShowPlanForm(false)}>Cancel</Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Group plans by tool */}
                  {(() => {
                    const filtered = planFilter ? plans.filter(p => p.tool_id === planFilter) : plans;
                    const grouped = filtered.reduce<Record<string, ToolPlan[]>>((acc, plan) => {
                      (acc[plan.tool_id] = acc[plan.tool_id] || []).push(plan);
                      return acc;
                    }, {});
                    const toolNames = tools.reduce<Record<string, string>>((acc, t) => { acc[t.tool_id] = t.name; return acc; }, {});

                    return Object.entries(grouped).map(([toolId, toolPlans]) => (
                      <div key={toolId} className="mb-6">
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                          {toolNames[toolId] || toolId} ({toolPlans.length} {toolPlans.length === 1 ? 'plan' : 'plans'})
                        </h3>
                        <div className="grid gap-2">
                          {toolPlans.map(plan => (
                            <div key={plan.id} className="glass rounded-xl p-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-2.5 h-2.5 rounded-full ${plan.is_active ? 'bg-green-400' : 'bg-red-400'}`} />
                                <div>
                                  <p className="font-medium">{plan.plan_name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {plan.plan_id} • {plan.monthly_price !== null ? `$${plan.monthly_price}/mo` : 'Contact'} • {plan.delivery_type} • {plan.activation_time}h
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" onClick={() => togglePlanActive(plan)}>
                                  {plan.is_active ? 'Deactivate' : 'Activate'}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => openPlanForm(plan)}>
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => deletePlan(plan)} className="text-destructive hover:text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ));
                  })()}
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
      {/* Import Preview Modal */}
      <Dialog open={importPreview.show} onOpenChange={open => !open && setImportPreview(p => ({ ...p, show: false }))}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Import Summary — {importPreview.replaceExisting ? 'Replace Mode' : 'Add Mode'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {importPreview.toCreate.length > 0 && (
              <div>
                <p className="text-sm font-semibold flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  New ({importPreview.toCreate.length})
                </p>
                <div className="space-y-1">
                  {importPreview.toCreate.map((p, i) => (
                    <div key={i} className="text-sm px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400">
                      {p.tool_id} / {p.plan_id} — {p.plan_name} (${p.monthly_price ?? 'N/A'})
                    </div>
                  ))}
                </div>
              </div>
            )}
            {importPreview.toUpdate.length > 0 && (
              <div>
                <p className="text-sm font-semibold flex items-center gap-2 mb-2">
                  {importPreview.replaceExisting ? (
                    <><Edit2 className="w-4 h-4 text-blue-500" /> Update ({importPreview.toUpdate.length})</>
                  ) : (
                    <><Clock className="w-4 h-4 text-yellow-500" /> Duplicate ({importPreview.toUpdate.length})</>
                  )}
                </p>
                <div className="space-y-1">
                  {importPreview.toUpdate.map((p, i) => (
                    <div key={i} className={`text-sm px-3 py-1.5 rounded-lg ${importPreview.replaceExisting ? 'bg-blue-500/10 text-blue-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                      {p.tool_id} / {p.plan_id} — {p.plan_name} (${p.monthly_price ?? 'N/A'})
                    </div>
                  ))}
                </div>
              </div>
            )}
            {importPreview.toCreate.length === 0 && importPreview.toUpdate.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">No changes detected.</p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setImportPreview(p => ({ ...p, show: false }))}>Cancel</Button>
            <Button onClick={confirmImport}>
              Import {importPreview.payloads.length} Plans
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
