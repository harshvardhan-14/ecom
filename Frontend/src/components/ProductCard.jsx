
import '../styles/components/ProductCard.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Eye, Loader2 } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import toast from 'react-hot-toast';
import QuickView from './QuickView';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import useWishlistStore from '../store/wishlistStore';


// Helper function to get default image if none provided
const getDefaultImage = (category) => {
  // You can add more specific default images based on category if needed
  return 'https://via.placeholder.com/300x300?text=No+Image';
};

const ProductCard = ({ product = {}, isAuthenticated = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const { addToCart } = useCartStore();
  const { isAuthenticated: authStatus } = useAuthStore();
  const { addToWishlist } = useWishlistStore();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!authStatus) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      setIsLoading(true);
      await addToCart(productData.id, 1);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error(error.response?.data?.error || 'Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const handleCloseQuickView = () => {
    setShowQuickView(false);
    document.body.style.overflow = 'unset'; // Re-enable scrolling
  };

  // Helper function to safely extract a value from an object or return a default
  const safeGet = (obj, prop, defaultValue = '') => {
    if (!obj) return defaultValue;
    const value = obj[prop];
    return value !== undefined && value !== null ? value : defaultValue;
  };

  const productData = {
    // Basic info with fallbacks
    id: (() => {
      const id = safeGet(product, 'id') || safeGet(product, '_id');
      if (!id) return `prod_${Math.random().toString(36).substr(2, 9)}`;
      // Use the ID as is - the backend should handle the format
      return id;
    })(),
    name: String(safeGet(product, 'name', 'Unknown Product')),
    description: String(safeGet(product, 'description', 'No description available')),
    
    // Numeric values with type safety
    price: Math.max(0, Number(safeGet(product, 'price', 0))),
    mrp: Math.max(0, Number(safeGet(product, 'mrp', safeGet(product, 'price', 0)))),
    rating: Math.min(5, Math.max(0, Number(safeGet(product, 'rating', 0)))),
    reviewCount: Math.max(0, Number(safeGet(product, 'reviewCount', 0))),
    
    // Handle category (could be string or object with name)
    category: (() => {
      const category = product?.category;
      if (!category) return 'Uncategorized';
      // If it's a string, use it directly
      if (typeof category === 'string') return category;
      // If it's an object with a name property, use that
      if (category && typeof category === 'object' && category.name) {
        return String(category.name);
      }
      return 'Uncategorized';
    })(),
    
    // Handle stock status
    inStock: product?.inStock !== false, // Default to true if not specified
    
    // Handle images - ensure we always have an array with at least one image
    images: (() => {
      // If we have an array of images, use it (filter out any invalid entries)
      if (Array.isArray(product?.images)) {
        return product.images.filter(img => img && typeof img === 'string');
      }
      // If we have a single image string, wrap it in an array
      if (product?.image && typeof product.image === 'string') {
        return [product.image];
      }
      // Fallback to default image
      return [getDefaultImage(product?.category)];
    })(),
    
    // Ensure we have a single image URL
    image: (() => {
      if (product?.image && typeof product.image === 'string') return product.image;
      if (Array.isArray(product?.images) && product.images.length > 0) return product.images[0];
      return getDefaultImage(product?.category);
    })()
  };
  
  const safeProductData = {};
  Object.entries(productData).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      safeProductData[key] = '';
    } else if (Array.isArray(value)) {
      // For arrays, we'll keep them as is for internal use
      safeProductData[key] = value;
    } else if (typeof value === 'object') {
      // Convert objects to strings for rendering
      safeProductData[key] = JSON.stringify(value);
    } else {
      safeProductData[key] = value;
    }
  });

  // Calculate product discount if MRP is greater than price
  const productDiscount = productData.mrp > productData.price
    ? Math.round(((productData.mrp - productData.price) / productData.mrp) * 100)
    : 0;

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!authStatus) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    try {
      setIsLoading(true);
      await addToWishlist(productData.id);
      toast.success('Added to wishlist!');
    } catch (error) {
      console.error('Add to wishlist error:', error);
      toast.error(error.response?.data?.error || 'Failed to add to wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToWishlistFromQuickView = async (productId) => {
    if (!authStatus) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    try {
      await addToWishlist(productId);
      toast.success('Added to wishlist!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add to wishlist');
    }
  };

  return (
    <div className="product-card">
      {showQuickView && (
        <div className="quick-view-overlay active">
          <QuickView 
            product={productData}
            onClose={handleCloseQuickView}
          />
        </div>
      )}
      
      <Link to={`/products/${productData.id}`} className="product-link" onClick={(e) => e.stopPropagation()}>
        <div className="product-image-container">
          <img 
            src={productData.image || 'https://via.placeholder.com/300x300?text=No+Image'}
            alt={productData.name} 
            className="product-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
            loading="lazy"
          />
          
          <div className="product-badges">
            {productDiscount > 0 && (
              <span className="product-badge discount">
                -{productDiscount}%
              </span>
            )}
            {!productData.inStock && (
              <div className="out-of-stock-overlay">
                <span className="out-of-stock-text">Out of Stock</span>
              </div>
            )}
          </div>
        </div>

        <div className="product-info">
          <div className="product-category">{productData.category || 'Uncategorized'}</div>
          <h3 className="product-title">{productData.name}</h3>
          
          {productData.description && (
            <p className="product-description">
              {productData.description.length > 60 
                ? `${productData.description.substring(0, 60)}...` 
                : productData.description}
            </p>
          )}
          
          <div className="product-rating">
            <div className="product-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={16} 
                  className={`product-star ${star <= Math.round(productData.rating) ? 'filled' : 'empty'}`} 
                />
              ))}
            </div>
            {productData.reviewCount > 0 && (
              <span className="product-rating-count">
                ({productData.reviewCount} review{productData.reviewCount !== 1 ? 's' : ''})
              </span>
            )}
          </div>

          <div className="product-price-section">
            <div className="product-prices">
              <p className="product-price-current">
                {formatPrice(productData.price)}
              </p>
              {productData.mrp > productData.price && (
                <p className="product-price-original">
                  {formatPrice(productData.mrp)}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>

      <div className="product-actions-bottom">
        <button
          className="product-action-button"
          title="Quick View"
          onClick={handleQuickView}
        >
          <Eye size={16} />
          <span>Quick View</span>
        </button>
        <button
          className="product-action-button"
          title="Add to Wishlist"
          onClick={handleAddToWishlist}
        >
          <Heart size={16} />
          <span>Wishlist</span>
        </button>
        <button
          className="product-action-button"
          onClick={handleAddToCart}
          disabled={!productData.inStock || isLoading}
          title={!productData.inStock ? 'Out of Stock' : 'Add to Cart'}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <ShoppingCart size={16} />
          )}
          <span>{!productData.inStock ? 'Out of Stock' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;