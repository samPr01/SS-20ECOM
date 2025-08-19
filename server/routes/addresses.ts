import { Router } from 'express';
import { prisma } from '../../lib/prisma';

const router = Router();

// Get all addresses for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ addresses });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new address
router.post('/', async (req, res) => {
  try {
    const { userId, label, line1, line2, city, state, country, zipCode, isDefault } = req.body;

    // If this is the default address, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        label,
        line1,
        line2,
        city,
        state,
        country,
        zipCode,
        isDefault: isDefault || false,
      }
    });

    res.status(201).json({ address });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an address
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { label, line1, line2, city, state, country, zipCode, isDefault } = req.body;

    // If this is being set as default, unset other defaults
    if (isDefault) {
      const address = await prisma.address.findUnique({
        where: { id }
      });
      
      if (address) {
        await prisma.address.updateMany({
          where: { 
            userId: address.userId,
            id: { not: id }
          },
          data: { isDefault: false }
        });
      }
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        label,
        line1,
        line2,
        city,
        state,
        country,
        zipCode,
        isDefault,
      }
    });

    res.json({ address });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an address
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.address.delete({
      where: { id }
    });

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Get all addresses
router.get('/', async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ addresses });
  } catch (error) {
    console.error('Get all addresses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
