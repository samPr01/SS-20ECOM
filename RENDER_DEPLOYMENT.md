# 🚀 Render Deployment Guide

## Backend Deployment to Render

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Connect your repository

### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select the repository: `SS-20ECOM`

### Step 3: Configure the Service

**Basic Settings:**
- **Name:** `ss-20ecom-backend`
- **Environment:** `Node`
- **Region:** Choose closest to your users
- **Branch:** `main`
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### Step 4: Environment Variables

Add these environment variables in Render dashboard:

```env
PORT=5000
MONGO_URI=mongodb+srv://rajawatp96:95847Psr.@cluster0.iqx1gad.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=ge44g2n3mkCgE2yNKUG5sLseT0xkdxhjVZJzmLro0n0=
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLIENT_URL=https://your-netlify-site.netlify.app
```

### Step 5: Update Frontend Configuration

After deployment, update your frontend environment variables:

**In Netlify Environment Variables:**
```env
VITE_API_URL=https://your-render-app.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
```

### Step 6: Test the Deployment

1. **Health Check:** `https://your-render-app.onrender.com/api/health`
2. **Test API:** `https://your-render-app.onrender.com/api/test`

### Step 7: Update CORS (Already Done)

The backend is already configured to use `CLIENT_URL` for CORS:
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:8080',
  credentials: true
}));
```

## 🔧 Troubleshooting

### Common Issues:
1. **Build Fails:** Check if all dependencies are in `package.json`
2. **Port Issues:** Ensure `PORT` environment variable is set
3. **CORS Errors:** Verify `CLIENT_URL` is correct
4. **Database Connection:** Check `MONGO_URI` format

### Logs:
- Check Render logs in the dashboard
- Monitor application performance
- Set up alerts for downtime

## 📋 Checklist

- [ ] Render account created
- [ ] Web service configured
- [ ] Environment variables set
- [ ] Build successful
- [ ] Health check passes
- [ ] Frontend updated with new API URL
- [ ] CORS working
- [ ] Database connected
- [ ] Payment integration tested

## 🎯 Next Steps

1. Deploy backend to Render
2. Get the production URL
3. Update frontend environment variables
4. Test complete flow
5. Monitor performance


