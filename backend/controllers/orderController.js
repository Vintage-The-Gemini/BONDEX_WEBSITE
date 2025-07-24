// backend/controllers/orderController.js
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (allows guest orders)
export const createOrder = async (req, res) => {
  try {
    const {
      customerInfo,
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes
    } = req.body;

    // Validation
    if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      return res.status(400).json({
        success: false,
        message: 'Customer information (name, email, phone) is required'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required'
      });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.county) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required'
      });
    }

    // Validate and process order items
    const processedItems = [];
    let subtotal = 0;

    for (const item of items) {
      if (!item.product || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have a valid product ID and quantity'
        });
      }

      // Get product details
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }

      if (product.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: `Product is not available: ${product.product_name}`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.product_name}. Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }

      const itemTotal = product.product_price * item.quantity;
      subtotal += itemTotal;

      processedItems.push({
        product: product._id,
        productName: product.product_name,
        productImage: product.product_images?.[0] || '',
        quantity: item.quantity,
        price: product.product_price,
        totalPrice: itemTotal
      });
    }

    // Calculate pricing
    const shippingCost = calculateShippingCost(shippingAddress, subtotal);
    const tax = calculateTax(subtotal);
    const totalAmount = subtotal + shippingCost + tax;

    // Create order
    const orderData = {
      customer: req.user?.id || null, // null for guest orders
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email.toLowerCase(),
        phone: customerInfo.phone
      },
      items: processedItems,
      shippingAddress: {
        fullName: shippingAddress.fullName || customerInfo.name,
        phone: shippingAddress.phone || customerInfo.phone,
        email: shippingAddress.email || customerInfo.email,
        address: shippingAddress.address,
        city: shippingAddress.city,
        county: shippingAddress.county,
        postalCode: shippingAddress.postalCode || '',
        country: shippingAddress.country || 'Kenya'
      },
      billingAddress: billingAddress || null,
      pricing: {
        subtotal,
        shippingCost,
        tax,
        discount: 0,
        totalAmount
      },
      payment: {
        method: paymentMethod || 'cash_on_delivery',
        status: 'pending'
      },
      shipping: {
        method: 'standard',
        cost: shippingCost,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      notes: {
        customer: notes?.customer || '',
        internal: ''
      },
      timeline: [{
        status: 'pending',
        note: 'Order created',
        timestamp: new Date()
      }],
      metadata: {
        source: 'web',
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip
      }
    };

    const order = new Order(orderData);
    await order.save();

    // Update product stock
    for (const item of processedItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Populate the order for response
    await order.populate('customer', 'name email');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });

  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// @desc    Get orders with filtering and pagination
