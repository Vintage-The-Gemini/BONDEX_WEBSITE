// backend/routes/categoryRoutes.js
import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesStats,
  getFeaturedCategories
} from '../controllers/categoryController.js';
import { protect, adminOnly } from '../middleware/adminAuth.js';

const router = express.Router();

// ============================================
// PUBLIC CATEGORY ROUTES
// ============================================

// @route   GET /api/categories
// @desc    Get all categories (public)
// @access  Public
router.get('/', (req, res, next) => {
  console.log('📂 Categories route hit - calling getCategories controller');
  getCategories(req, res, next);
});

// @route   GET /api/categories/featured
// @desc    Get featured categories only
// @access  Public
router.get('/featured', (req, res, next) => {
  console.log('⭐ Featured categories route hit');
  getFeaturedCategories(req, res, next);
});

// @route   GET /api/categories/stats
// @desc    Get category statistics (public stats only)
// @access  Public
router.get('/stats', (req, res, next) => {
  console.log('📊 Category stats route hit');
  getCategoriesStats(req, res, next);
});

// @route   GET /api/categories/:id
// @desc    Get single category by ID
// @access  Public
router.get('/:id', (req, res, next) => {
  console.log(`🔍 Single category route hit for ID: ${req.params.id}`);
  getCategoryById(req, res, next);
});

// ============================================
// ADMIN CATEGORY ROUTES (Protected)
// ============================================

// @route   POST /api/categories
// @desc    Create new category
// @access  Private (Admin only)
router.post('/', protect, adminOnly, (req, res, next) => {
  console.log('➕ Create category route hit');
  createCategory(req, res, next);
});

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Private (Admin only)
router.put('/:id', protect, adminOnly, (req, res, next) => {
  console.log(`✏️ Update category route hit for ID: ${req.params.id}`);
  updateCategory(req, res, next);
});

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Private (Admin only)
router.delete('/:id', protect, adminOnly, (req, res, next) => {
  console.log(`🗑️ Delete category route hit for ID: ${req.params.id}`);
  deleteCategory(req, res, next);
});

export default router;