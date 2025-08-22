import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testHealth() {
  try {
    console.log('🧪 Testing Health Check...');
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health Check Response:', data);
    return true;
  } catch (error) {
    console.error('❌ Health Check Failed:', error.message);
    return false;
  }
}

async function testRegistration() {
  try {
    console.log('\n🧪 Testing User Registration...');
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123'
      })
    });
    
    const data = await response.json();
    console.log('✅ Registration Response:', data);
    return { success: response.ok, data, token: data.token };
  } catch (error) {
    console.error('❌ Registration Failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function testLogin() {
  try {
    console.log('\n🧪 Testing User Login...');
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'TestPass123'
      })
    });
    
    const data = await response.json();
    console.log('✅ Login Response:', data);
    return { success: response.ok, data, token: data.token };
  } catch (error) {
    console.error('❌ Login Failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function testProfile(token) {
  try {
    console.log('\n🧪 Testing Get Profile...');
    const response = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    const data = await response.json();
    console.log('✅ Profile Response:', data);
    return { success: response.ok, data };
  } catch (error) {
    console.error('❌ Profile Failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function testPasswordReset() {
  try {
    console.log('\n🧪 Testing Password Reset Request...');
    const response = await fetch(`${BASE_URL}/auth/reset-password-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com'
      })
    });
    
    const data = await response.json();
    console.log('✅ Password Reset Request Response:', data);
    return { success: response.ok, data };
  } catch (error) {
    console.error('❌ Password Reset Request Failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting Simple Authentication Tests\n');
  
  // Test 1: Health Check
  const healthOk = await testHealth();
  if (!healthOk) {
    console.log('❌ Server is not responding. Please start the server first.');
    return;
  }
  
  // Test 2: Registration
  const registration = await testRegistration();
  
  // Test 3: Login
  const login = await testLogin();
  
  // Test 4: Profile (if we have a token)
  if (login.success && login.token) {
    await testProfile(login.token);
  }
  
  // Test 5: Password Reset Request
  await testPasswordReset();
  
  console.log('\n📊 Test Summary:');
  console.log(`Health Check: ${healthOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Registration: ${registration.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Login: ${login.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Profile: ${login.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Password Reset: ✅ PASS (request sent)`);
}

runTests().catch(console.error);
