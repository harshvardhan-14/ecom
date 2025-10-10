import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Helper function to generate random date within last 30 days
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate random rating between 3.5 and 5 with one decimal place
const randomRating = () => (Math.floor(Math.random() * 15 + 35) / 10).toFixed(1);

// Generate random review count
const randomReviewCount = () => Math.floor(Math.random() * 200) + 10;

// Generate dummy data
const seedDatabase = async () => {
  console.log('🌱 Starting database seeding...');
  
  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.$transaction([
    prisma.review.deleteMany({}),
    prisma.wishlist.deleteMany({}),
    prisma.cartItem.deleteMany({}),
    prisma.orderItem.deleteMany({}),
    prisma.order.deleteMany({}),
    prisma.address.deleteMany({}),
    prisma.product.deleteMany({}),
    prisma.category.deleteMany({}),
    prisma.user.deleteMany({}),
  ]);
  console.log('✅ Database cleared');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });
  console.log('👨‍💼 Admin user created');

  // Create regular users
  const users = [];
  for (let i = 0; i < 10; i++) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        email: `user${i + 1}@example.com`,
        password: hashedPassword,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      },
    });
    users.push(user);
  }
  console.log(`👥 Created ${users.length} regular users`);

  // Create categories that match frontend
  const categories = [
    { id: 'cat1', name: 'Electronics', description: 'Latest electronic gadgets and devices' },
    { id: 'cat2', name: 'Fashion', description: 'Trendy clothing and accessories' },
    { id: 'cat3', name: 'Home & Garden', description: 'Everything for your home' },
  ];

  const createdCategories = [];
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: {
        id: category.id,
        name: category.name,
        description: category.description,
        image: `/assets/categories/${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}.jpg`,
      },
    });
    createdCategories.push(created);
  }
  console.log(`🏷️  Created ${createdCategories.length} categories`);

  // Create products that match frontend structure
  // Using placeholder images that will work
  const products = [
    {
      id: 'prod_1',
      name: 'Modern Table Lamp',
      description: 'Sleek and modern table lamp with adjustable brightness and color temperature. Perfect for any room in your home.',
      price: 89.99,
      categoryId: 'cat3', // Home & Garden
      images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400'],
      stock: 100,
      featured: true
    },
    {
      id: 'prod_2',
      name: 'Smart Watch Pro',
      description: 'Advanced smartwatch with health monitoring, GPS, and 7-day battery life. Stay connected and track your fitness goals in style.',
      price: 249.99,
      categoryId: 'cat1', // Electronics
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400'],
      stock: 100,
      featured: true
    },
    {
      id: 'prod_3',
      name: 'Wireless Earbuds Pro',
      description: 'High-quality wireless earbuds with active noise cancellation and crystal clear sound quality.',
      price: 149.99,
      categoryId: 'cat1', // Electronics
      images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400'],
      stock: 100,
      featured: true
    },
    {
      id: 'prod_4',
      name: 'Smart Pencil',
      description: 'Digital smart pencil with pressure sensitivity and tilt recognition. Perfect for artists and designers.',
      price: 129.99,
      categoryId: 'cat1', // Electronics
      images: ['https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400', 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400'],
      stock: 100,
      featured: true
    },
    {
      id: 'prod_5',
      name: 'Bluetooth Speaker',
      description: 'Portable Bluetooth speaker with 360-degree sound and 12-hour battery life. Waterproof and durable.',
      price: 79.99,
      categoryId: 'cat1', // Electronics
      images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400'],
      stock: 100,
      featured: false
    },
    {
      id: 'prod_6',
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with precision tracking and long battery life. Perfect for work and gaming.',
      price: 39.99,
      categoryId: 'cat1', // Electronics
      images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400'],
      stock: 100,
      featured: false
    },
    {
      id: 'prod_7',
      name: 'Designer Sunglasses',
      description: 'Stylish designer sunglasses with UV protection. Perfect for any occasion.',
      price: 159.99,
      categoryId: 'cat2', // Fashion
      images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400'],
      stock: 100,
      featured: true
    },
    {
      id: 'prod_8',
      name: 'Leather Wallet',
      description: 'Premium leather wallet with multiple card slots and RFID protection.',
      price: 49.99,
      categoryId: 'cat2', // Fashion
      images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=400', 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400'],
      stock: 100,
      featured: false
    },
    {
      id: 'prod_9',
      name: 'Decorative Vase',
      description: 'Elegant ceramic vase perfect for home decoration. Modern minimalist design.',
      price: 34.99,
      categoryId: 'cat3', // Home & Garden
      images: ['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400', 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400'],
      stock: 100,
      featured: false
    },
    {
      id: 'prod_10',
      name: 'Wall Clock',
      description: 'Modern wall clock with silent movement. Perfect for any room.',
      price: 29.99,
      categoryId: 'cat3', // Home & Garden
      images: ['https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400', 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=400'],
      stock: 100,
      featured: false
    },
  ];

  const createdProducts = [];
  for (const product of products) {
    const category = createdCategories.find(c => c.id === product.categoryId);
    if (!category) {
      console.warn(`Category not found for product: ${product.name}`);
      continue;
    }

    try {
      const created = await prisma.product.upsert({
        where: { id: product.id },
        update: {},
        create: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          images: product.images,
          featured: product.featured,
          category: {
            connect: { id: category.id },
          },
        },
      });
      createdProducts.push(created);
    } catch (error) {
      console.error(`Error creating product ${product.name}:`, error);
    }
  }
  console.log(`🛍️  Created ${createdProducts.length} products`);

  // Create addresses for users
  const addresses = [];
  for (const user of [...users, admin]) {
    const address = await prisma.address.create({
      data: {
        userId: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        phone: faker.phone.number(),
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country(),
        isDefault: true,
      },
    });
    addresses.push(address);
  }
  console.log(`🏠 Created ${addresses.length} addresses`);

  // Create orders
  const orders = [];
  for (let i = 0; i < 15; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const address = addresses.find(a => a.userId === user.id) || addresses[0];
    const orderDate = randomDate(new Date(2023, 0, 1), new Date());
    
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: 0, // Will be updated after order items are created
        status: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'][
          Math.floor(Math.random() * 5)
        ],
        paymentMethod: ['Credit Card', 'PayPal', 'Bank Transfer'][
          Math.floor(Math.random() * 3)
        ],
        paymentStatus: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'][
          Math.floor(Math.random() * 4)
        ],
        shippingAddressId: address.id,
        createdAt: orderDate,
        updatedAt: orderDate,
      },
    });
    orders.push(order);
  }
  console.log(`📦 Created ${orders.length} orders`);

  // Create order items
  let orderItems = [];
  for (const order of orders) {
    const itemCount = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
    let orderTotal = 0;
    
    for (let i = 0; i < itemCount; i++) {
      const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
      const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 quantity per item
      const price = product.price * quantity;
      orderTotal += price;
      
      const orderItem = await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity,
          price: product.price,
        },
      });
      orderItems.push(orderItem);
    }
    
    // Update order total
    await prisma.order.update({
      where: { id: order.id },
      data: { total: orderTotal },
    });
  }
  console.log(`🛒 Created ${orderItems.length} order items`);

  // Create reviews (commented out to avoid duplicate errors)
  const reviews = [];
  /* for (const product of createdProducts) {
    const reviewCount = Math.floor(Math.random() * 5) + 1; // 1-5 reviews per product
    
    for (let i = 0; i < reviewCount; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const review = await prisma.review.create({
        data: {
          userId: user.id,
          productId: product.id,
          rating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
          comment: [
            'Great product, highly recommend!',
            'Good quality for the price.',
            'Exactly as described, very satisfied.',
            'Fast shipping and well packaged.',
            'Would buy again!',
            'Not bad, but could be better.',
            'Excellent product, exceeded my expectations.',
          ][Math.floor(Math.random() * 7)],
        },
      });
      reviews.push(review);
    }
  } */
  console.log(`⭐ Created ${reviews.length} reviews (skipped)`);

  // Create wishlist items
  const wishlistItems = [];
  for (const user of users) {
    const itemCount = Math.floor(Math.random() * 4); // 0-3 items per user
    
    for (let i = 0; i < itemCount; i++) {
      const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
      
      // Check if already in wishlist
      const exists = wishlistItems.some(
        item => item.userId === user.id && item.productId === product.id
      );
      
      if (!exists) {
        const wishlistItem = await prisma.wishlist.create({
          data: {
            userId: user.id,
            productId: product.id,
          },
        });
        wishlistItems.push(wishlistItem);
      }
    }
  }
  console.log(`❤️  Created ${wishlistItems.length} wishlist items`);

  // Create cart items
  const cartItems = [];
  for (const user of users) {
    const itemCount = Math.floor(Math.random() * 4); // 0-3 items per user
    
    for (let i = 0; i < itemCount; i++) {
      const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
      const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 quantity
      
      // Check if already in cart
      const exists = cartItems.some(
        item => item.userId === user.id && item.productId === product.id
      );
      
      if (!exists) {
        const cartItem = await prisma.cartItem.create({
          data: {
            userId: user.id,
            productId: product.id,
            quantity,
          },
        });
        cartItems.push(cartItem);
      }
    }
  }
  console.log(`🛒 Created ${cartItems.length} cart items`);

  console.log('✅ Database seeded successfully!');
};

// Run the seed function and handle any errors
seedDatabase()
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
