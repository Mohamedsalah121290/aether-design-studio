import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CURRENCIES, CURRENCY_STORAGE_KEY, getCurrency, type CurrencyCode, type CurrencyOption } from '@/lib/currency';

interface CurrencyContextValue {
  currency: CurrencyOption;
  setCurrencyCode: (code: CurrencyCode) => void;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currencyCode, setCurrencyCodeState] = useState<CurrencyCode>(() => {
    if (typeof window === 'undefined') return 'EUR';
    return getCurrency(window.localStorage.getItem(CURRENCY_STORAGE_KEY)).code;
  });

  useEffect(() => {
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, currencyCode);
  }, [currencyCode]);

  const setCurrencyCode = (code: CurrencyCode) => {
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
