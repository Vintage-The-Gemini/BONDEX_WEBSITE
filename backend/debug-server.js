// backend/debug-server.js
// Run this to isolate the exact problem
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Minimal middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Detailed request logging
app.use((req, res, next) => {
  console.log('\n' + '='.repeat(50));
  console.log(`📝 REQUEST: ${req.method} ${req.originalUrl}`);
  console.log('📝 Headers:', JSON.stringify(req.headers, null, 2));
  console.log('📝 Query:', JSON.stringify(req.query, null, 2));
  console.log('📝 Timestamp:', new Date().toISOString());
  console.log('='.repeat(50) + '\n');
  next();
});

// Add response logging
app.use((req, res, next) => {
  const originalJson = res.json;
  const originalSend = res.send;
  
  res.json = function(obj) {
    console.log('📤 RESPONSE JSON:', JSON.stringify(obj, null, 2));
    console.log('📤 Content-Type will be:', 'application/json');
    return originalJson.call(this, obj);
  };
  
  res.send = function(data) {
    console.log('📤 RESPONSE SEND:', typeof data, data.substring ? data.substring(0, 100) + '...' : data);
    return originalSend.call(this, data);
  };
  
  next();
});

// Test routes - EXACTLY what should work
app.get('/api/categories', (req, res) => {
  console.log('🎯 CATEGORIES ENDPOINT HIT!');
  console.log('🎯 About to send JSON response...');
  
  const responseData = {
    success: true,
    message: 'Categories endpoint working correctly',
    data: [
      {
        _id: 'test123',
        name: 'Head Protection',
        icon: '⛑️',
        type: 'safety',
        status: 'active'
      }
    ],
    count: 1,
    timestamp: new Date().toISOString(),
    server: 'debug-server'
  };
  
  console.log('🎯 Response data prepared:', responseData);
  
  // Force content type
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(responseData);
});

app.get('/api/health', (req, res) => {
  console.log('🏥 HEALTH CHECK HIT!');
  res.json({
    success: true,
    message: 'Debug server working',
    timestamp: new Date().toISOString()
  });
});

// Catch all other routes
app.all('*', (req, res) => {
  console.log('❌ UNKNOWN ROUTE HIT:', req.method, req.originalUrl);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    availableRoutes: ['/api/health', '/api/categories']
  });
});

const PORT = 5000; // Same port as your main server

app.listen(PORT, () => {
  console.log(`
🔥 DEBUG SERVER RUNNING ON PORT ${PORT}
🔥 This will help us find the exact problem!

📋 Test these URLs:
   🌐 http://localhost:${PORT}/api/health
   🌐 http://localhost:${PORT}/api/categories

📝 Watch the console output carefully!
  `);
});