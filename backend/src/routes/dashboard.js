// backend/src/routes/dashboard.js
import express from 'express';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public dashboard stats
router.get('/public', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Public dashboard data retrieved successfully',
      data: {
        totalProducts: 150,
        totalCategories: 8,
        featuredProducts: [],
        protectionTypes: [
          { name: 'Head', count: 35 },
          { name: 'Foot', count: 28 },
          { name: 'Eye', count: 22 },
          { name: 'Hand', count: 30 },
          { name: 'Breathing', count: 35 }
        ],
        industries: [
          { name: 'Construction', count: 65 },
          { name: 'Medical', count: 45 },
          { name: 'Manufacturing', count: 40 }
        ]
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

// User dashboard (protected)
router.get('/user', protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'User dashboard data retrieved successfully',
      data: {
        user: {
          name: req.user.name,
          email: req.user.email,
          memberSince: '2025-01-01'
        },
        stats: {
          totalOrders: 5,
          totalSpent: 12500, // KES
          pendingOrders: 1,
          deliveredOrders: 4
        },
        recentOrders: []
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

// Admin dashboard (protected + admin)
router.get('/admin', protect, admin, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Admin dashboard data retrieved successfully',
      data: {
        revenue: {
          today: 5600, // KES
          thisWeek: 45000,
          thisMonth: 180000,
          lastMonth: 165000
        },
        orders: {
          today: 8,
          thisWeek: 45,
          pending: 12,
          processing: 8,
          shipped: 15
        },
        products: {
          total: 150,
          lowStock: 8,
          outOfStock: 3,
          active: 147
        },
        customers: {
          total: 245,
          new: 12,
          returning: 180
        },
        recentOrders: [],
        topProducts: [],
        lowStockAlerts: []
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