import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const mockUser = {
  name: "Test User",
  email: "test@example.com",
  password: "password123"
};

const mockProduct = {
  name: "Test Product",
  description: "A test product for testing",
  price: 29.99,
  category: "Electronics",
  image: "https://via.placeholder.com/300x200",
  stock: 10
};

const mockCartItem = {
  productId: "", // Will be set after product creation
  quantity: 2
};

const mockOrder = {
  items: [], // Will be populated with cart items
  shippingAddress: {
    street: "123 Test St",
    city: "Test City",
    state: "Test State",
    zipCode: "12345",
    country: "Test Country"
  },
  paymentMethod: "razorpay"
};

const mockPaymentItems = [
  {
    name: "Test Product 1",
    price: 29.99,
    quantity: 2
  },
  {
    name: "Test Product 2",
    price: 19.99,
    quantity: 1
  }
];

let authToken = null;
let productId = null;
let cartItemId = null;
let orderId = null;

// Helper function to make authenticated requests
const makeAuthRequest = async (url, options = {}) => {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    }
  };

  if (authToken) {
    config.headers['Authorization'] = `Bearer ${authToken}`;
  }

  return fetch(url, config);
};

// Test functions
const testHealthCheck = async () => {
  console.log('\n🏥 Testing Health Check...');
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health Check:', data);
    return true;
  } catch (error) {
    console.error('❌ Health Check failed:', error.message);
    return false;
  }
};

const testAuthSignup = async () => {
  console.log('\n👤 Testing Auth Signup...');
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockUser)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Signup successful:', { message: data.message, userId: data.user?._id });
      return true;
    } else {
      console.log('⚠️ Signup response:', data);
      // If user already exists, that's okay
      return data.message?.includes('already exists') || false;
    }
  } catch (error) {
    console.error('❌ Signup failed:', error.message);
    return false;
  }
};

const testAuthLogin = async () => {
  console.log('\n🔐 Testing Auth Login...');
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: mockUser.email,
        password: mockUser.password
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      authToken = data.token;
      console.log('✅ Login successful:', { message: data.message, token: authToken?.substring(0, 20) + '...' });
      return true;
    } else {
      console.error('❌ Login failed:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    return false;
  }
};

const testProducts = async () => {
  console.log('\n📦 Testing Products...');
  
  // Test GET /products
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ GET Products successful:', { count: data.products?.length || 0 });
      
      // Get first product ID for cart testing
      if (data.products && data.products.length > 0) {
        productId = data.products[0]._id;
        console.log('📋 Using product ID for cart tests:', productId);
      }
      return true;
    } else {
      console.error('❌ GET Products failed:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ GET Products failed:', error.message);
    return false;
  }
};

const testCart = async () => {
  console.log('\n🛒 Testing Cart...');
  
  if (!authToken) {
    console.log('⚠️ Skipping cart tests - no auth token');
    return false;
  }
  
  if (!productId) {
    console.log('⚠️ Skipping cart tests - no product ID');
    return false;
  }
  
  try {
    // Test POST /cart (add item)
    const addResponse = await makeAuthRequest(`${API_BASE_URL}/cart`, {
      method: 'POST',
      body: JSON.stringify({
        productId: productId,
        quantity: 2
      })
    });
    
    const addData = await addResponse.json();
    
    if (addResponse.ok) {
      console.log('✅ Add to cart successful:', addData.message);
      
      // Test GET /cart
      const getResponse = await makeAuthRequest(`${API_BASE_URL}/cart`);
      const getData = await getResponse.json();
      
      if (getResponse.ok) {
        console.log('✅ GET Cart successful:', { 
          itemCount: getData.cart?.items?.length || 0,
          total: getData.cart?.total || 0
        });
        
        // Store cart item ID for order testing
        if (getData.cart?.items && getData.cart.items.length > 0) {
          cartItemId = getData.cart.items[0]._id;
        }
        
        return true;
      } else {
        console.error('❌ GET Cart failed:', getData);
        return false;
      }
    } else {
      console.error('❌ Add to cart failed:', addData);
      return false;
    }
  } catch (error) {
    console.error('❌ Cart tests failed:', error.message);
    return false;
  }
};

