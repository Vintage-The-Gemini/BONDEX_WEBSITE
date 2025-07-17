// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import compression from "compression";
import helmet from "helmet";

// Import configurations
import connectDB from "./src/config/database.js";
import errorHandler from "./src/middleware/errorHandler.js";
import { handleUploadError } from "./src/middleware/upload.js";
import logger from "./src/config/logger.js";

// Import routes
import authRoutes from "./src/routes/auth.js";
import productRoutes from "./src/routes/products.js";
import orderRoutes from "./src/routes/orders.js";
import userRoutes from "./src/routes/users.js";
import adminRoutes from "./src/routes/admin.js";
import cartRoutes from "./src/routes/cart.js";
import categoryRoutes from "./src/routes/categories.js";
import reviewRoutes from "./src/routes/reviews.js";
import dashboardRoutes from "./src/routes/dashboard.js";

// Load environment variables
dotenv.config();

// Validate environment variables
import { validateEnvironment } from "./src/config/validateEnv.js";
validateEnvironment();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to Database
connectDB();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Compression middleware
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3000',
    'https://localhost:3001'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Static folder for uploads (local file uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "🛡️ Safety Equipment E-commerce API",
    version: "1.0.0",
    currency: "KES",
    status: "Server running successfully!",
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      products: "/api/products", 
      cart: "/api/cart",
      orders: "/api/orders",
      users: "/api/users",
      admin: "/api/admin",
      categories: "/api/categories",
      reviews: "/api/reviews",
      dashboard: "/api/dashboard"
    }
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    currency: "KES",
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
    },
    version: process.version
  });
});

// API documentation route
app.get("/api", (req, res) => {
  res.json({
    message: "Safety Equipment E-commerce API Documentation",
    version: "1.0.0",
    currency: "KES",
    baseUrl: `${req.protocol}://${req.get('host')}`,
    endpoints: {
      // Authentication
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        logout: "POST /api/auth/logout",
        me: "GET /api/auth/me",
        updateProfile: "PUT /api/auth/update",
        updatePassword: "PUT /api/auth/update-password",
        forgotPassword: "POST /api/auth/forgot-password",
        resetPassword: "POST /api/auth/reset-password/:token"
      },
      // Products
      products: {
        getAll: "GET /api/products",
        getOne: "GET /api/products/:id",
        create: "POST /api/products (Admin)",
        update: "PUT /api/products/:id (Admin)",
        delete: "DELETE /api/products/:id (Admin)",
        featured: "GET /api/products/featured",
        onSale: "GET /api/products/sale",
        search: "GET /api/products/search?q=term",
        byCategory: "GET /api/products/category/:categoryId"
      },
      // Cart
      cart: {
        getCart: "GET /api/cart",
        addItem: "POST /api/cart/add",
        updateItem: "PUT /api/cart/update",
        removeItem: "DELETE /api/cart/remove/:productId",
        clearCart: "DELETE /api/cart/clear",
        applyCoupon: "POST /api/cart/coupon",
        removeCoupon: "DELETE /api/cart/coupon"
      },
      // Orders
      orders: {
        create: "POST /api/orders",
        getMyOrders: "GET /api/orders",
        getOrder: "GET /api/orders/:id",
        updateToPaid: "PUT /api/orders/:id/pay",
        cancel: "PUT /api/orders/:id/cancel",
        updateStatus: "PUT /api/orders/:id/status (Admin)"
      },
      // Users
      users: {
        getProfile: "GET /api/users/profile",
        updateProfile: "PUT /api/users/profile",
        updateAvatar: "PUT /api/users/avatar",
        getDashboard: "GET /api/users/dashboard",
        getAddresses: "GET /api/users/addresses",
        updateAddresses: "PUT /api/users/addresses"
      },
      // Admin
      admin: {
        dashboard: "GET /api/admin/dashboard",
        users: "GET /api/admin/users",
        orders: "GET /api/admin/orders",
        products: "GET /api/admin/products",
        analytics: "GET /api/admin/analytics"
      }
    },
    filters: {
      products: "?protectionType=Head&industry=Medical&minPrice=100&maxPrice=5000&sort=price-low&page=1&limit=12",
      search: "?q=helmet&protectionType=Head&industry=Construction"
    },
    supportedCurrency: "KES (Kenyan Shilling)",
    supportedFormats: ["JSON"],
    rateLimit: "100 requests per 15 minutes per IP"
  });
});

// Upload error handling middleware
app.use(handleUploadError);

// Global error handling middleware
app.use(errorHandler);

// 404 handler - This should be the last route
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: `The requested resource '${req.originalUrl}' does not exist`,
    availableEndpoints: {
      api: "/api",
      health: "/health",
      documentation: "/api"
    }
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error('Unhandled Promise Rejection:', err);
  console.log('Shutting down the server due to unhandled promise rejection');
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  console.log('Shutting down the server due to uncaught exception');
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`💰 Currency: KES (Kenyan Shilling)`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`\n🔗 Available Endpoints:`);
    console.log(`   📝 API Docs: http://localhost:${PORT}/api`);
    console.log(`   🛡️  Auth: http://localhost:${PORT}/api/auth`);
    console.log(`   📦 Products: http://localhost:${PORT}/api/products`);
    console.log(`   🛒 Cart: http://localhost:${PORT}/api/cart`);
    console.log(`   📋 Orders: http://localhost:${PORT}/api/orders`);
    console.log(`   👥 Users: http://localhost:${PORT}/api/users`);
    console.log(`   🔧 Admin: http://localhost:${PORT}/api/admin`);
  }
  
  logger.info(`🚀 Server started on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

export default app;