// @route   GET /api/orders
// @access  Private (Admin) or Public (customer's own orders)
export const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query object
    let query = {};

    // If customer is accessing their own orders
    if (req.query.customer) {
      query.customer = req.query.customer;
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by payment status
    if (req.query.paymentStatus) {
      query['payment.status'] = req.query.paymentStatus;
    }

    // Search by order number or customer info
    if (req.query.search) {
      query.$or = [
        { orderNumber: { $regex: req.query.search, $options: 'i' } },
        { 'customerInfo.name': { $regex: req.query.search, $options: 'i' } },
        { 'customerInfo.email': { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      if (req.query.startDate) {
        query.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.createdAt.$lte = new Date(req.query.endDate);
      }
    }

    // Amount range filter
    if (req.query.minAmount || req.query.maxAmount) {
      query['pricing.totalAmount'] = {};
      if (req.query.minAmount) {
        query['pricing.totalAmount'].$gte = Number(req.query.minAmount);
      }
      if (req.query.maxAmount) {
        query['pricing.totalAmount'].$lte = Number(req.query.maxAmount);
      }
    }

    // Sorting
    let sortBy = {};
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
      sortBy[sortField] = sortOrder;
    } else {
      sortBy = { createdAt: -1 }; // Default: newest first
    }

    // Execute query
    const orders = await Order.find(query)
      .populate('customer', 'name email')
      .populate('items.product', 'product_name product_images')
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get Orders Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private (Admin or order owner)
export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    let query = { _id: id };

    // If customer is accessing, ensure they own the order
    if (req.customerAccess && req.user) {
      query.customer = req.user.id;
    }

    const order = await Order.findOne(query)
      .populate('customer', 'name email phone')
      .populate('items.product', 'product_name product_images product_description')
      .populate('timeline.updatedBy', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private (Admin only)
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove sensitive fields that shouldn't be updated directly
    delete updates._id;
    delete updates.orderNumber;
    delete updates.createdAt;
    delete updates.customer;

    const order = await Order.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('customer', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });

  } catch (error) {
    console.error('Update Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await order.updateStatus(status, note, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
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

// @desc    Add tracking information
// @route   PATCH /api/orders/:id/tracking
// @access  Private (Admin only)
export const addTrackingInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { trackingNumber, carrier } = req.body;

    if (!trackingNumber) {
      return res.status(400).json({
        success: false,
        message: 'Tracking number is required'
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await order.addTrackingInfo(trackingNumber, carrier);

    res.status(200).json({
      success: true,
      message: 'Tracking information added successfully',
      data: order
    });

  } catch (error) {
    console.error('Add Tracking Info Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding tracking information',
      error: error.message
    });
  }
};

// @desc    Process refund
// @route   POST /api/orders/:id/refund
// @access  Private (Admin only)
export const processRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.payment.status === 'refunded') {
      return res.status(400).json({
        success: false,
        message: 'Order has already been refunded'
      });
    }

    await order.processRefund(amount, reason, req.user.id);

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: order
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

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (Admin only)
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Restore product stock if order was not delivered/cancelled
    if (!['delivered', 'cancelled', 'refunded'].includes(order.status)) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity } }
        );
      }
    }

    await Order.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
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

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private (Admin only)
export const getOrderStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateRange = {};
    if (startDate || endDate) {
      if (startDate) dateRange.startDate = startDate;
      if (endDate) dateRange.endDate = endDate;
    }

    const stats = await Order.getOrderStats(dateRange);
    const topProducts = await Order.getTopProducts(10, dateRange);

    // Get status breakdown
    const statusBreakdown = await Order.aggregate([
      ...(Object.keys(dateRange).length > 0 ? [{ 
        $match: { 
          createdAt: {
            ...(dateRange.startDate && { $gte: new Date(dateRange.startDate) }),
            ...(dateRange.endDate && { $lte: new Date(dateRange.endDate) })
          }
        }
      }] : []),
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$pricing.totalAmount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats,
        topProducts,
        statusBreakdown
      }
    });

  } catch (error) {
    console.error('Get Order Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order statistics',
      error: error.message
    });
  }
};

// @desc    Get recent orders for dashboard
// @route   GET /api/orders/recent
// @access  Private (Admin only)
export const getRecentOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const recentOrders = await Order.find({})
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('orderNumber customerInfo pricing.totalAmount status createdAt');

    res.status(200).json({
      success: true,
      data: recentOrders
    });

  } catch (error) {
    console.error('Get Recent Orders Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent orders',
      error: error.message
    });
  }
};

// @desc    Export orders to CSV
// @route   GET /api/orders/export
// @access  Private (Admin only)
export const exportOrders = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;

    let query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });

    // Convert to CSV format
    const csvData = orders.map(order => ({
      'Order Number': order.orderNumber,
      'Customer Name': order.customerInfo.name,
      'Customer Email': order.customerInfo.email,
      'Customer Phone': order.customerInfo.phone,
      'Status': order.status,
      'Payment Status': order.payment.status,
      'Total Amount (KES)': order.pricing.totalAmount,
      'Shipping Cost (KES)': order.pricing.shippingCost,
      'Order Date': order.createdAt.toISOString().split('T')[0],
      'Shipping Address': `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.county}`,
      'Tracking Number': order.shipping.trackingNumber || 'N/A'
    }));

    res.status(200).json({
      success: true,
      data: csvData,
      message: `${csvData.length} orders exported successfully`
    });

  } catch (error) {
    console.error('Export Orders Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting orders',
      error: error.message
    });
  }
};

// Helper functions
const calculateShippingCost = (shippingAddress, subtotal) => {
  // Basic shipping calculation for Kenya
  const baseShipping = 300; // KES 300 base shipping
  const freeShippingThreshold = 5000; // Free shipping over KES 5000
  
  if (subtotal >= freeShippingThreshold) {
    return 0;
  }
  
  // Add extra cost for remote areas (simplified)
  const remoteCities = ['lodwar', 'mandera', 'wajir', 'garissa'];
  const city = shippingAddress.city.toLowerCase();
  
  if (remoteCities.includes(city)) {
    return baseShipping + 200; // Extra KES 200 for remote areas
  }
  
  return baseShipping;
};

const calculateTax = (subtotal) => {
  // Kenya VAT is 16%
  const vatRate = 0.16;
  return Math.round(subtotal * vatRate);
};