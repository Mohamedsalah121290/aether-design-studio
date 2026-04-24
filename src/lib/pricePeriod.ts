/**
 * Period detection + formatting for product/plan prices.
 * Categories: one-time | monthly | yearly.
 *
 * Color tokens (semantic, NOT changing the rest of the design):
 *  - one-time → green
 *  - monthly  → blue
 *  - yearly   → orange
 */

export type PricePeriod = 'one-time' | 'monthly' | 'yearly';

export interface PeriodStyle {
  /** Tailwind text color class for the price + label */
  textClass: string;
  /** Glow / text-shadow for the price */
  textShadow: string;
  /** Suffix to append after the amount, e.g. "/ month" */
  suffix: string;
  /** Short label shown next to price */
  label: string;
}

const PERIOD_STYLES: Record<PricePeriod, PeriodStyle> = {
  'one-time': {
    textClass: 'text-emerald-400',
    textShadow: '0 0 14px rgba(52, 211, 153, 0.25)',
    suffix: 'one time',
    label: 'One-Time',
  },
  monthly: {
    textClass: 'text-sky-400',
    textShadow: '0 0 14px rgba(56, 189, 248, 0.25)',
    suffix: '/ month',
    label: 'Monthly',
  },
  yearly: {
    textClass: 'text-orange-400',
    textShadow: '0 0 14px rgba(251, 146, 60, 0.25)',
    suffix: '/ year',
    label: 'Yearly',
  },
};

/**
 * Infer the period from a plan name string.
 * Rules (per business spec):
 *   "lifetime" / "key" / "MAK" / "retail online" → one-time
 *   "year" / "1y" / "1 year" / "2 years" / "/ year" → yearly
 *   "month" / "monthly" / "28 days" / "days" / "/mo" → monthly
 *   default → monthly (safest for subscription catalog)
 */
export function inferPeriodFromPlan(planName?: string | null): PricePeriod {
  const s = (planName || '').toLowerCase();

  // One-time markers
  if (
    s.includes('lifetime') ||
    s.includes(' key') ||
    s.endsWith('key') ||
    s.includes('mak') ||
    s.includes('retail online') ||
    s.includes('one time') ||
    s.includes('one-time') ||
    s.includes('perpetual')
  ) {
    return 'one-time';
  }

  // Yearly markers
  if (
    s.includes('year') ||
    s.includes('/yr') ||
    s.includes('/ yr') ||
    s.includes('annual') ||
    /\b\d+\s*y\b/.test(s)
  ) {
    return 'yearly';
  }

  // Monthly / day-based (28 days = monthly per spec)
  if (
    s.includes('month') ||
    s.includes('/mo') ||
    s.includes('day')
  ) {
    return 'monthly';
  }

  // Sensible default for subscription catalog
  return 'monthly';
}

export function getPeriodStyle(period: PricePeriod): PeriodStyle {
  return PERIOD_STYLES[period];
}

/** Format a price as "€XX" with optional decimals only when needed. */
export function formatEuro(amount: number): string {
  if (!isFinite(amount)) return '€0';
  // Show 2 decimals only when not an integer
  const rounded = Math.round(amount * 100) / 100;
  if (Number.isInteger(rounded)) return `€${rounded}`;
  return `€${rounded.toFixed(2)}`;
}
