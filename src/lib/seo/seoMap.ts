// Localized SEO metadata per route × language.
// 7 languages: en, fr, nl, de, es, pt, ar (Arabic RTL).
// All pages — keyword cluster aligned with AI_DEALS_SEO_System_v2.

export const SEO_LANGS = ['en', 'fr', 'nl', 'de', 'es', 'pt', 'ar'] as const;
export type SeoLang = typeof SEO_LANGS[number];

export const SITE_URL = 'https://aideals.be';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/lovable-uploads/64d447c1-4f6f-4d56-8e09-a6f5cc5a84e0.png`;

export interface SeoEntry {
  title: string;
  description: string;
  h1: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  longTail?: string[];
  ogTitle?: string;
  ogDescription?: string;
}

export type SeoPageKey =
  | 'home'
  | 'store'
  | 'about'
  | 'contact'
  | 'blog'
  | 'academy'
  | 'privacy'
  | 'terms'
  | 'dashboard'
  | 'chatgpt-plus-belgium'
  | 'midjourney-subscription-eu'
  | 'office-365-belgium'
  | 'adobe-creative-cloud-eu'
  | 'ai-tool-finder';

export const PAGE_PATHS: Record<SeoPageKey, string> = {
  home: '/',
  store: '/store',
  about: '/about',
  contact: '/contact',
  blog: '/blog',
  academy: '/academy',
  privacy: '/privacy',
  terms: '/terms',
  dashboard: '/dashboard',
  'chatgpt-plus-belgium': '/store?tool=chatgpt-plus',
  'midjourney-subscription-eu': '/store?tool=midjourney',
  'office-365-belgium': '/store?tool=office-365',
  'adobe-creative-cloud-eu': '/store?tool=adobe-creative-cloud',
  'ai-tool-finder': '/store#ai-tool-finder',
};

// Compact, conversion-focused copy — under 60ch titles, under 158ch descriptions.
export const SEO_MAP: Record<SeoPageKey, Record<SeoLang, SeoEntry>> = {
  home: {
    en: {
      title: 'AI DEALS — Premium AI Tools at Member Pricing | Europe',
      description: 'Instant access to ChatGPT, Midjourney, Claude & 50+ premium AI tools at member pricing. GDPR-principled. 24h activation. Cancel anytime.',
      h1: 'Premium AI Tools at Member Pricing',
      primaryKeyword: 'premium AI tools subscription',
      secondaryKeywords: ['ChatGPT subscription Europe', 'Midjourney access', 'Claude AI Europe', 'managed AI access'],
      longTail: ['cheapest ChatGPT Plus alternative Europe', 'how to access Midjourney without credit card'],
    },
    fr: {
      title: 'AI DEALS — Outils IA Premium au Tarif Membre | Europe',
      description: 'Accès instantané à ChatGPT, Midjourney, Claude et 50+ outils IA premium au tarif membre. RGPD. Activation 24h. Sans engagement.',
      h1: 'Outils IA Premium au Tarif Membre',
      primaryKeyword: 'abonnement outils IA premium',
      secondaryKeywords: ['ChatGPT abonnement Belgique', 'Midjourney accès', 'Claude IA Europe', 'accès IA géré'],
      longTail: ['alternative pas chère à ChatGPT Plus', 'accès Midjourney sans carte bancaire'],
    },
    nl: {
      title: 'AI DEALS — Premium AI-tools tegen Ledenprijs | Europa',
      description: 'Directe toegang tot ChatGPT, Midjourney, Claude en 50+ premium AI-tools tegen ledenprijs. AVG-principes. 24u activatie. Maandelijks opzegbaar.',
      h1: 'Premium AI-tools tegen Ledenprijs',
      primaryKeyword: 'premium AI tools abonnement',
      secondaryKeywords: ['ChatGPT abonnement België', 'Midjourney toegang', 'Claude AI Europa', 'beheerde AI toegang'],
      longTail: ['goedkoopste ChatGPT Plus alternatief', 'Midjourney zonder creditcard'],
    },
    de: {
      title: 'AI DEALS — Premium-KI-Tools zum Mitgliederpreis | Europa',
      description: 'Sofortzugriff auf ChatGPT, Midjourney, Claude und 50+ Premium-KI-Tools zum Mitgliederpreis. DSGVO-konform. 24h Aktivierung. Monatlich kündbar.',
      h1: 'Premium-KI-Tools zum Mitgliederpreis',
      primaryKeyword: 'KI-Tools Abo Europa',
      secondaryKeywords: ['ChatGPT Abo Deutschland', 'Midjourney Zugang', 'Claude KI Europa', 'verwalteter KI-Zugang'],
      longTail: ['günstigste ChatGPT Plus Alternative', 'Midjourney ohne Kreditkarte'],
    },
    es: {
      title: 'AI DEALS — Herramientas IA Premium a Precio Miembro | Europa',
      description: 'Acceso instantáneo a ChatGPT, Midjourney, Claude y 50+ herramientas IA premium a precio miembro. RGPD. Activación 24h. Cancela cuando quieras.',
      h1: 'Herramientas IA Premium a Precio Miembro',
      primaryKeyword: 'suscripción herramientas IA premium',
      secondaryKeywords: ['ChatGPT suscripción Europa', 'acceso Midjourney', 'Claude IA Europa', 'acceso IA gestionado'],
      longTail: ['alternativa barata a ChatGPT Plus', 'Midjourney sin tarjeta de crédito'],
    },
    pt: {
      title: 'AI DEALS — Ferramentas IA Premium a Preço Membro | Europa',
      description: 'Acesso instantâneo a ChatGPT, Midjourney, Claude e 50+ ferramentas IA premium a preço membro. RGPD. Ativação em 24h. Cancele quando quiser.',
      h1: 'Ferramentas IA Premium a Preço Membro',
      primaryKeyword: 'subscrição ferramentas IA premium',
      secondaryKeywords: ['ChatGPT subscrição Europa', 'acesso Midjourney', 'Claude IA Europa', 'acesso IA gerido'],
      longTail: ['alternativa barata ao ChatGPT Plus', 'Midjourney sem cartão de crédito'],
    },
    ar: {
      title: 'AI DEALS — أدوات ذكاء اصطناعي بسعر الأعضاء | أوروبا',
      description: 'وصول فوري إلى ChatGPT و Midjourney و Claude وأكثر من 50 أداة ذكاء اصطناعي بسعر الأعضاء. متوافق مع GDPR. تفعيل خلال 24 ساعة. إلغاء في أي وقت.',
      h1: 'أدوات الذكاء الاصطناعي المتميزة بسعر الأعضاء',
      primaryKeyword: 'اشتراك أدوات الذكاء الاصطناعي',
      secondaryKeywords: ['اشتراك ChatGPT أوروبا', 'الوصول إلى Midjourney', 'Claude للذكاء الاصطناعي', 'وصول مُدار للذكاء الاصطناعي'],
      longTail: ['أرخص بديل لـ ChatGPT Plus', 'Midjourney بدون بطاقة ائتمان'],
    },
  },

  store: {
    en: {
      title: 'AI Tools Store — ChatGPT, Midjourney, Claude & More',
      description: 'Browse 50+ verified AI tools at member pricing. Instant activation, encrypted vault, monthly billing. Find the right AI tool in under a minute.',
      h1: 'The Complete AI Tools Store',
      primaryKeyword: 'AI tools store Europe',
      secondaryKeywords: ['buy ChatGPT access', 'Midjourney subscription', 'Claude Pro Europe', 'AI software shop'],
      longTail: ['best place to buy ChatGPT subscription Europe', 'compare AI tool subscriptions'],
    },
    fr: {
      title: 'Boutique d\'Outils IA — ChatGPT, Midjourney, Claude',
      description: 'Parcourez 50+ outils IA vérifiés au tarif membre. Activation immédiate, coffre chiffré, facturation mensuelle. Trouvez l\'outil IA en moins d\'une minute.',
      h1: 'La Boutique Complète d\'Outils IA',
      primaryKeyword: 'boutique outils IA Europe',
      secondaryKeywords: ['acheter accès ChatGPT', 'abonnement Midjourney', 'Claude Pro Europe', 'magasin logiciels IA'],
      longTail: ['où acheter abonnement ChatGPT en Belgique', 'comparer abonnements IA'],
    },
    nl: {
      title: 'AI-tools Winkel — ChatGPT, Midjourney, Claude en meer',
      description: 'Bekijk 50+ geverifieerde AI-tools tegen ledenprijs. Directe activatie, versleutelde kluis, maandelijkse facturatie. Vind de juiste AI-tool in een minuut.',
      h1: 'De Complete AI-tools Winkel',
      primaryKeyword: 'AI tools winkel Europa',
      secondaryKeywords: ['ChatGPT toegang kopen', 'Midjourney abonnement', 'Claude Pro Europa', 'AI software winkel'],
      longTail: ['waar ChatGPT abonnement kopen België', 'AI abonnementen vergelijken'],
    },
    de: {
      title: 'KI-Tools Shop — ChatGPT, Midjourney, Claude & mehr',
      description: '50+ verifizierte KI-Tools zum Mitgliederpreis. Sofortige Aktivierung, verschlüsselter Tresor, monatliche Abrechnung. KI-Tool in unter einer Minute finden.',
      h1: 'Der Komplette KI-Tools Shop',
      primaryKeyword: 'KI-Tools Shop Europa',
      secondaryKeywords: ['ChatGPT Zugang kaufen', 'Midjourney Abo', 'Claude Pro Europa', 'KI-Software Shop'],
      longTail: ['wo ChatGPT Abo kaufen Deutschland', 'KI-Abos vergleichen'],
    },
    es: {
      title: 'Tienda de Herramientas IA — ChatGPT, Midjourney, Claude',
      description: '50+ herramientas IA verificadas a precio miembro. Activación inmediata, bóveda cifrada, facturación mensual. Encuentra la herramienta IA en un minuto.',
      h1: 'La Tienda Completa de Herramientas IA',
      primaryKeyword: 'tienda herramientas IA Europa',
      secondaryKeywords: ['comprar acceso ChatGPT', 'suscripción Midjourney', 'Claude Pro Europa', 'tienda software IA'],
      longTail: ['dónde comprar suscripción ChatGPT Europa', 'comparar suscripciones IA'],
    },
    pt: {
      title: 'Loja de Ferramentas IA — ChatGPT, Midjourney, Claude',
      description: '50+ ferramentas IA verificadas a preço membro. Ativação imediata, cofre encriptado, faturação mensal. Encontre a ferramenta IA em menos de um minuto.',
      h1: 'A Loja Completa de Ferramentas IA',
      primaryKeyword: 'loja ferramentas IA Europa',
      secondaryKeywords: ['comprar acesso ChatGPT', 'subscrição Midjourney', 'Claude Pro Europa', 'loja software IA'],
      longTail: ['onde comprar subscrição ChatGPT Europa', 'comparar subscrições IA'],
    },
    ar: {
      title: 'متجر أدوات الذكاء الاصطناعي — ChatGPT و Midjourney',
      description: 'تصفح أكثر من 50 أداة ذكاء اصطناعي موثقة بسعر الأعضاء. تفعيل فوري، خزنة مشفرة، فوترة شهرية. اعثر على الأداة المناسبة خلال دقيقة.',
      h1: 'متجر أدوات الذكاء الاصطناعي الكامل',
      primaryKeyword: 'متجر أدوات الذكاء الاصطناعي',
      secondaryKeywords: ['شراء وصول ChatGPT', 'اشتراك Midjourney', 'Claude Pro أوروبا', 'متجر برامج الذكاء الاصطناعي'],
      longTail: ['أين أشتري اشتراك ChatGPT في أوروبا', 'مقارنة اشتراكات الذكاء الاصطناعي'],
    },
  },

  about: {
    en: { title: 'About AI DEALS — Trust, Privacy & Member Pricing', description: 'Built in Europe with GDPR principles. Discover how AI DEALS gives students and creators safe, affordable access to premium AI tools worldwide.', h1: 'About AI DEALS', primaryKeyword: 'about AI DEALS', secondaryKeywords: ['AI tools company Europe', 'GDPR AI platform', 'trusted AI subscriptions'] },
    fr: { title: 'À propos d\'AI DEALS — Confiance & Tarif Membre', description: 'Conçu en Europe selon les principes du RGPD. Découvrez comment AI DEALS offre un accès sûr et abordable aux outils IA premium dans le monde entier.', h1: 'À propos d\'AI DEALS', primaryKeyword: 'à propos AI DEALS', secondaryKeywords: ['société outils IA Europe', 'plateforme IA RGPD', 'abonnements IA fiables'] },
    nl: { title: 'Over AI DEALS — Vertrouwen, Privacy & Ledenprijs', description: 'Gebouwd in Europa volgens AVG-principes. Ontdek hoe AI DEALS studenten en creatievelingen wereldwijd veilige toegang biedt tot premium AI-tools.', h1: 'Over AI DEALS', primaryKeyword: 'over AI DEALS', secondaryKeywords: ['AI-tools bedrijf Europa', 'AVG AI-platform', 'betrouwbare AI-abonnementen'] },
    de: { title: 'Über AI DEALS — Vertrauen & Mitgliederpreis', description: 'In Europa nach DSGVO-Prinzipien entwickelt. Erfahren Sie, wie AI DEALS sicheren, bezahlbaren Zugang zu Premium-KI-Tools weltweit bietet.', h1: 'Über AI DEALS', primaryKeyword: 'über AI DEALS', secondaryKeywords: ['KI-Tools Unternehmen Europa', 'DSGVO KI-Plattform', 'vertrauenswürdige KI-Abos'] },
    es: { title: 'Sobre AI DEALS — Confianza, Privacidad y Precio Miembro', description: 'Construido en Europa con principios RGPD. Descubre cómo AI DEALS ofrece acceso seguro y asequible a herramientas IA premium en todo el mundo.', h1: 'Sobre AI DEALS', primaryKeyword: 'sobre AI DEALS', secondaryKeywords: ['empresa herramientas IA Europa', 'plataforma IA RGPD', 'suscripciones IA confiables'] },
    pt: { title: 'Sobre AI DEALS — Confiança e Preço Membro', description: 'Construído na Europa segundo princípios RGPD. Descubra como AI DEALS oferece acesso seguro e acessível a ferramentas IA premium no mundo inteiro.', h1: 'Sobre AI DEALS', primaryKeyword: 'sobre AI DEALS', secondaryKeywords: ['empresa ferramentas IA Europa', 'plataforma IA RGPD', 'subscrições IA confiáveis'] },
    ar: { title: 'عن AI DEALS — الثقة والخصوصية وسعر الأعضاء', description: 'تأسست في أوروبا وفق مبادئ GDPR. اكتشف كيف يوفر AI DEALS وصولاً آمناً وبأسعار معقولة لأدوات الذكاء الاصطناعي حول العالم.', h1: 'عن AI DEALS', primaryKeyword: 'عن AI DEALS', secondaryKeywords: ['شركة أدوات الذكاء الاصطناعي', 'منصة GDPR للذكاء الاصطناعي', 'اشتراكات ذكاء اصطناعي موثوقة'] },
  },

  contact: {
    en: { title: 'Contact AI DEALS — Support, Sales & Partnerships', description: 'Reach the AI DEALS team for support, partnerships or press. Average response under 6 hours. Brussels-based, serving Europe and the world.', h1: 'Contact AI DEALS', primaryKeyword: 'contact AI DEALS support', secondaryKeywords: ['AI tools support Europe', 'AI DEALS partnerships', 'AI DEALS Brussels'] },
    fr: { title: 'Contact AI DEALS — Support, Ventes & Partenariats', description: 'Contactez l\'équipe AI DEALS pour support, partenariats ou presse. Réponse moyenne en moins de 6 heures. Basés à Bruxelles, partout en Europe.', h1: 'Contacter AI DEALS', primaryKeyword: 'contact support AI DEALS', secondaryKeywords: ['support outils IA Europe', 'partenariats AI DEALS', 'AI DEALS Bruxelles'] },
    nl: { title: 'Contact AI DEALS — Support, Sales & Partnerships', description: 'Bereik het AI DEALS-team voor support, partnerships of pers. Gemiddelde reactietijd onder 6 uur. Gevestigd in Brussel, actief in heel Europa.', h1: 'Contact AI DEALS', primaryKeyword: 'contact AI DEALS support', secondaryKeywords: ['AI tools support Europa', 'AI DEALS partnerships', 'AI DEALS Brussel'] },
    de: { title: 'AI DEALS Kontakt — Support, Sales & Partner', description: 'Kontaktieren Sie das AI DEALS Team für Support, Partnerschaften oder Presse. Antwort im Durchschnitt unter 6 Stunden. Brüssel, ganz Europa.', h1: 'Kontakt AI DEALS', primaryKeyword: 'AI DEALS Support kontaktieren', secondaryKeywords: ['KI-Tools Support Europa', 'AI DEALS Partnerschaften', 'AI DEALS Brüssel'] },
    es: { title: 'Contacto AI DEALS — Soporte, Ventas y Alianzas', description: 'Contacta al equipo de AI DEALS para soporte, alianzas o prensa. Respuesta media en menos de 6 horas. Basados en Bruselas, en toda Europa.', h1: 'Contactar AI DEALS', primaryKeyword: 'contactar soporte AI DEALS', secondaryKeywords: ['soporte herramientas IA Europa', 'alianzas AI DEALS', 'AI DEALS Bruselas'] },
    pt: { title: 'Contacto AI DEALS — Suporte, Vendas e Parcerias', description: 'Contacte a equipa AI DEALS para suporte, parcerias ou imprensa. Resposta média em menos de 6 horas. Sediados em Bruxelas, em toda a Europa.', h1: 'Contactar AI DEALS', primaryKeyword: 'contactar suporte AI DEALS', secondaryKeywords: ['suporte ferramentas IA Europa', 'parcerias AI DEALS', 'AI DEALS Bruxelas'] },
    ar: { title: 'تواصل مع AI DEALS — الدعم والمبيعات والشراكات', description: 'تواصل مع فريق AI DEALS للدعم أو الشراكات أو الصحافة. متوسط الرد أقل من 6 ساعات. من بروكسل إلى كل أوروبا والعالم.', h1: 'تواصل مع AI DEALS', primaryKeyword: 'تواصل دعم AI DEALS', secondaryKeywords: ['دعم أدوات الذكاء الاصطناعي', 'شراكات AI DEALS', 'AI DEALS بروكسل'] },
  },

  blog: {
    en: { title: 'AI DEALS Blog — Tutorials, Guides & AI News', description: 'Practical tutorials and deep dives on ChatGPT, Midjourney, Claude, automation and AI workflows. New articles every week.', h1: 'AI Tutorials, Guides & News', primaryKeyword: 'AI tutorials blog', secondaryKeywords: ['ChatGPT tutorials', 'Midjourney guide', 'AI workflow tips'] },
    fr: { title: 'Blog AI DEALS — Tutoriels, Guides & Actu IA', description: 'Tutoriels pratiques et analyses approfondies sur ChatGPT, Midjourney, Claude, automatisation et workflows IA. Nouveaux articles chaque semaine.', h1: 'Tutoriels, Guides & Actu IA', primaryKeyword: 'blog tutoriels IA', secondaryKeywords: ['tutoriels ChatGPT', 'guide Midjourney', 'astuces workflow IA'] },
    nl: { title: 'AI DEALS Blog — Tutorials, Gidsen & AI-nieuws', description: 'Praktische tutorials en diepgaande analyses over ChatGPT, Midjourney, Claude, automatisering en AI-workflows. Elke week nieuwe artikelen.', h1: 'AI Tutorials, Gidsen & Nieuws', primaryKeyword: 'AI tutorials blog', secondaryKeywords: ['ChatGPT tutorials', 'Midjourney gids', 'AI workflow tips'] },
    de: { title: 'AI DEALS Blog — Tutorials, Guides & KI-News', description: 'Praktische Tutorials und Deep Dives zu ChatGPT, Midjourney, Claude, Automatisierung und KI-Workflows. Jede Woche neue Artikel.', h1: 'KI-Tutorials, Guides & News', primaryKeyword: 'KI Tutorials Blog', secondaryKeywords: ['ChatGPT Tutorials', 'Midjourney Guide', 'KI Workflow Tipps'] },
    es: { title: 'Blog AI DEALS — Tutoriales, Guías y Noticias IA', description: 'Tutoriales prácticos y análisis profundos sobre ChatGPT, Midjourney, Claude, automatización y flujos IA. Nuevos artículos cada semana.', h1: 'Tutoriales, Guías y Noticias IA', primaryKeyword: 'blog tutoriales IA', secondaryKeywords: ['tutoriales ChatGPT', 'guía Midjourney', 'consejos flujo IA'] },
    pt: { title: 'Blog AI DEALS — Tutoriais, Guias e Notícias IA', description: 'Tutoriais práticos e análises aprofundadas sobre ChatGPT, Midjourney, Claude, automação e fluxos IA. Novos artigos todas as semanas.', h1: 'Tutoriais, Guias e Notícias IA', primaryKeyword: 'blog tutoriais IA', secondaryKeywords: ['tutoriais ChatGPT', 'guia Midjourney', 'dicas fluxo IA'] },
    ar: { title: 'مدونة AI DEALS — دروس وأدلة وأخبار الذكاء الاصطناعي', description: 'دروس عملية وتحليلات معمقة حول ChatGPT و Midjourney و Claude والأتمتة وسير العمل بالذكاء الاصطناعي. مقالات جديدة كل أسبوع.', h1: 'دروس وأدلة وأخبار الذكاء الاصطناعي', primaryKeyword: 'مدونة دروس الذكاء الاصطناعي', secondaryKeywords: ['دروس ChatGPT', 'دليل Midjourney', 'نصائح سير عمل الذكاء الاصطناعي'] },
  },

  academy: {
    en: { title: 'AI Academy — Learn AI from Scratch to Pro', description: 'Structured AI Academy: prompt engineering, image gen, automation. Hands-on lessons, real projects, certificate. Built by practitioners.', h1: 'The AI DEALS Academy', primaryKeyword: 'AI academy online course', secondaryKeywords: ['learn ChatGPT', 'prompt engineering course', 'AI for beginners'] },
    fr: { title: 'AI Academy — Apprenez l\'IA de zéro à pro', description: 'Académie IA structurée : prompt engineering, génération d\'images, automatisation. Leçons pratiques, vrais projets, certificat. Conçu par des pros.', h1: 'L\'Académie AI DEALS', primaryKeyword: 'cours académie IA en ligne', secondaryKeywords: ['apprendre ChatGPT', 'cours prompt engineering', 'IA pour débutants'] },
    nl: { title: 'AI Academy — Leer AI van nul tot pro', description: 'Gestructureerde AI Academy: prompt engineering, beeldgeneratie, automatisering. Praktische lessen, echte projecten, certificaat. Door experts gemaakt.', h1: 'De AI DEALS Academy', primaryKeyword: 'AI academy online cursus', secondaryKeywords: ['ChatGPT leren', 'cursus prompt engineering', 'AI voor beginners'] },
    de: { title: 'AI Academy — KI lernen vom Anfänger zum Profi', description: 'Strukturierte KI-Academy: Prompt Engineering, Bildgenerierung, Automatisierung. Praktische Lektionen, echte Projekte, Zertifikat. Von Profis gebaut.', h1: 'Die AI DEALS Academy', primaryKeyword: 'KI Academy Online Kurs', secondaryKeywords: ['ChatGPT lernen', 'Prompt Engineering Kurs', 'KI für Anfänger'] },
    es: { title: 'AI Academy — Aprende IA desde cero a profesional', description: 'Academia IA estructurada: prompt engineering, generación de imágenes, automatización. Lecciones prácticas, proyectos reales, certificado.', h1: 'La Academia AI DEALS', primaryKeyword: 'curso academia IA online', secondaryKeywords: ['aprender ChatGPT', 'curso prompt engineering', 'IA para principiantes'] },
    pt: { title: 'AI Academy — Aprende IA do zero a profissional', description: 'Academia IA estruturada: prompt engineering, geração de imagens, automação. Lições práticas, projetos reais, certificado. Feito por profissionais.', h1: 'A Academia AI DEALS', primaryKeyword: 'curso academia IA online', secondaryKeywords: ['aprender ChatGPT', 'curso prompt engineering', 'IA para iniciantes'] },
    ar: { title: 'AI Academy — تعلم الذكاء الاصطناعي من الصفر للاحتراف', description: 'أكاديمية ذكاء اصطناعي منظمة: هندسة الأوامر، توليد الصور، الأتمتة. دروس عملية، مشاريع حقيقية، وشهادة. من إعداد محترفين.', h1: 'أكاديمية AI DEALS', primaryKeyword: 'دورة أكاديمية الذكاء الاصطناعي', secondaryKeywords: ['تعلم ChatGPT', 'دورة هندسة الأوامر', 'الذكاء الاصطناعي للمبتدئين'] },
  },

  privacy: {
    en: { title: 'Privacy Policy — AI DEALS (GDPR Principles)', description: 'How AI DEALS collects, processes and protects your data. Built on GDPR principles: minimisation, purpose limitation, encryption, no data selling.', h1: 'Privacy Policy', primaryKeyword: 'AI DEALS privacy policy', secondaryKeywords: ['GDPR AI tools', 'data protection AI', 'AI subscription privacy'] },
    fr: { title: 'Politique de Confidentialité — AI DEALS (RGPD)', description: 'Comment AI DEALS collecte, traite et protège vos données. Fondé sur le RGPD : minimisation, limitation, chiffrement, aucune revente.', h1: 'Politique de Confidentialité', primaryKeyword: 'politique confidentialité AI DEALS', secondaryKeywords: ['RGPD outils IA', 'protection données IA', 'confidentialité abonnement IA'] },
    nl: { title: 'Privacybeleid — AI DEALS (AVG-principes)', description: 'Hoe AI DEALS jouw gegevens verzamelt, verwerkt en beschermt. Gebouwd op AVG: minimalisatie, doelbinding, encryptie, geen dataverkoop.', h1: 'Privacybeleid', primaryKeyword: 'AI DEALS privacybeleid', secondaryKeywords: ['AVG AI-tools', 'gegevensbescherming AI', 'AI abonnement privacy'] },
    de: { title: 'Datenschutzerklärung — AI DEALS (DSGVO)', description: 'Wie AI DEALS Ihre Daten erhebt, verarbeitet und schützt. Auf DSGVO-Prinzipien aufgebaut: Minimierung, Zweckbindung, Verschlüsselung.', h1: 'Datenschutzerklärung', primaryKeyword: 'AI DEALS Datenschutz', secondaryKeywords: ['DSGVO KI-Tools', 'Datenschutz KI', 'KI-Abo Datenschutz'] },
    es: { title: 'Política de Privacidad — AI DEALS (RGPD)', description: 'Cómo AI DEALS recopila, procesa y protege tus datos. Basado en RGPD: minimización, limitación de finalidad, cifrado, sin venta de datos.', h1: 'Política de Privacidad', primaryKeyword: 'política privacidad AI DEALS', secondaryKeywords: ['RGPD herramientas IA', 'protección datos IA', 'privacidad suscripción IA'] },
    pt: { title: 'Política de Privacidade — AI DEALS (RGPD)', description: 'Como a AI DEALS recolhe, processa e protege os seus dados. Construído sobre RGPD: minimização, limitação, encriptação, sem venda de dados.', h1: 'Política de Privacidade', primaryKeyword: 'política privacidade AI DEALS', secondaryKeywords: ['RGPD ferramentas IA', 'proteção dados IA', 'privacidade subscrição IA'] },
    ar: { title: 'سياسة الخصوصية — AI DEALS (مبادئ GDPR)', description: 'كيف يجمع AI DEALS بياناتك ويعالجها ويحميها. مبني على مبادئ GDPR: تقليل البيانات، تحديد الغرض، التشفير، وعدم البيع.', h1: 'سياسة الخصوصية', primaryKeyword: 'سياسة خصوصية AI DEALS', secondaryKeywords: ['GDPR أدوات الذكاء الاصطناعي', 'حماية بيانات الذكاء الاصطناعي', 'خصوصية اشتراك الذكاء الاصطناعي'] },
  },

  terms: {
    en: { title: 'Terms of Service — AI DEALS', description: 'Clear, fair terms for using AI DEALS managed access platform. Member pricing, billing, cancellation and acceptable use, in plain language.', h1: 'Terms of Service', primaryKeyword: 'AI DEALS terms of service', secondaryKeywords: ['AI subscription terms', 'managed access terms', 'AI tools acceptable use'] },
    fr: { title: 'Conditions d\'Utilisation — AI DEALS', description: 'Conditions claires et équitables pour utiliser AI DEALS. Tarif membre, facturation, résiliation et usage acceptable, en langage simple.', h1: 'Conditions d\'Utilisation', primaryKeyword: 'conditions utilisation AI DEALS', secondaryKeywords: ['conditions abonnement IA', 'conditions accès géré', 'usage acceptable outils IA'] },
    nl: { title: 'Algemene Voorwaarden — AI DEALS', description: 'Duidelijke, eerlijke voorwaarden voor het gebruik van AI DEALS. Ledenprijs, facturatie, opzegging en gebruiksvoorwaarden, in begrijpelijke taal.', h1: 'Algemene Voorwaarden', primaryKeyword: 'algemene voorwaarden AI DEALS', secondaryKeywords: ['voorwaarden AI abonnement', 'beheerde toegang voorwaarden', 'AI tools gebruik'] },
    de: { title: 'Nutzungsbedingungen — AI DEALS', description: 'Klare, faire Bedingungen für die Nutzung von AI DEALS. Mitgliederpreis, Abrechnung, Kündigung und Nutzungsregeln, in einfacher Sprache.', h1: 'Nutzungsbedingungen', primaryKeyword: 'AI DEALS Nutzungsbedingungen', secondaryKeywords: ['KI Abo Bedingungen', 'verwalteter Zugang Bedingungen', 'KI-Tools Nutzung'] },
    es: { title: 'Términos de Servicio — AI DEALS', description: 'Términos claros y justos para usar AI DEALS. Precio miembro, facturación, cancelación y uso aceptable, en lenguaje sencillo.', h1: 'Términos de Servicio', primaryKeyword: 'términos servicio AI DEALS', secondaryKeywords: ['términos suscripción IA', 'términos acceso gestionado', 'uso herramientas IA'] },
    pt: { title: 'Termos de Serviço — AI DEALS', description: 'Termos claros e justos para usar a AI DEALS. Preço membro, faturação, cancelamento e uso aceitável, em linguagem simples.', h1: 'Termos de Serviço', primaryKeyword: 'termos serviço AI DEALS', secondaryKeywords: ['termos subscrição IA', 'termos acesso gerido', 'uso ferramentas IA'] },
    ar: { title: 'شروط الخدمة — AI DEALS', description: 'شروط واضحة وعادلة لاستخدام AI DEALS. سعر الأعضاء، الفوترة، الإلغاء، والاستخدام المقبول بلغة بسيطة.', h1: 'شروط الخدمة', primaryKeyword: 'شروط خدمة AI DEALS', secondaryKeywords: ['شروط اشتراك الذكاء الاصطناعي', 'شروط الوصول المُدار', 'استخدام أدوات الذكاء الاصطناعي'] },
  },

  dashboard: {
    en: { title: 'My Vault — Manage Your AI Subscriptions | AI DEALS', description: 'Your encrypted AI vault. Manage active tools, billing, credentials and renewals — all in one place. Members only.', h1: 'My AI Vault', primaryKeyword: 'AI subscriptions dashboard', secondaryKeywords: ['manage AI tools', 'AI vault', 'AI subscription manager'] },
    fr: { title: 'Mon Coffre — Gérez vos Abonnements IA | AI DEALS', description: 'Votre coffre IA chiffré. Gérez outils actifs, facturation, identifiants et renouvellements — tout au même endroit. Réservé aux membres.', h1: 'Mon Coffre IA', primaryKeyword: 'tableau de bord abonnements IA', secondaryKeywords: ['gérer outils IA', 'coffre IA', 'gestionnaire abonnement IA'] },
    nl: { title: 'Mijn Kluis — Beheer je AI-abonnementen | AI DEALS', description: 'Jouw versleutelde AI-kluis. Beheer actieve tools, facturatie, inloggegevens en verlengingen — alles op één plek. Alleen voor leden.', h1: 'Mijn AI-Kluis', primaryKeyword: 'AI abonnementen dashboard', secondaryKeywords: ['AI tools beheren', 'AI kluis', 'AI abonnement manager'] },
    de: { title: 'Mein Tresor — KI-Abos verwalten | AI DEALS', description: 'Ihr verschlüsselter KI-Tresor. Verwalten Sie aktive Tools, Abrechnung, Zugangsdaten und Verlängerungen — alles an einem Ort.', h1: 'Mein KI-Tresor', primaryKeyword: 'KI Abos Dashboard', secondaryKeywords: ['KI-Tools verwalten', 'KI Tresor', 'KI-Abo Manager'] },
    es: { title: 'Mi Bóveda — Gestiona tus Suscripciones IA | AI DEALS', description: 'Tu bóveda IA cifrada. Gestiona herramientas activas, facturación, credenciales y renovaciones — todo en un solo lugar. Solo miembros.', h1: 'Mi Bóveda IA', primaryKeyword: 'panel suscripciones IA', secondaryKeywords: ['gestionar herramientas IA', 'bóveda IA', 'gestor suscripción IA'] },
    pt: { title: 'O Meu Cofre — Gerir Subscrições IA | AI DEALS', description: 'O seu cofre IA encriptado. Gira ferramentas ativas, faturação, credenciais e renovações — tudo num só lugar. Apenas para membros.', h1: 'O Meu Cofre IA', primaryKeyword: 'painel subscrições IA', secondaryKeywords: ['gerir ferramentas IA', 'cofre IA', 'gestor subscrição IA'] },
    ar: { title: 'خزنتي — إدارة اشتراكات الذكاء الاصطناعي | AI DEALS', description: 'خزنتك المشفرة للذكاء الاصطناعي. أدِر الأدوات النشطة والفوترة وبيانات الدخول والتجديدات في مكان واحد. للأعضاء فقط.', h1: 'خزنتي للذكاء الاصطناعي', primaryKeyword: 'لوحة اشتراكات الذكاء الاصطناعي', secondaryKeywords: ['إدارة أدوات الذكاء الاصطناعي', 'خزنة الذكاء الاصطناعي', 'مدير اشتراكات الذكاء الاصطناعي'] },
  },

  'chatgpt-plus-belgium': {
    en: { title: 'ChatGPT Plus Belgium — Member Pricing | AI DEALS', description: 'Get ChatGPT Plus in Belgium at member pricing. Pay in EUR, no US card needed, 24h activation, monthly cancel. GDPR-principled access.', h1: 'ChatGPT Plus in Belgium — Member Pricing', primaryKeyword: 'ChatGPT Plus Belgium', secondaryKeywords: ['ChatGPT Plus EUR', 'ChatGPT abonnement België', 'GPT-4o access Belgium', 'ChatGPT no credit card'] },
    fr: { title: 'ChatGPT Plus Belgique — Tarif Membre | AI DEALS', description: 'Obtenez ChatGPT Plus en Belgique au tarif membre. Paiement en EUR, sans carte US, activation 24h, sans engagement. Accès RGPD.', h1: 'ChatGPT Plus en Belgique — Tarif Membre', primaryKeyword: 'ChatGPT Plus Belgique', secondaryKeywords: ['ChatGPT Plus EUR', 'ChatGPT abonnement Belgique', 'accès GPT-4o', 'ChatGPT sans carte bancaire'] },
    nl: { title: 'ChatGPT Plus België — Ledenprijs | AI DEALS', description: 'Krijg ChatGPT Plus in België tegen ledenprijs. Betaal in EUR, geen US-kaart nodig, 24u activatie, maandelijks opzegbaar.', h1: 'ChatGPT Plus in België — Ledenprijs', primaryKeyword: 'ChatGPT Plus België', secondaryKeywords: ['ChatGPT Plus EUR', 'ChatGPT abonnement België', 'GPT-4o toegang', 'ChatGPT zonder creditcard'] },
    de: { title: 'ChatGPT Plus Belgien — Mitgliederpreis | AI DEALS', description: 'ChatGPT Plus in Belgien zum Mitgliederpreis. Zahlung in EUR, ohne US-Karte, 24h-Aktivierung, monatlich kündbar.', h1: 'ChatGPT Plus in Belgien — Mitgliederpreis', primaryKeyword: 'ChatGPT Plus Belgien', secondaryKeywords: ['ChatGPT Plus EUR', 'ChatGPT Abo Belgien', 'GPT-4o Zugang', 'ChatGPT ohne Kreditkarte'] },
    es: { title: 'ChatGPT Plus Bélgica — Precio Miembro | AI DEALS', description: 'Consigue ChatGPT Plus en Bélgica a precio miembro. Pago en EUR, sin tarjeta US, activación 24h, cancela cuando quieras.', h1: 'ChatGPT Plus en Bélgica — Precio Miembro', primaryKeyword: 'ChatGPT Plus Bélgica', secondaryKeywords: ['ChatGPT Plus EUR', 'ChatGPT suscripción Bélgica', 'acceso GPT-4o', 'ChatGPT sin tarjeta'] },
    pt: { title: 'ChatGPT Plus Bélgica — Preço Membro | AI DEALS', description: 'Obtenha ChatGPT Plus na Bélgica a preço membro. Pagamento em EUR, sem cartão US, ativação 24h, cancele quando quiser.', h1: 'ChatGPT Plus na Bélgica — Preço Membro', primaryKeyword: 'ChatGPT Plus Bélgica', secondaryKeywords: ['ChatGPT Plus EUR', 'ChatGPT subscrição Bélgica', 'acesso GPT-4o', 'ChatGPT sem cartão'] },
    ar: { title: 'ChatGPT Plus بلجيكا — سعر الأعضاء | AI DEALS', description: 'احصل على ChatGPT Plus في بلجيكا بسعر الأعضاء. الدفع باليورو، بدون بطاقة أمريكية، تفعيل خلال 24 ساعة، إلغاء شهري.', h1: 'ChatGPT Plus في بلجيكا — سعر الأعضاء', primaryKeyword: 'ChatGPT Plus بلجيكا', secondaryKeywords: ['ChatGPT Plus باليورو', 'اشتراك ChatGPT بلجيكا', 'وصول GPT-4o', 'ChatGPT بدون بطاقة'] },
  },

  'midjourney-subscription-eu': {
    en: { title: 'Midjourney Subscription EU — Member Pricing | AI DEALS', description: 'Midjourney subscription for EU creators. EUR billing, instant access, monthly cancel. Skip the Discord setup hassle. Member pricing.', h1: 'Midjourney Subscription for EU Creators', primaryKeyword: 'Midjourney subscription EU', secondaryKeywords: ['Midjourney EUR', 'Midjourney access Europe', 'Midjourney without Discord', 'Midjourney monthly'] },
    fr: { title: 'Abonnement Midjourney UE — Tarif Membre | AI DEALS', description: 'Abonnement Midjourney pour créateurs UE. Facturation EUR, accès immédiat, sans engagement. Évitez la config Discord. Tarif membre.', h1: 'Abonnement Midjourney pour Créateurs UE', primaryKeyword: 'abonnement Midjourney UE', secondaryKeywords: ['Midjourney EUR', 'Midjourney accès Europe', 'Midjourney sans Discord', 'Midjourney mensuel'] },
    nl: { title: 'Midjourney Abonnement EU — Ledenprijs | AI DEALS', description: 'Midjourney abonnement voor EU-creatievelingen. EUR-facturatie, directe toegang, maandelijks opzegbaar. Geen Discord-gedoe. Ledenprijs.', h1: 'Midjourney Abonnement voor EU-creatievelingen', primaryKeyword: 'Midjourney abonnement EU', secondaryKeywords: ['Midjourney EUR', 'Midjourney toegang Europa', 'Midjourney zonder Discord', 'Midjourney maandelijks'] },
    de: { title: 'Midjourney Abo EU — Mitgliederpreis | AI DEALS', description: 'Midjourney-Abo für EU-Kreative. EUR-Abrechnung, sofortiger Zugang, monatlich kündbar. Ohne Discord-Aufwand. Mitgliederpreis.', h1: 'Midjourney-Abo für EU-Kreative', primaryKeyword: 'Midjourney Abo EU', secondaryKeywords: ['Midjourney EUR', 'Midjourney Zugang Europa', 'Midjourney ohne Discord', 'Midjourney monatlich'] },
    es: { title: 'Suscripción Midjourney UE — Precio Miembro | AI DEALS', description: 'Suscripción Midjourney para creadores UE. Facturación EUR, acceso instantáneo, cancela mensual. Sin lío de Discord. Precio miembro.', h1: 'Suscripción Midjourney para Creadores UE', primaryKeyword: 'suscripción Midjourney UE', secondaryKeywords: ['Midjourney EUR', 'Midjourney acceso Europa', 'Midjourney sin Discord', 'Midjourney mensual'] },
    pt: { title: 'Subscrição Midjourney UE — Preço Membro | AI DEALS', description: 'Subscrição Midjourney para criadores UE. Faturação EUR, acesso instantâneo, cancele mensal. Sem complicação Discord. Preço membro.', h1: 'Subscrição Midjourney para Criadores UE', primaryKeyword: 'subscrição Midjourney UE', secondaryKeywords: ['Midjourney EUR', 'Midjourney acesso Europa', 'Midjourney sem Discord', 'Midjourney mensal'] },
    ar: { title: 'اشتراك Midjourney أوروبا — سعر الأعضاء | AI DEALS', description: 'اشتراك Midjourney للمبدعين في أوروبا. فوترة باليورو، وصول فوري، إلغاء شهري. دون عناء Discord. بسعر الأعضاء.', h1: 'اشتراك Midjourney للمبدعين في أوروبا', primaryKeyword: 'اشتراك Midjourney أوروبا', secondaryKeywords: ['Midjourney باليورو', 'Midjourney أوروبا', 'Midjourney بدون Discord', 'Midjourney شهري'] },
  },

  'office-365-belgium': {
    en: { title: 'Office 365 Belgium — Member Pricing | AI DEALS', description: 'Microsoft 365 in Belgium at member pricing. Word, Excel, PowerPoint, OneDrive, Teams. Activated in hours. Monthly billing in EUR.', h1: 'Microsoft 365 in Belgium — Member Pricing', primaryKeyword: 'Office 365 Belgium', secondaryKeywords: ['Microsoft 365 abonnement België', 'Office 365 EUR', 'M365 Belgium pricing', 'Office België'] },
    fr: { title: 'Office 365 Belgique — Tarif Membre | AI DEALS', description: 'Microsoft 365 en Belgique au tarif membre. Word, Excel, PowerPoint, OneDrive, Teams. Activation en heures. Facturation mensuelle EUR.', h1: 'Microsoft 365 en Belgique — Tarif Membre', primaryKeyword: 'Office 365 Belgique', secondaryKeywords: ['Microsoft 365 abonnement Belgique', 'Office 365 EUR', 'M365 Belgique tarif', 'Office Belgique'] },
    nl: { title: 'Office 365 België — Ledenprijs | AI DEALS', description: 'Microsoft 365 in België tegen ledenprijs. Word, Excel, PowerPoint, OneDrive, Teams. Activatie in uren. Maandelijkse facturatie in EUR.', h1: 'Microsoft 365 in België — Ledenprijs', primaryKeyword: 'Office 365 België', secondaryKeywords: ['Microsoft 365 abonnement België', 'Office 365 EUR', 'M365 België prijs', 'Office België'] },
    de: { title: 'Office 365 Belgien — Mitgliederpreis | AI DEALS', description: 'Microsoft 365 in Belgien zum Mitgliederpreis. Word, Excel, PowerPoint, OneDrive, Teams. Aktivierung in Stunden. Monatliche EUR-Abrechnung.', h1: 'Microsoft 365 in Belgien — Mitgliederpreis', primaryKeyword: 'Office 365 Belgien', secondaryKeywords: ['Microsoft 365 Abo Belgien', 'Office 365 EUR', 'M365 Belgien Preis', 'Office Belgien'] },
    es: { title: 'Office 365 Bélgica — Precio Miembro | AI DEALS', description: 'Microsoft 365 en Bélgica a precio miembro. Word, Excel, PowerPoint, OneDrive, Teams. Activación en horas. Facturación mensual EUR.', h1: 'Microsoft 365 en Bélgica — Precio Miembro', primaryKeyword: 'Office 365 Bélgica', secondaryKeywords: ['Microsoft 365 suscripción Bélgica', 'Office 365 EUR', 'M365 Bélgica precio', 'Office Bélgica'] },
    pt: { title: 'Office 365 Bélgica — Preço Membro | AI DEALS', description: 'Microsoft 365 na Bélgica a preço membro. Word, Excel, PowerPoint, OneDrive, Teams. Ativação em horas. Faturação mensal EUR.', h1: 'Microsoft 365 na Bélgica — Preço Membro', primaryKeyword: 'Office 365 Bélgica', secondaryKeywords: ['Microsoft 365 subscrição Bélgica', 'Office 365 EUR', 'M365 Bélgica preço', 'Office Bélgica'] },
    ar: { title: 'Office 365 بلجيكا — سعر الأعضاء | AI DEALS', description: 'Microsoft 365 في بلجيكا بسعر الأعضاء. Word و Excel و PowerPoint و OneDrive و Teams. تفعيل خلال ساعات. فوترة شهرية باليورو.', h1: 'Microsoft 365 في بلجيكا — سعر الأعضاء', primaryKeyword: 'Office 365 بلجيكا', secondaryKeywords: ['اشتراك Microsoft 365 بلجيكا', 'Office 365 باليورو', 'M365 بلجيكا', 'Office بلجيكا'] },
  },

  'adobe-creative-cloud-eu': {
    en: { title: 'Adobe Creative Cloud EU — Member Pricing | AI DEALS', description: 'Adobe Creative Cloud for EU creators. Photoshop, Illustrator, Premiere & more at member pricing. EUR billing, monthly cancel.', h1: 'Adobe Creative Cloud for EU Creators', primaryKeyword: 'Adobe Creative Cloud EU', secondaryKeywords: ['Adobe Creative Cloud EUR', 'Photoshop subscription Europe', 'Adobe abonnement', 'Creative Cloud cheaper'] },
    fr: { title: 'Adobe Creative Cloud UE — Tarif Membre | AI DEALS', description: 'Adobe Creative Cloud pour créateurs UE. Photoshop, Illustrator, Premiere et plus, au tarif membre. Facturation EUR, sans engagement.', h1: 'Adobe Creative Cloud pour Créateurs UE', primaryKeyword: 'Adobe Creative Cloud UE', secondaryKeywords: ['Adobe Creative Cloud EUR', 'abonnement Photoshop Europe', 'Adobe abonnement', 'Creative Cloud moins cher'] },
    nl: { title: 'Adobe Creative Cloud EU — Ledenprijs | AI DEALS', description: 'Adobe Creative Cloud voor EU-creatievelingen. Photoshop, Illustrator, Premiere en meer, tegen ledenprijs. EUR, maandelijks opzegbaar.', h1: 'Adobe Creative Cloud voor EU-creatievelingen', primaryKeyword: 'Adobe Creative Cloud EU', secondaryKeywords: ['Adobe Creative Cloud EUR', 'Photoshop abonnement Europa', 'Adobe abonnement', 'Creative Cloud goedkoper'] },
    de: { title: 'Adobe Creative Cloud EU — Mitgliederpreis | AI DEALS', description: 'Adobe Creative Cloud für EU-Kreative. Photoshop, Illustrator, Premiere u.v.m. zum Mitgliederpreis. EUR-Abrechnung, monatlich kündbar.', h1: 'Adobe Creative Cloud für EU-Kreative', primaryKeyword: 'Adobe Creative Cloud EU', secondaryKeywords: ['Adobe Creative Cloud EUR', 'Photoshop Abo Europa', 'Adobe Abo', 'Creative Cloud günstiger'] },
    es: { title: 'Adobe Creative Cloud UE — Precio Miembro | AI DEALS', description: 'Adobe Creative Cloud para creadores UE. Photoshop, Illustrator, Premiere y más a precio miembro. Facturación EUR, cancela mensual.', h1: 'Adobe Creative Cloud para Creadores UE', primaryKeyword: 'Adobe Creative Cloud UE', secondaryKeywords: ['Adobe Creative Cloud EUR', 'suscripción Photoshop Europa', 'Adobe suscripción', 'Creative Cloud barato'] },
    pt: { title: 'Adobe Creative Cloud UE — Preço Membro | AI DEALS', description: 'Adobe Creative Cloud para criadores UE. Photoshop, Illustrator, Premiere e mais a preço membro. Faturação EUR, cancele mensal.', h1: 'Adobe Creative Cloud para Criadores UE', primaryKeyword: 'Adobe Creative Cloud UE', secondaryKeywords: ['Adobe Creative Cloud EUR', 'subscrição Photoshop Europa', 'Adobe subscrição', 'Creative Cloud barato'] },
    ar: { title: 'Adobe Creative Cloud أوروبا — سعر الأعضاء | AI DEALS', description: 'Adobe Creative Cloud للمبدعين في أوروبا. Photoshop و Illustrator و Premiere والمزيد بسعر الأعضاء. فوترة باليورو، إلغاء شهري.', h1: 'Adobe Creative Cloud للمبدعين في أوروبا', primaryKeyword: 'Adobe Creative Cloud أوروبا', secondaryKeywords: ['Adobe Creative Cloud باليورو', 'اشتراك Photoshop أوروبا', 'اشتراك Adobe', 'Creative Cloud أرخص'] },
  },

  'ai-tool-finder': {
    en: { title: 'AI Tool Finder — Get the Right AI Tool in 60 Seconds', description: 'Answer 3 questions and our AI Tool Finder recommends the best AI tools for your goal. Free, instant, no signup needed.', h1: 'AI Tool Finder — Personalised Recommendations', primaryKeyword: 'AI tool finder', secondaryKeywords: ['best AI tool for', 'AI recommendation engine', 'find AI tool', 'AI tool quiz'] },
    fr: { title: 'AI Tool Finder — Le Bon Outil IA en 60 Secondes', description: 'Répondez à 3 questions et notre AI Tool Finder vous recommande les meilleurs outils IA pour votre objectif. Gratuit, instantané, sans inscription.', h1: 'AI Tool Finder — Recommandations Personnalisées', primaryKeyword: 'trouveur outil IA', secondaryKeywords: ['meilleur outil IA pour', 'moteur recommandation IA', 'trouver outil IA', 'quiz outil IA'] },
    nl: { title: 'AI Tool Finder — De juiste AI-tool in 60 seconden', description: 'Beantwoord 3 vragen en onze AI Tool Finder beveelt de beste AI-tools aan voor jouw doel. Gratis, direct, zonder aanmelden.', h1: 'AI Tool Finder — Persoonlijke Aanbevelingen', primaryKeyword: 'AI tool zoeker', secondaryKeywords: ['beste AI tool voor', 'AI aanbevelingsmotor', 'AI tool vinden', 'AI tool quiz'] },
    de: { title: 'AI Tool Finder — Das richtige KI-Tool in 60 Sekunden', description: 'Beantworten Sie 3 Fragen und unser AI Tool Finder empfiehlt die besten KI-Tools für Ihr Ziel. Kostenlos, sofort, ohne Anmeldung.', h1: 'AI Tool Finder — Persönliche Empfehlungen', primaryKeyword: 'KI Tool Finder', secondaryKeywords: ['bestes KI-Tool für', 'KI Empfehlungsmaschine', 'KI-Tool finden', 'KI-Tool Quiz'] },
    es: { title: 'AI Tool Finder — La herramienta IA correcta en 60s', description: 'Responde 3 preguntas y nuestro AI Tool Finder te recomienda las mejores herramientas IA para tu objetivo. Gratis, instantáneo, sin registro.', h1: 'AI Tool Finder — Recomendaciones Personalizadas', primaryKeyword: 'buscador herramienta IA', secondaryKeywords: ['mejor herramienta IA para', 'motor recomendación IA', 'encontrar herramienta IA', 'test herramienta IA'] },
    pt: { title: 'AI Tool Finder — A ferramenta IA certa em 60s', description: 'Responda a 3 perguntas e o nosso AI Tool Finder recomenda as melhores ferramentas IA para o seu objetivo. Grátis, imediato, sem registo.', h1: 'AI Tool Finder — Recomendações Personalizadas', primaryKeyword: 'buscador ferramenta IA', secondaryKeywords: ['melhor ferramenta IA para', 'motor recomendação IA', 'encontrar ferramenta IA', 'teste ferramenta IA'] },
    ar: { title: 'AI Tool Finder — الأداة المناسبة في 60 ثانية', description: 'أجب على 3 أسئلة وسيرشح لك AI Tool Finder أفضل أدوات الذكاء الاصطناعي لهدفك. مجاني، فوري، بدون تسجيل.', h1: 'AI Tool Finder — توصيات مخصصة', primaryKeyword: 'باحث أدوات الذكاء الاصطناعي', secondaryKeywords: ['أفضل أداة ذكاء اصطناعي لـ', 'محرك توصيات الذكاء الاصطناعي', 'العثور على أداة ذكاء اصطناعي', 'اختبار أداة ذكاء اصطناعي'] },
  },
};

// Map app i18n language code → SEO lang (fallback to 'en')
export function resolveSeoLang(i18nLang?: string): SeoLang {
  if (!i18nLang) return 'en';
  const base = i18nLang.split('-')[0].toLowerCase();
  if ((SEO_LANGS as readonly string[]).includes(base)) return base as SeoLang;
  return 'en';
}

export function canonicalUrl(path: string): string {
  return `${SITE_URL}${path === '/' ? '' : path}`;
}
