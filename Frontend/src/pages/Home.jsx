import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, TrendingUp, Send, Clock, Headphones } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../lib/api';
import { assets, productDummyData, categories as DUMMY_CATEGORY_NAMES, ourSpecsData } from '../assets/assets'; 
import ProductCard from '../components/ProductCard';
import '../../src/styles/pages/Home.css';


// Map the image assets into an easily indexable array for the helper function
const productImages = [
  assets.product_img1, assets.product_img2, assets.product_img3, assets.product_img4,
  assets.product_img5, assets.product_img6, assets.product_img7, assets.product_img8,
  assets.product_img9, assets.product_img10, assets.product_img11, assets.product_img12,
];

// Map category names to specific images
const getCategoryImage = (name, index) => {
  const imageMap = {
    'Electronics': productImages[2],        // Smart Watch
    'Fashion': productImages[4],            // Earbuds
    'Home & Garden': productImages[0]       // Table Lamp
  };
  return imageMap[name] || productImages[index % productImages.length];
};

// Reformat category names from assets.js into the structure Home.jsx expects
const DUMMY_CATEGORIES = DUMMY_CATEGORY_NAMES.map((name, index) => ({
    id: index + 1,
    name: name,
    slug: name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'),
    _count: { products: 10 + index * 5 },
    // Assign specific image based on category name
    image: getCategoryImage(name, index)
}));


// Helper function to get category-specific image
// Based on actual product images from seed.js:
// img1,2 = Table Lamp (Home & Garden)
// img3,4 = Smart Watch (Electronics) 
// img5,6 = Wireless Earbuds (Electronics)
// img7,8 = Yoga Mat (Sports)
// img9,10 = Skincare Set (Beauty)
// img11,12 = Books (Books)
const getCategorySpecificImage = (categoryName, index = 0) => {
  const name = (categoryName || '').toString().toLowerCase().trim();
  
  // Direct mapping based on actual seed data
  const categoryImageMap = {
    // Backend categories (exact matches from seed.js)
    'electronics': 2,           // product_img3 = Smart Watch
    'fashion': 4,               // product_img5 = Earbuds (closest to fashion/accessories)
    'home & garden': 0,         // product_img1 = Table Lamp
    'home': 0,                  // product_img1 = Table Lamp
    'garden': 0,                // product_img1 = Table Lamp
    'beauty': 8,                // product_img9 = Skincare Set
    'sports': 6,                // product_img7 = Yoga Mat
    'books': 10,                // product_img11 = Books
    // Frontend dummy categories
    'headphones': 4,            // product_img5 = Earbuds
    'speakers': 2,              // product_img3 = Smart Watch (tech)
    'watch': 2,                 // product_img3 = Smart Watch
    'earbuds': 4,               // product_img5 = Wireless Earbuds
    'mouse': 2,                 // product_img3 = Smart Watch (tech)
    'decoration': 0             // product_img1 = Table Lamp
  };
  
  // Try exact match first
  if (categoryImageMap[name] !== undefined) {
    return productImages[categoryImageMap[name]];
  }
  
  // Try partial match
  for (const [key, imgIndex] of Object.entries(categoryImageMap)) {
    if (name.includes(key) || key.includes(name)) {
      return productImages[imgIndex];
    }
  }
  
  // Fallback to index-based
  return productImages[index % productImages.length];
};

// Helper function for backward compatibility
const getDefaultProductImage = (category, index = 0) => {
  try {
    const categoryName = typeof category === 'object' ? category.name : category;
    return getCategorySpecificImage(categoryName, index);
  } catch (error) {
    console.error('Error getting product image:', error);
    return assets.product_img1;
  }
};


export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState(DUMMY_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let productsData = [];
      let categoriesData = [];

      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsAPI.getAll({ featured: true, limit: 8 }),
          categoriesAPI.getAll(),
        ]);
        
        productsData = productsRes?.data?.products || [];
        categoriesData = categoriesRes?.data || [];

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Unable to load data. Showing sample content.');
      } finally {
        // --- FIX: Robust Dummy Data Mapping for Rendering ---
        if (productsData.length === 0) {
            console.warn('Using dummy products due to empty API response.');
            
            // Map the productDummyData to ensure ALL required ProductCard fields are present
            const formattedDummyProducts = productDummyData.map(p => ({
                ...p,
                // Ensure required ID fields are robustly present
                _id: p.id, // Ensure _id is set for react-router link
                id: p.id,
                // Inject the single reliable image property 
                image: p.images?.[0] || assets.product_img1, 
                // Ensure category object is shaped correctly for ProductCard/helpers
                category: p.category ? { name: p.category } : { name: 'default' },
                // Ensure rating count is present
                reviewCount: p.reviewCount || p.rating.length || 0,
            })).slice(0, 8); 

            setFeaturedProducts(formattedDummyProducts);
        } else {
            setFeaturedProducts(productsData);
        }

        if (categoriesData.length === 0) {
            console.warn('Using dummy categories due to empty API response.');
            setCategories(DUMMY_CATEGORIES);
        } else {
            // Add images to backend categories
            const categoriesWithImages = categoriesData.map((cat, index) => ({
                ...cat,
                image: getCategorySpecificImage(cat.name, index)
            }));
            setCategories(categoriesWithImages);
        }

        setLoading(false);
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

  if (error) {
    // If the API failed but dummy data loaded, we proceed. If the app failed completely:
    // This part assumes the initial setting of dummy data succeeded, so it's mainly for network failure.
    // If featuredProducts has data, we ignore the error state here and proceed to render.
  }
  
  // Function to dynamically select the Lucide icon based on title (for Features)
  const getFeatureIcon = (title) => {
    switch (title) {
        case 'Free Shipping': return Send;
        case '7 Days easy Return': return Clock;
        case '24/7 Customer Support': return Headphones;
        default: return Truck;
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
                src={assets.hero_model_img}
                alt="Model" 
                className="hero-model-img" 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <div className="hero-products">
              <img 
                src={assets.hero_product_img1}
                alt="Featured Product 1" 
                className="hero-product-img hero-product-1"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <img 
                src={assets.hero_product_img2}
                alt="Featured Product 2" 
                className="hero-product-img hero-product-2"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features - Using data from assets.js */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {ourSpecsData.map((spec, index) => {
                const Icon = getFeatureIcon(spec.title);
                return (
                    <div className="feature-card" key={index}>
                        <div className="feature-icon">
                            <Icon />
                        </div>
                        <h3 className="feature-title">{spec.title}</h3>
                        <p className="feature-text">{spec.description.split('. ')[0]}</p>
                    </div>
                );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="category-card"
              >
                <div className="category-image-container">
                  <img
                    src={category.image || getCategorySpecificImage(category.name, index)}
                    alt={category.name}
                    className="category-image"
                    onError={(e) => {
                      e.target.src = assets.product_img1; // Fallback to local asset
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
            {/* If featuredProducts is empty, this map will render nothing, 
            but the error message above should catch the true failure. */}
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id || product._id} 
                product={{
                    ...product,
                    // Pass the most reliable image URL down
                    image: product.image || product.images?.[0] || getDefaultProductImage(product.category?.name || product.name)
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}