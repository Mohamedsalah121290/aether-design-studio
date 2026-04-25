import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Mail, Clock, MessageSquare, Send, Globe, Shield, Youtube, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SEO from '@/components/SEO';
import KeywordCluster from '@/components/KeywordCluster';
import { ChatbotPromoSection, FACEBOOK_URL, INSTAGRAM_URL, TelegramIcon, TELEGRAM_URL, TikTokIcon, TIKTOK_URL, WhatsAppIcon, WHATSAPP_URL, X_URL, YOUTUBE_URL } from '@/components/ChatbotConversion';

const ContactPage = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: t('contact.toastMissingTitle'), description: t('contact.toastMissingDescription'), variant: 'destructive' });
      return;
    }
    setSending(true);
    const mailtoLink = `mailto:info@aideals.be?subject=${encodeURIComponent(form.subject || t('contact.mailSubject'))}&body=${encodeURIComponent(`${t('contact.mailName')}: ${form.name}\n${t('contact.mailEmail')}: ${form.email}\n\n${form.message}`)}`;
    window.open(mailtoLink, '_blank');
    toast({ title: t('contact.toastReadyTitle'), description: t('contact.toastReadyDescription') });
    setSending(false);
  };

  const supportInfo = [
    { icon: Mail, title: t('contact.support.emailTitle'), value: t('contact.support.emailValue'), description: t('contact.support.emailDesc') },
    { icon: Clock, title: t('contact.support.timeTitle'), value: t('contact.support.timeValue'), description: t('contact.support.timeDesc') },
    { icon: Shield, title: t('contact.support.privacyTitle'), value: t('contact.support.privacyValue'), description: t('contact.support.privacyDesc') },
    { icon: Globe, title: t('contact.support.globalTitle'), value: t('contact.support.globalValue'), description: t('contact.support.globalDesc') },
  ];

  const contactLinks = [
    { label: 'WhatsApp', href: WHATSAPP_URL, icon: WhatsAppIcon },
    { label: 'Telegram', href: TELEGRAM_URL, icon: TelegramIcon },
    { label: 'Facebook', href: FACEBOOK_URL, icon: Facebook },
    { label: 'Instagram', href: INSTAGRAM_URL, icon: Instagram },
    { label: 'TikTok', href: TIKTOK_URL, icon: TikTokIcon },
    { label: 'YouTube', href: YOUTUBE_URL, icon: Youtube },
    { label: 'X', href: X_URL, icon: Twitter },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO page="contact" />
      <Navbar />

      <main className="pt-32 pb-16">
        {/* Header */}
        <section className="container mx-auto px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 text-primary text-sm font-medium mb-6 glass">
              <MessageSquare className="w-4 h-4" />
              Get in Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Contact <span className="gradient-text">Us</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Have a question, suggestion, or need help? We'd love to hear from you — wherever you are in the world.
              We respond to every message <span className="text-primary font-medium">within 24 hours</span>.
            </p>
          </motion.div>
        </section>

        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-3"
            >
              <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your name"
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="bg-muted/50 border-border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="What's this about?"
                    className="bg-muted/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us how we can help..."
                    rows={5}
                    className="bg-muted/50 border-border resize-none"
                  />
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={sending}>
                  <Send className="w-4 h-4 mr-2" />
                  {sending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </motion.div>

            {/* Support Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 space-y-4"
            >
              <div className="glass rounded-2xl p-5">
                <h3 className="font-display font-bold text-sm mb-3">Contact us instantly</h3>
                <div className="flex flex-wrap gap-3">
                  {contactLinks.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl glass flex items-center justify-center hover:border-primary/30 transition-all duration-300 hover:scale-105"
                      aria-label={`Contact on ${label}`}
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>
              {supportInfo.map((info) => {
                const Icon = info.icon;
                return (
                  <div
                    key={info.title}
                    className="glass rounded-2xl p-5 flex items-start gap-4 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm mb-0.5">{info.title}</h3>
                      <p className="text-foreground text-sm font-medium">{info.value}</p>
                      <p className="text-muted-foreground text-xs mt-1">{info.description}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
        <ChatbotPromoSection />
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default ContactPage;
