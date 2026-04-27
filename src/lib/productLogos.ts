import windowsLogo from '@/assets/logos/windows.png';
import chatgptLogo from '@/assets/logos/chatgpt.png';
import canvaLogo from '@/assets/logos/canva.png';
import capcutLogo from '@/assets/logos/capcut.png';
import lovableLogo from '@/assets/logos/lovable.png';
import linkedinLogo from '@/assets/logos/linkedin.png';
import officeProPlusLogo from '@/assets/logos/office_pro_plus.png';
import microsoftOffice365Logo from '@/assets/logos/microsoft_office_365.png';
import elevenlabsLogo from '@/assets/logos/elevenlabs.png';
import esetLogo from '@/assets/logos/eset.png';
import notionLogo from '@/assets/logos/notion_uploaded.jpeg';
import perplexityLogo from '@/assets/logos/perplexity_uploaded.jpeg';
import zoomLogo from '@/assets/logos/zoom_uploaded.jpeg';
import grokLogo from '@/assets/logos/grok.png';
import windowsServerStandardLogo from '@/assets/logos/windows_server_standard.jpeg';
import courseraLogo from '@/assets/logos/coursera.jpeg';

const normalizeProductLogoKey = (value?: string | null) =>
  (value || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

const manualProductLogos: Record<string, string> = {
  windows: windowsLogo,
  windows_home: windowsLogo,
  windows_server: windowsServerStandardLogo,
  windows_vps: windowsLogo,
  chatgpt: chatgptLogo,
  canva: canvaLogo,
  capcut: capcutLogo,
  lovable: lovableLogo,
  linkedin: linkedinLogo,
  microsoft_office: officeProPlusLogo,
  microsoft_365: microsoftOffice365Logo,
  coursera: courseraLogo,
  elevenlabs: elevenlabsLogo,
  eset: esetLogo,
  grok: grokLogo,
  notion: notionLogo,
  perplexity: perplexityLogo,
  zoom: zoomLogo,
};

const productNameLogoIds: Record<string, string> = {
  chatgpt: 'chatgpt',
  chatgpt_plus: 'chatgpt',
  canva: 'canva',
  canva_pro: 'canva',
  capcut: 'capcut',
  capcut_pro: 'capcut',
  perplexity: 'perplexity',
  perplexity_pro: 'perplexity',
  elevenlabs: 'elevenlabs',
  lovable: 'lovable',
  lovable_ai_pro: 'lovable',
  grok: 'grok',
  windows: 'windows',
  windows_10_11_pro: 'windows',
  windows_10_11_home: 'windows_home',
  windows_11_pro: 'windows',
  microsoft_office: 'microsoft_365',
  microsoft_office_365: 'microsoft_365',
  office_365: 'microsoft_365',
  office_pro_plus: 'microsoft_office',
  linkedin_premium: 'linkedin',
  notion_education_plus: 'notion',
  zoom_pro: 'zoom',
  eset_internet_security: 'eset',
  coursera: 'coursera',
};

const textProductMatchers: Array<{ id: string; label: string; patterns: RegExp[] }> = [
  { id: 'chatgpt', label: 'ChatGPT', patterns: [/\bchatgpt\b/i] },
  { id: 'canva', label: 'Canva', patterns: [/\bcanva\b/i] },
  { id: 'capcut', label: 'CapCut', patterns: [/\bcapcut\b/i] },
  { id: 'perplexity', label: 'Perplexity', patterns: [/\bperplexity\b/i] },
  { id: 'elevenlabs', label: 'ElevenLabs', patterns: [/\belevenlabs\b/i] },
  { id: 'lovable', label: 'Lovable', patterns: [/\blovable\b/i] },
  { id: 'notion', label: 'Notion', patterns: [/\bnotion\b/i] },
  { id: 'grok', label: 'Grok', patterns: [/\bgrok\b/i] },
  { id: 'microsoft_365', label: 'Microsoft Office 365', patterns: [/\boffice\s*365\b/i, /\bmicrosoft\s*365\b/i] },
  { id: 'microsoft_office', label: 'Office Pro Plus', patterns: [/\boffice\s*pro\s*plus\b/i] },
  { id: 'windows', label: 'Windows', patterns: [/\bwindows\b/i] },
  { id: 'linkedin', label: 'LinkedIn Premium', patterns: [/\blinkedin\b/i] },
  { id: 'zoom', label: 'Zoom', patterns: [/\bzoom\b/i] },
  { id: 'eset', label: 'ESET', patterns: [/\beset\b/i] },
  { id: 'coursera', label: 'Coursera', patterns: [/\bcoursera\b/i] },
];

export const getProductLogoUrl = (toolId?: string | null, _fallbackUrl?: string | null) => {
  if (!toolId) return null;
  return manualProductLogos[toolId] || null;
};

export const getProductLogoByName = (productName?: string | null) => {
  const logoId = productNameLogoIds[normalizeProductLogoKey(productName)];
  return logoId ? getProductLogoUrl(logoId) : null;
};

export const getMentionedProductLogos = (text?: string | null) =>
  textProductMatchers
    .filter(({ patterns }) => patterns.some(pattern => pattern.test(text || '')))
    .map(({ id, label }) => ({ id, label, logoUrl: getProductLogoUrl(id)! }))
    .filter(item => Boolean(item.logoUrl));