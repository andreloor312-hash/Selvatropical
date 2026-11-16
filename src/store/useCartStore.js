import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cart: [],

  addToCart: (product, quantity = 1) => {
    const { cart } = get();
    const existing = cart.find((item) => item.id === product.id);
    const maxStock = Number(product.stock || 0);

    if (maxStock <= 0) return;

    if (existing) {
      const nextQty = Math.min(existing.qty + quantity, maxStock);
      set({
        cart: cart.map((item) =>
          item.id === product.id ? { ...item, qty: nextQty, stock: maxStock } : item
        ),
      });
    } else {
      set({
        cart: [...cart, { ...product, qty: Math.min(quantity, maxStock) }],
      });
    }
  },

  removeFromCart: (id) =>
    set({ cart: get().cart.filter((item) => item.id !== id) }),

  clearCart: () => set({ cart: [] }),
}));