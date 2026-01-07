import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { languages } from '@/lib/i18n';
import logo from '@/assets/logo.png';
const Navbar = () => {
  const {
    t,
    i18n
  } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const langMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
        setLangSearch('');
      }
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    const lang = languages.find(l => l.code === code);
    document.documentElement.dir = lang?.rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = code;
    setIsLangMenuOpen(false);
    setLangSearch('');
  };
  const filteredLanguages = languages.filter(lang => lang.name.toLowerCase().includes(langSearch.toLowerCase()) || lang.code.toLowerCase().includes(langSearch.toLowerCase()));
  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];
  const navLinks = [{
    href: '/#store',
    label: t('nav.store')
  }, {
    href: '/academy',
    label: t('nav.academy')
  }, {
    href: '/content-hub',
    label: t('nav.contentHub')
  }, {
    href: '/resources',
    label: t('nav.tutorials')
  }];
  return <motion.header initial={{
    y: -100
  }} animate={{
    y: 0
  }} transition={{
    duration: 0.5
  }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-strong py-3' : 'py-5'}`}>
      <nav className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo with Dual-tone Brand Name */}
        <motion.a href="/" className="flex items-center gap-3 group" whileHover={{
        scale: 1.02
      }}>
          {/* Logo with Neon Glow */}
          <div className="relative">
            <div className="absolute inset-0 blur-xl opacity-60">
              <img src={logo} alt="" className="h-20 w-auto" aria-hidden="true" />
            </div>
            <img alt="AI DEALS" src={logo} className="h-20 w-auto relative z-10 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-300 group-hover:drop-shadow-[0_0_35px_rgba(168,85,247,0.7)] rounded-md shadow-md" />
          </div>
          
          {/* Dual-tone Brand Name with Metallic Effect */}
          <div className="hidden sm:flex items-baseline">
            <span className="text-2xl font-display font-black tracking-tight text-primary drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]" style={{
            textShadow: '0 0 20px hsl(var(--primary) / 0.5), 0 2px 4px rgba(0,0,0,0.3)'
          }}>
              AI
            </span>
            <span className="text-2xl font-display font-black tracking-tight text-foreground ml-1" style={{
            background: 'linear-gradient(180deg, hsl(var(--foreground)) 0%, hsl(var(--muted-foreground)) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.1))'
          }}>
              DEALS
            </span>
          </div>
        </motion.a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map(link => <motion.a key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground transition-colors duration-200 relative group" whileHover={{
          y: -2
        }}>
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300" />
            </motion.a>)}
        </div>

        {/* Right Section */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Language Selector with Search */}
          <div className="relative" ref={langMenuRef}>
            <Button variant="ghost" size="sm" onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="flex items-center gap-2 text-muted-foreground" title={t('tooltips.languageSelector')}>
              <Globe className="w-4 h-4" />
              <span>{currentLang.flag}</span>
              <span className="hidden xl:inline text-xs">{currentLang.name}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </Button>

            <AnimatePresence>
              {isLangMenuOpen && <motion.div initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: 10
            }} className="absolute top-full end-0 mt-2 w-56 glass-strong rounded-xl overflow-hidden shadow-xl">
                  {/* Search Input */}
                  <div className="p-2 border-b border-border">
                    <div className="relative">
                      <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input type="text" value={langSearch} onChange={e => setLangSearch(e.target.value)} placeholder="Search..." className="w-full ps-9 pe-3 py-2 text-sm rounded-lg bg-background/50 border border-border focus:border-primary focus:outline-none" autoFocus />
                    </div>
                  </div>
                  
                  {/* Language List */}
                  <div className="max-h-64 overflow-y-auto">
                    {filteredLanguages.map(lang => <button key={lang.code} onClick={() => changeLanguage(lang.code)} className={`w-full px-4 py-2.5 text-start flex items-center gap-3 hover:bg-muted/50 transition-colors ${i18n.language === lang.code ? 'text-primary bg-primary/10' : 'text-foreground'}`}>
                        <span className="text-lg">{lang.flag}</span>
                        <span className="flex-1">{lang.name}</span>
                        {lang.rtl && <span className="text-xs text-muted-foreground">RTL</span>}
                      </button>)}
                    {filteredLanguages.length === 0 && <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                        No languages found
                      </div>}
                  </div>
                </motion.div>}
            </AnimatePresence>
          </div>

          <Button variant="heroOutline" size="sm" asChild>
            <a href="/dashboard">{t('nav.dashboard')}</a>
          </Button>
          <Button variant="hero" size="sm">
            {t('nav.getStarted')}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} exit={{
        opacity: 0,
        height: 0
      }} className="lg:hidden glass-strong border-t border-border">
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map(link => <a key={link.href} href={link.href} className="text-lg text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                  {link.label}
                </a>)}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                {languages.map(lang => <button key={lang.code} onClick={() => {
              changeLanguage(lang.code);
              setIsMobileMenuOpen(false);
            }} className={`px-3 py-2 rounded-lg text-sm ${i18n.language === lang.code ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {lang.flag} {lang.name}
                  </button>)}
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="heroOutline" className="flex-1">
                  {t('nav.dashboard')}
                </Button>
                <Button variant="hero" className="flex-1">
                  {t('nav.getStarted')}
                </Button>
              </div>
            </div>
          </motion.div>}
      </AnimatePresence>
    </motion.header>;
};
export default Navbar;