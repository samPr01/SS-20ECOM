import express from "express";
import Stripe from "stripe";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Initialize Stripe conditionally
let stripe = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_placeholder') {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });
}

// @route   POST /api/payment/create-checkout-session
router.post("/create-checkout-session", authMiddleware, async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return res.status(503).json({
        error: "Payment service not configured",
        message: "Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables."
      });
    }

    const { items } = req.body;

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        error: "Invalid items array. Must be a non-empty array." 
      });
    }

    // Validate each item
    for (const item of items) {
      if (!item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
        return res.status(400).json({ 
          error: "Each item must have name (string), price (number), and quantity (number)" 
        });
      }
      
      if (item.price <= 0 || item.quantity <= 0) {
        return res.status(400).json({ 
          error: "Price and quantity must be greater than 0" 
        });
      }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    console.log('✅ Stripe checkout session created:', session.id);

    // Return only the URL as requested
    res.json({ url: session.url });

  } catch (err) {
    console.error('❌ Stripe checkout session creation failed:', err);
    
    // Enhanced error handling
    if (err.type === 'StripeCardError') {
      return res.status(400).json({ 
        error: "Card error occurred",
        message: err.message 
      });
    } else if (err.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ 
        error: "Invalid request to Stripe",
        message: err.message 
      });
    } else if (err.type === 'StripeAPIError') {
      return res.status(503).json({ 
        error: "Stripe service temporarily unavailable",
        message: err.message 
      });
    } else {
      return res.status(500).json({ 
        error: "Payment session creation failed",
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    }
  }
});

// @route   GET /api/payment/session/:sessionId
router.get("/session/:sessionId", authMiddleware, async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return res.status(503).json({
        error: "Payment service not configured",
        message: "Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables."
      });
    }

    const { sessionId } = req.params;
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    res.json({ 
      success: true,
      session: {
        id: session.id,
        status: session.status,
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        customer_email: session.customer_details?.email,
        created: session.created,
      }
    });

  } catch (err) {
    console.error('❌ Error retrieving session:', err);
    res.status(500).json({ 
      error: "Failed to retrieve session",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// @route   GET /api/payment/test
router.get("/test", (req, res) => {
  res.json({ 
    message: "Payment routes are working!",
    stripe_configured: !!process.env.STRIPE_SECRET_KEY,
    client_url: process.env.CLIENT_URL
  });
});

export default router;
