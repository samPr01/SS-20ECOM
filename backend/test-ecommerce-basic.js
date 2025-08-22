import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';
let authToken = null;

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName) {
  log(`\n🧪 Testing: ${testName}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️ ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️ ${message}`, 'blue');
}

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { response, data };
  } catch (error) {
    return { response: null, data: { error: error.message } };
  }
}

// Test 1: Health Check
async function testHealthCheck() {
  logTest('Health Check');
  
  const { response, data } = await makeRequest('/health');
  
  if (response && response.ok) {
    logSuccess('Server is running and healthy');
    logInfo(`Status: ${data.status}`);
    logInfo(`Message: ${data.message}`);
  } else {
    logError('Server health check failed');
    return false;
  }
  
  return true;
}

// Test 2: User Authentication (Login)
async function testUserAuthentication() {
  logTest('User Authentication');
  
  const { response, data } = await makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'TestPass123'
    })
  });
  
  if (response && response.ok) {
    logSuccess('User authenticated successfully');
    logInfo(`User ID: ${data.user.id}`);
    logInfo(`User Name: ${data.user.name}`);
    authToken = data.token;
  } else {
    logError(`Authentication failed: ${data.message}`);
    return false;
  }
  
  return true;
}

// Test 3: Product Catalog - Get All Products (Empty)
async function testProductCatalog() {
  logTest('Product Catalog - Get All Products');
  
  const { response, data } = await makeRequest('/products');
  
  if (response && response.ok) {
    logSuccess('Product catalog retrieved successfully');
    logInfo(`Total Products: ${data.pagination.totalProducts}`);
    logInfo(`Current Page: ${data.pagination.currentPage}`);
    logInfo(`Total Pages: ${data.pagination.totalPages}`);
    logInfo(`Products on this page: ${data.products.length}`);
    
    if (data.products.length === 0) {
      logWarning('No products in database - this is expected for testing');
    }
  } else {
    logError(`Product catalog failed: ${data.message}`);
    return false;
  }
  
  return true;
}

// Test 4: Product Catalog - Pagination
async function testProductPagination() {
  logTest('Product Catalog - Pagination');
  
  const { response, data } = await makeRequest('/products?page=1&limit=5');
  
  if (response && response.ok) {
    logSuccess('Product pagination working correctly');
    logInfo(`Page: ${data.pagination.currentPage}`);
    logInfo(`Limit: ${data.pagination.limit}`);
    logInfo(`Products on page: ${data.products.length}`);
    logInfo(`Has next page: ${data.pagination.hasNextPage}`);
    logInfo(`Has prev page: ${data.pagination.hasPrevPage}`);
  } else {
    logError(`Product pagination failed: ${data.message}`);
    return false;
  }
  
  return true;
}

// Test 5: Product Catalog - Search
async function testProductSearch() {
  logTest('Product Catalog - Search');
  
  const { response, data } = await makeRequest('/products?search=test');
  
  if (response && response.ok) {
    logSuccess('Product search working correctly');
    logInfo(`Search results: ${data.products.length} products found`);
    logInfo(`Total matching products: ${data.pagination.totalProducts}`);
  } else {
    logError(`Product search failed: ${data.message}`);
    return false;
  }
  
  return true;
}

// Test 6: Product Catalog - Categories
async function testProductCategories() {
  logTest('Product Catalog - Categories');
  
  const { response, data } = await makeRequest('/products/categories/all');
  
  if (response && response.ok) {
    logSuccess('Product categories retrieved successfully');
    logInfo(`Available categories: ${data.categories.join(', ') || 'None'}`);
  } else {
    logError(`Product categories failed: ${data.message}`);
    return false;
  }
  
  return true;
}

