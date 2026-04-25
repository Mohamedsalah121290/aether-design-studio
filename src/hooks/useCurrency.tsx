import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CURRENCIES, CURRENCY_MANUAL_KEY, CURRENCY_STORAGE_KEY, getCurrency, type CurrencyCode, type CurrencyOption } from '@/lib/currency';
import { currencyForRegion, detectAndStoreRegion } from '@/lib/geo';

interface CurrencyContextValue {
  currency: CurrencyOption;
  setCurrencyCode: (code: CurrencyCode) => void;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currencyCode, setCurrencyCodeState] = useState<CurrencyCode>(() => {
    if (typeof window === 'undefined') return 'EUR';
    const stored = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (stored) return getCurrency(stored).code;
    const region = detectAndStoreRegion();
    return getCurrency(currencyForRegion(region)).code;
  });

  useEffect(() => {
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, currencyCode);
  }, [currencyCode]);

  const setCurrencyCode = (code: CurrencyCode) => {
    window.localStorage.setItem(CURRENCY_MANUAL_KEY, 'true');
    setCurrencyCodeState(getCurrency(code).code);
  };

  const value = useMemo(() => ({ currency: getCurrency(currencyCode), setCurrencyCode }), [currencyCode]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    return { currency: CURRENCIES[0], setCurrencyCode: () => undefined } as CurrencyContextValue;
  }
  return context;
};
