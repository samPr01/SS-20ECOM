// API Configuration
const isDevelopment = import.meta.env.DEV;

// Development: localhost, Production: deployed backend URL
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000/api'
  : 'https://your-backend.onrender.com/api';

// Stripe Configuration
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key';

// App Configuration
export const APP_CONFIG = {
  name: 'E-Commerce Store',
  version: '1.0.0',
  apiUrl: API_BASE_URL,
  stripeKey: STRIPE_PUBLISHABLE_KEY,
};
