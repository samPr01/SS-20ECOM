// Simple test to verify environment variables are loaded
console.log('🔍 Testing Environment Variables...');
console.log('====================================');

// Check if we're in a Vite environment
if (typeof import.meta !== 'undefined' && import.meta.env) {
  console.log('✅ Vite environment detected');
  console.log('📡 VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('💳 VITE_RAZORPAY_KEY_ID:', import.meta.env.VITE_RAZORPAY_KEY_ID);
  
  // Test API URL construction
  const apiUrl = import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api`
    : 'http://localhost:5000/api';
  
  console.log('🔗 Constructed API URL:', apiUrl);
} else {
  console.log('❌ Not in Vite environment');
  console.log('📝 This script should be run in a Vite context');
}

console.log('\n📋 Environment check completed!');
