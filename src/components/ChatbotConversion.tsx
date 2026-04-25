import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, ChevronRight, Mic, MessageCircle, Send, Volume2, VolumeX, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import robotAvatar from '@/assets/ai-deals-robot-avatar.webp';

export const WHATSAPP_URL = 'https://web.whatsapp.com/';
export const TELEGRAM_URL = '#telegram-link-needed';

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

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

const supported = ['en', 'fr', 'nl', 'de', 'es', 'it', 'ar'] as const;
type LangKey = typeof supported[number];
type FlowKey = 'ai' | 'design' | 'productivity' | 'unsure';
type IntentKey = 'student' | 'creator' | 'business';
type Message = { id: number; role: 'bot' | 'user'; text: string; products?: Product[] };
type Product = { name: string; id: string; desc: string; benefits: string[] };

const copy: Record<LangKey, {
  dir: 'ltr' | 'rtl'; flag: string; voice: string[]; greeting: string; question: string; input: string; access: string; price: string; labels: Record<FlowKey, string>; intros: Record<FlowKey, string>;
}> = {
  en: { dir: 'ltr', flag: 'EN', voice: ['en-GB', 'en-US'], greeting: 'Hi 👋 Want me to find the best deal for you?', question: 'Choose what helps you most:', input: 'Type your message...', access: 'Get access', price: 'Price is shown in EUR before checkout. Focus on saved time and practical access.', labels: { ai: 'Best Deal', design: 'Compare', productivity: 'Cheapest', unsure: 'Help me choose' }, intros: { ai: 'Best deals people choose most often.', design: 'Here are strong tools to compare side by side.', productivity: 'Lowest-friction options to start today.', unsure: 'Start with the most useful tools.' } },
  fr: { dir: 'ltr', flag: 'FR', voice: ['fr-FR', 'fr-BE'], greeting: 'Salut 👋 Voulez-vous que je trouve la meilleure offre pour vous ?', question: 'Choisissez ce qui vous aide le plus :', input: 'Écrivez votre message...', access: 'Obtenir l’accès', price: 'Le prix est affiché en EUR avant le paiement. Pensez gain de temps et accès utile.', labels: { ai: 'Meilleures offres', design: 'Comparer', productivity: 'Option moins chère', unsure: 'Aidez-moi' }, intros: { ai: 'Les offres les plus choisies.', design: 'Voici des outils forts à comparer.', productivity: 'Options simples pour commencer aujourd’hui.', unsure: 'Commencez avec les outils les plus utiles.' } },
  nl: { dir: 'ltr', flag: 'NL', voice: ['nl-BE', 'nl-NL'], greeting: 'Hoi 👋 Zal ik de beste deal voor je vinden?', question: 'Kies wat je het meest helpt:', input: 'Typ je bericht...', access: 'Krijg toegang', price: 'De prijs staat in EUR vóór checkout. Denk aan tijdwinst en praktische toegang.', labels: { ai: 'Beste deals', design: 'Vergelijk tools', productivity: 'Goedkoopste optie', unsure: 'Help kiezen' }, intros: { ai: 'De meest gekozen deals.', design: 'Sterke tools om te vergelijken.', productivity: 'Snelle opties om vandaag te starten.', unsure: 'Start met de meest nuttige tools.' } },
  de: { dir: 'ltr', flag: 'DE', voice: ['de-DE'], greeting: 'Hi 👋 Soll ich den besten Deal für dich finden?', question: 'Wähle, was dir am meisten hilft:', input: 'Nachricht eingeben...', access: 'Zugang erhalten', price: 'Der Preis wird vor dem Checkout in EUR angezeigt. Es geht um Zeitersparnis und praktischen Zugang.', labels: { ai: 'Beste Deals', design: 'Tools vergleichen', productivity: 'Günstigste Option', unsure: 'Hilf mir wählen' }, intros: { ai: 'Die meistgewählten Deals.', design: 'Starke Tools zum Vergleichen.', productivity: 'Einfache Optionen für heute.', unsure: 'Starte mit den nützlichsten Tools.' } },
  es: { dir: 'ltr', flag: 'ES', voice: ['es-ES'], greeting: 'Hola 👋 ¿Quieres que encuentre la mejor oferta para ti?', question: 'Elige lo que más te ayuda:', input: 'Escribe tu mensaje...', access: 'Obtener acceso', price: 'El precio se muestra en EUR antes del pago. Piensa en ahorro de tiempo y acceso práctico.', labels: { ai: 'Mejores ofertas', design: 'Comparar tools', productivity: 'Opción barata', unsure: 'Ayúdame' }, intros: { ai: 'Las ofertas más elegidas.', design: 'Herramientas fuertes para comparar.', productivity: 'Opciones simples para empezar hoy.', unsure: 'Empieza con las herramientas más útiles.' } },
  it: { dir: 'ltr', flag: 'IT', voice: ['it-IT'], greeting: 'Ciao 👋 Vuoi che trovi l’offerta migliore per te?', question: 'Scegli cosa ti aiuta di più:', input: 'Scrivi il tuo messaggio...', access: 'Ottieni accesso', price: 'Il prezzo è mostrato in EUR prima del checkout. Conta il tempo risparmiato e l’accesso pratico.', labels: { ai: 'Migliori offerte', design: 'Confronta tool', productivity: 'Opzione economica', unsure: 'Aiutami' }, intros: { ai: 'Le offerte più scelte.', design: 'Strumenti forti da confrontare.', productivity: 'Opzioni semplici per iniziare oggi.', unsure: 'Inizia dagli strumenti più utili.' } },
  ar: { dir: 'rtl', flag: 'AR', voice: ['ar-SA', 'ar'], greeting: 'مرحباً 👋 هل تريد أن أجد لك أفضل عرض؟', question: 'اختر ما يناسبك:', input: 'اكتب رسالتك...', access: 'احصل على الوصول', price: 'السعر يظهر باليورو قبل الدفع. ركّز على الوقت الذي ستوفره والقيمة العملية.', labels: { ai: 'أفضل العروض', design: 'قارن الأدوات', productivity: 'الأرخص', unsure: 'ساعدني أختار' }, intros: { ai: 'هذه أكثر العروض طلباً.', design: 'هذه أدوات قوية للمقارنة.', productivity: 'خيارات سهلة لتبدأ اليوم.', unsure: 'ابدأ بالأدوات الأكثر فائدة.' } },
};

