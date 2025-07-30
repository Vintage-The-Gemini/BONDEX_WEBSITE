// backend/routes/adminOrderRoutes.js
import express from 'express';
import {
  getAdminOrders,
  getAdminOrder,
  updateOrderStatus,
  updatePaymentStatus,
  updateOrderTracking,
  processRefund,
  deleteOrder,
  getOrdersAnalytics
} from '../controllers/adminOrderController.js';
import { protect, adminOnly } from '../middleware/adminAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);
router.use(adminOnly);

// ============================================
// ADMIN ORDER MANAGEMENT ROUTES
// ============================================

// @route   GET /api/admin/orders/analytics
// @desc    Get orders analytics for admin dashboard
// @access  Private (Admin only)
router.get('/analytics', (req, res, next) => {
  console.log('📊 Admin orders analytics route hit');
  console.log('👤 Admin:', req.user?.email);
  console.log('📅 Period:', req.query.period);
  getOrdersAnalytics(req, res, next);
});

// @route   GET /api/admin/orders
// @desc    Get all orders with advanced filtering for admin
// @access  Private (Admin only)
router.get('/', (req, res, next) => {
  console.log('📦 Admin orders list route hit');
  console.log('👤 Admin:', req.user?.email);
  console.log('🔍 Filters:', {
    status: req.query.status,
    search: req.query.search,
    page: req.query.page,
    limit: req.query.limit
  });
  getAdminOrders(req, res, next);
});

// @route   GET /api/admin/orders/:id
// @desc    Get single order details for admin
// @access  Private (Admin only)
router.get('/:id', (req, res, next) => {
  console.log(`🔍 Admin order details route hit for ID: ${req.params.id}`);
  console.log('👤 Admin:', req.user?.email);
  getAdminOrder(req, res, next);
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status (with history tracking)
// @access  Private (Admin only)
router.put('/:id/status', (req, res, next) => {
  console.log(`📝 Admin update order status route hit for ID: ${req.params.id}`);
  console.log('👤 Admin:', req.user?.email);
  console.log('📦 New status:', req.body.status);
  updateOrderStatus(req, res, next);
});

// @route   PUT /api/admin/orders/:id/payment
// @desc    Update payment status
// @access  Private (Admin only)
router.put('/:id/payment', (req, res, next) => {
  console.log(`💳 Admin update payment status route hit for ID: ${req.params.id}`);
  console.log('👤 Admin:', req.user?.email);
  console.log('💰 New payment status:', req.body.paymentStatus);
  updatePaymentStatus(req, res, next);
});

// @route   PUT /api/admin/orders/:id/tracking
// @desc    Add/update tracking information
// @access  Private (Admin only)
router.put('/:id/tracking', (req, res, next) => {
  console.log(`🚚 Admin update tracking route hit for ID: ${req.params.id}`);
  console.log('👤 Admin:', req.user?.email);
  console.log('📦 Tracking number:', req.body.trackingNumber);
  updateOrderTracking(req, res, next);
});

// @route   POST /api/admin/orders/:id/refund
// @desc    Process order refund (full or partial)
// @access  Private (Admin only)
router.post('/:id/refund', (req, res, next) => {
  console.log(`💰 Admin process refund route hit for ID: ${req.params.id}`);
  console.log('👤 Admin:', req.user?.email);
  console.log('💵 Refund amount:', `KES ${req.body.amount}`);
  console.log('📝 Reason:', req.body.reason);
  processRefund(req, res, next);
});

// @route   DELETE /api/admin/orders/:id
// @desc    Delete order (use with extreme caution)
// @access  Private (Admin only)
router.delete('/:id', (req, res, next) => {
  console.log(`🗑️ Admin delete order route hit for ID: ${req.params.id}`);
  console.log('👤 Admin:', req.user?.email);
  console.log('⚠️ WARNING: Permanently deleting order');
  deleteOrder(req, res, next);
});

// ============================================
// BULK OPERATIONS (Future Enhancement)
// ============================================

// @route   PATCH /api/admin/orders/bulk/status
// @desc    Bulk update order statuses
// @access  Private (Admin only)
router.patch('/bulk/status', (req, res, next) => {
  console.log('📦 Admin bulk status update route hit');
  console.log('👤 Admin:', req.user?.email);
  console.log('🔢 Order IDs:', req.body.orderIds);
  console.log('📝 New status:', req.body.status);
  
  // For now, return a placeholder response
  // You can implement the bulk operations later
  res.status(200).json({
    success: true,
    message: 'Bulk status update feature coming soon',
    data: {
      requestedIds: req.body.orderIds,
      requestedStatus: req.body.status
    }
  });
});

// @route   POST /api/admin/orders/export
// @desc    Export orders to CSV/Excel
// @access  Private (Admin only)
router.post('/export', (req, res, next) => {
  console.log('💾 Admin export orders route hit');
  console.log('👤 Admin:', req.user?.email);
  console.log('📊 Export format:', req.body.format);
  console.log('🔍 Export filters:', req.body.filters);
  
  // For now, return a placeholder response
  // You can implement the export functionality later
  res.status(200).json({
    success: true,
    message: 'Order export feature coming soon',
    data: {
      format: req.body.format,
      filters: req.body.filters,
      estimatedRecords: 0
    }
  });
});

export default router;