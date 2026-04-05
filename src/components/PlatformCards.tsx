import { motion } from 'framer-motion';
import { useState } from 'react';

interface Platform {
  name: string;
  description: string;
  url: string;
  logo: string;
  fallbackLetter: string;
}

const platforms: Platform[] = [
  {
    name: 'ChatGPT',
    description: 'AI-powered conversations & content creation',
    url: 'https://chatgpt.com',
    logo: 'https://cdn.oaistatic.com/assets/favicon-o20kmmos.svg',
    fallbackLetter: 'G',
  },
  {
    name: 'Midjourney',
    description: 'Generate stunning AI artwork from text',
    url: 'https://www.midjourney.com',
    logo: 'https://cdn.midjourney.com/favicon.ico',
    fallbackLetter: 'M',
  },
  {
    name: 'Claude',
    description: 'Advanced AI assistant by Anthropic',
    url: 'https://claude.ai',
    logo: 'https://claude.ai/images/claude_app_icon.png',
    fallbackLetter: 'C',
  },
  {
    name: 'Gemini',
    description: "Google's multimodal AI model",
    url: 'https://gemini.google.com',
    logo: 'https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06b.png',
    fallbackLetter: 'G',
  },
  {
    name: 'Canva',
    description: 'Design anything with AI-powered tools',
    url: 'https://www.canva.com',
    logo: 'https://static.canva.com/static/images/canva-logo-blue.svg',
    fallbackLetter: 'C',
  },
  {
    name: 'Perplexity',
    description: 'AI-powered search & research engine',
    url: 'https://www.perplexity.ai',
    logo: 'https://www.perplexity.ai/favicon.svg',
    fallbackLetter: 'P',
  },
];

const FallbackIcon = ({ letter }: { letter: string }) => (
  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/20 grid place-items-center relative z-10">
    <span className="text-lg sm:text-xl font-bold text-primary">{letter}</span>
  </div>
);

const PlatformCard = ({ platform, index }: { platform: Platform; index: number }) => {
  const [imgError, setImgError] = useState(false);

  return (
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
        {imgError ? (
          <FallbackIcon letter={platform.fallbackLetter} />
        ) : (
          <img
            src={platform.logo}
            alt={`${platform.name} logo`}
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-lg relative z-10 drop-shadow-[0_0_6px_rgba(255,255,255,0.1)]"
            loading="lazy"
            width={48}
            height={48}
            onError={() => setImgError(true)}
          />
        )}
      </a>
      <span className="text-xs sm:text-sm text-muted-foreground font-medium">{platform.name}</span>
    </motion.div>
  );
};

const PlatformCards = () => (
  <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 max-w-3xl mx-auto">
    {platforms.map((p, i) => (
      <PlatformCard key={p.name} platform={p} index={i} />
    ))}
  </div>
);

export default PlatformCards;
