import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Complete translations for 13 languages
const resources = {
  en: {
    translation: {
      nav: {
        store: 'Store',
        tools: 'Tools',
        tutorials: 'Tutorials',
        about: 'About',
        contentHub: 'Content Hub',
        getStarted: 'Browse Tools',
        dashboard: 'My Vault',
      },
      hero: {
        badge: 'Premium AI Tools Store',
        title: 'Buy Premium AI Tools',
        titleHighlight: 'Individually',
        description: 'Access ChatGPT, Midjourney, Claude, Runway & 50+ premium AI tools. Buy only what you need, pay monthly.',
        cta: 'Browse Store',
        ctaSecondary: 'My Vault',
        stats: {
          tools: 'Premium Tools',
          users: 'Happy Users',
          uptime: 'Uptime',
        },
      },
      store: {
        badge: 'Premium AI Tools',
        title: 'Choose Your',
        titleHighlight: 'AI Tools',
        description: 'Buy individual access to premium AI tools. No bundles, no commitments. Pay only for what you use.',
        searchPlaceholder: 'Search tools...',
        monthlyAccess: 'Monthly Access',
        perMonth: '/mo',
        buyNow: 'Buy Now',
        noResults: 'No tools found',
        tryAgain: 'Try a different search term',
        categories: {
          all: 'All Tools',
          text: 'Text & Chat',
          image: 'Image Gen',
          video: 'Video & Audio',
          coding: 'Coding & Software',
        },
      },
      resources: {
        title: 'Learn & Master',
        subtitle: 'Tutorials',
        description: 'Step-by-step tutorials to master every AI tool.',
        readMore: 'Read More',
        watchVideo: 'Watch Video',
        viewAll: 'View All Resources',
        article: { tutorial: 'Tutorial', guide: 'Guide', deepDive: 'Deep Dive' },
      },
      cta: {
        title: 'Ready to Unlock Premium AI Tools?',
        description: 'Join thousands of creators and businesses accessing premium AI at affordable prices.',
        button: 'Start Shopping',
      },
      footer: {
        description: 'Premium AI tools at affordable prices.',
        product: 'Product',
        company: 'Company',
        legal: 'Legal',
        rights: 'All rights reserved.',
        links: {
          features: 'Features', pricing: 'Pricing', integrations: 'Integrations', changelog: 'Changelog', roadmap: 'Roadmap',
          about: 'About', blog: 'Blog', careers: 'Careers', press: 'Press', partners: 'Partners',
          privacy: 'Privacy', terms: 'Terms', security: 'Security', cookies: 'Cookies',
          status: 'Status', sitemap: 'Sitemap',
        },
      },
      dashboard: {
        vaultTitle: 'My Vault',
        vaultSubtitle: 'Your purchased AI tools',
        allToolsActive: 'All Tools Active',
        secureAccess: 'Secure Access',
        toolsOwned: 'tools owned',
        searchTools: 'Search your tools...',
        launchTool: 'Launch Tool',
        purchasedOn: 'Purchased',
        noToolsFound: 'No tools found',
        browseStore: 'Browse the store to purchase AI tools',
        goToStore: 'Go to Store',
      },
      contentHub: {
        title: 'Content Hub',
        subtitle: 'Expert AI Knowledge',
        description: 'Curated tutorials, in-depth guides, and expert insights.',
        searchPlaceholder: 'Search articles...',
        featuredVideos: 'Featured This Month',
        videoCount: 'hand-picked video tutorials',
        articles: 'Articles',
        loadMore: 'Load More Articles',
        views: 'views',
        minRead: 'min read',
      },
      common: {
        loading: 'Loading...',
        error: 'An error occurred',
        success: 'Success!',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close',
        search: 'Search',
        filter: 'Filter',
        sortBy: 'Sort by',
        noResults: 'No results found',
        tryAgain: 'Try again',
        learnMore: 'Learn more',
      },
      errors: {
        notFound: 'Page not found',
        serverError: 'Server error',
        networkError: 'Network error',
        unauthorized: 'Unauthorized',
        forbidden: 'Access denied',
      },
      tooltips: {
        launchTool: 'Open this tool in a new tab',
        buyTool: 'Add to cart and checkout',
        searchTools: 'Search by tool name',
        languageSelector: 'Change language',
      },
    },
  },

  // Chinese (Mandarin) - 中文
  zh: {
    translation: {
      nav: {
        store: '商店',
        tools: '工具',
        tutorials: '教程',
        about: '关于',
        contentHub: '内容中心',
        getStarted: '浏览工具',
        dashboard: '我的工具库',
      },
      hero: {
        badge: '高级AI工具商店',
        title: '单独购买高级AI工具',
        titleHighlight: '个性化选择',
        description: '获取 ChatGPT、Midjourney、Claude、Runway 等50多款高级AI工具。按需购买，按月付费。',
        cta: '浏览商店',
        ctaSecondary: '我的工具库',
        stats: { tools: '高级工具', users: '满意用户', uptime: '运行时间' },
      },
      store: {
        badge: '高级AI工具',
        title: '选择您的',
        titleHighlight: 'AI工具',
        description: '单独购买高级AI工具访问权。无捆绑，无承诺。只为您使用的付费。',
        searchPlaceholder: '搜索工具...',
        monthlyAccess: '月度访问',
        perMonth: '/月',
        buyNow: '立即购买',
        noResults: '未找到工具',
        tryAgain: '尝试其他搜索词',
        categories: { all: '所有工具', text: '文本与对话', image: '图像生成', video: '视频与音频', coding: '编程与软件' },
      },
      resources: {
        title: '学习与精通',
        subtitle: '教程',
        description: '分步教程，帮助您掌握每个AI工具。',
        readMore: '阅读更多',
        watchVideo: '观看视频',
        viewAll: '查看所有资源',
        article: { tutorial: '教程', guide: '指南', deepDive: '深度探索' },
      },
      cta: { title: '准备解锁高级AI工具？', description: '加入数千名创作者和企业，以实惠的价格获取高级AI。', button: '开始购物' },
      footer: {
        description: '以实惠价格提供高级AI工具。',
        product: '产品', company: '公司', legal: '法律', rights: '版权所有。',
        links: { features: '功能', pricing: '定价', integrations: '集成', changelog: '更新日志', roadmap: '路线图', about: '关于', blog: '博客', careers: '招聘', press: '新闻', partners: '合作伙伴', privacy: '隐私', terms: '条款', security: '安全', cookies: 'Cookies', status: '状态', sitemap: '网站地图' },
      },
      dashboard: {
        vaultTitle: '我的工具库',
        vaultSubtitle: '您购买的AI工具',
        allToolsActive: '所有工具已激活',
        secureAccess: '安全访问',
        toolsOwned: '拥有的工具',
        searchTools: '搜索您的工具...',
        launchTool: '启动工具',
        purchasedOn: '购买于',
        noToolsFound: '未找到工具',
        browseStore: '浏览商店购买AI工具',
        goToStore: '前往商店',
      },
      contentHub: { title: '内容中心', subtitle: '专家AI知识', description: '精选教程、深度指南和专家见解。', searchPlaceholder: '搜索文章...', featuredVideos: '本月精选', videoCount: '精选视频教程', articles: '文章', loadMore: '加载更多', views: '观看', minRead: '分钟阅读' },
      common: { loading: '加载中...', error: '发生错误', success: '成功！', cancel: '取消', confirm: '确认', save: '保存', delete: '删除', edit: '编辑', close: '关闭', search: '搜索', filter: '筛选', sortBy: '排序', noResults: '无结果', tryAgain: '重试', learnMore: '了解更多' },
      errors: { notFound: '页面未找到', serverError: '服务器错误', networkError: '网络错误', unauthorized: '未授权', forbidden: '访问被拒绝' },
      tooltips: { launchTool: '在新标签页中打开此工具', buyTool: '添加到购物车并结账', searchTools: '按工具名称搜索', languageSelector: '更改语言' },
    },
  },

  // Hindi - हिन्दी
  hi: {
    translation: {
      nav: { store: 'स्टोर', tools: 'टूल्स', tutorials: 'ट्यूटोरियल', about: 'हमारे बारे में', contentHub: 'कंटेंट हब', getStarted: 'टूल्स ब्राउज़ करें', dashboard: 'मेरी वॉल्ट' },
      hero: {
        badge: 'प्रीमियम AI टूल्स स्टोर',
        title: 'प्रीमियम AI टूल्स खरीदें',
        titleHighlight: 'व्यक्तिगत रूप से',
        description: 'ChatGPT, Midjourney, Claude, Runway और 50+ प्रीमियम AI टूल्स तक पहुंच। केवल वही खरीदें जो आपको चाहिए।',
        cta: 'स्टोर ब्राउज़ करें',
        ctaSecondary: 'मेरी वॉल्ट',
        stats: { tools: 'प्रीमियम टूल्स', users: 'खुश उपयोगकर्ता', uptime: 'अपटाइम' },
      },
      store: {
        badge: 'प्रीमियम AI टूल्स',
        title: 'अपने',
        titleHighlight: 'AI टूल्स चुनें',
        description: 'प्रीमियम AI टूल्स की व्यक्तिगत पहुंच खरीदें। कोई बंडल नहीं, कोई प्रतिबद्धता नहीं।',
        searchPlaceholder: 'टूल्स खोजें...',
        monthlyAccess: 'मासिक पहुंच',
        perMonth: '/महीना',
        buyNow: 'अभी खरीदें',
        noResults: 'कोई टूल नहीं मिला',
        tryAgain: 'अलग शब्द से खोजें',
        categories: { all: 'सभी टूल्स', text: 'टेक्स्ट और चैट', image: 'इमेज जनरेशन', video: 'वीडियो और ऑडियो', coding: 'कोडिंग और सॉफ्टवेयर' },
      },
      resources: { title: 'सीखें और मास्टर करें', subtitle: 'ट्यूटोरियल', description: 'प्रत्येक AI टूल में महारत हासिल करने के लिए चरण-दर-चरण ट्यूटोरियल।', readMore: 'और पढ़ें', watchVideo: 'वीडियो देखें', viewAll: 'सभी संसाधन देखें', article: { tutorial: 'ट्यूटोरियल', guide: 'गाइड', deepDive: 'गहन अध्ययन' } },
      cta: { title: 'प्रीमियम AI टूल्स अनलॉक करने के लिए तैयार?', description: 'हजारों क्रिएटर्स और व्यवसायों में शामिल हों।', button: 'शॉपिंग शुरू करें' },
      footer: { description: 'किफायती कीमतों पर प्रीमियम AI टूल्स।', product: 'उत्पाद', company: 'कंपनी', legal: 'कानूनी', rights: 'सर्वाधिकार सुरक्षित।', links: { features: 'फीचर्स', pricing: 'मूल्य', integrations: 'इंटीग्रेशन', changelog: 'चेंजलॉग', roadmap: 'रोडमैप', about: 'हमारे बारे में', blog: 'ब्लॉग', careers: 'करियर', press: 'प्रेस', partners: 'पार्टनर', privacy: 'गोपनीयता', terms: 'शर्तें', security: 'सुरक्षा', cookies: 'कुकीज़', status: 'स्थिति', sitemap: 'साइटमैप' } },
      dashboard: { vaultTitle: 'मेरी वॉल्ट', vaultSubtitle: 'आपके खरीदे गए AI टूल्स', allToolsActive: 'सभी टूल्स सक्रिय', secureAccess: 'सुरक्षित पहुंच', toolsOwned: 'स्वामित्व वाले टूल्स', searchTools: 'अपने टूल्स खोजें...', launchTool: 'टूल लॉन्च करें', purchasedOn: 'खरीदा', noToolsFound: 'कोई टूल नहीं मिला', browseStore: 'AI टूल्स खरीदने के लिए स्टोर ब्राउज़ करें', goToStore: 'स्टोर पर जाएं' },
      contentHub: { title: 'कंटेंट हब', subtitle: 'विशेषज्ञ AI ज्ञान', description: 'क्यूरेटेड ट्यूटोरियल और विशेषज्ञ अंतर्दृष्टि।', searchPlaceholder: 'लेख खोजें...', featuredVideos: 'इस महीने फीचर्ड', videoCount: 'चुने हुए वीडियो ट्यूटोरियल', articles: 'लेख', loadMore: 'और लोड करें', views: 'व्यूज', minRead: 'मिनट पढ़ें' },
      common: { loading: 'लोड हो रहा है...', error: 'एक त्रुटि हुई', success: 'सफलता!', cancel: 'रद्द करें', confirm: 'पुष्टि करें', save: 'सहेजें', delete: 'हटाएं', edit: 'संपादित करें', close: 'बंद करें', search: 'खोजें', filter: 'फ़िल्टर', sortBy: 'क्रमबद्ध', noResults: 'कोई परिणाम नहीं', tryAgain: 'पुनः प्रयास करें', learnMore: 'और जानें' },
      errors: { notFound: 'पेज नहीं मिला', serverError: 'सर्वर त्रुटि', networkError: 'नेटवर्क त्रुटि', unauthorized: 'अनधिकृत', forbidden: 'पहुंच अस्वीकृत' },
      tooltips: { launchTool: 'इस टूल को नए टैब में खोलें', buyTool: 'कार्ट में जोड़ें', searchTools: 'टूल नाम से खोजें', languageSelector: 'भाषा बदलें' },
    },
  },

  // Spanish - Español
  es: {
    translation: {
      nav: { store: 'Tienda', tools: 'Herramientas', tutorials: 'Tutoriales', about: 'Acerca de', contentHub: 'Centro de Contenido', getStarted: 'Ver Herramientas', dashboard: 'Mi Bóveda' },
      hero: {
        badge: 'Tienda de Herramientas IA Premium',
        title: 'Compra Herramientas IA Premium',
        titleHighlight: 'Individualmente',
        description: 'Accede a ChatGPT, Midjourney, Claude, Runway y más de 50 herramientas IA premium. Compra solo lo que necesitas.',
        cta: 'Ver Tienda',
        ctaSecondary: 'Mi Bóveda',
        stats: { tools: 'Herramientas Premium', users: 'Usuarios Felices', uptime: 'Disponibilidad' },
      },
      store: {
        badge: 'Herramientas IA Premium',
        title: 'Elige Tus',
        titleHighlight: 'Herramientas IA',
        description: 'Compra acceso individual a herramientas IA premium. Sin paquetes, sin compromisos.',
        searchPlaceholder: 'Buscar herramientas...',
        monthlyAccess: 'Acceso Mensual',
        perMonth: '/mes',
        buyNow: 'Comprar Ahora',
        noResults: 'No se encontraron herramientas',
        tryAgain: 'Intenta con otro término',
        categories: { all: 'Todas', text: 'Texto y Chat', image: 'Generación de Imágenes', video: 'Video y Audio', coding: 'Programación y Software' },
      },
      resources: { title: 'Aprende y Domina', subtitle: 'Tutoriales', description: 'Tutoriales paso a paso para dominar cada herramienta IA.', readMore: 'Leer Más', watchVideo: 'Ver Video', viewAll: 'Ver Todos los Recursos', article: { tutorial: 'Tutorial', guide: 'Guía', deepDive: 'Análisis Profundo' } },
      cta: { title: '¿Listo para Desbloquear Herramientas IA Premium?', description: 'Únete a miles de creadores y empresas.', button: 'Comenzar a Comprar' },
      footer: { description: 'Herramientas IA premium a precios accesibles.', product: 'Producto', company: 'Empresa', legal: 'Legal', rights: 'Todos los derechos reservados.', links: { features: 'Características', pricing: 'Precios', integrations: 'Integraciones', changelog: 'Registro de Cambios', roadmap: 'Hoja de Ruta', about: 'Acerca de', blog: 'Blog', careers: 'Carreras', press: 'Prensa', partners: 'Socios', privacy: 'Privacidad', terms: 'Términos', security: 'Seguridad', cookies: 'Cookies', status: 'Estado', sitemap: 'Mapa del Sitio' } },
      dashboard: { vaultTitle: 'Mi Bóveda', vaultSubtitle: 'Tus herramientas IA compradas', allToolsActive: 'Todas las Herramientas Activas', secureAccess: 'Acceso Seguro', toolsOwned: 'herramientas propias', searchTools: 'Buscar tus herramientas...', launchTool: 'Lanzar Herramienta', purchasedOn: 'Comprado el', noToolsFound: 'No se encontraron herramientas', browseStore: 'Navega por la tienda para comprar herramientas IA', goToStore: 'Ir a la Tienda' },
      contentHub: { title: 'Centro de Contenido', subtitle: 'Conocimiento Experto en IA', description: 'Tutoriales curados y perspectivas de expertos.', searchPlaceholder: 'Buscar artículos...', featuredVideos: 'Destacados Este Mes', videoCount: 'tutoriales de video seleccionados', articles: 'Artículos', loadMore: 'Cargar Más', views: 'vistas', minRead: 'min de lectura' },
      common: { loading: 'Cargando...', error: 'Ocurrió un error', success: '¡Éxito!', cancel: 'Cancelar', confirm: 'Confirmar', save: 'Guardar', delete: 'Eliminar', edit: 'Editar', close: 'Cerrar', search: 'Buscar', filter: 'Filtrar', sortBy: 'Ordenar por', noResults: 'Sin resultados', tryAgain: 'Intentar de nuevo', learnMore: 'Saber más' },
      errors: { notFound: 'Página no encontrada', serverError: 'Error del servidor', networkError: 'Error de red', unauthorized: 'No autorizado', forbidden: 'Acceso denegado' },
      tooltips: { launchTool: 'Abrir esta herramienta en una nueva pestaña', buyTool: 'Añadir al carrito', searchTools: 'Buscar por nombre', languageSelector: 'Cambiar idioma' },
    },
  },

  // French - Français
  fr: {
    translation: {
      nav: { store: 'Boutique', tools: 'Outils', tutorials: 'Tutoriels', about: 'À Propos', contentHub: 'Hub de Contenu', getStarted: 'Parcourir les Outils', dashboard: 'Mon Coffre' },
      hero: {
        badge: 'Boutique d\'Outils IA Premium',
        title: 'Achetez des Outils IA Premium',
        titleHighlight: 'Individuellement',
        description: 'Accédez à ChatGPT, Midjourney, Claude, Runway et plus de 50 outils IA premium. Achetez uniquement ce dont vous avez besoin.',
        cta: 'Voir la Boutique',
        ctaSecondary: 'Mon Coffre',
        stats: { tools: 'Outils Premium', users: 'Utilisateurs Satisfaits', uptime: 'Disponibilité' },
      },
      store: {
        badge: 'Outils IA Premium',
        title: 'Choisissez Vos',
        titleHighlight: 'Outils IA',
        description: 'Achetez un accès individuel aux outils IA premium. Pas de bundles, pas d\'engagements.',
        searchPlaceholder: 'Rechercher des outils...',
        monthlyAccess: 'Accès Mensuel',
        perMonth: '/mois',
        buyNow: 'Acheter',
        noResults: 'Aucun outil trouvé',
        tryAgain: 'Essayez un autre terme',
        categories: { all: 'Tous les Outils', text: 'Texte et Chat', image: 'Génération d\'Images', video: 'Vidéo et Audio', coding: 'Programmation et Logiciel' },
      },
      resources: { title: 'Apprenez et Maîtrisez', subtitle: 'Tutoriels', description: 'Tutoriels étape par étape pour maîtriser chaque outil IA.', readMore: 'Lire Plus', watchVideo: 'Voir la Vidéo', viewAll: 'Voir Toutes les Ressources', article: { tutorial: 'Tutoriel', guide: 'Guide', deepDive: 'Analyse Approfondie' } },
      cta: { title: 'Prêt à Débloquer des Outils IA Premium?', description: 'Rejoignez des milliers de créateurs et d\'entreprises.', button: 'Commencer vos Achats' },
      footer: { description: 'Outils IA premium à prix abordables.', product: 'Produit', company: 'Entreprise', legal: 'Légal', rights: 'Tous droits réservés.', links: { features: 'Fonctionnalités', pricing: 'Tarifs', integrations: 'Intégrations', changelog: 'Journal des Modifications', roadmap: 'Feuille de Route', about: 'À Propos', blog: 'Blog', careers: 'Carrières', press: 'Presse', partners: 'Partenaires', privacy: 'Confidentialité', terms: 'Conditions', security: 'Sécurité', cookies: 'Cookies', status: 'Statut', sitemap: 'Plan du Site' } },
      dashboard: { vaultTitle: 'Mon Coffre', vaultSubtitle: 'Vos outils IA achetés', allToolsActive: 'Tous les Outils Actifs', secureAccess: 'Accès Sécurisé', toolsOwned: 'outils possédés', searchTools: 'Rechercher vos outils...', launchTool: 'Lancer l\'Outil', purchasedOn: 'Acheté le', noToolsFound: 'Aucun outil trouvé', browseStore: 'Parcourez la boutique pour acheter des outils IA', goToStore: 'Aller à la Boutique' },
      contentHub: { title: 'Hub de Contenu', subtitle: 'Expertise IA', description: 'Tutoriels sélectionnés et conseils d\'experts.', searchPlaceholder: 'Rechercher des articles...', featuredVideos: 'En Vedette Ce Mois', videoCount: 'tutoriels vidéo sélectionnés', articles: 'Articles', loadMore: 'Charger Plus', views: 'vues', minRead: 'min de lecture' },
      common: { loading: 'Chargement...', error: 'Une erreur s\'est produite', success: 'Succès!', cancel: 'Annuler', confirm: 'Confirmer', save: 'Enregistrer', delete: 'Supprimer', edit: 'Modifier', close: 'Fermer', search: 'Rechercher', filter: 'Filtrer', sortBy: 'Trier par', noResults: 'Aucun résultat', tryAgain: 'Réessayer', learnMore: 'En savoir plus' },
      errors: { notFound: 'Page non trouvée', serverError: 'Erreur serveur', networkError: 'Erreur réseau', unauthorized: 'Non autorisé', forbidden: 'Accès refusé' },
      tooltips: { launchTool: 'Ouvrir cet outil dans un nouvel onglet', buyTool: 'Ajouter au panier', searchTools: 'Rechercher par nom', languageSelector: 'Changer de langue' },
    },
  },

  // Arabic - العربية (RTL)
  ar: {
    translation: {
      nav: { store: 'المتجر', tools: 'الأدوات', tutorials: 'الدروس', about: 'من نحن', contentHub: 'مركز المحتوى', getStarted: 'تصفح الأدوات', dashboard: 'خزنتي' },
      hero: {
        badge: 'متجر أدوات الذكاء الاصطناعي المميزة',
        title: 'اشترِ أدوات AI المميزة',
        titleHighlight: 'بشكل فردي',
        description: 'احصل على ChatGPT و Midjourney و Claude و Runway وأكثر من 50 أداة AI مميزة. اشترِ ما تحتاجه فقط، وادفع شهرياً.',
        cta: 'تصفح المتجر',
        ctaSecondary: 'خزنتي',
        stats: { tools: 'أداة مميزة', users: 'مستخدم سعيد', uptime: 'وقت التشغيل' },
      },
      store: {
        badge: 'أدوات AI المميزة',
        title: 'اختر',
        titleHighlight: 'أدواتك',
        description: 'اشترِ وصولاً فردياً لأدوات AI المميزة. بدون حزم، بدون التزامات. ادفع فقط لما تستخدمه.',
        searchPlaceholder: 'ابحث عن الأدوات...',
        monthlyAccess: 'وصول شهري',
        perMonth: '/شهر',
        buyNow: 'اشترِ الآن',
        noResults: 'لم يتم العثور على أدوات',
        tryAgain: 'جرب كلمة بحث مختلفة',
        categories: { all: 'جميع الأدوات', text: 'النص والمحادثة', image: 'توليد الصور', video: 'الفيديو والصوت', coding: 'البرمجة والبرامج' },
      },
      resources: { title: 'تعلم وأتقن', subtitle: 'الدروس', description: 'دروس خطوة بخطوة لإتقان كل أداة AI.', readMore: 'اقرأ المزيد', watchVideo: 'شاهد الفيديو', viewAll: 'عرض جميع الموارد', article: { tutorial: 'درس', guide: 'دليل', deepDive: 'تحليل معمق' } },
      cta: { title: 'مستعد لفتح أدوات AI المميزة؟', description: 'انضم لآلاف المبدعين والشركات الذين يحصلون على AI المميز بأسعار معقولة.', button: 'ابدأ التسوق' },
      footer: { description: 'أدوات AI المميزة بأسعار معقولة.', product: 'المنتج', company: 'الشركة', legal: 'قانوني', rights: 'جميع الحقوق محفوظة.', links: { features: 'المميزات', pricing: 'الأسعار', integrations: 'التكاملات', changelog: 'سجل التغييرات', roadmap: 'خارطة الطريق', about: 'من نحن', blog: 'المدونة', careers: 'الوظائف', press: 'الصحافة', partners: 'الشركاء', privacy: 'الخصوصية', terms: 'الشروط', security: 'الأمان', cookies: 'ملفات تعريف الارتباط', status: 'الحالة', sitemap: 'خريطة الموقع' } },
      dashboard: { vaultTitle: 'خزنتي', vaultSubtitle: 'أدوات AI التي اشتريتها', allToolsActive: 'جميع الأدوات نشطة', secureAccess: 'وصول آمن', toolsOwned: 'أداة مملوكة', searchTools: 'ابحث في أدواتك...', launchTool: 'تشغيل الأداة', purchasedOn: 'تاريخ الشراء', noToolsFound: 'لم يتم العثور على أدوات', browseStore: 'تصفح المتجر لشراء أدوات AI', goToStore: 'اذهب للمتجر' },
      contentHub: { title: 'مركز المحتوى', subtitle: 'معرفة AI المتخصصة', description: 'دروس مختارة ورؤى الخبراء.', searchPlaceholder: 'ابحث عن المقالات...', featuredVideos: 'مميزات هذا الشهر', videoCount: 'فيديوهات تعليمية مختارة', articles: 'المقالات', loadMore: 'تحميل المزيد', views: 'مشاهدة', minRead: 'دقيقة قراءة' },
      common: { loading: 'جاري التحميل...', error: 'حدث خطأ', success: 'نجاح!', cancel: 'إلغاء', confirm: 'تأكيد', save: 'حفظ', delete: 'حذف', edit: 'تحرير', close: 'إغلاق', search: 'بحث', filter: 'تصفية', sortBy: 'ترتيب حسب', noResults: 'لا توجد نتائج', tryAgain: 'حاول مرة أخرى', learnMore: 'اعرف المزيد' },
      errors: { notFound: 'الصفحة غير موجودة', serverError: 'خطأ في الخادم', networkError: 'خطأ في الشبكة', unauthorized: 'غير مصرح', forbidden: 'الوصول مرفوض' },
      tooltips: { launchTool: 'افتح هذه الأداة في علامة تبويب جديدة', buyTool: 'أضف إلى السلة', searchTools: 'ابحث باسم الأداة', languageSelector: 'تغيير اللغة' },
    },
  },

  // Bengali - বাংলা
  bn: {
    translation: {
      nav: { store: 'স্টোর', tools: 'টুলস', tutorials: 'টিউটোরিয়াল', about: 'সম্পর্কে', contentHub: 'কন্টেন্ট হাব', getStarted: 'টুলস ব্রাউজ করুন', dashboard: 'আমার ভল্ট' },
      hero: {
        badge: 'প্রিমিয়াম AI টুলস স্টোর',
        title: 'প্রিমিয়াম AI টুলস কিনুন',
        titleHighlight: 'পৃথকভাবে',
        description: 'ChatGPT, Midjourney, Claude, Runway এবং 50+ প্রিমিয়াম AI টুলস অ্যাক্সেস করুন। শুধুমাত্র আপনার প্রয়োজনীয় জিনিস কিনুন।',
        cta: 'স্টোর ব্রাউজ করুন',
        ctaSecondary: 'আমার ভল্ট',
        stats: { tools: 'প্রিমিয়াম টুলস', users: 'সন্তুষ্ট ব্যবহারকারী', uptime: 'আপটাইম' },
      },
      store: {
        badge: 'প্রিমিয়াম AI টুলস',
        title: 'আপনার',
        titleHighlight: 'AI টুলস বেছে নিন',
        description: 'প্রিমিয়াম AI টুলসে পৃথক অ্যাক্সেস কিনুন। কোন বান্ডেল নেই, কোন প্রতিশ্রুতি নেই।',
        searchPlaceholder: 'টুলস খুঁজুন...',
        monthlyAccess: 'মাসিক অ্যাক্সেস',
        perMonth: '/মাস',
        buyNow: 'এখনই কিনুন',
        noResults: 'কোন টুল পাওয়া যায়নি',
        tryAgain: 'অন্য শব্দ দিয়ে চেষ্টা করুন',
        categories: { all: 'সব টুলস', text: 'টেক্সট ও চ্যাট', image: 'ইমেজ জেনারেশন', video: 'ভিডিও ও অডিও', coding: 'কোডিং ও সফটওয়্যার' },
      },
      resources: { title: 'শিখুন এবং মাস্টার করুন', subtitle: 'টিউটোরিয়াল', description: 'প্রতিটি AI টুলে দক্ষতা অর্জনের জন্য ধাপে ধাপে টিউটোরিয়াল।', readMore: 'আরো পড়ুন', watchVideo: 'ভিডিও দেখুন', viewAll: 'সব রিসোর্স দেখুন', article: { tutorial: 'টিউটোরিয়াল', guide: 'গাইড', deepDive: 'গভীর বিশ্লেষণ' } },
      cta: { title: 'প্রিমিয়াম AI টুলস আনলক করতে প্রস্তুত?', description: 'হাজার হাজার ক্রিয়েটর এবং ব্যবসায়ের সাথে যোগ দিন।', button: 'শপিং শুরু করুন' },
      footer: { description: 'সাশ্রয়ী মূল্যে প্রিমিয়াম AI টুলস।', product: 'পণ্য', company: 'কোম্পানি', legal: 'আইনি', rights: 'সর্বস্বত্ব সংরক্ষিত।', links: { features: 'ফিচার', pricing: 'মূল্য', integrations: 'ইন্টিগ্রেশন', changelog: 'চেঞ্জলগ', roadmap: 'রোডম্যাপ', about: 'সম্পর্কে', blog: 'ব্লগ', careers: 'ক্যারিয়ার', press: 'প্রেস', partners: 'পার্টনার', privacy: 'গোপনীয়তা', terms: 'শর্তাবলী', security: 'নিরাপত্তা', cookies: 'কুকিজ', status: 'স্ট্যাটাস', sitemap: 'সাইটম্যাপ' } },
      dashboard: { vaultTitle: 'আমার ভল্ট', vaultSubtitle: 'আপনার কেনা AI টুলস', allToolsActive: 'সব টুলস সক্রিয়', secureAccess: 'নিরাপদ অ্যাক্সেস', toolsOwned: 'মালিকানাধীন টুলস', searchTools: 'আপনার টুলস খুঁজুন...', launchTool: 'টুল লঞ্চ করুন', purchasedOn: 'ক্রয়ের তারিখ', noToolsFound: 'কোন টুল পাওয়া যায়নি', browseStore: 'AI টুলস কিনতে স্টোর ব্রাউজ করুন', goToStore: 'স্টোরে যান' },
      contentHub: { title: 'কন্টেন্ট হাব', subtitle: 'বিশেষজ্ঞ AI জ্ঞান', description: 'কিউরেটেড টিউটোরিয়াল এবং বিশেষজ্ঞ অন্তর্দৃষ্টি।', searchPlaceholder: 'আর্টিকেল খুঁজুন...', featuredVideos: 'এই মাসে ফিচার্ড', videoCount: 'নির্বাচিত ভিডিও টিউটোরিয়াল', articles: 'আর্টিকেল', loadMore: 'আরো লোড করুন', views: 'ভিউ', minRead: 'মিনিট পড়া' },
      common: { loading: 'লোড হচ্ছে...', error: 'একটি ত্রুটি হয়েছে', success: 'সফল!', cancel: 'বাতিল', confirm: 'নিশ্চিত', save: 'সংরক্ষণ', delete: 'মুছুন', edit: 'সম্পাদনা', close: 'বন্ধ', search: 'খুঁজুন', filter: 'ফিল্টার', sortBy: 'সাজান', noResults: 'কোন ফলাফল নেই', tryAgain: 'আবার চেষ্টা করুন', learnMore: 'আরো জানুন' },
      errors: { notFound: 'পেজ পাওয়া যায়নি', serverError: 'সার্ভার ত্রুটি', networkError: 'নেটওয়ার্ক ত্রুটি', unauthorized: 'অনুমোদন নেই', forbidden: 'অ্যাক্সেস অস্বীকৃত' },
      tooltips: { launchTool: 'নতুন ট্যাবে এই টুল খুলুন', buyTool: 'কার্টে যোগ করুন', searchTools: 'নাম দিয়ে খুঁজুন', languageSelector: 'ভাষা পরিবর্তন করুন' },
    },
  },

  // Portuguese - Português
  pt: {
    translation: {
      nav: { store: 'Loja', tools: 'Ferramentas', tutorials: 'Tutoriais', about: 'Sobre', contentHub: 'Hub de Conteúdo', getStarted: 'Ver Ferramentas', dashboard: 'Meu Cofre' },
      hero: {
        badge: 'Loja de Ferramentas IA Premium',
        title: 'Compre Ferramentas IA Premium',
        titleHighlight: 'Individualmente',
        description: 'Acesse ChatGPT, Midjourney, Claude, Runway e mais de 50 ferramentas IA premium. Compre apenas o que você precisa.',
        cta: 'Ver Loja',
        ctaSecondary: 'Meu Cofre',
        stats: { tools: 'Ferramentas Premium', users: 'Usuários Satisfeitos', uptime: 'Disponibilidade' },
      },
      store: {
        badge: 'Ferramentas IA Premium',
        title: 'Escolha Suas',
        titleHighlight: 'Ferramentas IA',
        description: 'Compre acesso individual a ferramentas IA premium. Sem pacotes, sem compromissos.',
        searchPlaceholder: 'Buscar ferramentas...',
        monthlyAccess: 'Acesso Mensal',
        perMonth: '/mês',
        buyNow: 'Comprar Agora',
        noResults: 'Nenhuma ferramenta encontrada',
        tryAgain: 'Tente outro termo',
        categories: { all: 'Todas', text: 'Texto e Chat', image: 'Geração de Imagens', video: 'Vídeo e Áudio', coding: 'Programação e Software' },
      },
      resources: { title: 'Aprenda e Domine', subtitle: 'Tutoriais', description: 'Tutoriais passo a passo para dominar cada ferramenta IA.', readMore: 'Ler Mais', watchVideo: 'Ver Vídeo', viewAll: 'Ver Todos os Recursos', article: { tutorial: 'Tutorial', guide: 'Guia', deepDive: 'Análise Profunda' } },
      cta: { title: 'Pronto para Desbloquear Ferramentas IA Premium?', description: 'Junte-se a milhares de criadores e empresas.', button: 'Começar a Comprar' },
      footer: { description: 'Ferramentas IA premium a preços acessíveis.', product: 'Produto', company: 'Empresa', legal: 'Legal', rights: 'Todos os direitos reservados.', links: { features: 'Recursos', pricing: 'Preços', integrations: 'Integrações', changelog: 'Registro de Alterações', roadmap: 'Roteiro', about: 'Sobre', blog: 'Blog', careers: 'Carreiras', press: 'Imprensa', partners: 'Parceiros', privacy: 'Privacidade', terms: 'Termos', security: 'Segurança', cookies: 'Cookies', status: 'Status', sitemap: 'Mapa do Site' } },
      dashboard: { vaultTitle: 'Meu Cofre', vaultSubtitle: 'Suas ferramentas IA compradas', allToolsActive: 'Todas as Ferramentas Ativas', secureAccess: 'Acesso Seguro', toolsOwned: 'ferramentas adquiridas', searchTools: 'Buscar suas ferramentas...', launchTool: 'Abrir Ferramenta', purchasedOn: 'Comprado em', noToolsFound: 'Nenhuma ferramenta encontrada', browseStore: 'Navegue pela loja para comprar ferramentas IA', goToStore: 'Ir para a Loja' },
      contentHub: { title: 'Hub de Conteúdo', subtitle: 'Conhecimento Especializado em IA', description: 'Tutoriais selecionados e insights de especialistas.', searchPlaceholder: 'Buscar artigos...', featuredVideos: 'Destaques do Mês', videoCount: 'tutoriais em vídeo selecionados', articles: 'Artigos', loadMore: 'Carregar Mais', views: 'visualizações', minRead: 'min de leitura' },
      common: { loading: 'Carregando...', error: 'Ocorreu um erro', success: 'Sucesso!', cancel: 'Cancelar', confirm: 'Confirmar', save: 'Salvar', delete: 'Excluir', edit: 'Editar', close: 'Fechar', search: 'Buscar', filter: 'Filtrar', sortBy: 'Ordenar por', noResults: 'Sem resultados', tryAgain: 'Tentar novamente', learnMore: 'Saiba mais' },
      errors: { notFound: 'Página não encontrada', serverError: 'Erro no servidor', networkError: 'Erro de rede', unauthorized: 'Não autorizado', forbidden: 'Acesso negado' },
      tooltips: { launchTool: 'Abrir esta ferramenta em uma nova aba', buyTool: 'Adicionar ao carrinho', searchTools: 'Buscar por nome', languageSelector: 'Mudar idioma' },
    },
  },

  // Russian - Русский
  ru: {
    translation: {
      nav: { store: 'Магазин', tools: 'Инструменты', tutorials: 'Обучение', about: 'О нас', contentHub: 'Контент-хаб', getStarted: 'Просмотр инструментов', dashboard: 'Моё хранилище' },
      hero: {
        badge: 'Магазин премиум AI-инструментов',
        title: 'Покупайте премиум AI-инструменты',
        titleHighlight: 'по отдельности',
        description: 'Получите доступ к ChatGPT, Midjourney, Claude, Runway и более 50 премиум AI-инструментам. Покупайте только то, что вам нужно.',
        cta: 'Открыть магазин',
        ctaSecondary: 'Моё хранилище',
        stats: { tools: 'Премиум инструментов', users: 'Довольных пользователей', uptime: 'Время работы' },
      },
      store: {
        badge: 'Премиум AI-инструменты',
        title: 'Выберите свои',
        titleHighlight: 'AI-инструменты',
        description: 'Покупайте индивидуальный доступ к премиум AI-инструментам. Без пакетов, без обязательств.',
        searchPlaceholder: 'Поиск инструментов...',
        monthlyAccess: 'Месячный доступ',
        perMonth: '/мес',
        buyNow: 'Купить',
        noResults: 'Инструменты не найдены',
        tryAgain: 'Попробуйте другой запрос',
        categories: { all: 'Все инструменты', text: 'Текст и чат', image: 'Генерация изображений', video: 'Видео и аудио', coding: 'Программирование' },
      },
      resources: { title: 'Учитесь и осваивайте', subtitle: 'Обучение', description: 'Пошаговые руководства по освоению каждого AI-инструмента.', readMore: 'Читать далее', watchVideo: 'Смотреть видео', viewAll: 'Все ресурсы', article: { tutorial: 'Урок', guide: 'Руководство', deepDive: 'Глубокий анализ' } },
      cta: { title: 'Готовы разблокировать премиум AI-инструменты?', description: 'Присоединяйтесь к тысячам создателей и компаний.', button: 'Начать покупки' },
      footer: { description: 'Премиум AI-инструменты по доступным ценам.', product: 'Продукт', company: 'Компания', legal: 'Правовая информация', rights: 'Все права защищены.', links: { features: 'Возможности', pricing: 'Цены', integrations: 'Интеграции', changelog: 'История изменений', roadmap: 'Дорожная карта', about: 'О нас', blog: 'Блог', careers: 'Карьера', press: 'Пресса', partners: 'Партнёры', privacy: 'Конфиденциальность', terms: 'Условия', security: 'Безопасность', cookies: 'Cookies', status: 'Статус', sitemap: 'Карта сайта' } },
      dashboard: { vaultTitle: 'Моё хранилище', vaultSubtitle: 'Ваши приобретённые AI-инструменты', allToolsActive: 'Все инструменты активны', secureAccess: 'Безопасный доступ', toolsOwned: 'инструментов куплено', searchTools: 'Поиск ваших инструментов...', launchTool: 'Запустить', purchasedOn: 'Куплено', noToolsFound: 'Инструменты не найдены', browseStore: 'Перейдите в магазин для покупки AI-инструментов', goToStore: 'В магазин' },
      contentHub: { title: 'Контент-хаб', subtitle: 'Экспертные знания об AI', description: 'Подборка руководств и экспертных материалов.', searchPlaceholder: 'Поиск статей...', featuredVideos: 'Избранное месяца', videoCount: 'избранных видеоуроков', articles: 'Статьи', loadMore: 'Загрузить ещё', views: 'просмотров', minRead: 'мин чтения' },
      common: { loading: 'Загрузка...', error: 'Произошла ошибка', success: 'Успех!', cancel: 'Отмена', confirm: 'Подтвердить', save: 'Сохранить', delete: 'Удалить', edit: 'Редактировать', close: 'Закрыть', search: 'Поиск', filter: 'Фильтр', sortBy: 'Сортировать', noResults: 'Нет результатов', tryAgain: 'Попробовать снова', learnMore: 'Подробнее' },
      errors: { notFound: 'Страница не найдена', serverError: 'Ошибка сервера', networkError: 'Ошибка сети', unauthorized: 'Не авторизован', forbidden: 'Доступ запрещён' },
      tooltips: { launchTool: 'Открыть инструмент в новой вкладке', buyTool: 'Добавить в корзину', searchTools: 'Поиск по названию', languageSelector: 'Сменить язык' },
    },
  },

  // Urdu - اردو (RTL)
  ur: {
    translation: {
      nav: { store: 'اسٹور', tools: 'ٹولز', tutorials: 'ٹیوٹوریلز', about: 'ہمارے بارے میں', contentHub: 'مواد کا مرکز', getStarted: 'ٹولز دیکھیں', dashboard: 'میری والٹ' },
      hero: {
        badge: 'پریمیم AI ٹولز اسٹور',
        title: 'پریمیم AI ٹولز خریدیں',
        titleHighlight: 'انفرادی طور پر',
        description: 'ChatGPT، Midjourney، Claude، Runway اور 50+ پریمیم AI ٹولز تک رسائی حاصل کریں۔ صرف وہی خریدیں جس کی آپ کو ضرورت ہے۔',
        cta: 'اسٹور دیکھیں',
        ctaSecondary: 'میری والٹ',
        stats: { tools: 'پریمیم ٹولز', users: 'خوش صارفین', uptime: 'اپ ٹائم' },
      },
      store: {
        badge: 'پریمیم AI ٹولز',
        title: 'اپنے',
        titleHighlight: 'AI ٹولز منتخب کریں',
        description: 'پریمیم AI ٹولز تک انفرادی رسائی خریدیں۔ کوئی بنڈل نہیں، کوئی عہد نہیں۔',
        searchPlaceholder: 'ٹولز تلاش کریں...',
        monthlyAccess: 'ماہانہ رسائی',
        perMonth: '/ماہ',
        buyNow: 'ابھی خریدیں',
        noResults: 'کوئی ٹول نہیں ملا',
        tryAgain: 'کوئی اور لفظ آزمائیں',
        categories: { all: 'تمام ٹولز', text: 'ٹیکسٹ اور چیٹ', image: 'تصویر بنانا', video: 'ویڈیو اور آڈیو', coding: 'کوڈنگ اور سافٹ ویئر' },
      },
      resources: { title: 'سیکھیں اور مہارت حاصل کریں', subtitle: 'ٹیوٹوریلز', description: 'ہر AI ٹول میں مہارت حاصل کرنے کے لیے مرحلہ وار ٹیوٹوریلز۔', readMore: 'مزید پڑھیں', watchVideo: 'ویڈیو دیکھیں', viewAll: 'تمام وسائل دیکھیں', article: { tutorial: 'ٹیوٹوریل', guide: 'گائیڈ', deepDive: 'گہرا تجزیہ' } },
      cta: { title: 'پریمیم AI ٹولز ان لاک کرنے کے لیے تیار ہیں؟', description: 'ہزاروں تخلیق کاروں اور کاروباروں میں شامل ہوں۔', button: 'خریداری شروع کریں' },
      footer: { description: 'سستی قیمتوں پر پریمیم AI ٹولز۔', product: 'پروڈکٹ', company: 'کمپنی', legal: 'قانونی', rights: 'جملہ حقوق محفوظ ہیں۔', links: { features: 'خصوصیات', pricing: 'قیمتیں', integrations: 'انضمام', changelog: 'تبدیلی کا ریکارڈ', roadmap: 'روڈ میپ', about: 'ہمارے بارے میں', blog: 'بلاگ', careers: 'کیریئر', press: 'پریس', partners: 'شراکت دار', privacy: 'رازداری', terms: 'شرائط', security: 'سیکیورٹی', cookies: 'کوکیز', status: 'حیثیت', sitemap: 'سائٹ میپ' } },
      dashboard: { vaultTitle: 'میری والٹ', vaultSubtitle: 'آپ کے خریدے ہوئے AI ٹولز', allToolsActive: 'تمام ٹولز فعال ہیں', secureAccess: 'محفوظ رسائی', toolsOwned: 'ملکیتی ٹولز', searchTools: 'اپنے ٹولز تلاش کریں...', launchTool: 'ٹول لانچ کریں', purchasedOn: 'خریداری کی تاریخ', noToolsFound: 'کوئی ٹول نہیں ملا', browseStore: 'AI ٹولز خریدنے کے لیے اسٹور دیکھیں', goToStore: 'اسٹور پر جائیں' },
      contentHub: { title: 'مواد کا مرکز', subtitle: 'ماہر AI علم', description: 'منتخب ٹیوٹوریلز اور ماہرانہ بصیرت۔', searchPlaceholder: 'مضامین تلاش کریں...', featuredVideos: 'اس ماہ کی خصوصیت', videoCount: 'منتخب ویڈیو ٹیوٹوریلز', articles: 'مضامین', loadMore: 'مزید لوڈ کریں', views: 'ویوز', minRead: 'منٹ پڑھنا' },
      common: { loading: 'لوڈ ہو رہا ہے...', error: 'ایک خرابی ہوئی', success: 'کامیابی!', cancel: 'منسوخ', confirm: 'تصدیق', save: 'محفوظ کریں', delete: 'حذف کریں', edit: 'ترمیم', close: 'بند کریں', search: 'تلاش', filter: 'فلٹر', sortBy: 'ترتیب', noResults: 'کوئی نتائج نہیں', tryAgain: 'دوبارہ کوشش کریں', learnMore: 'مزید جانیں' },
      errors: { notFound: 'صفحہ نہیں ملا', serverError: 'سرور کی خرابی', networkError: 'نیٹ ورک کی خرابی', unauthorized: 'غیر مجاز', forbidden: 'رسائی مسترد' },
      tooltips: { launchTool: 'اس ٹول کو نئے ٹیب میں کھولیں', buyTool: 'کارٹ میں شامل کریں', searchTools: 'نام سے تلاش کریں', languageSelector: 'زبان تبدیل کریں' },
    },
  },

  // German - Deutsch
  de: {
    translation: {
      nav: { store: 'Shop', tools: 'Tools', tutorials: 'Tutorials', about: 'Über uns', contentHub: 'Content Hub', getStarted: 'Tools durchsuchen', dashboard: 'Mein Tresor' },
      hero: {
        badge: 'Premium KI-Tools Shop',
        title: 'Premium KI-Tools kaufen',
        titleHighlight: 'einzeln',
        description: 'Zugang zu ChatGPT, Midjourney, Claude, Runway und über 50 Premium KI-Tools. Kaufen Sie nur, was Sie brauchen.',
        cta: 'Shop öffnen',
        ctaSecondary: 'Mein Tresor',
        stats: { tools: 'Premium Tools', users: 'Zufriedene Nutzer', uptime: 'Verfügbarkeit' },
      },
      store: {
        badge: 'Premium KI-Tools',
        title: 'Wählen Sie Ihre',
        titleHighlight: 'KI-Tools',
        description: 'Kaufen Sie individuellen Zugang zu Premium KI-Tools. Keine Bundles, keine Verpflichtungen.',
        searchPlaceholder: 'Tools suchen...',
        monthlyAccess: 'Monatlicher Zugang',
        perMonth: '/Mo',
        buyNow: 'Jetzt kaufen',
        noResults: 'Keine Tools gefunden',
        tryAgain: 'Versuchen Sie einen anderen Begriff',
        categories: { all: 'Alle Tools', text: 'Text & Chat', image: 'Bildgenerierung', video: 'Video & Audio', coding: 'Programmierung & Software' },
      },
      resources: { title: 'Lernen & Meistern', subtitle: 'Tutorials', description: 'Schritt-für-Schritt-Tutorials zur Beherrschung jedes KI-Tools.', readMore: 'Mehr lesen', watchVideo: 'Video ansehen', viewAll: 'Alle Ressourcen', article: { tutorial: 'Tutorial', guide: 'Leitfaden', deepDive: 'Tiefenanalyse' } },
      cta: { title: 'Bereit, Premium KI-Tools freizuschalten?', description: 'Schließen Sie sich Tausenden von Kreativen und Unternehmen an.', button: 'Einkauf starten' },
      footer: { description: 'Premium KI-Tools zu erschwinglichen Preisen.', product: 'Produkt', company: 'Unternehmen', legal: 'Rechtliches', rights: 'Alle Rechte vorbehalten.', links: { features: 'Funktionen', pricing: 'Preise', integrations: 'Integrationen', changelog: 'Änderungsprotokoll', roadmap: 'Roadmap', about: 'Über uns', blog: 'Blog', careers: 'Karriere', press: 'Presse', partners: 'Partner', privacy: 'Datenschutz', terms: 'AGB', security: 'Sicherheit', cookies: 'Cookies', status: 'Status', sitemap: 'Sitemap' } },
      dashboard: { vaultTitle: 'Mein Tresor', vaultSubtitle: 'Ihre gekauften KI-Tools', allToolsActive: 'Alle Tools aktiv', secureAccess: 'Sicherer Zugang', toolsOwned: 'Tools im Besitz', searchTools: 'Ihre Tools suchen...', launchTool: 'Tool starten', purchasedOn: 'Gekauft am', noToolsFound: 'Keine Tools gefunden', browseStore: 'Durchsuchen Sie den Shop, um KI-Tools zu kaufen', goToStore: 'Zum Shop' },
      contentHub: { title: 'Content Hub', subtitle: 'KI-Expertenwissen', description: 'Kuratierte Tutorials und Experteneinblicke.', searchPlaceholder: 'Artikel suchen...', featuredVideos: 'Empfohlen diesen Monat', videoCount: 'ausgewählte Video-Tutorials', articles: 'Artikel', loadMore: 'Mehr laden', views: 'Aufrufe', minRead: 'Min. Lesezeit' },
      common: { loading: 'Laden...', error: 'Ein Fehler ist aufgetreten', success: 'Erfolg!', cancel: 'Abbrechen', confirm: 'Bestätigen', save: 'Speichern', delete: 'Löschen', edit: 'Bearbeiten', close: 'Schließen', search: 'Suchen', filter: 'Filtern', sortBy: 'Sortieren nach', noResults: 'Keine Ergebnisse', tryAgain: 'Erneut versuchen', learnMore: 'Mehr erfahren' },
      errors: { notFound: 'Seite nicht gefunden', serverError: 'Serverfehler', networkError: 'Netzwerkfehler', unauthorized: 'Nicht autorisiert', forbidden: 'Zugriff verweigert' },
      tooltips: { launchTool: 'Dieses Tool in neuem Tab öffnen', buyTool: 'In den Warenkorb', searchTools: 'Nach Name suchen', languageSelector: 'Sprache ändern' },
    },
  },

  // Italian - Italiano
  it: {
    translation: {
      nav: { store: 'Negozio', tools: 'Strumenti', tutorials: 'Tutorial', about: 'Chi Siamo', contentHub: 'Hub Contenuti', getStarted: 'Sfoglia Strumenti', dashboard: 'Il Mio Vault' },
      hero: {
        badge: 'Negozio Strumenti IA Premium',
        title: 'Acquista Strumenti IA Premium',
        titleHighlight: 'Individualmente',
        description: 'Accedi a ChatGPT, Midjourney, Claude, Runway e oltre 50 strumenti IA premium. Acquista solo ciò di cui hai bisogno.',
        cta: 'Vai al Negozio',
        ctaSecondary: 'Il Mio Vault',
        stats: { tools: 'Strumenti Premium', users: 'Utenti Soddisfatti', uptime: 'Disponibilità' },
      },
      store: {
        badge: 'Strumenti IA Premium',
        title: 'Scegli i Tuoi',
        titleHighlight: 'Strumenti IA',
        description: 'Acquista accesso individuale a strumenti IA premium. Nessun bundle, nessun impegno.',
        searchPlaceholder: 'Cerca strumenti...',
        monthlyAccess: 'Accesso Mensile',
        perMonth: '/mese',
        buyNow: 'Acquista Ora',
        noResults: 'Nessuno strumento trovato',
        tryAgain: 'Prova un altro termine',
        categories: { all: 'Tutti', text: 'Testo e Chat', image: 'Generazione Immagini', video: 'Video e Audio', coding: 'Programmazione e Software' },
      },
      resources: { title: 'Impara e Padroneggia', subtitle: 'Tutorial', description: 'Tutorial passo-passo per padroneggiare ogni strumento IA.', readMore: 'Leggi di Più', watchVideo: 'Guarda Video', viewAll: 'Vedi Tutte le Risorse', article: { tutorial: 'Tutorial', guide: 'Guida', deepDive: 'Approfondimento' } },
      cta: { title: 'Pronto a Sbloccare Strumenti IA Premium?', description: 'Unisciti a migliaia di creatori e aziende.', button: 'Inizia ad Acquistare' },
      footer: { description: 'Strumenti IA premium a prezzi accessibili.', product: 'Prodotto', company: 'Azienda', legal: 'Legale', rights: 'Tutti i diritti riservati.', links: { features: 'Funzionalità', pricing: 'Prezzi', integrations: 'Integrazioni', changelog: 'Registro Modifiche', roadmap: 'Roadmap', about: 'Chi Siamo', blog: 'Blog', careers: 'Carriere', press: 'Stampa', partners: 'Partner', privacy: 'Privacy', terms: 'Termini', security: 'Sicurezza', cookies: 'Cookie', status: 'Stato', sitemap: 'Mappa Sito' } },
      dashboard: { vaultTitle: 'Il Mio Vault', vaultSubtitle: 'I tuoi strumenti IA acquistati', allToolsActive: 'Tutti gli Strumenti Attivi', secureAccess: 'Accesso Sicuro', toolsOwned: 'strumenti posseduti', searchTools: 'Cerca i tuoi strumenti...', launchTool: 'Avvia Strumento', purchasedOn: 'Acquistato il', noToolsFound: 'Nessuno strumento trovato', browseStore: 'Sfoglia il negozio per acquistare strumenti IA', goToStore: 'Vai al Negozio' },
      contentHub: { title: 'Hub Contenuti', subtitle: 'Conoscenza IA Esperta', description: 'Tutorial selezionati e approfondimenti esperti.', searchPlaceholder: 'Cerca articoli...', featuredVideos: 'In Evidenza Questo Mese', videoCount: 'video tutorial selezionati', articles: 'Articoli', loadMore: 'Carica Altri', views: 'visualizzazioni', minRead: 'min di lettura' },
      common: { loading: 'Caricamento...', error: 'Si è verificato un errore', success: 'Successo!', cancel: 'Annulla', confirm: 'Conferma', save: 'Salva', delete: 'Elimina', edit: 'Modifica', close: 'Chiudi', search: 'Cerca', filter: 'Filtra', sortBy: 'Ordina per', noResults: 'Nessun risultato', tryAgain: 'Riprova', learnMore: 'Scopri di più' },
      errors: { notFound: 'Pagina non trovata', serverError: 'Errore del server', networkError: 'Errore di rete', unauthorized: 'Non autorizzato', forbidden: 'Accesso negato' },
      tooltips: { launchTool: 'Apri questo strumento in una nuova scheda', buyTool: 'Aggiungi al carrello', searchTools: 'Cerca per nome', languageSelector: 'Cambia lingua' },
    },
  },

  // Dutch - Nederlands (Belgium)
  nl: {
    translation: {
      nav: { store: 'Winkel', tools: 'Tools', tutorials: 'Tutorials', about: 'Over Ons', contentHub: 'Content Hub', getStarted: 'Bekijk Tools', dashboard: 'Mijn Kluis' },
      hero: {
        badge: 'Premium AI Tools Winkel',
        title: 'Koop Premium AI Tools',
        titleHighlight: 'Individueel',
        description: 'Toegang tot ChatGPT, Midjourney, Claude, Runway en meer dan 50 premium AI tools. Koop alleen wat je nodig hebt.',
        cta: 'Bekijk Winkel',
        ctaSecondary: 'Mijn Kluis',
        stats: { tools: 'Premium Tools', users: 'Tevreden Gebruikers', uptime: 'Uptime' },
      },
      store: {
        badge: 'Premium AI Tools',
        title: 'Kies Jouw',
        titleHighlight: 'AI Tools',
        description: 'Koop individuele toegang tot premium AI tools. Geen bundels, geen verplichtingen.',
        searchPlaceholder: 'Zoek tools...',
        monthlyAccess: 'Maandelijkse Toegang',
        perMonth: '/ma',
        buyNow: 'Nu Kopen',
        noResults: 'Geen tools gevonden',
        tryAgain: 'Probeer een andere zoekterm',
        categories: { all: 'Alle Tools', text: 'Tekst & Chat', image: 'Afbeelding Generatie', video: 'Video & Audio', coding: 'Programmeren & Software' },
      },
      resources: { title: 'Leer & Beheers', subtitle: 'Tutorials', description: 'Stap-voor-stap tutorials om elke AI tool te beheersen.', readMore: 'Lees Meer', watchVideo: 'Bekijk Video', viewAll: 'Alle Bronnen Bekijken', article: { tutorial: 'Tutorial', guide: 'Gids', deepDive: 'Diepgaande Analyse' } },
      cta: { title: 'Klaar om Premium AI Tools te Ontgrendelen?', description: 'Sluit je aan bij duizenden makers en bedrijven.', button: 'Start met Winkelen' },
      footer: { description: 'Premium AI tools tegen betaalbare prijzen.', product: 'Product', company: 'Bedrijf', legal: 'Juridisch', rights: 'Alle rechten voorbehouden.', links: { features: 'Functies', pricing: 'Prijzen', integrations: 'Integraties', changelog: 'Wijzigingslogboek', roadmap: 'Roadmap', about: 'Over Ons', blog: 'Blog', careers: 'Carrières', press: 'Pers', partners: 'Partners', privacy: 'Privacy', terms: 'Voorwaarden', security: 'Beveiliging', cookies: 'Cookies', status: 'Status', sitemap: 'Sitemap' } },
      dashboard: { vaultTitle: 'Mijn Kluis', vaultSubtitle: 'Je gekochte AI tools', allToolsActive: 'Alle Tools Actief', secureAccess: 'Veilige Toegang', toolsOwned: 'tools in bezit', searchTools: 'Zoek je tools...', launchTool: 'Start Tool', purchasedOn: 'Gekocht op', noToolsFound: 'Geen tools gevonden', browseStore: 'Bekijk de winkel om AI tools te kopen', goToStore: 'Ga naar Winkel' },
      contentHub: { title: 'Content Hub', subtitle: 'Expert AI Kennis', description: 'Geselecteerde tutorials en expert inzichten.', searchPlaceholder: 'Zoek artikelen...', featuredVideos: 'Uitgelicht Deze Maand', videoCount: 'geselecteerde video tutorials', articles: 'Artikelen', loadMore: 'Meer Laden', views: 'weergaven', minRead: 'min leestijd' },
      common: { loading: 'Laden...', error: 'Er is een fout opgetreden', success: 'Succes!', cancel: 'Annuleren', confirm: 'Bevestigen', save: 'Opslaan', delete: 'Verwijderen', edit: 'Bewerken', close: 'Sluiten', search: 'Zoeken', filter: 'Filteren', sortBy: 'Sorteren op', noResults: 'Geen resultaten', tryAgain: 'Opnieuw proberen', learnMore: 'Meer weten' },
      errors: { notFound: 'Pagina niet gevonden', serverError: 'Serverfout', networkError: 'Netwerkfout', unauthorized: 'Niet geautoriseerd', forbidden: 'Toegang geweigerd' },
      tooltips: { launchTool: 'Open deze tool in een nieuw tabblad', buyTool: 'Toevoegen aan winkelwagen', searchTools: 'Zoeken op naam', languageSelector: 'Taal wijzigen' },
    },
  },
};

