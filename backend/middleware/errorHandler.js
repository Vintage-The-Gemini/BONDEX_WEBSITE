// backend/middleware/errorHandler.js

// Handle 404 - Not Found
const notFound = (req, res, next) => {
  console.log(`❌ 404 Not Found: ${req.method} ${req.originalUrl}`);
  
  // Only handle non-API routes here
  if (!req.originalUrl.startsWith('/api')) {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  } else {
    // Let API routes handle their own 404s
    next();
  }
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  console.error('🔥 Error Handler Triggered:');
  console.error('🔥 Error:', err.message);
  console.error('🔥 Stack:', err.stack);
  console.error('🔥 Request:', req.method, req.originalUrl);

  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Invalid resource ID format';
    error = { message, statusCode: 400 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  // CORS errors
  if (err.message && err.message.includes('CORS')) {
    error = { message: 'CORS policy violation', statusCode: 403 };
  }

  // Ensure we always send JSON for API routes
  if (req.originalUrl.startsWith('/api')) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error',
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        originalError: err.message
      })
    });
  } else {
    // For non-API routes, send a simple error page
    res.status(error.statusCode || 500);
    res.json({
      success: false,
      error: error.message || 'Server Error',
      timestamp: new Date().toISOString()
    });
  }
};

export { notFound, errorHandler };