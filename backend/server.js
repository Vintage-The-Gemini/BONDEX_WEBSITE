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
import adminCategoryRoutes from './routes/adminCategoryRoutes.js';
import adminOrderRoutes from './routes/adminOrderRoutes.js'; // 🆕 NEW IMPORT
import debugRoutes from './routes/debugRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

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

// 7. Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // Much higher in development
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// ============================================
// API ROUTES - ORDER MATTERS!
// ============================================

// CRITICAL: More specific routes MUST come before general ones
console.log('🔄 Registering API routes...');

// Health check and test endpoints (should be first)
app.get('/api/health', (req, res) => {
  console.log('🏥 Health endpoint called');
  res.json({
    success: true,
    message: '🔥 Bondex Safety API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    server: 'main-server',
    currency: 'KES'
  });
});

app.get('/api/test', (req, res) => {
  console.log('🧪 Test endpoint called');
  res.json({
    success: true,
    message: '✅ Test endpoint working correctly',
    data: {
      server: 'Bondex Safety API',
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      currency: 'KES'
    }
  });
});

// Debug routes (development only)
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
  app.use('/api/orders', orderRoutes);
  console.log('✅ Order routes registered at /api/orders');
} catch (error) {
  console.error('❌ Error registering order routes:', error.message);
}

try {
  app.use('/api/upload', uploadRoutes);
  console.log('✅ Upload routes registered at /api/upload');
} catch (error) {
  console.error('❌ Error registering upload routes:', error.message);
}

// ============================================
// ADMIN ROUTES - Specific to General Order
// ============================================

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

try {
  app.use('/api/admin/categories', adminCategoryRoutes);
  console.log('✅ Admin category routes registered at /api/admin/categories');
} catch (error) {
  console.error('❌ Error registering admin category routes:', error.message);
}

// 🆕 NEW: Admin Order Routes
try {
  app.use('/api/admin/orders', adminOrderRoutes);
  console.log('✅ Admin order routes registered at /api/admin/orders');
} catch (error) {
  console.error('❌ Error registering admin order routes:', error.message);
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
      'POST /api/orders',
      'GET /api/orders (requires admin auth)',
      'GET /api/orders/stats (requires admin auth)',
      'GET /api/orders/recent (requires admin auth)',
      'POST /api/admin/login',
      'GET /api/admin/dashboard (requires auth)',
      'GET /api/admin/products (requires auth)',
      'GET /api/admin/categories (requires auth)',
      'GET /api/admin/orders (requires auth)', // 🆕 NEW ENDPOINT
      'PUT /api/admin/orders/:id/status (requires auth)', // 🆕 NEW ENDPOINT
      'POST /api/admin/orders/:id/refund (requires auth)', // 🆕 NEW ENDPOINT
      ...(process.env.NODE_ENV === 'development' ? 
        ['GET /api/debug/*'] : [])
    ],
    timestamp: new Date().toISOString(),
    server: 'main-server',
    currency: 'KES'
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
        timestamp: new Date().toISOString(),
        currency: 'KES'
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
        timestamp: new Date().toISOString(),
        currency: 'KES'
      });
    }
    
    res.status(404).json({
      success: false,
      message: 'This is the API server. Frontend should be running on a different port.',
      frontendPorts: [
        'http://localhost:3000',
        'http://localhost:5173'
      ],
      timestamp: new Date().toISOString(),
      currency: 'KES'
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
   5️⃣ Orders: /api/orders
   6️⃣ Upload: /api/upload
   7️⃣ Admin: /api/admin
   8️⃣ Admin Products: /api/admin/products
   9️⃣ Admin Categories: /api/admin/categories
   🔟 Admin Orders: /api/admin/orders 🆕 NEW
   1️⃣1️⃣ API 404 handler
   1️⃣2️⃣ Static files (production) / React catch-all

📋 Test these API endpoints:
   ✅ http://localhost:${PORT}/api/health
   ✅ http://localhost:${PORT}/api/test
   ✅ http://localhost:${PORT}/api/categories
   ✅ http://localhost:${PORT}/api/products
   ✅ http://localhost:${PORT}/api/orders (admin auth required)
   ✅ http://localhost:${PORT}/api/admin/categories (admin auth required)
   ✅ http://localhost:${PORT}/api/admin/orders (admin auth required) 🆕 NEW
   ${process.env.NODE_ENV === 'development' ? `✅ http://localhost:${PORT}/api/debug/database` : ''}
   ${process.env.NODE_ENV === 'development' ? `✅ http://localhost:${PORT}/api/debug/routes` : ''}

🔧 API Configuration:
   📡 Base URL: ${process.env.API_URL || `http://localhost:${PORT}/api`}
   🔐 JWT Secret: ${process.env.JWT_SECRET ? '✅ Configured' : '❌ Missing'}
   📁 Upload Dir: ${process.env.UPLOAD_DIR || './uploads'}
   🗄️  Database: ${process.env.MONGODB_URI ? '✅ Connected' : '❌ Missing'}
   ☁️  Cloudinary: ${process.env.CLOUDINARY_URL ? '✅ Configured' : '❌ Missing'}

🆕 NEW ADMIN ORDER ENDPOINTS:
   📦 GET  /api/admin/orders - List all orders with filtering
   📋 GET  /api/admin/orders/:id - Get order details
   📝 PUT  /api/admin/orders/:id/status - Update order status
   💳 PUT  /api/admin/orders/:id/payment - Update payment status
   🚚 PUT  /api/admin/orders/:id/tracking - Add tracking info
   💰 POST /api/admin/orders/:id/refund - Process refunds
   📊 GET  /api/admin/orders/analytics - Order analytics
   🗑️  DELETE /api/admin/orders/:id - Delete orders (cautiously)

🚀 Ready to handle requests with enhanced admin order management!
  `);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});

export default app;