import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import { validateRegister, validateLogin, validatePasswordResetRequest, validatePasswordReset } from '../middleware/validation.js';
import { sendPasswordResetEmail } from '../utils/mailer.js';

const router = express.Router();

// POST /api/auth/register - Register new user
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Error registering user' 
    });
  }
});

// POST /api/auth/login - Login user
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error logging in' 
    });
  }
});

// POST /api/auth/reset-password-request - Request password reset
router.post('/reset-password-request', validatePasswordResetRequest, async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if user doesn't exist for security
      return res.json({ 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    }

    // Generate reset token
    const resetToken = PasswordReset.generateToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token
    const passwordReset = new PasswordReset({
      userId: user._id,
      token: resetToken,
      expiresAt
    });

    await passwordReset.save();

    // Send reset email
    const emailSent = await sendPasswordResetEmail(email, resetToken, user.name);

    if (emailSent) {
      res.json({ 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    } else {
      // Delete the reset token if email failed
      await PasswordReset.findByIdAndDelete(passwordReset._id);
      res.status(500).json({ 
        message: 'Error sending reset email. Please try again.' 
      });
    }
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ 
      message: 'Error processing password reset request' 
    });
  }
});

// POST /api/auth/reset-password - Reset password with token
router.post('/reset-password', validatePasswordReset, async (req, res) => {
  try {
    const { token, password } = req.body;

    // Find valid reset token
    const passwordReset = await PasswordReset.findOne({ 
      token, 
      used: false,
      expiresAt: { $gt: new Date() }
    }).populate('userId');

    if (!passwordReset) {
      return res.status(400).json({ 
        message: 'Invalid or expired reset token' 
      });
    }

    // Update user password
    const user = passwordReset.userId;
    user.password = password;
    await user.save();

    // Mark token as used
    passwordReset.used = true;
    await passwordReset.save();

    res.json({ 
      message: 'Password reset successfully. You can now login with your new password.' 
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ 
      message: 'Error resetting password' 
    });
  }
});

// GET /api/auth/me - Get current user profile
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid token. User not found.' 
      });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token.' 
      });
    }
    res.status(500).json({ 
      message: 'Error fetching profile' 
    });
  }
});

export default router;
