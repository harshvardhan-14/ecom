import { create } from 'zustand';
import { cartAPI } from '../lib/api';

const useCartStore = create((set, get) => ({
  items: [],
  total: 0,
  isLoading: false,

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const { data } = await cartAPI.get();
      set({ items: data.items, total: data.total, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      await cartAPI.add({ productId, quantity });
      await get().fetchCart();
    } catch (error) {
      throw error;
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      await cartAPI.update(itemId, { quantity });
      await get().fetchCart();
    } catch (error) {
      throw error;
    }
  },

  removeItem: async (itemId) => {
    try {
      await cartAPI.remove(itemId);
      await get().fetchCart();
    } catch (error) {
      throw error;
    }
  },

  clearCart: async () => {
    try {
      await cartAPI.clear();
      set({ items: [], total: 0 });
    } catch (error) {
      throw error;
    }
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));

export default useCartStore;
