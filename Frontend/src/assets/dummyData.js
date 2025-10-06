import { v4 as uuidv4 } from 'uuid';

// Import all product images
import product1 from './product_img1.png';
import product2 from './product_img2.png';
import product3 from './product_img3.png';
import product4 from './product_img4.png';
import product5 from './product_img5.png';
import product6 from './product_img6.png';
import product7 from './product_img7.png';
import product8 from './product_img8.png';
import product9 from './product_img9.png';
import product10 from './product_img10.png';
import product11 from './product_img11.png';
import product12 from './product_img12.png';

// User avatars
import user1 from './profile_pic1.jpg';
import user2 from './profile_pic2.jpg';
import user3 from './profile_pic3.jpg';

// Categories
const categories = [
  { id: 'cat1', name: 'Electronics', slug: 'electronics' },
  { id: 'cat2', name: 'Fashion', slug: 'fashion' },
  { id: 'cat3', name: 'Home & Garden', slug: 'home-garden' },
  { id: 'cat4', name: 'Beauty', slug: 'beauty' },
  { id: 'cat5', name: 'Sports', slug: 'sports' },
  { id: 'cat6', name: 'Books', slug: 'books' },
];

// Users for reviews
const users = [
  { id: 'user1', name: 'Alex Johnson', avatar: user1 },
  { id: 'user2', name: 'Maria Garcia', avatar: user2 },
  { id: 'user3', name: 'James Wilson', avatar: user3 },
  { id: 'user4', name: 'Sarah Lee', avatar: user1 },
  { id: 'user5', name: 'David Kim', avatar: user2 },
];

// Helper function to generate random reviews
const generateReviews = (count, productId) => {
  const reviews = [];
  const reviewTexts = [
    "Great product! Exceeded my expectations.",
    "Good quality for the price. Would recommend.",
    "Fast shipping and excellent packaging.",
    "The product is exactly as described.",
    "I'm very satisfied with my purchase.",
    "Better than I expected. Will buy again!", 
    "Product arrived damaged, but customer service was helpful.",
    "Good value for money. Works as expected.",
    "Amazing quality! Love it!",
    "Not what I expected, but still good."
  ];

  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    reviews.push({
      id: `rev_${uuidv4()}`,
      userId: user.id,
      productId,
      rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
      review: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      },
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  return reviews;
};

// Products data
const products = [
  {
    id: 'prod_1',
    name: 'Modern Table Lamp',
    description: 'Sleek and modern table lamp with adjustable brightness and color temperature. Perfect for any room in your home.',
    price: 89.99,
    mrp: 119.99,
    category: 'Home & Garden',
    categoryId: 'cat3',
    images: [product1, product2],
    inStock: true,
    rating: 4.7,
    reviewCount: 156,
    specifications: {
      color: 'Black',
      connectivity: 'Bluetooth 5.0',
      batteryLife: '30 hours',
      weight: '250g',
      warranty: '1 year'
    },
    features: [
      'Active Noise Cancellation',
      '30-hour battery life',
      'Built-in microphone',
      'Foldable design',
      'Multi-point connectivity'
    ]
  },
  {
    id: 'prod_2',
    name: 'Smart Watch Pro',
    description: 'Advanced smartwatch with health monitoring, GPS, and 7-day battery life. Stay connected and track your fitness goals in style.',
    price: 249.99,
    mrp: 299.99,
    category: 'Electronics',
    categoryId: 'cat1',
    images: [product3, product4],
    inStock: true,
    rating: 4.5,
    reviewCount: 243,
    specifications: {
      color: 'Midnight Black',
      display: '1.4" AMOLED',
      batteryLife: '7 days',
      waterResistance: '5 ATM',
      compatibility: 'iOS & Android'
    }
  },
  {
    id: 'prod_3',
    name: 'Leather Wallet',
    description: 'Genuine leather wallet with multiple card slots and RFID protection. Slim design that fits perfectly in your pocket.',
    price: 39.99,
    mrp: 59.99,
    category: 'Fashion',
    categoryId: 'cat2',
    images: [product5, product6],
    inStock: true,
    rating: 4.4,
    reviewCount: 76,
    specifications: {
      capacity: '12 cups',
      material: 'Stainless Steel',
      power: '1200W',
      dimensions: '14.5 x 8 x 11.5 inches',
      warranty: '2 years'
    }
  },
  {
    id: 'prod_4',
    name: 'Smart Pencil',
    description: 'Precision smart pencil with tilt and pressure sensitivity, perfect for digital artists and note-takers.',
    price: 129.99,
    mrp: 149.99,
    category: 'Electronics',
    categoryId: 'cat1',
    images: [product7, product8],
    inStock: true,
    rating: 4.7,
    reviewCount: 189,
    specifications: {
      material: 'Eco-friendly TPE',
      thickness: '6mm',
      dimensions: '72 x 24 inches',
      weight: '2.5 lbs',
      color: 'Lavender'
    }
  },
  {
    id: 'prod_5',
    name: 'Wireless Earbuds',
    description: 'True wireless earbuds with active noise cancellation, 30-hour battery life, and crystal clear sound quality.',
    price: 129.99,
    mrp: 159.99,
    category: 'Electronics',
    categoryId: 'cat1',
    images: [product9, product10],
    inStock: true,
    rating: 4.6,
    reviewCount: 312,
    specifications: {
      material: 'Genuine Leather',
      color: 'Brown',
      slots: '8 card slots',
      rfidProtection: 'Yes',
      dimensions: '4.1 x 3.1 x 0.4 inches'
    }
  }
];

// Generate reviews for all products
const allReviews = [];
products.forEach(product => {
  const reviews = generateReviews(Math.floor(Math.random() * 10) + 5, product.id);
  allReviews.push(...reviews);
});

// Calculate average ratings and review counts
const productsWithReviews = products.map(product => {
  const productReviews = allReviews.filter(r => r.productId === product.id);
  const avgRating = productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length || 0;
  
  return {
    ...product,
    rating: parseFloat(avgRating.toFixed(1)),
    reviewCount: productReviews.length,
    reviews: productReviews
  };
});

// Export all data
export const dummyData = {
  products: productsWithReviews,
  categories,
  users,
  reviews: allReviews
};

export default dummyData;
