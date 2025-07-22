// backend/debug-categories.js
// Add this to your server.js file temporarily to debug

// Add this route BEFORE your other routes in server.js
app.get('/api/categories', (req, res) => {
  console.log('🔍 Categories endpoint hit directly');
  console.log('Request headers:', req.headers);
  console.log('Request URL:', req.originalUrl);
  
  // Return simple test data
  res.json({
    success: true,
    message: 'Categories endpoint working',
    data: [
      { _id: '1', name: 'Head Protection', icon: '⛑️' },
      { _id: '2', name: 'Eye Protection', icon: '👁️' },
      { _id: '3', name: 'Hand Protection', icon: '🧤' }
    ],
    timestamp: new Date().toISOString()
  });
});

// Also add this test endpoint
app.get('/api/test-categories', (req, res) => {
  console.log('🧪 Test categories endpoint hit');
  res.json({
    success: true,
    message: 'Test endpoint working - categories should work too',
    serverTime: new Date().toISOString()
  });
});