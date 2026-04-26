import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const Academy = () => {
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
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <GraduationCap className="h-4 w-4" />
              AI Academy
            </div>
            <h1 className="mb-6 text-4xl font-display font-bold md:text-6xl">AI Academy</h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Coming Soon — we are preparing high-quality AI tutorials and courses to help you use these tools professionally.
            </p>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Academy;