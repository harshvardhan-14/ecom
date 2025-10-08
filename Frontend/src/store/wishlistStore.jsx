import { create } from 'zustand';
import { wishlistAPI } from '../lib/api';
import toast from 'react-hot-toast';

/**
 * @typedef {Object} WishlistItem
 * @property {string} id - Unique identifier for the wishlist item
 * @property {string} productId - ID of the product in the wishlist
 * @property {Object} product - Product details
 * @property {string} addedAt - ISO timestamp when the item was added
 */

/**
 * Wishlist store for managing user's wishlist items
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<{
 *   items: WishlistItem[];
 *   isLoading: boolean;
 *   error: string | null;
 *   fetchWishlist: () => Promise<WishlistItem[]>;
 *   addToWishlist: (product: string | { id: string }) => Promise<{ success: boolean; isInWishlist: boolean }>;
 *   removeFromWishlist: (productId: string) => Promise<{ success: boolean }>;
 *   toggleWishlist: (product: string | { id: string }) => Promise<boolean>;
 *   isInWishlist: (productId: string) => boolean;
 *   getItemCount: () => number;
 *   clearWishlist: () => void;
 *   clearError: () => void;
 *   checkWishlistStatus: (productId: string) => Promise<{ inWishlist: boolean; addedAt: string | null }>;
 * }>>}
 */
