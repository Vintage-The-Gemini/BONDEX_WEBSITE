// backend/controllers/adminController.js
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    console.log('🔐 Admin login attempt started');
    const { email, password, rememberMe } = req.body;

    // Validation
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find admin user
    const admin = await User.findOne({ 
      email: email.toLowerCase(),
      role: 'admin'
    }).select('+password');

    if (!admin) {
      console.log('❌ Admin not found with email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Check if account is active
    if (admin.status !== 'active') {
      console.log('❌ Admin account not active:', admin.status);
      return res.status(401).json({
        success: false,
        message: 'Admin account is not active'
      });
    }

    // Check password
    const isPasswordMatch = await admin.matchPassword(password);
    if (!isPasswordMatch) {
      console.log('❌ Password mismatch for admin:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    admin.loginCount = (admin.loginCount || 0) + 1;
    await admin.save();

    // Generate token
    const token = generateToken(admin._id);
    const cookieExpiry = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 1 day

    // Set secure cookie
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: cookieExpiry
    });

    console.log('✅ Admin login successful for:', email);

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      data: {
        user: admin.getSafeUserData(),
        token
      }
    });

  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin login',
      error: error.message
    });
  }
};

// @desc    Admin logout
// @route   POST /api/admin/logout
// @access  Private (Admin only)
export const adminLogout = async (req, res) => {
  try {
    console.log('👋 Admin logout requested');

    // Clear the cookie
    res.cookie('adminToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    });

    console.log('✅ Admin logout successful');

    res.status(200).json({
      success: true,
      message: 'Admin logout successful'
    });

  } catch (error) {
    console.error('Admin Logout Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin logout',
      error: error.message
    });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private (Admin only)
export const getAdminProfile = async (req, res) => {
  try {
    console.log('👤 Getting admin profile for:', req.user.email);

    const admin = await User.findById(req.user.id).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admin profile retrieved successfully',
      data: admin.getSafeUserData()
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

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private (Admin only)
export const updateAdminProfile = async (req, res) => {
  try {
    console.log('✏️ Updating admin profile for:', req.user.email);

    const { name, email, phone, bio } = req.body;
    
    const admin = await User.findById(req.user.id);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email.toLowerCase() !== admin.email) {
      const emailExists = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: admin._id }
      });
      
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
      admin.email = email.toLowerCase();
    }

    // Update fields
    if (name) admin.name = name;
    if (phone) admin.phone = phone;
    if (bio) admin.bio = bio;

    admin.updatedAt = new Date();
    await admin.save();

    console.log('✅ Admin profile updated successfully');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: admin.getSafeUserData()
    });

  } catch (error) {
    console.error('Update Admin Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating admin profile',
      error: error.message
    });
  }
};

