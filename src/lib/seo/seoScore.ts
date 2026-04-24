// SEO scoring rubric — 50 points total. If <45, the entry is auto-rewritten
// (compressed/expanded to fit limits, primary keyword inserted) and re-scored.
import { SEO_MAP, SEO_LANGS, type SeoEntry, type SeoPageKey } from './seoMap';

export interface ScoreBreakdown {
  titleLength: number;        // 0..10
  descLength: number;         // 0..10
  keywordInTitle: number;     // 0..10
  keywordInDesc: number;      // 0..5
  keywordInH1: number;        // 0..5
  hasSecondary: number;       // 0..5
  hasLongTail: number;        // 0..5
}
export interface PageScore {
  page: SeoPageKey;
  lang: string;
  total: number;              // /50
  breakdown: ScoreBreakdown;
  passes: boolean;
  initialTotal: number;
  rewritten: boolean;
  entry: SeoEntry;
}

const norm = (s: string) => s.toLowerCase();

export function scoreEntry(entry: SeoEntry): { total: number; breakdown: ScoreBreakdown } {
  const t = entry.title.trim();
  const d = entry.description.trim();
  const h = entry.h1.trim();
  const kw = norm(entry.primaryKeyword);

  const titleLen = t.length;
  const descLen = d.length;

  const breakdown: ScoreBreakdown = {
    titleLength: titleLen >= 35 && titleLen <= 65 ? 10 : titleLen >= 25 && titleLen <= 75 ? 6 : 2,
    descLength: descLen >= 120 && descLen <= 165 ? 10 : descLen >= 90 && descLen <= 180 ? 6 : 2,
    keywordInTitle: norm(t).includes(kw) ? 10 : 3,
    keywordInDesc: norm(d).includes(kw) ? 5 : 1,
    keywordInH1: norm(h).includes(kw) ? 5 : 1,
    hasSecondary: entry.secondaryKeywords.length >= 3 ? 5 : entry.secondaryKeywords.length >= 1 ? 3 : 0,
    hasLongTail: entry.longTail && entry.longTail.length > 0 ? 5 : 2,
  };
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
  return { total, breakdown };
}

/** Auto-rewrite to push score past threshold. Idempotent + safe. */
export function rewriteEntry(entry: SeoEntry): SeoEntry {
  let { title, description, h1, primaryKeyword, secondaryKeywords } = entry;
  const kw = primaryKeyword;

  // Inject keyword if missing
  if (!norm(title).includes(norm(kw))) {
    title = `${kw} — ${title}`;
  }
  if (!norm(description).includes(norm(kw))) {
    description = `${kw}. ${description}`;
  }
  if (!norm(h1).includes(norm(kw))) {
    h1 = `${kw} — ${h1}`;
  }

  // Trim title to ≤65
  if (title.length > 65) title = title.slice(0, 62).trimEnd() + '…';
  // Pad description to ≥120
  if (description.length < 120) {
    description = (description + ' ' + secondaryKeywords.slice(0, 2).join(', ')).slice(0, 165);
  }
  if (description.length > 165) description = description.slice(0, 162).trimEnd() + '…';

  return {
    ...entry,
    title,
    description,
    h1,
    longTail: entry.longTail && entry.longTail.length ? entry.longTail : [`best ${kw} 2025`, `${kw} pricing`],
  };
}

export function scoreAll(threshold = 45): PageScore[] {
  const out: PageScore[] = [];
  const pages = Object.keys(SEO_MAP) as SeoPageKey[];
  for (const page of pages) {
    for (const lang of SEO_LANGS) {
      const entry = SEO_MAP[page][lang];
      const initial = scoreEntry(entry);
      let final = initial;
      let finalEntry = entry;
      let rewritten = false;
      if (initial.total < threshold) {
        finalEntry = rewriteEntry(entry);
        final = scoreEntry(finalEntry);
        rewritten = true;
      }
      out.push({
        page,
        lang,
        total: final.total,
        breakdown: final.breakdown,
        passes: final.total >= threshold,
        initialTotal: initial.total,
        rewritten,
        entry: finalEntry,
      });
    }
  }
  return out;
}
