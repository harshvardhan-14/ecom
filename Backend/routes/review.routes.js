import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: req.params.productId },
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create review
router.post('/', authenticate, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Check if user has purchased the product
    const order = await prisma.order.findFirst({
      where: {
        userId: req.user.id,
        status: 'DELIVERED',
        orderItems: {
          some: { productId },
        },
      },
    });

    if (!order) {
      return res.status(400).json({
        error: 'You can only review products you have purchased',
      });
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId,
        },
      },
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        productId,
        rating: parseInt(rating),
        comment,
      },
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update review
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const existingReview = await prisma.review.findUnique({
      where: { id: req.params.id },
    });

    if (!existingReview || existingReview.userId !== req.user.id) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { rating: parseInt(rating), comment },
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete review
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: req.params.id },
    });

    if (!review || review.userId !== req.user.id) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await prisma.review.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
