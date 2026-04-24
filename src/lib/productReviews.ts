export type ProductReview = {
  name: string;
  country: 'Belgium' | 'Germany' | 'France' | 'Netherlands' | 'Italy' | 'Spain';
  flag: string;
  rating: 4 | 5;
  quote: string;
  before?: string;
  after?: string;
};

const COUNTRY_POOL: ProductReview['country'][] = ['Belgium', 'Germany', 'France', 'Netherlands', 'Italy', 'Spain'];
const FLAG_BY_COUNTRY: Record<ProductReview['country'], string> = {
  Belgium: '🇧🇪',
  Germany: '🇩🇪',
  France: '🇫🇷',
  Netherlands: '🇳🇱',
  Italy: '🇮🇹',
  Spain: '🇪🇸',
};

const names = ['Thomas Peeters', 'Jonas Müller', 'Julien Moreau', 'Sophie Jansen', 'Marco Rossi', 'Laura Martínez', 'Daan Smit', 'Camille Laurent', 'Leon Fischer', 'Elise Dubois'];

const review = (name: string, country: ProductReview['country'], rating: 4 | 5, quote: string): ProductReview => ({
  name,
  country,
  flag: FLAG_BY_COUNTRY[country],
  rating,
  quote,
});

const SPECIFIC_REVIEWS: Record<string, ProductReview[]> = {
  chatgpt: [
    review('Thomas Peeters', 'Belgium', 5, 'Got ChatGPT Plus within minutes. Works perfectly, even on multiple devices.'),
    review('Jonas Müller', 'Germany', 5, 'I use ChatGPT daily now. A bit expensive, but definitely worth it for the speed.'),
    review('Julien Moreau', 'France', 5, 'Très rapide. ChatGPT fonctionne parfaitement depuis l’activation.'),
    review('Sophie Jansen', 'Netherlands', 4, 'At first I hesitated because of the price, but now I use ChatGPT every day.'),
  ],
  perplexity: [
    review('Daan Smit', 'Netherlands', 5, 'Perplexity is much faster for research than I expected.'),
    review('Camille Laurent', 'France', 4, 'Perplexity works really well. Not the cheapest, but reliable.'),
    review('Leon Fischer', 'Germany', 5, 'I use Perplexity for daily searches. Big improvement over free tools.'),
  ],
  canva: [
    review('Elise Dubois', 'Belgium', 5, 'Canva Pro activated the same day. Everything unlocked instantly.'),
    review('Marta Sánchez', 'Spain', 5, 'Canva Pro is very useful for social media. Worth the price in EUR.'),
    review('Giulia Bianchi', 'Italy', 4, 'Simple and fast. No issues after Canva activation.'),
  ],
  capcut: [
    review('Daniel López', 'Spain', 5, 'CapCut Pro unlocked everything I needed for editing.'),
    review('Noor Visser', 'Netherlands', 5, 'CapCut works perfectly. Fast activation on my phone and laptop.'),
    review('Antoine Girard', 'France', 4, 'Good editing tool, price is okay in EUR.'),
  ],
  elevenlabs: [
    review('Jonas Müller', 'Germany', 5, 'ElevenLabs voice quality is amazing. Works better than expected.'),
    review('Luca Romano', 'Italy', 5, 'I use ElevenLabs for content. Very powerful tool.'),
    review('Laura Martínez', 'Spain', 4, 'ElevenLabs is not cheap, but worth it for voice quality.'),
  ],
  windows: [
    review('Thomas Peeters', 'Belgium', 5, 'Windows activation worked instantly. No issues at all.'),
    review('Leon Fischer', 'Germany', 5, 'Windows key worked on the first try. Simple and fast.'),
    review('Sophie Jansen', 'Netherlands', 4, 'Windows 10 / 11 Pro activated fine. Good experience.'),
  ],
  windows_home: [
    review('Elise Dubois', 'Belgium', 5, 'Windows 10/11 Home key activated instantly on my laptop.'),
    review('Camille Laurent', 'France', 5, 'Windows Home worked on first try. Clear activation process.'),
    review('Marco Rossi', 'Italy', 4, 'Good value for a Windows Home key paid in EUR.'),
  ],
  microsoft_365: [
    review('Marco Rossi', 'Italy', 5, 'Office 365 installed on multiple devices without problems.'),
    review('Camille Laurent', 'France', 5, 'Microsoft Office 365 works fine. Setup was easy.'),
    review('Daan Smit', 'Netherlands', 4, 'Office 365 is good value compared to other options.'),
  ],
  microsoft_office: [
    review('Giulia Bianchi', 'Italy', 5, 'Office Pro Plus activated quickly and works well on my PC.'),
    review('Felix Wagner', 'Germany', 5, 'Microsoft Office setup was easy. The license worked first time.'),
    review('Marta Sánchez', 'Spain', 4, 'Not the cheapest Office option, but the activation was smooth.'),
  ],
  eset: [
    review('Felix Wagner', 'Germany', 5, 'ESET activated instantly and works as expected.'),
    review('Marta Sánchez', 'Spain', 5, 'ESET is simple and effective protection for my devices.'),
    review('Elise Dubois', 'Belgium', 4, 'Good ESET security solution. Activation was fast.'),
  ],
  linkedin: [
    review('Julien Moreau', 'France', 5, 'LinkedIn Premium helped me a lot with job searching.'),
    review('Laura Martínez', 'Spain', 5, 'LinkedIn Premium has useful insights and tools.'),
    review('Jonas Müller', 'Germany', 4, 'LinkedIn Premium is good but a bit expensive.'),
  ],
  zoom: [
    review('Daan Smit', 'Netherlands', 5, 'Zoom Pro works perfectly for meetings.'),
    review('Marco Rossi', 'Italy', 5, 'No issues with Zoom Pro, stable connection.'),
    review('Thomas Peeters', 'Belgium', 4, 'Good Zoom Pro experience overall.'),
  ],
};

