import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import useWishlistStore from '../store/wishlistStore';
import { toast } from 'react-hot-toast';
import '../styles/components/QuickView.css';

export default function QuickView({ product, onClose }) {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Store hooks
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { 
    addToWishlist, 
    removeFromWishlist, 
    toggleWishlist: toggleWishlistItem,
    wishlistItems = [] 
  } = useWishlistStore();

  useEffect(() => {
    // Add active class with a small delay to trigger the animation
    const timer = setTimeout(() => setIsActive(true), 10);
    
    // Set the first image as current when product changes
    if (product?.images?.[0]) {
      setCurrentImage(product.images[0]);
    }

    // Add/remove body class to handle scroll
    document.body.classList.add('quick-view-open');
    
    return () => {
      clearTimeout(timer);
      document.body.classList.remove('quick-view-open');
    };
  }, [product]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Check if product is in wishlist
  useEffect(() => {
    if (product?.id && Array.isArray(wishlistItems)) {
      const inWishlist = wishlistItems.some(item => item?.id === product.id);
      setIsWishlisted(!!inWishlist);
    }
  }, [product, wishlistItems]);

  const handleQuantityChange = (newQuantity) => {
    setQuantity(Math.max(1, newQuantity));
  };

  const handleAddToCart = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    
    if (isAddingToCart) return;
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    } 
    
    if (!product?.id) {
      toast.error('Product information is not available');
      return;
    }
    
    if (!product.inStock) {
      toast.error('This product is currently out of stock');
      return;
    }
    
    try {
      setIsAddingToCart(true);
      
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        quantity,
        inStock: product.inStock
      });
      
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add item to cart';
      toast.error(errorMessage);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to manage wishlist');
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (!product?.id) {
      toast.error('Product information is not available');
      return;
    }

    try {
      const success = await toggleWishlistItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        inStock: product.inStock
      });
      
      if (success) {
        // Update local state based on the new wishlist status
        const newWishlistStatus = !isWishlisted;
        setIsWishlisted(newWishlistStatus);
        
        // Show appropriate toast message
        toast.success(
          newWishlistStatus 
            ? 'Added to wishlist' 
            : 'Removed from wishlist'
        );
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    }
  };

  if (!product) return null;

  // Ensure we have a valid product with required fields
  const productData = {
    ...product,
    name: product.name || 'Unnamed Product',
    description: product.description || 'No description available',
    rating: Number(product.rating) || 0,
    reviewCount: Number(product.reviewCount) || 0,
    // Handle category which could be an object with name property or a string
    category: typeof product.category === 'object' ? product.category.name : (product.category || 'Uncategorized'),
    price: product.price || 0,
    originalPrice: product.originalPrice || product.mrp || product.price || 0,
    discount: product.discount || 0,
    inStock: product.inStock !== undefined ? product.inStock : true,
    // Handle both images array and single image
    images: Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []),
    features: Array.isArray(product.features) ? product.features : [],
    // Ensure we have at least one image
    image: product.image || (product.images && product.images[0]) || ''
  };

  // Close the modal when clicking the overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Calculate discount percentage if not provided
  const discount = productData.discount || 
    (productData.originalPrice > productData.price 
      ? Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100) 
      : 0);

  if (!product) return null;

  return createPortal(
    <div 
      className={`quick-view-overlay ${isActive ? 'active' : ''}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      <div className="quick-view-container">
        <button className="quick-view-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="quick-view-content">
          <div className="quick-view-image-container">
            <img 
              src={productData.images[0] || ''} 
              alt={productData.name}
              className="quick-view-main-img"
            />
          </div>
          
          <div className="quick-view-details">
            <h1 className="quick-view-title">{productData.name}</h1>
            
            <div className="quick-view-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  className={`star ${star <= Math.round(productData.rating) ? 'filled' : ''}`}
                >
                  ★
                </span>
              ))}
              <span className="review-count">({productData.reviewCount} reviews)</span>
            </div>
            
            <div className="quick-view-price">
              <span className="current-price">${productData.price?.toFixed(2)}</span>
              {productData.originalPrice > productData.price && (
                <>
                  <span className="original-price">${productData.originalPrice?.toFixed(2)}</span>
                  {discount > 0 && <span className="discount">-{discount}%</span>}
                </>
              )}
            </div>
            
            <div className="quick-view-description">
              <h3>Product Description</h3>
              <p>{productData.description}</p>
              
              {productData.features.length > 0 && (
                <div className="product-features">
                  <h4>Key Features:</h4>
                  <ul>
                    {productData.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="quick-view-actions">
              <div className="quantity-selector">
                <button 
                  className="quantity-btn" 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={!productData.inStock || quantity <= 1}
                >
                  -
                </button>
                <input 
                  type="number" 
                  className="quantity-input" 
                  value={quantity}
                  min="1"
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  disabled={!productData.inStock}
                />
                <button 
                  className="quantity-btn" 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={!productData.inStock}
                >
                  +
                </button>
              </div>
              
              <div className="action-buttons">
                <button 
                  className="btn btn-primary" 
                  onClick={handleAddToCart}
                  disabled={!productData.inStock || isAddingToCart}
                >
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button 
                  className={`btn ${isWishlisted ? 'btn-wishlist-active' : 'btn-outline'}`}
                  onClick={toggleWishlist}
                >
                  {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
              </div>
            </div>
            
            <div className="quick-view-meta">
              <div className="meta-item">
                <span className="meta-label">Availability:</span>
                <span className={`meta-value ${productData.inStock ? 'in-stock' : 'out-of-stock'}`}>
                  {productData.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">SKU:</span>
                <span className="meta-value">{productData.sku || 'N/A'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Category:</span>
                <span className="meta-value">{productData.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Add display name for better debugging
QuickView.displayName = 'QuickView';