const products: Record<FlowKey, Product[]> = {
  ai: [
    { name: 'ChatGPT Plus', id: 'chatgpt', desc: 'Everyday AI assistant.', benefits: ['Writing help', 'Research support', 'Workflow ideas'] },
    { name: 'Perplexity Pro', id: 'perplexity', desc: 'Fast research with sources.', benefits: ['Clear sources', 'Quick answers', 'Good for decisions'] },
    { name: 'ElevenLabs', id: 'elevenlabs', desc: 'Voice and audio creation.', benefits: ['Natural voices', 'Multiple languages', 'Content-ready audio'] },
  ],
  design: [
    { name: 'Canva Pro', id: 'canva', desc: 'Design posts and assets faster.', benefits: ['Ready templates', 'Fast edits', 'Works on devices'] },
    { name: 'CapCut Pro', id: 'capcut', desc: 'Short video editing.', benefits: ['Quick editing', 'Creator tools', 'Easy exports'] },
    { name: 'ElevenLabs', id: 'elevenlabs', desc: 'AI voiceovers for content.', benefits: ['Realistic voice', 'Multilingual', 'Fast production'] },
  ],
  productivity: [
    { name: 'Microsoft 365', id: 'microsoft_365', desc: 'Work documents and cloud tools.', benefits: ['Office apps', 'Cloud workflow', 'Business-ready'] },
    { name: 'Notion', id: 'notion', desc: 'Plan, write, and organize.', benefits: ['Clear workspace', 'Better planning', 'Team-friendly'] },
    { name: 'Zoom Pro', id: 'zoom', desc: 'Reliable meetings.', benefits: ['Stable calls', 'Meeting tools', 'Professional setup'] },
  ],
  unsure: [
    { name: 'ChatGPT Plus', id: 'chatgpt', desc: 'Best first AI tool.', benefits: ['Easy start', 'Many use cases', 'Daily value'] },
    { name: 'Canva Pro', id: 'canva', desc: 'Best for visual content.', benefits: ['Simple design', 'Fast output', 'Business posts'] },
    { name: 'Perplexity Pro', id: 'perplexity', desc: 'Best for research.', benefits: ['Source-based', 'Saves time', 'Less browsing'] },
  ],
};

