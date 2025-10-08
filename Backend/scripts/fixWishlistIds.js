const { PrismaClient } = require('@prisma/client');

async function fixWishlistIds() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Fetching all wishlist entries...');
    const wishlistItems = await prisma.wishlist.findMany({
      include: {
        product: true
      }
    });

    console.log(`Found ${wishlistItems.length} wishlist entries`);
    
    let updatedCount = 0;
    
    for (const item of wishlistItems) {
      // Check if productId has 'prod_' prefix but the product exists without it
      if (item.productId.startsWith('prod_')) {
        const cleanProductId = item.productId.replace('prod_', '');
        
        // Check if the product exists with the clean ID
        const product = await prisma.product.findUnique({
          where: { id: cleanProductId }
        });
        
        if (product) {
          console.log(`Updating wishlist item ${item.id}: ${item.productId} -> ${cleanProductId}`);
          
          // Update the wishlist item with the clean product ID
          await prisma.wishlist.update({
            where: { id: item.id },
            data: { productId: cleanProductId }
          });
          
          updatedCount++;
        } else {
          console.log(`Product with ID ${cleanProductId} not found, keeping original ID`);
        }
      }
    }
    
    console.log(`\nFixed ${updatedCount} wishlist entries`);
    
  } catch (error) {
    console.error('Error fixing wishlist entries:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixWishlistIds();
