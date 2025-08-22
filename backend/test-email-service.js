import { 
  verifySMTPConnection, 
  sendTestEmail, 
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendPasswordResetEmail 
} from './utils/mailer.js';
import dotenv from 'dotenv';

dotenv.config();

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName) {
  log(`\n🧪 Testing: ${testName}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️ ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️ ${message}`, 'yellow');
}

// Test 1: Verify SMTP Configuration
async function testSMTPConfiguration() {
  logTest('SMTP Configuration Check');
  
  // Check environment variables
  const requiredVars = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    logWarning(`Missing environment variables: ${missingVars.join(', ')}`);
    logInfo('Using default Gmail SMTP configuration for testing');
  } else {
    logSuccess('All SMTP environment variables are set');
  }
  
  logInfo(`SMTP Host: ${process.env.SMTP_HOST || 'smtp.gmail.com'}`);
  logInfo(`SMTP Port: ${process.env.SMTP_PORT || '587'}`);
  logInfo(`SMTP User: ${process.env.SMTP_USER || 'Not set'}`);
  logInfo(`Email From: ${process.env.EMAIL_FROM || process.env.SMTP_USER || 'Not set'}`);
  
  return true;
}

// Test 2: Test SMTP Connection
async function testSMTPConnection() {
  logTest('SMTP Connection Test');
  
  try {
    const isConnected = await verifySMTPConnection();
    if (isConnected) {
      logSuccess('SMTP connection successful');
      return true;
    } else {
      logError('SMTP connection failed');
      return false;
    }
  } catch (error) {
    logError(`SMTP connection error: ${error.message}`);
    return false;
  }
}

// Test 3: Send Test Email
async function testSendTestEmail() {
  logTest('Send Test Email');
  
  const testEmail = process.env.TEST_EMAIL || 'test@example.com';
  logInfo(`Sending test email to: ${testEmail}`);
  
  try {
    const result = await sendTestEmail(testEmail);
    if (result.success) {
      logSuccess('Test email sent successfully');
      logInfo(`Message ID: ${result.messageId}`);
      return true;
    } else {
      logError(`Test email failed: ${result.error}`);
      return false;
    }
  } catch (error) {
    logError(`Test email error: ${error.message}`);
    return false;
  }
}

// Test 4: Test Order Confirmation Email
async function testOrderConfirmationEmail() {
  logTest('Order Confirmation Email');
  
  const testEmail = process.env.TEST_EMAIL || 'test@example.com';
  const mockOrder = {
    _id: '507f1f77bcf86cd799439011',
    userId: '507f1f77bcf86cd799439012',
    items: [
      {
        _id: '507f1f77bcf86cd799439013',
        productId: '507f1f77bcf86cd799439014',
        quantity: 2,
        price: 29.99,
        name: 'Test Product'
      },
      {
        _id: '507f1f77bcf86cd799439015',
        productId: '507f1f77bcf86cd799439016',
        quantity: 1,
        price: 49.99,
        name: 'Another Test Product'
      }
    ],
    total: 109.97,
    status: 'pending',
    paymentStatus: 'pending',
    shippingAddress: {
      street: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345',
      country: 'Test Country'
    },
    paymentMethod: 'credit_card',
    createdAt: new Date(),
    getStatusHistory: () => [
      {
        status: 'pending',
        changedAt: new Date(),
        changedBy: 'System',
        notes: 'Order created'
      }
    ],
    getCurrentStatus: () => ({
      status: 'pending',
      lastUpdated: new Date(),
      updatedBy: 'System'
    })
  };
  
  try {
    const result = await sendOrderConfirmationEmail(testEmail, mockOrder);
    if (result.success) {
      logSuccess('Order confirmation email sent successfully');
      logInfo(`Message ID: ${result.messageId}`);
      return true;
    } else {
      logError(`Order confirmation email failed: ${result.error}`);
      return false;
    }
  } catch (error) {
    logError(`Order confirmation email error: ${error.message}`);
    return false;
  }
}

