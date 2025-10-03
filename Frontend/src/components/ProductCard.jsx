import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Eye, Loader2 } from 'lucide-react';

import { assets } from '../assets/assets';
import toast from 'react-hot-toast';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      setIsLoading(true);
      await addToCart(product.id);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Implement quick view functionality
    console.log('Quick view:', product.id);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    // Implement wishlist functionality
    console.log('Add to wishlist:', product.id);
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="product-image-container">
        <img
          src={product.images?.[0] || assets.product_img1}
          alt={product.name}
          className="product-image"
        />
        
        {/* Badges */}
        <div className="product-badges">
          {product.discount > 0 && (
            <span className="product-badge discount">
              -{product.discount}%
            </span>
          )}
          {product.isNew && (
            <span className="product-badge new">
              New
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className={`quick-actions ${isHovered ? 'visible' : ''}`}>
          <button
            onClick={handleAddToWishlist}
            className="quick-action-btn wishlist"
            title="Add to wishlist"
          >
            <Heart className="action-icon" />
          </button>
          <button
            onClick={handleQuickView}
            className="quick-action-btn quick-view"
            title="Quick view"
          >
            <Eye className="action-icon" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h3 className="product-name">
          {product.name}
        </h3>
        <div className="rating-container">
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`star-icon ${
                  star <= Math.round(product.rating || 0) ? 'filled' : ''
                }`}
              />
            ))}
            <span className="review-count">
              ({product.reviewCount || 0})
            </span>
          </div>
        </div>
        <div className="price-container">
          <div>
            {product.discount > 0 ? (
              <>
                <span className="current-price">
                  {formatPrice(product.price * (1 - product.discount / 100))}
                </span>
                <span className="original-price">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="current-price">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="add-to-cart-btn"
            title="Add to cart"
          >
            {isLoading ? (
              <Loader2 className="loading-icon" />
            ) : (
              <ShoppingCart className="cart-icon" />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
  }}