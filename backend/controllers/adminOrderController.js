// backend/controllers/adminOrderController.js
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
// @access  Private (Admin only)
export const getAdminOrders = async (req, res) => {
  try {
    console.log('📦 Admin: Fetching orders with filters');

    const {
      page = 1,
      limit = 20,
      status,
      search,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      paymentStatus,
      minAmount,
      maxAmount
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query
    let query = {};

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by payment status
    if (paymentStatus && paymentStatus !== 'all') {
      query.paymentStatus = paymentStatus;
    }

    // Search in order number, customer name, or email
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { orderNumber: searchRegex },
        { 'customerInfo.name': searchRegex },
        { 'customerInfo.email': searchRegex },
        { 'customerInfo.phone': searchRegex }
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDateTime;
      }
    }

    // Amount range filter
    if (minAmount || maxAmount) {
      query.totalAmount = {};
      if (minAmount) {
        query.totalAmount.$gte = parseFloat(minAmount);
      }
      if (maxAmount) {
        query.totalAmount.$lte = parseFloat(maxAmount);
      }
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .populate('items.product', 'product_name product_images')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / parseInt(limit));

    // Calculate summary statistics for filtered results
    const summaryStats = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    const summary = summaryStats[0] || {
      totalRevenue: 0,
      averageOrderValue: 0,
      totalOrders: 0
    };

    // Get status breakdown
    const statusBreakdown = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log(`✅ Found ${orders.length} orders for admin`);

    res.status(200).json({
      success: true,
      count: orders.length,
      totalOrders,
      totalPages,
      currentPage: parseInt(page),
      data: orders.map(order => ({
        id: order._id,
        orderNumber: order.orderNumber,
        customer: {
          name: order.customer?.name || order.customerInfo?.name,
          email: order.customer?.email || order.customerInfo?.email,
          phone: order.customer?.phone || order.customerInfo?.phone
        },
        items: order.items.map(item => ({
          product: {
            id: item.product?._id,
            name: item.product?.product_name || item.productName,
            image: item.product?.product_images?.[0] || item.productImage
          },
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: order.shippingAddress,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        deliveryDate: order.deliveryDate,
        trackingNumber: order.trackingNumber
      })),
      summary,
      statusBreakdown: statusBreakdown.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    });

  } catch (error) {
    console.error('Get Admin Orders Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Get single order details for admin
// @route   GET /api/admin/orders/:id
// @access  Private (Admin only)
export const getAdminOrder = async (req, res) => {
  try {
    console.log(`🔍 Admin: Getting order details for ID: ${req.params.id}`);

    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone address registrationDate')
      .populate('items.product', 'product_name product_images product_brand category stock');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Get order history/timeline
    const orderHistory = order.statusHistory || [];

    // Calculate order analytics
    const orderAnalytics = {
      itemsCount: order.items.length,
      totalQuantity: order.items.reduce((sum, item) => sum + item.quantity, 0),
      averageItemPrice: order.subtotal / order.items.reduce((sum, item) => sum + item.quantity, 0),
      discountPercentage: order.discountAmount ? (order.discountAmount / order.subtotal) * 100 : 0
    };

    console.log('✅ Order details retrieved successfully');

    res.status(200).json({
      success: true,
      data: {
        ...order.toObject(),
        orderHistory,
        analytics: orderAnalytics
      }
    });

  } catch (error) {
    console.error('Get Admin Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order details',
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    console.log(`📝 Admin: Updating order status for ID: ${req.params.id}`);

    const { status, notes, trackingNumber, estimatedDelivery } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if status change is valid
    const currentStatus = order.status;
    
    // Prevent invalid status transitions
    if (currentStatus === 'delivered' && status !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot change status of delivered order'
      });
    }

    if (currentStatus === 'cancelled' && status !== 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot change status of cancelled order'
      });
    }

    // Update order status
    const previousStatus = order.status;
    order.status = status;
    
    // Add to status history
    if (!order.statusHistory) {
      order.statusHistory = [];
    }
    
    order.statusHistory.push({
      status: status,
      timestamp: new Date(),
      updatedBy: req.user.id,
      notes: notes || `Status changed from ${previousStatus} to ${status}`
    });

    // Handle specific status updates
    switch (status) {
      case 'confirmed':
        order.confirmedAt = new Date();
        break;
      case 'processing':
        order.processingAt = new Date();
        // Reduce stock quantities
        for (const item of order.items) {
          await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: -item.quantity } }
          );
        }
        break;
      case 'shipped':
        order.shippedAt = new Date();
        if (trackingNumber) {
          order.trackingNumber = trackingNumber;
        }
        if (estimatedDelivery) {
          order.estimatedDelivery = new Date(estimatedDelivery);
        }
        break;
      case 'delivered':
        order.deliveredAt = new Date();
        order.paymentStatus = 'paid';
        break;
      case 'cancelled':
        order.cancelledAt = new Date();
        order.cancelReason = notes || 'Cancelled by admin';
        // Restore stock if it was reduced
        if (previousStatus === 'processing' || previousStatus === 'shipped') {
          for (const item of order.items) {
            await Product.findByIdAndUpdate(
              item.product,
              { $inc: { stock: item.quantity } }
            );
          }
        }
        break;
    }

    order.updatedAt = new Date();
    await order.save();

    console.log(`✅ Order status updated: ${previousStatus} → ${status}`);

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        previousStatus,
        newStatus: status,
        updatedAt: order.updatedAt
      }
    });

  } catch (error) {
    console.error('Update Order Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// @desc    Update payment status
// @route   PUT /api/admin/orders/:id/payment
// @access  Private (Admin only)
export const updatePaymentStatus = async (req, res) => {
  try {
    console.log(`💳 Admin: Updating payment status for order: ${req.params.id}`);

    const { paymentStatus, paymentMethod, transactionId, notes } = req.body;
    
    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'];
    
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment status. Valid statuses: ${validPaymentStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const previousPaymentStatus = order.paymentStatus;
    
    // Update payment details
    order.paymentStatus = paymentStatus;
    
    if (paymentMethod) {
      order.paymentMethod = paymentMethod;
    }
    
    if (transactionId) {
      order.transactionId = transactionId;
    }

    // Add payment history
    if (!order.paymentHistory) {
      order.paymentHistory = [];
    }
    
    order.paymentHistory.push({
      status: paymentStatus,
      method: paymentMethod,
      transactionId: transactionId,
      timestamp: new Date(),
      updatedBy: req.user.id,
      notes: notes || `Payment status changed from ${previousPaymentStatus} to ${paymentStatus}`
    });

    // Handle specific payment status updates
    switch (paymentStatus) {
      case 'paid':
        order.paidAt = new Date();
        break;
      case 'refunded':
        order.refundedAt = new Date();
        order.refundAmount = order.totalAmount;
        break;
      case 'partially_refunded':
        order.partiallyRefundedAt = new Date();
        // You might want to specify the refund amount
        break;
    }

    order.updatedAt = new Date();
    await order.save();

    console.log(`✅ Payment status updated: ${previousPaymentStatus} → ${paymentStatus}`);

    res.status(200).json({
      success: true,
      message: `Payment status updated to ${paymentStatus}`,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        previousPaymentStatus,
        newPaymentStatus: paymentStatus,
        updatedAt: order.updatedAt
      }
    });

  } catch (error) {
    console.error('Update Payment Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message
    });
  }
};

// @desc    Add tracking information
// @route   PUT /api/admin/orders/:id/tracking
// @access  Private (Admin only)
export const updateOrderTracking = async (req, res) => {
  try {
    console.log(`🚚 Admin: Updating tracking for order: ${req.params.id}`);

    const { trackingNumber, carrier, trackingUrl, estimatedDelivery, notes } = req.body;

    if (!trackingNumber) {
      return res.status(400).json({
        success: false,
        message: 'Tracking number is required'
      });
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update tracking information
    order.trackingNumber = trackingNumber;
    
    if (carrier) order.carrier = carrier;
    if (trackingUrl) order.trackingUrl = trackingUrl;
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);

    // Add tracking history
    if (!order.trackingHistory) {
      order.trackingHistory = [];
    }
    
    order.trackingHistory.push({
      trackingNumber,
      carrier,
      trackingUrl,
      estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null,
      timestamp: new Date(),
      updatedBy: req.user.id,
      notes: notes || 'Tracking information updated'
    });

    // If order isn't shipped yet, update to shipped
    if (order.status !== 'shipped' && order.status !== 'delivered') {
      order.status = 'shipped';
      order.shippedAt = new Date();
      
      // Add to status history
      if (!order.statusHistory) {
        order.statusHistory = [];
      }
      
      order.statusHistory.push({
        status: 'shipped',
        timestamp: new Date(),
        updatedBy: req.user.id,
        notes: 'Order shipped with tracking information'
      });
    }

    order.updatedAt = new Date();
    await order.save();

    console.log('✅ Tracking information updated successfully');

    res.status(200).json({
      success: true,
      message: 'Tracking information updated successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        trackingNumber: order.trackingNumber,
        carrier: order.carrier,
        estimatedDelivery: order.estimatedDelivery,
        status: order.status
      }
    });

  } catch (error) {
    console.error('Update Order Tracking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating tracking information',
      error: error.message
    });
  }
};

