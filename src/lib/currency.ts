export type CurrencyCode =
  | 'EUR' | 'USD' | 'GBP' | 'SEK' | 'NOK' | 'DKK' | 'ISK' | 'PLN' | 'CZK' | 'HUF' | 'RON' | 'BGN' | 'RSD' | 'UAH' | 'TRY'
  | 'AED' | 'SAR' | 'QAR' | 'KWD' | 'BHD' | 'JOD' | 'EGP' | 'MAD' | 'DZD' | 'TND';

export interface CurrencyOption {
  code: CurrencyCode;
  name: string;
  rate: number;
}

export const CURRENCY_STORAGE_KEY = 'ai_deals_currency';

export const CURRENCIES: CurrencyOption[] = [
  { code: 'EUR', name: 'Euro', rate: 1 },
  { code: 'USD', name: 'US Dollar', rate: 1.08 },
  { code: 'GBP', name: 'British Pound', rate: 0.86 },
  { code: 'SEK', name: 'Swedish Krona', rate: 11.16 },
  { code: 'NOK', name: 'Norwegian Krone', rate: 11.75 },
  { code: 'DKK', name: 'Danish Krone', rate: 7.46 },
  { code: 'ISK', name: 'Icelandic Krona', rate: 151.5 },
  { code: 'PLN', name: 'Polish Zloty', rate: 4.32 },
  { code: 'CZK', name: 'Czech Koruna', rate: 25.25 },
  { code: 'HUF', name: 'Hungarian Forint', rate: 389.5 },
  { code: 'RON', name: 'Romanian Leu', rate: 4.98 },
  { code: 'BGN', name: 'Bulgarian Lev', rate: 1.96 },
  { code: 'RSD', name: 'Serbian Dinar', rate: 117.1 },
  { code: 'UAH', name: 'Ukrainian Hryvnia', rate: 45.1 },
  { code: 'TRY', name: 'Turkish Lira', rate: 37.2 },
  { code: 'AED', name: 'UAE Dirham', rate: 3.97 },
  { code: 'SAR', name: 'Saudi Riyal', rate: 4.05 },
  { code: 'QAR', name: 'Qatari Riyal', rate: 3.93 },
  { code: 'KWD', name: 'Kuwaiti Dinar', rate: 0.33 },
  { code: 'BHD', name: 'Bahraini Dinar', rate: 0.41 },
  { code: 'JOD', name: 'Jordanian Dinar', rate: 0.77 },
  { code: 'EGP', name: 'Egyptian Pound', rate: 52.4 },
  { code: 'MAD', name: 'Moroccan Dirham', rate: 10.75 },
  { code: 'DZD', name: 'Algerian Dinar', rate: 145.7 },
  { code: 'TND', name: 'Tunisian Dinar', rate: 3.38 },
];

const ZERO_DECIMAL = new Set<CurrencyCode>(['ISK', 'HUF', 'RSD']);

export const getCurrency = (code: string | null | undefined): CurrencyOption =>
  CURRENCIES.find(currency => currency.code === code) || CURRENCIES[0];

export const formatEuroPrice = (amount: number | null | undefined): string => {
  if (amount == null || !isFinite(amount)) return '€0';
  const rounded = Math.round(amount * 100) / 100;
  return Number.isInteger(rounded) ? `€${rounded}` : `€${rounded.toFixed(2)}`;
};

export const formatCurrencyPrice = (amount: number, code: CurrencyCode): string => {
  const digits = ZERO_DECIMAL.has(code) ? 0 : 2;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: code,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
};

export const formatApproxCurrency = (eurAmount: number | null | undefined, code: CurrencyCode): string | null => {
  if (eurAmount == null || eurAmount <= 0 || code === 'EUR') return null;
  const currency = getCurrency(code);
  return `≈ ${formatCurrencyPrice(eurAmount * currency.rate, currency.code)}`;
};

export const FINAL_PAYMENT_EUR_NOTE = 'Final payment is processed in EUR (€)';
