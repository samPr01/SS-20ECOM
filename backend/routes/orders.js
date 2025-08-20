import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateOrder } from '../middleware/validation.js';

const router = express.Router();

// GET /api/orders - Get user's orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    // Build query
    const query = { userId: req.user._id };
    if (status) {
      query.status = status;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const orders = await Order.find(query)
      .populate('items.productId', 'name image')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination
    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      message: 'Error fetching orders' 
    });
  }
});

// GET /api/orders/:id - Get specific order
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('items.productId', 'name image description');

    if (!order) {
      return res.status(404).json({ 
        message: 'Order not found' 
      });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        message: 'Order not found' 
      });
    }
    res.status(500).json({ 
      message: 'Error fetching order' 
    });
  }
});

// POST /api/orders - Place new order
router.post('/', authMiddleware, validateOrder, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    // Validate items and check stock
    const orderItems = [];
    let total = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product || !product.isActive) {
        return res.status(400).json({ 
          message: `Product ${item.productId} not found or not available` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}` 
        });
      }

      // Calculate item total
      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      // Add to order items
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        name: product.name
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = new Order({
      userId: req.user._id,
      items: orderItems,
      total,
      shippingAddress,
      paymentMethod
    });

    await order.save();

    // Clear user's cart after successful order
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      await cart.clearCart();
    }

    // Populate product details for response
    await order.populate('items.productId', 'name image');

    res.status(201).json({
      message: 'Order placed successfully',
      order: {
        _id: order._id,
        userId: order.userId,
        items: order.items.map(item => ({
          _id: item._id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          product: item.productId
        })),
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ 
      message: 'Error placing order' 
    });
  }
});

// POST /api/orders/from-cart - Place order from cart
router.post('/from-cart', authMiddleware, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user._id })
      .populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ 
        message: 'Cart is empty' 
      });
    }

    // Validate items and check stock
    const orderItems = [];
    let total = 0;

    for (const item of cart.items) {
      const product = item.productId;
      
      if (!product || !product.isActive) {
        return res.status(400).json({ 
          message: `Product ${product._id} not found or not available` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}` 
        });
      }

      // Calculate item total
      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      // Add to order items
      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
        name: product.name
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = new Order({
      userId: req.user._id,
      items: orderItems,
      total,
      shippingAddress,
      paymentMethod
    });

    await order.save();

    // Clear user's cart after successful order
    await cart.clearCart();

    // Populate product details for response
    await order.populate('items.productId', 'name image');

    res.status(201).json({
      message: 'Order placed successfully from cart',
      order: {
        _id: order._id,
        userId: order.userId,
        items: order.items.map(item => ({
          _id: item._id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          product: item.productId
        })),
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    console.error('Place order from cart error:', error);
    res.status(500).json({ 
      message: 'Error placing order from cart' 
    });
  }
});

// PUT /api/orders/:id/cancel - Cancel order
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!order) {
      return res.status(404).json({ 
        message: 'Order not found' 
      });
    }

    // Only allow cancellation of pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Only pending orders can be cancelled' 
      });
    }

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    // Update order status
    order.status = 'cancelled';
    await order.save();

    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ 
      message: 'Error cancelling order' 
    });
  }
});

export default router;
