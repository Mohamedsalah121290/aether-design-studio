import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, Clock, CheckCircle, XCircle, Eye, EyeOff, Loader2, Plus, Edit2, BarChart3, Package, Users, Layers, Trash2, Download, Upload, Mail, Search, X, Send, Lock, GraduationCap, Play, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
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
  payment_status: string | null;
  customer_data: Record<string, string>;
  admin_notes: string | null;
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
  status: string;
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

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

type Tab = 'orders' | 'tools' | 'plans' | 'subscribers' | 'academy' | 'stats';

// Delivery modal state
interface DeliveryModalState {
  open: boolean;
  order: AdminOrder | null;
  loginEmail: string;
  loginPassword: string;
  notes: string;
  loading: boolean;
}

const AdminPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [credentials, setCredentials] = useState<Record<string, OrderCredential>>({});
  const [tools, setTools] = useState<Tool[]>([]);
  const [plans, setPlans] = useState<ToolPlan[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'pending_activation' | 'delivered' | 'cancelled'>('all');
  
  // Delivery modal
  const [deliveryModal, setDeliveryModal] = useState<DeliveryModalState>({
    open: false, order: null, loginEmail: '', loginPassword: '', notes: '', loading: false,
  });

  // Tool form state
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [showToolForm, setShowToolForm] = useState(false);
  const [toolForm, setToolForm] = useState({ tool_id: '', name: '', category: 'ai-text', price: 0, delivery_type: 'provide_account', access_url: '', activation_time: 6, is_active: true, status: 'active' });

  // Plan form state
  const [editingPlan, setEditingPlan] = useState<ToolPlan | null>(null);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [planFilter, setPlanFilter] = useState('');
  const [planForm, setPlanForm] = useState({ tool_id: '', plan_id: '', plan_name: '', monthly_price: '' as string, delivery_type: 'provide_account', activation_time: 6, is_active: true });

  // Subscriber search state
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [toolStatusFilter, setToolStatusFilter] = useState<'all' | 'active' | 'coming_soon' | 'paused'>('all');

  // Academy state
  const [academyCourses, setAcademyCourses] = useState<any[]>([]);
  const [academyLessons, setAcademyLessons] = useState<any[]>([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', category: 'general', difficulty: 'beginner', is_free: true, price: '', is_published: false, tool_id: '', thumbnail_url: '' });
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [lessonForm, setLessonForm] = useState({ course_id: '', title: '', content_url: '', duration: '', is_preview: false, sort_order: 0 });
  const [selectedAcademyCourse, setSelectedAcademyCourse] = useState<string>('');

  // Import preview state
  const [importPreview, setImportPreview] = useState<{
    show: boolean;
    replaceExisting: boolean;
    payloads: any[];
    toCreate: any[];
    toUpdate: any[];
    selected: Set<string>;
  }>({ show: false, replaceExisting: false, payloads: [], toCreate: [], toUpdate: [], selected: new Set() });

  useEffect(() => {
    fetchOrders();
    fetchTools();
    fetchPlans();
    fetchSubscribers();
    fetchAcademyData();
  }, []);

  const fetchAcademyData = async () => {
    const [coursesRes, lessonsRes] = await Promise.all([
      supabase.from('courses').select('*').order('created_at', { ascending: false }),
      supabase.from('lessons').select('*').order('sort_order'),
    ]);
    if (coursesRes.data) setAcademyCourses(coursesRes.data);
    if (lessonsRes.data) setAcademyLessons(lessonsRes.data);
  };

  const openCourseForm = (course?: any) => {
    if (course) {
      setEditingCourse(course);
      setCourseForm({ title: course.title, description: course.description || '', category: course.category, difficulty: course.difficulty, is_free: course.is_free, price: course.price?.toString() || '', is_published: course.is_published, tool_id: course.tool_id || '', thumbnail_url: course.thumbnail_url || '' });
    } else {
      setEditingCourse(null);
      setCourseForm({ title: '', description: '', category: 'general', difficulty: 'beginner', is_free: true, price: '', is_published: false, tool_id: '', thumbnail_url: '' });
    }
    setShowCourseForm(true);
  };

  const saveCourse = async () => {
    const payload = { ...courseForm, price: courseForm.price ? Number(courseForm.price) : null, tool_id: courseForm.tool_id || null, thumbnail_url: courseForm.thumbnail_url || null };
    if (editingCourse) {
      await supabase.from('courses').update(payload).eq('id', editingCourse.id);
    } else {
      await supabase.from('courses').insert(payload);
    }
    setShowCourseForm(false);
    fetchAcademyData();
  };

  const deleteCourse = async (id: string) => {
    if (!confirm('Delete this course and all its lessons?')) return;
    await supabase.from('courses').delete().eq('id', id);
    fetchAcademyData();
  };

  const openLessonForm = (courseId: string, lesson?: any) => {
    if (lesson) {
      setEditingLesson(lesson);
      setLessonForm({ course_id: lesson.course_id, title: lesson.title, content_url: lesson.content_url || '', duration: lesson.duration || '', is_preview: lesson.is_preview || false, sort_order: lesson.sort_order });
    } else {
      setEditingLesson(null);
      const existingLessons = academyLessons.filter(l => l.course_id === courseId);
      setLessonForm({ course_id: courseId, title: '', content_url: '', duration: '', is_preview: false, sort_order: existingLessons.length });
    }
    setShowLessonForm(true);
  };

  const saveLesson = async () => {
    const payload = { ...lessonForm, content_url: lessonForm.content_url || null, duration: lessonForm.duration || null, sort_order: Number(lessonForm.sort_order) };
    if (editingLesson) {
      await supabase.from('lessons').update(payload).eq('id', editingLesson.id);
    } else {
      await supabase.from('lessons').insert(payload);
    }
    setShowLessonForm(false);
    fetchAcademyData();
  };

  const deleteLesson = async (id: string) => {
    if (!confirm('Delete this lesson?')) return;
    await supabase.from('lessons').delete().eq('id', id);
    fetchAcademyData();
  };

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
    const rows = filtered.map(p => [p.tool_id, p.plan_id, p.plan_name, p.monthly_price !== null ? p.monthly_price : '', p.delivery_type, p.activation_time, p.is_active]);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `plans${planFilter ? `-${planFilter}` : ''}-export.csv`; a.click();
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
      if (!required.every(r => headers.includes(r))) { alert('CSV must include columns: tool_id, plan_id, plan_name'); return; }
      const rows = lines.slice(1).map(line => {
        const vals = line.match(/(".*?"|[^",]+|(?<=,)(?=,))/g)?.map(v => v.replace(/^"|"$/g, '').trim()) || [];
        const obj: Record<string, any> = {};
        headers.forEach((h, i) => { obj[h] = vals[i] ?? ''; });
        return obj;
      });
      const payloads = rows.filter(r => r.tool_id && r.plan_id && r.plan_name).map(r => ({
        tool_id: r.tool_id, plan_id: r.plan_id, plan_name: r.plan_name,
        monthly_price: r.monthly_price !== undefined && r.monthly_price !== '' ? Number(r.monthly_price) : null,
        delivery_type: r.delivery_type || 'provide_account',
        activation_time: r.activation_time ? Number(r.activation_time) : 6,
        is_active: r.is_active !== undefined ? r.is_active === 'true' : true,
      }));
      if (payloads.length === 0) { alert('No valid rows found'); return; }
      const existingKeys = new Set(plans.map(p => `${p.tool_id}::${p.plan_id}`));
      const toUpdate = payloads.filter(p => existingKeys.has(`${p.tool_id}::${p.plan_id}`));
      const toCreate = payloads.filter(p => !existingKeys.has(`${p.tool_id}::${p.plan_id}`));
      const allKeys = new Set(payloads.map(p => `${p.tool_id}::${p.plan_id}`));
      setImportPreview({ show: true, replaceExisting, payloads, toCreate, toUpdate, selected: allKeys });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const confirmImport = async () => {
    const { replaceExisting, payloads, selected } = importPreview;
    const filtered = payloads.filter(p => selected.has(`${p.tool_id}::${p.plan_id}`));
    if (filtered.length === 0) { setImportPreview(p => ({ ...p, show: false })); return; }
    let error;
    if (replaceExisting) {
      ({ error } = await supabase.from('tool_plans').upsert(filtered, { onConflict: 'tool_id,plan_id' }));
    } else {
      ({ error } = await supabase.from('tool_plans').insert(filtered));
    }
    setImportPreview(p => ({ ...p, show: false }));
    if (error) { alert('Import error: ' + error.message); } else { fetchPlans(); }
  };

  const toggleImportSelection = (key: string) => {
    setImportPreview(p => {
      const next = new Set(p.selected);
      if (next.has(key)) next.delete(key); else next.add(key);
      return { ...p, selected: next };
    });
  };

  const toggleAllImportSelection = () => {
    setImportPreview(p => {
      const allKeys = p.payloads.map(pl => `${pl.tool_id}::${pl.plan_id}`);
      const allSelected = allKeys.every(k => p.selected.has(k));
      return { ...p, selected: allSelected ? new Set<string>() : new Set(allKeys) };
    });
  };

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from('orders').update({ 
      status, activated_at: status === 'delivered' || status === 'active' ? new Date().toISOString() : null 
    }).eq('id', orderId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update order status', variant: 'destructive' });
      return;
    }

    if (status === 'delivered' || status === 'active') {
      try {
        const { error: notifError } = await supabase.functions.invoke('order-notification', {
          body: { type: 'order_activated', orderId },
        });
        if (notifError) throw notifError;
        toast({ title: '✅ Order Delivered', description: 'Delivery email sent to the customer.' });
      } catch (err) {
        console.error('Failed to send email:', err);
        toast({ title: '⚠️ Order Delivered', description: 'Order delivered but email failed to send.', variant: 'destructive' });
      }
    } else {
      toast({ title: 'Order Updated', description: `Status changed to ${status}` });
    }

    fetchOrders();
  };

  const togglePassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Open delivery modal
  const openDeliveryModal = (order: AdminOrder) => {
    setDeliveryModal({
      open: true,
      order,
      loginEmail: credentials[order.id]?.email || '',
      loginPassword: '',
      notes: order.admin_notes || '',
      loading: false,
    });
  };

  // Handle Mark as Delivered
  const handleMarkDelivered = async () => {
    if (!deliveryModal.order) return;
    const { order, loginEmail, loginPassword, notes } = deliveryModal;
    
    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast({ title: 'Missing fields', description: 'Please enter login email and password.', variant: 'destructive' });
      return;
    }

    setDeliveryModal(m => ({ ...m, loading: true }));

    try {
      // Store credentials via edge function (encrypted)
      const { error: credError } = await supabase.functions.invoke('store-credentials', {
        body: { order_id: order.id, email: loginEmail.trim(), password: loginPassword.trim() },
      });
      if (credError) throw credError;

      // Update order status to delivered + notes
      const { error: orderError } = await supabase.from('orders').update({
        status: 'delivered',
        activated_at: new Date().toISOString(),
        admin_notes: notes.trim() || null,
      }).eq('id', order.id);
      if (orderError) throw orderError;

      // Send notification email
      try {
        await supabase.functions.invoke('order-notification', {
          body: { type: 'order_activated', orderId: order.id },
        });
      } catch (emailErr) {
        console.error('Email send failed:', emailErr);
      }

      toast({ title: '✅ Order Delivered', description: `Credentials saved and customer notified.` });
      setDeliveryModal({ open: false, order: null, loginEmail: '', loginPassword: '', notes: '', loading: false });
      fetchOrders();
    } catch (err) {
      console.error('Delivery error:', err);
      toast({ title: 'Error', description: 'Failed to deliver order. Please try again.', variant: 'destructive' });
      setDeliveryModal(m => ({ ...m, loading: false }));
    }
  };

  const openToolForm = (tool?: Tool) => {
    if (tool) {
      setEditingTool(tool);
      setToolForm({ tool_id: tool.tool_id, name: tool.name, category: tool.category, price: tool.price, delivery_type: tool.delivery_type, access_url: tool.access_url || '', activation_time: tool.activation_time, is_active: tool.is_active, status: tool.status || 'active' });
    } else {
      setEditingTool(null);
      setToolForm({ tool_id: '', name: '', category: 'ai-text', price: 0, delivery_type: 'provide_account', access_url: '', activation_time: 6, is_active: true, status: 'active' });
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

  const fetchSubscribers = async () => {
    const { data } = await supabase.from('subscribers').select('*').order('created_at', { ascending: false });
    if (data) setSubscribers(data as Subscriber[]);
  };

  const deleteSubscriber = async (sub: Subscriber) => {
    if (!confirm(`Remove subscriber ${sub.email}?`)) return;
    await supabase.from('subscribers').delete().eq('id', sub.id);
    fetchSubscribers();
  };

  const exportSubscribersCSV = () => {
    const headers = ['email', 'subscribed_at'];
    const rows = subscribers.map(s => [s.email, new Date(s.created_at).toISOString()]);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `subscribers-export-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered orders
  const filteredOrders = orderStatusFilter === 'all' ? orders : orders.filter(o => {
    if (orderStatusFilter === 'pending') return o.status === 'pending' || o.status === 'pending_activation';
    return o.status === orderStatusFilter;
  });
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'pending_activation');
  const deliveredOrders = orders.filter(o => o.status === 'delivered' || o.status === 'active');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'orders', label: 'Orders', icon: <Package className="w-4 h-4" /> },
    { id: 'tools', label: 'Tools', icon: <Edit2 className="w-4 h-4" /> },
    { id: 'plans', label: 'Plans', icon: <Layers className="w-4 h-4" /> },
    { id: 'subscribers', label: 'Subscribers', icon: <Mail className="w-4 h-4" /> },
    { id: 'academy', label: 'Academy', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'stats', label: 'Stats', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': case 'pending_activation':
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30"><Clock className="w-3 h-3 mr-1" />Pending Activation</Badge>;
      case 'delivered': case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />Delivered</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Processing</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

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
              <Button key={tab.id} variant={activeTab === tab.id ? 'default' : 'ghost'} size="sm" onClick={() => setActiveTab(tab.id)} className="gap-2">
                {tab.icon} {tab.label}
                {tab.id === 'orders' && pendingOrders.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold">{pendingOrders.length}</span>
                )}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <>
              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  {/* Order status filters */}
                  <div className="flex items-center gap-2">
                    {(['all', 'pending', 'delivered', 'cancelled'] as const).map(f => (
                      <button key={f} onClick={() => setOrderStatusFilter(f as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          orderStatusFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                        }`}>
                        {f === 'all' ? `All (${orders.length})` : f === 'pending' ? `Pending (${pendingOrders.length})` : f === 'delivered' ? `Delivered (${deliveredOrders.length})` : 'Cancelled'}
                      </button>
                    ))}
                  </div>

                  {/* Orders list */}
                  <div className="space-y-3">
                    {filteredOrders.map((order) => (
                      <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="glass-strong rounded-2xl p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="font-bold text-lg">{order.tool?.name || 'Unknown Tool'}</h3>
                              {getStatusBadge(order.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                            <p className="text-sm"><strong>Customer:</strong> {order.buyer_email}</p>
                            {order.payment_status && (
                              <p className="text-sm"><strong>Payment:</strong> <span className={order.payment_status === 'paid' ? 'text-green-400' : 'text-orange-400'}>{order.payment_status}</span></p>
                            )}
                            {order.admin_notes && (
                              <p className="text-xs text-muted-foreground italic">Notes: {order.admin_notes}</p>
                            )}

                            {/* Show stored credentials if delivered */}
                            {credentials[order.id] && (
                              <div className="mt-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 space-y-1">
                                <p className="text-xs text-green-400 font-semibold flex items-center gap-1">
                                  <Lock className="w-3 h-3" /> Stored Credentials
                                </p>
                                <p className="text-sm"><strong>Email:</strong> {credentials[order.id].email}</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm"><strong>Password:</strong> {showPasswords[order.id] ? '🔒 Encrypted' : '••••••••'}</p>
                                  <button onClick={() => togglePassword(order.id)} className="text-muted-foreground hover:text-foreground">
                                    {showPasswords[order.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2 shrink-0">
                            {(order.status === 'pending' || order.status === 'pending_activation' || order.status === 'processing') && (
                              <>
                                <Button onClick={() => openDeliveryModal(order)} className="bg-green-600 hover:bg-green-700 gap-2">
                                  <Send className="w-4 h-4" /> Mark as Delivered
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => updateStatus(order.id, 'cancelled')}>
                                  <XCircle className="w-4 h-4 mr-1" /> Cancel
                                </Button>
                              </>
                            )}
                            {(order.status === 'delivered' || order.status === 'active') && !credentials[order.id] && (
                              <Button onClick={() => openDeliveryModal(order)} variant="outline" size="sm" className="gap-2">
                                <Lock className="w-4 h-4" /> Add Credentials
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {filteredOrders.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No orders matching this filter</p>
                    )}
                  </div>
                </div>
              )}

              {/* TOOLS TAB */}
              {activeTab === 'tools' && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                    <h2 className="text-xl font-bold">Tools Management</h2>
                    <div className="flex items-center gap-2">
                      {(['all', 'active', 'coming_soon', 'paused'] as const).map(f => (
                        <button key={f} onClick={() => setToolStatusFilter(f)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            toolStatusFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                          }`}>
                          {f === 'all' ? 'All' : f === 'active' ? 'Active' : f === 'coming_soon' ? 'Coming Soon' : 'Paused'}
                        </button>
                      ))}
                      <Button onClick={() => openToolForm()} size="sm"><Plus className="w-4 h-4 mr-2" /> Add Tool</Button>
                    </div>
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
                        <select value={toolForm.status} onChange={e => setToolForm(f => ({ ...f, status: e.target.value }))} className="px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none">
                          <option value="active">Active</option>
                          <option value="coming_soon">Coming Soon</option>
                          <option value="paused">Paused</option>
                        </select>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <Button onClick={saveTool}>{editingTool ? 'Update' : 'Create'}</Button>
                        <Button variant="ghost" onClick={() => setShowToolForm(false)}>Cancel</Button>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid gap-3">
                    {tools.filter(t => toolStatusFilter === 'all' || t.status === toolStatusFilter).map(tool => {
                      const statusColor = tool.status === 'coming_soon' ? 'bg-yellow-400' : tool.status === 'paused' ? 'bg-gray-400' : 'bg-green-400';
                      const statusLabel = tool.status === 'coming_soon' ? 'Coming Soon' : tool.status === 'paused' ? 'Paused' : 'Active';
                      return (
                        <div key={tool.id} className="glass rounded-xl p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${statusColor}`} />
                            <div>
                              <p className="font-medium">{tool.name}</p>
                              <p className="text-xs text-muted-foreground">{tool.tool_id} • ${tool.price}/mo • {tool.category}</p>
                            </div>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tool.status === 'coming_soon' ? 'bg-yellow-500/10 text-yellow-400' : tool.status === 'paused' ? 'bg-gray-500/10 text-gray-400' : 'bg-green-500/10 text-green-400'}`}>
                              {statusLabel}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <select value={tool.status || 'active'}
                              onChange={async (e) => {
                                await supabase.from('tools').update({ status: e.target.value, is_active: e.target.value === 'active' } as any).eq('id', tool.id);
                                fetchTools();
                              }}
                              className="px-2 py-1 rounded-lg bg-muted/50 border border-border text-xs focus:border-primary focus:outline-none">
                              <option value="active">Active</option>
                              <option value="coming_soon">Coming Soon</option>
                              <option value="paused">Paused</option>
                            </select>
                            <Button variant="ghost" size="sm" onClick={() => openToolForm(tool)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PLANS TAB */}
              {activeTab === 'plans' && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-xl font-bold">Plans Management</h2>
                    <div className="flex items-center gap-3">
                      <select value={planFilter} onChange={e => setPlanFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none text-sm">
                        <option value="">All Tools</option>
                        {tools.map(t => (<option key={t.tool_id} value={t.tool_id}>{t.name}</option>))}
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
                          <select value={planForm.tool_id} onChange={e => setPlanForm(f => ({ ...f, tool_id: e.target.value }))}
                            className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none" disabled={!!editingPlan}>
                            <option value="">Select tool...</option>
                            {tools.map(t => (<option key={t.tool_id} value={t.tool_id}>{t.name} ({t.tool_id})</option>))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Plan ID (slug)</label>
                          <input placeholder="e.g. pro, basic, premium" value={planForm.plan_id} onChange={e => setPlanForm(f => ({ ...f, plan_id: e.target.value }))}
                            className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none" disabled={!!editingPlan} />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Plan Name</label>
                          <input placeholder="e.g. Pro, Basic, Premium" value={planForm.plan_name} onChange={e => setPlanForm(f => ({ ...f, plan_name: e.target.value }))}
                            className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Monthly Price ($)</label>
                          <input type="number" step="0.01" placeholder="Leave empty for contact pricing" value={planForm.monthly_price}
                            onChange={e => setPlanForm(f => ({ ...f, monthly_price: e.target.value }))}
                            className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Delivery Type</label>
                          <select value={planForm.delivery_type} onChange={e => setPlanForm(f => ({ ...f, delivery_type: e.target.value }))}
                            className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none">
                            <option value="provide_account">Provide Account</option>
                            <option value="subscribe_for_them">Subscribe For Them</option>
                            <option value="email_only">Email Only</option>
                            <option value="link_access">Link Access</option>
                            <option value="api_key">API Key</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Activation Time (hours)</label>
                          <input type="number" value={planForm.activation_time} onChange={e => setPlanForm(f => ({ ...f, activation_time: Number(e.target.value) }))}
                            className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none" />
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-4">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={planForm.is_active} onChange={e => setPlanForm(f => ({ ...f, is_active: e.target.checked }))} className="rounded" />
                          Active
                        </label>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <Button onClick={savePlan}>{editingPlan ? 'Update' : 'Create'}</Button>
                        <Button variant="ghost" onClick={() => setShowPlanForm(false)}>Cancel</Button>
                      </div>
                    </motion.div>
                  )}

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
                                    {plan.plan_id} • {plan.monthly_price !== null ? `€${plan.monthly_price}/mo` : 'Contact'} • {plan.delivery_type} • {plan.activation_time}h
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

              {/* SUBSCRIBERS TAB */}
              {activeTab === 'subscribers' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Mail className="w-5 h-5 text-primary" /> Newsletter Subscribers ({subscribers.length})
                    </h2>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="text" value={subscriberSearch} onChange={e => setSubscriberSearch(e.target.value)}
                          placeholder="Search emails…"
                          className="w-full sm:w-56 pl-9 pr-8 py-2 rounded-lg bg-muted/30 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
                        {subscriberSearch && (
                          <button onClick={() => setSubscriberSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <Button variant="outline" size="sm" onClick={exportSubscribersCSV} className="gap-2 shrink-0">
                        <Download className="w-4 h-4" /> Export CSV
                      </Button>
                    </div>
                  </div>
                  {(() => {
                    const filtered = subscribers.filter(s => s.email.toLowerCase().includes(subscriberSearch.toLowerCase()));
                    return (
                      <div className="glass-strong rounded-2xl overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left p-4 font-semibold">Email</th>
                              <th className="text-left p-4 font-semibold">Subscribed</th>
                              <th className="text-right p-4 font-semibold">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filtered.map(sub => (
                              <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                <td className="p-4">{sub.email}</td>
                                <td className="p-4 text-muted-foreground">{new Date(sub.created_at).toLocaleDateString()}</td>
                                <td className="p-4 text-right">
                                  <Button variant="ghost" size="sm" onClick={() => deleteSubscriber(sub)} className="text-destructive hover:text-destructive">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {filtered.length === 0 && (
                          <p className="text-center text-muted-foreground py-8">
                            {subscriberSearch ? 'No matching subscribers' : 'No subscribers yet'}
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ACADEMY TAB */}
              {activeTab === 'academy' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Academy Courses</h2>
                    <Button onClick={() => openCourseForm()} size="sm"><Plus className="w-4 h-4 mr-2" /> Add Course</Button>
                  </div>

                  {showCourseForm && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-6">
                      <h3 className="font-bold mb-4">{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input placeholder="Title" value={courseForm.title} onChange={e => setCourseForm(f => ({ ...f, title: e.target.value }))} className="bg-muted/50" />
                        <select value={courseForm.category} onChange={e => setCourseForm(f => ({ ...f, category: e.target.value }))} className="px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none">
                          <option value="general">General</option>
                          <option value="ai-text">AI Text</option>
                          <option value="ai-image">AI Image</option>
                          <option value="ai-video">AI Video</option>
                          <option value="ai-audio">AI Audio</option>
                        </select>
                        <select value={courseForm.difficulty} onChange={e => setCourseForm(f => ({ ...f, difficulty: e.target.value }))} className="px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none">
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                        <select value={courseForm.tool_id} onChange={e => setCourseForm(f => ({ ...f, tool_id: e.target.value }))} className="px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none">
                          <option value="">No linked tool</option>
                          {tools.map(t => <option key={t.tool_id} value={t.tool_id}>{t.name}</option>)}
                        </select>
                        <Input placeholder="Price (leave empty for free)" type="number" value={courseForm.price} onChange={e => setCourseForm(f => ({ ...f, price: e.target.value }))} className="bg-muted/50" />
                        <Input placeholder="Thumbnail URL" value={courseForm.thumbnail_url} onChange={e => setCourseForm(f => ({ ...f, thumbnail_url: e.target.value }))} className="bg-muted/50" />
                        <textarea placeholder="Description" value={courseForm.description} onChange={e => setCourseForm(f => ({ ...f, description: e.target.value }))} className="sm:col-span-2 px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none min-h-[60px]" />
                        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={courseForm.is_free} onChange={e => setCourseForm(f => ({ ...f, is_free: e.target.checked }))} /> Free</label>
                        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={courseForm.is_published} onChange={e => setCourseForm(f => ({ ...f, is_published: e.target.checked }))} /> Published</label>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <Button onClick={saveCourse}>{editingCourse ? 'Update' : 'Create'}</Button>
                        <Button variant="ghost" onClick={() => setShowCourseForm(false)}>Cancel</Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Courses list */}
                  <div className="space-y-4">
                    {academyCourses.map(course => {
                      const courseLessons = academyLessons.filter(l => l.course_id === course.id);
                      const isExpanded = selectedAcademyCourse === course.id;
                      return (
                        <div key={course.id} className="glass-strong rounded-2xl overflow-hidden">
                          <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setSelectedAcademyCourse(isExpanded ? '' : course.id)}>
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${course.is_published ? 'bg-green-400' : 'bg-gray-400'}`} />
                              <div>
                                <p className="font-medium">{course.title}</p>
                                <p className="text-xs text-muted-foreground">{course.category} • {course.difficulty} • {courseLessons.length} lessons {course.is_free ? '• Free' : `• €${course.price}`}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openCourseForm(course); }}><Edit2 className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); deleteCourse(course.id); }}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                            </div>
                          </div>
                          
                          {isExpanded && (
                            <div className="px-4 pb-4 border-t border-border/50 pt-3">
                              <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-semibold">Lessons</p>
                                <Button size="sm" variant="outline" onClick={() => openLessonForm(course.id)}><Plus className="w-3 h-3 mr-1" /> Add Lesson</Button>
                              </div>
                              {courseLessons.length > 0 ? (
                                <div className="space-y-2">
                                  {courseLessons.map((lesson: any) => (
                                    <div key={lesson.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground w-6">{lesson.sort_order + 1}.</span>
                                        <span className="text-sm">{lesson.title}</span>
                                        {lesson.is_preview && <Badge className="text-[10px] bg-blue-500/20 text-blue-400 border-blue-500/30 px-1.5 py-0">Preview</Badge>}
                                        {lesson.duration && <span className="text-xs text-muted-foreground">{lesson.duration}</span>}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="sm" onClick={() => openLessonForm(course.id, lesson)}><Edit2 className="w-3 h-3" /></Button>
                                        <Button variant="ghost" size="sm" onClick={() => deleteLesson(lesson.id)}><Trash2 className="w-3 h-3 text-red-400" /></Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">No lessons yet</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {academyCourses.length === 0 && <p className="text-center text-muted-foreground py-8">No courses yet. Create your first course above.</p>}
                  </div>
                </div>
              )}

              {/* Lesson Form Modal */}
              {showLessonForm && (
                <Dialog open={showLessonForm} onOpenChange={v => !v && setShowLessonForm(false)}>
                  <DialogContent className="max-w-md border-white/10" style={{ background: 'linear-gradient(180deg, hsl(222 47% 12%) 0%, hsl(222 47% 8%) 100%)' }}>
                    <DialogHeader><DialogTitle>{editingLesson ? 'Edit Lesson' : 'Add Lesson'}</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div><Label className="text-sm">Title</Label><Input value={lessonForm.title} onChange={e => setLessonForm(f => ({ ...f, title: e.target.value }))} className="bg-white/5 border-white/10 text-white" /></div>
                      <div><Label className="text-sm">Video URL</Label><Input value={lessonForm.content_url} onChange={e => setLessonForm(f => ({ ...f, content_url: e.target.value }))} placeholder="https://..." className="bg-white/5 border-white/10 text-white" /></div>
                      <div><Label className="text-sm">Duration</Label><Input value={lessonForm.duration} onChange={e => setLessonForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g. 5:30" className="bg-white/5 border-white/10 text-white" /></div>
                      <div><Label className="text-sm">Sort Order</Label><Input type="number" value={lessonForm.sort_order} onChange={e => setLessonForm(f => ({ ...f, sort_order: Number(e.target.value) }))} className="bg-white/5 border-white/10 text-white" /></div>
                      <label className="flex items-center gap-2 text-sm text-white"><input type="checkbox" checked={lessonForm.is_preview} onChange={e => setLessonForm(f => ({ ...f, is_preview: e.target.checked }))} /> Preview (free access)</label>
                    </div>
                    <DialogFooter><Button variant="ghost" onClick={() => setShowLessonForm(false)}>Cancel</Button><Button onClick={saveLesson}>{editingLesson ? 'Update' : 'Create'}</Button></DialogFooter>
                  </DialogContent>
                </Dialog>
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
                    <p className="text-3xl font-bold">{deliveredOrders.length}</p>
                    <p className="text-sm text-muted-foreground">Delivered</p>
                  </div>
                  <div className="glass-strong rounded-2xl p-6 text-center">
                    <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                    <p className="text-3xl font-bold">{pendingOrders.length}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
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

      {/* Delivery Modal */}
      <Dialog open={deliveryModal.open} onOpenChange={open => !open && setDeliveryModal(m => ({ ...m, open: false }))}>
        <DialogContent className="max-w-md border-white/10" style={{ background: 'linear-gradient(180deg, hsl(222 47% 12%) 0%, hsl(222 47% 8%) 100%)' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Send className="w-5 h-5 text-primary" />
              Deliver Order — {deliveryModal.order?.tool?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-muted-foreground">Customer</p>
              <p className="text-sm font-medium text-white">{deliveryModal.order?.buyer_email}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-sm text-white">Login Email</Label>
              <Input id="login-email" placeholder="account@example.com" value={deliveryModal.loginEmail}
                onChange={e => setDeliveryModal(m => ({ ...m, loginEmail: e.target.value }))}
                className="bg-white/5 border-white/10 text-white" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password" className="text-sm text-white">Login Password</Label>
              <Input id="login-password" type="text" placeholder="Enter account password" value={deliveryModal.loginPassword}
                onChange={e => setDeliveryModal(m => ({ ...m, loginPassword: e.target.value }))}
                className="bg-white/5 border-white/10 text-white font-mono" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-notes" className="text-sm text-white">Notes (optional)</Label>
              <textarea id="admin-notes" placeholder="Any special instructions..." value={deliveryModal.notes}
                onChange={e => setDeliveryModal(m => ({ ...m, notes: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm min-h-[60px] focus:border-primary focus:outline-none" />
            </div>

            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-xs text-primary flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                Password will be encrypted and stored securely. Customer will be notified via email.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 mt-4">
            <Button variant="ghost" onClick={() => setDeliveryModal(m => ({ ...m, open: false }))}>Cancel</Button>
            <Button onClick={handleMarkDelivered} disabled={deliveryModal.loading} className="bg-green-600 hover:bg-green-700 gap-2">
              {deliveryModal.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Mark as Delivered
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Preview Modal */}
      <Dialog open={importPreview.show} onOpenChange={open => !open && setImportPreview(p => ({ ...p, show: false }))}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Import Summary — {importPreview.replaceExisting ? 'Replace Mode' : 'Add Mode'}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <input type="checkbox"
              checked={importPreview.payloads.length > 0 && importPreview.payloads.every(p => importPreview.selected.has(`${p.tool_id}::${p.plan_id}`))}
              onChange={toggleAllImportSelection} className="rounded" />
            <span className="text-sm font-medium">Select All ({importPreview.selected.size}/{importPreview.payloads.length})</span>
          </div>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {importPreview.toCreate.length > 0 && (
              <div>
                <p className="text-sm font-semibold flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  New ({importPreview.toCreate.filter(p => importPreview.selected.has(`${p.tool_id}::${p.plan_id}`)).length}/{importPreview.toCreate.length})
                </p>
                <div className="space-y-1">
                  {importPreview.toCreate.map((p, i) => {
                    const key = `${p.tool_id}::${p.plan_id}`;
                    return (
                      <label key={i} className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg cursor-pointer transition-opacity ${importPreview.selected.has(key) ? 'bg-green-500/10 text-green-400' : 'bg-muted/30 text-muted-foreground opacity-60'}`}>
                        <input type="checkbox" checked={importPreview.selected.has(key)} onChange={() => toggleImportSelection(key)} className="rounded" />
                        {p.tool_id} / {p.plan_id} — {p.plan_name} (${p.monthly_price ?? 'N/A'})
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
            {importPreview.toUpdate.length > 0 && (
              <div>
                <p className="text-sm font-semibold flex items-center gap-2 mb-2">
                  {importPreview.replaceExisting ? (
                    <><Edit2 className="w-4 h-4 text-blue-500" /> Update ({importPreview.toUpdate.filter(p => importPreview.selected.has(`${p.tool_id}::${p.plan_id}`)).length}/{importPreview.toUpdate.length})</>
                  ) : (
                    <><Clock className="w-4 h-4 text-yellow-500" /> Duplicate ({importPreview.toUpdate.filter(p => importPreview.selected.has(`${p.tool_id}::${p.plan_id}`)).length}/{importPreview.toUpdate.length})</>
                  )}
                </p>
                <div className="space-y-1">
                  {importPreview.toUpdate.map((p, i) => {
                    const key = `${p.tool_id}::${p.plan_id}`;
                    return (
                      <label key={i} className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg cursor-pointer transition-opacity ${importPreview.selected.has(key) ? (importPreview.replaceExisting ? 'bg-blue-500/10 text-blue-400' : 'bg-yellow-500/10 text-yellow-400') : 'bg-muted/30 text-muted-foreground opacity-60'}`}>
                        <input type="checkbox" checked={importPreview.selected.has(key)} onChange={() => toggleImportSelection(key)} className="rounded" />
                        {p.tool_id} / {p.plan_id} — {p.plan_name} (${p.monthly_price ?? 'N/A'})
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
            {importPreview.toCreate.length === 0 && importPreview.toUpdate.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">No changes detected.</p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setImportPreview(p => ({ ...p, show: false }))}>Cancel</Button>
            <Button onClick={confirmImport} disabled={importPreview.selected.size === 0}>Import {importPreview.selected.size} Plans</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
