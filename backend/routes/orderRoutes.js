// backend/routes/orderRoutes.js
import express from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  getOrderStats,
  getRecentOrders,
  exportOrders,
  addTrackingInfo,
  processRefund
} from '../controllers/orderController.js';
import { protect, adminOnly, optionalAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// ============================================
// PUBLIC ORDER ROUTES
// ============================================

// @route   POST /api/orders
// @desc    Create new order (guest or authenticated users)
// @access  Public
router.post('/', optionalAuth, (req, res, next) => {
  console.log('📦 Create order route hit');
  console.log('👤 User:', req.user?.email || 'Guest');
  createOrder(req, res, next);
});

// @route   GET /api/orders/tracking/:orderNumber
// @desc    Track order by order number (public tracking)
// @access  Public
router.get('/tracking/:orderNumber', (req, res, next) => {
  console.log(`🔍 Track order route hit for: ${req.params.orderNumber}`);
  // You can implement order tracking function later
  getOrder(req, res, next);
});

// ============================================
// CUSTOMER PROTECTED ROUTES
// ============================================

// @route   GET /api/orders/my-orders
// @desc    Get customer's own orders
// @access  Private (Customer)
router.get('/my-orders', protect, (req, res, next) => {
  console.log('📋 Customer orders route hit');
  console.log('👤 Customer:', req.user?.email);
  req.query.customer = req.user.id;
  getOrders(req, res, next);
});

// @route   GET /api/orders/:id/customer
// @desc    Get single order (customer can only access their own)
// @access  Private (Customer)
router.get('/:id/customer', protect, (req, res, next) => {
  console.log(`🔍 Customer order detail route hit for ID: ${req.params.id}`);
  console.log('👤 Customer:', req.user?.email);
  req.customerAccess = true;
  getOrder(req, res, next);
});

// ============================================
// ADMIN PROTECTED ROUTES
// ============================================

// @route   GET /api/orders/stats
// @desc    Get order statistics for dashboard
// @access  Private (Admin only)
router.get('/stats', protect, adminOnly, (req, res, next) => {
  console.log('📊 Order stats route hit');
  console.log('👤 Admin:', req.user?.email);
  getOrderStats(req, res, next);
});

// @route   GET /api/orders/recent
// @desc    Get recent orders for dashboard
// @access  Private (Admin only)
router.get('/recent', protect, adminOnly, (req, res, next) => {
  console.log('⏰ Recent orders route hit');
  console.log('👤 Admin:', req.user?.email);
  getRecentOrders(req, res, next);
});

// @route   GET /api/orders/export
// @desc    Export orders to CSV
// @access  Private (Admin only)
router.get('/export', protect, adminOnly, (req, res, next) => {
  console.log('💾 Export orders route hit');
  console.log('👤 Admin:', req.user?.email);
  exportOrders(req, res, next);
});

// @route   GET /api/orders
// @desc    Get all orders with filtering, sorting, pagination (Admin only)
// @access  Private (Admin only)
router.get('/', protect, adminOnly, (req, res, next) => {
  console.log('📋 Admin orders list route hit');
  console.log('👤 Admin:', req.user?.email);
  getOrders(req, res, next);
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID (Admin only)
// @access  Private (Admin only)
router.get('/:id', protect, adminOnly, (req, res, next) => {
  console.log(`🔍 Admin order detail route hit for ID: ${req.params.id}`);
  console.log('👤 Admin:', req.user?.email);
  getOrder(req, res, next);
});

// @route   PUT /api/orders/:id
// @desc    Update order (Admin only)
// @access  Private (Admin only)
router.put('/:id', protect, adminOnly, (req, res, next) => {
  console.log(`✏️ Update order route hit for ID: ${req.params.id}`);
  console.log('👤 Admin:', req.user?.email);
  updateOrder(req, res, next);
});

// @route   PATCH /api/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private (Admin only)
router.patch('/:id/status', protect, adminOnly, (req, res, next) => {
  console.log(`🎯 Update order status route hit for ID: ${req.params.id}`);
  console.log('👤 Admin:', req.user?.email);
  console.log('📦 New status:', req.body.status);
  updateOrderStatus(req, res, next);
});

// @route   PATCH /api/orders/:id/tracking
// @desc    Add tracking information to order (Admin only)
// @access  Private (Admin only)
router.patch('/:id/tracking', protect, adminOnly, (req, res, next) => {
  console.log(`🚚 Add tracking route hit for ID: ${req.params.id}`);
  console.log('👤 Admin:', req.user?.email);
  console.log('📦 Tracking:', req.body.trackingNumber);
  addTrackingInfo(req, res, next);
});

// @route   POST /api/orders/:id/refund
// @desc    Process order refund (Admin only)
// @access  Private (Admin only)
router.post('/:id/refund', protect, adminOnly, (req, res, next) => {
  console.log(`💰 Process refund route hit for ID: ${req.params.id}`);
  console.log('👤 Admin:', req.user?.email);
  console.log('💵 Refund amount:', req.body.amount);
  processRefund(req, res, next);
});

// @route   DELETE /api/orders/:id
// @desc    Delete order (Admin only - use with caution)
// @access  Private (Admin only)
router.delete('/:id', protect, adminOnly, (req, res, next) => {
  console.log(`🗑️ Delete order route hit for ID: ${req.params.id}`);
  console.log('👤 Admin:', req.user?.email);
  console.log('⚠️ WARNING: Deleting order permanently');
  deleteOrder(req, res, next);
});

// ============================================
// BULK OPERATIONS (Admin only)
// ============================================

// @route   PATCH /api/orders/bulk/status
// @desc    Bulk update order status (Admin only)
// @access  Private (Admin only)
router.patch('/bulk/status', protect, adminOnly, async (req, res) => {
  try {
    console.log('📦 Bulk status update route hit');
    console.log('👤 Admin:', req.user?.email);
    
    const { orderIds, status, note } = req.body;
    
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order IDs array is required'
      });
    }
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    // Update multiple orders
    const Order = (await import('../models/Order.js')).default;
    
    const updateResult = await Order.updateMany(
      { _id: { $in: orderIds } },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        },
        $push: {
          timeline: {
            status,
            note: note || `Bulk status update to ${status}`,
            updatedBy: req.user.id,
            timestamp: new Date()
          }
        }
      }
    );
    
    res.status(200).json({
      success: true,
      message: `Successfully updated ${updateResult.modifiedCount} orders`,
      data: {
        matched: updateResult.matchedCount,
        modified: updateResult.modifiedCount
      }
    });
    
  } catch (error) {
    console.error('Bulk Status Update Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order statuses',
      error: error.message
    });
  }
});

export default router;