// Language configuration with flags, RTL support, and font families
export const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧', rtl: false, font: 'Inter' },
  { code: 'zh', name: '中文', flag: '🇨🇳', rtl: false, font: 'Noto Sans SC' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', rtl: false, font: 'Noto Sans Devanagari' },
  { code: 'es', name: 'Español', flag: '🇪🇸', rtl: false, font: 'Inter' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', rtl: false, font: 'Inter' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true, font: 'Cairo' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩', rtl: false, font: 'Noto Sans Bengali' },
  { code: 'pt', name: 'Português', flag: '🇧🇷', rtl: false, font: 'Inter' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', rtl: false, font: 'Inter' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰', rtl: true, font: 'Noto Sans Arabic' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', rtl: false, font: 'Inter' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', rtl: false, font: 'Inter' },
  { code: 'nl', name: 'Nederlands', flag: '🇧🇪', rtl: false, font: 'Inter' },
];

// Get stored language or detect from browser
const getInitialLanguage = (): string => {
  const stored = localStorage.getItem('ai-deals-language');
  if (stored && languages.some(l => l.code === stored)) {
    return stored;
  }
  
  // Try to detect from browser
  const browserLang = navigator.language.split('-')[0];
  if (languages.some(l => l.code === browserLang)) {
    return browserLang;
  }
  
  return 'en';
};

// Initialize i18n
i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

// Apply initial settings
const initialLang = languages.find(l => l.code === i18n.language) || languages[0];
document.documentElement.dir = initialLang.rtl ? 'rtl' : 'ltr';
document.documentElement.style.fontFamily = `'${initialLang.font}', 'Inter', sans-serif`;

// Listen for language changes to persist and apply settings
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('ai-deals-language', lng);
  const lang = languages.find(l => l.code === lng) || languages[0];
  document.documentElement.dir = lang.rtl ? 'rtl' : 'ltr';
  document.documentElement.style.fontFamily = `'${lang.font}', 'Inter', sans-serif`;
});

export default i18n;
