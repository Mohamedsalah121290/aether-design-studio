import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Shield, Lock, Globe, Zap, Youtube } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNewsletterSubscribe } from '@/hooks/useNewsletterSubscribe';
import { FACEBOOK_URL, INSTAGRAM_URL, openSocialUrl, WhatsAppIcon, WHATSAPP_URL, YOUTUBE_URL } from '@/components/ChatbotConversion';
import logo from '@/assets/logo.png';

type FlagKey = 'eu' | 'us' | 'sa' | 'ae' | 'tr' | 'iq' | 'lb';

const flagKeys: FlagKey[] = ['eu', 'us', 'sa', 'ae', 'tr', 'iq', 'lb'];

const FlagIcon = ({ flag }: { flag: FlagKey }) => {
  const base = 'h-full w-full rounded-[6px] shadow-[0_8px_24px_hsl(240_40%_5%/0.28)]';

  if (flag === 'eu') return (
    <svg viewBox="0 0 60 40" className={base} aria-hidden="true" focusable="false">
      <rect width="60" height="40" fill="#003399" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * Math.PI / 180;
        return <text key={i} x={30 + 10.8 * Math.cos(angle)} y={20 + 10.8 * Math.sin(angle) + 2.3} fill="#FFCC00" fontSize="5.6" textAnchor="middle">★</text>;
      })}
    </svg>
  );

  if (flag === 'us') return (
    <svg viewBox="0 0 60 40" className={base} aria-hidden="true" focusable="false">
      <rect width="60" height="40" fill="#B22234" />
      {Array.from({ length: 6 }).map((_, i) => <rect key={i} y={3.08 + i * 6.15} width="60" height="3.08" fill="#fff" />)}
      <rect width="24" height="21.54" fill="#3C3B6E" />
      {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={2.6 + (i % 6) * 3.8} cy={2.4 + Math.floor(i / 6) * 3.8} r="0.55" fill="#fff" />)}
    </svg>
  );

  if (flag === 'sa') return (
    <svg viewBox="0 0 60 40" className={base} aria-hidden="true" focusable="false">
      <rect width="60" height="40" fill="#006C35" />
      <path d="M17 25h25c2.5 0 4.5-1 5.8-2.6-1.2 4-4.2 6.2-8.7 6.2H17z" fill="#fff" />
      <rect x="18" y="28.1" width="25" height="1.7" fill="#fff" />
      <text x="30" y="18.5" fill="#fff" fontSize="7" textAnchor="middle" fontFamily="serif">لا إله إلا الله</text>
    </svg>
  );

  if (flag === 'ae') return (
    <svg viewBox="0 0 60 40" className={base} aria-hidden="true" focusable="false">
      <rect width="60" height="40" fill="#fff" />
      <rect width="60" height="13.33" fill="#009A44" />
      <rect y="26.67" width="60" height="13.33" fill="#000" />
      <rect width="16" height="40" fill="#FF0000" />
    </svg>
  );

  if (flag === 'tr') return (
    <svg viewBox="0 0 60 40" className={base} aria-hidden="true" focusable="false">
      <rect width="60" height="40" fill="#E30A17" />
      <circle cx="25" cy="20" r="9" fill="#fff" />
      <circle cx="28" cy="20" r="7.2" fill="#E30A17" />
      <text x="38" y="24.4" fill="#fff" fontSize="13" textAnchor="middle">★</text>
    </svg>
  );

  if (flag === 'iq') return (
    <svg viewBox="0 0 60 40" className={base} aria-hidden="true" focusable="false">
      <rect width="60" height="13.33" fill="#CE1126" />
      <rect y="13.33" width="60" height="13.34" fill="#fff" />
      <rect y="26.67" width="60" height="13.33" fill="#000" />
      <text x="30" y="23.4" fill="#007A3D" fontSize="8" textAnchor="middle" fontFamily="serif">الله أكبر</text>
    </svg>
  );

  return (
    <svg viewBox="0 0 60 40" className={base} aria-hidden="true" focusable="false">
      <rect width="60" height="13.33" fill="#ED1C24" />
      <rect y="13.33" width="60" height="13.34" fill="#fff" />
      <rect y="26.67" width="60" height="13.33" fill="#ED1C24" />
      <path d="M30 13.6l-3.6 7.2h2.4l-4.7 6.1h11.8l-4.7-6.1h2.4z" fill="#00A651" />
      <rect x="29.1" y="25.6" width="1.8" height="3.3" fill="#7B4B20" />
    </svg>
  );
};