const funnelMessages: Record<IntentKey, { flow: FlowKey; text: Record<LangKey, string> }> = {
  student: { flow: 'ai', text: { en: 'Want help with studying tools?', fr: 'Besoin d’aide pour choisir des outils d’étude ?', nl: 'Hulp nodig met studietools?', de: 'Brauchst du Hilfe mit Lern-Tools?', es: '¿Quieres ayuda con herramientas de estudio?', it: 'Vuoi aiuto con gli strumenti per studiare?', ar: 'هل تريد مساعدة في اختيار أدوات الدراسة؟' } },
  creator: { flow: 'design', text: { en: 'Need help creating content?', fr: 'Besoin d’aide pour créer du contenu ?', nl: 'Hulp nodig bij content maken?', de: 'Brauchst du Hilfe beim Erstellen von Content?', es: '¿Necesitas ayuda para crear contenido?', it: 'Ti serve aiuto per creare contenuti?', ar: 'هل تحتاج مساعدة في إنشاء المحتوى؟' } },
  business: { flow: 'productivity', text: { en: 'Want to automate your workflow?', fr: 'Vous voulez automatiser votre workflow ?', nl: 'Wil je je workflow automatiseren?', de: 'Möchtest du deinen Workflow automatisieren?', es: '¿Quieres automatizar tu flujo de trabajo?', it: 'Vuoi automatizzare il tuo workflow?', ar: 'هل تريد أتمتة سير عملك؟' } },
};

