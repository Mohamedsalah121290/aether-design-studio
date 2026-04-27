import { toast } from 'sonner';

export type CartItem = {
  id: string;
  toolDbId: string;
  toolId: string;
  name: string;
  price: number;
  planId?: string | null;
  planName?: string | null;
  period?: string | null;
  logoUrl?: string | null;
};

const CART_KEY = 'aiDealsCart';

export const getCartItems = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCartItems = (items: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('aiDealsCartUpdated'));
};

export const addCartItem = (item: Omit<CartItem, 'id'>) => {
  const items = getCartItems();
  const id = `${item.toolDbId}:${item.planId || 'default'}`;
  const next = items.some(existing => existing.id === id)
    ? items
    : [...items, { ...item, id }];
  saveCartItems(next);
  toast.success('Added to cart');
};

export const removeCartItem = (id: string) => saveCartItems(getCartItems().filter(item => item.id !== id));

export const clearCartItems = () => saveCartItems([]);

export const getCartTotal = (items: CartItem[]) => items.reduce((sum, item) => sum + item.price, 0);