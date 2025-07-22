// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// ES6 __dirname alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables FIRST
dotenv.config();

// Import database connection
import connectDB from './config/database.js';

// Import routes
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import adminProductRoutes from './routes/adminProductRoutes.js';
import debugRoutes from './routes/debugRoutes.js';

// Import error handlers
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Connect to database
connectDB();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// 1. CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      process.env.CLIENT_URL
    ].filter(Boolean);
    
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'x-csrf-token', 
    'Origin',
    'X-Requested-With',
    'Accept'
  ]
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// 2. Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 3. Security middleware
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
} else {
  app.use(helmet({ contentSecurityPolicy: false }));
}

// 4. Data sanitization
app.use(mongoSanitize());
app.use(hpp({
  whitelist: ['price', 'category', 'rating', 'brand', 'sort', 'fields']
}));

// 5. Compression
app.use(compression());

// 6. Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 7. 🔍 DEBUG LOGGING - This will help us trace requests
app.use((req, res, next) => {
  console.log(`🌐 INCOMING: ${req.method} ${req.originalUrl}`);
  console.log(`🌐 Origin: ${req.headers.origin || 'no-origin'}`);
  console.log(`🔑 Auth: ${req.headers.authorization ? 'Bearer token present' : 'No auth header'}`);
  
  // Intercept res.json to confirm JSON responses
  const originalJson = res.json;
  res.json = function(data) {
    console.log(`✅ SENDING JSON for ${req.originalUrl} - Status: ${res.statusCode}`);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return originalJson.call(this, data);
  };
  
  next();
});

// ============================================
// RATE LIMITING
// ============================================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // Limit each IP to 100 requests per windowMs in production
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use('/api/', limiter);

// ============================================
// ✅ API ROUTES FIRST - BEFORE STATIC FILES
// ============================================

console.log('🚀 Registering API routes...');

// Health check endpoint - PRIORITY #1
app.get('/api/health', (req, res) => {
  console.log('🏥 Health endpoint hit directly');
  res.status(200).json({
    success: true,
    message: 'BONDEX Safety API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    currency: 'KES',
    server: 'main-server',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('🧪 Test endpoint hit directly');
  res.status(200).json({
    success: true,
    message: 'API test endpoint working perfectly',
    server: 'Bondex Safety Backend',
    timestamp: new Date().toISOString(),
    currency: 'KES',
    testData: {
      sampleProduct: {
        name: 'Safety Helmet',
        price: 'KES 2,500',
        category: 'Head Protection'
      }
    }
  });
});

// DEBUG ROUTES (REMOVE IN PRODUCTION!)
if (process.env.NODE_ENV === 'development') {
  try {
    app.use('/api/debug', debugRoutes);
    console.log('🔧 Debug routes registered at /api/debug (DEVELOPMENT ONLY)');
  } catch (error) {
    console.error('❌ Error registering debug routes:', error.message);
  }
}

// Register all API routes in correct order
try {
  app.use('/api/categories', categoryRoutes);
  console.log('✅ Categories routes registered at /api/categories');
} catch (error) {
  console.error('❌ Error registering category routes:', error.message);
}

try {
  app.use('/api/products', productRoutes);
  console.log('✅ Product routes registered at /api/products');
} catch (error) {
  console.error('❌ Error registering product routes:', error.message);
}

try {
  app.use('/api/upload', uploadRoutes);
  console.log('✅ Upload routes registered at /api/upload');
} catch (error) {
  console.error('❌ Error registering upload routes:', error.message);
}

try {
  app.use('/api/admin', adminRoutes);
  console.log('✅ Admin routes registered at /api/admin');
} catch (error) {
  console.error('❌ Error registering admin routes:', error.message);
}

try {
  app.use('/api/admin/products', adminProductRoutes);
  console.log('✅ Admin product routes registered at /api/admin/products');
} catch (error) {
  console.error('❌ Error registering admin product routes:', error.message);
}

console.log('✅ All API routes registered successfully');

// ============================================
// API 404 HANDLER - BEFORE STATIC FILES
// ============================================

app.use('/api/*', (req, res) => {
  console.log(`❌ API route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      'GET /api/health',
      'GET /api/test',
      'GET /api/categories',
      'GET /api/products',
      'POST /api/admin/login',
      'GET /api/admin/products (requires auth)',
      'GET /api/admin/dashboard (requires auth)',
      ...(process.env.NODE_ENV === 'development' ? ['GET /api/debug/*'] : [])
    ],
    timestamp: new Date().toISOString(),
    server: 'main-server'
  });
});

// ============================================
// ✅ STATIC FILES AND REACT CATCH-ALL - AFTER API ROUTES
// ============================================

if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  
  // Serve static files
  app.use(express.static(frontendPath));
  
  // React catch-all - ONLY for non-API routes
  app.get('*', (req, res) => {
    // Double-check this isn't an API route
    if (req.path.startsWith('/api')) {
      return res.status(404).json({
        success: false,
        message: `API endpoint not found: ${req.path}`,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`📱 Serving React app for: ${req.originalUrl}`);
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  // Development mode - no React serving
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({
        success: false,
        message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(404).json({
      success: false,
      message: 'This is the API server. Frontend should be running on a different port.',
      frontendPorts: [
        'http://localhost:3000',
        'http://localhost:5173'
      ],
      timestamp: new Date().toISOString()
    });
  });
}

// ============================================
// ERROR HANDLING - LAST
// ============================================

app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
🔥🔥🔥 BONDEX SAFETY API SERVER RUNNING 🔥🔥🔥
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
💰 Currency: KES (Kenyan Shillings)
🕒 Started: ${new Date().toISOString()}
🛡️  Security: ${process.env.NODE_ENV === 'production' ? 'Production Ready' : 'Development Mode'}

🎯 ROUTE REGISTRATION ORDER:
   1️⃣ Health & Test endpoints
   ${process.env.NODE_ENV === 'development' ? '2️⃣ Debug routes (DEV ONLY)' : ''}
   3️⃣ Categories: /api/categories
   4️⃣ Products: /api/products
   5️⃣ Upload: /api/upload
   6️⃣ Admin: /api/admin
   7️⃣ Admin Products: /api/admin/products
   8️⃣ API 404 handler
   9️⃣ Static files (production) / React catch-all

📋 Test these API endpoints:
   ✅ http://localhost:${PORT}/api/health
   ✅ http://localhost:${PORT}/api/test
   ✅ http://localhost:${PORT}/api/categories
   ✅ http://localhost:${PORT}/api/products
   ${process.env.NODE_ENV === 'development' ? `✅ http://localhost:${PORT}/api/debug/database` : ''}
   ${process.env.NODE_ENV === 'development' ? `✅ http://localhost:${PORT}/api/debug/products` : ''}

🔐 Protected admin endpoints (require authentication):
   🛡️  POST http://localhost:${PORT}/api/admin/login
   🛡️  GET http://localhost:${PORT}/api/admin/products
   🛡️  GET http://localhost:${PORT}/api/admin/dashboard

💡 Debugging tips:
   - Check browser network tab for 401/403 errors
   - Verify admin token in localStorage
   - Use debug endpoints to check database state
   - Check server logs for detailed request info

🚫 NO MORE HTML RESPONSES FOR API ROUTES!
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

export default app;