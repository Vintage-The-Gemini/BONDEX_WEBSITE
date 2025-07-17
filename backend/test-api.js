// backend/test-api.js
// Simple script to test your APIs

const BASE_URL = 'http://localhost:5000/api';

// Test registration
async function testRegistration() {
  console.log('🔍 Testing user registration...');
  
  const userData = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '+254712345678',
    address: {
      street: '123 Kenyatta Avenue',
      city: 'Nairobi',
      county: 'Nairobi',
      country: 'Kenya'
    }
  };

  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Registration successful!');
      console.log('📧 Email:', result.user.email);
      console.log('🔑 Token:', result.token.substring(0, 20) + '...');
      return result.token;
    } else {
      console.log('❌ Registration failed:', result.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Registration error:', error.message);
    return null;
  }
}

// Test login
async function testLogin() {
  console.log('\n🔍 Testing user login...');
  
  const loginData = {
    email: 'john@example.com',
    password: 'password123'
  };

  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Login successful!');
      console.log('👤 User:', result.user.name);
      console.log('🔑 Token:', result.token.substring(0, 20) + '...');
      return result.token;
    } else {
      console.log('❌ Login failed:', result.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
    return null;
  }
}

// Test protected route
async function testProtectedRoute(token) {
  console.log('\n🔍 Testing protected route...');
  
  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Protected route access successful!');
      console.log('👤 User data:', result.user.name);
      console.log('📧 Email:', result.user.email);
      return true;
    } else {
      console.log('❌ Protected route failed:', result.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Protected route error:', error.message);
    return false;
  }
}

// Test products (public route)
async function testPublicRoute() {
  console.log('\n🔍 Testing public route (products)...');
  
  try {
    const response = await fetch(`${BASE_URL}/products`);
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Public route access successful!');
      console.log('📦 Products count:', result.count || 0);
      return true;
    } else {
      console.log('❌ Public route failed:', result.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Public route error:', error.message);
    return false;
  }
}

// Test cart (protected route)
async function testCart(token) {
  console.log('\n🔍 Testing cart (protected route)...');
  
  try {
    const response = await fetch(`${BASE_URL}/cart`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Cart access successful!');
      console.log('🛒 Cart items:', result.data?.summary?.totalItems || 0);
      return true;
    } else {
      console.log('❌ Cart access failed:', result.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Cart error:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting API Tests\n');
  
  // Test public route first
  await testPublicRoute();
  
  // Test registration
  let token = await testRegistration();
  
  // If registration fails (user exists), try login
  if (!token) {
    console.log('\n🔄 Registration failed, trying login...');
    token = await testLogin();
  }
  
  if (token) {
    // Test protected routes
    await testProtectedRoute(token);
    await testCart(token);
    
    console.log('\n✅ All tests completed!');
    console.log('\n📋 How to use this token in your requests:');
    console.log('Headers: { "Authorization": "Bearer ' + token.substring(0, 20) + '..." }');
  } else {
    console.log('\n❌ Could not get authentication token');
  }
}

// Run the tests
runTests().catch(console.error);