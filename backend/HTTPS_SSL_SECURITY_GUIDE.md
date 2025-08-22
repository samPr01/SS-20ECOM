# HTTPS/SSL and Security Configuration Guide - SS-20ECOM

## 🔒 **Overview**

This guide provides comprehensive instructions for enabling HTTPS/SSL and implementing robust security measures for your SS-20ECOM application across different deployment platforms.

## 📋 **Security Features Implemented**

### ✅ **Already Configured**
- **Security Headers**: Helmet.js with CSP, HSTS, XSS protection
- **CORS Protection**: Configurable origin-based access control
- **Rate Limiting**: Endpoint-specific request throttling
- **Input Sanitization**: XSS and injection attack prevention
- **Request Validation**: Comprehensive input validation and sanitization
- **Security Logging**: Suspicious request monitoring

### 🎯 **This Guide Covers**
- **HTTPS/SSL Setup** for different platforms
- **Local Development SSL** with mkcert
- **Production SSL** with Let's Encrypt
- **Security Testing** and verification
- **Best Practices** for secure deployment

---

## 🌐 **1. Production HTTPS/SSL Setup**

### **Netlify Deployment**

#### **Automatic SSL (Recommended):**
1. **Deploy to Netlify**:
   ```bash
   # Build your frontend
   npm run build
   
   # Deploy to Netlify (drag & drop dist folder or use CLI)
   netlify deploy --prod --dir=dist
   ```

2. **Enable HTTPS**:
   - Go to Netlify Dashboard → Your Site → Domain Settings
   - Under "HTTPS", click "Verify DNS configuration"
   - SSL certificate is automatically provisioned via Let's Encrypt
   - Force HTTPS redirect is enabled by default

3. **Custom Domain Setup**:
   ```bash
   # Add custom domain
   netlify sites:update --name=your-site-name --custom-domain=yourdomain.com
   ```

4. **Verify HTTPS**:
   - Visit `https://yourdomain.com`
   - Check for green lock icon in browser
   - Verify certificate details (should show Let's Encrypt)

#### **Backend API HTTPS:**
For backend deployment on Netlify Functions:

```javascript
// netlify/functions/api.js
import serverless from 'serverless-http';
import express from 'express';
import { securityHeaders, corsConfig } from '../../backend/middleware/security.js';

const app = express();

// Apply security middleware
app.use(securityHeaders);
app.use(corsConfig);

// Your API routes here
app.use('/api', yourApiRoutes);

export const handler = serverless(app);
```

### **Render Deployment**

#### **Automatic SSL:**
1. **Deploy to Render**:
   ```yaml
   # render.yaml
   services:
     - type: web
       name: ss-20ecom-backend
       env: node
       buildCommand: npm install
       startCommand: npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: MONGODB_URI
           fromDatabase:
             name: mongodb
             property: connectionString
   ```

2. **HTTPS Configuration**:
   - HTTPS is automatically enabled on Render
   - Custom domains get free SSL certificates
   - HTTP to HTTPS redirects are automatic

3. **Environment Variables**:
   ```env
   NODE_ENV=production
   CLIENT_URL=https://yourdomain.com
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-jwt-secret
   ```

### **Vercel Deployment**

#### **Automatic SSL:**
1. **Deploy with Vercel**:
   ```bash
   vercel --prod
   ```

2. **Custom Domain**:
   ```bash
   vercel domains add yourdomain.com
   ```

3. **HTTPS is automatic** - no additional configuration needed

### **AWS/DigitalOcean/VPS Deployment**

#### **Manual SSL with Let's Encrypt:**

1. **Install Certbot**:
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install certbot python3-certbot-nginx
   
   # CentOS/RHEL
   sudo yum install certbot python3-certbot-nginx
   ```

2. **Obtain SSL Certificate**:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. **Nginx Configuration**:
   ```nginx
   server {
       listen 443 ssl http2;
       server_name yourdomain.com www.yourdomain.com;
       
       ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
       
       # Security headers
       add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-Frame-Options "DENY" always;
       add_header X-XSS-Protection "1; mode=block" always;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   
   # HTTP to HTTPS redirect
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       return 301 https://$server_name$request_uri;
   }
   ```

4. **Auto-renewal**:
   ```bash
   sudo crontab -e
   # Add this line:
   0 12 * * * /usr/bin/certbot renew --quiet
   ```

---

## 🔧 **2. Local Development SSL**

### **Using mkcert (Recommended)**

#### **Installation:**
```bash
# macOS
brew install mkcert
brew install nss # for Firefox

# Linux
sudo apt install libnss3-tools
wget -O mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
chmod +x mkcert
sudo mv mkcert /usr/local/bin/

# Windows (use Chocolatey or download binary)
choco install mkcert
```

#### **Generate Local Certificates:**
```bash
# Install local CA
mkcert -install

# Generate certificates for localhost
mkcert localhost 127.0.0.1 ::1

# This creates:
# localhost+2.pem (certificate)
# localhost+2-key.pem (private key)
```

#### **Express.js HTTPS Setup:**
```javascript
// backend/server-https.js
import https from 'https';
import fs from 'fs';
import express from 'express';

const app = express();

// Your existing middleware and routes
import { securityHeaders, corsConfig } from './middleware/security.js';
app.use(securityHeaders);
app.use(corsConfig);

// HTTPS options
const httpsOptions = {
  key: fs.readFileSync('./localhost+2-key.pem'),
  cert: fs.readFileSync('./localhost+2.pem')
};

// Start HTTPS server
const PORT = process.env.PORT || 5443;
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`🔒 HTTPS Server running on https://localhost:${PORT}`);
});
```

#### **Package.json Scripts:**
```json
{
  "scripts": {
    "dev": "node server.js",
    "dev:https": "node server-https.js",
    "start": "node server.js",
    "start:https": "node server-https.js"
  }
}
```

### **Frontend Development with HTTPS:**

#### **Vite Configuration:**
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import fs from 'fs';

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('./localhost+2-key.pem'),
      cert: fs.readFileSync('./localhost+2.pem'),
    },
    host: 'localhost',
    port: 8443
  }
});
```

