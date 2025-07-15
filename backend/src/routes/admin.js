import express from 'express';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Apply admin protection to all routes
router.use(protect);
router.use(admin);

// Dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Admin dashboard stats',
      data: {
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        lowStockProducts: 0
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

// Get all users
router.get('/users', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'All users retrieved',
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

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'All orders retrieved',
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

export default router;