#!/bin/bash

# 🚀 Render Deployment Script
# This script helps prepare the backend for Render deployment

echo "🚀 Preparing backend for Render deployment..."

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    echo "❌ Error: backend/package.json not found. Please run this from the project root."
    exit 1
fi

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Test the backend locally
echo "🧪 Testing backend locally..."
cd backend && npm run test:quick && cd ..

echo "✅ Backend is ready for Render deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://render.com"
echo "2. Create new Web Service"
echo "3. Connect your GitHub repository"
echo "4. Set Root Directory to 'backend'"
echo "5. Set Build Command to 'npm install'"
echo "6. Set Start Command to 'npm start'"
echo "7. Add environment variables:"
echo "   - PORT=5000"
echo "   - MONGO_URI=your_mongodb_uri"
echo "   - JWT_SECRET=your_jwt_secret"
echo "   - RAZORPAY_KEY_ID=your_razorpay_key"
echo "   - RAZORPAY_KEY_SECRET=your_razorpay_secret"
echo "   - CLIENT_URL=https://your-netlify-site.netlify.app"
echo ""
echo "🔗 After deployment, update your frontend with the new API URL"


