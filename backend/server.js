// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';

// Import routes
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import adminProductRoutes from './routes/adminProductRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Load environment variables
dotenv.config();

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-setup-token']
}));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// ROUTE REGISTRATION LOGGING
// ============================================
console.log('🚀 Starting Bondex Safety API Server...');
console.log('📋 Registering routes...');

// ============================================
// HEALTH CHECK ENDPOINTS
// ============================================

app.get('/api/health', (req, res) => {
  console.log('🏥 Health check endpoint hit');
  res.status(200).json({
    success: true,
    message: 'Bondex Safety API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/test', (req, res) => {
  console.log('🧪 Test endpoint hit');
  res.status(200).json({
    success: true,
    message: 'API test endpoint working',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint for categories
app.get('/api/categories-debug', (req, res) => {
  console.log('🔍 Categories debug endpoint hit');
  res.status(200).json({
    success: true,
    message: 'Categories debug endpoint working',
    route: '/api/categories-debug',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// API ROUTES
// ============================================

// Public routes
app.use('/api/categories', categoryRoutes);
console.log('✅ Categories routes registered: /api/categories');

app.use('/api/products', productRoutes);
console.log('✅ Products routes registered: /api/products');

app.use('/api/upload', uploadRoutes);
console.log('✅ Upload routes registered: /api/upload');

// Admin routes
app.use('/api/admin', adminRoutes);
console.log('✅ Admin routes registered: /api/admin');

app.use('/api/admin/products', adminProductRoutes);
console.log('✅ Admin products routes registered: /api/admin/products');

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.all('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
    availableRoutes: [
      'GET /api/health',
      'GET /api/test', 
      'GET /api/categories-debug',
      'GET /api/categories',
      'POST /api/admin/login',
      'GET /api/admin/dashboard'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Global error:', error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n🎉 SERVER STARTED SUCCESSFULLY!');
  console.log('=================================');
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`🔍 Debug categories: http://localhost:${PORT}/api/categories-debug`);
  console.log(`📂 Categories API: http://localhost:${PORT}/api/categories`);
  console.log('=================================\n');
});

export default app;