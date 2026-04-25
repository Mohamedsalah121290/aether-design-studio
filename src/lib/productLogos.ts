const localLogoModules = import.meta.glob('/src/assets/logos/*.{png,svg,webp}', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>;

const logoAliases: Record<string, string> = {
  adobe_cc: 'adobe_cc',
  microsoft_365: 'microsoft365',
  playground_ai: 'playground',
  windows_home: 'windows',
  windows_server: 'windows',
  windows_vps: 'windows',
};

const verifiedSvgLogos: Record<string, string> = {
  coursera: '/logos/coursera.svg',
  grok: '/logos/grok.svg',
  zoom: '/logos/zoom.svg',
  autodesk: 'https://cdn.simpleicons.org/autodesk',
  avast: 'https://cdn.simpleicons.org/avast/FF7800',
  avira: 'https://cdn.simpleicons.org/avira/ED1C24',
  bitdefender: 'https://cdn.simpleicons.org/bitdefender/ED1C24',
  clickup: 'https://cdn.simpleicons.org/clickup/7B68EE',
  envato: 'https://cdn.simpleicons.org/envato/81B441',
  expressvpn: 'https://cdn.simpleicons.org/expressvpn/DA3940',
  freepik: 'https://cdn.simpleicons.org/freepik/1273EB',
  gemini_veo: 'https://cdn.simpleicons.org/googlegemini/8E75B2',
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
  if (verifiedSvgLogos[toolId]) return verifiedSvgLogos[toolId];

  const logoKey = logoAliases[toolId] || toolId;
  const localLogo = localLogoModules[`/src/assets/logos/${logoKey}.png`]
    || localLogoModules[`/src/assets/logos/${logoKey}.svg`]
    || localLogoModules[`/src/assets/logos/${logoKey}.webp`];

  return localLogo || fallbackUrl || null;
};