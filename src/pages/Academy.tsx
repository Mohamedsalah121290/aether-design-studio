import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Bell, BookOpen, GraduationCap, Layers, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const Academy = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <SEO page="academy" />
      <Navbar />

      <main className="pt-32 pb-20">
        <section className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <GraduationCap className="h-4 w-4" />
              AI Academy
            </div>
            <h1 className="mb-4 text-6xl font-display font-black md:text-8xl text-primary" style={{ textShadow: '0 8px 0 hsl(var(--primary) / 0.16), 0 24px 50px hsl(var(--primary) / 0.35)' }}>
              {t('academy.comingSoonTitle', 'Coming Soon')}
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t('academy.comingSoonExplanation', 'AI Academy is a subscription-based learning platform where users will learn how to use the AI tools they buy from us, including ChatGPT, Perplexity AI, Canva, CapCut, ElevenLabs, Lovable, Notion, and other tools.')}
            </p>
          </motion.div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-2">
            {[
              { icon: BookOpen, title: t('academy.learnTitle', 'What you will learn'), text: t('academy.learnText', 'Practical workflows, prompts, automation ideas, content creation methods, and productivity systems for real use cases.') },
              { icon: Sparkles, title: t('academy.toolsTitle', 'Tools covered'), text: t('academy.toolsText', 'ChatGPT, Perplexity AI, Canva, CapCut, ElevenLabs, Lovable, Notion, and more tools from the AI DEALS store.') },
              { icon: Layers, title: t('academy.subscriptionTitle', 'Monthly subscription coming soon'), text: t('academy.subscriptionText', 'A simple monthly learning subscription is being prepared for customers who want structured tool training.') },
              { icon: Bell, title: t('academy.waitlistTitle', 'Join waiting list'), text: t('academy.waitlistText', 'Join the waiting list from the store or contact support to be notified when AI Academy opens.') },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <item.icon className="mb-4 h-6 w-6 text-primary" />
                <h2 className="mb-2 text-xl font-display font-bold">{item.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Academy;