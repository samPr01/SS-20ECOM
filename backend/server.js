import express from 'express';
import jwt from 'jsonwebtoken';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import connectDB from './config/database.js';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/auth.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import { 
  securityHeaders, 
  corsConfig, 
  generalRateLimit,
  authRateLimit,
  passwordResetRateLimit,
  orderRateLimit,
  sanitizeRequest,
  securityLogger,
  validateContentType
} from './middleware/security.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware (order is important)
app.use(securityLogger); // Log all requests for security monitoring
app.use(securityHeaders); // Apply security headers
app.use(corsConfig); // CORS configuration
app.use(generalRateLimit); // General rate limiting
app.use(express.json({ limit: '10mb' })); // Parse JSON with size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded data
app.use(validateContentType); // Validate content type for POST/PUT/PATCH
app.use(sanitizeRequest); // Sanitize all incoming requests

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

// Mount routes
// Route-specific rate limiting and mounting
app.use('/api/auth/login', authRateLimit); // Strict rate limiting for login
app.use('/api/auth/register', authRateLimit); // Strict rate limiting for registration  
app.use('/api/auth/reset-password-request', passwordResetRateLimit); // Password reset limiting
app.use('/api/orders', orderRateLimit); // Order creation limiting

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

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
      console.log(`🔐 Auth routes: /api/auth/register, /api/auth/login, /api/auth/me`);
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