const normalizeKey = (toolId?: string, productName = '') => {
  const value = `${toolId || ''} ${productName}`.toLowerCase();
  if (value.includes('chatgpt') && value.includes('business')) return 'chatgpt_business';
  return toolId || productName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
};

export const getProductReviews = (toolId?: string, productName = 'this product'): ProductReview[] => {
  const key = normalizeKey(toolId, productName);
  if (SPECIFIC_REVIEWS[key]) return SPECIFIC_REVIEWS[key];

  const seed = [...key].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const product = productName || toolId || 'this product';
  return [0, 1, 2, 3, 4].map((offset) => {
    const name = names[(seed + offset * 2) % names.length];
    const country = COUNTRY_POOL[(seed + offset) % COUNTRY_POOL.length];
    const rating: 4 | 5 = offset === 2 ? 4 : 5;
    const quotes = [
      `${product} was activated quickly and worked well on my devices. Paid in EUR without issues.`,
      `I use ${product} for work now. Not the cheapest, but reliable and easy to start.`,
      `${product} setup was smooth. A bit expensive, but the performance is worth it.`,
      `Good value for ${product}. Activation was fast and everything worked as expected.`,
      `${product} worked right after activation. Clear process and no device problems so far.`,
    ];
    return review(name, country, rating, quotes[offset]);
  });
};

export const getAverageRating = (toolId?: string, productName?: string) => {
  const reviews = getProductReviews(toolId, productName);
  return reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;
};

export const getBeforeAfterCopy = (review: ProductReview, productName: string) => {
  if (review.before && review.after) return { before: review.before, after: review.after };

  const quote = review.quote.toLowerCase();
  const product = productName || 'this product';
  const before = quote.includes('expensive') || quote.includes('cheapest')
    ? `I was unsure if ${product} was worth the EUR price.`
    : quote.includes('device') || quote.includes('laptop') || quote.includes('pc')
    ? `I was worried ${product} might not work smoothly on my devices.`
    : quote.includes('activation') || quote.includes('activated') || quote.includes('key')
    ? `I was not sure how fast ${product} activation would be.`
    : `I needed ${product}, but wanted a simple setup without surprises.`;

  return {
    before,
    after: review.quote,
  };
};