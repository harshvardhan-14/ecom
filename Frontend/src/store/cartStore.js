import { create } from 'zustand';
import { cartAPI } from '../lib/api';

const useCartStore = create((set, get) => ({
  items: [],
  total: 0,
  isLoading: false,

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const { data } = await cartAPI.getCart();
      set({ items: data.items, total: data.total, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

addToCart: async (product, quantity = 1) => {
    try {
      // Handle both product object and product ID
      const productId = typeof product === 'object' ? product.id : product;
      const qty = typeof product === 'object' && product.quantity ? product.quantity : quantity;
      
      await cartAPI.addToCart(productId, qty);
      await get().fetchCart();
    } catch (error) {
      throw error;
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      await cartAPI.updateCartItem(itemId, quantity);
      await get().fetchCart();
    } catch (error) {
      throw error;
    }
  },

  removeItem: async (itemId) => {
    try {
      await cartAPI.removeFromCart(itemId);
      await get().fetchCart();
    } catch (error) {
      throw error;
    }
  },

  clearCart: async () => {
    try {
      await cartAPI.clearCart();
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