const Footer = () => {
  const { t } = useTranslation();
  const newsletter = useNewsletterSubscribe();

  const footerLinks = {
    product: [
      { label: t('nav.store'), href: '/store' },
      { label: t('nav.academy'), href: '/academy' },
      { label: t('footer.links.blog'), href: '/blog' },
      { label: t('nav.dashboard'), href: '/dashboard' },
    ],
    company: [
      { label: t('nav.about'), href: '/about' },
      { label: t('footer.links.contact'), href: '/contact' },
    ],
    legal: [
      { label: t('footer.links.privacy'), href: '/privacy' },
      { label: t('footer.links.terms'), href: '/terms' },
    ],
  };

  const socialLinks = [
    { icon: WhatsAppIcon, href: WHATSAPP_URL, label: 'WhatsApp', tone: 'social-whatsapp-3d' },
    { icon: Facebook, href: FACEBOOK_URL, label: 'Facebook', tone: 'social-facebook-3d' },
    { icon: Instagram, href: INSTAGRAM_URL, label: 'Instagram', tone: 'social-instagram-3d' },
    { icon: Youtube, href: YOUTUBE_URL, label: 'YouTube', tone: 'social-youtube-3d' },
    { icon: Mail, href: 'mailto:info@aideals.be', label: 'Email info@aideals.be', tone: 'social-mail-3d' },
  ].filter((social) => Boolean(social.href));

  const trustBadges = [
    { icon: Shield, label: t('footer.trust.gdpr') },
    { icon: Lock, label: t('footer.trust.checkout') },
    { icon: Zap, label: t('footer.trust.activation') },
    { icon: Globe, label: t('footer.trust.global') },
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
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm text-sm">
              {t('footer.description')}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => !social.href.startsWith('mailto:') && openSocialUrl(event, social.href)}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className={`social-link-3d ${social.tone} w-10 h-10 rounded-xl flex items-center justify-center transition-colors`}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
              {flagKeys.map((flag) => (
                <div key={flag} className="h-5 w-7 overflow-hidden rounded-[4px] ring-1 ring-white/10">
                  <FlagIcon flag={flag} />
                </div>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-display font-bold mb-4">{t('footer.product')}</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    {link.label}
                  </Link>
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
                  <Link to={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    {link.label}
                  </Link>
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
                  <Link to={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Mini */}
          <div>
            <h4 className="font-display font-bold mb-4">{t('footer.newsletterTitle')}</h4>
            <p className="text-muted-foreground text-xs mb-3">{t('footer.newsletterText')}</p>
            <form
              onSubmit={newsletter.subscribe}
              className="flex flex-col gap-2"
            >
              <Input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                required
                value={newsletter.email}
                onChange={(e) => newsletter.setEmail(e.target.value)}
                className="bg-muted/50 border-border h-9 rounded-lg text-xs"
              />
              <Button variant="default" size="sm" type="submit" disabled={newsletter.loading} className="w-full h-9 rounded-lg text-xs">
                <Mail className="w-3 h-3 mr-1.5" />
                {newsletter.loading ? t('footer.subscribing') : t('footer.subscribe')}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI DEALS. {t('footer.rights')} ·{' '}
            <a href="mailto:info@aideals.be" className="hover:text-foreground transition-colors">
              info@aideals.be
            </a>
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              {t('footer.links.privacy')}
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              {t('footer.links.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
