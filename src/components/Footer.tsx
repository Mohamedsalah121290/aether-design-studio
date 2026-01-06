import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import logo from '@/assets/logo.png';

const Footer = () => {
  const { t } = useTranslation();

  const footerLinks = {
    product: ['Features', 'Pricing', 'Integrations', 'Changelog', 'Roadmap'],
    company: ['About', 'Blog', 'Careers', 'Press', 'Partners'],
    legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer id="about" className="relative border-t border-border">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.a
              href="/"
              className="flex items-center gap-3 mb-6 group"
              whileHover={{ scale: 1.02 }}
            >
              {/* Logo with Neon Glow */}
              <div className="relative">
                <div className="absolute inset-0 blur-xl opacity-60">
                <img 
                    src={logo} 
                    alt="" 
                    className="h-20 w-auto"
                    aria-hidden="true"
                  />
                </div>
                <img 
                  src={logo} 
                  alt="AI DEALS" 
                  className="h-20 w-auto relative z-10 drop-shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all duration-300 group-hover:drop-shadow-[0_0_40px_rgba(168,85,247,0.7)]"
                />
              </div>
              
              {/* Dual-tone Brand Name */}
              <div className="flex items-baseline">
                <span 
                  className="text-2xl font-display font-black tracking-tight text-primary drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]"
                  style={{
                    textShadow: '0 0 20px hsl(var(--primary) / 0.5), 0 2px 4px rgba(0,0,0,0.3)',
                  }}
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
            <p className="text-muted-foreground mb-6 max-w-sm">
              {t('footer.description')}
            </p>

            {/* Social Links */}
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

          {/* Product Links */}
          <div>
            <h4 className="font-display font-bold mb-4">{t('footer.product')}</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display font-bold mb-4">{t('footer.company')}</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-display font-bold mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI DEALS. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Status
            </a>
            <span>•</span>
            <a href="#" className="hover:text-foreground transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;