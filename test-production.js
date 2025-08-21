#!/usr/bin/env node

/**
 * 🧪 Production Testing Script
 * Tests all major features of your e-commerce application
 */

const fetch = globalThis.fetch;

// Configuration
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://your-netlify-site.netlify.app';
const BACKEND_URL = process.env.BACKEND_URL || 'https://your-render-backend.onrender.com';

// Test data
const testUser = {
  name: 'Test User',
  email: `test-${Date.now()}@example.com`,
  password: 'testpassword123'
};

const testProduct = {
  id: '1',
  name: 'Wireless Bluetooth Headphones',
  price: 1299,
  quantity: 1
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(url, name) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      log(`✅ ${name}: OK`, 'green');
      return { success: true, data };
    } else {
      log(`❌ ${name}: Failed (${response.status})`, 'red');
      return { success: false, error: data };
    }
  } catch (error) {
    log(`❌ ${name}: Error - ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function testBackendHealth() {
  log('\n🔍 Testing Backend Health...', 'blue');
  
  const healthCheck = await testEndpoint(`${BACKEND_URL}/api/health`, 'Health Check');
  const testEndpoint = await testEndpoint(`${BACKEND_URL}/api/test`, 'Test Endpoint');
  
  return healthCheck.success && testEndpoint.success;
}

async function testAuthentication() {
  log('\n🔐 Testing Authentication...', 'blue');
  
  // Test registration
  const registerResponse = await fetch(`${BACKEND_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser)
  });
  
  if (registerResponse.ok) {
    const registerData = await registerResponse.json();
    log('✅ Registration: OK', 'green');
    
    // Test login
    const loginResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      log('✅ Login: OK', 'green');
      return { success: true, token: loginData.token };
    } else {
      log('❌ Login: Failed', 'red');
      return { success: false };
    }
  } else {
    log('❌ Registration: Failed', 'red');
    return { success: false };
  }
}

async function testProducts() {
  log('\n🛍️ Testing Products...', 'blue');
  
  const productsResponse = await fetch(`${BACKEND_URL}/api/products`);
  
  if (productsResponse.ok) {
    const productsData = await productsResponse.json();
    log(`✅ Products: OK (${productsData.products?.length || 0} products)`, 'green');
    return { success: true, products: productsData.products };
  } else {
    log('❌ Products: Failed', 'red');
    return { success: false };
  }
}

async function testCart(token) {
  log('\n🛒 Testing Cart...', 'blue');
  
  if (!token) {
    log('⚠️ Cart: Skipped (no token)', 'yellow');
    return { success: false, skipped: true };
  }
  
  // Add item to cart
  const addToCartResponse = await fetch(`${BACKEND_URL}/api/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(testProduct)
  });
  
  if (addToCartResponse.ok) {
    log('✅ Add to Cart: OK', 'green');
    
    // Get cart
    const getCartResponse = await fetch(`${BACKEND_URL}/api/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (getCartResponse.ok) {
      const cartData = await getCartResponse.json();
      log(`✅ Get Cart: OK (${cartData.items?.length || 0} items)`, 'green');
      return { success: true, cart: cartData };
    } else {
      log('❌ Get Cart: Failed', 'red');
      return { success: false };
    }
  } else {
    log('❌ Add to Cart: Failed', 'red');
    return { success: false };
  }
}

async function testPayment() {
  log('\n💳 Testing Payment Integration...', 'blue');
  
  // Test Razorpay order creation
  const orderResponse = await fetch(`${BACKEND_URL}/api/payment/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 1299,
      currency: 'INR'
    })
  });
  
  if (orderResponse.ok) {
    const orderData = await orderResponse.json();
    log('✅ Payment Order Creation: OK', 'green');
    return { success: true, order: orderData };
  } else {
    log('❌ Payment Order Creation: Failed', 'red');
    return { success: false };
  }
}

async function testAdminFeatures() {
  log('\n👨‍💼 Testing Admin Features...', 'blue');
  
  // Test admin stats endpoint
  const statsResponse = await fetch(`${BACKEND_URL}/api/admin/upload-stats`);
  
  if (statsResponse.ok) {
    const statsData = await statsResponse.json();
    log('✅ Admin Stats: OK', 'green');
    return { success: true, stats: statsData };
  } else {
    log('❌ Admin Stats: Failed', 'red');
    return { success: false };
  }
}

async function runAllTests() {
  log('🚀 Starting Production Tests...', 'blue');
  log(`Frontend URL: ${FRONTEND_URL}`, 'yellow');
  log(`Backend URL: ${BACKEND_URL}`, 'yellow');
  
  const results = {
    backendHealth: false,
    authentication: false,
    products: false,
    cart: false,
    payment: false,
    admin: false
  };
  
  // Test backend health
  results.backendHealth = await testBackendHealth();
  
  if (!results.backendHealth) {
    log('\n❌ Backend is not accessible. Stopping tests.', 'red');
    return results;
  }
  
  // Test authentication
  const authResult = await testAuthentication();
  results.authentication = authResult.success;
  
  // Test products
  results.products = (await testProducts()).success;
  
  // Test cart (requires authentication)
  const cartResult = await testCart(authResult.token);
  results.cart = cartResult.success || cartResult.skipped;
  
  // Test payment
  results.payment = (await testPayment()).success;
  
  // Test admin features
  results.admin = (await testAdminFeatures()).success;
  
  // Summary
  log('\n📊 Test Results Summary:', 'blue');
  log(`Backend Health: ${results.backendHealth ? '✅' : '❌'}`, results.backendHealth ? 'green' : 'red');
  log(`Authentication: ${results.authentication ? '✅' : '❌'}`, results.authentication ? 'green' : 'red');
  log(`Products: ${results.products ? '✅' : '❌'}`, results.products ? 'green' : 'red');
  log(`Cart: ${results.cart ? '✅' : '❌'}`, results.cart ? 'green' : 'red');
  log(`Payment: ${results.payment ? '✅' : '❌'}`, results.payment ? 'green' : 'red');
  log(`Admin: ${results.admin ? '✅' : '❌'}`, results.admin ? 'green' : 'red');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`, passedTests === totalTests ? 'green' : 'yellow');
  
  if (passedTests === totalTests) {
    log('🎉 All tests passed! Your production deployment is working correctly.', 'green');
  } else {
    log('⚠️ Some tests failed. Please check the issues above.', 'yellow');
  }
  
  return results;
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}

export { runAllTests };
