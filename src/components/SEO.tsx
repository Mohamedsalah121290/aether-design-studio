import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  SEO_MAP,
  SEO_LANGS,
  PAGE_PATHS,
  SITE_URL,
  resolveSeoLang,
  canonicalUrl,
  type SeoPageKey,
} from '@/lib/seo/seoMap';
import { languages } from '@/lib/i18n';

interface SEOProps {
  page: SeoPageKey;
  /** Override path (used for dynamic routes like /article/:id) */
  pathOverride?: string;
  /** Override image */
  image?: string;
  /** Append a JSON-LD structured data block */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** Set noindex (e.g. for member-only routes) */
  noIndex?: boolean;
  /** Override title (used for dynamic article pages) */
  titleOverride?: string;
  /** Override meta description (used for dynamic article pages) */
  descriptionOverride?: string;
  /** Override keyword list (joined into the meta keywords tag) */
  keywordsOverride?: string[];
  /** Override the page-level og:type (default 'website'; use 'article' for blog posts) */
  ogType?: string;
}

const SEO = ({
  page,
  pathOverride,
  image,
  jsonLd,
  noIndex,
  titleOverride,
  descriptionOverride,
  keywordsOverride,
  ogType,
}: SEOProps) => {
  const { i18n } = useTranslation();
  const lang = resolveSeoLang(i18n.language);
  const entry = SEO_MAP[page]?.[lang] ?? SEO_MAP[page]?.en;

  if (!entry) return null;

  const path = pathOverride ?? PAGE_PATHS[page];
  const url = canonicalUrl(path);
  const title = titleOverride ?? entry.title;
  const description = descriptionOverride ?? entry.description;
  const keywords =
    keywordsOverride ??
    [entry.primaryKeyword, ...entry.secondaryKeywords];
  // Per-language OG image (generated at build time) with sensible fallback.
  const ogImage =
    image ?? `${SITE_URL}/og/${page}-${lang}.png`;
  const appLang = i18n.language.split('-')[0].toLowerCase();
  const currentAppLang = languages.find((l) => l.code === appLang) ?? languages[0];
  const dir = currentAppLang.rtl ? 'rtl' : 'ltr';

  // Build hreflang alternates for all 7 supported languages.
  const alternates = SEO_LANGS.map((l) => ({
    hrefLang: l,
    href: `${SITE_URL}${path === '/' ? '' : path}?lang=${l}`,
  }));

  return (
    <Helmet>
      <html lang={lang} dir={dir} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}

      {/* Canonical */}
      <link rel="canonical" href={url} />

      {/* Hreflang */}
      {alternates.map((alt) => (
        <link key={alt.hrefLang} rel="alternate" hrefLang={alt.hrefLang} href={alt.href} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType ?? 'website'} />
      <meta property="og:site_name" content="AI DEALS" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={titleOverride ?? entry.ogTitle ?? entry.title} />
      <meta property="og:description" content={descriptionOverride ?? entry.ogDescription ?? entry.description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={lang} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={titleOverride ?? entry.ogTitle ?? entry.title} />
      <meta name="twitter:description" content={descriptionOverride ?? entry.ogDescription ?? entry.description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