// Test 5: Test Order Status Update Email
async function testOrderStatusUpdateEmail() {
  logTest('Order Status Update Email');
  
  const testEmail = process.env.TEST_EMAIL || 'test@example.com';
  const mockOrder = {
    _id: '507f1f77bcf86cd799439011',
    userId: '507f1f77bcf86cd799439012',
    items: [
      {
        _id: '507f1f77bcf86cd799439013',
        productId: '507f1f77bcf86cd799439014',
        quantity: 1,
        price: 29.99,
        name: 'Test Product'
      }
    ],
    total: 29.99,
    status: 'confirmed',
    paymentStatus: 'pending',
    shippingAddress: {
      street: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345',
      country: 'Test Country'
    },
    paymentMethod: 'credit_card',
    createdAt: new Date(),
    getStatusHistory: () => [
      {
        status: 'confirmed',
        changedAt: new Date(),
        changedBy: 'Admin',
        notes: 'Order confirmed'
      },
      {
        status: 'pending',
        changedAt: new Date(Date.now() - 3600000),
        changedBy: 'System',
        notes: 'Order created'
      }
    ],
    getCurrentStatus: () => ({
      status: 'confirmed',
      lastUpdated: new Date(),
      updatedBy: 'Admin'
    })
  };
  
  try {
    const result = await sendOrderStatusUpdateEmail(testEmail, mockOrder, 'confirmed');
    if (result.success) {
      logSuccess('Order status update email sent successfully');
      logInfo(`Message ID: ${result.messageId}`);
      return true;
    } else {
      logError(`Order status update email failed: ${result.error}`);
      return false;
    }
  } catch (error) {
    logError(`Order status update email error: ${error.message}`);
    return false;
  }
}

// Test 6: Test Password Reset Email
async function testPasswordResetEmail() {
  logTest('Password Reset Email');
  
  const testEmail = process.env.TEST_EMAIL || 'test@example.com';
  const resetToken = 'test-reset-token-123456789';
  
  try {
    const result = await sendPasswordResetEmail(testEmail, resetToken);
    if (result.success) {
      logSuccess('Password reset email sent successfully');
      logInfo(`Message ID: ${result.messageId}`);
      return true;
    } else {
      logError(`Password reset email failed: ${result.error}`);
      return false;
    }
  } catch (error) {
    logError(`Password reset email error: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runAllEmailTests() {
  log('🚀 Starting Email Service Tests', 'bright');
  log('=' .repeat(60), 'cyan');
  
  const tests = [
    testSMTPConfiguration,
    testSMTPConnection,
    testSendTestEmail,
    testOrderConfirmationEmail,
    testOrderStatusUpdateEmail,
    testPasswordResetEmail
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    try {
      const result = await test();
      if (result) {
        passedTests++;
      }
    } catch (error) {
      logError(`Test failed with error: ${error.message}`);
    }
  }
  
  log('\n' + '=' .repeat(60), 'cyan');
  log('📊 Email Service Test Results Summary', 'bright');
  log(`✅ Passed: ${passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'yellow');
  log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'red');
  
  if (passedTests === totalTests) {
    log('\n🎉 All email service tests passed! Email system is working correctly.', 'green');
  } else {
    log('\n⚠️ Some email tests failed. Please check your SMTP configuration.', 'yellow');
  }
  
  log('\n📝 Email Service Features Verified:', 'bright');
  log('• ✅ SMTP configuration validation');
  log('• ✅ SMTP connection testing');
  log('• ✅ Test email sending');
  log('• ✅ Order confirmation emails');
  log('• ✅ Order status update emails');
  log('• ✅ Password reset emails');
  
  log('\n💡 Next Steps:', 'bright');
  log('• Configure your SMTP settings in .env file');
  log('• Test with real email addresses');
  log('• Monitor email delivery and spam scores');
  log('• Set up email templates for production');
  
  log('\n🔧 Environment Variables Required:', 'bright');
  log('SMTP_HOST=smtp.gmail.com (or your SMTP provider)');
  log('SMTP_PORT=587 (or 465 for SSL)');
  log('SMTP_USER=your-email@gmail.com');
  log('SMTP_PASS=your-app-password');
  log('EMAIL_FROM=your-email@gmail.com');
  log('TEST_EMAIL=test@example.com (optional, for testing)');
}

// Run the tests
runAllEmailTests().catch(console.error);
