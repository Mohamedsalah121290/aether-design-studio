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
    className="flex flex-col items-center gap-2"
  >
    <a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${platform.name}`}
      className="h-11 w-11 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl grid place-items-center border border-[hsl(0_0%_100%/0.06)] backdrop-blur-sm relative cursor-pointer transition-transform duration-300 hover:scale-110 hover:shadow-[0_0_24px_hsl(210_100%_60%/0.25)]"
    >
      <img
        src={platform.image}
        alt={`${platform.name} logo`}
        className="w-7 h-7 sm:w-9 sm:h-9 object-contain rounded-lg"
        loading="lazy"
        width={36}
        height={36}
      />
    </a>
    <span className="text-xs text-muted-foreground font-medium">{platform.name}</span>
  </motion.div>
);

const PlatformCards = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 max-w-5xl mx-auto">
    {platforms.map((p, i) => (
      <PlatformCard key={p.name} platform={p} index={i} />
    ))}
  </div>
);

export default PlatformCards;
