import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { CheckCircle, ChevronRight, Mic, MessageCircle, Send, Volume2, VolumeX, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { isUsableSocialLink, socialLinks, supportLinks } from '@/lib/socialLinks';
import robotAvatar from '@/assets/ai-deals-robot-avatar.webp';

const N8N_CHAT_FUNCTION = 'n8n-chat';

const detectMessageLanguage = (message: string): LangKey => {
  const text = message.toLowerCase();
  if (/\p{Script=Arabic}/u.test(message)) return 'ar';
  if (/[àâçéèêëîïôùûüÿœæ]/.test(text) || /\b(bonjour|merci|vous|outil|choix|acheter|paiement)\b/.test(text)) return 'fr';
  if (/[äöüß]/.test(text) || /\b(hallo|danke|bitte|werkzeug|zahlung|kaufen)\b/.test(text)) return 'de';
  if (/[áéíóúñ¿¡]/.test(text) || /\b(hola|gracias|herramienta|comprar|pago)\b/.test(text)) return 'es';
  if (/\b(ciao|grazie|strumento|acquistare|pagamento|scegliere)\b/.test(text)) return 'it';
  if (/[çğıöşü]/.test(text) || /\b(merhaba|selam|teşekkür|odeme|ödeme|satın|almak|tasarım|yardım|fiyat|erişim)\b/.test(text)) return 'tr';
  if (/\b(hallo|hoi|dank|bedankt|tool|kopen|betaling|kiezen)\b/.test(text)) return 'nl';
  return 'en';
};

const salesAssistantInstructions: Record<LangKey, string> = {
  en: 'Reply only in English. Advanced funnel sales chatbot for an AI tools store. Max 2 short lines. Detect intent fast: content, design, productivity, AI tools, voice, or unsure. If unclear ask only: “What do you want to do?” Recommend only 1–2 tools: content = ChatGPT + CapCut, design = Canva Pro, productivity = Notion + ChatGPT, voice = ElevenLabs. Always move forward: cheaper than official pricing + instant access. Handle objections briefly: price = cheaper than official and ready instantly; trust = secure Stripe payment and support available; hesitation = limited availability today. If interested, hard close: “You can get instant access now 👇”. End with a CTA or question.',
  fr: 'Réponds uniquement en français naturel. Chatbot de vente en funnel pour une boutique d’outils IA. Maximum 2 lignes courtes. Détecte vite le besoin : contenu, design, productivité, outils IA, voix ou indécis. Si ce n’est pas clair, demande seulement : « Que voulez-vous faire ? » Recommande seulement 1 ou 2 outils : contenu = ChatGPT + CapCut, design = Canva Pro, productivité = Notion + ChatGPT, voix = ElevenLabs. Avance toujours vers l’achat : moins cher que le prix officiel + accès instantané. Objections : prix = moins cher que l’officiel et prêt immédiatement ; confiance = paiement Stripe sécurisé et support disponible ; hésitation = disponibilité limitée aujourd’hui. Termine par un CTA ou une question.',
  nl: 'Antwoord alleen in natuurlijk Nederlands. Funnelgerichte saleschatbot voor een AI-tools store. Maximaal 2 korte regels. Herken snel: content, design, productiviteit, AI-tools, voice of twijfel. Onduidelijk? Vraag alleen: “Wat wil je doen?” Raad slechts 1–2 tools aan: content = ChatGPT + CapCut, design = Canva Pro, productiviteit = Notion + ChatGPT, voice = ElevenLabs. Stuur altijd vooruit: goedkoper dan officiële prijzen + directe toegang. Bezwaren kort: prijs = veel goedkoper en meteen klaar; vertrouwen = veilige Stripe-betaling en support beschikbaar; twijfel = vandaag beperkte beschikbaarheid. Eindig met een CTA of vraag.',
  de: 'Antworte ausschließlich in natürlichem Deutsch. Funnelbasierter Sales-Chatbot für einen KI-Tools-Shop. Maximal 2 kurze Zeilen. Erkenne schnell: Content, Design, Produktivität, KI-Tools, Voice oder unsicher. Wenn unklar, frage nur: „Was möchten Sie machen?“ Empfiehl nur 1–2 Tools: Content = ChatGPT + CapCut, Design = Canva Pro, Produktivität = Notion + ChatGPT, Voice = ElevenLabs. Immer Richtung Kauf führen: günstiger als offizieller Preis + Sofortzugang. Einwände kurz behandeln: Preis = deutlich günstiger und sofort bereit; Vertrauen = sichere Stripe-Zahlung und Support verfügbar; Zögern = heute begrenzte Verfügbarkeit. Ende mit CTA oder Frage.',
  es: 'Responde solo en español natural. Chatbot de ventas con funnel para una tienda de herramientas IA. Máximo 2 líneas cortas. Detecta rápido: contenido, diseño, productividad, herramientas IA, voz o indeciso. Si no está claro, pregunta solo: “¿Qué quieres hacer?” Recomienda solo 1–2 herramientas: contenido = ChatGPT + CapCut, diseño = Canva Pro, productividad = Notion + ChatGPT, voz = ElevenLabs. Siempre avanza hacia compra: más barato que el precio oficial + acceso instantáneo. Objeciones breves: precio = más barato y listo al instante; confianza = pago seguro con Stripe y soporte disponible; duda = disponibilidad limitada hoy. Termina con CTA o pregunta.',
  it: 'Rispondi solo in italiano naturale. Chatbot di vendita a funnel per uno store di strumenti IA. Massimo 2 righe brevi. Rileva subito: contenuti, design, produttività, strumenti IA, voce o indeciso. Se non è chiaro, chiedi solo: “Cosa vuoi fare?” Consiglia solo 1–2 strumenti: contenuti = ChatGPT + CapCut, design = Canva Pro, produttività = Notion + ChatGPT, voce = ElevenLabs. Porta sempre avanti: più economico del prezzo ufficiale + accesso immediato. Obiezioni brevi: prezzo = più conveniente e pronto subito; fiducia = pagamento sicuro con Stripe e supporto disponibile; esitazione = disponibilità limitata oggi. Chiudi con CTA o domanda.',
  ar: 'أجب بالعربية الفصحى البسيطة فقط. لا تخلط اللغات أبداً. أنت مساعد مبيعات لمتجر أدوات ذكاء اصطناعي. الحد الأقصى سطران قصيران. إذا لم تكن نية المستخدم واضحة فاسأل: “مرحباً، كيف يمكنني مساعدتك؟” رشّح أداة أو أداتين فقط. أخبر المستخدم بوضوح: بعد الدفع نرسل تفاصيل الوصول التي اشتراها، بما في ذلك اسم المستخدم وكلمة المرور عند الحاجة. لا تطلب كلمة مرور المستخدم الشخصية.',
  tr: 'Yalnızca doğal Türkçe yanıt ver. AI araçları mağazası için satış odaklı yardımcı botsun. En fazla 2–3 kısa satır yaz. Niyeti hızlı anla: içerik, tasarım, üretkenlik, AI araçları, ses veya kararsızlık. Belirsizse sadece sor: “Ne yapmak istiyorsun?” Yalnızca 1–2 araç öner: içerik = ChatGPT + CapCut, tasarım = Canva Pro, üretkenlik = Notion + ChatGPT, ses = ElevenLabs. Hep bir sonraki adıma yönlendir: resmi fiyatlardan daha uygun + anında erişim. İtirazlara kısa yanıt ver: fiyat = daha uygun ve hemen erişim; güven = güvenli ödeme ve destek mevcut; kararsızlık = bugün sınırlı erişim. Cevabı soru veya net çağrıyla bitir.',
};

export const openSocialUrl = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
  event.preventDefault();
  event.stopPropagation();

  try {
    const opener = window.top && window.top !== window.self ? window.top : window;
    const opened = opener.open(href, '_blank', 'noopener,noreferrer');
    if (opened) {
      try { opened.opener = null; } catch { /* noop */ }
      return;
    }
  } catch { /* fallback below */ }

  try {
    if (window.top && window.top !== window.self) window.top.location.href = href;
    else window.location.href = href;
  } catch {
    window.location.href = href;
  }
};

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export const WhatsAppIcon = forwardRef<SVGSVGElement, { className?: string }>(({ className = 'w-5 h-5' }, ref) => (
  <svg ref={ref} viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
    <path fill="hsl(142 70% 49%)" d="M16.04 3.2C9.02 3.2 3.3 8.9 3.3 15.9c0 2.23.58 4.4 1.69 6.31L3.2 28.8l6.74-1.77a12.68 12.68 0 0 0 6.1 1.55h.01c7.02 0 12.73-5.7 12.73-12.7S23.07 3.2 16.04 3.2Z" />
    <path fill="hsl(0 0% 100%)" d="M23.45 19.13c-.4-.2-2.36-1.16-2.72-1.3-.37-.13-.63-.2-.9.2-.27.4-1.03 1.3-1.27 1.56-.23.27-.47.3-.86.1-.4-.2-1.68-.62-3.2-1.97-1.18-1.06-1.98-2.36-2.21-2.76-.23-.4-.03-.61.17-.81.18-.18.4-.47.6-.7.2-.24.27-.4.4-.67.14-.27.07-.5-.03-.7-.1-.2-.9-2.17-1.23-2.97-.32-.78-.65-.67-.9-.68h-.76c-.27 0-.7.1-1.06.5-.37.4-1.4 1.36-1.4 3.32s1.43 3.86 1.63 4.12c.2.27 2.81 4.3 6.82 6.03.95.41 1.7.66 2.28.84.96.3 1.83.26 2.52.16.77-.12 2.36-.96 2.7-1.9.33-.93.33-1.73.23-1.9-.1-.16-.36-.26-.8-.47Z" />
  </svg>
));
WhatsAppIcon.displayName = 'WhatsAppIcon';

