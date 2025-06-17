import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import { createPaymentIntent } from '../config/stripe.js';
import { emailTemplates } from '../config/email.js';
import createTransporter from '../config/email.js';
import logger from '../config/logger.js';

// @desc    Create new order (Private)
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    couponCode
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No order items provided'
    });
  }

  // Validate and update product stock
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product ${item.name} not found`
      });
    }

    if (product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${product.name}. Only ${product.stock} available.`
      });
    }

    // Update stock and total sold
    product.updateStock(item.quantity, 'subtract');
    product.totalSold += item.quantity;
    await product.save();
  }

  // Calculate discount if coupon is applied
  let discountAmount = 0;
  if (couponCode) {
    const Coupon = (await import('../models/Coupon.js')).default;
    const coupon = await Coupon.findOne({ 
      code: couponCode.toUpperCase(),
      isActive: true 
    });
    
    if (coupon && coupon.isValid) {
      discountAmount = coupon.calculateDiscount(itemsPrice);
      coupon.incrementUsage();
      await coupon.save();
    }
  }

  const order = await Order.create({
    user: req.user.id,
    customerInfo: {
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone
    },
    orderItems: orderItems.map(item => ({
      ...item,
      subtotal: item.price * item.quantity
    })),
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    discountAmount,
    totalPrice: totalPrice - discountAmount,
    couponCode: couponCode || undefined,
    currency: 'KES'
  });

  // Clear user's cart after successful order
  await Cart.findOneAndDelete({ user: req.user.id });

  // Send order confirmation email
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: req.user.email,
      subject: emailTemplates.orderConfirmation.subject,
      html: emailTemplates.orderConfirmation.html({
        customerName: req.user.name,
        orderNumber: order.orderNumber,
        formattedTotal: order.formattedTotal,
        paymentMethod: order.paymentMethod,
        estimatedDelivery: '3-5 business days'
      })
    });
  } catch (error) {
    logger.error('Order confirmation email failed:', error);
  }

  logger.info(`New order created: ${order.orderNumber} - ${order.formattedTotal} by ${req.user.email}`);

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order
  });
});

// @desc    Get user orders (Private)
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const filter = { user: req.user.id };

  // Status filter
  if (req.query.status) {
    filter.status = req.query.status;
  }

  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(startIndex)
    .populate('orderItems.product', 'name images')
    .select('-statusHistory -adminNotes');

  res.status(200).json({
    success: true,
    count: orders.length,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total
    },
    data: orders
  });
});

// @desc    Get single order (Private)
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('orderItems.product', 'name images brand sku');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Check if user owns this order or is admin
  if (order.user._id.toString() !== req.user.id && 
      req.user.role !== 'admin' && 
      req.user.role !== 'superadmin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this order'
    });
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Cancel order (Private)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Check if user owns this order
  if (order.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to cancel this order'
    });
  }

  // Only allow cancellation for pending and confirmed orders
  if (!['pending', 'confirmed'].includes(order.status)) {
    return res.status(400).json({
      success: false,
      message: 'Order cannot be cancelled at this stage'
    });
  }

  // Restore product stock
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.updateStock(item.quantity, 'add');
      product.totalSold = Math.max(0, product.totalSold - item.quantity);
      await product.save();
    }
  }

  order.updateStatus('cancelled', 'Cancelled by customer', req.user.id);
  await order.save();

  logger.info(`Order cancelled: ${order.orderNumber} by ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    data: order
  });
});

// @desc    Create payment intent (Private)
// @route   POST /api/orders/:id/payment
// @access  Private
export const createOrderPayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  if (order.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized'
    });
  }

  if (order.isPaid) {
    return res.status(400).json({
      success: false,
      message: 'Order is already paid'
    });
  }

  try {
    const paymentIntent = await createPaymentIntent(
      order.totalPrice,
      'kes',
      {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        customerEmail: req.user.email
      }
    );

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment setup failed',
      error: error.message
    });
  }
});

// @desc    Update order payment status (Private)
// @route   PUT /api/orders/:id/payment/confirm
// @access  Private
export const confirmOrderPayment = asyncHandler(async (req, res) => {
  const { paymentIntentId, paymentStatus } = req.body;
  
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  if (order.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized'
    });
  }

  if (paymentStatus === 'succeeded') {
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: paymentIntentId,
      status: paymentStatus,
      update_time: new Date().toISOString(),
      email_address: req.user.email
    };
    order.updateStatus('confirmed', 'Payment confirmed');
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Payment confirmed',
    data: order
  });
});

// ADMIN ROUTES

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  let filter = {};

  // Status filter
  if (req.query.status) {
    filter.status = req.query.status;
  }

  // Date range filter
  if (req.query.startDate || req.query.endDate) {
    filter.createdAt = {};
    if (req.query.startDate) {
      filter.createdAt.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      filter.createdAt.$lte = new Date(req.query.endDate);
    }
  }

  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(startIndex);

  // Calculate summary statistics
  const stats = await Order.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: '$totalPrice' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    count: orders.length,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total
    },
    stats: stats[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0
    },
    data: orders
  });
});

// @desc    Update order status (Admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note, trackingNumber } = req.body;
  
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    });
  }

  order.updateStatus(status, note || '', req.user.id);
  
  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }

  if (status === 'shipped') {
    order.estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days
  }

  await order.save();

  logger.info(`Order status updated: ${order.orderNumber} -> ${status} by ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    data: order
  });
});

// @desc    Get order statistics (Admin)
// @route   GET /api/admin/orders/stats
// @access  Private/Admin
export const getOrderStats = asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const stats = await Order.aggregate([
    {
      $facet: {
        today: [
          { $match: { createdAt: { $gte: startOfDay } } },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              revenue: { $sum: '$totalPrice' }
            }
          }
        ],
        thisWeek: [
          { $match: { createdAt: { $gte: startOfWeek } } },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              revenue: { $sum: '$totalPrice' }
            }
          }
        ],
        thisMonth: [
          { $match: { createdAt: { $gte: startOfMonth } } },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              revenue: { $sum: '$totalPrice' }
            }
          }
        ],
        statusBreakdown: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      today: stats[0].today[0] || { count: 0, revenue: 0 },
      thisWeek: stats[0].thisWeek[0] || { count: 0, revenue: 0 },
      thisMonth: stats[0].thisMonth[0] || { count: 0, revenue: 0 },
      statusBreakdown: stats[0].statusBreakdown
    }
  });
});