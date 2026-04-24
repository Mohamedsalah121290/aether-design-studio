import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  SEO_MAP,
  SEO_LANGS,
  PAGE_PATHS,
  SITE_URL,
  DEFAULT_OG_IMAGE,
  resolveSeoLang,
  canonicalUrl,
  type SeoPageKey,
} from '@/lib/seo/seoMap';

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
}

const RTL_LANGS = new Set(['ar']);

const SEO = ({ page, pathOverride, image, jsonLd, noIndex }: SEOProps) => {
  const { i18n } = useTranslation();
  const lang = resolveSeoLang(i18n.language);
  const entry = SEO_MAP[page]?.[lang] ?? SEO_MAP[page]?.en;

  if (!entry) return null;

  const path = pathOverride ?? PAGE_PATHS[page];
  const url = canonicalUrl(path);
  const ogImage = image ?? DEFAULT_OG_IMAGE;
  const dir = RTL_LANGS.has(lang) ? 'rtl' : 'ltr';

  // Build hreflang alternates for all 7 supported languages.
  const alternates = SEO_LANGS.map((l) => ({
    hrefLang: l,
    href: `${SITE_URL}${path === '/' ? '' : path}?lang=${l}`,
  }));

  return (
    <Helmet>
      <html lang={lang} dir={dir} />
      <title>{entry.title}</title>
      <meta name="description" content={entry.description} />
      <meta
        name="keywords"
        content={[entry.primaryKeyword, ...entry.secondaryKeywords].join(', ')}
      />
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
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="AI DEALS" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={entry.ogTitle ?? entry.title} />
      <meta property="og:description" content={entry.ogDescription ?? entry.description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={lang} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={entry.ogTitle ?? entry.title} />
      <meta name="twitter:description" content={entry.ogDescription ?? entry.description} />
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