// @desc    Process refund
// @route   POST /api/admin/orders/:id/refund
// @access  Private (Admin only)
export const processRefund = async (req, res) => {
  try {
    console.log(`💰 Admin: Processing refund for order: ${req.params.id}`);

    const { amount, reason, refundMethod = 'original_payment' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid refund amount is required'
      });
    }

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Refund reason is required'
      });
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.paymentStatus === 'refunded') {
      return res.status(400).json({
        success: false,
        message: 'Order has already been fully refunded'
      });
    }

    // Calculate refund details
    const maxRefundAmount = order.totalAmount - (order.refundAmount || 0);
    
    if (amount > maxRefundAmount) {
      return res.status(400).json({
        success: false,
        message: `Cannot refund KES ${amount}. Maximum refundable amount: KES ${maxRefundAmount}`
      });
    }

    // Update refund information
    const currentRefundAmount = order.refundAmount || 0;
    const newRefundAmount = currentRefundAmount + amount;
    
    order.refundAmount = newRefundAmount;
    
    // Update payment status
    if (newRefundAmount >= order.totalAmount) {
      order.paymentStatus = 'refunded';
      order.refundedAt = new Date();
    } else {
      order.paymentStatus = 'partially_refunded';
      order.partiallyRefundedAt = new Date();
    }

    // Add refund to history
    if (!order.refundHistory) {
      order.refundHistory = [];
    }
    
    order.refundHistory.push({
      amount: amount,
      reason: reason,
      method: refundMethod,
      processedBy: req.user.id,
      processedAt: new Date(),
      status: 'processed'
    });

    // If full refund, also cancel the order if not already
    if (order.paymentStatus === 'refunded' && order.status !== 'cancelled') {
      order.status = 'cancelled';
      order.cancelledAt = new Date();
      order.cancelReason = `Order cancelled due to full refund: ${reason}`;
      
      // Add to status history
      if (!order.statusHistory) {
        order.statusHistory = [];
      }
      
      order.statusHistory.push({
        status: 'cancelled',
        timestamp: new Date(),
        updatedBy: req.user.id,
        notes: `Order cancelled due to full refund: ${reason}`
      });

      // Restore stock if necessary
      if (order.status === 'processing' || order.status === 'shipped') {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: item.quantity } }
          );
        }
      }
    }

    order.updatedAt = new Date();
    await order.save();

    console.log(`✅ Refund processed: KES ${amount} for order ${order.orderNumber}`);

    res.status(200).json({
      success: true,
      message: `Refund of KES ${amount} processed successfully`,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        refundAmount: amount,
        totalRefunded: order.refundAmount,
        paymentStatus: order.paymentStatus,
        reason: reason
      }
    });

  } catch (error) {
    console.error('Process Refund Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing refund',
      error: error.message
    });
  }
};

