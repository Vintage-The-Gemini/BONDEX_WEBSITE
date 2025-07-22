// backend/middleware/errorHandler.js

// 404 Not Found Handler
export const notFound = (req, res, next) => {
  console.log(`🔍 Route not found: ${req.method} ${req.originalUrl}`);
  
  // For API routes, return JSON
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: `API route not found: ${req.method} ${req.originalUrl}`,
      timestamp: new Date().toISOString(),
      availableRoutes: [
        'GET /api/health',
        'GET /api/categories',
        'GET /api/products',
        'POST /api/admin/login'
      ]
    });
  }
  
  // For non-API routes, create error and pass to error handler
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handler
export const errorHandler = (err, req, res, next) => {
  console.error('🚨 Global Error Handler triggered:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    headers: req.headers
  });

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    message = 'Resource not found - Invalid ID format';
    statusCode = 404;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate field value${field ? ` for ${field}` : ''}. Please use another value.`;
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => val.message);
    message = 'Validation Error';
    statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid authentication token';
    statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Authentication token expired';
    statusCode = 401;
  }

  // CRITICAL: Always return JSON for API routes, never HTML
  if (req.originalUrl.startsWith('/api')) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? err.stack : 'Something went wrong',
      timestamp: new Date().toISOString()
    });
  }

  // For non-API routes
  res.status(statusCode).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
};