export const TelegramIcon = forwardRef<SVGSVGElement, { className?: string }>(({ className = 'w-5 h-5' }, ref) => (
  <svg ref={ref} viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
    <path fill="hsl(199 89% 55%)" d="M16 3.2c7.07 0 12.8 5.73 12.8 12.8S23.07 28.8 16 28.8 3.2 23.07 3.2 16 8.93 3.2 16 3.2Z" />
    <path fill="hsl(0 0% 100%)" d="M22.52 10.2c.24-.1.5.1.44.37l-2.23 10.5c-.08.39-.56.54-.86.28l-3.36-2.48-1.72 1.65c-.19.18-.51.09-.57-.17l-.62-2.91-3.26-1.02c-.38-.12-.4-.65-.03-.8l11.91-5.42Z" />
    <path fill="hsl(199 89% 55%)" d="M14.43 17.21 20.8 12.7c.12-.08.25.08.15.18l-5.26 5.1-.22 2.08-1.04-2.85Z" />
  </svg>
));
TelegramIcon.displayName = 'TelegramIcon';

export const PinterestIcon = forwardRef<SVGSVGElement, { className?: string }>(({ className = 'w-5 h-5' }, ref) => (
  <svg ref={ref} viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M16 3.2C8.93 3.2 3.2 8.93 3.2 16c0 5.28 3.2 9.8 7.77 11.75-.1-.98-.2-2.5.04-3.58.22-.97 1.42-6.18 1.42-6.18s-.36-.72-.36-1.78c0-1.67.97-2.92 2.18-2.92 1.03 0 1.52.77 1.52 1.7 0 1.03-.66 2.57-1 4-.28 1.2.6 2.18 1.78 2.18 2.14 0 3.78-2.26 3.78-5.52 0-2.88-2.07-4.9-5.04-4.9-3.43 0-5.44 2.57-5.44 5.23 0 1.04.4 2.15.9 2.75.1.12.11.22.08.34-.09.37-.3 1.2-.34 1.36-.05.22-.17.27-.4.16-1.5-.7-2.43-2.9-2.43-4.66 0-3.8 2.76-7.28 7.95-7.28 4.18 0 7.42 2.98 7.42 6.96 0 4.15-2.61 7.49-6.24 7.49-1.22 0-2.36-.63-2.75-1.38l-.75 2.85c-.27 1.04-1 2.34-1.49 3.13 1.12.35 2.31.54 3.56.54 7.07 0 12.8-5.73 12.8-12.8S23.07 3.2 16 3.2Z" />
  </svg>
));
PinterestIcon.displayName = 'PinterestIcon';

export const TikTokIcon = forwardRef<SVGSVGElement, { className?: string }>(({ className = 'w-5 h-5' }, ref) => (
  <svg ref={ref} viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M21.6 5.2c.42 3.08 2.15 4.92 5.2 5.12v3.47c-1.76.17-3.3-.4-5.1-1.48v6.5c0 8.26-9 10.84-12.6 4.92-2.32-3.82-.9-10.54 6.55-10.81v3.66c-.58.1-1.2.25-1.76.44-1.7.57-2.66 1.64-2.4 3.52.5 3.6 7.12 4.67 6.57-2.37V5.2h3.54Z" />
  </svg>
));
TikTokIcon.displayName = 'TikTokIcon';

export const XSocialIcon = forwardRef<SVGSVGElement, { className?: string }>(({ className = 'w-5 h-5' }, ref) => (
  <svg ref={ref} viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M18.56 14.08 28.57 2.4h-2.37l-8.7 10.14L10.57 2.4H2.56l10.5 15.34L2.56 30h2.37l9.18-10.72L21.45 30h8.01L18.56 14.08Zm-3.25 3.8-1.06-1.52L5.79 4.18h3.64l6.83 9.84 1.06 1.52 8.88 12.78h-3.64l-7.25-10.44Z" />
  </svg>
));
XSocialIcon.displayName = 'XSocialIcon';

