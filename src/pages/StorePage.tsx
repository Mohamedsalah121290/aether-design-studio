import Navbar from '@/components/Navbar';
import Storefront from '@/components/Storefront';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const StorePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        <Storefront />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default StorePage;
