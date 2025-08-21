import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

const API_BASE_URL = 'http://localhost:5000/api';

const testPaymentEndpoint = async () => {
  try {
    console.log('🔍 Testing payment endpoint...');
    
    // Test 1: Check if payment routes are accessible
    console.log('\n1️⃣ Testing payment route accessibility...');
    const testResponse = await fetch(`${API_BASE_URL}/payment/test`);
    const testData = await testResponse.json();
    console.log('✅ Payment test response:', testData);
    
    // Test 2: Test checkout session creation (without auth for now)
    console.log('\n2️⃣ Testing checkout session creation...');
    
    const testItems = [
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
    
    const checkoutResponse = await fetch(`${API_BASE_URL}/payment/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // This will fail auth, but we can see the validation
      },
      body: JSON.stringify({ items: testItems })
    });
    
    if (checkoutResponse.status === 401) {
      console.log('✅ Authentication middleware working correctly (401 Unauthorized)');
    } else {
      const checkoutData = await checkoutResponse.json();
      console.log('✅ Checkout response:', checkoutData);
    }
    
    console.log('\n✅ Payment endpoint tests completed!');
    console.log('\n📋 Environment check:');
    console.log(`   - CLIENT_URL: ${process.env.CLIENT_URL || 'Not set'}`);
    console.log(`   - RAZORPAY_KEY_SECRET: ${process.env.RAZORPAY_KEY_SECRET ? 'Configured' : 'Not configured'}`);
    console.log(`   - Server URL: ${API_BASE_URL}`);
    
  } catch (error) {
    console.error('❌ Payment endpoint test failed:', error.message);
  }
};

testPaymentEndpoint();
