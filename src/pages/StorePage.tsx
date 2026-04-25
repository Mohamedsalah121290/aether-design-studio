import Navbar from '@/components/Navbar';
import Storefront from '@/components/Storefront';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SEO from '@/components/SEO';
import KeywordCluster from '@/components/KeywordCluster';
import { MailCheck } from 'lucide-react';

const StorePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO page="store" />
      <Navbar />
      <main className="pt-20 sm:pt-22 lg:pt-24">
        <section className="mx-auto mb-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-card/70 p-4 text-card-foreground shadow-sm backdrop-blur-sm">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MailCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="text-sm leading-6 text-muted-foreground sm:text-base">
              Activation by e-mail and password is sent, and if we activate a personal e-mail, bloom as a difference, you must send a personal e-mail and a personal password at the top of the page
            </p>
          </div>
        </section>
        <Storefront />
        <KeywordCluster page="store" />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default StorePage;