const productLocale: Record<LangKey, Record<string, Pick<Product, 'desc' | 'benefits'>>> = {
  en: {},
  fr: { chatgpt: { desc: 'Assistant IA pour tous les jours.', benefits: ['Aide à l’écriture', 'Recherche plus rapide', 'Idées de workflow'] }, perplexity: { desc: 'Recherche rapide avec sources.', benefits: ['Sources claires', 'Réponses rapides', 'Bon pour décider'] }, elevenlabs: { desc: 'Création de voix et audio.', benefits: ['Voix naturelles', 'Plusieurs langues', 'Audio prêt à publier'] }, canva: { desc: 'Créez des visuels plus vite.', benefits: ['Templates prêts', 'Éditions rapides', 'Mobile friendly'] }, capcut: { desc: 'Montage vidéo court.', benefits: ['Montage rapide', 'Outils créateur', 'Exports simples'] }, microsoft_365: { desc: 'Documents et outils cloud.', benefits: ['Apps Office', 'Workflow cloud', 'Prêt pour business'] }, notion: { desc: 'Planifier, écrire et organiser.', benefits: ['Espace clair', 'Meilleure organisation', 'Travail en équipe'] }, zoom: { desc: 'Réunions fiables.', benefits: ['Appels stables', 'Outils réunion', 'Setup pro'] } },
  nl: { chatgpt: { desc: 'Dagelijkse AI-assistent.', benefits: ['Schrijfhulp', 'Sneller onderzoek', 'Workflow ideeën'] }, perplexity: { desc: 'Snel onderzoek met bronnen.', benefits: ['Duidelijke bronnen', 'Snelle antwoorden', 'Goed voor beslissingen'] }, elevenlabs: { desc: 'Stem en audio maken.', benefits: ['Natuurlijke stemmen', 'Meerdere talen', 'Publicatieklare audio'] }, canva: { desc: 'Ontwerp sneller posts en assets.', benefits: ['Kant-en-klare templates', 'Snelle edits', 'Werkt op mobiel'] }, capcut: { desc: 'Korte video’s bewerken.', benefits: ['Snel monteren', 'Creator tools', 'Makkelijk exporteren'] }, microsoft_365: { desc: 'Documenten en cloudtools.', benefits: ['Office apps', 'Cloud workflow', 'Zakelijk klaar'] }, notion: { desc: 'Plannen, schrijven en organiseren.', benefits: ['Duidelijke workspace', 'Betere planning', 'Teamvriendelijk'] }, zoom: { desc: 'Betrouwbare meetings.', benefits: ['Stabiele calls', 'Meeting tools', 'Professionele setup'] } },
  de: { chatgpt: { desc: 'KI-Assistent für den Alltag.', benefits: ['Schreibhilfe', 'Recherche-Support', 'Workflow-Ideen'] }, perplexity: { desc: 'Schnelle Recherche mit Quellen.', benefits: ['Klare Quellen', 'Schnelle Antworten', 'Gut für Entscheidungen'] }, elevenlabs: { desc: 'Voice- und Audio-Erstellung.', benefits: ['Natürliche Stimmen', 'Mehrere Sprachen', 'Content-ready Audio'] }, canva: { desc: 'Designs schneller erstellen.', benefits: ['Fertige Vorlagen', 'Schnelle Bearbeitung', 'Auf allen Geräten'] }, capcut: { desc: 'Kurzvideos bearbeiten.', benefits: ['Schneller Schnitt', 'Creator Tools', 'Einfache Exporte'] }, microsoft_365: { desc: 'Dokumente und Cloud-Tools.', benefits: ['Office Apps', 'Cloud Workflow', 'Business-ready'] }, notion: { desc: 'Planen, schreiben und organisieren.', benefits: ['Klarer Workspace', 'Bessere Planung', 'Teamfreundlich'] }, zoom: { desc: 'Zuverlässige Meetings.', benefits: ['Stabile Calls', 'Meeting Tools', 'Professionelles Setup'] } },
  es: { chatgpt: { desc: 'Asistente IA para el día a día.', benefits: ['Ayuda para escribir', 'Apoyo de investigación', 'Ideas de workflow'] }, perplexity: { desc: 'Investigación rápida con fuentes.', benefits: ['Fuentes claras', 'Respuestas rápidas', 'Bueno para decidir'] }, elevenlabs: { desc: 'Creación de voz y audio.', benefits: ['Voces naturales', 'Varios idiomas', 'Audio listo para contenido'] }, canva: { desc: 'Diseña posts y assets más rápido.', benefits: ['Plantillas listas', 'Edición rápida', 'Funciona en móvil'] }, capcut: { desc: 'Edición de videos cortos.', benefits: ['Edición rápida', 'Herramientas creator', 'Exportación fácil'] }, microsoft_365: { desc: 'Documentos y herramientas cloud.', benefits: ['Apps Office', 'Workflow cloud', 'Listo para negocio'] }, notion: { desc: 'Planifica, escribe y organiza.', benefits: ['Workspace claro', 'Mejor planificación', 'Para equipos'] }, zoom: { desc: 'Reuniones fiables.', benefits: ['Llamadas estables', 'Herramientas meeting', 'Setup profesional'] } },
  it: { chatgpt: { desc: 'Assistente AI quotidiano.', benefits: ['Aiuto scrittura', 'Supporto ricerca', 'Idee workflow'] }, perplexity: { desc: 'Ricerca veloce con fonti.', benefits: ['Fonti chiare', 'Risposte rapide', 'Utile per decidere'] }, elevenlabs: { desc: 'Creazione voce e audio.', benefits: ['Voci naturali', 'Più lingue', 'Audio pronto'] }, canva: { desc: 'Crea grafiche più velocemente.', benefits: ['Template pronti', 'Modifiche rapide', 'Funziona su mobile'] }, capcut: { desc: 'Editing video brevi.', benefits: ['Editing rapido', 'Tool creator', 'Export facile'] }, microsoft_365: { desc: 'Documenti e strumenti cloud.', benefits: ['App Office', 'Workflow cloud', 'Pronto per business'] }, notion: { desc: 'Pianifica, scrivi e organizza.', benefits: ['Workspace chiaro', 'Migliore planning', 'Adatto ai team'] }, zoom: { desc: 'Meeting affidabili.', benefits: ['Chiamate stabili', 'Tool meeting', 'Setup pro'] } },
  ar: { chatgpt: { desc: 'مساعد ذكاء اصطناعي للاستخدام اليومي.', benefits: ['مساعدة في الكتابة', 'بحث أسرع', 'أفكار لسير العمل'] }, perplexity: { desc: 'بحث سريع مع مصادر.', benefits: ['مصادر واضحة', 'إجابات سريعة', 'مناسب لاتخاذ القرار'] }, elevenlabs: { desc: 'إنشاء الصوت والمحتوى الصوتي.', benefits: ['أصوات طبيعية', 'لغات متعددة', 'صوت جاهز للمحتوى'] }, canva: { desc: 'صمّم المنشورات والمواد أسرع.', benefits: ['قوالب جاهزة', 'تعديلات سريعة', 'يعمل على الموبايل'] }, capcut: { desc: 'تعديل الفيديوهات القصيرة.', benefits: ['مونتاج سريع', 'أدوات للمبدعين', 'تصدير سهل'] }, microsoft_365: { desc: 'مستندات وأدوات عمل سحابية.', benefits: ['تطبيقات Office', 'سير عمل سحابي', 'مناسب للأعمال'] }, notion: { desc: 'خطّط واكتب ونظّم.', benefits: ['مساحة عمل واضحة', 'تنظيم أفضل', 'مناسب للفِرق'] }, zoom: { desc: 'اجتماعات موثوقة.', benefits: ['مكالمات مستقرة', 'أدوات اجتماعات', 'إعداد احترافي'] } },
};

