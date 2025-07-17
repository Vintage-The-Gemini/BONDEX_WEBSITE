// backend/src/models/Coupon.js
import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true // Use index: true in field definition instead of separate index
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

// Indexes (removed duplicate code index)
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
couponSchema.methods.calculateDiscount = function(orderAmount) {
  if (!this.isValid) return 0;
  
  if (orderAmount < this.minimumOrderAmount) return 0;
  
  let discount = 0;
  
  if (this.type === 'percentage') {
    discount = (orderAmount * this.value) / 100;
    if (this.maximumDiscountAmount) {
      discount = Math.min(discount, this.maximumDiscountAmount);
    }
  } else {
    discount = this.value;
  }
  
  return Math.min(discount, orderAmount);
};

couponSchema.methods.incrementUsage = function() {
  this.usedCount += 1;
  return this.save();
};

export default mongoose.model('Coupon', couponSchema);