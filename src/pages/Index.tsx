import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Storefront from '@/components/Storefront';
import Resources from '@/components/Resources';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const Index = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set initial direction based on language
    const currentLang = i18n.language;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <div className="min-h-screen bg-background">
      {/* SEO-optimized semantic structure */}
      <Navbar />
      
      <main>
        <Hero />
        <Storefront />
        <Resources />
        <CTA />
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
