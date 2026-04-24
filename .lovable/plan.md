## Goal

Ship 20 new SEO-ready `/blog/<slug>` stub articles in all 7 languages (en, fr, nl, de, es, pt, ar with RTL), make them indexable, ensure correct hreflang/canonical, and surface them in the Resources/Learn hub via localized CTAs.

This sits alongside the existing 12 `/article/:id` pages — those stay untouched. The new pages live at `/blog/<slug>` so they can rank as standalone editorial URLs.

## Scope

### 1. New 20 blog slugs (Belgium-focused, AI/SaaS access angle)

```text
chatgpt-plus-belgique-acces-membre
midjourney-pro-belgie-toegang
office-365-belgium-business-deal
adobe-creative-cloud-belgium-discount
windows-11-pro-license-belgium
ai-tools-belgie-vergelijking-2026
chatgpt-vs-claude-belgique
best-ai-tools-small-business-belgium
notion-ai-vs-chatgpt-belgique
canva-pro-belgium-team-pricing
gpt-5-features-belgium-business
ai-stack-freelancer-belgique
midjourney-vs-dalle-belgium-creators
ai-deals-vs-resellers-belgium
secure-ai-payment-bancontact
gdpr-ai-tools-belgium-guide
how-to-save-90-percent-on-ai-subscriptions
ai-academy-belgium-learn-monetize
ai-tools-vlaanderen-bedrijven
ia-pour-pme-wallonie
```

### 2. Per-page localized SEO (×7 languages)

For each slug: title, meta description, primary keyword, 3 secondary keywords, H1, intro, 4 short content sections (stub-quality, editorial — not direct translation), and a CTA. Stored in a new `src/lib/seo/blogPosts.ts` module so it cleanly extends the existing `articleSeo.ts` pattern.

### 3. Routing & rendering

- Add route: `<Route path="/blog/:slug" element={<BlogArticlePage />}>` in `src/App.tsx`.
- Create `src/pages/BlogArticlePage.tsx` reusing the visual structure of `ArticlePage.tsx` (Navbar, hero, body renderer, related, Footer) — no design changes.
- Loads slug from `blogPosts.ts`, picks language via `i18n.language` → `resolveSeoLang`, falls back to English if a language entry is missing.
- 404 stub for unknown slug (mirrors ArticlePage `notFound`).

### 4. SEO injection per blog page

Each `/blog/<slug>` page renders `<SEO>` with:
- `page="blog"` + `pathOverride={`/blog/${slug}`}`
- `titleOverride`, `descriptionOverride`, `keywordsOverride` from `blogPosts.ts`
- `ogType="article"` + slug-specific OG image fallback (`/og/blog-${lang}.png` until per-slug images are generated)
- JSON-LD: `Article` + `BreadcrumbList` (Home → Blog → Article) + `Organization` publisher
- Canonical = `https://aideals.be/blog/<slug>?lang=<lang>`
- hreflang alternates for all 7 languages + `x-default`

### 5. Sitemap + robots

- Append 20 × 7 = 140 new `<url>` blocks to `public/sitemap.xml` (priority 0.7, changefreq weekly), each with full hreflang alternates including `x-default`.
- Add a `Sitemap:` reference (already present) and explicitly `Allow: /blog/` in `public/robots.txt`. Keep existing `Disallow` rules untouched.

### 6. Hreflang & canonical verification

Add a small dev-only check in `src/pages/SeoAudit.tsx`:
- For every `/blog/<slug>` × language, assert canonical matches `SITE_URL + path + ?lang=<lang>` and the hreflang set contains all 7 langs + `x-default`.
- Surface mismatches as red rows in the existing audit table; CSV export already covers this.

### 7. Localized CTAs in Resources/Learn hub

In `src/pages/ContentHub.tsx` (the Resources/Learn hub rendered by `/blog`):
- Add a new section "Latest Belgium AI Guides" / localized title (i18n keys: `hub.belgiumGuidesTitle`, `hub.belgiumGuidesSubtitle`, `hub.readGuide`, `hub.viewAllGuides`).
- Render the first 6 of the 20 new posts as cards linking to `/blog/<slug>?lang=<current>`.
- Add localized CTA strings to `src/lib/i18n.ts` for all 13 supported i18n locales (the 7 SEO languages plus the rest fall back to English copy).
- Keeps current grid styling (`glass rounded-2xl`, same card structure) — no layout change.

## Technical notes

- Falls back gracefully: if `blogPosts.ts` lacks a language entry for a slug, `<SEO>` and the renderer use the English entry but keep the active `lang` for hreflang/canonical.
- No new dependencies. Reuses `react-helmet-async`, `react-i18next`, existing `<SEO>` component, and the existing OG generator (per-slug OG images can be added later via the existing `scripts/generate-og-images.mjs` by extending its page list — out of scope for this round, English fallback OG used).
- ArticleStub content per slug is intentionally short (≈250–400 words editorial scaffold per language) — enough for indexing without thin-content penalty, designed to be expanded later.
- All edits respect existing design system (8pt spacing, glass cards, Inter font, no layout changes).

## Files

**New**
- `src/lib/seo/blogPosts.ts` — slug → 7-language `{ title, description, primaryKeyword, secondaryKeywords, h1, intro, sections[], cta }`
- `src/pages/BlogArticlePage.tsx` — renderer for `/blog/:slug`

**Modified**
- `src/App.tsx` — add `/blog/:slug` route
- `public/sitemap.xml` — append 140 URL blocks
- `public/robots.txt` — explicit `Allow: /blog/`
- `src/pages/ContentHub.tsx` — new "Belgium AI Guides" section with localized CTAs
- `src/lib/i18n.ts` — add `hub.*` CTA strings for all locales
- `src/pages/SeoAudit.tsx` — extend audit to cover the 20 new slugs × 7 langs

## Out of scope (call out before implementing)

- Generating 140 per-slug OG images (`/og/blog-<slug>-<lang>.png`). English/blog fallback OG is used. Can be a follow-up using the existing `scripts/generate-og-images.mjs`.
- Writing full long-form article bodies. Content is editorial-quality stubs ready to be expanded.
