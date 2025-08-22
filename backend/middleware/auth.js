import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to verify JWT token
export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          error: 'Invalid token. User not found.' 
        });
      }

      // Add user to request object
      req.user = user;
      next();
      
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ 
        error: 'Invalid token.' 
      });
    }
    
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      error: 'Server error in authentication.' 
    });
  }
};

// Optional auth middleware (doesn't fail if no token)
export const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (user) {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but we don't fail the request
        console.log('Optional auth: Invalid token provided');
      }
    }
    
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};

// Admin middleware (requires admin role)
export const adminMiddleware = async (req, res, next) => {
  try {
    // First verify authentication
    await authMiddleware(req, res, (err) => {
      if (err) return next(err);
    });

    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ 
        error: 'Access denied. Admin privileges required.' 
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ 
      error: 'Server error in admin authentication.' 
    });
  }
};

// Simple admin check middleware (for now, allow any authenticated user as admin)
// In production, you would check for admin role in the user model
export const simpleAdminMiddleware = async (req, res, next) => {
  try {
    // First verify authentication
    await authMiddleware(req, res, (err) => {
      if (err) return next(err);
    });

    // For now, allow any authenticated user to perform admin actions
    // In production, you would check: if (!req.user.isAdmin) return 403
    next();
  } catch (error) {
    console.error('Simple admin middleware error:', error);
    return res.status(500).json({ 
      error: 'Server error in admin authentication.' 
    });
  }
};
