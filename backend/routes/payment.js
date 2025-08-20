import express from "express";
import Stripe from "stripe";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Initialize Stripe with test mode
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// @route   POST /api/payment/create-checkout-session
router.post("/create-checkout-session", authMiddleware, async (req, res) => {
  try {
    const { items, successUrl, cancelUrl } = req.body;

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        error: "Invalid items array. Must be a non-empty array." 
      });
    }

    // Validate each item
    for (const item of items) {
      if (!item.name || !item.price || !item.quantity) {
        return res.status(400).json({ 
          error: "Each item must have name, price, and quantity" 
        });
      }
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: item.description || `Quantity: ${item.quantity}`,
            images: item.image ? [item.image] : undefined,
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents and ensure integer
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: successUrl || `${process.env.CLIENT_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.CLIENT_URL || 'http://localhost:3000'}/cart`,
      metadata: {
        total_amount: totalAmount.toString(),
        item_count: items.length.toString(),
      },
      // Test mode specific settings
      payment_method_collection: 'always',
      allow_promotion_codes: true,
    });

    console.log('✅ Stripe checkout session created:', session.id);

    res.json({ 
      success: true,
      sessionId: session.id, 
      url: session.url,
      totalAmount: totalAmount
    });

  } catch (err) {
    console.error('❌ Stripe checkout session creation failed:', err);
    res.status(500).json({ 
      error: "Payment session creation failed",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// @route   GET /api/payment/session/:sessionId
router.get("/session/:sessionId", authMiddleware, async (req, res) => {
  try {
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

export default router;
