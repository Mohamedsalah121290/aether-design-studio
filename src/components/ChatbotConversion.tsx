import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, ChevronRight, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import robotAvatar from '@/assets/ai-deals-robot-avatar.png';

export const WHATSAPP_URL = 'https://web.whatsapp.com/';
export const TELEGRAM_URL = '#telegram-link-needed';

export const WhatsAppIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
    <path fill="#25D366" d="M16.04 3.2C9.02 3.2 3.3 8.9 3.3 15.9c0 2.23.58 4.4 1.69 6.31L3.2 28.8l6.74-1.77a12.68 12.68 0 0 0 6.1 1.55h.01c7.02 0 12.73-5.7 12.73-12.7S23.07 3.2 16.04 3.2Z" />
    <path fill="#ffffff" d="M23.45 19.13c-.4-.2-2.36-1.16-2.72-1.3-.37-.13-.63-.2-.9.2-.27.4-1.03 1.3-1.27 1.56-.23.27-.47.3-.86.1-.4-.2-1.68-.62-3.2-1.97-1.18-1.06-1.98-2.36-2.21-2.76-.23-.4-.03-.61.17-.81.18-.18.4-.47.6-.7.2-.24.27-.4.4-.67.14-.27.07-.5-.03-.7-.1-.2-.9-2.17-1.23-2.97-.32-.78-.65-.67-.9-.68h-.76c-.27 0-.7.1-1.06.5-.37.4-1.4 1.36-1.4 3.32s1.43 3.86 1.63 4.12c.2.27 2.81 4.3 6.82 6.03.95.41 1.7.66 2.28.84.96.3 1.83.26 2.52.16.77-.12 2.36-.96 2.7-1.9.33-.93.33-1.73.23-1.9-.1-.16-.36-.26-.8-.47Z" />
  </svg>
);

export const TelegramIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
    <circle cx="16" cy="16" r="13" fill="#229ED9" />
    <path fill="#ffffff" d="M22.74 9.78 20.5 22.04c-.17.87-.63 1.08-1.27.67l-3.5-2.58-1.69 1.63c-.19.19-.35.35-.72.35l.26-3.6 6.56-5.93c.28-.25-.06-.4-.44-.14l-8.1 5.1-3.49-1.09c-.76-.24-.77-.76.16-1.12l13.64-5.26c.63-.24 1.18.14.87 1.7Z" />
  </svg>
);

const RobotAvatar = ({ className = 'w-9 h-9' }: { className?: string }) => (
  <img
    src={robotAvatar}
    alt="AI Deals Assistant robot avatar"
    width={1024}
    height={1024}
    loading="lazy"
    className={`${className} rounded-full object-cover border border-primary/30 shadow-[0_0_18px_hsl(var(--primary)/0.35)]`}
  />
);

const bullets = ['Instant replies', 'Works in multiple languages', '24/7 availability', 'Works across all platforms', 'Increases conversions'];

const flows = {
  content: {
    label: 'Content',
    intro: 'For content, start with tools that reduce daily creation work.',
    products: [
      { name: 'ChatGPT Plus', id: 'chatgpt', desc: 'For writing, ideas, and customer replies.', benefits: ['Faster drafts', 'Better prompts', 'Useful for daily work'] },
      { name: 'Canva Pro', id: 'canva', desc: 'For visuals, posts, and brand assets.', benefits: ['Ready templates', 'Fast edits', 'Works on multiple devices'] },
      { name: 'CapCut Pro', id: 'capcut', desc: 'For short videos and social content.', benefits: ['Quicker editing', 'Creator-friendly', 'Practical export tools'] },
    ],
  },
  work: {
    label: 'Work',
    intro: 'For work, focus on tools that save time every week.',
    products: [
      { name: 'Microsoft 365', id: 'microsoft_365', desc: 'For documents, email, and productivity.', benefits: ['Office apps', 'Cloud workflow', 'Business-ready'] },
      { name: 'Notion', id: 'notion', desc: 'For planning, notes, and team organization.', benefits: ['Clear workspace', 'Better planning', 'Simple collaboration'] },
      { name: 'LinkedIn Premium', id: 'linkedin', desc: 'For job search, networking, and insights.', benefits: ['More visibility', 'Career tools', 'Useful search filters'] },
    ],
  },
  ai: {
    label: 'AI tools',
    intro: 'For AI tools, choose based on the result you want first.',
    products: [
      { name: 'ChatGPT Plus', id: 'chatgpt', desc: 'Best first AI assistant for everyday tasks.', benefits: ['Writing help', 'Research support', 'Automation ideas'] },
      { name: 'Perplexity Pro', id: 'perplexity', desc: 'For research and fast answers with sources.', benefits: ['Clear sources', 'Fast research', 'Good for decisions'] },
      { name: 'ElevenLabs', id: 'elevenlabs', desc: 'For realistic voice and audio projects.', benefits: ['Voice creation', 'Multiple languages', 'Content-ready audio'] },
    ],
  },
  unsure: {
    label: 'Not sure',
    intro: 'If you are not sure, pick the tool that solves the most problems first.',
    products: [
      { name: 'ChatGPT Plus', id: 'chatgpt', desc: 'The safest starting point for most users.', benefits: ['Easy to start', 'Many use cases', 'Strong daily value'] },
      { name: 'Canva Pro', id: 'canva', desc: 'Best if you create visual content.', benefits: ['Simple design', 'Fast output', 'Good for business posts'] },
      { name: 'Perplexity Pro', id: 'perplexity', desc: 'Best if you research before buying or working.', benefits: ['Source-based answers', 'Saves time', 'Less browsing'] },
    ],
  },
} as const;

