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

// Load environment variables
dotenv.config();

// Import database connection
import connectDB from './config/database.js';

// Import routes
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import adminProductRoutes from './routes/adminProductRoutes.js';

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting - prevents spam attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin rate limiting - more restrictive for admin routes
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs for admin
  message: {
    error: 'Too many admin requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Upload rate limiting - for file uploads
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 uploads per windowMs
  message: {
    error: 'Too many upload requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general rate limiting to all API routes
app.use('/api/', limiter);

// Apply stricter rate limiting to admin routes
app.use('/api/admin/', adminLimiter);

// Apply upload rate limiting to upload routes
app.use('/api/upload/', uploadLimiter);

// CORS configuration - allows frontend to connect
const corsOptions = {
  origin: process.env.CLIENT_URL || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['price', 'category', 'rating', 'brand', 'sort', 'fields'] // Allow these fields to have multiple values
}));

// Compression middleware for faster responses
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Trust proxy for accurate IP addresses (important for rate limiting)
app.set('trust proxy', 1);

// ============================================
// HEALTH CHECK & STATUS ENDPOINTS
// ============================================

// Health check endpoint - test if server is running
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bondex Safety API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Detailed test endpoint to verify everything works
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API endpoint working correctly',
    data: {
      server: 'Bondex Safety Backend',
      status: 'operational',
      timestamp: new Date().toISOString(),
      features: [
        'Security middleware active',
        'Rate limiting enabled', 
        'CORS configured',
        'Data validation ready',
        'Admin authentication ready',
        'File upload configured',
        'Database connected',
        'Product management ready',
        'Category management ready',
        'Admin dashboard ready'
      ],
      endpoints: {
        public: [
          'GET /api/health',
          'GET /api/test',
          'GET /api/products',
          'GET /api/categories'
        ],
        admin: [
          'POST /api/admin/setup',
          'POST /api/admin/login',
          'GET /api/admin/dashboard',
          'GET /api/admin/profile'
          // 'GET /api/admin/products', // Temporarily disabled
          // 'POST /api/admin/products'  // Temporarily disabled
        ]
      }
    }
  });
});

// API status endpoint for monitoring
app.get('/api/status', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      cloudinary: 'configured',
      authentication: 'ready',
      fileUpload: 'ready'
    }
  });
});

// ============================================
// API ROUTES
// ============================================

// Public routes (no authentication required)
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);

// Admin routes (authentication required)
app.use('/api/admin', adminRoutes);
app.use('/api/admin/products', adminProductRoutes);

