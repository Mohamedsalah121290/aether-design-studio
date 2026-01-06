import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        features: 'Features',
        pricing: 'Pricing',
        resources: 'Resources',
        about: 'About',
        getStarted: 'Get Started',
        dashboard: 'Dashboard',
      },
      hero: {
        badge: 'Powered by Advanced AI',
        title: 'Transform Your Ideas Into Reality',
        titleHighlight: 'With AI',
        description: 'Harness the power of next-generation artificial intelligence to automate workflows, generate content, and unlock unprecedented productivity.',
        cta: 'Start Free Trial',
        ctaSecondary: 'Watch Demo',
        stats: {
          users: 'Active Users',
          accuracy: 'AI Accuracy',
          uptime: 'Uptime',
        },
      },
      features: {
        title: 'Powerful Features',
        subtitle: 'Built for the Future',
        description: 'Everything you need to supercharge your workflow with cutting-edge AI technology.',
        items: {
          automation: {
            title: 'Smart Automation',
            description: 'Automate repetitive tasks with intelligent AI agents that learn and adapt.',
          },
          analytics: {
            title: 'Deep Analytics',
            description: 'Get actionable insights with real-time data visualization and predictive analytics.',
          },
          generation: {
            title: 'Content Generation',
            description: 'Create high-quality content in seconds with our advanced language models.',
          },
          integration: {
            title: 'Seamless Integration',
            description: 'Connect with 100+ tools and platforms for a unified workflow experience.',
          },
          security: {
            title: 'Enterprise Security',
            description: 'Bank-grade encryption and compliance with global security standards.',
          },
          support: {
            title: '24/7 Support',
            description: 'Round-the-clock assistance from our expert team whenever you need it.',
          },
        },
      },
      pricing: {
        title: 'Simple Pricing',
        subtitle: 'Choose Your Plan',
        description: 'Start free, scale as you grow. No hidden fees.',
        monthly: 'Monthly',
        perMonth: '/month',
        popular: 'Most Popular',
        cta: 'Get Started',
        plans: {
          starter: {
            name: 'Starter',
            price: '29',
            description: 'Perfect for individuals and small projects.',
            features: ['5,000 AI credits/month', 'Basic analytics', 'Email support', '2 team members', 'API access'],
          },
          pro: {
            name: 'Pro',
            price: '99',
            description: 'Best for growing teams and businesses.',
            features: ['50,000 AI credits/month', 'Advanced analytics', 'Priority support', '10 team members', 'Custom integrations', 'White-label options'],
          },
          enterprise: {
            name: 'Enterprise',
            price: '299',
            description: 'For large organizations with custom needs.',
            features: ['Unlimited AI credits', 'Enterprise analytics', 'Dedicated support', 'Unlimited team members', 'Custom development', 'SLA guarantee', 'On-premise option'],
          },
        },
      },
      resources: {
        title: 'Learn & Grow',
        subtitle: 'Resources',
        description: 'Explore tutorials, guides, and best practices to maximize your AI potential.',
        readMore: 'Read Article',
        watchVideo: 'Watch Video',
      },
      cta: {
        title: 'Ready to Transform Your Workflow?',
        description: 'Join thousands of teams already using AI DEALS to achieve more.',
        button: 'Start Your Free Trial',
      },
      footer: {
        description: 'Premium AI tools subscriptions at unbeatable prices.',
        product: 'Product',
        company: 'Company',
        legal: 'Legal',
        rights: 'All rights reserved.',
      },
    },
  },
  ar: {
    translation: {
      nav: {
        features: 'المميزات',
        pricing: 'الأسعار',
        resources: 'الموارد',
        about: 'من نحن',
        getStarted: 'ابدأ الآن',
        dashboard: 'لوحة التحكم',
      },
      hero: {
        badge: 'مدعوم بالذكاء الاصطناعي المتقدم',
        title: 'حوّل أفكارك إلى واقع',
        titleHighlight: 'بالذكاء الاصطناعي',
        description: 'استخدم قوة الجيل القادم من الذكاء الاصطناعي لأتمتة سير العمل وإنشاء المحتوى وفتح إنتاجية غير مسبوقة.',
        cta: 'ابدأ التجربة المجانية',
        ctaSecondary: 'شاهد العرض',
        stats: {
          users: 'مستخدم نشط',
          accuracy: 'دقة الذكاء الاصطناعي',
          uptime: 'وقت التشغيل',
        },
      },
      features: {
        title: 'ميزات قوية',
        subtitle: 'مبنية للمستقبل',
        description: 'كل ما تحتاجه لتعزيز سير عملك بتقنية الذكاء الاصطناعي المتطورة.',
        items: {
          automation: {
            title: 'أتمتة ذكية',
            description: 'أتمتة المهام المتكررة مع وكلاء ذكاء اصطناعي يتعلمون ويتكيفون.',
          },
          analytics: {
            title: 'تحليلات عميقة',
            description: 'احصل على رؤى قابلة للتنفيذ مع تصور البيانات في الوقت الفعلي.',
          },
          generation: {
            title: 'إنشاء المحتوى',
            description: 'أنشئ محتوى عالي الجودة في ثوانٍ مع نماذجنا اللغوية المتقدمة.',
          },
          integration: {
            title: 'تكامل سلس',
            description: 'اتصل بأكثر من 100 أداة ومنصة لتجربة سير عمل موحدة.',
          },
          security: {
            title: 'أمان المؤسسات',
            description: 'تشفير بدرجة البنوك والامتثال لمعايير الأمان العالمية.',
          },
          support: {
            title: 'دعم على مدار الساعة',
            description: 'مساعدة على مدار الساعة من فريقنا الخبير متى احتجت إليها.',
          },
        },
      },
      pricing: {
        title: 'تسعير بسيط',
        subtitle: 'اختر خطتك',
        description: 'ابدأ مجانًا، وسّع حسب نموك. لا رسوم مخفية.',
        monthly: 'شهري',
        perMonth: '/شهر',
        popular: 'الأكثر شعبية',
        cta: 'ابدأ الآن',
        plans: {
          starter: {
            name: 'المبتدئ',
            price: '29',
            description: 'مثالي للأفراد والمشاريع الصغيرة.',
            features: ['5,000 رصيد ذكاء اصطناعي/شهر', 'تحليلات أساسية', 'دعم بالبريد الإلكتروني', 'عضوان', 'وصول API'],
          },
          pro: {
            name: 'المحترف',
            price: '99',
            description: 'الأفضل للفرق والشركات النامية.',
            features: ['50,000 رصيد ذكاء اصطناعي/شهر', 'تحليلات متقدمة', 'دعم أولوية', '10 أعضاء', 'تكاملات مخصصة', 'خيارات العلامة البيضاء'],
          },
          enterprise: {
            name: 'المؤسسات',
            price: '299',
            description: 'للمنظمات الكبيرة ذات الاحتياجات المخصصة.',
            features: ['أرصدة غير محدودة', 'تحليلات المؤسسات', 'دعم مخصص', 'أعضاء غير محدودين', 'تطوير مخصص', 'ضمان SLA', 'خيار داخلي'],
          },
        },
      },
      resources: {
        title: 'تعلم وانمو',
        subtitle: 'الموارد',
        description: 'استكشف الدروس والأدلة وأفضل الممارسات لتعظيم إمكاناتك في الذكاء الاصطناعي.',
        readMore: 'اقرأ المقال',
        watchVideo: 'شاهد الفيديو',
      },
      cta: {
        title: 'هل أنت مستعد لتحويل سير عملك؟',
        description: 'انضم إلى آلاف الفرق التي تستخدم AI DEALS بالفعل لتحقيق المزيد.',
        button: 'ابدأ تجربتك المجانية',
      },
      footer: {
        description: 'اشتراكات أدوات الذكاء الاصطناعي المتميزة بأسعار لا تقبل المنافسة.',
        product: 'المنتج',
        company: 'الشركة',
        legal: 'قانوني',
        rights: 'جميع الحقوق محفوظة.',
      },
    },
  },
  nl: {
    translation: {
      nav: {
        features: 'Functies',
        pricing: 'Prijzen',
        resources: 'Bronnen',
        about: 'Over Ons',
        getStarted: 'Aan de Slag',
        dashboard: 'Dashboard',
      },
      hero: {
        badge: 'Aangedreven door Geavanceerde AI',
        title: 'Transformeer Uw Ideeën naar Realiteit',
        titleHighlight: 'Met AI',
        description: 'Benut de kracht van next-generation kunstmatige intelligentie om workflows te automatiseren, content te genereren en ongekende productiviteit te ontgrendelen.',
        cta: 'Start Gratis Proef',
        ctaSecondary: 'Bekijk Demo',
        stats: {
          users: 'Actieve Gebruikers',
          accuracy: 'AI Nauwkeurigheid',
          uptime: 'Uptime',
        },
      },
      features: {
        title: 'Krachtige Functies',
        subtitle: 'Gebouwd voor de Toekomst',
        description: 'Alles wat u nodig heeft om uw workflow te versterken met geavanceerde AI-technologie.',
        items: {
          automation: { title: 'Slimme Automatisering', description: 'Automatiseer repetitieve taken met intelligente AI-agenten.' },
          analytics: { title: 'Diepgaande Analyse', description: 'Krijg bruikbare inzichten met realtime datavisualisatie.' },
          generation: { title: 'Content Generatie', description: 'Maak hoogwaardige content in seconden.' },
          integration: { title: 'Naadloze Integratie', description: 'Verbind met 100+ tools en platforms.' },
          security: { title: 'Enterprise Beveiliging', description: 'Bankgraad encryptie en wereldwijde compliance.' },
          support: { title: '24/7 Ondersteuning', description: 'Hulp op elk moment van ons expertteam.' },
        },
      },
      pricing: {
        title: 'Eenvoudige Prijzen',
        subtitle: 'Kies Uw Plan',
        description: 'Start gratis, schaal terwijl u groeit.',
        monthly: 'Maandelijks',
        perMonth: '/maand',
        popular: 'Populairst',
        cta: 'Aan de Slag',
        plans: {
          starter: { name: 'Starter', price: '29', description: 'Perfect voor individuen.', features: ['5.000 AI credits/maand', 'Basis analyse', 'E-mail support', '2 teamleden', 'API toegang'] },
          pro: { name: 'Pro', price: '99', description: 'Best voor groeiende teams.', features: ['50.000 AI credits/maand', 'Geavanceerde analyse', 'Prioriteit support', '10 teamleden', 'Custom integraties', 'White-label'] },
          enterprise: { name: 'Enterprise', price: '299', description: 'Voor grote organisaties.', features: ['Onbeperkt credits', 'Enterprise analyse', 'Dedicated support', 'Onbeperkt teamleden', 'Custom development', 'SLA garantie', 'On-premise'] },
        },
      },
      resources: { title: 'Leer & Groei', subtitle: 'Bronnen', description: 'Ontdek tutorials en best practices.', readMore: 'Lees Artikel', watchVideo: 'Bekijk Video' },
      cta: { title: 'Klaar om Uw Workflow te Transformeren?', description: 'Sluit u aan bij duizenden teams.', button: 'Start Uw Gratis Proef' },
      footer: { description: 'Premium AI tools subscriptions.', product: 'Product', company: 'Bedrijf', legal: 'Juridisch', rights: 'Alle rechten voorbehouden.' },
    },
  },
  fr: {
    translation: {
      nav: { features: 'Fonctionnalités', pricing: 'Tarifs', resources: 'Ressources', about: 'À Propos', getStarted: 'Commencer', dashboard: 'Tableau de Bord' },
      hero: { badge: 'Propulsé par l\'IA Avancée', title: 'Transformez Vos Idées en Réalité', titleHighlight: 'Avec l\'IA', description: 'Exploitez la puissance de l\'intelligence artificielle de nouvelle génération.', cta: 'Essai Gratuit', ctaSecondary: 'Voir la Démo', stats: { users: 'Utilisateurs Actifs', accuracy: 'Précision IA', uptime: 'Disponibilité' } },
      features: { title: 'Fonctionnalités Puissantes', subtitle: 'Construit pour l\'Avenir', description: 'Tout ce dont vous avez besoin pour booster votre workflow.', items: { automation: { title: 'Automatisation Intelligente', description: 'Automatisez les tâches répétitives.' }, analytics: { title: 'Analyses Approfondies', description: 'Obtenez des insights actionnables.' }, generation: { title: 'Génération de Contenu', description: 'Créez du contenu de qualité en secondes.' }, integration: { title: 'Intégration Fluide', description: 'Connectez plus de 100 outils.' }, security: { title: 'Sécurité Entreprise', description: 'Chiffrement de niveau bancaire.' }, support: { title: 'Support 24/7', description: 'Assistance à tout moment.' } } },
      pricing: { title: 'Tarifs Simples', subtitle: 'Choisissez Votre Plan', description: 'Commencez gratuitement, évoluez selon vos besoins.', monthly: 'Mensuel', perMonth: '/mois', popular: 'Le Plus Populaire', cta: 'Commencer', plans: { starter: { name: 'Starter', price: '29', description: 'Parfait pour les individus.', features: ['5 000 crédits IA/mois', 'Analyses de base', 'Support email', '2 membres', 'Accès API'] }, pro: { name: 'Pro', price: '99', description: 'Idéal pour les équipes en croissance.', features: ['50 000 crédits IA/mois', 'Analyses avancées', 'Support prioritaire', '10 membres', 'Intégrations personnalisées', 'Marque blanche'] }, enterprise: { name: 'Entreprise', price: '299', description: 'Pour les grandes organisations.', features: ['Crédits illimités', 'Analyses entreprise', 'Support dédié', 'Membres illimités', 'Développement sur mesure', 'Garantie SLA', 'Option sur site'] } } },
      resources: { title: 'Apprendre & Grandir', subtitle: 'Ressources', description: 'Explorez les tutoriels et guides.', readMore: 'Lire l\'Article', watchVideo: 'Voir la Vidéo' },
      cta: { title: 'Prêt à Transformer Votre Workflow?', description: 'Rejoignez des milliers d\'équipes.', button: 'Démarrer Votre Essai Gratuit' },
      footer: { description: 'Abonnements IA premium.', product: 'Produit', company: 'Entreprise', legal: 'Légal', rights: 'Tous droits réservés.' },
    },
  },
  de: {
    translation: {
      nav: { features: 'Funktionen', pricing: 'Preise', resources: 'Ressourcen', about: 'Über Uns', getStarted: 'Loslegen', dashboard: 'Dashboard' },
      hero: { badge: 'Powered by Advanced AI', title: 'Verwandeln Sie Ihre Ideen in Realität', titleHighlight: 'Mit KI', description: 'Nutzen Sie die Kraft der nächsten Generation künstlicher Intelligenz.', cta: 'Kostenlos Testen', ctaSecondary: 'Demo Ansehen', stats: { users: 'Aktive Nutzer', accuracy: 'KI-Genauigkeit', uptime: 'Verfügbarkeit' } },
      features: { title: 'Leistungsstarke Funktionen', subtitle: 'Für die Zukunft Gebaut', description: 'Alles was Sie brauchen für optimierte Workflows.', items: { automation: { title: 'Intelligente Automatisierung', description: 'Automatisieren Sie wiederkehrende Aufgaben.' }, analytics: { title: 'Tiefgehende Analytik', description: 'Erhalten Sie umsetzbare Erkenntnisse.' }, generation: { title: 'Content-Erstellung', description: 'Erstellen Sie Qualitätsinhalte in Sekunden.' }, integration: { title: 'Nahtlose Integration', description: 'Verbinden Sie 100+ Tools.' }, security: { title: 'Enterprise-Sicherheit', description: 'Bankgrad-Verschlüsselung.' }, support: { title: '24/7 Support', description: 'Jederzeit Unterstützung.' } } },
      pricing: { title: 'Einfache Preise', subtitle: 'Wählen Sie Ihren Plan', description: 'Starten Sie kostenlos, skalieren Sie nach Bedarf.', monthly: 'Monatlich', perMonth: '/Monat', popular: 'Beliebteste', cta: 'Loslegen', plans: { starter: { name: 'Starter', price: '29', description: 'Perfekt für Einzelpersonen.', features: ['5.000 KI-Credits/Monat', 'Basis-Analytik', 'E-Mail-Support', '2 Teammitglieder', 'API-Zugang'] }, pro: { name: 'Pro', price: '99', description: 'Ideal für wachsende Teams.', features: ['50.000 KI-Credits/Monat', 'Erweiterte Analytik', 'Prioritäts-Support', '10 Teammitglieder', 'Custom Integrationen', 'White-Label'] }, enterprise: { name: 'Enterprise', price: '299', description: 'Für große Organisationen.', features: ['Unbegrenzte Credits', 'Enterprise-Analytik', 'Dedizierter Support', 'Unbegrenzte Mitglieder', 'Custom Development', 'SLA-Garantie', 'On-Premise'] } } },
      resources: { title: 'Lernen & Wachsen', subtitle: 'Ressourcen', description: 'Entdecken Sie Tutorials und Best Practices.', readMore: 'Artikel Lesen', watchVideo: 'Video Ansehen' },
      cta: { title: 'Bereit Ihren Workflow zu Transformieren?', description: 'Schließen Sie sich Tausenden Teams an.', button: 'Kostenlose Testversion Starten' },
      footer: { description: 'Next-Gen KI-Plattform für moderne Teams.', product: 'Produkt', company: 'Unternehmen', legal: 'Rechtliches', rights: 'Alle Rechte vorbehalten.' },
    },
  },
  es: {
    translation: {
      nav: { features: 'Características', pricing: 'Precios', resources: 'Recursos', about: 'Nosotros', getStarted: 'Comenzar', dashboard: 'Panel' },
      hero: { badge: 'Impulsado por IA Avanzada', title: 'Transforma Tus Ideas en Realidad', titleHighlight: 'Con IA', description: 'Aprovecha el poder de la inteligencia artificial de próxima generación.', cta: 'Prueba Gratis', ctaSecondary: 'Ver Demo', stats: { users: 'Usuarios Activos', accuracy: 'Precisión IA', uptime: 'Disponibilidad' } },
      features: { title: 'Características Poderosas', subtitle: 'Construido para el Futuro', description: 'Todo lo que necesitas para potenciar tu flujo de trabajo.', items: { automation: { title: 'Automatización Inteligente', description: 'Automatiza tareas repetitivas.' }, analytics: { title: 'Análisis Profundo', description: 'Obtén insights accionables.' }, generation: { title: 'Generación de Contenido', description: 'Crea contenido de calidad en segundos.' }, integration: { title: 'Integración Fluida', description: 'Conecta 100+ herramientas.' }, security: { title: 'Seguridad Empresarial', description: 'Encriptación de nivel bancario.' }, support: { title: 'Soporte 24/7', description: 'Asistencia en cualquier momento.' } } },
      pricing: { title: 'Precios Simples', subtitle: 'Elige Tu Plan', description: 'Empieza gratis, escala según crezcas.', monthly: 'Mensual', perMonth: '/mes', popular: 'Más Popular', cta: 'Comenzar', plans: { starter: { name: 'Starter', price: '29', description: 'Perfecto para individuos.', features: ['5.000 créditos IA/mes', 'Análisis básico', 'Soporte email', '2 miembros', 'Acceso API'] }, pro: { name: 'Pro', price: '99', description: 'Ideal para equipos en crecimiento.', features: ['50.000 créditos IA/mes', 'Análisis avanzado', 'Soporte prioritario', '10 miembros', 'Integraciones custom', 'White-label'] }, enterprise: { name: 'Enterprise', price: '299', description: 'Para grandes organizaciones.', features: ['Créditos ilimitados', 'Análisis enterprise', 'Soporte dedicado', 'Miembros ilimitados', 'Desarrollo custom', 'Garantía SLA', 'On-premise'] } } },
      resources: { title: 'Aprende y Crece', subtitle: 'Recursos', description: 'Explora tutoriales y mejores prácticas.', readMore: 'Leer Artículo', watchVideo: 'Ver Video' },
      cta: { title: '¿Listo para Transformar Tu Flujo de Trabajo?', description: 'Únete a miles de equipos.', button: 'Inicia Tu Prueba Gratis' },
      footer: { description: 'Plataforma IA de próxima generación.', product: 'Producto', company: 'Empresa', legal: 'Legal', rights: 'Todos los derechos reservados.' },
    },
  },
  it: {
    translation: {
      nav: { features: 'Funzionalità', pricing: 'Prezzi', resources: 'Risorse', about: 'Chi Siamo', getStarted: 'Inizia', dashboard: 'Dashboard' },
      hero: { badge: 'Powered by AI Avanzata', title: 'Trasforma le Tue Idee in Realtà', titleHighlight: 'Con l\'IA', description: 'Sfrutta la potenza dell\'intelligenza artificiale di nuova generazione.', cta: 'Prova Gratuita', ctaSecondary: 'Guarda Demo', stats: { users: 'Utenti Attivi', accuracy: 'Precisione IA', uptime: 'Uptime' } },
      features: { title: 'Funzionalità Potenti', subtitle: 'Costruito per il Futuro', description: 'Tutto ciò di cui hai bisogno per potenziare il tuo workflow.', items: { automation: { title: 'Automazione Intelligente', description: 'Automatizza le attività ripetitive.' }, analytics: { title: 'Analytics Approfondita', description: 'Ottieni insight azionabili.' }, generation: { title: 'Generazione Contenuti', description: 'Crea contenuti di qualità in secondi.' }, integration: { title: 'Integrazione Fluida', description: 'Connetti 100+ strumenti.' }, security: { title: 'Sicurezza Enterprise', description: 'Crittografia di livello bancario.' }, support: { title: 'Supporto 24/7', description: 'Assistenza in qualsiasi momento.' } } },
      pricing: { title: 'Prezzi Semplici', subtitle: 'Scegli il Tuo Piano', description: 'Inizia gratis, scala man mano che cresci.', monthly: 'Mensile', perMonth: '/mese', popular: 'Più Popolare', cta: 'Inizia', plans: { starter: { name: 'Starter', price: '29', description: 'Perfetto per singoli.', features: ['5.000 crediti IA/mese', 'Analytics di base', 'Supporto email', '2 membri team', 'Accesso API'] }, pro: { name: 'Pro', price: '99', description: 'Ideale per team in crescita.', features: ['50.000 crediti IA/mese', 'Analytics avanzata', 'Supporto prioritario', '10 membri team', 'Integrazioni custom', 'White-label'] }, enterprise: { name: 'Enterprise', price: '299', description: 'Per grandi organizzazioni.', features: ['Crediti illimitati', 'Analytics enterprise', 'Supporto dedicato', 'Membri illimitati', 'Sviluppo custom', 'Garanzia SLA', 'On-premise'] } } },
      resources: { title: 'Impara e Cresci', subtitle: 'Risorse', description: 'Esplora tutorial e best practice.', readMore: 'Leggi Articolo', watchVideo: 'Guarda Video' },
      cta: { title: 'Pronto a Trasformare il Tuo Workflow?', description: 'Unisciti a migliaia di team.', button: 'Inizia la Tua Prova Gratuita' },
      footer: { description: 'Piattaforma IA di nuova generazione.', product: 'Prodotto', company: 'Azienda', legal: 'Legale', rights: 'Tutti i diritti riservati.' },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'nl', name: 'Nederlands (BE)', flag: '🇧🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];