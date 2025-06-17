import User from '../models/User.js';
import Order from '../models/Order.js';
import asyncHandler from 'express-async-handler';
import { cloudinary } from '../config/cloudinary.js';
import logger from '../config/logger.js';

// @desc    Update user avatar (Private)
// @route   PUT /api/users/avatar
// @access  Private
export const updateAvatar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload an image'
    });
  }

  // Delete old avatar if exists
  if (user.avatar && user.avatar.public_id) {
    try {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    } catch (error) {
      logger.error('Failed to delete old avatar:', error);
    }
  }

  // Update user avatar
  user.avatar = {
    public_id: req.file.filename,
    url: req.file.path
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Avatar updated successfully',
    avatar: user.avatar
  });
});

// @desc    Get user dashboard data (Private)
// @route   GET /api/users/dashboard
// @access  Private
export const getUserDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Get user's order statistics
  const orderStats = await Order.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$totalPrice' },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        deliveredOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
        }
      }
    }
  ]);

  // Get recent orders
  const recentOrders = await Order.find({ user: userId })
    .populate('orderItems.product', 'name images')
    .sort({ createdAt: -1 })
    .limit(5)
    .select('orderNumber status totalPrice createdAt orderItems');

  const stats = orderStats[0] || {
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    deliveredOrders: 0
  };

  res.status(200).json({
    success: true,
    data: {
      user: {
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        memberSince: req.user.createdAt
      },
      stats,
      recentOrders
    }
  });
});

// @desc    Get user addresses (Private)
// @route   GET /api/users/addresses
// @access  Private
export const getUserAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  res.status(200).json({
    success: true,
    data: user.address || {}
  });
});

// @desc    Update user addresses (Private)
// @route   PUT /api/users/addresses
// @access  Private
export const updateUserAddresses = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { address: req.body },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Address updated successfully',
    data: user.address
  });
});

// ADMIN ROUTES

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  let filter = {};

  // Role filter
  if (req.query.role) {
    filter.role = req.query.role;
  }

  // Verified filter
  if (req.query.verified) {
    filter.isVerified = req.query.verified === 'true';
  }

  // Search by name or email
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(startIndex);

  res.status(200).json({
    success: true,
    count: users.length,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    },
    data: users
  });
});

// @desc    Get single user (Admin)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Get user's order statistics
  const orderStats = await Order.aggregate([
    { $match: { user: mongoose.Types.ObjectId(req.params.id) } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$totalPrice' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      user,
      orderStats: orderStats[0] || { totalOrders: 0, totalSpent: 0 }
    }
  });
});

// @desc    Update user (Admin)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  logger.info(`User updated by admin: ${user.email} by ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user
  });
});

// @desc    Delete user (Admin)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Check if user has orders
  const orderCount = await Order.countDocuments({ user: user._id });
  
  if (orderCount > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete user. They have ${orderCount} orders in the system.`
    });
  }

  // Delete user avatar from cloudinary
  if (user.avatar && user.avatar.public_id) {
    try {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    } catch (error) {
      logger.error('Failed to delete user avatar:', error);
    }
  }

  await User.findByIdAndDelete(req.params.id);

  logger.info(`User deleted by admin: ${user.email} by ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

// @desc    Get user statistics (Admin)
// @route   GET /api/admin/users/stats
// @access  Private/Admin
export const getUserStats = asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const stats = await User.aggregate([
    {
      $facet: {
        total: [
          { $count: "count" }
        ],
        today: [
          { $match: { createdAt: { $gte: startOfDay } } },
          { $count: "count" }
        ],
        thisWeek: [
          { $match: { createdAt: { $gte: startOfWeek } } },
          { $count: "count" }
        ],
        thisMonth: [
          { $match: { createdAt: { $gte: startOfMonth } } },
          { $count: "count" }
        ],
        roleBreakdown: [
          {
            $group: {
              _id: '$role',
              count: { $sum: 1 }
            }
          }
        ]
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      total: stats[0].total[0]?.count || 0,
      today: stats[0].today[0]?.count || 0,
      thisWeek: stats[0].thisWeek[0]?.count || 0,
      thisMonth: stats[0].thisMonth[0]?.count || 0,
      roleBreakdown: stats[0].roleBreakdown
    }
  });
});