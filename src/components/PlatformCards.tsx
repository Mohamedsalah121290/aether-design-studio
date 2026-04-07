import { motion } from 'framer-motion';

import chatgptImg from '@/assets/platforms/chatgpt.png';
import midjourneyImg from '@/assets/platforms/midjourney.png';
import claudeImg from '@/assets/platforms/claude.png';
import geminiImg from '@/assets/platforms/gemini-official.jpg';
import canvaImg from '@/assets/platforms/canva.png';
import perplexityImg from '@/assets/platforms/perplexity.png';

interface Platform {
  name: string;
  description: string;
  url: string;
  image: string;
}

const platforms: Platform[] = [
  { name: 'ChatGPT', description: 'AI-powered conversations & content creation', url: 'https://chatgpt.com', image: chatgptImg },
  { name: 'Midjourney', description: 'Generate stunning AI artwork from text', url: 'https://www.midjourney.com', image: midjourneyImg },
  { name: 'Claude', description: 'Advanced AI assistant by Anthropic', url: 'https://claude.ai', image: claudeImg },
  { name: 'Gemini', description: "Google's multimodal AI model", url: 'https://gemini.google.com', image: geminiImg },
  { name: 'Canva', description: 'Design anything with AI-powered tools', url: 'https://www.canva.com', image: canvaImg },
  { name: 'Perplexity', description: 'AI-powered search & research engine', url: 'https://www.perplexity.ai', image: perplexityImg },
];

const PlatformCard = ({ platform, index }: { platform: Platform; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.08 }}
    className="flex flex-col items-center gap-3"
  >
    <a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${platform.name}`}
      className="group h-16 w-16 sm:h-20 sm:w-20 rounded-2xl grid place-items-center bg-muted/40 border border-border/50 relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_20px_hsl(var(--primary)/0.2)] hover:border-primary/30"
    >
      <img
        src={platform.image}
        alt={`${platform.name} logo`}
        className="w-11 h-11 sm:w-14 sm:h-14 object-contain rounded-xl relative z-10 transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        width={56}
        height={56}
      />
    </a>
    <span className="text-xs sm:text-sm text-muted-foreground font-medium">{platform.name}</span>
  </motion.div>
);

const PlatformCards = () => (
  <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 max-w-3xl mx-auto">
    {platforms.map((p, i) => (
      <PlatformCard key={p.name} platform={p} index={i} />
    ))}
  </div>
);

export default PlatformCards;
