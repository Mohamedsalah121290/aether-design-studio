import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const Section = ({ title, number, children }: { title: string; number: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(true);
  return (
    <section className="border-b border-border/50 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left group">
        <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-3">
          <span className="text-sm font-mono text-primary">{number}</span>
          {title}
        </h2>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pb-6 text-muted-foreground space-y-4 text-[15px] leading-relaxed">
          {children}
        </div>
      )}
    </section>
  );
};

const Privacy = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Trust icons */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-wrap gap-3 mb-8">
            {[
              { icon: <Shield className="w-4 h-4" />, label: 'Privacy-First' },
              { icon: <Lock className="w-4 h-4" />, label: 'Encrypted Storage' },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-foreground">
                <span className="text-primary">{badge.icon}</span>
                {badge.label}
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
            <h1 className="text-4xl md:text-5xl font-display font-black mb-3">Privacy Policy</h1>
            <p className="text-muted-foreground mb-10">Last updated: March 2, 2026</p>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="space-y-0">
            <Section number="01" title="Information We Collect">
              <p>We collect the minimum information necessary to operate our service:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-foreground">Email address</strong> — used for account creation, activation, and communication.</li>
                <li><strong className="text-foreground">Account information</strong> — your profile data and subscription preferences.</li>
                <li><strong className="text-foreground">Order metadata</strong> — purchase history, tool selections, and activation status.</li>
              </ul>
            </Section>

            <Section number="02" title="Information We Do NOT Collect">
              <div className="glass rounded-xl p-4 border border-primary/20">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-foreground"><Lock className="w-4 h-4 text-primary shrink-0" /> We do <strong>not</strong> collect your passwords for third-party tools.</li>
                  <li className="flex items-center gap-2 text-foreground"><Shield className="w-4 h-4 text-primary shrink-0" /> We do <strong>not</strong> store payment card data — all payments are processed securely by our payment provider (Stripe).</li>
                </ul>
              </div>
            </Section>

            <Section number="03" title="Credential Storage & Security">
              <p>Login credentials provided to you after activation are stored using <strong className="text-foreground">AES-256-GCM encryption</strong>.</p>
              <p>Only you can access your credentials through your personal dashboard after authentication. Admin access for credential delivery is logged and restricted.</p>
            </Section>

            <Section number="04" title="How We Use Your Information">
              <p>Your data is used exclusively for:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Processing and activating your tool subscriptions</li>
                <li>Managing your account and delivering credentials</li>
                <li>Communicating order updates and support responses</li>
                <li>Improving our service quality</li>
              </ul>
              <p>We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
            </Section>

            <Section number="05" title="Third-Party Services">
              <p>We use the following third-party services in our operations:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-foreground">Stripe</strong> — for secure payment processing</li>
                <li><strong className="text-foreground">AI tool providers</strong> — to fulfill your subscriptions</li>
              </ul>
              <p>Each third-party service operates under its own privacy policy. We encourage you to review their policies independently.</p>
            </Section>

            <Section number="06" title="Your Rights">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data where applicable</li>
                <li>Manage your subscriptions through your dashboard</li>
              </ul>
              <p>To exercise any of these rights, please contact us through our support channels.</p>
            </Section>

            <Section number="07" title="Data Protection Principles">
              <p>Our data handling practices are aligned with European privacy principles, including data minimization, purpose limitation, and security by design.</p>
              <p className="text-sm italic">Note: This does not constitute a formal certification or compliance claim.</p>
            </Section>

            <Section number="08" title="Contact">
              <p>For questions about this privacy policy or your personal data, please contact us through the email listed on our website or via our contact page.</p>
            </Section>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
