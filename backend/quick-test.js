import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

const API_BASE_URL = 'http://localhost:5000/api';

// Quick test functions
const quickTest = async () => {
  console.log('🚀 Quick Backend Tests');
  console.log('=====================\n');

  // Test 1: Health Check
  try {
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.message);
  } catch (error) {
    console.log('❌ Health Check failed:', error.message);
  }

  // Test 2: Products
  try {
    console.log('\n2️⃣ Testing Products...');
    const productsResponse = await fetch(`${API_BASE_URL}/products`);
    const productsData = await productsResponse.json();
    console.log('✅ Products:', `${productsData.products?.length || 0} products found`);
  } catch (error) {
    console.log('❌ Products failed:', error.message);
  }

  // Test 3: Payment Test
  try {
    console.log('\n3️⃣ Testing Payment...');
    const paymentResponse = await fetch(`${API_BASE_URL}/payment/test`);
    const paymentData = await paymentResponse.json();
    console.log('✅ Payment Test:', paymentData.message);
    console.log('   Razorpay configured:', paymentData.razorpay_configured);
    console.log('   Client URL:', paymentData.client_url);
  } catch (error) {
    console.log('❌ Payment test failed:', error.message);
  }

  console.log('\n🎯 Quick tests completed!');
  console.log('\n📋 Next steps:');
  console.log('   1. Start the server: npm run dev');
  console.log('   2. Run tests with auto-server: npm run test:quick:with-server');
  console.log('   3. Run full tests: npm run test:all');
  console.log('   4. Import postman-collection.json to Postman');
  console.log('   5. Test with frontend at http://localhost:8084/');
};

quickTest().catch(console.error);
