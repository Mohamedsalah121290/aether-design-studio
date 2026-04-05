import { motion } from 'framer-motion';

import midjourneyImg from '@/assets/platforms/midjourney.jpg';
import chatgptImg from '@/assets/platforms/chatgpt.jpg';
import claudeImg from '@/assets/platforms/claude.jpg';
import geminiImg from '@/assets/platforms/gemini.jpg';
import canvaImg from '@/assets/platforms/canva.jpg';
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
  { name: 'Gemini', description: 'Google\'s multimodal AI model', url: 'https://gemini.google.com', image: geminiImg },
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
      className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl grid place-items-center border border-[hsl(0_0%_100%/0.08)] bg-[hsl(240_10%_10%/0.5)] backdrop-blur-md relative cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-[0_0_28px_hsl(210_100%_60%/0.3)] hover:border-[hsl(210_100%_60%/0.3)]"
    >
      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,hsl(210_100%_60%/0.06)_0%,transparent_70%)]" />
      <img
        src={platform.image}
        alt={`${platform.name} logo`}
        className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-lg relative z-10 drop-shadow-[0_0_6px_rgba(255,255,255,0.1)]"
        loading="lazy"
        width={48}
        height={48}
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
