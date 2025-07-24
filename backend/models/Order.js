// backend/models/Order.js
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  productImage: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  county: {
    type: String,
    required: true,
    trim: true
  },
  postalCode: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    default: 'Kenya',
    trim: true
  }
}, { _id: false });

const paymentDetailsSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['mpesa', 'stripe', 'bank_transfer', 'cash_on_delivery'],
    required: true
  },
  transactionId: {
    type: String,
    trim: true
  },
  mpesaReceiptNumber: {
    type: String,
    trim: true
  },
  stripePaymentIntentId: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paidAt: {
    type: Date
  },
  refundedAt: {
    type: Date
  },
  refundAmount: {
    type: Number,
    min: 0
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow guest orders
  },
  customerInfo: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    }
  },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  billingAddress: {
    type: shippingAddressSchema,
    required: false // Use shipping address if not provided
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0
    },
    tax: {
      type: Number,
      default: 0,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    }
  },
  currency: {
    type: String,
    default: 'KES',
    enum: ['KES', 'USD', 'EUR']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  payment: paymentDetailsSchema,
  shipping: {
    method: {
      type: String,
      enum: ['standard', 'express', 'overnight', 'pickup'],
      default: 'standard'
    },
    cost: {
      type: Number,
      default: 0,
      min: 0
    },
    estimatedDelivery: {
      type: Date
    },
    actualDelivery: {
      type: Date
    },
    trackingNumber: {
      type: String,
      trim: true
    },
    carrier: {
      type: String,
      trim: true
    }
  },
  notes: {
    customer: {
      type: String,
      trim: true,
      maxlength: 500
    },
    internal: {
      type: String,
      trim: true,
      maxlength: 1000
    }
  },
  timeline: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: {
      type: String,
      trim: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  metadata: {
    source: {
      type: String,
      enum: ['web', 'mobile', 'admin', 'api'],
      default: 'web'
    },
    userAgent: String,
    ipAddress: String,
    sessionId: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customer: 1 });
orderSchema.index({ 'customerInfo.email': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'pricing.totalAmount': 1 });

// Virtual for formatted total amount
orderSchema.virtual('formattedTotal').get(function() {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: this.currency || 'KES'
  }).format(this.pricing.totalAmount);
});

// Virtual for order age
orderSchema.virtual('orderAge').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffInDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
  return diffInDays;
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find the highest order number for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const lastOrder = await this.constructor.findOne({
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    }).sort({ orderNumber: -1 });
    
    let sequence = 1;
    if (lastOrder && lastOrder.orderNumber) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `ORD${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
  }
  
  // Calculate pricing if not set
  if (this.isModified('items') || this.isNew) {
    this.pricing.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    this.pricing.totalAmount = this.pricing.subtotal + this.pricing.shippingCost + this.pricing.tax - this.pricing.discount;
  }
  
  next();
});

// Instance methods
orderSchema.methods.updateStatus = function(newStatus, note, updatedBy) {
  this.status = newStatus;
  this.timeline.push({
    status: newStatus,
    note,
    updatedBy
  });
  
  // Update payment status based on order status
  if (newStatus === 'delivered' && this.payment.status === 'completed') {
    this.payment.paidAt = new Date();
  }
  
  return this.save();
};

orderSchema.methods.addTrackingInfo = function(trackingNumber, carrier) {
  this.shipping.trackingNumber = trackingNumber;
  this.shipping.carrier = carrier;
  
  if (this.status === 'confirmed' || this.status === 'processing') {
    return this.updateStatus('shipped', `Package shipped with tracking: ${trackingNumber}`);
  }
  
  return this.save();
};

orderSchema.methods.processRefund = function(amount, reason, processedBy) {
  this.payment.status = 'refunded';
  this.payment.refundedAt = new Date();
  this.payment.refundAmount = amount || this.pricing.totalAmount;
  this.status = 'refunded';
  
  this.timeline.push({
    status: 'refunded',
    note: `Refund processed: KES ${amount || this.pricing.totalAmount}. Reason: ${reason}`,
    updatedBy: processedBy
  });
  
  return this.save();
};

// Static methods
orderSchema.statics.getOrderStats = async function(dateRange = {}) {
  const { startDate, endDate } = dateRange;
  const matchStage = {};
  
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.totalAmount' },
        averageOrderValue: { $avg: '$pricing.totalAmount' },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        completedOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    pendingOrders: 0,
    completedOrders: 0
  };
};

orderSchema.statics.getTopProducts = async function(limit = 10, dateRange = {}) {
  const { startDate, endDate } = dateRange;
  const matchStage = {};
  
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }
  
  return this.aggregate([
    { $match: matchStage },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        productName: { $first: '$items.productName' },
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: { $sum: '$items.totalPrice' },
        orderCount: { $sum: 1 }
      }
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: limit }
  ]);
};

const Order = mongoose.model('Order', orderSchema);

export default Order;