#### **React Development:**
```bash
# Set environment variable for HTTPS
HTTPS=true npm start

# Or in .env file
HTTPS=true
SSL_CRT_FILE=localhost+2.pem
SSL_KEY_FILE=localhost+2-key.pem
```

---

## 🛡️ **3. Security Headers Configuration**

### **Implemented Headers (via Helmet.js):**

```javascript
// Already configured in middleware/security.js
{
  "Content-Security-Policy": "default-src 'self'; script-src 'self'",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
}
```

### **Custom CSP for E-commerce:**
```javascript
// Enhanced CSP for payment integration
contentSecurityPolicy: {
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    imgSrc: ["'self'", "data:", "https:", "blob:"],
    scriptSrc: ["'self'", "https://checkout.razorpay.com"],
    connectSrc: ["'self'", "https://api.razorpay.com"],
    frameSrc: ["https://api.razorpay.com"], // For payment iframe
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    manifestSrc: ["'self'"],
    workerSrc: ["'self'"]
  }
}
```

---

## 🧪 **4. Security Testing & Verification**

### **SSL/TLS Testing:**

#### **Online Tools:**
- **SSL Labs**: https://www.ssllabs.com/ssltest/
- **Security Headers**: https://securityheaders.com/
- **Observatory**: https://observatory.mozilla.org/

#### **Command Line Testing:**
```bash
# Test SSL certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Check certificate expiration
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates

# Test HTTPS redirect
curl -I http://yourdomain.com
```

### **Security Headers Testing:**
```bash
# Test security headers
curl -I https://yourdomain.com

# Expected headers:
# strict-transport-security: max-age=31536000; includeSubDomains; preload
# x-content-type-options: nosniff
# x-frame-options: DENY
# x-xss-protection: 1; mode=block
```

### **CORS Testing:**
```bash
# Test CORS from unauthorized origin
curl -H "Origin: https://malicious-site.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://yourdomain.com/api/auth/login
```

---

## 🔒 **5. Environment-Specific Configuration**

### **Development (.env.development):**
```env
NODE_ENV=development
CLIENT_URL=https://localhost:8443
MONGODB_URI=mongodb://localhost:27017/ecommerce-dev
JWT_SECRET=dev-jwt-secret-change-in-production
SMTP_HOST=smtp.gmail.com
SMTP_USER=dev@yourdomain.com
```

