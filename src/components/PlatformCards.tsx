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
    className="group/card relative rounded-2xl overflow-hidden backdrop-blur-md transition-shadow duration-300 hover:shadow-[0_8px_40px_hsl(210_100%_55%/0.10)]"
    style={{
      background: 'rgba(20, 20, 35, 0.45)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}
  >
    {/* Image — only clickable part */}
    <div className="flex items-center justify-center p-6 pb-2">
      <a
        href={platform.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${platform.name}`}
        className="relative block w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-110 hover:shadow-[0_0_24px_hsl(210_100%_60%/0.25)]"
      >
        <img
          src={platform.image}
          alt={`${platform.name} logo`}
          className="w-full h-full object-contain transition-[filter] duration-300 hover:brightness-110"
          loading="lazy"
          width={96}
          height={96}
        />
      </a>
    </div>

    {/* Text — not clickable */}
    <div className="p-4 pt-2 text-center">
      <h3 className="text-base sm:text-lg font-bold text-foreground font-display tracking-tight">
        {platform.name}
      </h3>
      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
        {platform.description}
      </p>
    </div>
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
