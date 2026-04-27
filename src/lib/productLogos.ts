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

const manualProductLogos: Record<string, string> = {
  windows: windowsLogo,
  windows_home: windowsLogo,
  windows_server: windowsLogo,
  windows_vps: windowsLogo,
  chatgpt: chatgptLogo,
  canva: canvaLogo,
  capcut: capcutLogo,
  lovable: lovableLogo,
  linkedin: linkedinLogo,
  microsoft_office: officeProPlusLogo,
  microsoft_365: microsoftOffice365Logo,
  coursera: linkedinLogo,
  elevenlabs: elevenlabsLogo,
  eset: esetLogo,
  grok: chatgptLogo,
  notion: notionLogo,
  perplexity: perplexityLogo,
  zoom: zoomLogo,
};

export const getProductLogoUrl = (toolId?: string | null, _fallbackUrl?: string | null) => {
  if (!toolId) return null;
  return manualProductLogos[toolId] || null;
};