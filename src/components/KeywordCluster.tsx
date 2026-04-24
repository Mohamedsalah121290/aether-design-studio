import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SEO_MAP, resolveSeoLang, type SeoPageKey } from '@/lib/seo/seoMap';

interface KeywordClusterProps {
  page: SeoPageKey;
  /** Optional CTA target — defaults to /store */
  ctaHref?: string;
  /** Optional CTA label override */
  ctaLabel?: string;
}

/**
 * SEO-aware on-page block: renders an H2 + H3s + paragraph + CTA driven by the
 * page's keyword cluster. This keeps content matched to the assigned primary
 * and secondary keywords without keyword-stuffing.
 */
const KeywordCluster = ({ page, ctaHref = '/store', ctaLabel }: KeywordClusterProps) => {
  const { i18n } = useTranslation();
  const lang = resolveSeoLang(i18n.language);
  const entry = SEO_MAP[page]?.[lang] ?? SEO_MAP[page]?.en;
  if (!entry) return null;

  const cta =
    ctaLabel ??
    (lang === 'fr' ? 'Voir les outils'
    : lang === 'nl' ? 'Bekijk de tools'
    : lang === 'de' ? 'Tools ansehen'
    : lang === 'es' ? 'Ver herramientas'
    : lang === 'pt' ? 'Ver ferramentas'
    : lang === 'ar' ? 'استكشف الأدوات'
    : 'Explore the tools');

  const intro =
    lang === 'fr' ? `Tout ce dont vous avez besoin pour ${entry.primaryKeyword}, sans complexité.`
    : lang === 'nl' ? `Alles wat je nodig hebt voor ${entry.primaryKeyword}, zonder gedoe.`
    : lang === 'de' ? `Alles, was Sie für ${entry.primaryKeyword} brauchen, ohne Aufwand.`
    : lang === 'es' ? `Todo lo necesario para ${entry.primaryKeyword}, sin complicaciones.`
    : lang === 'pt' ? `Tudo o que precisa para ${entry.primaryKeyword}, sem complicações.`
    : lang === 'ar' ? `كل ما تحتاجه لـ ${entry.primaryKeyword} دون تعقيد.`
    : `Everything you need for ${entry.primaryKeyword} — without the complexity.`;

  return (
    <section
      aria-labelledby={`kw-${page}`}
      className="container mx-auto px-4 py-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto glass rounded-3xl p-8 md:p-12"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 text-primary text-xs font-medium mb-4 glass">
          <Sparkles className="w-3.5 h-3.5" />
          {entry.primaryKeyword}
        </span>

        <h2 id={`kw-${page}`} className="text-2xl md:text-3xl font-display font-bold mb-3">
          {entry.h1}
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">{intro}</p>

        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {entry.secondaryKeywords.slice(0, 6).map((kw) => (
            <h3
              key={kw}
              className="text-sm font-medium text-foreground/90 px-4 py-3 rounded-xl border border-border/50 bg-card/50"
            >
              {kw}
            </h3>
          ))}
        </div>

        <Link
          to={ctaHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
        >
          {cta}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  );
};

export default KeywordCluster;
