import connectDB from './config/database.js';
import Product from './models/Product.js';

const sampleProducts = [
  {
    title: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    sku: 'WH-001',
    category: 'electronics',
    stock: 50
  },
  {
    title: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking watch with heart rate monitor, GPS, and water resistance. Track your workouts and health metrics.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    sku: 'FW-002',
    category: 'electronics',
    stock: 30
  },
  {
    title: 'Organic Cotton T-Shirt',
    description: 'Comfortable and eco-friendly cotton t-shirt made from 100% organic materials. Available in multiple colors and sizes.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    sku: 'TS-003',
    category: 'clothing',
    stock: 100
  },
  {
    title: 'Stainless Steel Water Bottle',
    description: 'Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours. Perfect for outdoor activities.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    sku: 'WB-004',
    category: 'home',
    stock: 75
  },
  {
    title: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500',
    sku: 'WC-005',
    category: 'electronics',
    stock: 40
  },
  {
    title: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat made from eco-friendly materials. Perfect thickness for comfort and stability during practice.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
    sku: 'YM-006',
    category: 'sports',
    stock: 60
  },
  {
    title: 'Portable Bluetooth Speaker',
    description: 'Waterproof portable speaker with 360-degree sound and 20-hour battery life. Perfect for outdoor adventures.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    sku: 'BS-007',
    category: 'electronics',
    stock: 35
  },
  {
    title: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 beautiful ceramic coffee mugs with modern design. Microwave and dishwasher safe.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500',
    sku: 'CM-008',
    category: 'home',
    stock: 80
  },
  {
    title: 'Running Shoes Lightweight',
    description: 'Lightweight running shoes with superior cushioning and breathable mesh upper. Perfect for daily runs.',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    sku: 'RS-009',
    category: 'sports',
    stock: 45
  },
  {
    title: 'Laptop Stand Adjustable',
    description: 'Ergonomic laptop stand with adjustable height and angle. Improves posture and reduces neck strain.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500',
    sku: 'LS-010',
    category: 'electronics',
    stock: 55
  }
];

async function createTestProducts() {
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();
    
    console.log('🧹 Clearing existing test products...');
    await Product.deleteMany({ sku: { $in: sampleProducts.map(p => p.sku) } });
    
    console.log('📦 Creating test products...');
    const createdProducts = await Product.insertMany(sampleProducts);
    
    console.log(`✅ Successfully created ${createdProducts.length} test products:`);
    createdProducts.forEach(product => {
      console.log(`   • ${product.title} - $${product.price} (SKU: ${product.sku})`);
    });
    
    console.log('\n🎉 Test products are ready for e-commerce testing!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test products:', error);
    process.exit(1);
  }
}

createTestProducts();
