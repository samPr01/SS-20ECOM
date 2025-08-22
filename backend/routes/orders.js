import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { authMiddleware, simpleAdminMiddleware } from '../middleware/auth.js';
import { validateOrder, validateOrderStatusUpdate } from '../middleware/validation.js';
import { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } from '../utils/mailer.js';

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

    // Send order confirmation email
    try {
      const user = await User.findById(req.user._id);
      if (user && user.email) {
        await sendOrderConfirmationEmail(user.email, order);
        console.log('✅ Order confirmation email sent to:', user.email);
      }
    } catch (emailError) {
      console.error('❌ Failed to send order confirmation email:', emailError.message);
      // Don't fail the order creation if email fails
    }

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
        statusHistory: order.getStatusHistory(),
        currentStatus: order.getCurrentStatus(),
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

    // Send order confirmation email
    try {
      const user = await User.findById(req.user._id);
      if (user && user.email) {
        await sendOrderConfirmationEmail(user.email, order);
        console.log('✅ Order confirmation email sent to:', user.email);
      }
    } catch (emailError) {
      console.error('❌ Failed to send order confirmation email:', emailError.message);
      // Don't fail the order creation if email fails
    }

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
        statusHistory: order.getStatusHistory(),
        currentStatus: order.getCurrentStatus(),
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

    // Update order status with history tracking
    await order.updateStatus('cancelled', req.user.name || req.user.email, 'Order cancelled by user');

    res.json({
      message: 'Order cancelled successfully',
      order: {
        _id: order._id,
        status: order.status,
        statusHistory: order.getStatusHistory()
      }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ 
      message: 'Error cancelling order' 
    });
  }
});

// PUT /api/orders/:id/status - Update order status (Admin only)
router.put('/:id/status', simpleAdminMiddleware, validateOrderStatusUpdate, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ 
        message: 'Order not found' 
      });
    }

    // Validate status transition
    const validTransitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['processing', 'cancelled'],
      'processing': ['shipped', 'cancelled'],
      'shipped': ['delivered'],
      'delivered': [],
      'cancelled': []
    };

    const currentStatus = order.status;
    const allowedTransitions = validTransitions[currentStatus] || [];

    if (!allowedTransitions.includes(status)) {
      return res.status(400).json({
        message: `Invalid status transition from '${currentStatus}' to '${status}'. Allowed transitions: ${allowedTransitions.join(', ')}`
      });
    }

    // Update order status with history tracking
    await order.updateStatus(status, req.user.name || req.user.email, notes || '');

    // Send order status update email
    try {
      const user = await User.findById(order.userId);
      if (user && user.email) {
        await sendOrderStatusUpdateEmail(user.email, order, status);
        console.log('✅ Order status update email sent to:', user.email);
      }
    } catch (emailError) {
      console.error('❌ Failed to send order status update email:', emailError.message);
      // Don't fail the status update if email fails
    }

    // Populate product details for response
    await order.populate('items.productId', 'name image');

    res.json({
      message: 'Order status updated successfully',
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
        statusHistory: order.getStatusHistory(),
        currentStatus: order.getCurrentStatus(),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      message: 'Error updating order status' 
    });
  }
});

// GET /api/orders/statuses/all - Get all available order statuses
router.get('/statuses/all', authMiddleware, async (req, res) => {
  try {
    const statuses = [
      { value: 'pending', label: 'Pending', description: 'Order is waiting for confirmation' },
      { value: 'confirmed', label: 'Confirmed', description: 'Order has been confirmed' },
      { value: 'processing', label: 'Processing', description: 'Order is being prepared' },
      { value: 'shipped', label: 'Shipped', description: 'Order has been shipped' },
      { value: 'delivered', label: 'Delivered', description: 'Order has been delivered' },
      { value: 'cancelled', label: 'Cancelled', description: 'Order has been cancelled' }
    ];

    res.json({
      statuses,
      validTransitions: {
        'pending': ['confirmed', 'cancelled'],
        'confirmed': ['processing', 'cancelled'],
        'processing': ['shipped', 'cancelled'],
        'shipped': ['delivered'],
        'delivered': [],
        'cancelled': []
      }
    });
  } catch (error) {
    console.error('Get order statuses error:', error);
    res.status(500).json({ 
      message: 'Error fetching order statuses' 
    });
  }
});

// GET /api/orders/:id/status - Get order status and history
router.get('/:id/status', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('items.productId', 'name image');

    if (!order) {
      return res.status(404).json({ 
        message: 'Order not found' 
      });
    }

    res.json({
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
        statusHistory: order.getStatusHistory(),
        currentStatus: order.getCurrentStatus(),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    });
  } catch (error) {
    console.error('Get order status error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        message: 'Order not found' 
      });
    }
    res.status(500).json({ 
      message: 'Error fetching order status' 
    });
  }
});

export default router;
