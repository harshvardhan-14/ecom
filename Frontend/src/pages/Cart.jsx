import { useEffect, useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../lib/utils';
import { assets } from '../assets/assets';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import '../../src/styles/pages/Cart.css';

// Helper function to get product image
const getProductImage = (images) => {
  if (!images || images.length === 0) return assets.product_img1;
  
  const imagePath = Array.isArray(images) ? images[0] : images;
  
  // If it's already a full URL (http/https), return it directly
  if (typeof imagePath === 'string' && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
    return imagePath;
  }
  
  // Convert database path to imported image
  const imageMap = {
    '/product_img1.png': assets.product_img1,
    '/product_img2.png': assets.product_img2,
    '/product_img3.png': assets.product_img3,
    '/product_img4.png': assets.product_img4,
    '/product_img5.png': assets.product_img5,
    '/product_img6.png': assets.product_img6,
    '/product_img7.png': assets.product_img7,
    '/product_img8.png': assets.product_img8,
    '/product_img9.png': assets.product_img9,
    '/product_img10.png': assets.product_img10,
    '/product_img11.png': assets.product_img11,
    '/product_img12.png': assets.product_img12,
  };
  
  return imageMap[imagePath] || assets.product_img1;
};

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items, total, fetchCart, updateQuantity, removeItem, isLoading } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart().catch(() => {});
    }
  }, [isAuthenticated, fetchCart]);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeItem(productId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (!isAuthenticated) {
    return (
      <div className="cart cart--empty">
        <div className="cart__empty">
          <ShoppingCart className="cart__empty-icon" />
          <h2 className="cart__empty-title">Please login to view your cart</h2>
          <Link to="/login" className="btn btn--primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading__spinner"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart cart--empty">
        <div className="cart__empty">
          <ShoppingCart className="cart__empty-icon" />
          <h2 className="cart__empty-title">Your cart is empty</h2>
          <p className="cart__empty-message">Looks like you haven't added any items yet</p>
          <Link to="/products" className="btn btn--primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart__header">
        <h1 className="cart__title">Shopping Cart</h1>
      </div>

      <div className="cart__content">
        {/* Cart Items */}
        <div className="cart__items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={getProductImage(item.product.images)}
                alt={item.product.name}
                className="cart-item__image"
              />
              
              <div className="cart-item__details">
                <div className="cart-item__info">
                  <h3 className="cart-item__title">
                    <Link to={`/products/${item.product.id}`} className="cart-item__link">
                      {item.product.name}
                    </Link>
                  </h3>
                  <p className="cart-item__category">{item.product.category.name}</p>
                  <p className="cart-item__price">
                    {formatPrice(item.product.price)}
                  </p>
                </div>

                <div className="cart-item__actions">
                  <button
                    onClick={() => handleRemoveItem(item.product.id)}
                    className="btn btn--text btn--remove"
                  >
                    <Trash2 size={16} />
                    <span>Remove</span>
                  </button>

                  <div className="quantity-selector">
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="quantity-selector__btn"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="quantity-selector__value">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="quantity-selector__btn"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="cart-summary">
          <h2 className="cart-summary__title">Order Summary</h2>
          
          <div className="cart-summary__details">
            <div className="cart-summary__row">
              <span className="cart-summary__label">Subtotal</span>
              <span className="cart-summary__value">{formatPrice(total)}</span>
            </div>
            <div className="cart-summary__row">
              <span className="cart-summary__label">Shipping</span>
              <span className="cart-summary__value">
                {total > 50 ? 'Free' : formatPrice(10)}
              </span>
            </div>
            <div className="cart-summary__row cart-summary__row--total">
              <span className="cart-summary__total-label">Total</span>
              <span className="cart-summary__total-value">
                {formatPrice(total > 50 ? total : total + 10)}
              </span>
            </div>
          </div>

          <button 
            onClick={handleCheckout} 
            className="btn btn--primary btn--block"
          >
            Proceed to Checkout
          </button>

          <Link to="/products" className="btn btn--outline btn--block">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}