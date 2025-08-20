import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the sample environment file
const sampleEnvPath = path.join(__dirname, 'env.sample');
const envPath = path.join(__dirname, '.env');

try {
  // Copy the sample to .env
  const sampleContent = fs.readFileSync(sampleEnvPath, 'utf8');
  fs.writeFileSync(envPath, sampleContent);
  
  console.log('✅ Environment file created successfully!');
  console.log('📝 Please update the .env file with your MongoDB Atlas connection string.');
  console.log('🔗 Get your connection string from: https://cloud.mongodb.com/');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Update MONGODB_URI in .env with your actual MongoDB Atlas connection string');
  console.log('2. Run: npm run dev');
  console.log('3. Test the API at: http://localhost:5000/api/health');
  
} catch (error) {
  console.error('❌ Error creating environment file:', error.message);
  console.log('');
  console.log('📝 Manual setup:');
  console.log('1. Copy env.sample to .env');
  console.log('2. Update MONGODB_URI with your MongoDB Atlas connection string');
  console.log('3. Run: npm run dev');
}
