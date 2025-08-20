import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔍 Testing MongoDB Atlas connection...');
    console.log('📡 URI:', process.env.MONGO_URI ? 'Configured' : 'Not configured');
    
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI not found in environment variables');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Atlas Connected Successfully!`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📚 Collections found: ${collections.length}`);
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();