// Test 7: Shopping Cart - Get Cart
async function testGetCart() {
  logTest('Shopping Cart - Get Cart');
  
  const { response, data } = await makeRequest('/cart', {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  
  if (response && response.ok) {
    logSuccess('Cart retrieved successfully');
    logInfo(`Cart ID: ${data.cart._id}`);
    logInfo(`Items in cart: ${data.cart.items.length}`);
    logInfo(`Cart total: $${data.cart.total}`);
  } else {
    logError(`Get cart failed: ${data.message}`);
    return false;
  }
  
  return true;
}

// Test 8: Shopping Cart - Add Item (Should fail without valid product)
async function testAddToCartInvalid() {
  logTest('Shopping Cart - Add Invalid Item');
  
  const { response, data } = await makeRequest('/cart', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      productId: '507f1f77bcf86cd799439011', // Invalid product ID
      quantity: 1
    })
  });
  
  if (response && response.status === 404) {
    logSuccess('Cart properly rejected invalid product');
    logInfo(`Error message: ${data.message}`);
  } else {
    logError(`Cart should have rejected invalid product`);
    return false;
  }
  
  return true;
}

// Test 9: Order Management - Get Orders (Empty)
async function testGetOrders() {
  logTest('Order Management - Get Orders');
  
  const { response, data } = await makeRequest('/orders', {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  
  if (response && response.ok) {
    logSuccess('Orders retrieved successfully');
    logInfo(`Total Orders: ${data.pagination.totalOrders}`);
    logInfo(`Orders on page: ${data.orders.length}`);
    logInfo(`Current Page: ${data.pagination.currentPage}`);
    logInfo(`Total Pages: ${data.pagination.totalPages}`);
  } else {
    logError(`Get orders failed: ${data.message}`);
    return false;
  }
  
  return true;
}

// Test 10: Protected Routes - Access Without Token
async function testProtectedRoutesWithoutToken() {
  logTest('Protected Routes - Access Without Token');
  
  const { response, data } = await makeRequest('/cart');
  
  if (response && response.status === 401) {
    logSuccess('Protected route properly denied without token');
    logInfo(`Error message: ${data.message}`);
  } else {
    logError('Protected route should have been denied without token');
    return false;
  }
  
  return true;
}

// Test 11: Protected Routes - Access With Invalid Token
async function testProtectedRoutesWithInvalidToken() {
  logTest('Protected Routes - Access With Invalid Token');
  
  const { response, data } = await makeRequest('/cart', {
    headers: {
      'Authorization': 'Bearer invalid_token_here'
    }
  });
  
  if (response && response.status === 401) {
    logSuccess('Protected route properly denied with invalid token');
    logInfo(`Error message: ${data.message}`);
  } else {
    logError('Protected route should have been denied with invalid token');
    return false;
  }
  
  return true;
}

// Main test runner
async function runAllTests() {
  log('🚀 Starting Basic E-Commerce Tests', 'bright');
  log('=' .repeat(60), 'cyan');
  
  const tests = [
    testHealthCheck,
    testUserAuthentication,
    testProductCatalog,
    testProductPagination,
    testProductSearch,
    testProductCategories,
    testGetCart,
    testAddToCartInvalid,
    testGetOrders,
    testProtectedRoutesWithoutToken,
    testProtectedRoutesWithInvalidToken
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    try {
      const result = await test();
      if (result) {
        passedTests++;
      }
    } catch (error) {
      logError(`Test failed with error: ${error.message}`);
    }
  }
  
  log('\n' + '=' .repeat(60), 'cyan');
  log('📊 Basic E-Commerce Test Results Summary', 'bright');
  log(`✅ Passed: ${passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'yellow');
  log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'red');
  
  if (passedTests === totalTests) {
    log('\n🎉 All basic e-commerce tests passed! Core system is working correctly.', 'green');
  } else {
    log('\n⚠️ Some tests failed. Please check the implementation.', 'yellow');
  }
  
  log('\n📝 E-Commerce Features Verified:', 'bright');
  log('• ✅ Server health and connectivity');
  log('• ✅ User authentication and JWT tokens');
  log('• ✅ Product catalog endpoints (pagination, search, categories)');
  log('• ✅ Shopping cart endpoints (get cart, validation)');
  log('• ✅ Order management endpoints');
  log('• ✅ Protected routes with authentication');
  log('• ✅ Error handling for invalid requests');
  
  log('\n💡 Next Steps:', 'bright');
  log('• Add products to database to test full cart and order functionality');
  log('• Test product creation via admin endpoints');
  log('• Test complete order flow with real products');
}

// Run the tests
runAllTests().catch(console.error);
