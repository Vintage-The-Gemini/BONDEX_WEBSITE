// backend/src/routes/categories.js
import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: [
        {
          id: '1',
          name: 'Head Protection',
          slug: 'head-protection',
          protectionType: 'Head',
          industry: 'All',
          productCount: 25
        },
        {
          id: '2', 
          name: 'Foot Protection',
          slug: 'foot-protection',
          protectionType: 'Foot',
          industry: 'All',
          productCount: 18
        }
      ]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Category retrieved successfully',
      data: {
        id: req.params.id,
        name: 'Head Protection',
        slug: 'head-protection',
        description: 'Safety helmets and hard hats for construction and industrial use',
        protectionType: 'Head',
        industry: 'Construction',
        productCount: 25
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Protected admin routes
router.use(protect);
router.use(admin);

router.post('/', upload.categoryImage, async (req, res) => {
  try {
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: req.body
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

router.put('/:id', upload.categoryImage, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: { id: req.params.id, ...req.body }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;