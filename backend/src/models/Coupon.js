import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: [0, 'Value cannot be negative']
  },
  minimumOrderAmount: {
    type: Number,
    default: 0
  },
  maximumDiscountAmount: {
    type: Number // For percentage coupons
  },
  currency: {
    type: String,
    default: 'KES'
  },
  usageLimit: {
    type: Number,
    default: null // null means unlimited
  },
  usedCount: {
    type: Number,
    default: 0
  },
  userUsageLimit: {
    type: Number,
    default: 1 // How many times one user can use this coupon
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  protectionTypes: [{
    type: String,
    enum: ['Head', 'Foot', 'Eye', 'Hand', 'Breathing']
  }],
  industries: [{
    type: String,
    enum: ['Medical', 'Construction', 'Manufacturing']
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true // Public coupons can be used by anyone
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
couponSchema.index({ endDate: 1 });

// Virtual properties
couponSchema.virtual('isValid').get(function() {
  const now = new Date();
  return this.isActive && 
         this.startDate <= now && 
         this.endDate >= now &&
         (this.usageLimit === null || this.usedCount < this.usageLimit);
});

couponSchema.virtual('formattedValue').get(function() {
  if (this.type === 'percentage') {
    return `${this.value}%`;
  } else {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(this.value);
  }
});

// Methods
couponSchema.methods.calculateDiscount = function(orderAmount, items = []) {
  if (!this.isValid) {
    return 0;
  }

  if (orderAmount < this.minimumOrderAmount) {
    return 0;
  }

  let applicableAmount = orderAmount;

  // If coupon is restricted to specific products/categories
  if (this.applicableProducts.length > 0 || this.applicableCategories.length > 0) {
    applicableAmount = 0;
    // Calculate applicable amount based on items
    // This would need to be implemented based on the items passed
  }

  let discount = 0;
  if (this.type === 'percentage') {
    discount = (applicableAmount * this.value) / 100;
    if (this.maximumDiscountAmount && discount > this.maximumDiscountAmount) {
      discount = this.maximumDiscountAmount;
    }
  } else {
    discount = Math.min(this.value, applicableAmount);
  }

  return Math.round(discount * 100) / 100; // Round to 2 decimal places
};

couponSchema.methods.incrementUsage = function() {
  this.usedCount += 1;
};

export default mongoose.model('Coupon', couponSchema);