export const Social3DLink = ({ href, label, children, tone = 'social-whatsapp-3d', className = 'w-12 h-12' }: { href: string; label: string; children: ReactNode; tone?: string; className?: string }) => (
  <motion.a
    href={href}
    onClick={(event) => openSocialUrl(event, href)}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.1, y: -3, rotateX: 8, rotateY: -8 }}
    whileTap={{ scale: 0.95 }}
    className={`social-link-3d social-link-movie ${tone} ${className} rounded-full flex items-center justify-center transition-all duration-300`}
    aria-label={label}
  >
    {children}
  </motion.a>
);

const supported = ['en', 'fr', 'nl', 'de', 'es', 'it', 'tr', 'ar'] as const;
type LangKey = typeof supported[number];
type FlowKey = 'chatgpt' | 'office' | 'windows' | 'copilot' | 'other';
type IntentKey = 'student' | 'creator' | 'business';
type Message = { id: number; role: 'bot' | 'user'; text: string; products?: Product[] };
type Product = { name: string; id: string; desc: string; benefits: string[] };

const copy: Record<LangKey, {
  dir: 'ltr' | 'rtl'; flag: string; voice: string[]; greeting: string; question: string; input: string; access: string; price: string; labels: Record<FlowKey, string>; intros: Record<FlowKey, string>;
}> = {
  en: { dir: 'ltr', flag: 'EN', voice: ['en-GB', 'en-US'], greeting: 'Hi 👋 Welcome to AI Deals\n\nWe provide affordable access to:\n• ChatGPT\n• Microsoft Office\n• Windows\n• Copilot\n\nWhat are you looking for?\n\nReply with a number 👇', question: 'Choose an option:', input: 'Type your message...', access: 'Get access', price: 'Final payment is processed in EUR (€).', labels: { chatgpt: '1 ChatGPT', office: '2 Microsoft Office', windows: '3 Windows', copilot: '4 Copilot', other: '5 Something else' }, intros: { chatgpt: 'Great choice 👍\n\nChatGPT helps you with:\n• Content creation\n• Ideas & research\n• Daily tasks\n\nDo you want:\n• Monthly\n• Yearly\n\nReply with your choice 👇', office: 'Great choice 👍\n\nMicrosoft Office helps you with documents, spreadsheets, presentations, and daily work.\n\nDo you want:\n• Yearly\n• Lifetime\n\nReply with your choice 👇', windows: 'Great choice 👍\n\nWindows gives you reliable activation for your PC.\n\nDo you want:\n• Pro\n• Home\n\nReply with your choice 👇', copilot: 'Copilot access is currently limited. I can still help you choose the best available alternative.', other: 'No problem 👍 Tell me what you need help with, and I’ll guide you.' } },
  fr: { dir: 'ltr', flag: 'FR', voice: ['fr-FR', 'fr-BE'], greeting: 'Bonjour 👋 Bienvenue chez AI Deals\n\nNous proposons un accès abordable à ChatGPT, Microsoft Office, Windows et Copilot.\n\nQue recherchez-vous ?\n\nRépondez avec un numéro 👇', question: 'Choisissez une option :', input: 'Écrivez votre message...', access: 'Obtenir l’accès instantané', price: 'Le paiement final est traité en EUR (€).', labels: { chatgpt: '1 ChatGPT', office: '2 Microsoft Office', windows: '3 Windows', copilot: '4 Copilot', other: '5 Autre chose' }, intros: { chatgpt: 'Excellent choix 👍\n\nChatGPT vous aide avec le contenu, les idées, la recherche et les tâches quotidiennes.\n\nMensuel ou annuel ?', office: 'Excellent choix 👍\n\nMicrosoft Office vous aide avec les documents, tableaux et présentations.\n\nAnnuel ou lifetime ?', windows: 'Excellent choix 👍\n\nWindows vous donne une activation fiable pour votre PC.\n\nPro ou Home ?', copilot: 'L’accès Copilot est actuellement limité. Je peux vous guider vers la meilleure alternative disponible.', other: 'D’accord 👍 Dites-moi ce dont vous avez besoin.' } },
  nl: { dir: 'ltr', flag: 'NL', voice: ['nl-BE', 'nl-NL'], greeting: 'Hoi 👋 Welkom bij AI Deals\n\nWij bieden betaalbare toegang tot ChatGPT, Microsoft Office, Windows en Copilot.\n\nWaar ben je naar op zoek?\n\nAntwoord met een nummer 👇', question: 'Kies een optie:', input: 'Typ je bericht...', access: 'Krijg direct toegang', price: 'De uiteindelijke betaling wordt verwerkt in EUR (€).', labels: { chatgpt: '1 ChatGPT', office: '2 Microsoft Office', windows: '3 Windows', copilot: '4 Copilot', other: '5 Iets anders' }, intros: { chatgpt: 'Goede keuze 👍\n\nChatGPT helpt met content, ideeën, research en dagelijkse taken.\n\nWil je maandelijks of jaarlijks?', office: 'Goede keuze 👍\n\nMicrosoft Office helpt met documenten, spreadsheets en presentaties.\n\nJaarlijks of lifetime?', windows: 'Goede keuze 👍\n\nWindows geeft betrouwbare activatie voor je pc.\n\nPro of Home?', copilot: 'Copilot-toegang is momenteel beperkt. Ik kan je wel naar het beste beschikbare alternatief begeleiden.', other: 'Geen probleem 👍 Vertel me wat je nodig hebt.' } },
  de: { dir: 'ltr', flag: 'DE', voice: ['de-DE'], greeting: 'Hallo 👋 Willkommen bei AI Deals\n\nWir bieten günstigen Zugang zu ChatGPT, Microsoft Office, Windows und Copilot.\n\nWas suchen Sie?\n\nAntworten Sie mit einer Nummer 👇', question: 'Option wählen:', input: 'Nachricht eingeben...', access: 'Sofortzugang erhalten', price: 'Die endgültige Zahlung erfolgt in EUR (€).', labels: { chatgpt: '1 ChatGPT', office: '2 Microsoft Office', windows: '3 Windows', copilot: '4 Copilot', other: '5 Etwas anderes' }, intros: { chatgpt: 'Gute Wahl 👍\n\nChatGPT hilft bei Content, Ideen, Recherche und täglichen Aufgaben.\n\nMonatlich oder jährlich?', office: 'Gute Wahl 👍\n\nMicrosoft Office hilft mit Dokumenten, Tabellen und Präsentationen.\n\nJährlich oder Lifetime?', windows: 'Gute Wahl 👍\n\nWindows bietet zuverlässige Aktivierung für Ihren PC.\n\nPro oder Home?', copilot: 'Copilot-Zugang ist aktuell begrenzt. Ich kann eine gute verfügbare Alternative empfehlen.', other: 'Kein Problem 👍 Sagen Sie mir, was Sie brauchen.' } },
  es: { dir: 'ltr', flag: 'ES', voice: ['es-ES'], greeting: 'Hola 👋 Bienvenido a AI Deals\n\nOfrecemos acceso económico a ChatGPT, Microsoft Office, Windows y Copilot.\n\n¿Qué buscas?\n\nResponde con un número 👇', question: 'Elige una opción:', input: 'Escribe tu mensaje...', access: 'Obtener acceso instantáneo', price: 'El pago final se procesa en EUR (€).', labels: { chatgpt: '1 ChatGPT', office: '2 Microsoft Office', windows: '3 Windows', copilot: '4 Copilot', other: '5 Otra cosa' }, intros: { chatgpt: 'Buena elección 👍\n\nChatGPT ayuda con contenido, ideas, investigación y tareas diarias.\n\n¿Mensual o anual?', office: 'Buena elección 👍\n\nMicrosoft Office ayuda con documentos, hojas y presentaciones.\n\n¿Anual o lifetime?', windows: 'Buena elección 👍\n\nWindows ofrece activación fiable para tu PC.\n\n¿Pro o Home?', copilot: 'El acceso a Copilot está limitado actualmente. Puedo recomendarte la mejor alternativa disponible.', other: 'Sin problema 👍 Cuéntame qué necesitas.' } },
  it: { dir: 'ltr', flag: 'IT', voice: ['it-IT'], greeting: 'Ciao 👋 Benvenuto su AI Deals\n\nOffriamo accesso conveniente a ChatGPT, Microsoft Office, Windows e Copilot.\n\nCosa cerchi?\n\nRispondi con un numero 👇', question: 'Scegli un’opzione:', input: 'Scrivi il tuo messaggio...', access: 'Ottieni accesso immediato', price: 'Il pagamento finale viene elaborato in EUR (€).', labels: { chatgpt: '1 ChatGPT', office: '2 Microsoft Office', windows: '3 Windows', copilot: '4 Copilot', other: '5 Altro' }, intros: { chatgpt: 'Ottima scelta 👍\n\nChatGPT aiuta con contenuti, idee, ricerca e attività quotidiane.\n\nMensile o annuale?', office: 'Ottima scelta 👍\n\nMicrosoft Office aiuta con documenti, fogli e presentazioni.\n\nAnnuale o lifetime?', windows: 'Ottima scelta 👍\n\nWindows offre attivazione affidabile per il PC.\n\nPro o Home?', copilot: 'L’accesso a Copilot è attualmente limitato. Posso suggerire la migliore alternativa disponibile.', other: 'Nessun problema 👍 Dimmi cosa ti serve.' } },
  tr: { dir: 'ltr', flag: 'TR', voice: ['tr-TR'], greeting: 'Merhaba 👋 AI Deals’e hoş geldin\n\nChatGPT, Microsoft Office, Windows ve Copilot için uygun erişim sunuyoruz.\n\nNe arıyorsun?\n\nNumara ile yanıtla 👇', question: 'Bir seçenek seç:', input: 'Mesajını yaz...', access: 'Hemen erişim al', price: 'Nihai ödeme EUR olarak alınır.', labels: { chatgpt: '1 ChatGPT', office: '2 Microsoft Office', windows: '3 Windows', copilot: '4 Copilot', other: '5 Başka bir şey' }, intros: { chatgpt: 'Harika seçim 👍\n\nChatGPT içerik, fikir, araştırma ve günlük işlerde yardımcı olur.\n\nAylık mı yıllık mı?', office: 'Harika seçim 👍\n\nMicrosoft Office belgeler, tablolar ve sunumlar için yardımcı olur.\n\nYıllık mı lifetime mı?', windows: 'Harika seçim 👍\n\nWindows PC için güvenilir aktivasyon sağlar.\n\nPro mu Home mu?', copilot: 'Copilot erişimi şu anda sınırlı. En iyi mevcut alternatifi önerebilirim.', other: 'Sorun değil 👍 Neye ihtiyacın olduğunu yaz.' } },
  ar: { dir: 'rtl', flag: 'AR', voice: ['ar-SA', 'ar'], greeting: 'مرحباً 👋 أهلاً بك في AI Deals\n\nنوفر وصولاً بسعر مناسب إلى ChatGPT وMicrosoft Office وWindows وCopilot.\n\nماذا تبحث عنه؟\n\nأجب برقم 👇', question: 'اختر خياراً:', input: 'اكتب رسالتك...', access: 'احصل على الوصول الفوري', price: 'تتم معالجة الدفع النهائي باليورو (€).', labels: { chatgpt: '1 ChatGPT', office: '2 Microsoft Office', windows: '3 Windows', copilot: '4 Copilot', other: '5 شيء آخر' }, intros: { chatgpt: 'اختيار رائع 👍\n\nيساعدك ChatGPT في إنشاء المحتوى والأفكار والبحث والمهام اليومية.\n\nشهري أم سنوي؟', office: 'اختيار رائع 👍\n\nيساعدك Microsoft Office في المستندات والجداول والعروض.\n\nسنوي أم مدى الحياة؟', windows: 'اختيار رائع 👍\n\nيوفر Windows تفعيلًا موثوقًا لجهازك.\n\nPro أم Home؟', copilot: 'وصول Copilot محدود حالياً. يمكنني اقتراح أفضل بديل متاح.', other: 'لا مشكلة 👍 أخبرني بما تحتاجه.' } },
};

