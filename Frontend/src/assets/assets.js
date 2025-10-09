import gs_logo from "./gs_logo.jpg";
import happy_store from "./happy_store.webp";
import upload_area from "./upload_area.svg";
import hero_model_img from "./hero_model_img.png";
import hero_product_img1 from "./hero_product_img1.png";
import hero_product_img2 from "./hero_product_img2.png";
import product_img1 from "./product_img1.png";
import product_img2 from "./product_img2.png";
import product_img3 from "./product_img3.png";
import product_img4 from "./product_img4.png";
import product_img5 from "./product_img5.png";
import product_img6 from "./product_img6.png";
import product_img7 from "./product_img7.png";
import product_img8 from "./product_img8.png";
import product_img9 from "./product_img9.png";
import product_img10 from "./product_img10.png";
import product_img11 from "./product_img11.png";
import product_img12 from "./product_img12.png";
import { Clock, Headphones, Send } from "lucide-react";
import profile_pic1 from "./profile_pic1.jpg";
import profile_pic2 from "./profile_pic2.jpg";
import profile_pic3 from "./profile_pic3.jpg";

export const assets = {
  upload_area,
  hero_model_img,
  hero_product_img1,
  hero_product_img2,
  gs_logo,
  product_img1,
  product_img2,
  product_img3,
  product_img4,
  product_img5,
  product_img6,
  product_img7,
  product_img8,
  product_img9,
  product_img10,
  product_img11,
  product_img12,
};

export const categories = [
  "Electronics",
  "Fashion",
  "Home & Garden"
];

/**
 * Get default product image based on category
 * @param {string} categoryName - The category name
 * @returns {string} - Default image URL or placeholder
 */
export const getDefaultProductImage = (categoryName) => {
  // You can replace these with actual default images or a placeholder service
  const defaultImages = {
    'Electronics': 'https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=Electronics',
    'Clothing': 'https://via.placeholder.com/300x300/E11D48/FFFFFF?text=Clothing',
    'Home': 'https://via.placeholder.com/300x300/059669/FFFFFF?text=Home',
    'Books': 'https://via.placeholder.com/300x300/7C3AED/FFFFFF?text=Books',
    'Sports': 'https://via.placeholder.com/300x300/DC2626/FFFFFF?text=Sports',
    'Beauty': 'https://via.placeholder.com/300x300/EC4899/FFFFFF?text=Beauty',
    'default': 'https://via.placeholder.com/300x300/6B7280/FFFFFF?text=Product'
  };

  if (categoryName && defaultImages[categoryName]) {
    return defaultImages[categoryName];
  }

  return defaultImages.default;
};

/**
 * Get placeholder image for any size
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} text - Text to display
 * @returns {string} - Placeholder image URL
 */
export const getPlaceholderImage = (width = 300, height = 300, text = 'Image') => {
  return `https://via.placeholder.com/${width}x${height}/6B7280/FFFFFF?text=${encodeURIComponent(text)}`;
};

export const dummyRatingsData = [
  {
    id: "rat_1",
    rating: 4.2,
    review: "I was a bit skeptical at first, but this product turned out to be even better than I imagined. The quality feels premium, it's easy to use, and it delivers exactly what was promised. I've already recommended it to friends and will definitely purchase again in the future.",
    user: { name: 'Kristin Watson', image: profile_pic1 },
    productId: "prod_1",
    createdAt: '2025-07-19T14:51:25+05:30',
    updatedAt: '2025-07-19T14:51:25+05:30',
    product: { name: 'Bluetooth Speakers', category: 'Electronics', id: 'prod_1' }
  },
  // ... other rating objects
];

export const dummyStoreData = {
  id: "store_1",
  userId: "user_1",
  name: "Happy Shop",
  description: "At Happy Shop, we believe shopping should be simple, smart, and satisfying. Whether you're hunting for the latest fashion trends, top-notch electronics, home essentials, or unique lifestyle products — we've got it all under one digital roof.",
  username: "happyshop",
  address: "3rd Floor, Happy Shop, New Building, 123 street, c sector, NY, US",
  status: "approved",
  isActive: true,
  logo: happy_store,
  email: "happyshop@example.com",
  contact: "+0 1234567890",
  createdAt: "2025-09-04T09:04:16.189Z",
  updatedAt: "2025-09-04T09:04:44.273Z",
  user: {
    id: "user_31dOriXqC4TATvc0brIhlYbwwc5",
    name: "Great Stack",
    email: "user.greatstack@gmail.com",
    image: gs_logo,
  }
};