const bullets = ['Instant replies', 'Works in multiple languages', '24/7 availability', 'Works across all platforms', 'Increases conversions'];
const langTint: Record<LangKey, string> = { en: 'hsl(var(--primary))', fr: 'hsl(var(--secondary))', nl: '#25D366', de: 'hsl(var(--accent))', es: '#F5C542', it: '#25D366', ar: 'hsl(var(--secondary))' };

const useLang = () => {
  const { i18n } = useTranslation();
  const raw = (i18n.language || document.documentElement.lang || 'en').split('-')[0].toLowerCase();
  return (supported.includes(raw as LangKey) ? raw : 'en') as LangKey;
};

const RobotAvatar = ({ className = 'w-9 h-9', lang = 'en', speaking = false, rounded = 'rounded-full' }: { className?: string; lang?: LangKey; speaking?: boolean; rounded?: string }) => (
  <span className={`relative inline-flex shrink-0 ${className}`} style={{ '--avatar-tint': langTint[lang] } as React.CSSProperties}>
    <span className={`chatbot-avatar-shell ${speaking ? 'chatbot-avatar-speaking' : ''} ${rounded}`}>
      <img src={robotAvatar} alt="AI Deals Assistant robot avatar" width={448} height={448} loading="lazy" className={`h-full w-full object-cover ${rounded}`} />
      <span className="chatbot-avatar-blink" />
    </span>
    <span className="absolute -bottom-1 -right-1 rounded-full border border-background bg-muted px-1 text-[8px] font-bold text-foreground shadow-sm">{copy[lang].flag}</span>
  </span>
);