// @desc    Delete order (admin only)
// @route   DELETE /api/admin/orders/:id
// @access  Private (Admin only)
export const deleteOrder = async (req, res) => {
  try {
    console.log(`🗑️ Admin: Deleting order: ${req.params.id}`);

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Only allow deletion of cancelled orders or very old pending orders
    const canDelete = order.status === 'cancelled' || 
      (order.status === 'pending' && 
       new Date() - order.createdAt > 7 * 24 * 60 * 60 * 1000); // 7 days old

    if (!canDelete) {
      return res.status(400).json({
        success: false,
        message: 'Can only delete cancelled orders or pending orders older than 7 days'
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    console.log(`✅ Order ${order.orderNumber} deleted successfully`);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
      data: {
        deletedOrderId: req.params.id,
        orderNumber: order.orderNumber
      }
    });

  } catch (error) {
    console.error('Delete Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message
    });
  }
};

// @desc    Get orders analytics for admin
// @route   GET /api/admin/orders/analytics
// @access  Private (Admin only)
export const getOrdersAnalytics = async (req, res) => {
  try {
    console.log('📊 Admin: Fetching orders analytics');

    const { period = '30d' } = req.query;
    
    let startDate;
    const now = new Date();

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Overall analytics
    const analytics = await Order.aggregate([
      {
        $facet: {
          totalStats: [
            {
              $match: {
                createdAt: { $gte: startDate },
                status: { $ne: 'cancelled' }
              }
            },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: '$totalAmount' },
                totalOrders: { $sum: 1 },
                averageOrderValue: { $avg: '$totalAmount' },
                totalItems: { $sum: { $size: '$items' } }
              }
            }
          ],
          statusBreakdown: [
            {
              $match: { createdAt: { $gte: startDate } }
            },
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
                revenue: { $sum: '$totalAmount' }
              }
            }
          ],
          dailyTrend: [
            {
              $match: {
                createdAt: { $gte: startDate },
                status: { $ne: 'cancelled' }
              }
            },
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                },
                orders: { $sum: 1 },
                revenue: { $sum: '$totalAmount' }
              }
            },
            { $sort: { _id: 1 } }
          ],
          paymentMethods: [
            {
              $match: { createdAt: { $gte: startDate } }
            },
            {
              $group: {
                _id: '$paymentMethod',
                count: { $sum: 1 },
                revenue: { $sum: '$totalAmount' }
              }
            }
          ]
        }
      }
    ]);

    const result = analytics[0];

    console.log('✅ Orders analytics compiled successfully');

    res.status(200).json({
      success: true,
      message: 'Orders analytics retrieved successfully',
      data: {
        period,
        startDate,
        endDate: now,
        totalStats: result.totalStats[0] || {
          totalRevenue: 0,
          totalOrders: 0,
          averageOrderValue: 0,
          totalItems: 0
        },
        statusBreakdown: result.statusBreakdown,
        dailyTrend: result.dailyTrend,
        paymentMethods: result.paymentMethods
      }
    });

  } catch (error) {
    console.error('Get Orders Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders analytics',
      error: error.message
    });
  }
};