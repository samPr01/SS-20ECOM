import connectDB from './config/database.js';
import Product from './models/Product.js';

const testProducts = [
  {
    title: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    sku: 'WH-001',
    category: 'electronics',
    stock: 50,
    isActive: true
  },
  {
    title: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking watch with heart rate monitor, GPS, and water resistance. Track your workouts and health metrics.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    sku: 'FW-002',
    category: 'electronics',
    stock: 30,
    isActive: true
  },
  {
    title: 'Organic Cotton T-Shirt',
    description: 'Comfortable and eco-friendly cotton t-shirt made from 100% organic materials. Available in multiple colors and sizes.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    sku: 'TS-003',
    category: 'clothing',
    stock: 100,
    isActive: true
  },
  {
    title: 'Stainless Steel Water Bottle',
    description: 'Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours. Perfect for outdoor activities.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    sku: 'WB-004',
    category: 'home',
    stock: 75,
    isActive: true
  },
  {
    title: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500',
    sku: 'WC-005',
    category: 'electronics',
    stock: 40,
    isActive: true
  }
];

async function addTestProducts() {
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();
    
    console.log('🧹 Clearing existing test products...');
    await Product.deleteMany({ sku: { $in: testProducts.map(p => p.sku) } });
    
    console.log('📦 Creating test products...');
    const createdProducts = await Product.insertMany(testProducts);
    
    console.log(`✅ Successfully created ${createdProducts.length} test products:`);
    createdProducts.forEach(product => {
      console.log(`   • ${product.title} - $${product.price} (SKU: ${product.sku})`);
    });
    
    console.log('\n🎉 Test products are ready for e-commerce testing!');
    console.log('You can now run: node test-ecommerce-comprehensive.js');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test products:', error);
    process.exit(1);
  }
}

addTestProducts();
