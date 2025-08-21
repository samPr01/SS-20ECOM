# 🚀 Render Backend Deployment Guide

## Prerequisites
- Render account (free tier available)
- MongoDB Atlas database (free tier available)
- Razorpay test account

## Step 1: Deploy Backend to Render

### 1.1 Create New Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `samPr01/SS-20ECOM`

### 1.2 Configure Build Settings
```
Name: ss-ecom-backend
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

### 1.3 Environment Variables
Add these environment variables in Render dashboard:

```env
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_here
CLIENT_URL=https://your-frontend-app.netlify.app
NODE_ENV=production
```

### 1.4 Deploy
- Click "Create Web Service"
- Wait for deployment to complete
- Your backend URL will be: `https://ss-ecom-backend.onrender.com`

## Step 2: Test Backend Deployment

### 2.1 Health Check
```bash
curl https://ss-ecom-backend.onrender.com/api/health
```

### 2.2 Products Endpoint
```bash
curl https://ss-ecom-backend.onrender.com/api/products
```

## Step 3: Update Frontend Environment

### 3.1 Update .env files
```env
VITE_API_URL=https://ss-ecom-backend.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_here
```

## Troubleshooting

### Common Issues:
1. **Build fails**: Check Node.js version (should be 18+)
2. **Database connection fails**: Verify MONGO_URI is correct
3. **CORS errors**: Ensure CLIENT_URL is set correctly
4. **JWT errors**: Verify JWT_SECRET is set

### Logs:
- Check Render logs in dashboard
- Monitor application logs for errors
- Verify environment variables are set correctly


