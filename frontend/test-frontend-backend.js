const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

const testProduct = {
  name: 'Test Product',
  description: 'A test product',
  price: 29.99,
  category: 'electronics',
  image: 'https://via.placeholder.com/300',
  stock: 10
};

// Helper function to get auth headers
const getAuthHeaders = (token) => ({
  'Authorization': token ? `Bearer ${token}` : '',
  'Content-Type': 'application/json',
});

// Test functions
const testAuth = async () => {
  console.log('🔐 Testing Authentication...');
  
  try {
    // Test registration
    console.log('  📝 Testing registration...');
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('  ✅ Registration successful');
      return registerData.token;
    } else {
      console.log('  ⚠️ Registration failed, trying login...');
      
      // Try login instead
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('  ✅ Login successful');
        return loginData.token;
      } else {
        throw new Error('Both registration and login failed');
      }
    }
  } catch (error) {
    console.error('  ❌ Authentication failed:', error.message);
    return null;
  }
};

const testProducts = async (token) => {
  console.log('📦 Testing Products...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: getAuthHeaders(token)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Products loaded: ${data.products?.length || 0} products`);
      return data.products?.[0] || null;
    } else {
      throw new Error(`Products request failed: ${response.status}`);
    }
  } catch (error) {
    console.error('  ❌ Products test failed:', error.message);
    return null;
  }
};

const testCart = async (token, product) => {
  console.log('🛒 Testing Cart Operations...');
  
  if (!product) {
    console.log('  ⚠️ No product available for cart test');
    return;
  }
  
  try {
    // Test add to cart
    console.log('  ➕ Testing add to cart...');
    const addResponse = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        productId: product._id || product.id,
        quantity: 1
      })
    });
    
    if (addResponse.ok) {
      console.log('  ✅ Add to cart successful');
    } else {
      throw new Error(`Add to cart failed: ${addResponse.status}`);
    }
    
    // Test get cart
    console.log('  📋 Testing get cart...');
    const getResponse = await fetch(`${API_BASE_URL}/cart`, {
      headers: getAuthHeaders(token)
    });
    
    if (getResponse.ok) {
      const cartData = await getResponse.json();
      console.log(`  ✅ Cart loaded: ${cartData.cart?.items?.length || 0} items`);
      
      // Test Razorpay order creation
      if (cartData.cart?.items?.length > 0) {
        console.log('  💳 Testing Razorpay order creation...');
        const total = cartData.cart.items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);
        
        const orderResponse = await fetch(`${API_BASE_URL}/payment/create-order`, {
          method: 'POST',
          headers: getAuthHeaders(token),
          body: JSON.stringify({
            amount: total,
            currency: 'INR'
          })
        });
        
        if (orderResponse.ok) {
          const orderData = await orderResponse.json();
          console.log('  ✅ Razorpay order created successfully');
          console.log(`  🔗 Order ID: ${orderData.id}`);
          console.log(`  💰 Amount: ${orderData.amount} ${orderData.currency}`);
        } else {
          console.log('  ⚠️ Razorpay order creation failed');
        }
      }
      
      // Test remove from cart if items exist
      if (cartData.cart?.items?.length > 0) {
        const itemId = cartData.cart.items[0]._id;
        console.log('  🗑️ Testing remove from cart...');
        
        const removeResponse = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
          method: 'DELETE',
          headers: getAuthHeaders(token)
        });
        
        if (removeResponse.ok) {
          console.log('  ✅ Remove from cart successful');
        } else {
          console.log('  ⚠️ Remove from cart failed');
        }
      }
    } else {
      throw new Error(`Get cart failed: ${getResponse.status}`);
    }
  } catch (error) {
    console.error('  ❌ Cart test failed:', error.message);
  }
};

// Main test runner
const runTests = async () => {
  console.log('🧪 Frontend-Backend Integration Tests');
  console.log('=====================================\n');
  
  // Test authentication
  const token = await testAuth();
  
  if (!token) {
    console.log('\n❌ Authentication failed. Cannot proceed with other tests.');
    return;
  }
  
  console.log('\n🔑 Token obtained successfully\n');
  
  // Test products
  const product = await testProducts(token);
  
  // Test cart operations
  await testCart(token, product);
  
  console.log('\n✅ All tests completed!');
};

// Run tests
runTests().catch(console.error);
