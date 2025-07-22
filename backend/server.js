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

// Import error handlers
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Connect to database
connectDB();

// Trust proxy for accurate IP addresses (MUST be early)
app.set('trust proxy', 1);

// ============================================
// MIDDLEWARE CONFIGURATION (ORDER MATTERS!)
// ============================================

// 1. CORS - MUST come first
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL || 'http://localhost:3000'
    : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
};
app.use(cors(corsOptions));

// 2. Security middleware
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

// 3. Body parsing middleware - BEFORE routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

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

// 7. Request logging for debugging
app.use((req, res, next) => {
  console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// ============================================
// RATE LIMITING (BEFORE ROUTES)
// ============================================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// ============================================
// HEALTH CHECK ROUTES (FIRST - BEFORE OTHER ROUTES)
// ============================================

app.get('/api/health', (req, res) => {
  console.log('🏥 Health check called');
  res.json({
    success: true,
    message: 'BONDEX Safety API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    currency: 'KES'
  });
});

app.get('/api/test', (req, res) => {
  console.log('🧪 Test endpoint called');
  res.json({
    success: true,
    message: 'API test endpoint working',
    server: 'Bondex Safety Backend',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// API ROUTES REGISTRATION (EXACT ORDER!)
// ============================================

console.log('🚀 Registering API routes...');

// Public routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// Admin routes  
app.use('/api/admin', adminRoutes);
app.use('/api/admin/products', adminProductRoutes);

console.log('✅ All API routes registered successfully');

// ============================================
// STATIC FILES (PRODUCTION ONLY)
// ============================================

if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));
  
  // Handle React routing - serve index.html for non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  });
}

// ============================================
// ERROR HANDLING (MUST BE LAST!)
// ============================================

// 404 handler for unknown routes
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
🚀 BONDEX Safety Server Running Successfully!
📍 Server: http://localhost:${PORT}
🏥 Health: http://localhost:${PORT}/api/health
📂 Categories: http://localhost:${PORT}/api/categories
💰 Currency: KES (Kenya Shillings)
🌍 Environment: ${process.env.NODE_ENV || 'development'}
⏰ Started: ${new Date().toLocaleString()}

📋 Available API Endpoints:
   GET  /api/health
   GET  /api/test  
   GET  /api/categories
   GET  /api/products
   POST /api/admin/login
  `);
});

// ============================================
// PROCESS HANDLERS
// ============================================

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('💥 UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

export default app;