const useWishlistStore = create((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  /**
   * Clear any error in the store
   */
  clearError: () => set({ error: null }),

  /**
   * Fetch the current user's wishlist from the server
   * @returns {Promise<WishlistItem[]>}
   */
  fetchWishlist: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await wishlistAPI.getWishlist();
      
      // Transform the data to match our frontend expectations
      const items = Array.isArray(data) 
        ? data.map(item => ({
            id: item.id,
            productId: item.productId || (item.product?.id ?? ''),
            product: item.product ? {
              ...item.product,
              // Convert stock number to inStock boolean
              inStock: item.product.stock > 0,
              // Get first image from images array
              image: Array.isArray(item.product.images) ? item.product.images[0] : item.product.images
            } : { id: item.productId },
            addedAt: item.addedAt || new Date().toISOString()
          })).filter(item => item.productId) // Filter out any invalid items
        : [];
      
      set({ items, isLoading: false });
      return items;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      
      let errorMessage = 'Failed to fetch wishlist';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      
      // Don't show toast for 404 (empty wishlist is normal)
      if (error.response?.status !== 404) {
        toast.error(errorMessage);
      }
      
      throw error;
    }
  },

  /**
   * Add a product to the wishlist
   * @param {string | { id: string }} product - Product ID or product object with ID
   * @returns {Promise<{ success: boolean; isInWishlist: boolean }>}
   */
  addToWishlist: async (product) => {
    try {
      set({ isLoading: true, error: null });
      
      const productId = product?.id || product;
      if (!productId) {
        throw new Error('No product ID provided');
      }

      // First check with the server to ensure the item isn't already in the wishlist
      try {
        const { data } = await wishlistAPI.checkWishlistStatus(productId);
        if (data.inWishlist) {
          // If already in wishlist, update local state and return
          set(state => {
            // If not in local state, add it
            const exists = state.items.some(item => 
              String(item.productId || item.product?.id || item.id) === String(productId)
            );
            
            if (!exists) {
              return {
                items: [
                  ...state.items,
                  {
                    id: `temp_${Date.now()}`,
                    productId: productId,
                    product: typeof product === 'object' ? product : { id: productId },
                    addedAt: data.addedAt || new Date().toISOString()
                  }
                ],
                isLoading: false
              };
            }
            return { isLoading: false };
          });
          
          toast.success('Product is already in your wishlist');
          return { success: true, isInWishlist: true };
        }
      } catch (error) {
        console.error('Error checking wishlist status:', error);
        // Continue with adding the item if there's an error checking status
      }
      
      // Add to wishlist on the server
      const { data } = await wishlistAPI.addToWishlist({ productId });
      
      // Update local state with the new item
      set(state => {
        const newItem = {
          id: data.id,
          productId: data.productId,
          product: data.product || { id: data.productId },
          addedAt: data.addedAt || new Date().toISOString()
        };
        
        return {
          items: [...state.items, newItem],
          isLoading: false
        };
      });

      toast.success('Added to wishlist!');
      return { success: true, isInWishlist: true };
      
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      
      let errorMessage = 'Failed to add to wishlist';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      
      // Don't show toast for 409 (already in wishlist)
      if (error.response?.status !== 409) {
        toast.error(errorMessage);
      }
      
      throw error;
    }
  },

  /**
   * Remove a product from the wishlist
   * @param {string} productId - ID of the product to remove
   * @returns {Promise<{ success: boolean }>}
   */
  removeFromWishlist: async (productId) => {
    try {
      if (!productId) {
        throw new Error('No product ID provided');
      }
      
      set({ isLoading: true, error: null });
      
      // Clean the product ID
      const cleanProductId = String(productId).trim();
      
      // Remove from server
      await wishlistAPI.removeFromWishlist(cleanProductId);
      
      // Update local state
      set(state => ({
        items: state.items.filter(item => {
          const itemProductId = item.product?.id || item.productId || item.id;
          return String(itemProductId) !== cleanProductId;
        }),
        isLoading: false
      }));
      
      toast.success('Removed from wishlist');
      return { success: true };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      
      let errorMessage = 'Failed to remove from wishlist';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      
      // Don't show toast for 404 (item not found in wishlist)
      if (error.response?.status !== 404) {
        toast.error(errorMessage);
      }
      
      throw error;
    }
  },

  /**
   * Toggle a product in the wishlist (add if not present, remove if present)
   * @param {string | { id: string }} product - Product ID or product object with ID
   * @returns {Promise<boolean>} - Returns true if added, false if removed
   */
  toggleWishlist: async (product) => {
    try {
      const productId = product?.id || product;
      if (!productId) {
        throw new Error('No product ID provided');
      }
      
      // First check with the server to get the actual status
      try {
        const { data } = await wishlistAPI.checkWishlistStatus(productId);
        if (data.inWishlist) {
          await get().removeFromWishlist(productId);
          return false;
        } else {
          await get().addToWishlist(product);
          return true;
        }
      } catch (error) {
        console.error('Error checking wishlist status:', error);
        // Fallback to local state if server check fails
        const isInWishlist = get().isInWishlist(productId);
        if (isInWishlist) {
          await get().removeFromWishlist(productId);
          return false;
        } else {
          await get().addToWishlist(product);
          return true;
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      throw error;
    }
  },

  /**
   * Check if a product is in the wishlist (local state only)
   * @param {string} productId - ID of the product to check
   * @returns {boolean}
   */
  isInWishlist: (productId) => {
    if (!productId) return false;
    
    const cleanProductId = String(productId).trim();
    return get().items.some(item => {
      const itemProductId = item.product?.id || item.productId || item.id;
      return itemProductId && String(itemProductId) === cleanProductId;
    });
  },
  
  /**
   * Check if a product is in the wishlist (with server verification)
   * @param {string} productId - ID of the product to check
   * @returns {Promise<{inWishlist: boolean, addedAt: string|null}>}
   */
  verifyInWishlist: async (productId) => {
    if (!productId) return { inWishlist: false, addedAt: null };
    
    try {
      const { data } = await wishlistAPI.checkWishlistStatus(productId);
      return data;
    } catch (error) {
      console.error('Error verifying wishlist status:', error);
      // Fallback to local state
      return {
        inWishlist: get().isInWishlist(productId),
        addedAt: null
      };
    }
  },

  /**
   * Check wishlist status for a product (useful for initial load)
   * @param {string} productId - ID of the product to check
   * @returns {Promise<{ inWishlist: boolean; addedAt: string | null }>}
   */
  checkWishlistStatus: async (productId) => {
    try {
      if (!productId) {
        return { inWishlist: false, addedAt: null };
      }
      
      // First check local state
      const localStatus = get().isInWishlist(productId);
      if (localStatus) {
        const item = get().items.find(item => {
          const itemProductId = item.product?.id || item.productId || item.id;
          return String(itemProductId) === String(productId);
        });
        return { 
          inWishlist: true, 
          addedAt: item?.addedAt || new Date().toISOString() 
        };
      }
      
      // If not found locally, check with the server
      try {
        const { data } = await wishlistAPI.checkWishlistStatus(productId);
        return data;
      } catch (error) {
        // If 404, the item is not in the wishlist
        if (error.response?.status === 404) {
          return { inWishlist: false, addedAt: null };
        }
        throw error;
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      // On error, default to not in wishlist
      return { inWishlist: false, addedAt: null };
    }
  },

  /**
   * Get the total number of items in the wishlist
   * @returns {number}
   */
  getItemCount: () => {
    return get().items.length;
  },

  /**
   * Clear the wishlist state
   */
  clearWishlist: () => {
    set({ items: [], error: null, isLoading: false });
  }
}));

export default useWishlistStore;
