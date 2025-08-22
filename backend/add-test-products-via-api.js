import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

const testProducts = [
  {
    title: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    sku: 'WH-001',
    category: 'electronics',
    stock: 50
  },
  {
    title: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking watch with heart rate monitor and GPS.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    sku: 'FW-002',
    category: 'electronics',
    stock: 30
  },
  {
    title: 'Organic Cotton T-Shirt',
    description: 'Comfortable and eco-friendly cotton t-shirt made from 100% organic materials.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    sku: 'TS-003',
    category: 'clothing',
    stock: 100
  }
];

async function addTestProducts() {
  console.log('🚀 Adding test products via API...\n');
  
  // First, get an auth token by logging in
  console.log('🔐 Getting authentication token...');
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
  console.log('✅ Authentication successful\n');
  
  for (const product of testProducts) {
    try {
      console.log(`📦 Adding: ${product.title}`);
      
      const response = await fetch(`${BASE_URL}/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(product)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ Successfully added: ${product.title} (ID: ${data.product.id})`);
      } else {
        console.log(`❌ Failed to add ${product.title}: ${data.message}`);
      }
    } catch (error) {
      console.log(`❌ Error adding ${product.title}: ${error.message}`);
    }
  }
  
  console.log('\n🎉 Test products added! Now you can run the e-commerce tests.');
}

addTestProducts().catch(console.error);