const products: Record<FlowKey, Product[]> = {
  ai: [
    { name: 'ChatGPT Plus', id: 'chatgpt', desc: 'Everyday AI assistant.', benefits: ['Writing help', 'Research support', 'Workflow ideas'] },
    { name: 'ElevenLabs', id: 'elevenlabs', desc: 'Voice and audio creation.', benefits: ['Natural voices', 'Multiple languages', 'Content-ready audio'] },
  ],
  design: [
    { name: 'Canva Pro', id: 'canva', desc: 'Design posts and assets faster.', benefits: ['Ready templates', 'Fast edits', 'Works on devices'] },
    { name: 'CapCut Pro', id: 'capcut', desc: 'Short video editing.', benefits: ['Quick editing', 'Creator tools', 'Easy exports'] },
  ],
  productivity: [
    { name: 'Notion', id: 'notion', desc: 'Plan, write, and organize.', benefits: ['Clear workspace', 'Better planning', 'Team-friendly'] },
    { name: 'ChatGPT Plus', id: 'chatgpt', desc: 'Everyday AI assistant.', benefits: ['Writing help', 'Research support', 'Workflow ideas'] },
  ],
  unsure: [
    { name: 'ChatGPT Plus', id: 'chatgpt', desc: 'Best first AI tool.', benefits: ['Easy start', 'Many use cases', 'Daily value'] },
    { name: 'Canva Pro', id: 'canva', desc: 'Best for visual content.', benefits: ['Simple design', 'Fast output', 'Business posts'] },
  ],
};

