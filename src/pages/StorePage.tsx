import Navbar from '@/components/Navbar';
import Storefront from '@/components/Storefront';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SEO from '@/components/SEO';
import KeywordCluster from '@/components/KeywordCluster';
import { MailCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const StorePage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <SEO page="store" />
      <Navbar />
      <main className="pt-28 sm:pt-32 lg:pt-36">
        <section className="mx-auto mb-12 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/15 via-card/90 to-secondary/15 p-5 text-card-foreground shadow-[0_18px_45px_hsl(var(--primary)/0.14)] backdrop-blur-sm sm:p-6">
            <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25">
              <MailCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="text-sm leading-6 text-muted-foreground sm:text-base">
              {t('store.activationNotice', 'Activation details are sent by email. If activation is requested on a personal account, please provide the personal email and password required for that activation at checkout.')}
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
