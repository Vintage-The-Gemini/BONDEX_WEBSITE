// backend/debug-server.js
// Run this to isolate the exact problem
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Ultra-permissive CORS for testing
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['*']
}));

app.use(express.json());

// Detailed request logging
app.use((req, res, next) => {
  console.log('\n' + '='.repeat(60));
  console.log(`🔍 INCOMING REQUEST`);
  console.log(`📝 Method: ${req.method}`);
  console.log(`📝 URL: ${req.originalUrl}`);
  console.log(`📝 Origin: ${req.headers.origin || 'NO ORIGIN'}`);
  console.log(`📝 User-Agent: ${req.headers['user-agent'] || 'NO USER AGENT'}`);
  console.log(`📝 Content-Type: ${req.headers['content-type'] || 'NO CONTENT TYPE'}`);
  console.log(`📝 Timestamp: ${new Date().toISOString()}`);
  console.log('='.repeat(60));
  next();
});

// Response logging
app.use((req, res, next) => {
  const originalJson = res.json;
  const originalSend = res.send;
  
  res.json = function(obj) {
    console.log(`✅ SENDING JSON for ${req.originalUrl}:`);
    console.log(`✅ Status: ${res.statusCode}`);
    console.log(`✅ Data:`, JSON.stringify(obj, null, 2));
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return originalJson.call(this, obj);
  };
  
  res.send = function(data) {
    console.log(`📤 SENDING DATA for ${req.originalUrl}:`);
    console.log(`📤 Type:`, typeof data);
    console.log(`📤 Content:`, data?.substring ? data.substring(0, 200) + '...' : data);
    return originalSend.call(this, data);
  };
  
  next();
});

// Test endpoints
app.get('/api/health', (req, res) => {
  console.log('🏥 HEALTH ENDPOINT HIT - SHOULD RETURN JSON');
  
  const healthData = {
    success: true,
    message: 'Debug server health check OK',
    timestamp: new Date().toISOString(),
    server: 'debug-server',
    currency: 'KES'
  };
  
  console.log('🏥 About to send health response...');
  res.status(200).json(healthData);
});

app.get('/api/categories', (req, res) => {
  console.log('📂 CATEGORIES ENDPOINT HIT - SHOULD RETURN JSON');
  
  const categoriesData = {
    success: true,
    message: 'Categories from debug server',
    data: [
      {
        _id: 'debug-cat-1',
        name: 'Head Protection',
        description: 'Safety helmets and hard hats - Test Data',
        type: 'safety',
        icon: '⛑️',
        colors: { primary: '#FFD700', secondary: '#FFFACD' },
        status: 'active',
        sortOrder: 1,
        isFeatured: true,
        currency: 'KES'
      },
      {
        _id: 'debug-cat-2',
        name: 'Eye Protection',
        description: 'Safety glasses and goggles - Test Data',
        type: 'safety',
        icon: '👁️',
        colors: { primary: '#4169E1', secondary: '#B0C4DE' },
        status: 'active',
        sortOrder: 2,
        isFeatured: true,
        currency: 'KES'
      }
    ],
    count: 2,
    timestamp: new Date().toISOString(),
    server: 'debug-server'
  };
  
  console.log('📂 About to send categories response...');
  res.status(200).json(categoriesData);
});

// Catch-all for debugging
app.all('*', (req, res) => {
  console.log(`❌ UNKNOWN ROUTE HIT: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Debug server - Route not found: ${req.method} ${req.originalUrl}`,
    availableRoutes: [
      'GET /api/health',
      'GET /api/categories'
    ],
    timestamp: new Date().toISOString()
  });
});

const PORT = 5001; // Different port to avoid conflicts

app.listen(PORT, () => {
  console.log(`
🧪🧪🧪 DEBUG SERVER RUNNING 🧪🧪🧪
📍 Port: ${PORT}
🎯 This server ONLY tests CORS and JSON responses

📋 TEST THESE URLs IN YOUR BROWSER:
   🌐 http://localhost:${PORT}/api/health
   🌐 http://localhost:${PORT}/api/categories

💡 If these work but localhost:5000 doesn't, the problem is in your main server.js
💡 If these return HTML instead of JSON, there's a routing issue
💡 Watch the console output for detailed debugging info

🔧 Next Steps:
   1. Test these URLs in your browser
   2. Check if you get JSON responses
   3. Compare with your main server on port 5000
  `);
});