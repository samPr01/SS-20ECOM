import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import connectDB from './config/database.js';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());

// In-memory storage for testing (replace with database in production)
const users = [];
const carts = new Map();
const orders = new Map();
const products = [
  { _id: '1', name: "Wireless Bluetooth Headphones", price: 1299, description: "High-quality wireless headphones with noise cancellation", category: "electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop", stock: 50 },
  { _id: '2', name: "Casual Cotton T-Shirt", price: 599, description: "Comfortable cotton t-shirt for everyday wear", category: "clothing", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop", stock: 100 },
  { _id: '3', name: "Smartphone Case", price: 299, description: "Protective case for your smartphone", category: "electronics", image: "https://images.unsplash.com/photo-1603313011108-4f2d0b3b0b0b?w=300&h=300&fit=crop", stock: 75 },
  { _id: '4', name: "Running Shoes", price: 2499, description: "Comfortable running shoes for athletes", category: "sports", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop", stock: 30 },
  { _id: '5', name: "Kitchen Mixer", price: 3999, description: "Professional kitchen mixer for baking", category: "home", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop", stock: 20 },
  { _id: '6', name: "Facial Cream", price: 899, description: "Moisturizing facial cream for all skin types", category: "beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop", stock: 60 },
  { _id: '7', name: "Silver Necklace", price: 1499, description: "Elegant silver necklace for women", category: "jewellery", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop", stock: 25 },
  { _id: '8', name: "Leather Handbag", price: 1999, description: "Stylish leather handbag for women", category: "bags", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop", stock: 40 }
];

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'ge44g2n3mkCgE2yNKUG5sLseT0xkdxhjVZJzmLro0n0=';

// Initialize Razorpay conditionally (use environment variable in production)
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: "ok",
    message: "Server is running!",
    timestamp: new Date().toISOString()
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: "Test route working!",
    status: "ok"
  });
});

// Authentication routes
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password // In production, hash the password
    };
    
    users.push(newUser);
    
    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/api/auth/signup', (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password // In production, hash the password
    };
    
    users.push(newUser);
    
    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Products route (fallback for when MongoDB is not connected)
app.get('/api/products', (req, res) => {
  res.json({
    products: products,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalProducts: products.length,
      hasNextPage: false,
      hasPrevPage: false
    }
  });
});

// Mount routes
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

// Cart routes (protected)
app.get('/api/cart', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userCart = carts.get(decoded.userId) || { items: [], total: 0 };
    res.json({ cart: userCart });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.post('/api/cart', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { productId, quantity } = req.body;
    
    const product = products.find(p => p._id === productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    let userCart = carts.get(decoded.userId) || { items: [], total: 0 };
    
    // Add item to cart
    const existingItem = userCart.items.find(item => item.productId._id === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      userCart.items.push({
        _id: Date.now().toString(),
        productId: product,
        quantity
      });
    }
    
    // Calculate total
    userCart.total = userCart.items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);
    
    carts.set(decoded.userId, userCart);
    
    res.json({ message: 'Item added to cart', cart: userCart });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.delete('/api/cart/:itemId', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { itemId } = req.params;
    
    let userCart = carts.get(decoded.userId) || { items: [], total: 0 };
    userCart.items = userCart.items.filter(item => item._id !== itemId);
    userCart.total = userCart.items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);
    
    carts.set(decoded.userId, userCart);
    
    res.json({ message: 'Item removed from cart', cart: userCart });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Razorpay Order creation
app.post('/api/payment/create-order', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { amount, currency = 'INR' } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount provided' });
    }
    
    // Check if Razorpay is configured
    if (!razorpay) {
      // Return mock order for testing
      const mockOrder = {
        id: 'order_' + Date.now(),
        amount: amount * 100, // Convert to paise
        currency: currency,
        key: 'rzp_test_XXXXXXXXXXXX'
      };
      console.log('⚠️ Razorpay not configured - returning mock order for testing');
      return res.json(mockOrder);
    }
    
    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: currency,
      receipt: 'order_' + Date.now(),
      notes: {
        userId: decoded.userId.toString(),
      },
    });
    
    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// Razorpay Payment verification
app.post('/api/payment/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment verification parameters' });
    }
    
    // Check if Razorpay is configured
    if (!razorpay || !process.env.RAZORPAY_KEY_SECRET) {
      // Mock verification for testing
      console.log('⚠️ Razorpay not configured - returning mock verification success');
      return res.json({ success: true, message: 'Payment verified successfully (mock)' });
    }
    
    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    
    if (expectedSignature === razorpay_signature) {
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
});

// Orders routes
app.post('/api/orders', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { sessionId, items, total, shippingAddress } = req.body;
    
    // Create order
    const order = {
      _id: Date.now().toString(),
      userId: decoded.userId,
      sessionId,
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      total,
      shippingAddress,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };
    
    // Store order
    const userOrders = orders.get(decoded.userId) || [];
    userOrders.push(order);
    orders.set(decoded.userId, userOrders);
    
    // Clear cart after successful order
    carts.set(decoded.userId, { items: [], total: 0 });
    
    res.status(201).json({ 
      message: 'Order created successfully',
      order 
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

app.get('/api/orders', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userOrders = orders.get(decoded.userId) || [];
    
    res.json({ orders: userOrders });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Payment test route (placeholder)
app.get('/api/payment/test', (req, res) => {
  res.json({
    message: "Payment test route working",
    status: "success"
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🧪 Test route: http://localhost:${PORT}/api/test`);
      console.log(`📦 Products: http://localhost:${PORT}/api/products`);
      console.log(`💳 Payment test: http://localhost:${PORT}/api/payment/test`);
      console.log(`🔐 Auth routes: /api/auth/register, /api/auth/signup, /api/auth/login`);
      console.log(`🛒 Cart routes: /api/cart (GET, POST, DELETE)`);
      console.log(`💳 Razorpay: /api/payment/create-order, /api/payment/verify-payment`);
      console.log(`📋 Orders: /api/orders (GET, POST)`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