const testOrders = async () => {
  console.log('\n📋 Testing Orders...');
  
  if (!authToken) {
    console.log('⚠️ Skipping order tests - no auth token');
    return false;
  }
  
  try {
    // Test GET /orders (should be empty initially)
    const getResponse = await makeAuthRequest(`${API_BASE_URL}/orders`);
    const getData = await getResponse.json();
    
    if (getResponse.ok) {
      console.log('✅ GET Orders successful:', { 
        orderCount: getData.orders?.length || 0
      });
      
      // Test POST /orders (create order from cart)
      const orderData = {
        ...mockOrder,
        items: cartItemId ? [{ productId, quantity: 2 }] : []
      };
      
      const createResponse = await makeAuthRequest(`${API_BASE_URL}/orders/from-cart`, {
        method: 'POST',
        body: JSON.stringify({
          shippingAddress: mockOrder.shippingAddress,
          paymentMethod: mockOrder.paymentMethod
        })
      });
      
      const createData = await createResponse.json();
      
      if (createResponse.ok) {
        orderId = createData.order?._id;
        console.log('✅ Create order successful:', { 
          orderId: orderId,
          total: createData.order?.total || 0
        });
        return true;
      } else {
        console.log('⚠️ Create order response:', createData);
        return false;
      }
    } else {
      console.error('❌ GET Orders failed:', getData);
      return false;
    }
  } catch (error) {
    console.error('❌ Order tests failed:', error.message);
    return false;
  }
};

const testPayment = async () => {
  console.log('\n💳 Testing Payment...');
  
  if (!authToken) {
    console.log('⚠️ Skipping payment tests - no auth token');
    return false;
  }
  
  try {
    // Test GET /payment/test
    const testResponse = await fetch(`${API_BASE_URL}/payment/test`);
    const testData = await testResponse.json();
    
    if (testResponse.ok) {
      console.log('✅ Payment test endpoint:', testData);
    }
    
    // Test POST /payment/create-checkout-session
    const checkoutResponse = await makeAuthRequest(`${API_BASE_URL}/payment/create-checkout-session`, {
      method: 'POST',
      body: JSON.stringify({ items: mockPaymentItems })
    });
    
    const checkoutData = await checkoutResponse.json();
    
    if (checkoutResponse.ok) {
      console.log('✅ Create checkout session successful:', { 
        url: checkoutData.url?.substring(0, 50) + '...',
        sessionId: checkoutData.url?.split('/').pop()
      });
      return true;
    } else {
      console.log('⚠️ Create checkout session response:', checkoutData);
      return false;
    }
  } catch (error) {
    console.error('❌ Payment tests failed:', error.message);
    return false;
  }
};

// Main test runner
const runAllTests = async () => {
  console.log('🚀 Starting Backend Route Tests...');
  console.log('📡 API Base URL:', API_BASE_URL);
  console.log('🔧 Environment:', process.env.NODE_ENV || 'development');
  
  const results = {
    healthCheck: await testHealthCheck(),
    signup: await testAuthSignup(),
    login: await testAuthLogin(),
    products: await testProducts(),
    cart: await testCart(),
    orders: await testOrders(),
    payment: await testPayment()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Backend is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the logs above for details.');
  }
  
  console.log('\n📋 Test Data Used:');
  console.log('   - User:', mockUser.email);
  console.log('   - Product ID:', productId || 'Not created');
  console.log('   - Auth Token:', authToken ? 'Present' : 'Not obtained');
  console.log('   - Order ID:', orderId || 'Not created');
};

// Run tests
runAllTests().catch(console.error);
