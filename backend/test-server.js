// backend/test-server.js
import express from 'express';
import cors from 'cors';

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  next();
});

// Simple test routes
app.get('/api/health', (req, res) => {
  console.log('🏥 Health endpoint called');
  res.json({
    success: true,
    message: 'Test server is working!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test-categories', (req, res) => {
  console.log('📂 Test categories endpoint called');
  res.json({
    success: true,
    message: 'Test categories endpoint working',
    data: [
      {
        _id: 'test1',
        name: 'Head Protection',
        icon: '⛑️',
        type: 'safety',
        status: 'active'
      },
      {
        _id: 'test2',
        name: 'Eye Protection',
        icon: '👁️',
        type: 'safety',
        status: 'active'
      }
    ],
    count: 2,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/categories', (req, res) => {
  console.log('📂 Categories endpoint called');
  res.json({
    success: true,
    message: 'Categories endpoint working - this should NOT return HTML!',
    data: [
      {
        _id: 'cat1',
        name: 'Head Protection',
        description: 'Safety helmets and hard hats',
        type: 'safety',
        icon: '⛑️',
        colors: { primary: '#FFD700', secondary: '#FFFACD' },
        status: 'active',
        sortOrder: 1,
        isFeatured: true
      },
      {
        _id: 'cat2',
        name: 'Eye Protection', 
        description: 'Safety glasses and goggles',
        type: 'safety',
        icon: '👁️',
        colors: { primary: '#4169E1', secondary: '#B0C4DE' },
        status: 'active',
        sortOrder: 2,
        isFeatured: true
      }
    ],
    count: 2,
    timestamp: new Date().toISOString()
  });
});

// Catch all other routes
app.all('*', (req, res) => {
  console.log(`❌ Unknown route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  });
});

const PORT = 5001; // Use different port to avoid conflict

app.listen(PORT, () => {
  console.log(`
🧪 TEST SERVER running on port ${PORT}
📍 Test these URLs in your browser:
   - http://localhost:${PORT}/api/health
   - http://localhost:${PORT}/api/test-categories  
   - http://localhost:${PORT}/api/categories

If these work, the problem is in your main server.js file.
If these return HTML, there's a deeper routing issue.
  `);
});