type FlowKey = keyof typeof flows;

export const ChatbotPromoSection = () => (
  <section className="py-24 relative overflow-hidden" id="chatbot-promo">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="glass rounded-3xl p-8 md:p-12 max-w-5xl mx-auto"
      >
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 text-primary text-sm font-medium mb-6 glass">
              <RobotAvatar className="w-5 h-5" />
              AI Chatbot
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-5 leading-tight">
              Your AI Assistant That <span className="gradient-text">Never Sleeps</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-7">
              Reply to customers instantly, 24/7, on your website, WhatsApp, and Telegram.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {bullets.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-foreground">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/store">Activate Chatbot</Link>
              </Button>
              <p className="text-xs text-muted-foreground">No missed messages. No lost customers.</p>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="rounded-2xl border border-border bg-muted/20 p-5 space-y-3"
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MessageCircle className="w-4 h-4 text-primary" />
              Live sales flow preview
            </div>
            {['What are you looking for?', 'AI tools', 'Best start: ChatGPT Plus for daily writing, support, and workflows.', 'Do you want the access link?'].map((line, index) => (
              <div key={line} className={`rounded-xl px-4 py-3 text-sm ${index % 2 ? 'bg-primary/10 text-foreground ms-8' : 'bg-white/[0.04] text-muted-foreground me-8'}`}>
                {line}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
);

export const ChatbotSalesFlow = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<FlowKey | null>(null);

  const handleTelegramClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (TELEGRAM_URL.startsWith('#')) event.preventDefault();
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="w-[calc(100vw-2rem)] max-w-sm glass-strong rounded-2xl border border-border overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <RobotAvatar />
                <div>
                  <p className="text-sm font-semibold text-foreground">AI Deals Assistant</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" />Online</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-xl hover:bg-muted/50 grid place-items-center transition-colors" aria-label="Close chatbot">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex items-start gap-2">
                <RobotAvatar className="w-8 h-8 shrink-0" />
                <div className="rounded-xl bg-white/[0.04] px-4 py-3 text-sm text-foreground">
                  <p>Hi 👋</p>
                  <p>I’m your AI assistant.</p>
                  <p>Tell me what you need and I’ll help you choose the best tool.</p>
                </div>
              </div>
              <p className="text-sm font-medium text-foreground">What are you looking for?</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(flows) as FlowKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelected(key)}
                    className={`rounded-xl border px-3 py-2 text-sm transition-all text-start ${selected === key ? 'border-primary/40 bg-primary/10 text-foreground' : 'border-border bg-muted/20 text-muted-foreground hover:text-foreground hover:border-primary/30'}`}
                  >
                    {flows[key].label}
                  </button>
                ))}
              </div>

              {selected && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div className="flex items-start gap-2">
                    <RobotAvatar className="w-7 h-7 shrink-0" />
                    <p className="rounded-xl bg-white/[0.04] px-3 py-2 text-xs text-muted-foreground">{flows[selected].intro}</p>
                  </div>
                  {flows[selected].products.map((product) => (
                    <div key={product.id} className="rounded-xl border border-border bg-muted/20 p-3">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">{product.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{product.desc}</p>
                        </div>
                        <Link to={`/store?scrollTo=${product.id}`} onClick={() => setOpen(false)} className="text-primary hover:text-foreground transition-colors" aria-label={`Open ${product.name}`}>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                      <ul className="space-y-1 mb-3">
                        {product.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <CheckCircle className="w-3 h-3 text-primary shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                      <p className="text-[11px] text-muted-foreground mb-3">Price is shown clearly in EUR before checkout — focus on saved time and practical access.</p>
                      <Button variant="heroOutline" size="sm" asChild className="w-full">
                        <Link to={`/store?scrollTo=${product.id}`} onClick={() => setOpen(false)}>Do you want the access link?</Link>
                      </Button>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <motion.a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.96 }} className="w-11 h-11 rounded-xl glass flex items-center justify-center border border-border hover:border-primary/30 transition-colors" aria-label="Contact on WhatsApp">
          <WhatsAppIcon />
        </motion.a>
        <motion.a href={TELEGRAM_URL} onClick={handleTelegramClick} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.96 }} className="w-11 h-11 rounded-xl glass flex items-center justify-center border border-border hover:border-primary/30 transition-colors" aria-label="Contact on Telegram">
          <TelegramIcon />
        </motion.a>
        <motion.button onClick={() => setOpen((value) => !value)} whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.96 }} className="h-12 px-4 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center gap-2 text-sm font-semibold transition-all" aria-label="Open AI Deals chatbot">
          {open ? <X className="w-4 h-4" /> : <RobotAvatar className="w-8 h-8" />}
          <span className="hidden sm:inline">Start Now</span>
        </motion.button>
      </div>
    </div>
  );
};
