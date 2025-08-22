import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// Security Headers Configuration
export const securityHeaders = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.razorpay.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"],
      workerSrc: ["'self'"]
    }
  },
  
  // Cross-Origin Embedder Policy
  crossOriginEmbedderPolicy: false, // Set to true for stricter security
  
  // Cross-Origin Opener Policy
  crossOriginOpenerPolicy: { policy: "same-origin" },
  
  // Cross-Origin Resource Policy
  crossOriginResourcePolicy: { policy: "cross-origin" },
  
  // DNS Prefetch Control
  dnsPrefetchControl: { allow: false },
  
  // Expect Certificate Transparency
  expectCt: {
    maxAge: 86400,
    enforce: true
  },
  
  // Force HTTPS
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  
  // IE No Open
  ieNoOpen: true,
  
  // No Sniff
  noSniff: true,
  
  // Origin Agent Cluster
  originAgentCluster: true,
  
  // Permissions Policy
  permittedCrossDomainPolicies: false,
  
  // Referrer Policy
  referrerPolicy: { policy: "no-referrer" },
  
  // X-Frame-Options
  frameguard: { action: 'deny' },
  
  // X-Powered-By
  hidePoweredBy: true,
  
  // X-XSS-Protection
  xssFilter: true
});

// CORS Configuration
export const corsConfig = cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Define allowed origins based on environment
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? [
          process.env.CLIENT_URL,
          process.env.FRONTEND_URL,
          'https://yourfrontenddomain.com' // Replace with your actual domain
        ].filter(Boolean)
      : [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:8080',
          'http://127.0.0.1:3000',
          'http://127.0.0.1:8080'
        ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('CORS policy violation: Origin not allowed'));
    }
  },
  
  // Allow credentials (cookies, authorization headers)
  credentials: true,
  
  // Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  
  // Allowed headers
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-CSRF-Token'
  ],
  
  // Exposed headers
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  
  // Preflight cache duration
  maxAge: 86400 // 24 hours
});

// Rate Limiting Configuration
export const createRateLimit = (windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests') => {
  return rateLimit({
    windowMs, // Time window in milliseconds
    max, // Max requests per window
    message: {
      error: message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false,
    
    // Custom key generator (can be used for user-based limiting)
    keyGenerator: (req) => {
      return req.ip || req.connection.remoteAddress;
    },
    
    // Skip successful requests in count
    skipSuccessfulRequests: false,
    
    // Skip failed requests in count
    skipFailedRequests: false,
    
    // Custom handler for rate limit exceeded
    handler: (req, res) => {
      res.status(429).json({
        error: message,
        retryAfter: Math.ceil(windowMs / 1000),
        limit: max,
        current: req.rateLimit.current,
        remaining: req.rateLimit.remaining,
        resetTime: new Date(Date.now() + req.rateLimit.resetTime)
      });
    }
  });
};

// Specific rate limiters for different endpoints
export const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many authentication attempts, please try again later'
);

export const generalRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'Too many requests from this IP, please try again later'
);

export const passwordResetRateLimit = createRateLimit(
  60 * 60 * 1000, // 1 hour
  3, // 3 attempts
  'Too many password reset attempts, please try again later'
);

export const orderRateLimit = createRateLimit(
  60 * 1000, // 1 minute
  10, // 10 orders per minute
  'Too many order attempts, please slow down'
);

// API Key validation middleware (for admin routes)
export const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.ADMIN_API_KEY;
  
  if (!validApiKey) {
    return next(); // Skip if no API key is configured
  }
  
  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      error: 'Invalid or missing API key'
    });
  }
  
  next();
};

// Request sanitization middleware
export const sanitizeRequest = (req, res, next) => {
  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  
  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }
  
  // Sanitize URL parameters
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }
  
  next();
};

// Helper function to sanitize objects recursively
const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return sanitizeString(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    const sanitizedKey = sanitizeString(key);
    sanitized[sanitizedKey] = sanitizeObject(value);
  }
  
  return sanitized;
};

// Helper function to sanitize strings
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  
  // Remove potential XSS patterns
  return str
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data: protocol (except for images)
    .trim();
};

// Security logging middleware
export const securityLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');
  const method = req.method;
  const url = req.originalUrl;
  
  // Log potentially suspicious requests
  const suspiciousPatterns = [
    /\.\./,  // Directory traversal
    /<script/i, // XSS attempts
    /union.*select/i, // SQL injection
    /javascript:/i, // JavaScript protocol
    /eval\(/i, // Code injection
    /base64/i // Base64 encoded payloads
  ];
  
  const isSuspicious = suspiciousPatterns.some(pattern => 
    pattern.test(url) || pattern.test(JSON.stringify(req.body))
  );
  
  if (isSuspicious) {
    console.warn(`🚨 SUSPICIOUS REQUEST: ${timestamp} | IP: ${ip} | ${method} ${url} | UA: ${userAgent}`);
  }
  
  next();
};

// Content type validation
export const validateContentType = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.get('Content-Type');
    
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        error: 'Content-Type must be application/json'
      });
    }
  }
  
  next();
};

export default {
  securityHeaders,
  corsConfig,
  createRateLimit,
  authRateLimit,
  generalRateLimit,
  passwordResetRateLimit,
  orderRateLimit,
  validateApiKey,
  sanitizeRequest,
  securityLogger,
  validateContentType
};
