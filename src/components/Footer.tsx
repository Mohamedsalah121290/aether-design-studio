import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Shield, Lock, Globe, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNewsletterSubscribe } from '@/hooks/useNewsletterSubscribe';
import logo from '@/assets/logo.png';

const Footer = () => {
  const { t } = useTranslation();
  const newsletter = useNewsletterSubscribe();

  const footerLinks = {
    product: [
      { label: t('nav.store'), href: '/store' },
      { label: t('nav.academy'), href: '/academy' },
      { label: 'Blog', href: '/blog' },
      { label: t('nav.dashboard'), href: '/dashboard' },
    ],
    company: [
      { label: t('nav.about'), href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    legal: [
      { label: t('footer.links.privacy'), href: '/privacy' },
      { label: t('footer.links.terms'), href: '/terms' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  const trustBadges = [
    { icon: Shield, label: 'GDPR-Friendly' },
    { icon: Lock, label: 'Secure Checkout' },
    { icon: Zap, label: 'Fast Activation' },
    { icon: Globe, label: 'Built in Europe · Global Access' },
  ];

  return (
    <footer className="relative border-t border-border">
      <div className="absolute inset-0 mesh-gradient opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Trust Badges */}
        <div className="py-6 border-b border-border/50">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-muted-foreground">
                <Icon className="w-4 h-4 text-primary/60" />
                <span className="text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 blur-xl opacity-60">
                  <img src={logo} alt="" className="h-20 w-auto" aria-hidden="true" />
                </div>
                <img
                  alt="AI DEALS"
                  src="/lovable-uploads/64d447c1-4f6f-4d56-8e09-a6f5cc5a84e0.png"
                  className="h-20 w-auto relative z-10 drop-shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all duration-300 group-hover:drop-shadow-[0_0_40px_rgba(168,85,247,0.7)] border-solid rounded-md shadow-md"
                />
              </div>
              <div className="flex items-baseline">
                <span
                  className="text-2xl font-display font-black tracking-tight text-primary drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]"
                  style={{ textShadow: '0 0 20px hsl(var(--primary) / 0.5), 0 2px 4px rgba(0,0,0,0.3)' }}
                >
                  AI
                </span>
                <span
                  className="text-2xl font-display font-black tracking-tight text-foreground ml-1"
                  style={{
                    background: 'linear-gradient(180deg, hsl(var(--foreground)) 0%, hsl(var(--muted-foreground)) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  DEALS
                </span>
              </div>
            </motion.a>
            <p className="text-muted-foreground mb-6 max-w-sm text-sm">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-display font-bold mb-4">{t('footer.product')}</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-bold mb-4">{t('footer.company')}</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-bold mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Mini */}
          <div>
            <h4 className="font-display font-bold mb-4">Stay Updated</h4>
            <p className="text-muted-foreground text-xs mb-3">Weekly AI tips for students & creators.</p>
            <form
              onSubmit={newsletter.subscribe}
              className="flex flex-col gap-2"
            >
              <Input
                type="email"
                placeholder="your@email.com"
                required
                value={newsletter.email}
                onChange={(e) => newsletter.setEmail(e.target.value)}
                className="bg-muted/50 border-border h-9 rounded-lg text-xs"
              />
              <Button variant="default" size="sm" type="submit" disabled={newsletter.loading} className="w-full h-9 rounded-lg text-xs">
                <Mail className="w-3 h-3 mr-1.5" />
                {newsletter.loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI DEALS. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <span>•</span>
            <a href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
