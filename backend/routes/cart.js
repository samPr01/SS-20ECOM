import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateCartItem } from '../middleware/validation.js';

const router = express.Router();

// GET /api/cart - Get user's cart
router.get('/', authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id })
      .populate('items.productId', 'name price image stock');

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
      await cart.save();
    }

    // Format cart items with product details
    const formattedItems = cart.items.map(item => ({
      _id: item._id,
      productId: item.productId,
      quantity: item.quantity,
      product: item.productId
    }));

    res.json({
      cart: {
        _id: cart._id,
        userId: cart.userId,
        items: formattedItems,
        total: cart.total,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      message: 'Error fetching cart' 
    });
  }
});

// POST /api/cart - Add item to cart
router.post('/', authMiddleware, validateCartItem, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ 
        message: 'Product not found or not available' 
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({ 
        message: 'Insufficient stock available' 
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    // Add item to cart
    await cart.addItem(productId, quantity);

    // Populate product details
    await cart.populate('items.productId', 'name price image stock');

    res.json({
      message: 'Item added to cart successfully',
      cart: {
        _id: cart._id,
        userId: cart.userId,
        items: cart.items.map(item => ({
          _id: item._id,
          productId: item.productId,
          quantity: item.quantity,
          product: item.productId
        })),
        total: cart.total
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      message: 'Error adding item to cart' 
    });
  }
});

// PUT /api/cart/:productId - Update item quantity
router.put('/:productId', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ 
        message: 'Quantity must be at least 1' 
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ 
        message: 'Product not found or not available' 
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({ 
        message: 'Insufficient stock available' 
      });
    }

    // Find cart
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ 
        message: 'Cart not found' 
      });
    }

    // Update quantity
    await cart.updateQuantity(productId, quantity);

    // Populate product details
    await cart.populate('items.productId', 'name price image stock');

    res.json({
      message: 'Cart updated successfully',
      cart: {
        _id: cart._id,
        userId: cart.userId,
        items: cart.items.map(item => ({
          _id: item._id,
          productId: item.productId,
          quantity: item.quantity,
          product: item.productId
        })),
        total: cart.total
      }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    if (error.message === 'Item not found in cart') {
      return res.status(404).json({ 
        message: 'Item not found in cart' 
      });
    }
    res.status(500).json({ 
      message: 'Error updating cart' 
    });
  }
});

// DELETE /api/cart/:productId - Remove item from cart
router.delete('/:productId', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;

    // Find cart
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ 
        message: 'Cart not found' 
      });
    }

    // Remove item
    await cart.removeItem(productId);

    res.json({
      message: 'Item removed from cart successfully',
      cart: {
        _id: cart._id,
        userId: cart.userId,
        items: cart.items,
        total: cart.total
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ 
      message: 'Error removing item from cart' 
    });
  }
});

// DELETE /api/cart - Clear entire cart
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ 
        message: 'Cart not found' 
      });
    }

    await cart.clearCart();

    res.json({
      message: 'Cart cleared successfully',
      cart: {
        _id: cart._id,
        userId: cart.userId,
        items: [],
        total: 0
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ 
      message: 'Error clearing cart' 
    });
  }
});

export default router;
