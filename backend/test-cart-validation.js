import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testCartValidation() {
  console.log('🧪 Testing Cart Validation...\n');
  
  // Step 1: Login to get a fresh token
  console.log('1. Getting authentication token...');
  const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'TestPass123'
    })
  });
  
  const loginData = await loginResponse.json();
  if (!loginResponse.ok) {
    console.log(`❌ Login failed: ${loginData.message}`);
    return;
  }
  
  const authToken = loginData.token;
  console.log('✅ Login successful\n');
  
  // Step 2: Test adding invalid product to cart
  console.log('2. Testing cart with invalid product ID...');
  const cartResponse = await fetch(`${BASE_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      productId: '507f1f77bcf86cd799439011', // Invalid product ID
      quantity: 1
    })
  });
  
  const cartData = await cartResponse.json();
  console.log(`Status Code: ${cartResponse.status}`);
  console.log(`Response: ${JSON.stringify(cartData, null, 2)}`);
  
  if (cartResponse.status === 404) {
    console.log('✅ Cart validation working correctly - returned 404 for invalid product');
  } else {
    console.log('❌ Cart validation failed - should have returned 404');
  }
  
  console.log('\n🎉 Cart validation test completed!');
}

testCartValidation().catch(console.error);
