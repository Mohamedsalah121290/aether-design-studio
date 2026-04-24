import Navbar from '@/components/Navbar';
import Storefront from '@/components/Storefront';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SEO from '@/components/SEO';
import KeywordCluster from '@/components/KeywordCluster';

const StorePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO page="store" />
      <Navbar />
      <main className="pt-24">
        <Storefront />
        <KeywordCluster page="store" />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default StorePage;
