import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const Privacy = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-display font-black mb-8">Privacy Policy</h1>
          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-lg">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <section className="space-y-3">
              <h2 className="text-2xl font-display font-bold text-foreground">1. Information We Collect</h2>
              <p>We collect information you provide directly, including your email address when creating an account, payment information processed securely through Stripe, and any credentials you provide for tool subscription services.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-display font-bold text-foreground">2. How We Use Your Information</h2>
              <p>We use your information to process purchases and manage subscriptions, provide access to AI tool subscriptions, communicate order status and account updates, and improve our services.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-display font-bold text-foreground">3. Data Security</h2>
              <p>We implement industry-standard security measures to protect your data. Credentials are encrypted using AES-256-GCM encryption. Payment processing is handled securely by Stripe — we never store your card details.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-display font-bold text-foreground">4. Third-Party Services</h2>
              <p>We use Stripe for payment processing and various AI tool providers to fulfill subscriptions. Each third-party service has its own privacy policy governing data handling.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-display font-bold text-foreground">5. Your Rights</h2>
              <p>You may request access to, correction, or deletion of your personal data at any time by contacting us. You can also manage your subscriptions through your dashboard.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-display font-bold text-foreground">6. Contact Us</h2>
              <p>For questions about this privacy policy, please contact us through the email listed on our website.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
