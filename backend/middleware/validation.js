import { body, validationResult, param, query } from 'express-validator';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Initialize DOMPurify for server-side sanitization
const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Security sanitization functions
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove HTML tags and sanitize
  let sanitized = purify.sanitize(input, { ALLOWED_TAGS: [] });
  
  // Additional sanitization for common injection patterns
  sanitized = sanitized
    .replace(/[<>]/g, '') // Remove any remaining angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
    
  return sanitized;
};

// Advanced validation chains
export const createSecureValidationChain = (field, type = 'string', options = {}) => {
  let chain = body(field);
  
  // Basic sanitization
  chain = chain.customSanitizer(sanitizeInput);
  
  switch (type) {
    case 'email':
      chain = chain
        .isEmail()
        .withMessage(`${field} must be a valid email`)
        .normalizeEmail()
        .isLength({ max: 254 })
        .withMessage(`${field} must not exceed 254 characters`);
      break;
      
    case 'password':
      chain = chain
        .isLength({ min: 8, max: 128 })
        .withMessage(`${field} must be between 8 and 128 characters`)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage(`${field} must contain at least one uppercase letter, lowercase letter, number, and special character`);
      break;
      
    case 'name':
      chain = chain
        .isLength({ min: 1, max: 100 })
        .withMessage(`${field} must be between 1 and 100 characters`)
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage(`${field} can only contain letters, spaces, hyphens, and apostrophes`);
      break;
      
    case 'phone':
      chain = chain
        .matches(/^[\+]?[1-9][\d]{0,15}$/)
        .withMessage(`${field} must be a valid phone number`);
      break;
      
    case 'url':
      chain = chain
        .isURL({ protocols: ['http', 'https'], require_protocol: true })
        .withMessage(`${field} must be a valid URL`);
      break;
      
    case 'alphanumeric':
      chain = chain
        .isAlphanumeric()
        .withMessage(`${field} can only contain letters and numbers`)
        .isLength({ min: options.min || 1, max: options.max || 50 });
      break;
      
    default:
      chain = chain
        .isLength({ min: options.min || 0, max: options.max || 500 })
        .withMessage(`${field} must be between ${options.min || 0} and ${options.max || 500} characters`);
  }
  
  // Apply custom options
  if (options.optional) {
    chain = chain.optional();
  }
  
  if (options.notEmpty !== false) {
    chain = chain.notEmpty().withMessage(`${field} is required`);
  }
  
  return chain;
};

// Validation result handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

// User registration validation with enhanced security
export const validateRegister = [
  createSecureValidationChain('name', 'name'),
  createSecureValidationChain('email', 'email'),
  createSecureValidationChain('password', 'password'),
  handleValidationErrors
];

// User login validation with enhanced security
export const validateLogin = [
  createSecureValidationChain('email', 'email'),
  body('password')
    .customSanitizer(sanitizeInput)
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ max: 128 })
    .withMessage('Password too long'),
  handleValidationErrors
];

// Password reset request validation
export const validatePasswordResetRequest = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  handleValidationErrors
];

// Password reset validation
export const validatePasswordReset = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  handleValidationErrors
];

// Product validation
export const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isIn(['electronics', 'clothing', 'books', 'home', 'sports', 'other'])
    .withMessage('Invalid category'),
  body('image')
    .isURL()
    .withMessage('Please provide a valid image URL'),
  handleValidationErrors
];

// Cart item validation
export const validateCartItem = [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  handleValidationErrors
];

// Order status update validation
export const validateOrderStatusUpdate = [
  body('status')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  body('notes')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters'),
  handleValidationErrors
];

// Order validation
export const validateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('shippingAddress.street')
    .notEmpty()
    .withMessage('Street address is required'),
  body('shippingAddress.city')
    .notEmpty()
    .withMessage('City is required'),
  body('shippingAddress.state')
    .notEmpty()
    .withMessage('State is required'),
  body('shippingAddress.zipCode')
    .notEmpty()
    .withMessage('ZIP code is required'),
  body('paymentMethod')
    .isIn(['credit_card', 'paypal', 'cash_on_delivery'])
    .withMessage('Invalid payment method'),
  handleValidationErrors
];
