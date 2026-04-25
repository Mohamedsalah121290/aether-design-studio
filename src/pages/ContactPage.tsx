import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Mail, Clock, MessageSquare, Send, Globe, Shield, Youtube } from 'lucide-react';
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
import { ChatbotPromoSection, Social3DLink, TelegramIcon, WhatsAppIcon } from '@/components/ChatbotConversion';
import { socialLinks } from '@/lib/socialLinks';

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
    { label: 'WhatsApp', href: socialLinks.whatsapp, icon: WhatsAppIcon, tone: 'social-whatsapp-3d' },
    { label: 'Facebook', href: socialLinks.facebook, icon: Facebook, tone: 'social-facebook-3d' },
    { label: 'Instagram', href: socialLinks.instagram, icon: Instagram, tone: 'social-instagram-3d' },
    { label: 'YouTube', href: socialLinks.youtube, icon: Youtube, tone: 'social-youtube-3d' },
    { label: 'Telegram', href: socialLinks.telegram, icon: TelegramIcon, tone: 'social-telegram-3d' },
  ].filter((link) => Boolean(link.href));

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
              {t('contact.badge')}
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {t('contact.title')} <span className="gradient-text">{t('contact.titleHighlight')}</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('contact.description')}
              {' '}{t('contact.response')} <span className="text-primary font-medium">{t('contact.responseTime')}</span>.
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
                    <Label htmlFor="name">{t('contact.name')}</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder={t('contact.namePlaceholder')}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('contact.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder={t('contact.emailPlaceholder')}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">{t('contact.subject')}</Label>
                  <Input
                    id="subject"
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder={t('contact.subjectPlaceholder')}
                    className="bg-muted/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t('contact.message')}</Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder={t('contact.messagePlaceholder')}
                    rows={5}
                    className="bg-muted/50 border-border resize-none"
                  />
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={sending}>
                  <Send className="w-4 h-4 mr-2" />
                  {sending ? t('contact.sending') : t('contact.send')}
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
                <h3 className="font-display font-bold text-sm mb-3">{t('contact.instant')}</h3>
                <div className="flex flex-wrap gap-3">
                  {contactLinks.map(({ label, href, icon: Icon, tone }) => (
                    <Social3DLink
                      key={label}
                      href={href}
                      label={t('contact.socialAria', { platform: label })}
                      tone={tone}
                      className="w-12 h-12"
                    >
                      <Icon />
                    </Social3DLink>
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
