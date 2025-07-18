// backend/routes/adminRoutes.js
import express from 'express';
import {
  adminLogin,
  adminLogout,
  getAdminProfile,
  getDashboardStats,
  setupFirstAdmin,
  updateAdminProfile,
  changeAdminPassword
} from '../controllers/adminController.js';
import {
  protect,
  adminOnly,
  checkAdminExists
} from '../middleware/adminAuth.js';

const router = express.Router();

// ============================================
// PUBLIC ADMIN ROUTES (No authentication)
// ============================================

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', adminLogin);

// @route   POST /api/admin/setup
// @desc    Create first admin user (only works if no admin exists)
// @access  Public (protected by checkAdminExists middleware)
router.post('/setup', checkAdminExists, setupFirstAdmin);

// ============================================
// PROTECTED ADMIN ROUTES (Authentication required)
// ============================================

// @route   POST /api/admin/logout
// @desc    Admin logout
// @access  Private (Admin only)
router.post('/logout', protect, adminOnly, adminLogout);

// @route   GET /api/admin/profile
// @desc    Get admin profile
// @access  Private (Admin only)
router.get('/profile', protect, adminOnly, getAdminProfile);

// @route   PUT /api/admin/profile
// @desc    Update admin profile
// @access  Private (Admin only)
router.put('/profile', protect, adminOnly, updateAdminProfile);

// @route   PUT /api/admin/password
// @desc    Change admin password
// @access  Private (Admin only)
router.put('/password', protect, adminOnly, changeAdminPassword);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', protect, adminOnly, getDashboardStats);

export default router;