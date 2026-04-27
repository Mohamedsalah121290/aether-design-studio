import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Bell, BookOpen, GraduationCap, Layers, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-ai-models.png';

const coursePosters = [
  { tool: 'ChatGPT Mastery', description: 'Prompting, writing, research, and daily AI workflows.' },
  { tool: 'Microsoft Office + Copilot', description: 'Work faster in Word, Excel, PowerPoint, and Copilot.' },
  { tool: 'Windows Productivity', description: 'Set up Windows for speed, focus, and clean workflows.' },
  { tool: 'AI Automation Basics', description: 'Automate repetitive tasks with simple AI systems.' },
];

const Academy = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <SEO page="academy" />
      <Navbar />

      <main className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 -z-10 opacity-30">
          <img src={heroImage} alt="AI Academy robot background" className="h-full w-full object-cover object-center" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/88 to-background" />
        </div>
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

          <div className="mx-auto mt-16 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-8 text-center"
            >
              <p className="mb-3 text-xs font-bold uppercase text-primary">Course Posters</p>
              <h2 className="text-3xl font-display font-black md:text-5xl">Learning tracks opening soon</h2>
            </motion.div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {coursePosters.map((course, index) => (
                <motion.article
                  key={course.tool}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="group relative min-h-[320px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-background/40 transition-all duration-300 hover:border-primary/35 hover:bg-primary/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-70" />
                  <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-primary/20" />
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div>
                      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-background/60 text-primary shadow-lg shadow-primary/10">
                        <span className="font-display text-xl font-black">{String(index + 1).padStart(2, '0')}</span>
                      </div>
                      <h3 className="font-display text-2xl font-black leading-tight text-foreground">{course.tool}</h3>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{course.description}</p>
                    </div>
                    <Button variant="heroOutline" className="mt-8 w-full" asChild>
                      <a href="mailto:info@aideals.be?subject=Notify%20me%20about%20AI%20Academy">Notify Me</a>
                    </Button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Academy;