// backend/middleware/adminAuth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - ensure user is authenticated
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in different places
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Bearer token in Authorization header
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.adminToken) {
      // Token in cookies
      token = req.cookies.adminToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. User not found.'
        });
      }

      // Check if user account is active
      if (user.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Account is not active. Please contact administrator.'
        });
      }

      // Add user to request object
      req.user = user;
      next();

    } catch (tokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.'
      });
    }

  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication',
      error: error.message
    });
  }
};

// Admin only access
export const adminOnly = async (req, res, next) => {
  try {
    // User should already be attached by protect middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    next();

  } catch (error) {
    console.error('Admin Auth Middleware Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authorization',
      error: error.message
    });
  }
};

// Authorize specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

// Optional auth - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.adminToken) {
      token = req.cookies.adminToken;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user && user.status === 'active') {
          req.user = user;
        }
      } catch (tokenError) {
        // Token invalid but don't fail the request
        console.log('Optional auth - invalid token:', tokenError.message);
      }
    }

    next();

  } catch (error) {
    console.error('Optional Auth Middleware Error:', error);
    next(); // Don't fail the request
  }
};

// Check if user owns resource or is admin
export const ownerOrAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Admin can access anything
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    // This assumes the resource has a 'user' field or similar
    const resourceUserId = req.params.userId || req.body.userId || req.user.id;
    
    if (req.user.id.toString() !== resourceUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });
    }

    next();

  } catch (error) {
    console.error('Owner or Admin Middleware Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authorization',
      error: error.message
    });
  }
};

// Rate limiting for sensitive operations
export const rateLimitSensitive = (req, res, next) => {
  // This is a placeholder for rate limiting logic
  // In production, you'd use redis or similar for tracking
  
  const userIP = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');
  
  // Log sensitive operations
  console.log(`Sensitive operation accessed by ${req.user?.email || 'unknown'} from ${userIP}`);
  
  next();
};

// Validate admin setup token (for first-time setup)
export const validateSetupToken = (req, res, next) => {
  try {
    const setupToken = req.headers['x-setup-token'] || process.env.ADMIN_SETUP_TOKEN;
    
    if (!setupToken || setupToken !== process.env.ADMIN_SETUP_TOKEN) {
      return res.status(403).json({
        success: false,
        message: 'Invalid setup token'
      });
    }

    next();

  } catch (error) {
    console.error('Setup Token Validation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in setup validation',
      error: error.message
    });
  }
};

// Check if admin setup is needed
export const checkAdminExists = async (req, res, next) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists. Use login instead.'
      });
    }

    next();

  } catch (error) {
    console.error('Check Admin Exists Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error checking admin status',
      error: error.message
    });
  }
};

export default {
  protect,
  adminOnly,
  authorize,
  optionalAuth,
  ownerOrAdmin,
  rateLimitSensitive,
  validateSetupToken,
  checkAdminExists
};