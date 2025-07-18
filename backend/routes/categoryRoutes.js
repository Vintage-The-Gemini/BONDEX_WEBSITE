// backend/routes/categoryRoutes.js
import express from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  seedCategories,
  getCategoriesByType
} from '../controllers/categoryController.js';

const router = express.Router();

// Public Routes

// @route   GET /api/categories
// @desc    Get all categories with optional filtering
// @access  Public
router.get('/', getCategories);

// @route   GET /api/categories/type/:type
// @desc    Get categories by type (protection_type, industry, etc.)
// @access  Public
router.get('/type/:type', getCategoriesByType);

// @route   GET /api/categories/:id
// @desc    Get single category by ID
// @access  Public
router.get('/:id', getCategory);

// Admin Routes (we'll add authentication middleware later)

// @route   POST /api/categories/seed
// @desc    Seed default categories into database
// @access  Private (Admin only)
router.post('/seed', seedCategories);

// @route   POST /api/categories
// @desc    Create new category
// @access  Private (Admin only)
router.post('/', createCategory);

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Private (Admin only)
router.put('/:id', updateCategory);

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Private (Admin only)
router.delete('/:id', deleteCategory);

export default router;