import express from 'express';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (require authentication)
router.use(protect);

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        id: req.user?.id || 'user-id',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+254712345678',
        role: 'user'
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

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        name,
        phone,
        address
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

// Get user's addresses
router.get('/addresses', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Addresses retrieved successfully',
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Add new address
router.post('/addresses', async (req, res) => {
  try {
    const { street, city, county, postalCode, isDefault } = req.body;
    
    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: {
        street,
        city,
        county,
        postalCode,
        isDefault
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

export default router;