const funnelMessages: Record<IntentKey, { flow: FlowKey; text: Record<LangKey, string> }> = {
  student: { flow: 'ai', text: { en: 'Want help with studying tools?', fr: 'Besoin d’aide pour choisir des outils d’étude ?', nl: 'Hulp nodig met studietools?', de: 'Brauchst du Hilfe mit Lern-Tools?', es: '¿Quieres ayuda con herramientas de estudio?', it: 'Vuoi aiuto con gli strumenti per studiare?', tr: 'Ders çalışmak için uygun aracı seçmeme izin ver.', ar: 'هل تريد مساعدة في اختيار أدوات الدراسة؟' } },
  creator: { flow: 'design', text: { en: 'Need help creating content?', fr: 'Besoin d’aide pour créer du contenu ?', nl: 'Hulp nodig bij content maken?', de: 'Brauchst du Hilfe beim Erstellen von Content?', es: '¿Necesitas ayuda para crear contenido?', it: 'Ti serve aiuto per creare contenuti?', tr: 'İçerik üretimi için en uygun seçeneği göstereyim mi?', ar: 'هل تحتاج مساعدة في إنشاء المحتوى؟' } },
  business: { flow: 'productivity', text: { en: 'Want to automate your workflow?', fr: 'Vous voulez automatiser votre workflow ?', nl: 'Wil je je workflow automatiseren?', de: 'Möchtest du deinen Workflow automatisieren?', es: '¿Quieres automatizar tu flujo de trabajo?', it: 'Vuoi automatizzare il tuo workflow?', tr: 'İş akışını hızlandıracak seçenekleri göstereyim mi?', ar: 'هل تريد أتمتة سير عملك؟' } },
};

