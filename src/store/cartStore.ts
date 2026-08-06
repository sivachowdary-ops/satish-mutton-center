'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, ProductVariant } from '@/lib/mockData';

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  hasHydrated: boolean;
  addItem: (product: Product, variant: ProductVariant, qty?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, qty: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  setHasHydrated: (state: boolean) => void;
}

const CART_VERSION = 2;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),

      addItem: (product, variant, qty = 1) => {
        const { items } = get();
        const existing = items.find(item => item.variant.id === variant.id);
        if (existing) {
          set({
            items: items.map(item =>
              item.variant.id === variant.id
                ? { ...item, quantity: Math.min(item.quantity + qty, 10) }
                : item
            ),
          });
        } else {
          set({ items: [...items, { product, variant, quantity: qty }] });
        }
        set({ isCartOpen: true });
      },

      removeItem: (variantId) => {
        set({ items: get().items.filter(item => item.variant.id !== variantId) });
      },

      updateQuantity: (variantId, qty) => {
        if (qty <= 0) {
          get().removeItem(variantId);
          return;
        }
        set({
          items: get().items.map(item =>
            item.variant.id === variantId
              ? { ...item, quantity: Math.min(qty, 10) }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isCartOpen: !get().isCartOpen }),
      setCartOpen: (open) => set({ isCartOpen: open }),
    }),
    {
      name: 'satish-mutton-cart',
      version: CART_VERSION,
      migrate: () => {
        // Reset cart on version mismatch
        return { items: [], isCartOpen: false };
      },
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.warn('Cart hydration failed, resetting cart');
          }
          // Mark as hydrated so UI components can skip SSR mismatch
          state?.setHasHydrated(true);
        };
      },
    }
  )
);

// Computed helpers
export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
}

export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
