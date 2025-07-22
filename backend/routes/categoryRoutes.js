// backend/routes/categoryRoutes.js
import express from 'express';
import {
  getCategories,
  getCategory,
  getCategoriesByType,
  seedCategories
} from '../controllers/categoryController.js';

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', getCategories);

// @route   GET /api/categories/seed
// @desc    Seed default categories
// @access  Public (consider protecting this in production)
router.post('/seed', seedCategories);

// @route   GET /api/categories/type/:type
// @desc    Get categories by type
// @access  Public
router.get('/type/:type', getCategoriesByType);

// @route   GET /api/categories/:id
// @desc    Get single category
// @access  Public
router.get('/:id', getCategory);

export default router;