export type SocialProofReview = {
  name: string;
  country: 'Belgium' | 'Germany' | 'France' | 'Netherlands' | 'Italy' | 'Spain';
  flag: string;
  product: string;
  rating: 4 | 5;
  quote: string;
};

export const socialProofReviews: SocialProofReview[] = [
  { name: 'Thomas Peeters', country: 'Belgium', flag: '🇧🇪', product: 'ChatGPT Plus', rating: 5, quote: 'Activation was fast and checkout in EUR was clear. ChatGPT worked on my laptop and phone within minutes.' },
  { name: 'Jonas Müller', country: 'Germany', flag: '🇩🇪', product: 'Canva Pro', rating: 5, quote: 'I hesitated because of the price, but Canva Pro was worth it for the service and quick setup.' },
  { name: 'Julien Moreau', country: 'France', flag: '🇫🇷', product: 'Perplexity Pro', rating: 5, quote: 'Très simple à activer. Perplexity is now my daily research tool and the EUR payment was straightforward.' },
  { name: 'Sophie Jansen', country: 'Netherlands', flag: '🇳🇱', product: 'Windows 10 / 11 Pro', rating: 4, quote: 'I was unsure about activation, but the key worked the first time. Not the cheapest, but reliable.' },
  { name: 'Marco Rossi', country: 'Italy', flag: '🇮🇹', product: 'Office 365', rating: 5, quote: 'Office activated smoothly on multiple devices. Good value for what you get and support replied quickly.' },
  { name: 'Laura Martínez', country: 'Spain', flag: '🇪🇸', product: 'ElevenLabs', rating: 4, quote: 'Un poco caro, but the voice quality is strong and activation was simple.' },
  { name: 'Elise Dubois', country: 'Belgium', flag: '🇧🇪', product: 'Canva Pro', rating: 5, quote: 'Everything unlocked the same day. Easy checkout, EUR payment, and no device issues.' },
  { name: 'Felix Wagner', country: 'Germany', flag: '🇩🇪', product: 'ESET Internet Security', rating: 5, quote: 'ESET activated instantly and support confirmed the steps clearly. Good experience overall.' },
  { name: 'Camille Laurent', country: 'France', flag: '🇫🇷', product: 'Office Pro Plus', rating: 4, quote: 'Pas le moins cher, but Office worked correctly after activation and the instructions were easy.' },
  { name: 'Daan Smit', country: 'Netherlands', flag: '🇳🇱', product: 'Zoom Pro', rating: 5, quote: 'Zoom Pro was ready quickly and meetings are stable. Better value than other options I checked.' },
  { name: 'Giulia Bianchi', country: 'Italy', flag: '🇮🇹', product: 'CapCut Pro', rating: 5, quote: 'CapCut Pro worked on mobile and desktop. Fast activation and the checkout felt simple.' },
  { name: 'Marta Sánchez', country: 'Spain', flag: '🇪🇸', product: 'LinkedIn Premium', rating: 4, quote: 'I hesitated because of the price, but LinkedIn Premium helped with job search features.' },
  { name: 'Noor Visser', country: 'Netherlands', flag: '🇳🇱', product: 'ChatGPT Plus', rating: 5, quote: 'Works across devices and activation was quick. Worth it for the service.' },
  { name: 'Luca Romano', country: 'Italy', flag: '🇮🇹', product: 'Perplexity Pro', rating: 5, quote: 'Perplexity improved my daily research workflow. EUR payment was clear and setup was fast.' },
  { name: 'Antoine Girard', country: 'France', flag: '🇫🇷', product: 'Windows 10/11 Home', rating: 4, quote: 'I was not sure if the key would activate correctly. It worked in minutes and runs fine.' },
  { name: 'Leon Fischer', country: 'Germany', flag: '🇩🇪', product: 'ElevenLabs', rating: 5, quote: 'Voice generation quality is very good. A bit expensive, but the performance is worth it.' },
  { name: 'Sara Verbruggen', country: 'Belgium', flag: '🇧🇪', product: 'Office 365', rating: 5, quote: 'Installed on my main laptop and tablet without problems. Good value for what you get.' },
  { name: 'Clara Hoffmann', country: 'Germany', flag: '🇩🇪', product: 'Canva Pro', rating: 4, quote: 'Not the cheapest, but activation was quick and Canva is useful for daily social content.' },
  { name: 'Nadia Lefèvre', country: 'France', flag: '🇫🇷', product: 'ChatGPT Plus', rating: 5, quote: 'ChatGPT Plus was active quickly. I use it daily now for planning and writing.' },
  { name: 'Milan de Vries', country: 'Netherlands', flag: '🇳🇱', product: 'Windows 11 Pro', rating: 5, quote: 'Activation key worked on first try. Clear EUR checkout and no extra steps.' },
  { name: 'Alessia Conti', country: 'Italy', flag: '🇮🇹', product: 'Lovable AI Pro', rating: 4, quote: 'I expected setup to be complicated, but access was explained clearly. Price is higher, service is solid.' },
  { name: 'Pablo García', country: 'Spain', flag: '🇪🇸', product: 'CapCut Pro', rating: 5, quote: 'Fast activation and editing features worked immediately. Good value for content work.' },
  { name: 'Marie Janssens', country: 'Belgium', flag: '🇧🇪', product: 'Perplexity Pro', rating: 4, quote: 'I was unsure at first, but research is faster now. Not the cheapest, still useful.' },
  { name: 'Klara Becker', country: 'Germany', flag: '🇩🇪', product: 'Zoom Pro', rating: 5, quote: 'Easy checkout and stable meetings. Support was available when I had a setup question.' },
  { name: 'Émile Bernard', country: 'France', flag: '🇫🇷', product: 'ESET Internet Security', rating: 5, quote: 'Activation rapide. ESET works as expected and the instructions were easy to follow.' },
  { name: 'Eva Romano', country: 'Italy', flag: '🇮🇹', product: 'LinkedIn Premium', rating: 4, quote: 'A bit expensive, but the insights and search tools are useful for work.' },
];

export const recentActivities = [
  { name: 'Thomas', country: 'Belgium', flag: '🇧🇪', product: 'ChatGPT Plus' },
  { name: 'Laura', country: 'Spain', flag: '🇪🇸', product: 'Canva Pro' },
  { name: 'Julien', country: 'France', flag: '🇫🇷', product: 'Perplexity Pro' },
  { name: 'Marco', country: 'Italy', flag: '🇮🇹', product: 'Office 365' },
  { name: 'Sophie', country: 'Netherlands', flag: '🇳🇱', product: 'Windows 11 Pro' },
];