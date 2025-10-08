import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data in the correct order to avoid foreign key constraint errors
    console.log('🧹 Clearing existing data...');
    await prisma.review.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.address.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✅ Database cleared');

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
      },
    });
    console.log('👨‍💼 Admin user created');

    // Create regular users
    const users = [admin];
    for (let i = 0; i < 10; i++) {
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email().toLowerCase(),
          password: await bcrypt.hash('password123', 10),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
        },
      });
      users.push(user);
    }
    console.log(`👥 Created ${users.length - 1} regular users`);

    // Create categories
    const categoryNames = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Beauty'];
    const categories = [];
    for (const name of categoryNames) {
      const category = await prisma.category.create({
        data: {
          name,
          description: faker.commerce.department() + ' products',
          image: faker.image.urlLoremFlickr({ category: 'technics' }),
        },
      });
      categories.push(category);
    }
    console.log(`🏷️  Created ${categories.length} categories`);

    // Create products
    const products = [];
    for (let i = 0; i < 50; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const product = await prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
          stock: faker.number.int({ min: 0, max: 100 }),
          images: [
            faker.image.urlLoremFlickr({ category: 'product' }),
            faker.image.urlLoremFlickr({ category: 'goods' }),
          ],
          categoryId: category.id,
          featured: faker.datatype.boolean(0.2), // 20% chance of being featured
        },
      });
      products.push(product);
    }
    console.log(`🛍️  Created ${products.length} products`);

    // Create addresses for users
    for (const user of users) {
      await prisma.address.create({
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
    }
    console.log(`🏠 Created addresses for all users`);

    // Create orders
    for (const user of users) {
      const orderCount = faker.number.int({ min: 1, max: 3 });
      for (let i = 0; i < orderCount; i++) {
        const orderProducts = faker.helpers.arrayElements(products, { min: 1, max: 4 });
        const total = orderProducts.reduce((sum, p) => sum + p.price, 0);
        const userAddress = await prisma.address.findFirst({ where: { userId: user.id } });

        if (userAddress) {
            await prisma.order.create({
                data: {
                    userId: user.id,
                    total,
                    status: faker.helpers.arrayElement(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED']),
                    paymentMethod: 'Credit Card',
                    paymentStatus: 'PAID',
                    shippingAddressId: userAddress.id,
                    orderItems: {
                        create: orderProducts.map(p => ({
                            productId: p.id,
                            quantity: faker.number.int({ min: 1, max: 3 }),
                            price: p.price,
                        })),
                    },
                },
            });
        }
      }
    }
    console.log(`📦 Created sample orders`);

    // Create reviews
    const reviewCombinations = new Set();
    for (const product of products) {
      const reviewCount = faker.number.int({ min: 0, max: 5 });
      for (let i = 0; i < reviewCount; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const combination = `${user.id}-${product.id}`;

        if (!reviewCombinations.has(combination)) {
          await prisma.review.create({
            data: {
              userId: user.id,
              productId: product.id,
              rating: faker.number.int({ min: 3, max: 5 }),
              comment: faker.lorem.sentence(),
            },
          });
          reviewCombinations.add(combination);
        }
      }
    }
    console.log(`⭐ Created ${reviewCombinations.size} sample reviews`);

    // Create cart items
    for (const user of users) {
        const cartItemCount = faker.number.int({ min: 0, max: 3 });
        const cartProducts = faker.helpers.arrayElements(products, cartItemCount);
        for (const product of cartProducts) {
            await prisma.cartItem.create({
                data: {
                    userId: user.id,
                    productId: product.id,
                    quantity: faker.number.int({ min: 1, max: 2 }),
                }
            });
        }
    }
    console.log(`🛒 Created sample cart items`);

    console.log('✅ Database seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seedDatabase();
