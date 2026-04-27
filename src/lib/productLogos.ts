import windowsLogo from '@/assets/logos/windows.png';
import chatgptLogo from '@/assets/logos/chatgpt.png';
import canvaLogo from '@/assets/logos/canva.png';
import capcutLogo from '@/assets/logos/capcut.png';
import lovableLogo from '@/assets/logos/lovable.png';
import linkedinLogo from '@/assets/logos/linkedin.png';

const manualProductLogos: Record<string, string> = {
  windows: windowsLogo,
  windows_home: windowsLogo,
  windows_server: windowsLogo,
  chatgpt: chatgptLogo,
  canva: canvaLogo,
  capcut: capcutLogo,
  lovable: lovableLogo,
  linkedin: linkedinLogo,
};

export const getProductLogoUrl = (toolId?: string | null, _fallbackUrl?: string | null) => {
  if (!toolId) return null;
  return manualProductLogos[toolId] || null;
};