import mongoose from 'mongoose';
import Product from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

async function createTestProduct() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ Connected to MongoDB');

    // Check if test product already exists
    const existingProduct = await Product.findOne({ sku: 'TEST001' });
    if (existingProduct) {
      console.log('✅ Test product already exists');
      console.log(`Product ID: ${existingProduct._id}`);
      return existingProduct._id;
    }

    // Create test product
    const testProduct = new Product({
      title: 'Test Product',
      description: 'A test product for order status management testing',
      price: 29.99,
      image: 'https://via.placeholder.com/300x300?text=Test+Product',
      sku: 'TEST001',
      category: 'electronics',
      stock: 100,
      isActive: true
    });

    await testProduct.save();
    console.log('✅ Test product created successfully');
    console.log(`Product ID: ${testProduct._id}`);
    console.log(`Product SKU: ${testProduct.sku}`);
    console.log(`Product Price: $${testProduct.price}`);

    return testProduct._id;
  } catch (error) {
    console.error('❌ Error creating test product:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run the function
createTestProduct()
  .then(productId => {
    console.log(`\n🎉 Test product ready with ID: ${productId}`);
    console.log('You can now run the order status management tests!');
  })
  .catch(console.error);