export const productDummyData = [
  {
    id: "prod_1",
    name: "Modern table lamp",
    description: "Modern table lamp with a sleek design. It's perfect for any room. It's made of high-quality materials and comes with a lifetime warranty. Enhance your audio experience with this earbuds.",
    mrp: 40,
    price: 29,
    images: [product_img1, product_img2, product_img3, product_img4],
    category: "Decoration",
    storeId: "seller_1",
    inStock: true,
    store: dummyStoreData,
    rating: dummyRatingsData,
    createdAt: '2025-07-29T14:51:25+05:30',
    updatedAt: '2025-07-29T14:51:25+05:30',
  },
  // ... other product objects
];

export const ourSpecsData = [
  { 
    title: "Free Shipping", 
    description: "Enjoy fast, free delivery on every order no conditions, just reliable doorstep.", 
    icon: Send, 
    accent: '#05DF72' 
  },
  { 
    title: "7 Days easy Return", 
    description: "Change your mind? No worries. Return any item within 7 days.", 
    icon: Clock, 
    accent: '#FF8904' 
  },
  { 
    title: "24/7 Customer Support", 
    description: "We're here for you. Get expert help with our customer support.", 
    icon: Headphones, 
    accent: '#A684FF' 
  }
];

export const addressDummyData = {
  id: "addr_1",
  userId: "user_1",
  name: "John Doe",
  email: "johndoe@example.com",
  street: "123 Main St",
  city: "New York",
  state: "NY",
  zip: "10001",
  country: "USA",
  phone: "1234567890",
  createdAt: '2025-07-19T14:51:25+05:30',
};

export const couponDummyData = [
  { 
    code: "NEW20", 
    description: "20% Off for New Users", 
    discount: 20, 
    forNewUser: true, 
    forMember: false, 
    isPublic: false, 
    expiresAt: "2026-12-31T00:00:00.000Z", 
    createdAt: "2025-08-22T08:35:31.183Z" 
  },
  // ... other coupon objects
];

export const dummyUserData = {
  id: "user_31dQbH27HVtovbs13X2cmqefddM",
  name: "GreatStack",
  email: "greatstack@example.com",
  image: gs_logo,
  cart: {}
};

export const orderDummyData = [
  {
    id: "cmemm75h5001jtat89016h1p3",
    total: 214.2,
    status: "DELIVERED",
    userId: "user_31dQbH27HVtovbs13X2cmqefddM",
    storeId: "cmemkqnzm000htat8u7n8cpte",
    addressId: "cmemm6g95001ftat8omv9b883",
    isPaid: false,
    paymentMethod: "COD",
    createdAt: "2025-08-22T09:15:03.929Z",
    updatedAt: "2025-08-22T09:15:50.723Z",
    isCouponUsed: true,
    coupon: dummyRatingsData[2],
    orderItems: [
      { 
        orderId: "cmemm75h5001jtat89016h1p3", 
        productId: "cmemlydnx0017tat8h3rg92hz", 
        quantity: 1, 
        price: 89, 
        product: productDummyData[0] 
      },
      // ... other order items
    ],
    address: addressDummyData,
    user: dummyUserData
  },
  // ... other order objects
];

export const storesDummyData = [
  {
    id: "cmemkb98v0001tat8r1hiyxhn",
    userId: "user_31dOriXqC4TATvc0brIhlYbwwc5",
    name: "GreatStack",
    description: "GreatStack is the education marketplace where you can buy goodies related to coding and tech",
    username: "greatstack",
    address: "123 Maplewood Drive Springfield, IL 62704 USA",
    status: "approved",
    isActive: true,
    logo: gs_logo,
    email: "greatstack@example.com",
    contact: "+0 1234567890",
    createdAt: "2025-08-22T08:22:16.189Z",
    updatedAt: "2025-08-22T08:22:44.273Z",
    user: dummyUserData,
  },
  // ... other store objects
];

export const dummyAdminDashboardData = {
  "orders": 6,
  "stores": 2,
  "products": 12,
  "revenue": "959.10",
  "allOrders": [
    { "createdAt": "2025-08-20T08:46:58.239Z", "total": 145.6 },
    // ... other order entries
  ]
};

export const dummyStoreDashboardData = {
  "ratings": dummyRatingsData,
  "totalOrders": 2,
  "totalEarnings": 636,
  "totalProducts": 5
};
