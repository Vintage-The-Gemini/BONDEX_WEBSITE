// backend/routes/categoryRoutes.js
import express from 'express';
import { 
  getCategories, 
  getCategory, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryController.js';
import { protect, adminOnly } from '../middleware/adminAuth.js';

const router = express.Router();

// Debug middleware for categories route
router.use((req, res, next) => {
  console.log(`🔍 Category Route Hit: ${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers.accept);
  console.log('Query:', req.query);
  next();
});

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res) => {
  console.log('📂 Categories GET route hit');
  
  try {
    // Ensure we always return JSON
    res.setHeader('Content-Type', 'application/json');
    
    // Call the controller
    await getCategories(req, res);
  } catch (error) {
    console.error('❌ Category route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching categories',
      error: error.message
    });
  }
});

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public
router.get('/:id', getCategory);

// @desc    Create new category (Admin only)
// @route   POST /api/categories
// @access  Private
router.post('/', protect, adminOnly, createCategory);

// @desc    Update category (Admin only)
// @route   PUT /api/categories/:id
// @access  Private
router.put('/:id', protect, adminOnly, updateCategory);

// @desc    Delete category (Admin only)
// @route   DELETE /api/categories/:id
// @access  Private
router.delete('/:id', protect, adminOnly, deleteCategory);

export default router;