export const stripeLinks = {
  p01: 'https://buy.stripe.com/00wcN5a481gQ6QwcUT0Ba00',
  p02: 'https://buy.stripe.com/8x26oHfos6Ba2Ag3kj0Ba01',
  p03: 'https://buy.stripe.com/eVq6oH5NSgbK0s8cUT0Ba02',
  p04: 'https://buy.stripe.com/fZu14ngsw7Fea2IcUT0Ba03',
  p05: 'https://buy.stripe.com/9B6eVd9049NmcaQaML0Ba04',
  p06: 'https://buy.stripe.com/eVq3cv6RW9Nm3Ekf310Ba05',
  p07: 'https://buy.stripe.com/aFa5kD4JOaRqdeU0870Ba07',
  p08: 'https://buy.stripe.com/aFa7sL0tycZy3Ekf310Ba08',
  p09: 'https://buy.stripe.com/bJe5kDdgkcZyfn25sr0Ba0a',
  p10: 'https://buy.stripe.com/00w3cv6RW3oY7UAbQP0Ba0c',
  p11: 'https://buy.stripe.com/fZu3cv7W0f7G0s85sr0Ba0b',
  p12: 'https://buy.stripe.com/14A5kDdgke3C6Qw7Az0Ba0d',
  p13: 'https://buy.stripe.com/dRm5kD2BGf7G6QwaML0Ba0e',
  p14: 'https://buy.stripe.com/3cI7sLdgk3oY0s8f310Ba0f',
  p15: 'https://buy.stripe.com/6oU8wPgsw6Ba0s8dYX0Ba0g',
  p16: 'https://buy.stripe.com/eVq4gz2BG4t27UA2gf0Ba0h',
  p17: 'https://buy.stripe.com/bJe7sL0tygbK2Ag2gf0Ba0i',
  p18: 'https://buy.stripe.com/dRm8wP904e3CeiYg750Ba0j',
  p19: 'https://buy.stripe.com/3cIcN59049Nm1wcbQP0Ba0k',
  p20: 'https://buy.stripe.com/9B614n4JOgbK6Qw0870Ba0l',
  p21: 'https://buy.stripe.com/eVq6oHdgk5x6fn21cb0Ba0m',
} as const;

export const productStripeMap: Record<string, keyof typeof stripeLinks> = {
  'chatgpt plus': 'p01',
  'chatgpt ready account': 'p01',
  'chatgpt pro 1 month': 'p01',
  'chatgpt': 'p01',
  'chatgpt business': 'p02',
  'business 4 invites': 'p02',
  'canva pro': 'p03',
  'canva team admin': 'p03',
  'canva': 'p03',
  'capcut pro': 'p04',
  'capcut pro personal': 'p04',
  'capcut': 'p04',
  'perplexity ai pro': 'p05',
  'perplexity pro': 'p05',
  'perplexity': 'p05',
  'lovable ai 3 months': 'p06',
  'lovable 3 months': 'p06',
  'lovable 3 months plan': 'p06',
  'lovable ai 2 months': 'p07',
  'lovable 2 months': 'p07',
  'lovable 2 months plan': 'p07',
  'lovable ai 1 month': 'p21',
  'lovable 1 month': 'p21',
  'lovable pro 1 month': 'p21',
  'lovable pro monthly': 'p21',
  'lovable': 'p06',
  'elevenlabs creator': 'p08',
  'elevenlabs': 'p08',
  'grok supergrok': 'p09',
  'supergrok': 'p09',
  'grok': 'p09',
  'microsoft office 365 lifetime': 'p14',
  'office 365 lifetime': 'p14',
  'microsoft office 365': 'p10',
  'office 365': 'p10',
  'office pro plus': 'p11',
  'microsoft office pro plus': 'p11',
  'windows 11 pro': 'p12',
  'windows 10 11 pro retail online': 'p14',
  'windows 10 11 pro': 'p14',
  'windows 10/11 key retail online': 'p14',
  'windows 11 home': 'p13',
  'windows 10 11 key home': 'p13',
  'windows 10 11 home': 'p13',
  'windows server': 'p15',
  'server standard datacenter key': 'p15',
  'notion education plus': 'p16',
  'coursera plus': 'p17',
  'coursera': 'p17',
  'linkedin premium career': 'p18',
  'linkedin premium': 'p18',
  'zoom pro': 'p19',
  'eset internet security': 'p20',
  'other product': 'p21',
};

const normalizeProductName = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const withPrefilledEmail = (link: string, email?: string) => {
  if (!email) return link;

  const url = new URL(link);
  url.searchParams.set('prefilled_email', email);
  return url.toString();
};

export function getStripeLink(productName: string, planName?: string, email?: string) {
  const normalized = normalizeProductName(`${productName} ${planName || ''}`);
  const key = Object.keys(productStripeMap)
    .sort((a, b) => normalizeProductName(b).length - normalizeProductName(a).length)
    .find((name) => normalized.includes(normalizeProductName(name)));

  if (!key) {
    console.warn('Missing Stripe link for product:', productName);
    return null;
  }

  const link = stripeLinks[productStripeMap[key]];
  return link.startsWith('https://buy.stripe.com/') ? withPrefilledEmail(link, email) : null;
}