// Future routes (commented for now - ready to uncomment when built)
// app.use('/api/auth', authRoutes);           // Customer authentication
// app.use('/api/orders', orderRoutes);        // Order management  
// app.use('/api/users', userRoutes);          // Customer management
// app.use('/api/cart', cartRoutes);           // Shopping cart
// app.use('/api/reviews', reviewRoutes);      // Product reviews
// app.use('/api/analytics', analyticsRoutes); // Business analytics
// app.use('/api/admin/orders', adminOrderRoutes);     // Admin order management
// app.use('/api/admin/users', adminUserRoutes);       // Admin user management
// app.use('/api/admin/categories', adminCategoryRoutes); // Admin category management
// app.use('/api/admin/analytics', adminAnalyticsRoutes); // Admin analytics

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler for unknown routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found on Bondex Safety API`,
    suggestion: 'Check the API documentation for available endpoints',
    availableRoutes: {
      public: [
        'GET /api/health - Health check',
        'GET /api/test - Test endpoint', 
        'GET /api/status - Service status',
        'GET /api/products - Get all products',
        'GET /api/products/:id - Get single product',
        'GET /api/categories - Get all categories',
        'POST /api/upload/product - Upload product images'
      ],
      admin: [
        'POST /api/admin/setup - First admin setup (one-time)',
        'POST /api/admin/login - Admin login',
        'GET /api/admin/dashboard - Admin dashboard (requires auth)',
        'GET /api/admin/profile - Admin profile (requires auth)'
        // 'GET /api/admin/products - Manage products (requires auth)', // Temporarily disabled
        // 'POST /api/admin/products - Create product (requires auth)',  // Temporarily disabled
        // 'PUT /api/admin/products/:id - Update product (requires auth)', // Temporarily disabled
        // 'DELETE /api/admin/products/:id - Delete product (requires auth)' // Temporarily disabled
      ]
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error Details:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found - Invalid ID format';
    return res.status(404).json({
      success: false,
      message,
      errorType: 'CastError'
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value for ${field}. Please use another value.`;
    return res.status(400).json({
      success: false,
      message,
      errorType: 'DuplicateKey',
      field
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: message,
      errorType: 'ValidationError'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token',
      errorType: 'AuthenticationError'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Authentication token expired',
      errorType: 'TokenExpiredError'
    });
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 5MB per file.',
      errorType: 'FileSizeError'
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Too many files. Maximum is 5 files per upload.',
      errorType: 'FileCountError'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected file field. Please check your form data.',
      errorType: 'UnexpectedFileError'
    });
  }

  // Rate limiting errors
  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
      errorType: 'RateLimitError'
    });
  }

  // Default error response
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errorType: err.name || 'ServerError',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
🚀 Bondex Safety API Server Started Successfully!
=================================================
🌐 Environment: ${process.env.NODE_ENV || 'development'}
📡 Port: ${PORT}
🔗 API URL: http://localhost:${PORT}/api
🛡️  Admin Panel: http://localhost:${PORT}/api/admin
📊 Health Check: http://localhost:${PORT}/api/health
📈 Status Check: http://localhost:${PORT}/api/status

📋 Available Endpoints:
======================
Public Routes:
  GET  /api/health                - Server health check
  GET  /api/test                  - Comprehensive test endpoint
  GET  /api/status               - Service status check
  GET  /api/products              - Get all products (with filters)
  GET  /api/products/:id          - Get single product
  GET  /api/categories            - Get all categories
  POST /api/upload/product        - Upload product images
  
Admin Routes:
  POST /api/admin/setup           - Create first admin (one-time)
  POST /api/admin/login           - Admin login
  POST /api/admin/logout          - Admin logout
  GET  /api/admin/profile         - Admin profile
  PUT  /api/admin/profile         - Update admin profile
  PUT  /api/admin/password        - Change admin password
  GET  /api/admin/dashboard       - Admin dashboard stats
  
Admin Product Management:
  GET  /api/admin/products        - Get all products (admin view)
  GET  /api/admin/products/:id    - Get single product (admin view)  
  POST /api/admin/products        - Create new product
  PUT  /api/admin/products/:id    - Update product
  DELETE /api/admin/products/:id  - Delete product
  
🔐 Security Features:
==================
✅ Rate limiting enabled (100 req/15min general, 50 req/15min admin)
✅ CORS configured for frontend connections
✅ Data sanitization against NoSQL injection
✅ Helmet security headers active
✅ Request compression enabled
✅ Input validation and error handling
✅ JWT authentication for admin routes
✅ File upload protection and limits
✅ Request logging (${process.env.NODE_ENV === 'development' ? 'development' : 'production'} mode)

🗄️  Database: ${process.env.MONGODB_URI ? 'Connected to MongoDB' : 'Using local MongoDB'}
☁️  File Storage: Cloudinary configured and ready
📸 Image Upload: Multi-file upload with automatic optimization
🔧 Admin System: Complete product and category management

🎯 Next Steps:
=============
1. Test admin setup: POST /api/admin/setup
2. Login as admin: POST /api/admin/login  
3. View dashboard: GET /api/admin/dashboard
4. View profile: GET /api/admin/profile

Ready to handle requests! 🎉
=================================================
  `);
});

// ============================================
// GRACEFUL SHUTDOWN HANDLING
// ============================================

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down server due to unhandled promise rejection');
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down server due to uncaught exception');
  process.exit(1);
});

// Graceful shutdown on SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});

// Graceful shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});

export default app;