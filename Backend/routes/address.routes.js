import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get user's addresses
router.get('/', authenticate, async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: { isDefault: 'desc' },
    });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single address
router.get('/:id', authenticate, async (req, res) => {
  try {
    const address = await prisma.address.findUnique({
      where: { id: req.params.id },
    });

    if (!address || address.userId !== req.user.id) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json(address);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create address
router.post('/', authenticate, async (req, res) => {
  try {
    const { fullName, phone, street, city, state, zipCode, country, isDefault } = req.body;

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: req.user.id,
        fullName,
        phone,
        street,
        city,
        state,
        zipCode,
        country,
        isDefault: isDefault || false,
      },
    });

    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update address
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { fullName, phone, street, city, state, zipCode, country, isDefault } = req.body;

    const existingAddress = await prisma.address.findUnique({
      where: { id: req.params.id },
    });

    if (!existingAddress || existingAddress.userId !== req.user.id) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id, isDefault: true, id: { not: req.params.id } },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id: req.params.id },
      data: {
        fullName,
        phone,
        street,
        city,
        state,
        zipCode,
        country,
        isDefault,
      },
    });

    res.json(address);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete address
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const address = await prisma.address.findUnique({
      where: { id: req.params.id },
    });

    if (!address || address.userId !== req.user.id) {
      return res.status(404).json({ error: 'Address not found' });
    }

    await prisma.address.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
