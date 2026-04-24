import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Bell, BookOpen, CheckCircle, GraduationCap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { toast } from '@/hooks/use-toast';

const learningPoints = [
  'How to use ChatGPT for business and daily tasks',
  'How to create content using Canva and AI tools',
  'How to automate workflows',
  'How to generate voice content using ElevenLabs',
  'How to use AI tools to save time and increase productivity',
];

const academyIncludes = [
  'Step-by-step tutorials',
  'Real use cases',
  'Practical workflows',
  'Business applications',
  'Content creation strategies',
];

const whyAcademy = [
  'Get real value from your tools',
  'Save time',
  'Increase productivity',
  'Learn faster with practical examples',
];

const Academy = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' || i18n.language === 'ur' ? 'rtl' : 'ltr';
    window.scrollTo(0, 0);
  }, [i18n.language]);

  const handleNotifyMe = () => {
    toast({
      title: 'You’re on the list',
      description: 'We’ll notify you when AI Academy launches.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO page="academy" />
      <Navbar />

      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_60%)]" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Launching Soon</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI Academy <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">— Coming Soon</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              AI Academy is an upcoming subscription-based learning platform designed to help users master the AI tools we offer.
            </p>

            <div className="flex flex-col items-center gap-3">
              <Button onClick={handleNotifyMe} className="gap-2">
                <Bell className="w-4 h-4" />
                Notify Me
              </Button>
              <p className="text-sm text-muted-foreground">Be the first to access AI Academy when it launches.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border border-border/50 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-primary/10 text-primary border-primary/20">Coming Soon</Badge>
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Built around the tools you use</h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                It will include practical lessons focused on tools like ChatGPT, Canva, Perplexity, ElevenLabs, and more.
              </p>
              <div className="space-y-3">
                {academyIncludes.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="bg-card rounded-2xl border border-border/50 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold">What you will learn</h2>
              </div>
              <div className="space-y-3">
                {learningPoints.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl bg-muted/30 border border-border/40 p-3">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="max-w-6xl mx-auto bg-card rounded-2xl border border-border/50 p-6 md:p-8"
          >
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Why AI Academy?</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Most people buy AI tools but don’t know how to fully use them.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {whyAcademy.map((item) => (
                <div key={item} className="rounded-xl bg-muted/30 border border-border/40 p-4">
                  <CheckCircle className="w-5 h-5 text-primary mb-3" />
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Academy;