const productLocale: Record<LangKey, Record<string, Pick<Product, 'desc' | 'benefits'>>> = {
  en: {},
  fr: { chatgpt: { desc: 'Assistant IA polyvalent pour le quotidien.', benefits: ['Rédaction plus facile', 'Recherche plus rapide', 'Idées de workflows'] }, perplexity: { desc: 'Recherche rapide avec réponses sourcées.', benefits: ['Sources claires', 'Réponses rapides', 'Aide à décider'] }, elevenlabs: { desc: 'Création de voix et d’audio réalistes.', benefits: ['Voix naturelles', 'Plusieurs langues', 'Audio prêt à publier'] }, canva: { desc: 'Créez des visuels professionnels plus vite.', benefits: ['Modèles prêts à l’emploi', 'Modifications rapides', 'Simple sur mobile'] }, capcut: { desc: 'Montage rapide pour vidéos courtes.', benefits: ['Édition fluide', 'Outils créateurs', 'Exports simples'] }, microsoft_365: { desc: 'Documents, cloud et outils de travail.', benefits: ['Applications Office', 'Travail dans le cloud', 'Prêt pour l’équipe'] }, notion: { desc: 'Planifiez, écrivez et organisez tout au même endroit.', benefits: ['Espace clair', 'Meilleure organisation', 'Adapté aux équipes'] }, zoom: { desc: 'Réunions en ligne fiables.', benefits: ['Appels stables', 'Outils de réunion', 'Configuration pro'] } },
  nl: { chatgpt: { desc: 'Veelzijdige AI-assistent voor dagelijks gebruik.', benefits: ['Makkelijker schrijven', 'Sneller onderzoek', 'Workflow-ideeën'] }, perplexity: { desc: 'Snel zoeken met duidelijke bronnen.', benefits: ['Heldere bronnen', 'Snelle antwoorden', 'Handig voor beslissingen'] }, elevenlabs: { desc: 'Realistische stem- en audiocreatie.', benefits: ['Natuurlijke stemmen', 'Meerdere talen', 'Audio klaar voor publicatie'] }, canva: { desc: 'Maak sneller professionele visuals.', benefits: ['Gebruiksklare templates', 'Snelle aanpassingen', 'Eenvoudig op mobiel'] }, capcut: { desc: 'Snelle montage voor korte video’s.', benefits: ['Vlot bewerken', 'Creator-tools', 'Makkelijk exporteren'] }, microsoft_365: { desc: 'Documenten, cloud en werktools.', benefits: ['Office-apps', 'Cloudworkflow', 'Klaar voor teams'] }, notion: { desc: 'Plan, schrijf en organiseer alles op één plek.', benefits: ['Duidelijke werkruimte', 'Betere planning', 'Teamvriendelijk'] }, zoom: { desc: 'Betrouwbare online meetings.', benefits: ['Stabiele gesprekken', 'Meetingtools', 'Professionele setup'] } },
  de: { chatgpt: { desc: 'Vielseitiger KI-Assistent für den Alltag.', benefits: ['Texte leichter erstellen', 'Schneller recherchieren', 'Workflow-Ideen'] }, perplexity: { desc: 'Schnelle Recherche mit klaren Quellen.', benefits: ['Nachvollziehbare Quellen', 'Schnelle Antworten', 'Hilft bei Entscheidungen'] }, elevenlabs: { desc: 'Realistische Sprach- und Audioerstellung.', benefits: ['Natürliche Stimmen', 'Mehrere Sprachen', 'Audio bereit zur Veröffentlichung'] }, canva: { desc: 'Professionelle Designs schneller erstellen.', benefits: ['Fertige Vorlagen', 'Schnelle Anpassungen', 'Einfach auf Mobilgeräten'] }, capcut: { desc: 'Schneller Schnitt für Kurzvideos.', benefits: ['Flüssige Bearbeitung', 'Creator-Tools', 'Einfache Exporte'] }, microsoft_365: { desc: 'Dokumente, Cloud und Arbeitstools.', benefits: ['Office-Apps', 'Cloud-Workflow', 'Teamfähig'] }, notion: { desc: 'Planen, schreiben und organisieren an einem Ort.', benefits: ['Klarer Arbeitsbereich', 'Bessere Planung', 'Ideal für Teams'] }, zoom: { desc: 'Zuverlässige Online-Meetings.', benefits: ['Stabile Gespräche', 'Meeting-Funktionen', 'Professionelles Setup'] } },
  es: { chatgpt: { desc: 'Asistente IA versátil para el día a día.', benefits: ['Escritura más fácil', 'Investigación más rápida', 'Ideas de flujo de trabajo'] }, perplexity: { desc: 'Búsqueda rápida con fuentes claras.', benefits: ['Fuentes verificables', 'Respuestas rápidas', 'Útil para decidir'] }, elevenlabs: { desc: 'Creación realista de voz y audio.', benefits: ['Voces naturales', 'Varios idiomas', 'Audio listo para publicar'] }, canva: { desc: 'Crea diseños profesionales más rápido.', benefits: ['Plantillas listas', 'Ediciones rápidas', 'Fácil en móvil'] }, capcut: { desc: 'Edición rápida para vídeos cortos.', benefits: ['Montaje ágil', 'Herramientas para creadores', 'Exportación sencilla'] }, microsoft_365: { desc: 'Documentos, nube y herramientas de trabajo.', benefits: ['Apps de Office', 'Trabajo en la nube', 'Listo para equipos'] }, notion: { desc: 'Planifica, escribe y organiza todo en un solo lugar.', benefits: ['Espacio claro', 'Mejor organización', 'Pensado para equipos'] }, zoom: { desc: 'Reuniones online fiables.', benefits: ['Llamadas estables', 'Herramientas de reunión', 'Configuración profesional'] } },
  it: { chatgpt: { desc: 'Assistente IA versatile per l’uso quotidiano.', benefits: ['Scrittura più semplice', 'Ricerca più rapida', 'Idee per workflow'] }, perplexity: { desc: 'Ricerca veloce con fonti chiare.', benefits: ['Fonti verificabili', 'Risposte rapide', 'Utile per decidere'] }, elevenlabs: { desc: 'Creazione realistica di voce e audio.', benefits: ['Voci naturali', 'Più lingue', 'Audio pronto da pubblicare'] }, canva: { desc: 'Crea grafiche professionali più velocemente.', benefits: ['Template pronti', 'Modifiche rapide', 'Semplice da mobile'] }, capcut: { desc: 'Montaggio rapido per video brevi.', benefits: ['Editing fluido', 'Strumenti per creator', 'Export semplice'] }, microsoft_365: { desc: 'Documenti, cloud e strumenti di lavoro.', benefits: ['App Office', 'Workflow cloud', 'Pronto per i team'] }, notion: { desc: 'Pianifica, scrivi e organizza tutto in un unico spazio.', benefits: ['Spazio chiaro', 'Migliore organizzazione', 'Adatto ai team'] }, zoom: { desc: 'Riunioni online affidabili.', benefits: ['Chiamate stabili', 'Strumenti meeting', 'Configurazione professionale'] } },
  tr: { chatgpt: { desc: 'Günlük işler için güçlü AI asistanı.', benefits: ['Daha kolay yazım', 'Hızlı araştırma', 'İş akışı fikirleri'] }, perplexity: { desc: 'Kaynaklı ve hızlı araştırma aracı.', benefits: ['Net kaynaklar', 'Hızlı yanıtlar', 'Karar vermeyi kolaylaştırır'] }, elevenlabs: { desc: 'Gerçekçi ses ve audio üretimi.', benefits: ['Doğal sesler', 'Çoklu dil desteği', 'Yayına hazır ses'] }, canva: { desc: 'Profesyonel tasarımları daha hızlı hazırla.', benefits: ['Hazır şablonlar', 'Hızlı düzenleme', 'Mobilde kolay kullanım'] }, capcut: { desc: 'Kısa videolar için hızlı kurgu.', benefits: ['Akıcı düzenleme', 'Üretici araçları', 'Kolay dışa aktarma'] }, microsoft_365: { desc: 'Belgeler, bulut ve çalışma araçları.', benefits: ['Office uygulamaları', 'Bulut iş akışı', 'Ekipler için uygun'] }, notion: { desc: 'Planla, yaz ve her şeyi tek yerde düzenle.', benefits: ['Net çalışma alanı', 'Daha iyi planlama', 'Ekip dostu'] }, zoom: { desc: 'Güvenilir çevrim içi toplantılar.', benefits: ['Stabil görüşmeler', 'Toplantı araçları', 'Profesyonel kurulum'] } },
  ar: { chatgpt: { desc: 'مساعد ذكاء اصطناعي متعدد الاستخدامات لعملك اليومي.', benefits: ['كتابة أسهل', 'بحث أسرع', 'أفكار لسير العمل'] }, perplexity: { desc: 'بحث سريع مع مصادر واضحة.', benefits: ['مصادر موثوقة', 'إجابات سريعة', 'يساعدك على اتخاذ القرار'] }, elevenlabs: { desc: 'إنشاء أصوات ومقاطع صوتية واقعية.', benefits: ['أصوات طبيعية', 'لغات متعددة', 'صوت جاهز للنشر'] }, canva: { desc: 'أنشئ تصاميم احترافية بسرعة أكبر.', benefits: ['قوالب جاهزة', 'تعديلات سريعة', 'سهل على الهاتف'] }, capcut: { desc: 'تعديل سريع للفيديوهات القصيرة.', benefits: ['مونتاج سلس', 'أدوات لصناع المحتوى', 'تصدير بسيط'] }, microsoft_365: { desc: 'مستندات وسحابة وأدوات عمل.', benefits: ['تطبيقات Office', 'عمل سحابي', 'مناسب للفِرق'] }, notion: { desc: 'خطّط واكتب ونظّم كل شيء في مكان واحد.', benefits: ['مساحة واضحة', 'تنظيم أفضل', 'مناسب للفِرق'] }, zoom: { desc: 'اجتماعات عبر الإنترنت موثوقة.', benefits: ['مكالمات مستقرة', 'أدوات اجتماعات', 'إعداد احترافي'] } },
};

