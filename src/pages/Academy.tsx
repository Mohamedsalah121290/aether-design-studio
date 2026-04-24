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

const upcomingCourses = [
  {
    title: 'ChatGPT Mastery',
    points: ['Prompting basics', 'Automation workflows', 'Business use cases'],
  },
  {
    title: 'Canva + AI Content Creation',
    points: ['Social media design', 'AI-generated visuals', 'Templates & speed'],
  },
  {
    title: 'AI Productivity Stack',
    points: ['Notion', 'Perplexity', 'Workflow optimization'],
  },
  {
    title: 'AI Voice & Content',
    points: ['ElevenLabs', 'Voice generation', 'Content scaling'],
  },
];

const exampleLessons = [
  'How to write perfect prompts',
  'Create 10 posts in 10 minutes',
  'Automate your daily tasks',
  'Turn ideas into content using AI',
];

const trustBoosts = ['Built for beginners', 'Real use cases', 'No technical skills needed'];

const Academy = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' || i18n.language === 'ur' ? 'rtl' : 'ltr';
    window.scrollTo(0, 0);
  }, [i18n.language]);

  const handleJoinWaitingList = () => {
    toast({
      title: 'You’re on the waiting list',
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
              AI Academy <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">— Learn AI the Right Way</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Master AI tools step by step, even if you're starting from zero.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1">Courses in production</Badge>
              <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1">Launching soon</Badge>
            </div>

            <div className="flex flex-col items-center gap-3">
              <Button onClick={handleJoinWaitingList} className="gap-2">
                <Bell className="w-4 h-4" />
                Join the Waiting List
              </Button>
              <p className="text-sm text-muted-foreground">Get early access when we launch.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto mb-8">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold">Upcoming Courses</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Structured course tracks are being prepared to help you learn the tools with practical, real-world workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {upcomingCourses.map((course, index) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="bg-card rounded-2xl border border-border/50 p-6"
              >
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">Course {index + 1}</Badge>
                <h3 className="text-lg font-bold mb-4">{course.title}</h3>
                <div className="space-y-3">
                  {course.points.map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{point}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="bg-card rounded-2xl border border-border/50 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold">Example Lessons</h2>
              </div>
              <div className="space-y-3">
                {exampleLessons.map((lesson) => (
                  <div key={lesson} className="flex items-start gap-3 rounded-xl bg-muted/30 border border-border/40 p-3">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">“{lesson}”</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="bg-card rounded-2xl border border-border/50 p-6"
            >
              <h2 className="text-2xl font-bold mb-4">Why This Academy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Most people buy AI tools but never use them properly.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                AI Academy will show you exactly how to use them in real life.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-6xl mx-auto bg-card rounded-2xl border border-border/50 p-6 md:p-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {trustBoosts.map((item) => (
                <div key={item} className="rounded-xl bg-muted/30 border border-border/40 p-4 text-center">
                  <CheckCircle className="w-5 h-5 text-primary mb-3 mx-auto" />
                  <p className="text-sm font-medium">{item}</p>
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
