// API Configuration
const isDevelopment = import.meta.env.DEV;

// Use environment variable for API URL, fallback to localhost for development
export const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : isDevelopment 
    ? 'http://localhost:5000/api'
    : 'https://your-backend.onrender.com/api';

// Razorpay Configuration
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_XXXXXXXXXXXX';

// App Configuration
export const APP_CONFIG = {
  name: 'E-Commerce Store',
  version: '1.0.0',
  apiUrl: API_BASE_URL,
  razorpayKey: RAZORPAY_KEY_ID,
};


