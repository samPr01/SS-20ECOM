import { spawn } from 'child_process';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_BASE_URL = 'http://localhost:5000/api';
let serverProcess = null;

// Function to wait for server to be ready
const waitForServer = async (maxAttempts = 30) => {
  console.log('⏳ Waiting for server to start...');
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        console.log('✅ Server is ready!');
        return true;
      }
    } catch (error) {
      // Server not ready yet, continue waiting
    }
    
    // Wait 1 second before next attempt
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (attempt % 5 === 0) {
      console.log(`⏳ Still waiting... (attempt ${attempt}/${maxAttempts})`);
    }
  }
  
  console.log('❌ Server failed to start within timeout');
  return false;
};

// Function to start the server
const startServer = () => {
  console.log('🚀 Starting server...');
  
  serverProcess = spawn('node', ['server.js'], {
    stdio: 'pipe',
    cwd: process.cwd()
  });
  
  // Log server output
  serverProcess.stdout.on('data', (data) => {
    console.log(`📡 Server: ${data.toString().trim()}`);
  });
  
  serverProcess.stderr.on('data', (data) => {
    console.error(`❌ Server Error: ${data.toString().trim()}`);
  });
  
  serverProcess.on('error', (error) => {
    console.error('❌ Failed to start server:', error);
  });
  
  return serverProcess;
};

// Function to stop the server
const stopServer = () => {
  if (serverProcess) {
    console.log('🛑 Stopping server...');
    serverProcess.kill('SIGTERM');
    
    // Force kill after 5 seconds if it doesn't stop gracefully
    setTimeout(() => {
      if (serverProcess && !serverProcess.killed) {
        console.log('🔨 Force killing server...');
        serverProcess.kill('SIGKILL');
      }
    }, 5000);
  }
};

// Quick test functions
const runQuickTests = async () => {
  console.log('🧪 Running Quick Backend Tests');
  console.log('================================\n');

  const results = {
    healthCheck: false,
    products: false,
    payment: false
  };

  // Test 1: Health Check
  try {
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.message);
    results.healthCheck = true;
  } catch (error) {
    console.log('❌ Health Check failed:', error.message);
  }

  // Test 2: Products
  try {
    console.log('\n2️⃣ Testing Products...');
    const productsResponse = await fetch(`${API_BASE_URL}/products`);
    const productsData = await productsResponse.json();
    console.log('✅ Products:', `${productsData.products?.length || 0} products found`);
    results.products = true;
  } catch (error) {
    console.log('❌ Products failed:', error.message);
  }

  // Test 3: Payment Test
  try {
    console.log('\n3️⃣ Testing Payment...');
    const paymentResponse = await fetch(`${API_BASE_URL}/payment/test`);
    const paymentData = await paymentResponse.json();
    console.log('✅ Payment Test:', paymentData.message);
    results.payment = true;
  } catch (error) {
    console.log('❌ Payment test failed:', error.message);
  }

  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });

  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;

  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Backend is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the logs above for details.');
  }

  return passedTests === totalTests;
};

// Main execution
const main = async () => {
  try {
    // Start server
    startServer();
    
    // Wait for server to be ready
    const serverReady = await waitForServer();
    
    if (!serverReady) {
      console.log('❌ Server failed to start. Exiting...');
      stopServer();
      process.exit(1);
    }
    
    // Run tests
    const testsPassed = await runQuickTests();
    
    // Stop server
    stopServer();
    
    // Exit with appropriate code
    process.exit(testsPassed ? 0 : 1);
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    stopServer();
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down...');
  stopServer();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down...');
  stopServer();
  process.exit(0);
});

// Start the test process
main();
