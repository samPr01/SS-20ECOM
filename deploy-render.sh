#!/bin/bash

echo "🚀 Render Backend Deployment Script"
echo "=================================="

# Check if backend is ready
echo "📋 Checking backend configuration..."

if [ ! -f "backend/package.json" ]; then
    echo "❌ backend/package.json not found"
    exit 1
fi

if [ ! -f "backend/server.js" ]; then
    echo "❌ backend/server.js not found"
    exit 1
fi

echo "✅ Backend files found"

# Check environment variables
echo "🔧 Checking environment variables..."

if [ -z "$MONGO_URI" ]; then
    echo "⚠️  MONGO_URI not set (will need to set in Render dashboard)"
fi

if [ -z "$JWT_SECRET" ]; then
    echo "⚠️  JWT_SECRET not set (will need to set in Render dashboard)"
fi

if [ -z "$RAZORPAY_KEY_ID" ]; then
    echo "⚠️  RAZORPAY_KEY_ID not set (will need to set in Render dashboard)"
fi

echo "✅ Environment check complete"

echo ""
echo "📋 Next Steps:"
echo "1. Go to https://dashboard.render.com/"
echo "2. Create new Web Service"
echo "3. Connect GitHub repository: samPr01/SS-20ECOM"
echo "4. Set Root Directory: backend"
echo "5. Set Build Command: npm install"
echo "6. Set Start Command: npm start"
echo "7. Add environment variables in dashboard"
echo "8. Deploy!"
echo ""
echo "🔗 Your backend will be available at: https://ss-ecom-backend.onrender.com"


