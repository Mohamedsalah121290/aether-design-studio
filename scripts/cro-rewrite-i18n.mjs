/**
 * One-shot rewriter for src/lib/i18n.ts.
 *
 * For each supported language (in file order: en, zh, hi, es, fr, ar, bn, pt,
 * ru, ur, de, it, nl), replace the FIRST remaining `hero: { ... },` and
 * `store: { ... },` blocks with CRO/SEO-optimised copy.
 *
 * Run:  node scripts/cro-rewrite-i18n.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, '..', 'src', 'lib', 'i18n.ts');

// Order MUST match the order languages appear in src/lib/i18n.ts.
const ORDER = ['en','zh','hi','es','fr','ar','bn','pt','ru','ur','de','it','nl'];

// Trimmed: same map as the previous version, kept inline for one-shot run.
const COPY = await import('./cro-copy.mjs').then((m) => m.default);

const escape = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
function stringify(obj) {
  // Renders the object indented at 6 spaces (matching `      hero: {`).
  const lines = ['{'];
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === 'object') {
      lines.push(`        ${k}: {`);
      for (const [kk, vv] of Object.entries(v)) {
        lines.push(`          ${kk}: '${escape(vv)}',`);
      }
      lines.push(`        },`);
    } else {
      lines.push(`        ${k}: '${escape(v)}',`);
    }
  }
  lines.push('      },');
  return lines.join('\n');
}

function replaceFirst(src, regex, replacement) {
  const m = regex.exec(src);
  if (!m) return { src, ok: false };
  return { src: src.slice(0, m.index) + replacement + src.slice(m.index + m[0].length), ok: true };
}

async function main() {
  let src = await readFile(FILE, 'utf8');
  let heroReplaced = 0;
  let storeReplaced = 0;

  for (const lang of ORDER) {
    const copy = COPY[lang];
    if (!copy) {
      console.warn(`[skip] no COPY for ${lang}`);
      continue;
    }
    const heroRe = /hero:\s*\{[^]*?\n {6}\},/;
    const storeRe = /store:\s*\{[^]*?\n {6}\},/;

    // Always walk the FIRST remaining hero block (sequentially down the file).
    let r = replaceFirst(src, heroRe, `hero: ${stringify(copy.hero)}`);
    if (r.ok) { src = r.src; heroReplaced++; }
    else console.warn(`[miss] hero for ${lang}`);

    r = replaceFirst(src, storeRe, `store: ${stringify(copy.store)}`);
    if (r.ok) { src = r.src; storeReplaced++; }
    else console.warn(`[miss] store for ${lang}`);
  }

  await writeFile(FILE, src);
  console.log(`Done. hero blocks replaced: ${heroReplaced}/13 · store blocks replaced: ${storeReplaced}/13`);
}

main().catch((e) => { console.error(e); process.exit(1); });
