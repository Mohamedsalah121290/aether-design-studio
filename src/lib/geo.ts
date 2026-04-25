import type { CurrencyCode } from '@/lib/currency';

export type SupportedAppLanguage = 'en' | 'fr' | 'nl' | 'de' | 'es' | 'it' | 'ar';
export type RegionCategory = 'belgium' | 'netherlands' | 'france' | 'germany' | 'spain' | 'italy' | 'arabic' | 'uk' | 'usa' | 'eu' | 'other';

export const LANGUAGE_STORAGE_KEY = 'ai-deals-language';
export const LANGUAGE_MANUAL_KEY = 'ai-deals-language-manual';
export const REGION_STORAGE_KEY = 'ai-deals-region-category';

const ARABIC_REGIONS = new Set(['AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'JO', 'EG', 'MA', 'DZ', 'TN', 'LB', 'IQ']);
const EU_REGIONS = new Set(['BE', 'NL', 'FR', 'DE', 'ES', 'IT', 'PT', 'IE', 'AT', 'FI', 'GR', 'LU', 'SK', 'SI', 'EE', 'LV', 'LT', 'CY', 'MT', 'HR']);

export const getBrowserCountry = (): string | null => {
  if (typeof navigator === 'undefined') return null;
  const locale = navigator.languages?.[0] || navigator.language || '';
  const parts = locale.split('-');
  return parts[1]?.toUpperCase() || null;
};

export const getRegionCategory = (country = getBrowserCountry(), timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone): RegionCategory => {
  if (country === 'BE') return 'belgium';
  if (country === 'NL') return 'netherlands';
  if (country === 'FR') return 'france';
  if (country === 'DE') return 'germany';
  if (country === 'ES') return 'spain';
  if (country === 'IT') return 'italy';
  if (country === 'GB') return 'uk';
  if (country === 'US') return 'usa';
  if (country && ARABIC_REGIONS.has(country)) return 'arabic';
  if (country && EU_REGIONS.has(country)) return 'eu';
  if (/Dubai|Riyadh|Qatar|Kuwait|Bahrain|Cairo|Casablanca|Algiers|Tunis/i.test(timeZone)) return 'arabic';
  return 'other';
};

export const languageForRegion = (region: RegionCategory): SupportedAppLanguage => {
  if (region === 'belgium') return 'nl';
  if (region === 'netherlands') return 'nl';
  if (region === 'france') return 'fr';
  if (region === 'germany') return 'de';
  if (region === 'spain') return 'es';
  if (region === 'italy') return 'it';
  if (region === 'arabic') return 'ar';
  return 'en';
};

export const currencyForRegion = (region: RegionCategory, country = getBrowserCountry()): CurrencyCode => {
  if (region === 'uk') return 'GBP';
  if (region === 'usa') return 'USD';
  if (region === 'arabic') {
    if (country === 'SA') return 'SAR';
    if (country === 'QA') return 'QAR';
    if (country === 'KW') return 'KWD';
    if (country === 'BH') return 'BHD';
    if (country === 'EG') return 'EGP';
    if (country === 'MA') return 'MAD';
    if (country === 'DZ') return 'DZD';
    if (country === 'TN') return 'TND';
    return 'AED';
  }
  if (country === 'TR') return 'TRY';
  if (country === 'SE') return 'SEK';
  if (country === 'NO') return 'NOK';
  if (country === 'DK') return 'DKK';
  if (country === 'IS') return 'ISK';
  if (country === 'PL') return 'PLN';
  if (country === 'CZ') return 'CZK';
  if (country === 'HU') return 'HUF';
  if (country === 'RO') return 'RON';
  if (country === 'BG') return 'BGN';
  if (country === 'RS') return 'RSD';
  if (country === 'UA') return 'UAH';
  return 'EUR';
};

export const detectAndStoreRegion = () => {
  const region = getRegionCategory();
  localStorage.setItem(REGION_STORAGE_KEY, region);
  return region;
};

export const getStoredRegion = (): RegionCategory => (localStorage.getItem(REGION_STORAGE_KEY) as RegionCategory) || detectAndStoreRegion();