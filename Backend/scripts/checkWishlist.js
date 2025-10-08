const { PrismaClient } = require('@prisma/client');

async function checkWishlist() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Fetching all wishlist entries...');
    const wishlistItems = await prisma.wishlist.findMany({
      include: {
        product: true,
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });
    
    console.log('Wishlist entries:');
    console.log(JSON.stringify(wishlistItems, null, 2));
    
  } catch (error) {
    console.error('Error fetching wishlist:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkWishlist();
