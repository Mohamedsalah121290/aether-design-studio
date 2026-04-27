const localLogoModules = import.meta.glob('/src/assets/logos/*.{png,svg,webp,jpeg,jpg}', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>;

const logoAliases: Record<string, string> = {
  adobe_cc: 'adobe_cc',
  microsoft_365: 'microsoft365',
  copilot: 'microsoft365',
  microsoft_copilot: 'microsoft365',
  microsoft_office: 'microsoft_office',
  playground_ai: 'playground',
  linkedin: 'linkedin',
  windows_home: 'windows',
  windows_server: 'windows',
  windows_vps: 'windows',
};

const uploadedLogoAliases: Record<string, string> = {
  chatgpt: 'chatgpt_uploaded',
  microsoft_365: 'microsoft_copilot_uploaded',
  copilot: 'microsoft_copilot_uploaded',
  microsoft_copilot: 'microsoft_copilot_uploaded',
  microsoft_office: 'microsoft_office_uploaded',
  windows: 'windows_uploaded',
  windows_home: 'windows_uploaded',
  windows_server: 'windows_uploaded',
  windows_vps: 'windows_uploaded',
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
  const uploadedLogoKey = uploadedLogoAliases[toolId];
  const uploadedLogo = uploadedLogoKey ? localLogoModules[`/src/assets/logos/${uploadedLogoKey}.jpeg`] : null;
  if (uploadedLogo) return uploadedLogo;

  const logoKey = logoAliases[toolId] || toolId;
  const localLogo = localLogoModules[`/src/assets/logos/${logoKey}.png`]
    || localLogoModules[`/src/assets/logos/${logoKey}.svg`]
    || localLogoModules[`/src/assets/logos/${logoKey}.webp`];

  if (localLogo) return localLogo;
  if (verifiedSvgLogos[toolId]) return verifiedSvgLogos[toolId];

  return fallbackUrl || null;
};