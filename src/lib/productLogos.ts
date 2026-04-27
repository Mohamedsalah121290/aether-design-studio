const localLogoModules = import.meta.glob('/src/assets/logos/*.{png,svg,webp,jpeg,jpg}', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>;

const logoExtensions = ['png', 'svg', 'webp', 'jpeg', 'jpg'];

const resolveLocalLogo = (logoKey: string) => {
  for (const extension of logoExtensions) {
    const logo = localLogoModules[`/src/assets/logos/${logoKey}.${extension}`];
    if (logo) return logo;
  }
  return null;
};

const manualLogoAliases: Record<string, string[]> = {
  chatgpt: ['chatgpt', 'chatgpt_uploaded'],
  microsoft_office: ['office', 'microsoft_office_uploaded', 'microsoft_office', 'microsoft365'],
  microsoft_365: ['copilot', 'microsoft_copilot_uploaded', 'microsoft365', 'microsoft_office'],
  copilot: ['copilot', 'microsoft_copilot_uploaded', 'microsoft365'],
  microsoft_copilot: ['copilot', 'microsoft_copilot_uploaded', 'microsoft365'],
  windows: ['windows', 'windows_uploaded'],
  windows_home: ['windows', 'windows_uploaded'],
  windows_server: ['windows', 'windows_uploaded'],
  windows_vps: ['windows', 'windows_uploaded'],
  canva: ['canva'],
  capcut: ['capcut'],
  coursera: ['coursera'],
  elevenlabs: ['elevenlabs'],
  eset: ['eset'],
  grok: ['grok'],
  linkedin: ['linkedin'],
  lovable: ['lovable'],
  perplexity: ['perplexity', 'chatgpt'],
  notion: ['notion', 'taskade'],
  zoom: ['zoom', 'microsoft365'],
  playground_ai: ['playground'],
};

const verifiedSvgLogos: Record<string, string> = {
  coursera: 'https://cdn.simpleicons.org/coursera/0056D2',
  grok: '/logos/grok.svg',
  zoom: 'https://cdn.simpleicons.org/zoom/0B5CFF',
  chatgpt: 'https://cdn.simpleicons.org/openai/74AA9C',
  perplexity: 'https://cdn.simpleicons.org/perplexity/1FB8CD',
  canva: 'https://cdn.simpleicons.org/canva/00C4CC',
  capcut: 'https://cdn.simpleicons.org/capcut/FFFFFF',
  elevenlabs: 'https://cdn.simpleicons.org/elevenlabs/FFFFFF',
  lovable: 'https://cdn.simpleicons.org/lovable/FF5A5F',
  linkedin: 'https://cdn.simpleicons.org/linkedin/0A66C2',
  eset: 'https://cdn.simpleicons.org/eset/00A88E',
  windows: 'https://cdn.simpleicons.org/windows/0078D4',
  windows_home: 'https://cdn.simpleicons.org/windows/0078D4',
  windows_server: 'https://cdn.simpleicons.org/windows/0078D4',
  autodesk: 'https://cdn.simpleicons.org/autodesk',
  avast: 'https://cdn.simpleicons.org/avast/FF7800',
  avira: 'https://cdn.simpleicons.org/avira/ED1C24',
  bitdefender: 'https://cdn.simpleicons.org/bitdefender/ED1C24',
  clickup: 'https://cdn.simpleicons.org/clickup/7B68EE',
  envato: 'https://cdn.simpleicons.org/envato/81B441',
  expressvpn: 'https://cdn.simpleicons.org/expressvpn/DA3940',
  freepik: 'https://cdn.simpleicons.org/freepik/1273EB',
  github_copilot: 'https://cdn.simpleicons.org/githubcopilot/FFFFFF',
  grammarly: 'https://cdn.simpleicons.org/grammarly/15C39A',
  huggingface: 'https://cdn.simpleicons.org/huggingface/FFD21E',
  langchain: 'https://cdn.simpleicons.org/langchain/FFFFFF',
  make: 'https://cdn.simpleicons.org/make/6D00CC',
  mikrotik: 'https://cdn.simpleicons.org/mikrotik/FFFFFF',
  notion: '/logos/notion.png',
  poe: 'https://cdn.simpleicons.org/poe/A78BFA',
  protonvpn: 'https://cdn.simpleicons.org/protonvpn/66DEB1',
  replit: 'https://cdn.simpleicons.org/replit/F26207',
  surfshark: 'https://cdn.simpleicons.org/surfshark/76D672',
  zapier: 'https://cdn.simpleicons.org/zapier/FF4F00',
};

export const getProductLogoUrl = (toolId?: string | null, fallbackUrl?: string | null) => {
  if (!toolId) return fallbackUrl || null;
  const logoKeys = manualLogoAliases[toolId] || [toolId];
  for (const logoKey of logoKeys) {
    const localLogo = resolveLocalLogo(logoKey);
    if (localLogo) return localLogo;
  }

  if (verifiedSvgLogos[toolId]) return verifiedSvgLogos[toolId];

  return fallbackUrl || null;
};