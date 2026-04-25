const STRIPE_PAYMENT_LINKS_BY_PLAN: Record<string, string> = {
  'canva:team_admin': 'https://buy.stripe.com/00wcN5a481gQ6QwcUT0Ba00',
  'capcut:personal_1m': 'https://buy.stripe.com/8x26oHfos6Ba2Ag3kj0Ba01',
  'chatgpt:ready_account': 'https://buy.stripe.com/eVq6oH5NSgbK0s8cUT0Ba02',
  'chatgpt:business': 'https://buy.stripe.com/fZu14ngsw7Fea2IcUT0Ba03',
  'coursera:plus_upgrade': 'https://buy.stripe.com/9B6eVd9049NmcaQaML0Ba04',
  'elevenlabs:creator_1m': 'https://buy.stripe.com/eVq3cv6RW9Nm3Ekf310Ba05',
  'eset:key_1y': 'https://buy.stripe.com/aFa5kD4JOaRqdeU0870Ba07',
  'grok:supergrok_1m': 'https://buy.stripe.com/aFa7sL0tycZy3Ekf310Ba08',
  'linkedin:career_3m': 'https://buy.stripe.com/bJe5kDdgkcZyfn25sr0Ba0a',
  'lovable:pro_monthly': 'https://buy.stripe.com/00w3cv6RW3oY7UAbQP0Ba0c',
  'lovable:lovable_2_months': 'https://buy.stripe.com/fZu3cv7W0f7G0s85sr0Ba0b',
  'lovable:lovable_3_months': 'https://buy.stripe.com/14A5kDdgke3C6Qw7Az0Ba0d',
  'microsoft_365:365_1year': 'https://buy.stripe.com/dRm5kD2BGf7G6QwaML0Ba0e',
  'microsoft_365:365_lifetime': 'https://buy.stripe.com/3cI7sLdgk3oY0s8f310Ba0f',
  'notion:edu_plus_1y': 'https://buy.stripe.com/6oU8wPgsw6Ba0s8dYX0Ba0g',
  'microsoft_office:pro_plus_key': 'https://buy.stripe.com/eVq4gz2BG4t27UA2gf0Ba0h',
  'perplexity:pro_1y': 'https://buy.stripe.com/bJe7sL0tygbK2Ag2gf0Ba0i',
  'windows:retail_online': 'https://buy.stripe.com/dRm8wP904e3CeiYg750Ba0j',
  'windows_home:retail_online': 'https://buy.stripe.com/3cIcN59049Nm1wcbQP0Ba0k',
  'windows_server:server_key': 'https://buy.stripe.com/9B614n4JOgbK6Qw0870Ba0l',
  'zoom:pro_28d': 'https://buy.stripe.com/eVq6oHdgk5x6fn21cb0Ba0m',
};

export const getStripePaymentLink = (toolId?: string, planId?: string, email?: string) => {
  if (!toolId || !planId) return null;

  const link = STRIPE_PAYMENT_LINKS_BY_PLAN[`${toolId}:${planId}`];
  if (!link) return null;

  if (!email) return link;

  const url = new URL(link);
  url.searchParams.set('prefilled_email', email);
  return url.toString();
};