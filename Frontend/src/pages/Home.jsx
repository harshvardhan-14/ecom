import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, TrendingUp } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../lib/api';
// Import all product images
import productImg1 from '../assets/product_img1.png';
import productImg2 from '../assets/product_img2.png';
import productImg3 from '../assets/product_img3.png';
import productImg4 from '../assets/product_img4.png';
import productImg5 from '../assets/product_img5.png';
import productImg6 from '../assets/product_img6.png';
import productImg7 from '../assets/product_img7.png';
import productImg8 from '../assets/product_img8.png';
import productImg9 from '../assets/product_img9.png';
import productImg10 from '../assets/product_img10.png';
import productImg11 from '../assets/product_img11.png';
import productImg12 from '../assets/product_img12.png';

// Import hero images
import heroModelImg from '../assets/hero_model_img.png';
import heroProductImg1 from '../assets/hero_product_img1.png';
import heroProductImg2 from '../assets/hero_product_img2.png';

const productImages = [
  productImg1, productImg2, productImg3, productImg4,
  productImg5, productImg6, productImg7, productImg8,
  productImg9, productImg10, productImg11, productImg12
];

// Hero images
const heroImages = {
  model: heroModelImg,
  product1: heroProductImg1,
  product2: heroProductImg2
};
import ProductCard from '../components/ProductCard';


export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Electronics', slug: 'electronics' },
    { id: 2, name: 'Clothing', slug: 'clothing' },
    { id: 3, name: 'Home & Garden', slug: 'home-garden' },
    { id: 4, name: 'Books', slug: 'books' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsAPI.getAll({ featured: true, limit: 8 }),
          categoriesAPI.getAll(),
        ]);
        setFeaturedProducts(productsRes?.data?.products || []);
        setCategories(prev => categoriesRes?.data || prev);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Unable to load data. Showing sample content.');
      } finally {
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <p>{error}</p>
          <p>Please ensure the backend server is running and try refreshing the page.</p>
        </div>
      </div>
    );
  }

  // Helper function to get default product image based on category
  const getDefaultProductImage = (category) => {
    try {
      // Convert category name to lowercase and trim for better matching
      const categoryName = (typeof category === 'object' ? category.name : category || '').toString().toLowerCase().trim();
      console.log('Getting image for category:', categoryName);
      
      // Import all product images
      const productImages = [
        require('../assets/product_img1.png'),
        require('../assets/product_img2.png'),
        require('../assets/product_img3.png'),
        require('../assets/product_img4.png'),
        require('../assets/product_img5.png'),
        require('../assets/product_img6.png'),
        require('../assets/product_img7.png'),
        require('../assets/product_img8.png'),
        require('../assets/product_img9.png'),
        require('../assets/product_img10.png'),
        require('../assets/product_img11.png'),
        require('../assets/product_img12.png')
      ];
      
      // Map of category to image indices
      const categoryImageMap = {
        'electronics': [0, 1],
        'clothing': [2, 3],
        'home': [4, 5],
        'garden': [4, 5],
        'books': [6, 7],
        'headphones': [0, 1],
        'speakers': [2, 3],
        'watch': [4, 5],
        'earbuds': [6, 7],
        'mouse': [8, 9],
        'decoration': [10, 11]
      };
      
      // Find matching category
      const matchedCategory = Object.keys(categoryImageMap).find(key => 
        categoryName.includes(key.toLowerCase())
      );
      
      // Get image indices for the matched category or use default (0,1)
      const imageIndices = matchedCategory ? categoryImageMap[matchedCategory] : [0, 1];
      const randomIndex = Math.floor(Math.random() * imageIndices.length);
      const selectedImage = productImages[imageIndices[randomIndex]];
      
      console.log('Selected image for', categoryName, ':', selectedImage);
      return selectedImage;
    
    } catch (error) {
      console.error('Error getting product image:', error);
      return require('../assets/product_img1.png');
    }
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to ShopHub</h1>
            <p className="hero-subtitle">Discover amazing products at unbeatable prices. Shop the latest trends and enjoy fast, free shipping.</p>
            <Link to="/products" className="hero-button">
              Shop Now
              <ArrowRight className="hero-button-icon" />
            </Link>
          </div>
          <div className="hero-images">
            <div className="hero-model">
              <img 
                src={heroImages.model} 
                alt="Model" 
                className="hero-model-img" 
                onError={(e) => {
                  console.error('Error loading hero model image');
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="hero-products">
              <img 
                src={heroImages.product1} 
                alt="Featured Product 1" 
                className="hero-product-img hero-product-1"
                onError={(e) => {
                  console.error('Error loading hero product image 1');
                  e.target.style.display = 'none';
                }}
              />
              <img 
                src={heroImages.product2} 
                alt="Featured Product 2" 
                className="hero-product-img hero-product-2"
                onError={(e) => {
                  console.error('Error loading hero product image 2');
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Truck />
              </div>
              <h3 className="feature-title">Free Shipping</h3>
              <p className="feature-text">On orders over $50</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Shield />
              </div>
              <h3 className="feature-title">Secure Payment</h3>
              <p className="feature-text">100% secure transactions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <TrendingUp />
              </div>
              <h3 className="feature-title">Best Prices</h3>
              <p className="feature-text">Competitive pricing guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="category-card"
              >
                <div className="category-image-container">
                  <img
                    src={category.image || getDefaultProductImage(category)}
                    alt={category.name}
                    className="category-image"
                    onError={(e) => {
                      console.error('Error loading image:', e.target.src);
                      e.target.src = require('../assets/product_img1.png');
                    }}
                  />
                </div>
                <div className="category-info">
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-count">{category._count?.products || 0} products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products" className="view-all-link">
              View All
              <ArrowRight className="view-all-icon" />
            </Link>
          </div>
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
