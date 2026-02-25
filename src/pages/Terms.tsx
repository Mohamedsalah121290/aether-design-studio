import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect } from 'react';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-display font-black mb-8">Terms of Service</h1>
          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-lg">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <section className="space-y-3">
              <h2 className="text-2xl font-display font-bold text-foreground">1. Service Description</h2>
              <p>AI DEALS provides discounted access to premium AI tool subscriptions. We act as an intermediary, purchasing and managing subscriptions on your behalf or providing pre-configured accounts.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-display font-bold text-foreground">2. Account & Purchases</h2>
              <p>By purchasing a subscription, you agree to provide accurate information. Activation times vary by tool (typically within 6 hours). Subscriptions are billed monthly through Stripe.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-display font-bold text-foreground">3. Delivery Types</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Subscribe for You:</strong> We create or manage a subscription using credentials you provide.</li>
                <li><strong>Email Only:</strong> We send subscription details to your email.</li>
                <li><strong>Provide Account:</strong> We provide you with a pre-configured account with login credentials.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-display font-bold text-foreground">4. Refund Policy</h2>
              <p>Refund requests are evaluated on a case-by-case basis. If we fail to activate your subscription within the promised timeframe, you are eligible for a full refund.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-display font-bold text-foreground">5. Credential Security</h2>
              <p>All credentials you provide are encrypted with AES-256-GCM. We strongly recommend using unique passwords for tool accounts and not reusing passwords from other services.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-display font-bold text-foreground">6. Limitation of Liability</h2>
              <p>AI DEALS is not liable for changes in pricing or features by third-party AI tool providers. We are not responsible for account suspensions caused by violations of third-party terms of service.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-display font-bold text-foreground">7. Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
