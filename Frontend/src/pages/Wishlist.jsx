import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Heart, X } from 'lucide-react';
import useWishlistStore from '../store/wishlistStore';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import { toast } from 'react-hot-toast';
import { assets } from '../assets/assets';
import '../styles/pages/Wishlist.css';

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

export default function Wishlist() {
  const navigate = useNavigate();
  const { items: wishlistItems, fetchWishlist, removeFromWishlist, isLoading } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view your wishlist');
      navigate('/login');
      return;
    }
    fetchWishlist().catch(console.error);
  }, [isAuthenticated, navigate, fetchWishlist]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id, 1);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p>{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}</p>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your wishlist...</p>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <Heart className="empty-icon" />
          <h2>Your wishlist is empty</h2>
          <p>Add some items to your wishlist to see them here</p>
          <Link to="/products" className="browse-btn">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="wishlist-items">
          {wishlistItems.map((item) => {
            const product = item.product || item; // Handle both nested and flat structures
            return (
              <div key={product.id} className="wishlist-item">
                <button 
                  className="remove-btn"
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  aria-label="Remove from wishlist"
                >
                  <X size={20} />
                </button>
                <div className="wishlist-item-image">
                  <img 
                    src={getProductImage(product.images || product.image)} 
                    alt={product.name} 
                    onClick={() => navigate(`/products/${product.id}`)}
                  />
                </div>
                <div className="wishlist-item-details">
                  <h3 onClick={() => navigate(`/products/${product.id}`)}>
                    {product.name}
                  </h3>
                  <p className="price">${product.price?.toFixed(2)}</p>
                  <div className="wishlist-actions">
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                    >
                      <ShoppingCart size={16} />
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}