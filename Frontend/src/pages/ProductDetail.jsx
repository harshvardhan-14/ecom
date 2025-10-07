import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import useWishlistStore from '../store/wishlistStore';
import toast from 'react-hot-toast';
import dummyData from '../assets/dummyData';
import ProductImages from '../components/product/ProductImages';
import ProductInfo from '../components/product/ProductInfo';
import ProductSpecifications from '../components/product/ProductSpecifications';

const getDefaultProductImage = () => {
  return 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23eee%22%2F%3E%3Ctext%20x%3D%22100%22%20y%3D%22100%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20fill%3D%22%23999%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Store hooks
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { 
    addToWishlist, 
    removeFromWishlist, 
    isInWishlist,
    toggleWishlist: toggleWishlistItem
  } = useWishlistStore();
  
  const getImageUrl = (imagePath) => {
    if (!imagePath) return getDefaultProductImage();
    if (typeof imagePath === 'string' && (imagePath.startsWith('http') || imagePath.startsWith('data:'))) {
      return imagePath;
    }
    return `${process.env.REACT_APP_API_URL || ''}/uploads/${imagePath}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Simulate API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Find the product in the static data
        const foundProduct = dummyData.products.find(p => p.id === id || 
          p.id === `prod_${id}` || 
          p.id === id.replace('prod_', ''));
          
        // If product not found, try with the first part of the ID (in case of variants)
        const productToUse = !foundProduct && id.includes('_')
          ? dummyData.products.find(p => p.id === id.split('_')[0])
          : foundProduct;
        
        if (productToUse) {
          const images = (productToUse.images || [productToUse.image])
            .filter(Boolean)
            .map(img => getImageUrl(img));
            
          setProduct({
            ...productToUse,
            images: images.length ? images : [getDefaultProductImage()],
            rating: productToUse.rating || 0,
            reviewCount: productToUse.reviewCount || 0,
            inStock: productToUse.inStock !== undefined ? productToUse.inStock : true,
            category: productToUse.category || 'Uncategorized',
            description: productToUse.description || 'No description available.'
          });
        } else {
          console.error('Product not found');
          toast.error('Product not found');
          navigate('/products');
        }
      } catch (error) {
        console.error('Error finding product:', error);
        toast.error('Error loading product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

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
    
    try {
      setIsAddingToCart(true);
      // Remove 'prod_' prefix if it exists
      const productId = product.id.replace('prod_', '');
      
      await addToCart(productId, quantity);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
    } finally {
      setIsAddingToCart(false);
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
      toast.error('Failed to add item to cart');
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
      // Use the store's toggleWishlist method
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

  // Check if product is in wishlist
  useEffect(() => {
    if (product?.id) {
      const checkWishlistStatus = async () => {
        try {
          const inWishlist = isInWishlist(product.id);
          setIsWishlisted(inWishlist);
        } catch (error) {
          console.error('Error checking wishlist status:', error);
        }
      };
      
      checkWishlistStatus();
    }
  }, [product?.id, isInWishlist]);

  const handleQuantityChange = (newQuantity) => {
    setQuantity(Math.max(1, newQuantity));
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <h2>Loading Product Details</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={styles.notFoundContainer}>
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/products')}
          style={styles.backButton}
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.imagesContainer}>
          <ProductImages 
            images={product.images} 
            selectedImage={selectedImage} 
            onImageSelect={setSelectedImage}
          />
        </div>
        
        <div style={styles.infoContainer}>
          <ProductInfo 
            product={product}
            quantity={quantity}
            isWishlisted={isWishlisted}
            onQuantityChange={handleQuantityChange}
            onAddToCart={handleAddToCart}
            onToggleWishlist={toggleWishlist}
            isAddingToCart={isAddingToCart}
          />
        </div>
      </div>
      
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <ProductSpecifications specifications={product.specifications} />
      )}
    </div>
  );
}
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '20px',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    marginBottom: '40px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  imagesContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '20px',
  },
  infoContainer: {
    padding: '0 10px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    padding: '40px 20px',
    textAlign: 'center',
    gap: '20px',
  },
  loader: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  notFoundContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    maxWidth: '600px',
    margin: '40px auto',
  },
  backButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    '&:hover': {
      backgroundColor: '#2980b9',
    },
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};