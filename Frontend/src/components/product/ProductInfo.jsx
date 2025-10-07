import { useState } from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';

export default function ProductInfo({ 
  product, 
  quantity, 
  isWishlisted, 
  onQuantityChange, 
  onAddToCart, 
  onToggleWishlist,
  isAddingToCart
}) {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{product?.name || 'Product Name'}</h1>
      
      <div style={styles.ratingContainer}>
        <div style={styles.rating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star}
              size={18} 
              fill={star <= (product?.rating || 5) ? '#f1c40f' : 'none'}
              color={star <= (product?.rating || 5) ? '#f1c40f' : '#ddd'}
            />
          ))}
          <span style={styles.ratingText}>{product?.rating || 5}/5</span>
        </div>
        <span style={styles.reviewCount}>
          ({product?.reviewCount || 0} reviews)
        </span>
      </div>

      <div style={styles.priceContainer}>
        <span style={styles.currentPrice}>${product?.price?.toFixed(2) || '0.00'}</span>
        {product?.originalPrice && (
          <span style={styles.originalPrice}>${product.originalPrice.toFixed(2)}</span>
        )}
        {product?.discount && (
          <span style={styles.discount}>{product.discount}% OFF</span>
        )}
      </div>

      <p style={styles.description}>
        {product?.description || 'No description available'}
      </p>

      <div style={styles.quantityContainer}>
        <span>Quantity:</span>
        <div style={styles.quantityControls}>
          <button 
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            style={styles.quantityButton}
          >
            -
          </button>
          <span style={styles.quantity}>{quantity}</span>
          <button 
            onClick={() => onQuantityChange(quantity + 1)}
            style={styles.quantityButton}
          >
            +
          </button>
        </div>
      </div>

      <div style={styles.buttonContainer}>
        <button
          onClick={onAddToCart}
          disabled={isAddingToCart}
          style={styles.addToCartButton}
        >
          <ShoppingCart size={18} />
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </button>
        <button
          onClick={onToggleWishlist}
          style={{
            ...styles.wishlistButton,
            backgroundColor: isWishlisted ? '#f8d7da' : 'white',
            color: isWishlisted ? '#721c24' : '#2c3e50',
            border: isWishlisted ? '1px solid #f5c6cb' : '1px solid #ddd',
          }}
        >
          <Heart size={18} />
          {isWishlisted ? 'Wishlisted' : 'Wishlist'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '0 10px',
  },
  title: {
    fontSize: '28px',
    margin: '0 0 10px',
    color: '#2c3e50',
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },
  ratingText: {
    marginLeft: '5px',
    fontSize: '14px',
    color: '#7f8c8d',
  },
  reviewCount: {
    fontSize: '14px',
    color: '#7f8c8d',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    margin: '20px 0',
  },
  currentPrice: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  originalPrice: {
    fontSize: '18px',
    color: '#95a5a6',
    textDecoration: 'line-through',
  },
  discount: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  description: {
    color: '#7f8c8d',
    lineHeight: '1.6',
    marginBottom: '25px',
  },
  quantityContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '25px',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  quantityButton: {
    width: '32px',
    height: '32px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: '#f8f9fa',
    },
  },
  quantity: {
    width: '40px',
    textAlign: 'center',
    fontSize: '16px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px',
  },
  addToCartButton: {
    flex: 2,
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#2980b9',
    },
    '&:disabled': {
      backgroundColor: '#bdc3c7',
      cursor: 'not-allowed',
    },
  },
  wishlistButton: {
    flex: 1,
    padding: '12px 20px',
    height: '44px',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#f8f9fa',
      borderColor: '#ced4da',
    },
  },
};
