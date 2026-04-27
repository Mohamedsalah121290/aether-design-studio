import { useState, useEffect, ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { CurrencyProvider } from "@/hooks/useCurrency";
import SeoAudit from "./pages/SeoAudit";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import StorePage from "./pages/StorePage";
import ResourcesPage from "./pages/ResourcesPage";
import Dashboard from "./pages/Dashboard";
import ContentHub from "./pages/ContentHub";
import BlogPage from "./pages/BlogPage";
import ArticlePage from "./pages/ArticlePage";
import BlogArticlePage from "./pages/BlogArticlePage";
import Academy from "./pages/Academy";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminPage from "./pages/AdminPage";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Profile from "./pages/Profile";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancelled from "./pages/PaymentCancelled";
import CartPage from "./pages/CartPage";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";
import ErrorBoundary from "./components/ErrorBoundary";
import RecentActivityToast from "./components/RecentActivityToast";
import { ChatbotSalesFlow } from "./components/ChatbotConversion";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { useTranslation } from 'react-i18next';
import "@/lib/i18n";

const queryClient = new QueryClient();

// Protected route for admin only
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading, user } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const wrap = (name: string, node: ReactNode) => (
  <ErrorBoundary name={name}>{node}</ErrorBoundary>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={wrap("Index", <Index />)} />
      <Route path="/store" element={wrap("StorePage", <StorePage />)} />
      <Route path="/resources" element={<Navigate to="/blog" replace />} />
      <Route path="/dashboard" element={wrap("Dashboard", <ProtectedRoute><Dashboard /></ProtectedRoute>)} />
      <Route path="/content-hub" element={<Navigate to="/blog" replace />} />
      <Route path="/blog" element={wrap("BlogPage", <BlogPage />)} />
      <Route path="/blog/:slug" element={wrap("BlogArticlePage", <BlogArticlePage />)} />
      <Route path="/academy" element={wrap("Academy", <Academy />)} />
      <Route path="/about" element={wrap("AboutPage", <AboutPage />)} />
      <Route path="/contact" element={wrap("ContactPage", <ContactPage />)} />
      <Route path="/article/:articleId" element={wrap("ArticlePage", <ArticlePage />)} />
      <Route path="/privacy" element={wrap("Privacy", <Privacy />)} />
      <Route path="/terms" element={wrap("Terms", <Terms />)} />
      <Route path="/profile" element={wrap("Profile", <ProtectedRoute><Profile /></ProtectedRoute>)} />
      <Route path="/cart" element={wrap("CartPage", <CartPage />)} />
      <Route path="/payment/success" element={wrap("PaymentSuccess", <PaymentSuccess />)} />
      <Route path="/payment/cancelled" element={wrap("PaymentCancelled", <PaymentCancelled />)} />
      <Route path="/payment/:toolId" element={wrap("PaymentPage", <PaymentPage />)} />
      <Route
        path="/admin"
        element={wrap(
          "AdminPage",
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        )}
      />
      <Route path="/seo-audit" element={wrap("SeoAudit", <AdminRoute><SeoAudit /></AdminRoute>)} />
      <Route path="*" element={wrap("NotFound", <NotFound />)} />
    </Routes>
  );
};

const MobileStickyCTA = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [showAtTop, setShowAtTop] = useState(false);

  useEffect(() => {
    const update = () => setShowAtTop(window.scrollY > window.innerHeight * 0.55);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [location.pathname]);

  if (location.pathname === '/store' || (location.pathname === '/' && !showAtTop)) return null;

  return (
    <Link to="/store?scrollTo=chatgpt" className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 md:hidden min-h-[56px] rounded-2xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold shadow-[0_0_28px_hsl(var(--primary)/0.35)] flex items-center justify-center gap-2 active:scale-[0.99] transition-transform" aria-label={t('store.buyNow', 'Get Instant Access')}>
      {t('store.buyNow', 'Get Instant Access')}
      <ArrowRight className="h-5 w-5" />
    </Link>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CurrencyProvider>
              <TooltipProvider>
                <SplashScreen isLoading={isLoading} />
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ErrorBoundary>
                    <AppRoutes />
                  </ErrorBoundary>
                  <RecentActivityToast />
                  <ChatbotSalesFlow />
                  <MobileStickyCTA />
                </BrowserRouter>
              </TooltipProvider>
            </CurrencyProvider>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;