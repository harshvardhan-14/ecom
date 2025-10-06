import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import '../styles/components/QuickView.css';

export default function QuickView({ product, onClose }) {
  const [isActive, setIsActive] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    // Add active class with a small delay to trigger the animation
    const timer = setTimeout(() => setIsActive(true), 10);
    // Set the first image as current when product changes
    if (product?.images?.[0]) {
      setCurrentImage(product.images[0]);
    }
    return () => clearTimeout(timer);
  }, [product]);

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

  return (
    <div 
      className={`quick-view-overlay ${isActive ? 'active' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="quick-view-container">
        <button className="quick-view-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="quick-view-content">
          <div className="quick-view-images">
            <div className="main-image">
              <img 
                src={currentImage || productData.images[0] || ''} 
                alt={productData.name}
                className="quick-view-main-img"
              />
            </div>
            {productData.images.length > 1 && (
              <div className="thumbnail-container">
                {productData.images.map((img, index) => (
                  <div 
                    key={index}
                    className={`thumbnail ${currentImage === img ? 'active' : ''}`}
                    onClick={() => setCurrentImage(img)}
                  >
                    <img 
                      src={img} 
                      alt={`${productData.name} thumbnail ${index + 1}`}
                      className="thumbnail-img"
                    />
                  </div>
                ))}
              </div>
            )}
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
                <button className="quantity-btn" disabled={!productData.inStock}>-</button>
                <input 
                  type="number" 
                  className="quantity-input" 
                  defaultValue="1" 
                  min="1"
                  disabled={!productData.inStock}
                />
                <button className="quantity-btn" disabled={!productData.inStock}>+</button>
              </div>
              
              <div className="action-buttons">
                <button 
                  className="btn btn-primary" 
                  disabled={!productData.inStock}
                >
                  Add to Cart
                </button>
                <button className="btn btn-outline">
                  Add to Wishlist
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
    </div>
  );
}