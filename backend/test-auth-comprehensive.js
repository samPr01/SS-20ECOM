import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';
let authToken = null;
let resetToken = null;

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'TestPass123'
};

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

// Test 2: User Registration
async function testUserRegistration() {
  logTest('User Registration');
  
  const { response, data } = await makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(testUser)
  });
  
  if (response && response.ok) {
    logSuccess('User registered successfully');
    logInfo(`User ID: ${data.user.id}`);
    logInfo(`User Name: ${data.user.name}`);
    logInfo(`User Email: ${data.user.email}`);
    logInfo(`Token received: ${data.token ? 'Yes' : 'No'}`);
    
    if (data.token) {
      authToken = data.token;
    }
  } else {
    logError(`Registration failed: ${data.message}`);
    return false;
  }
  
  return true;
}

// Test 3: Duplicate Registration (should fail)
async function testDuplicateRegistration() {
  logTest('Duplicate Registration (should fail)');
  
  const { response, data } = await makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(testUser)
  });
  
  if (response && response.status === 400) {
    logSuccess('Duplicate registration properly rejected');
    logInfo(`Error message: ${data.message}`);
  } else {
    logError('Duplicate registration should have failed');
    return false;
  }
  
  return true;
}

// Test 4: User Login
async function testUserLogin() {
  logTest('User Login');
  
  const { response, data } = await makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password
    })
  });
  
  if (response && response.ok) {
    logSuccess('User logged in successfully');
    logInfo(`User ID: ${data.user.id}`);
    logInfo(`User Name: ${data.user.name}`);
    logInfo(`Token received: ${data.token ? 'Yes' : 'No'}`);
    
    if (data.token) {
      authToken = data.token;
    }
  } else {
    logError(`Login failed: ${data.message}`);
    return false;
  }
  
  return true;
}

// Test 5: Invalid Login (should fail)
async function testInvalidLogin() {
  logTest('Invalid Login (should fail)');
  
  const { response, data } = await makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: testUser.email,
      password: 'wrongpassword'
    })
  });
  
  if (response && response.status === 400) {
    logSuccess('Invalid login properly rejected');
    logInfo(`Error message: ${data.message}`);
  } else {
    logError('Invalid login should have failed');
    return false;
  }
  
  return true;
}

// Test 6: Get User Profile (with valid token)
async function testGetProfile() {
  logTest('Get User Profile (with valid token)');
  
  if (!authToken) {
    logError('No auth token available');
    return false;
  }
  
  const { response, data } = await makeRequest('/auth/me', {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  
  if (response && response.ok) {
    logSuccess('Profile retrieved successfully');
    logInfo(`User ID: ${data.user.id}`);
    logInfo(`User Name: ${data.user.name}`);
    logInfo(`User Email: ${data.user.email}`);
    logInfo(`Created At: ${data.user.createdAt}`);
  } else {
    logError(`Profile retrieval failed: ${data.message}`);
    return false;
  }
  
  return true;
}

// Test 7: Get User Profile (without token - should fail)
async function testGetProfileWithoutToken() {
  logTest('Get User Profile (without token - should fail)');
  
  const { response, data } = await makeRequest('/auth/me');
  
  if (response && response.status === 401) {
    logSuccess('Profile access properly denied without token');
    logInfo(`Error message: ${data.message}`);
  } else {
    logError('Profile access should have been denied without token');
    return false;
  }
  
  return true;
}

// Test 8: Password Reset Request
async function testPasswordResetRequest() {
  logTest('Password Reset Request');
  
  const { response, data } = await makeRequest('/auth/reset-password-request', {
    method: 'POST',
    body: JSON.stringify({
      email: testUser.email
    })
  });
  
  if (response && response.ok) {
    logSuccess('Password reset request sent successfully');
    logInfo(`Message: ${data.message}`);
    logWarning('Note: In a real scenario, check the email for the reset token');
    logWarning('For testing, you may need to check the database for the reset token');
  } else {
    logError(`Password reset request failed: ${data.message}`);
    return false;
  }
  
  return true;
}

// Test 9: Password Reset Request (non-existent email)
async function testPasswordResetRequestInvalidEmail() {
  logTest('Password Reset Request (non-existent email)');
  
  const { response, data } = await makeRequest('/auth/reset-password-request', {
    method: 'POST',
    body: JSON.stringify({
      email: 'nonexistent@example.com'
    })
  });
  
  if (response && response.ok) {
    logSuccess('Password reset request handled properly for non-existent email');
    logInfo(`Message: ${data.message}`);
    logInfo('Security: Same response as valid email (prevents email enumeration)');
  } else {
    logError(`Password reset request failed: ${data.message}`);
    return false;
  }
  
  return true;
}

// Test 10: Protected Route Access (with valid token)
async function testProtectedRouteAccess() {
  logTest('Protected Route Access (with valid token)');
  
  if (!authToken) {
    logError('No auth token available');
    return false;
  }
  
  const { response, data } = await makeRequest('/cart', {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  
  if (response && response.ok) {
    logSuccess('Protected route accessed successfully');
    logInfo('Cart data retrieved (empty cart for new user)');
  } else {
    logError(`Protected route access failed: ${data.message}`);
    return false;
  }
  
  return true;
}

// Test 11: Protected Route Access (without token - should fail)
async function testProtectedRouteWithoutToken() {
  logTest('Protected Route Access (without token - should fail)');
  
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

// Test 12: Protected Route Access (with invalid token - should fail)
async function testProtectedRouteWithInvalidToken() {
  logTest('Protected Route Access (with invalid token - should fail)');
  
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
  log('🚀 Starting Comprehensive Authentication Tests', 'bright');
  log('=' .repeat(60), 'cyan');
  
  const tests = [
    testHealthCheck,
    testUserRegistration,
    testDuplicateRegistration,
    testUserLogin,
    testInvalidLogin,
    testGetProfile,
    testGetProfileWithoutToken,
    testPasswordResetRequest,
    testPasswordResetRequestInvalidEmail,
    testProtectedRouteAccess,
    testProtectedRouteWithoutToken,
    testProtectedRouteWithInvalidToken
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
  log('📊 Test Results Summary', 'bright');
  log(`✅ Passed: ${passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'yellow');
  log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'red');
  
  if (passedTests === totalTests) {
    log('\n🎉 All tests passed! Authentication system is working correctly.', 'green');
  } else {
    log('\n⚠️ Some tests failed. Please check the implementation.', 'yellow');
  }
  
  log('\n📝 Notes:', 'bright');
  log('• Password reset functionality requires email configuration');
  log('• For production, ensure proper email service setup');
  log('• Consider adding rate limiting for security');
  log('• Test password reset token usage in a separate test');
}

// Run the tests
runAllTests().catch(console.error);
