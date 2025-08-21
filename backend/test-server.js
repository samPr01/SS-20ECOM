import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock data
const mockProducts = [
  {
    _id: '1',
    name: 'Test Product 1',
    description: 'A test product for testing',
    price: 29.99,
    category: 'Electronics',
    image: 'https://via.placeholder.com/300x200',
    stock: 10,
    isActive: true
  },
  {
    _id: '2',
    name: 'Test Product 2',
    description: 'Another test product',
    price: 19.99,
    category: 'Clothing',
    image: 'https://via.placeholder.com/300x200',
    stock: 5,
    isActive: true
  }
];

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'E-commerce API is running!',
    timestamp: new Date().toISOString(),
    mode: 'test'
  });
});

// Mock products route
app.get('/api/products', (req, res) => {
  res.json({
    products: mockProducts,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalProducts: mockProducts.length,
      hasNextPage: false,
      hasPrevPage: false
    }
  });
});

// Mock auth routes
app.post('/api/auth/signup', (req, res) => {
  res.json({
    message: 'User registered successfully (test mode)',
    user: {
      _id: 'test-user-id',
      name: req.body.name,
      email: req.body.email
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    message: 'Login successful (test mode)',
    token: 'test-jwt-token-' + Date.now(),
    user: {
      _id: 'test-user-id',
      name: 'Test User',
      email: req.body.email
    }
  });
});

// Mock cart routes
app.get('/api/cart', (req, res) => {
  res.json({
    cart: {
      items: [],
      total: 0
    }
  });
});

app.post('/api/cart', (req, res) => {
  res.json({
    message: 'Item added to cart (test mode)'
  });
});

// Mock orders routes
app.get('/api/orders', (req, res) => {
  res.json({
    orders: []
  });
});

app.post('/api/orders/from-cart', (req, res) => {
  res.json({
    message: 'Order created successfully (test mode)',
    order: {
      _id: 'test-order-id',
      total: 59.98,
      status: 'pending'
    }
  });
});

// Mock payment routes
app.get('/api/payment/test', (req, res) => {
  res.json({
    message: 'Payment routes are working!',
    razorpay_configured: false,
    client_url: process.env.CLIENT_URL || 'http://localhost:5173',
    mode: 'test'
  });
});

app.post('/api/payment/create-checkout-session', (req, res) => {
  res.json({
    url: 'https://checkout.razorpay.com/test-order-url'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Test Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 CORS Origin: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`📱 Ready to accept requests from frontend`);
  console.log(`🧪 Running in TEST MODE - no database required`);
});
