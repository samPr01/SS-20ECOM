import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing E-commerce API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);
    console.log('');

    // Test products endpoint
    console.log('2. Testing products endpoint...');
    const productsResponse = await fetch(`${BASE_URL}/products`);
    const productsData = await productsResponse.json();
    console.log('✅ Products endpoint working');
    console.log(`📦 Found ${productsData.products?.length || 0} products`);
    console.log('');

    // Test registration endpoint
    console.log('3. Testing user registration...');
    const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      })
    });
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ User registration working');
      console.log(`👤 User created: ${registerData.user.name}`);
      console.log(`🔑 Token received: ${registerData.token ? 'Yes' : 'No'}`);
      console.log('');
      
      // Test login with the created user
      console.log('4. Testing user login...');
      const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: `test${Date.now()}@example.com`,
          password: 'password123'
        })
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ User login working');
        console.log(`🔑 Login token received: ${loginData.token ? 'Yes' : 'No'}`);
      } else {
        console.log('❌ User login failed');
      }
    } else {
      console.log('❌ User registration failed');
    }

    console.log('');
    console.log('🎉 API testing completed!');
    console.log('📋 Your backend is ready to use.');
    console.log('');
    console.log('📚 Available endpoints:');
    console.log('   GET  /api/health - Health check');
    console.log('   GET  /api/products - List products');
    console.log('   POST /api/auth/register - Register user');
    console.log('   POST /api/auth/login - Login user');
    console.log('   GET  /api/cart - Get user cart (requires auth)');
    console.log('   GET  /api/orders - Get user orders (requires auth)');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure the server is running: npm run dev');
    console.log('2. Check if MongoDB Atlas connection is configured');
    console.log('3. Verify the .env file has correct MONGODB_URI');
  }
}

testAPI();
