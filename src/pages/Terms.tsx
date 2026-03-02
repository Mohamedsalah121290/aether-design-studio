import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, Lock, Scale, ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const Section = ({ id, title, number, children }: { id?: string; title: string; number: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(true);
  return (
    <section id={id} className="border-b border-border/50 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
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

const TOC_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'activation', label: 'Activation & Delivery' },
  { id: 'subscription', label: 'Subscription Terms' },
  { id: 'availability', label: 'Service Availability' },
  { id: 'refunds', label: 'Refunds & Credits' },
  { id: 'abuse', label: 'Abuse & Misuse' },
  { id: 'liability', label: 'Limitation of Liability' },
  { id: 'support', label: 'Support Before Dispute' },
];

const Terms = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Trust icons */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-wrap gap-3 mb-8">
            {[
              { icon: <ShieldCheck className="w-4 h-4" />, label: 'Secure Checkout' },
              { icon: <Lock className="w-4 h-4" />, label: 'No Password Sharing' },
              { icon: <Scale className="w-4 h-4" />, label: 'Fair Resolution Policy' },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-foreground">
                <span className="text-primary">{badge.icon}</span>
                {badge.label}
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
            <h1 className="text-4xl md:text-5xl font-display font-black mb-3">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: March 2, 2026</p>
          </motion.div>

          {/* Table of Contents */}
          <motion.nav variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-5 mb-10">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Table of Contents</p>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TOC_ITEMS.map((item, i) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <span className="text-xs font-mono text-primary">{i + 1}.</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </motion.nav>

          {/* Sections */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="space-y-0">
            <Section id="overview" number="01" title="Overview">
              <p>AI DEALS provides managed access to third-party software tools. We are not the original developer, publisher, or owner of those tools.</p>
              <p>Our service consists of purchasing, configuring, and managing premium tool subscriptions on your behalf, providing you with secure access credentials through your personal dashboard.</p>
            </Section>

            <Section id="activation" number="02" title="Activation & Delivery">
              <p><strong className="text-foreground">"Delivered"</strong> means your login credentials have been made available in your user dashboard and/or sent to the activation email you provided at checkout.</p>
              <p>Activation is typically completed within a few hours of purchase. However, exact timing is not guaranteed and may vary depending on the tool provider and availability.</p>
            </Section>

            <Section id="subscription" number="03" title="Subscription Terms">
              <ul className="list-disc list-inside space-y-2">
                <li>All subscriptions are billed monthly.</li>
                <li>Access is provided on an "as available" basis.</li>
                <li>Continuous or uninterrupted service cannot be guaranteed, as we depend on third-party providers.</li>
                <li>You may cancel your subscription at any time — no lock-in period applies.</li>
              </ul>
            </Section>

            <Section id="availability" number="04" title="Service Availability & Interruptions">
              <p>Third-party tool providers may experience outages, feature changes, usage restrictions, or downtime that are beyond our control.</p>
              <p>In the event of such interruptions, AI DEALS will make commercially reasonable efforts to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Restore your access as quickly as possible</li>
                <li>Provide alternative access when available</li>
                <li>Extend your subscription period when appropriate</li>
              </ul>
            </Section>

            <Section id="refunds" number="05" title="Refunds, Credits & Extensions">
              <div className="glass rounded-xl p-4 border border-primary/20 mb-4">
                <p className="text-foreground font-medium flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-primary" /> Our commitment to fairness
                </p>
                <p className="text-sm">We believe in treating every case with care. Our goal is resolution, not conflict.</p>
              </div>
              <ul className="list-disc list-inside space-y-3">
                <li>If credentials are <strong className="text-foreground">not delivered</strong>, you may request a full refund within 24 hours of purchase.</li>
                <li>Once credentials are delivered, subscriptions are generally <strong className="text-foreground">non-refundable</strong>.</li>
                <li>In case of activation failure or extended service interruption, AI DEALS may issue <strong className="text-foreground">account credit</strong>, subscription extension, or refund at its discretion.</li>
                <li>Account credit (Wallet Credit) is the primary resolution method and is applied automatically at your next checkout.</li>
                <li>Service interruptions caused by third-party providers do not automatically qualify for refunds.</li>
                <li>Depending on the situation, resolutions may include:
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-sm">
                    <li>Wallet credit (applied at next checkout)</li>
                    <li>Subscription time extension</li>
                    <li>Replacement access (when available)</li>
                    <li>Refund (in exceptional cases)</li>
                  </ul>
                </li>
                <li>All refund and credit requests are reviewed on a case-by-case basis.</li>
              </ul>
            </Section>

            <Section id="abuse" number="06" title="Abuse & Misuse">
              <p>Sharing, reselling, or redistributing account credentials provided through AI DEALS is strictly prohibited.</p>
              <p>Violation of this policy may result in immediate account termination and forfeiture of any remaining credits, extensions, or refund eligibility.</p>
            </Section>

            <Section id="liability" number="07" title="Limitation of Liability">
              <p>AI DEALS shall not be held liable for indirect, incidental, or consequential damages arising from the use of our service.</p>
              <p>Our service is provided <strong className="text-foreground">"as is"</strong> and <strong className="text-foreground">"as available"</strong> without warranties of any kind, whether express or implied.</p>
              <p>We are not responsible for changes in pricing, features, or availability made by third-party tool providers.</p>
            </Section>

            <Section id="support" number="08" title="Support Before Dispute">
              <div className="glass rounded-xl p-4 border border-primary/20">
                <p className="text-foreground font-medium mb-2">We strongly encourage you to contact our support team before filing any payment dispute or chargeback.</p>
                <p className="text-sm">Our typical response time is <strong className="text-foreground">within 24 hours</strong>. Most issues can be resolved quickly and fairly through direct communication.</p>
                <p className="text-sm mt-2">You can report issues directly from your <Link to="/dashboard" className="text-primary hover:underline">dashboard</Link> or reach us via our <Link to="/contact" className="text-primary hover:underline">contact page</Link>.</p>
              </div>
            </Section>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
