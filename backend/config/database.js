import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Check if MONGO_URI is configured
    if (!process.env.MONGO_URI) {
      console.log('⚠️ MongoDB not configured - running in test mode');
      console.log('📝 For full functionality, set MONGO_URI in .env file');
      return;
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️ Continuing without database connection for testing');
  }
};

export default connectDB;