export const ChatbotPromoSection = () => (
  <section className="py-24 relative overflow-hidden" id="chatbot-promo">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="glass rounded-3xl p-8 md:p-12 max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 text-primary text-sm font-medium mb-6 glass"><RobotAvatar className="w-5 h-5" />AI Chatbot</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-5 leading-tight">Your AI Assistant That <span className="gradient-text">Never Sleeps</span></h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-7">Reply to customers instantly, 24/7, on your website, WhatsApp, and Telegram.</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-8">{bullets.map((item) => <div key={item} className="flex items-center gap-3 text-sm text-foreground"><CheckCircle className="w-4 h-4 text-primary shrink-0" />{item}</div>)}</div>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center"><Button variant="hero" size="lg" asChild><Link to="/store">Activate Chatbot</Link></Button><p className="text-xs text-muted-foreground">No missed messages. No lost customers.</p></div>
          </div>
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.5 }} className="rounded-2xl border border-border bg-muted/20 p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold"><MessageCircle className="w-4 h-4 text-primary" />Live sales flow preview</div>
            {['What are you looking for?', 'AI tools', 'Best start: ChatGPT Plus for daily writing and workflows.', 'Do you want the access link?'].map((line, index) => <div key={line} className={`rounded-xl px-4 py-3 text-sm ${index % 2 ? 'bg-primary/10 text-foreground ms-8' : 'bg-white/[0.04] text-muted-foreground me-8'}`}>{line}</div>)}
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
);

