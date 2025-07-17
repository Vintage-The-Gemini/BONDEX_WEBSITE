// backend/src/controllers/orderController.js
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import { createPaymentIntent } from '../config/stripe.js';
import createTransporter, { emailTemplates } from '../config/email.js';  // Fixed import
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
    const orderTemplate = emailTemplates.orderConfirmation;
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: req.user.email,
      subject: orderTemplate.subject,
      html: orderTemplate.getHtml({
        orderNumber: order.orderNumber,
        customerName: req.user.name,
        totalAmount: order.totalPrice,
        paymentMethod: order.paymentMethod,
        orderId: order._id
      })
    });

    logger.info(`Order confirmation email sent for order ${order.orderNumber}`);
  } catch (error) {
    logger.error('Failed to send order confirmation email:', error);
    // Don't fail order creation if email fails
  }

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order
  });
});

// @desc    Get all orders for logged in user (Private)
// @route   GET /api/orders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: req.user.id })
    .populate('orderItems.product', 'name image price')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments({ user: req.user.id });

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: orders
  });
});

// @desc    Get single order (Private)
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name image price');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Check if order belongs to user (unless admin)
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
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

// @desc    Update order to paid (Private)
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Check if order belongs to user (unless admin)
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this order'
    });
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer?.email_address
  };

  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    data: updatedOrder
  });
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid order status'
    });
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  order.orderStatus = status;
  
  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    message: `Order status updated to ${status}`,
    data: updatedOrder
  });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Build query filters
  const queryObj = {};
  if (req.query.status) {
    queryObj.orderStatus = req.query.status;
  }
  if (req.query.isPaid) {
    queryObj.isPaid = req.query.isPaid === 'true';
  }

  const orders = await Order.find(queryObj)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name price')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(queryObj);

  // Calculate statistics
  const stats = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: '$totalPrice' }
      }
    }