const langTint: Record<LangKey, string> = { en: 'hsl(var(--primary))', fr: 'hsl(var(--secondary))', nl: '#25D366', de: 'hsl(var(--accent))', es: '#F5C542', it: '#25D366', tr: 'hsl(var(--primary))', ar: 'hsl(var(--secondary))' };
const fallbackText: Record<LangKey, { received: string; error: string; assistant: string; online: string; soundOff: string; soundOn: string; close: string; play: string; mic: string; send: string; open: string }> = {
  en: { received: 'Bot response received.', error: 'Unable to connect right now. Please try again.', assistant: 'AI Deals Assistant', online: 'Online', soundOff: 'Turn sound off', soundOn: 'Turn sound on', close: 'Close chatbot', play: 'Play message', mic: 'Press to talk', send: 'Send message', open: 'Open AI Deals chatbot' },
  fr: { received: 'Réponse du bot reçue.', error: 'Connexion impossible pour le moment. Veuillez réessayer.', assistant: 'Assistant AI Deals', online: 'En ligne', soundOff: 'Couper le son', soundOn: 'Activer le son', close: 'Fermer le chat', play: 'Lire le message', mic: 'Parler', send: 'Envoyer le message', open: 'Ouvrir le chatbot AI Deals' },
  nl: { received: 'Botantwoord ontvangen.', error: 'Kan nu geen verbinding maken. Probeer opnieuw.', assistant: 'AI Deals Assistent', online: 'Online', soundOff: 'Geluid uit', soundOn: 'Geluid aan', close: 'Chatbot sluiten', play: 'Bericht afspelen', mic: 'Druk om te praten', send: 'Bericht verzenden', open: 'Open AI Deals chatbot' },
  de: { received: 'Bot-Antwort erhalten.', error: 'Verbindung derzeit nicht möglich. Bitte erneut versuchen.', assistant: 'AI Deals Assistent', online: 'Online', soundOff: 'Ton ausschalten', soundOn: 'Ton einschalten', close: 'Chatbot schließen', play: 'Nachricht abspielen', mic: 'Zum Sprechen drücken', send: 'Nachricht senden', open: 'AI Deals Chatbot öffnen' },
  es: { received: 'Respuesta del bot recibida.', error: 'No se puede conectar ahora. Inténtalo de nuevo.', assistant: 'Asistente AI Deals', online: 'En línea', soundOff: 'Desactivar sonido', soundOn: 'Activar sonido', close: 'Cerrar chatbot', play: 'Reproducir mensaje', mic: 'Pulsa para hablar', send: 'Enviar mensaje', open: 'Abrir chatbot AI Deals' },
  it: { received: 'Risposta del bot ricevuta.', error: 'Impossibile connettersi ora. Riprova.', assistant: 'Assistente AI Deals', online: 'Online', soundOff: 'Disattiva audio', soundOn: 'Attiva audio', close: 'Chiudi chatbot', play: 'Riproduci messaggio', mic: 'Premi per parlare', send: 'Invia messaggio', open: 'Apri chatbot AI Deals' },
  tr: { received: 'Yanıt alındı.', error: 'Şu anda bağlantı kurulamadı. Lütfen tekrar dene.', assistant: 'AI Deals Asistanı', online: 'Çevrim içi', soundOff: 'Sesi kapat', soundOn: 'Sesi aç', close: 'Sohbeti kapat', play: 'Mesajı oynat', mic: 'Konuşmak için bas', send: 'Mesaj gönder', open: 'AI Deals sohbetini aç' },
  ar: { received: 'تم استلام رد البوت.', error: 'تعذر الاتصال حالياً، حاول مرة أخرى.', assistant: 'مساعد AI Deals', online: 'متصل', soundOff: 'إيقاف الصوت', soundOn: 'تشغيل الصوت', close: 'إغلاق الدردشة', play: 'تشغيل الرسالة', mic: 'اضغط للتحدث', send: 'إرسال الرسالة', open: 'افتح دردشة AI Deals' },
};

const useLang = () => {
  const { i18n } = useTranslation();
  const raw = (i18n.language || document.documentElement.lang || 'en').split('-')[0].toLowerCase();
  return (supported.includes(raw as LangKey) ? raw : 'en') as LangKey;
};

const RobotAvatar = forwardRef<HTMLSpanElement, { className?: string; lang?: LangKey; speaking?: boolean; rounded?: string }>(({ className = 'w-9 h-9', lang = 'en', speaking = false, rounded = 'rounded-full' }, ref) => (
  <span ref={ref} className={`relative inline-flex shrink-0 ${className}`} style={{ '--avatar-tint': langTint[lang] } as CSSProperties}>
    <span className={`chatbot-avatar-shell ${speaking ? 'chatbot-avatar-speaking' : ''} ${rounded}`}>
      <img src={robotAvatar} alt="AI Deals Assistant robot avatar" width={448} height={448} loading="lazy" className={`h-full w-full object-cover ${rounded}`} />
      <span className="chatbot-avatar-blink" />
    </span>
    <span className="absolute -bottom-1 -right-1 rounded-full border border-background bg-muted px-1 text-[8px] font-bold text-foreground shadow-sm">{copy[lang].flag}</span>
  </span>
));
RobotAvatar.displayName = 'RobotAvatar';