export const ChatbotSalesFlow = () => {
  const location = useLocation();
  const lang = useLang();
  const text = copy[lang];
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [liftForMobileCta, setLiftForMobileCta] = useState(false);
  const [selected, setSelected] = useState<FlowKey | null>(null);
  const [input, setInput] = useState('');
  const [soundOn, setSoundOn] = useState(() => localStorage.getItem('aiDealsChatSound') !== 'off');
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const [listening, setListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const initialMessage = useMemo<Message>(() => ({ id: 1, role: 'bot', text: text.greeting }), [text.greeting]);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);

  useEffect(() => { const timer = window.setTimeout(() => setReady(true), 2200); return () => window.clearTimeout(timer); }, []);
  useEffect(() => {
    const update = () => setLiftForMobileCta(location.pathname !== '/' || window.scrollY > window.innerHeight * 0.55);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [location.pathname]);
  useEffect(() => {
    const storedFlow = localStorage.getItem('aiDealsActiveChatFlow') as FlowKey | null;
    if (storedFlow && products[storedFlow]) {
      const localizedProducts = products[storedFlow].map((product) => ({ ...product, ...(productLocale[lang][product.id] || {}) }));
      setSelected(storedFlow);
      setMessages([{ id: Date.now(), role: 'bot', text: text.intros[storedFlow], products: localizedProducts }]);
      return;
    }
    setMessages([initialMessage]);
    setSelected(null);
  }, [initialMessage, lang, text.intros]);
  useEffect(() => { localStorage.setItem('aiDealsChatSound', soundOn ? 'on' : 'off'); }, [soundOn]);
  useEffect(() => { if (open) window.setTimeout(() => inputRef.current?.focus(), 180); }, [open]);
  useEffect(() => {
    const adaptToFunnel = (event: Event) => {
      const key = (event as CustomEvent<IntentKey>).detail;
      const funnel = funnelMessages[key];
      if (!funnel) return;
      const localizedProducts = products[funnel.flow].map((product) => ({ ...product, ...(productLocale[lang][product.id] || {}) }));
      const next: Message = { id: Date.now(), role: 'bot', text: funnel.text[lang], products: localizedProducts };
      localStorage.setItem('aiDealsActiveChatFlow', funnel.flow);
      setSelected(funnel.flow);
      setMessages([next]);
      setOpen(true);
      if (soundOn) window.setTimeout(() => speak(next), 180);
    };
    window.addEventListener('aiDeals:funnel', adaptToFunnel as EventListener);
    const stored = localStorage.getItem('aiDealsActiveFunnel') as IntentKey | null;
    if (stored && funnelMessages[stored]) {
      const funnel = funnelMessages[stored];
      const localizedProducts = products[funnel.flow].map((product) => ({ ...product, ...(productLocale[lang][product.id] || {}) }));
      setSelected(funnel.flow);
      setMessages([{ id: Date.now(), role: 'bot', text: funnel.text[lang], products: localizedProducts }]);
    }
    return () => window.removeEventListener('aiDeals:funnel', adaptToFunnel as EventListener);
  }, [lang, soundOn, text.voice]);

  const pickVoice = () => {
    const voices = window.speechSynthesis?.getVoices?.() || [];
    return text.voice.map((code) => voices.find((voice) => voice.lang.toLowerCase().startsWith(code.toLowerCase()))).find(Boolean) || voices.find((voice) => voice.lang.toLowerCase().startsWith(lang));
  };

  const speak = (message: Message) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.text);
    utterance.lang = text.voice[0];
    utterance.voice = pickVoice() || null;
    utterance.rate = lang === 'ar' ? 0.92 : 0.98;
    utterance.onstart = () => setSpeakingId(message.id);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
  };

  const addFlow = (key: FlowKey) => {
    setSelected(key);
    localStorage.setItem('aiDealsActiveChatFlow', key);
    const localizedProducts = products[key].map((product) => ({ ...product, ...(productLocale[lang][product.id] || {}) }));
    const next: Message = { id: Date.now(), role: 'bot', text: text.intros[key], products: localizedProducts };
    setMessages((current) => [...current.filter((m) => m.id !== next.id), next]);
    if (soundOn) window.setTimeout(() => speak(next), 150);
  };

  const sendMessage = () => {
    const value = input.trim();
    if (!value) return;
    setInput('');
    const userMessage: Message = { id: Date.now(), role: 'user', text: value };
    const localizedProducts = products.unsure.map((product) => ({ ...product, ...(productLocale[lang][product.id] || {}) }));
    const botMessage: Message = { id: Date.now() + 1, role: 'bot', text: text.intros.unsure, products: localizedProducts };
    setMessages((current) => [...current, userMessage, botMessage]);
    if (soundOn) window.setTimeout(() => speak(botMessage), 150);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || listening) return;
    const recognition = new SpeechRecognition();
    recognition.lang = text.voice[0];
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event: any) => setInput(event.results?.[0]?.[0]?.transcript || '');
    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleTelegramClick = (event: React.MouseEvent<HTMLAnchorElement>) => { if (TELEGRAM_URL.startsWith('#')) event.preventDefault(); };
  if (!ready) return null;

  return (
    <div className={`fixed right-2 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6 sm:gap-3 ${liftForMobileCta ? 'bottom-[calc(5.75rem+env(safe-area-inset-bottom))]' : 'bottom-[calc(1rem+env(safe-area-inset-bottom))]'}`}>
      <AnimatePresence>
        {open && (
          <motion.div drag="y" dragConstraints={{ top: 0, bottom: 120 }} dragElastic={0.08} onDragEnd={(_, info) => { if (info.offset.y > 80 || info.velocity.y > 500) setOpen(false); }} initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.96 }} transition={{ duration: 0.22 }} dir={text.dir} className="w-[calc(100vw-1rem)] max-w-md glass-strong rounded-2xl border border-border overflow-hidden shadow-2xl max-h-[68dvh] sm:max-h-none">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border/60">
              <div className="flex items-center gap-3 min-w-0"><RobotAvatar lang={lang} rounded="rounded-xl" speaking={speakingId !== null} /><div><p className="text-sm font-semibold text-foreground">AI Deals Assistant</p><p className="text-[11px] text-muted-foreground flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" />Online</p></div></div>
              <div className="flex items-center gap-1">
                <button onClick={() => setSoundOn((value) => !value)} className="w-11 h-11 sm:w-9 sm:h-9 rounded-xl hover:bg-muted/50 grid place-items-center transition-colors" aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}>{soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}</button>
                <button onClick={() => setOpen(false)} className="w-11 h-11 sm:w-9 sm:h-9 rounded-xl hover:bg-muted/50 grid place-items-center transition-colors" aria-label="Close chatbot"><X className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 max-h-[43dvh] sm:max-h-[62vh] overflow-y-auto overscroll-contain">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'bot' && <RobotAvatar className="w-8 h-8" lang={lang} speaking={speakingId === message.id} />}
                  <div className={`max-w-[84%] break-words ${message.role === 'user' ? 'bg-primary/20 text-foreground' : 'bg-white/[0.04] text-foreground'} rounded-xl px-3 sm:px-4 py-3 text-sm leading-relaxed`}>
                    <div className="flex items-start gap-2">
                      <p className="flex-1">{message.text}</p>
                      {message.role === 'bot' && <button onClick={() => speak(message)} className="shrink-0 text-muted-foreground hover:text-primary transition-colors" aria-label="Play message"><Volume2 className="w-3.5 h-3.5" /></button>}
                    </div>
                    {message.products && <div className="mt-3 space-y-2">{message.products.map((product) => <div key={product.id} className="rounded-xl border border-border bg-muted/20 p-3"><div className="flex items-start justify-between gap-3 mb-2"><div><h4 className="text-sm font-semibold text-foreground">{product.name}</h4><p className="text-xs text-muted-foreground mt-1">{product.desc}</p></div><Link to={`/store?scrollTo=${product.id}`} onClick={() => setOpen(false)} className="text-primary hover:text-foreground transition-colors" aria-label={`Open ${product.name}`}><ChevronRight className="w-4 h-4" /></Link></div><ul className="space-y-1 mb-3">{product.benefits.map((benefit) => <li key={benefit} className="flex items-center gap-2 text-[11px] text-muted-foreground"><CheckCircle className="w-3 h-3 text-primary shrink-0" />{benefit}</li>)}</ul><p className="text-[11px] text-muted-foreground mb-3">{text.price}</p><Button variant="heroOutline" size="sm" asChild className="w-full"><Link to={`/store?scrollTo=${product.id}`} onClick={() => setOpen(false)}>{text.access}</Link></Button></div>)}</div>}
                  </div>
                </div>
              ))}
              <p className="text-sm font-medium text-foreground">{text.question}</p>
              <div className="flex flex-wrap gap-2">{(Object.keys(text.labels) as FlowKey[]).map((key) => <button key={key} onClick={() => addFlow(key)} className={`min-h-11 rounded-xl border px-3 py-2 text-sm transition-all ${selected === key ? 'border-primary/40 bg-primary/10 text-foreground' : 'border-border bg-muted/20 text-muted-foreground hover:text-foreground hover:border-primary/30'}`}>{text.labels[key]}</button>)}</div>
            </div>

            <div className="p-3 border-t border-border/60">
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted/30 px-3 py-2">
                <input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') sendMessage(); }} placeholder={text.input} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" aria-label="Chat message" />
                <button onClick={startListening} className={`w-11 h-11 sm:w-9 sm:h-9 rounded-xl grid place-items-center transition-colors ${listening ? 'bg-primary/20 text-primary' : 'hover:bg-muted/50 text-muted-foreground'}`} aria-label="Press to talk"><Mic className="w-4 h-4" /></button>
                <button onClick={sendMessage} className="w-11 h-11 sm:w-9 sm:h-9 rounded-xl grid place-items-center bg-primary text-primary-foreground hover:scale-105 transition-transform" aria-label="Send message"><Send className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-end gap-1.5 sm:gap-3 translate-y-2 sm:translate-y-0">
        <div className="flex flex-col items-end gap-2 sm:gap-3">
          <motion.a href={TELEGRAM_URL} onClick={handleTelegramClick} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.07, y: -4 }} whileTap={{ scale: 0.96 }} className="chatbot-social-3d chatbot-telegram-3d" aria-label="Contact on Telegram"><TelegramIcon className="w-7 h-7 sm:w-9 sm:h-9" /></motion.a>
          <motion.a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.07, y: -4 }} whileTap={{ scale: 0.96 }} className="chatbot-social-3d chatbot-whatsapp-3d" aria-label="Contact on WhatsApp"><WhatsAppIcon className="w-7 h-7 sm:w-9 sm:h-9" /></motion.a>
        </div>
        <motion.button onClick={() => setOpen((value) => !value)} whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.96 }} className="chatbot-main-float" aria-label="Open AI Deals chatbot"><RobotAvatar className="w-[64px] h-[64px] sm:w-[88px] sm:h-[88px]" lang={lang} speaking={speakingId !== null} /></motion.button>
      </div>
    </div>
  );
};
