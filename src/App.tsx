import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ResourcesPage from "./pages/ResourcesPage";
import Dashboard from "./pages/Dashboard";
import ContentHub from "./pages/ContentHub";
import ArticlePage from "./pages/ArticlePage";
import Academy from "./pages/Academy";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";
import "@/lib/i18n";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load time for splash screen
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SplashScreen isLoading={isLoading} />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/content-hub" element={<ContentHub />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/article/:articleId" element={<ArticlePage />} />
            <Route path="/admin" element={<AdminPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;