export const ChatbotPromoSection = () => {
  const { t } = useTranslation();
  const bullets = t('chatbot.bullets', { returnObjects: true }) as string[];
  const preview = t('chatbot.preview', { returnObjects: true }) as string[];

  return (
    <section className="py-24 relative overflow-hidden" id="chatbot-promo">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="glass rounded-3xl p-8 md:p-12 max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 text-primary text-sm font-medium mb-6 glass"><RobotAvatar className="w-5 h-5" />{t('chatbot.promoBadge')}</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-5 leading-tight">{t('chatbot.promoTitle')} <span className="gradient-text">{t('chatbot.promoHighlight')}</span></h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-7">{t('chatbot.promoDescription')}</p>
              <div className="grid sm:grid-cols-2 gap-3 mb-8">{bullets.map((item) => <div key={item} className="flex items-center gap-3 text-sm text-foreground"><CheckCircle className="w-4 h-4 text-primary shrink-0" />{item}</div>)}</div>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center"><Button variant="hero" size="lg" asChild><Link to="/store">{t('chatbot.promoButton')}</Link></Button><p className="text-xs text-muted-foreground">{t('chatbot.promoNote')}</p></div>
            </div>
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.5 }} className="rounded-2xl border border-border bg-muted/20 p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold"><MessageCircle className="w-4 h-4 text-primary" />{t('chatbot.previewTitle')}</div>
              {preview.map((line, index) => <div key={line} className={`rounded-xl px-4 py-3 text-sm ${index % 2 ? 'bg-primary/10 text-foreground ms-8' : 'bg-white/[0.04] text-muted-foreground me-8'}`}>{line}</div>)}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export const ChatbotSalesFlow = () => {
  const location = useLocation();
  const { t } = useTranslation();
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
  const [sending, setSending] = useState(false);
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
    window.speechSynthesis?.cancel?.();
    setSpeakingId(null);
    setListening(false);
    setSending(false);
    setInput('');
    localStorage.removeItem('aiDealsActiveChatFlow');
    localStorage.removeItem('aiDealsActiveFunnel');
    setMessages([initialMessage]);
    setSelected(null);
  }, [lang, initialMessage]);
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
    utterance.rate = lang === 'ar' ? 0.92 : lang === 'tr' ? 0.96 : 0.98;
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

  const getBotText = (data: unknown) => {
    if (typeof data === 'string') return data;
    if (Array.isArray(data)) {
      const firstText = data.map(getBotText).find((value) => value && value !== fallbackText[lang].received);
      return firstText || fallbackText[lang].received;
    }
    if (data && typeof data === 'object') {
      const record = data as Record<string, unknown>;
      const value = record.reply || record.response || record.text || record.message || record.output || record.answer;
      if (typeof value === 'string') return value;
    }
    return fallbackText[lang].received;
  };

  const sendMessage = async () => {
    const value = input.trim();
    if (!value || sending) return;
    setInput('');
    const userMessage: Message = { id: Date.now(), role: 'user', text: value };
    setMessages((current) => [...current, userMessage]);
    setSending(true);
    const messageLanguage = lang;

    try {
      const { data, error } = await supabase.functions.invoke(N8N_CHAT_FUNCTION, {
        body: {
          message: value,
          language: messageLanguage,
          instruction: salesAssistantInstructions[messageLanguage],
        },
      });

      if (error) throw error;
      const botMessage: Message = { id: Date.now() + 1, role: 'bot', text: getBotText(data) };
      setMessages((current) => [...current, botMessage]);
      if (soundOn) window.setTimeout(() => speak(botMessage), 150);
    } catch {
      const botMessage: Message = { id: Date.now() + 1, role: 'bot', text: fallbackText[lang].error };
      setMessages((current) => [...current, botMessage]);
    } finally {
      setSending(false);
    }
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

  if (!ready) return null;

  return (
    <div className={`fixed right-3 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6 sm:gap-3 ${liftForMobileCta ? 'bottom-[calc(6.5rem+env(safe-area-inset-bottom))]' : 'bottom-[calc(1.25rem+env(safe-area-inset-bottom))]'}`}>
      <AnimatePresence>
        {open && (
          <motion.div drag="y" dragConstraints={{ top: 0, bottom: 120 }} dragElastic={0.08} onDragEnd={(_, info) => { if (info.offset.y > 80 || info.velocity.y > 500) setOpen(false); }} initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.96 }} transition={{ duration: 0.22 }} dir={text.dir} className="flex w-[min(calc(100vw-1.5rem),360px)] sm:w-[360px] xl:w-[380px] max-h-[70dvh] flex-col glass-strong rounded-2xl border border-border overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border/60">
              <div className="flex items-center gap-3 min-w-0"><RobotAvatar lang={lang} rounded="rounded-xl" speaking={speakingId !== null} /><div><p className="text-sm font-semibold text-foreground">{fallbackText[lang].assistant}</p><p className="text-[11px] text-muted-foreground flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" />{fallbackText[lang].online}</p></div></div>
              <div className="flex items-center gap-1">
                <button onClick={() => setSoundOn((value) => !value)} className="w-11 h-11 sm:w-9 sm:h-9 rounded-xl hover:bg-muted/50 grid place-items-center transition-colors" aria-label={soundOn ? fallbackText[lang].soundOff : fallbackText[lang].soundOn}>{soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}</button>
                <button onClick={() => setOpen(false)} className="w-11 h-11 sm:w-9 sm:h-9 rounded-xl hover:bg-muted/50 grid place-items-center transition-colors" aria-label={fallbackText[lang].close}><X className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="min-h-0 flex-1 p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto overscroll-contain">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${text.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  {message.role === 'bot' && <RobotAvatar className="w-8 h-8" lang={lang} speaking={speakingId === message.id} />}
                  <div className={`max-w-[84%] break-words ${message.role === 'user' ? 'bg-primary/20 text-foreground' : 'bg-white/[0.04] text-foreground'} rounded-xl px-3 sm:px-4 py-3 text-sm leading-relaxed`}>
                    <div className="flex items-start gap-2">
                      <div className="flex-1 prose prose-sm prose-invert max-w-none prose-p:my-0 prose-ul:my-1 prose-li:my-0"><ReactMarkdown>{message.text}</ReactMarkdown></div>
                      {message.role === 'bot' && <button onClick={() => speak(message)} className="shrink-0 text-muted-foreground hover:text-primary transition-colors" aria-label={fallbackText[lang].play}><Volume2 className="w-3.5 h-3.5" /></button>}
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
                <input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void sendMessage(); }} placeholder={text.input} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" aria-label={fallbackText[lang].send} disabled={sending} />
                <button onClick={startListening} className={`w-11 h-11 sm:w-9 sm:h-9 rounded-xl grid place-items-center transition-colors ${listening ? 'bg-primary/20 text-primary' : 'hover:bg-muted/50 text-muted-foreground'}`} aria-label={fallbackText[lang].mic}><Mic className="w-4 h-4" /></button>
                <button onClick={() => void sendMessage()} disabled={sending} className="w-11 h-11 sm:w-9 sm:h-9 rounded-xl grid place-items-center bg-primary text-primary-foreground hover:scale-105 transition-transform disabled:opacity-60 disabled:hover:scale-100" aria-label={fallbackText[lang].send}><Send className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-end gap-3 translate-y-0">
        <div className="flex flex-col items-end gap-2 sm:gap-3">
          {isUsableSocialLink(socialLinks.whatsapp) && <motion.a href={socialLinks.whatsapp} onClick={(event) => openSocialUrl(event, socialLinks.whatsapp)} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.07, y: -4 }} whileTap={{ scale: 0.96 }} className="chatbot-social-3d chatbot-whatsapp-3d social-link-movie" aria-label="Contact on WhatsApp"><WhatsAppIcon className="w-8 h-8" /></motion.a>}
          {isUsableSocialLink(supportLinks.telegram) && <motion.a href={supportLinks.telegram} onClick={(event) => openSocialUrl(event, supportLinks.telegram)} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.07, y: -4 }} whileTap={{ scale: 0.96 }} className="chatbot-social-3d chatbot-telegram-3d social-link-movie" aria-label="Contact on Telegram"><TelegramIcon className="w-8 h-8" /></motion.a>}
          {isUsableSocialLink(socialLinks.pinterest) && <motion.a href={socialLinks.pinterest} onClick={(event) => openSocialUrl(event, socialLinks.pinterest)} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.07, y: -4 }} whileTap={{ scale: 0.96 }} className="chatbot-social-3d chatbot-pinterest-3d social-link-movie" aria-label="Follow on Pinterest"><PinterestIcon className="w-8 h-8" /></motion.a>}
          {isUsableSocialLink(socialLinks.twitter) && <motion.a href={socialLinks.twitter} onClick={(event) => openSocialUrl(event, socialLinks.twitter)} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.07, y: -4 }} whileTap={{ scale: 0.96 }} className="chatbot-social-3d chatbot-x-3d social-link-movie" aria-label="Follow on X"><XSocialIcon className="w-8 h-8" /></motion.a>}
          {isUsableSocialLink(socialLinks.tiktok) && <motion.a href={socialLinks.tiktok} onClick={(event) => openSocialUrl(event, socialLinks.tiktok)} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.07, y: -4 }} whileTap={{ scale: 0.96 }} className="chatbot-social-3d chatbot-tiktok-3d social-link-movie" aria-label="Follow on TikTok"><TikTokIcon className="w-8 h-8" /></motion.a>}
        </div>
        <motion.button onClick={() => setOpen((value) => !value)} whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.96 }} className="chatbot-main-float" aria-label={fallbackText[lang].open}><RobotAvatar className="w-14 h-14 sm:w-16 sm:h-16" lang={lang} speaking={speakingId !== null} /></motion.button>
      </div>
    </div>
  );
};
