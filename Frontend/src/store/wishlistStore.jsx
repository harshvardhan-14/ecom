import { create } from 'zustand';
import { wishlistAPI } from '../lib/api';
import toast from 'react-hot-toast';

const useWishlistStore = create((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  // Fetch wishlist from the server
  fetchWishlist: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await wishlistAPI.getWishlist();
      
      // Transform the data to match our frontend expectations
      const items = Array.isArray(data) 
        ? data.map(item => ({
            id: item.id,
            productId: item.product?.id || item.productId,
            product: item.product || { id: item.productId },
            addedAt: item.addedAt || new Date().toISOString()
          }))
        : [];
      
      set({ items, isLoading: false });
      return items;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      // If it's a 404, the wishlist might not exist yet, return empty array
      if (error.response?.status === 404) {
        set({ items: [], isLoading: false });
        return [];
      }
      
      const errorMsg = error.response?.data?.error || 'Failed to fetch wishlist';
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  // Add item to wishlist - accepts either product object or ID
  addToWishlist: async (product) => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if the product is already in the wishlist
      const productId = product?.id || product;
      const isInWishlist = get().items.some(item => 
        item.productId === productId || 
        (item.product && item.product.id === productId)
      );
      
      if (isInWishlist) {
        set({ isLoading: false });
        return { success: true };
      }
      
      const { data } = await wishlistAPI.addToWishlist(product);
      
      // Update local state
      set(state => {
        const newItem = {
          id: data.id || `wish_${Date.now()}`,
          productId: data.productId || data.product?.id,
          product: data.product || { id: data.productId },
          addedAt: data.addedAt || new Date().toISOString()
        };
        
        return {
          items: [...state.items, newItem],
          isLoading: false
        };
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      const errorMsg = error.response?.data?.error || 'Failed to add to wishlist';
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  // Remove item from wishlist by product ID
  removeFromWishlist: async (productId) => {
    try {
      set({ isLoading: true, error: null });
      const idToRemove = String(productId).replace('prod_', '');
      
      // Remove from server
      await wishlistAPI.removeFromWishlist(idToRemove);
      
      // Update local state
      set(state => ({
        items: state.items.filter(item => {
          const itemProductId = item.product?.id || item.productId || item.id;
          return String(itemProductId).replace('prod_', '') !== idToRemove;
        }),
        isLoading: false
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      
      // If it's a 404, the item might have already been removed
      if (error.response?.status === 404) {
        set(state => ({
          items: state.items.filter(item => {
            const itemProductId = item.product?.id || item.productId || item.id;
            return String(itemProductId).replace('prod_', '') !== String(productId).replace('prod_', '');
          }),
          isLoading: false
        }));
        return { success: true };
      }
      
      const errorMsg = error.response?.data?.error || 'Failed to remove from wishlist';
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  // Toggle item in wishlist
  toggleWishlist: async (product) => {
    const { isInWishlist, addToWishlist, removeFromWishlist } = get();
    const productId = product?.id || product;
    
    if (!productId) {
      console.error('No product ID provided for wishlist toggle');
      return false;
    }
    
    try {
      // Check if the product is in the wishlist
      const inWishlist = isInWishlist(productId);
      
      if (inWishlist) {
        // Remove from wishlist
        await removeFromWishlist(productId);
      } else {
        // Add to wishlist
        await addToWishlist(product);
      }
      
      // Return the new wishlist status (true if added, false if removed)
      return !inWishlist;
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      throw error; // Re-throw the error to be handled by the component
    }
  },

  // Check if a product is in the wishlist
  isInWishlist: (productId) => {
    if (!productId) return false;
    const idToCheck = String(productId).replace('prod_', '');
    
    return get().items.some(item => {
      const itemProductId = item.product?.id || item.productId || item.id;
      return itemProductId && String(itemProductId).replace('prod_', '') === idToCheck;
    });
  },

  // Get total number of items in wishlist
  getItemCount: () => {
    return get().items.length;
  },

  // Clear wishlist state
  clearWishlist: () => {
    set({ items: [], error: null });
  }
}));

export default useWishlistStore;
