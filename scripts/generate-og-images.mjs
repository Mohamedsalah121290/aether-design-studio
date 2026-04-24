#!/usr/bin/env node
/**
 * Build-time OG image generator.
 * Produces a 1200x630 PNG per (page, language) into public/og/.
 *
 * Usage:  node scripts/generate-og-images.mjs
 *
 * Pulls localized titles from src/lib/seo/seoMap.ts (compiled-in data only;
 * we re-declare the language list and import via dynamic JSON-safe path).
 */
import { createCanvas } from '@napi-rs/canvas';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'public', 'og');
const SEO_MAP_PATH = join(ROOT, 'src', 'lib', 'seo', 'seoMap.ts');

// --- Brand palette (matches src/index.css HSL tokens, baked into RGB) -------
const BG_TOP = '#0B1120';
const BG_BOTTOM = '#070A14';
const ACCENT = '#7C5CFF';   // primary
const ACCENT_2 = '#22D3EE'; // secondary
const FG = '#FFFFFF';
const MUTED = '#94A3B8';

const W = 1200;
const H = 630;

// --- Parse seoMap.ts to get titles + languages without bundling TS ---------
async function loadSeoData() {
  const src = await readFile(SEO_MAP_PATH, 'utf8');

  // Languages
  const langMatch = src.match(/SEO_LANGS\s*=\s*\[([^\]]+)\]/);
  if (!langMatch) throw new Error('Could not parse SEO_LANGS');
  const langs = [...langMatch[1].matchAll(/'([a-z]{2})'/g)].map((m) => m[1]);

  // Pages: capture top-level keys of SEO_MAP
  const pageRegex = /^\s {2}'?([a-z0-9-]+)'?:\s*\{$/gm;
  const pages = [];
  let m;
  while ((m = pageRegex.exec(src))) pages.push(m[1]);

  // For each page × lang, grab the first matching title.
  const lines = src.split('\n');
  const data = {}; // page -> lang -> title
  let currentPage = null;
  let currentLang = null;
  for (const line of lines) {
    const pageMatch = line.match(/^ {2}'?([a-z0-9-]+)'?:\s*\{$/);
    if (pageMatch && pages.includes(pageMatch[1])) {
      currentPage = pageMatch[1];
      data[currentPage] = {};
      currentLang = null;
      continue;
    }
    const langStart = line.match(/^\s{4}([a-z]{2}):\s*\{/);
    if (langStart && currentPage) {
      currentLang = langStart[1];
      const titleInline = line.match(/title:\s*'((?:[^'\\]|\\.)*)'/);
      if (titleInline) {
        data[currentPage][currentLang] = titleInline[1].replace(/\\'/g, "'");
        currentLang = null;
      }
      continue;
    }
    if (currentPage && currentLang) {
      const t = line.match(/^\s+title:\s*'((?:[^'\\]|\\.)*)'/);
      if (t) {
        data[currentPage][currentLang] = t[1].replace(/\\'/g, "'");
        currentLang = null;
      }
    }
  }

  return { langs, pages, titles: data };
}

// Word-wrap helper for canvas
function wrap(ctx, text, maxWidth, maxLines) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width <= maxWidth) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = w;
      if (lines.length >= maxLines - 1) break;
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) lines.length = maxLines;
  // ellipsis
  if (lines.length === maxLines) {
    let last = lines[maxLines - 1];
    while (ctx.measureText(last + '…').width > maxWidth && last.length > 0) {
      last = last.slice(0, -1);
    }
    lines[maxLines - 1] = last + '…';
  }
  return lines;
}

const LANG_LABEL = {
  en: 'EN · Europe',
  fr: 'FR · Europe',
  nl: 'NL · België',
  de: 'DE · Europa',
  es: 'ES · Europa',
  pt: 'PT · Europa',
  ar: 'AR · أوروبا',
};

function drawCard(title, lang) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const isRTL = lang === 'ar';

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, BG_TOP);
  bg.addColorStop(1, BG_BOTTOM);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Soft accent glow
  const glow = ctx.createRadialGradient(W * 0.85, H * 0.15, 10, W * 0.85, H * 0.15, 700);
  glow.addColorStop(0, 'rgba(124,92,255,0.45)');
  glow.addColorStop(1, 'rgba(124,92,255,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  const glow2 = ctx.createRadialGradient(W * 0.1, H * 0.95, 10, W * 0.1, H * 0.95, 600);
  glow2.addColorStop(0, 'rgba(34,211,238,0.35)');
  glow2.addColorStop(1, 'rgba(34,211,238,0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, W, H);

  // Top-left wordmark
  ctx.textAlign = isRTL ? 'right' : 'left';
  ctx.textBaseline = 'top';
  const wordmarkX = isRTL ? W - 60 : 60;
  ctx.font = 'bold 36px sans-serif';
  if (isRTL) {
    ctx.fillStyle = FG;
    ctx.fillText('DEALS', wordmarkX, 60);
    const dealsW = ctx.measureText('DEALS').width;
    ctx.fillStyle = ACCENT;
    ctx.fillText('AI ', wordmarkX - dealsW - 6, 60);
  } else {
    ctx.fillStyle = ACCENT;
    ctx.fillText('AI', wordmarkX, 60);
    const aiW = ctx.measureText('AI').width;
    ctx.fillStyle = FG;
    ctx.fillText(' DEALS', wordmarkX + aiW, 60);
  }

  // Top-right language pill
  ctx.font = '500 22px sans-serif';
  const label = LANG_LABEL[lang] ?? lang.toUpperCase();
  const pad = 18;
  const labW = ctx.measureText(label).width + pad * 2;
  const labH = 44;
  const labX = isRTL ? 60 : W - 60 - labW;
  const labY = 56;
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  roundRect(ctx, labX, labY, labW, labH, 22);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 1;
  roundRect(ctx, labX, labY, labW, labH, 22);
  ctx.stroke();
  ctx.fillStyle = FG;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, labX + labW / 2, labY + labH / 2 + 1);

  // Title
  ctx.textAlign = isRTL ? 'right' : 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = FG;
  ctx.font = 'bold 64px sans-serif';
  const maxTitleWidth = W - 120;
  const titleX = isRTL ? W - 60 : 60;
  const titleLines = wrap(ctx, title, maxTitleWidth, 4);
  let y = 220;
  for (const line of titleLines) {
    ctx.fillText(line, titleX, y);
    y += 78;
  }

  // Bottom strip: brand promise
  const promise = isRTL
    ? 'وصول مُدار بأسعار الأعضاء · GDPR · إلغاء شهري'
    : 'Managed access at member pricing · GDPR-principled · Cancel anytime';
  ctx.font = '500 24px sans-serif';
  ctx.fillStyle = MUTED;
  ctx.textAlign = isRTL ? 'right' : 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText(promise, isRTL ? W - 60 : 60, H - 60);

  // Accent bar
  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, ACCENT);
  grad.addColorStop(1, ACCENT_2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, H - 8, W, 8);

  return canvas.toBuffer('image/png');
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const { langs, pages, titles } = await loadSeoData();

  let count = 0;
  let skipped = 0;
  for (const page of pages) {
    for (const lang of langs) {
      const title = titles[page]?.[lang] ?? titles[page]?.en;
      if (!title) {
        skipped++;
        continue;
      }
      const png = drawCard(title, lang);
      const file = join(OUT_DIR, `${page}-${lang}.png`);
      await writeFile(file, png);
      count++;
    }
  }
  console.log(`Generated ${count} OG images → public/og/  (${skipped} skipped)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