### **Production (.env.production):**
```env
NODE_ENV=production
CLIENT_URL=https://yourdomain.com
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce
JWT_SECRET=super-secure-jwt-secret-256-bits-minimum
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
ADMIN_API_KEY=secure-admin-api-key
```

### **Security Environment Variables:**
```env
# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=secure-session-secret
COOKIE_SECURE=true
COOKIE_HTTP_ONLY=true
COOKIE_SAME_SITE=strict

# Monitoring
SECURITY_LOG_LEVEL=warn
ENABLE_SECURITY_LOGGING=true
```

---

## 📊 **6. Monitoring & Maintenance**

### **Security Monitoring:**
```javascript
// Enhanced security logging
import winston from 'winston';

const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'security.log', level: 'warn' }),
    new winston.transports.Console({ level: 'info' })
  ]
});

// Log security events
securityLogger.warn('Suspicious request detected', {
  ip: req.ip,
  userAgent: req.get('User-Agent'),
  url: req.originalUrl,
  timestamp: new Date().toISOString()
});
```

### **Health Checks:**
```javascript
// Security health check endpoint
app.get('/api/security/health', (req, res) => {
  const securityStatus = {
    https: req.secure,
    headers: {
      hsts: !!res.get('strict-transport-security'),
      csp: !!res.get('content-security-policy'),
      xss: !!res.get('x-xss-protection')
    },
    timestamp: new Date().toISOString()
  };
  
  res.json(securityStatus);
});
```

---

## ✅ **7. Security Checklist**

### **SSL/HTTPS:**
- [ ] SSL certificate installed and valid
- [ ] HTTPS redirect from HTTP working
- [ ] HSTS header enabled
- [ ] Certificate auto-renewal configured
- [ ] Mixed content issues resolved

### **Security Headers:**
- [ ] Content Security Policy configured
- [ ] X-Frame-Options set to DENY
- [ ] X-Content-Type-Options set to nosniff
- [ ] X-XSS-Protection enabled
- [ ] Referrer-Policy configured

### **Application Security:**
- [ ] Input validation and sanitization
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] Authentication secured with JWT
- [ ] Password hashing with bcrypt
- [ ] SQL injection prevention
- [ ] XSS attack prevention

### **Infrastructure:**
- [ ] Environment variables secured
- [ ] Database connections encrypted
- [ ] API keys rotated regularly
- [ ] Logs monitored for security events
- [ ] Backup and recovery plan

---

## 🚨 **8. Security Incident Response**

### **Monitoring Alerts:**
```javascript
// Set up alerts for suspicious activity
const ALERT_THRESHOLDS = {
  FAILED_LOGINS: 10,
  RATE_LIMIT_HITS: 50,
  SUSPICIOUS_PATTERNS: 5
};

// Example alert function
function triggerSecurityAlert(type, details) {
  console.error(`🚨 SECURITY ALERT: ${type}`, details);
  
  // Send notification (email, Slack, etc.)
  // Log to security monitoring system
  // Consider temporary IP blocking
}
```

### **Response Plan:**
1. **Identify** the security incident
2. **Contain** the threat (rate limiting, IP blocking)
3. **Investigate** logs and patterns
4. **Remediate** vulnerabilities
5. **Monitor** for continued threats
6. **Document** lessons learned

---

## 🎯 **Quick Start Commands**

### **Local Development with HTTPS:**
```bash
# Generate local certificates
mkcert -install
mkcert localhost 127.0.0.1 ::1

# Start backend with HTTPS
npm run dev:https

# Start frontend with HTTPS
HTTPS=true npm start
```

### **Production Deployment:**
```bash
# Deploy to Netlify
netlify deploy --prod --dir=dist

# Deploy to Vercel
vercel --prod

# Deploy to Render
git push origin main  # Auto-deploy on git push
```

### **Security Testing:**
```bash
# Test SSL configuration
curl -I https://yourdomain.com

# Test security headers
node test-security.js

# Run comprehensive security audit
npm audit
```

---

**🔒 Your application is now secured with industry-standard HTTPS/SSL and comprehensive security measures!**
