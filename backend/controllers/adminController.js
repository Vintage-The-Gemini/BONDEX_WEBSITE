// backend/controllers/adminController.js
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find admin user and include password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account temporarily locked due to too many failed login attempts'
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      await user.incLoginAttempts();
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts and update last login
    await user.resetLoginAttempts();
    await user.updateLastLogin();

    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      data: {
        user: user.getSafeUserData(),
        token
      }
    });

  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// @desc    Admin logout
// @route   POST /api/admin/logout
// @access  Private
export const adminLogout = async (req, res) => {
  try {
    res.clearCookie('adminToken');
    
    res.status(200).json({
      success: true,
      message: 'Admin logged out successfully'
    });

  } catch (error) {
    console.error('Admin Logout Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during logout',
      error: error.message
    });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private
export const getAdminProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== 'admin') {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user.getSafeUserData()
    });

  } catch (error) {
    console.error('Get Admin Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin profile',
      error: error.message
    });
  }
};

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    // Get date ranges
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Product statistics
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: 'active' });
    const lowStockProducts = await Product.countDocuments({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] }
    });
    const featuredProducts = await Product.countDocuments({ isFeatured: true });

    // Category statistics
    const totalCategories = await Category.countDocuments();
    const activeCategories = await Category.countDocuments({ status: 'active' });

    // User statistics
    const userStats = await User.getUserStats();

    // Top selling products (based on salesCount)
    const topProducts = await Product.find()
      .sort({ salesCount: -1 })
      .limit(5)
      .select('product_name salesCount product_price product_image');

    // Low stock alerts
    const lowStockAlerts = await Product.find({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] }
    })
    .select('product_name stock lowStockThreshold category')
    .limit(10);

    // Products by category
    const productsByCategory = await Product.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: '$product_price' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Recent products (last 10)
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('product_name category product_price createdAt status');

    const dashboardData = {
      // Overview cards
      overview: {
        totalProducts,
        activeProducts,
        lowStockProducts,
        featuredProducts,
        totalCategories,
        activeCategories,
        totalUsers: userStats.totalUsers,
        activeUsers: userStats.activeUsers
      },

      // Charts data
      charts: {
        productsByCategory,
        topProducts: topProducts.map(product => ({
          name: product.product_name,
          sales: product.salesCount,
          revenue: product.salesCount * product.product_price,
          image: product.product_image
        }))
      },

      // Alerts and notifications
      alerts: {
        lowStockAlerts: lowStockAlerts.map(product => ({
          id: product._id,
          name: product.product_name,
          currentStock: product.stock,
          threshold: product.lowStockThreshold,
          category: product.category,
          severity: product.stock === 0 ? 'critical' : 'warning'
        }))
      },

      // Recent activity
      recentActivity: {
        recentProducts: recentProducts.map(product => ({
          id: product._id,
          name: product.product_name,
          category: product.category,
          price: product.product_price,
          status: product.status,
          createdAt: product.createdAt
        }))
      },

      // Quick stats for widgets
      quickStats: {
        productsNeedingAttention: lowStockProducts,
        categoriesWithMostProducts: productsByCategory[0]?._id || 'None',
        averageProductPrice: await Product.aggregate([
          { $group: { _id: null, avgPrice: { $avg: '$product_price' } } }
        ]).then(result => result[0]?.avgPrice || 0),
        lastUpdated: new Date()
      }
    };

    res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: dashboardData
    });

  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// @desc    Create first admin user (setup)
// @route   POST /api/admin/setup
// @access  Public (only works if no admin exists)
export const setupFirstAdmin = async (req, res) => {
  try {
    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists. Use regular login.'
      });
    }

    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Create admin user
    const admin = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'admin',
      status: 'active',
      isEmailVerified: true,
      registrationSource: 'admin'
    });

    // Generate token
    const token = generateToken(admin._id);

    // Set cookie
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      success: true,
      message: 'First admin user created successfully',
      data: {
        user: admin.getSafeUserData(),
        token
      }
    });

  } catch (error) {
    console.error('Setup Admin Error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating admin user',
      error: error.message
    });
  }
};

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private
export const updateAdminProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const user = await User.findById(req.user.id);

    if (!user || user.role !== 'admin') {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (phone) user.phone = phone;
    if (address) user.address = { ...user.address, ...address };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Admin profile updated successfully',
      data: user.getSafeUserData()
    });

  } catch (error) {
    console.error('Update Admin Profile Error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating admin profile',
      error: error.message
    });
  }
};

// @desc    Change admin password
// @route   PUT /api/admin/password
// @access  Private
export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    // Find user with password
    const user = await User.findById(req.user.id).select('+password');

    if (!user || user.role !== 'admin') {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change Admin Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
};