// @desc    Change admin password
// @route   PUT /api/admin/password
// @access  Private (Admin only)
export const changeAdminPassword = async (req, res) => {
  try {
    console.log('🔒 Password change requested for admin:', req.user.email);

    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password, new password, and confirmation'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirmation do not match'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get admin with password
    const admin = await User.findById(req.user.id).select('+password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Check current password
    const isCurrentPasswordValid = await admin.matchPassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    admin.passwordChangedAt = new Date();
    
    await admin.save();

    console.log('✅ Admin password changed successfully');

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

// @desc    Get comprehensive dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
export const getDashboardStats = async (req, res) => {
  try {
    console.log('📊 Fetching comprehensive dashboard statistics');

    // Date ranges for calculations
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // 1. REVENUE STATISTICS
    const revenueStats = await Order.aggregate([
      {
        $facet: {
          today: [
            { $match: { createdAt: { $gte: startOfToday }, status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
          ],
          yesterday: [
            { $match: { 
              createdAt: { $gte: startOfYesterday, $lt: startOfToday },
              status: { $ne: 'cancelled' }
            }},
            { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
          ],
          thisWeek: [
            { $match: { createdAt: { $gte: startOfWeek }, status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
          ],
          thisMonth: [
            { $match: { createdAt: { $gte: startOfMonth }, status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
          ],
          lastMonth: [
            { $match: { 
              createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
              status: { $ne: 'cancelled' }
            }},
            { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
          ]
        }
      }
    ]);

    const revenue = revenueStats[0];

    // 2. PRODUCT STATISTICS
    const productStats = await Product.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          active: [{ $match: { status: 'active' } }, { $count: "count" }],
          inactive: [{ $match: { status: 'inactive' } }, { $count: "count" }],
          lowStock: [{ $match: { stock: { $lt: 10 } } }, { $count: "count" }],
          outOfStock: [{ $match: { stock: 0 } }, { $count: "count" }],
          featured: [{ $match: { isFeatured: true } }, { $count: "count" }],
          onSale: [{ $match: { isOnSale: true } }, { $count: "count" }]
        }
      }
    ]);

    const products = productStats[0];

    // 3. CUSTOMER STATISTICS
    const customerStats = await User.aggregate([
      {
        $facet: {
          total: [{ $match: { role: 'customer' } }, { $count: "count" }],
          active: [{ $match: { role: 'customer', status: 'active' } }, { $count: "count" }],
          newThisMonth: [
            { $match: { 
              role: 'customer',
              createdAt: { $gte: startOfMonth }
            }},
            { $count: "count" }
          ],
          newThisWeek: [
            { $match: { 
              role: 'customer',
              createdAt: { $gte: startOfWeek }
            }},
            { $count: "count" }
          ]
        }
      }
    ]);

    const customers = customerStats[0];

    // 4. ORDER STATISTICS
    const orderStats = await Order.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          pending: [{ $match: { status: 'pending' } }, { $count: "count" }],
          processing: [{ $match: { status: 'processing' } }, { $count: "count" }],
          shipped: [{ $match: { status: 'shipped' } }, { $count: "count" }],
          delivered: [{ $match: { status: 'delivered' } }, { $count: "count" }],
          cancelled: [{ $match: { status: 'cancelled' } }, { $count: "count" }],
          todayOrders: [
            { $match: { createdAt: { $gte: startOfToday } } },
            { $count: "count" }
          ]
        }
      }
    ]);

    const orders = orderStats[0];

    // 5. TOP SELLING PRODUCTS
    const topProducts = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          productName: '$product.product_name',
          totalSold: 1,
          revenue: 1,
          currentStock: '$product.stock'
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    // 6. LOW STOCK ALERTS
    const lowStockProducts = await Product.find({ 
      stock: { $lt: 10 },
      status: 'active'
    })
    .select('product_name stock category')
    .sort({ stock: 1 })
    .limit(20);

    // 7. RECENT ORDERS
    const recentOrders = await Order.find()
      .populate('customer', 'name email')
      .select('orderNumber customerInfo totalAmount status createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    // 8. CATEGORY PERFORMANCE
    const categoryPerformance = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          totalOrders: { $sum: 1 },
          totalQuantity: { $sum: '$items.quantity' }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ]);

    // 9. SALES TREND (Last 7 days)
    const salesTrend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Calculate growth percentages
    const calculateGrowth = (current, previous) => {
      if (!previous || previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const todayRevenue = revenue.today[0]?.total || 0;
    const yesterdayRevenue = revenue.yesterday[0]?.total || 0;
    const thisMonthRevenue = revenue.thisMonth[0]?.total || 0;
    const lastMonthRevenue = revenue.lastMonth[0]?.total || 0;

    // Build comprehensive dashboard data
    const dashboardData = {
      summary: {
        totalRevenue: thisMonthRevenue,
        revenueGrowth: calculateGrowth(thisMonthRevenue, lastMonthRevenue),
        totalOrders: orders.total[0]?.count || 0,
        totalProducts: products.total[0]?.count || 0,
        totalCustomers: customers.total[0]?.count || 0,
        pendingOrders: orders.pending[0]?.count || 0
      },

      revenue: {
        today: {
          amount: todayRevenue,
          orders: revenue.today[0]?.count || 0,
          growth: calculateGrowth(todayRevenue, yesterdayRevenue)
        },
        thisWeek: {
          amount: revenue.thisWeek[0]?.total || 0,
          orders: revenue.thisWeek[0]?.count || 0
        },
        thisMonth: {
          amount: thisMonthRevenue,
          orders: revenue.thisMonth[0]?.count || 0,
          growth: calculateGrowth(thisMonthRevenue, lastMonthRevenue)
        }
      },

      products: {
        total: products.total[0]?.count || 0,
        active: products.active[0]?.count || 0,
        inactive: products.inactive[0]?.count || 0,
        lowStock: products.lowStock[0]?.count || 0,
        outOfStock: products.outOfStock[0]?.count || 0,
        featured: products.featured[0]?.count || 0,
        onSale: products.onSale[0]?.count || 0
      },

      customers: {
        total: customers.total[0]?.count || 0,
        active: customers.active[0]?.count || 0,
        newThisMonth: customers.newThisMonth[0]?.count || 0,
        newThisWeek: customers.newThisWeek[0]?.count || 0
      },

      orders: {
        total: orders.total[0]?.count || 0,
        pending: orders.pending[0]?.count || 0,
        processing: orders.processing[0]?.count || 0,
        shipped: orders.shipped[0]?.count || 0,
        delivered: orders.delivered[0]?.count || 0,
        cancelled: orders.cancelled[0]?.count || 0,
        today: orders.todayOrders[0]?.count || 0
      },

      topProducts,
      lowStockProducts: lowStockProducts.map(product => ({
        id: product._id,
        name: product.product_name,
        stock: product.stock,
        category: product.category,
        alertLevel: product.stock === 0 ? 'critical' : product.stock < 5 ? 'urgent' : 'warning'
      })),

      recentOrders: recentOrders.map(order => ({
        id: order._id,
        orderNumber: order.orderNumber,
        customer: order.customer?.name || order.customerInfo?.name || 'Guest',
        customerEmail: order.customer?.email || order.customerInfo?.email,
        total: order.totalAmount,
        status: order.status,
        date: order.createdAt
      })),

      categoryPerformance,
      salesTrend,

      alerts: {
        lowStock: products.lowStock[0]?.count || 0,
        pendingOrders: orders.pending[0]?.count || 0,
        outOfStock: products.outOfStock[0]?.count || 0
      },

      lastUpdated: new Date()
    };

    console.log('✅ Dashboard statistics compiled successfully');

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
    console.log('🔧 Setting up first admin user');

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
      registrationSource: 'admin_setup'
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

    console.log('✅ First admin user created successfully');

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

// @desc    Get admin analytics summary
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
export const getAdminAnalytics = async (req, res) => {
  try {
    console.log('📈 Fetching admin analytics');

    const { period = '30d' } = req.query;
    
    let startDate;
    const now = new Date();

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Sales analytics
    const salesAnalytics = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Customer analytics
    const customerAnalytics = await User.aggregate([
      {
        $match: {
          role: 'customer',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          newCustomers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Product performance
    const productPerformance = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' }
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$items.product',
          productName: { $first: '$product.product_name' },
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          averageRating: { $avg: '$product.averageRating' }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 20 }
    ]);

    res.status(200).json({
      success: true,
      message: 'Analytics data retrieved successfully',
      data: {
        period,
        startDate,
        endDate: now,
        salesAnalytics,
        customerAnalytics,
        productPerformance
      }
    });

  } catch (error) {
    console.error('Admin Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics data',
      error: error.message
    });
  }
};