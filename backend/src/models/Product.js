import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: [500, 'Review cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    maxlength: [200, 'Product name cannot exceed 200 characters'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(value) {
        return value > 0;
      },
      message: 'Price must be greater than 0 KES'
    }
  },
  currency: {
    type: String,
    default: 'KES',
    enum: ['KES']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  protectionType: {
    type: String,
    required: [true, 'Please specify protection type'],
    enum: {
      values: ['Head', 'Foot', 'Eye', 'Hand', 'Breathing'],
      message: 'Protection type must be one of: Head, Foot, Eye, Hand, Breathing'
    }
  },
  industry: {
    type: String,
    required: [true, 'Please specify target industry'],
    enum: {
      values: ['Medical', 'Construction', 'Manufacturing'],
      message: 'Industry must be one of: Medical, Construction, Manufacturing'
    }
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  brand: {
    type: String,
    required: [true, 'Please provide brand name']
  },
  model: String,
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['kg', 'g'],
      default: 'kg'
    }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'm'],
      default: 'cm'
    }
  },
  specifications: [{
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }],
  features: [String],
  certifications: [{
    name: String,
    issuedBy: String,
    certificateNumber: String,
    validUntil: Date
  }],
  safetyStandards: [String],
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema],
  featured: {
    type: Boolean,
    default: false
  },
  onSale: {
    type: Boolean,
    default: false
  },
  salePrice: {
    type: Number,
    min: 0
  },
  saleStartDate: Date,
  saleEndDate: Date,
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued', 'out_of_stock'],
    default: 'active'
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  tags: [String],
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  totalSold: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for search and filtering
productSchema.index({
  name: 'text',
  description: 'text',
  shortDescription: 'text',
  brand: 'text',
  'specifications.name': 'text',
  'specifications.value': 'text'
});

productSchema.index({ protectionType: 1, industry: 1 });
productSchema.index({ price: 1 });
productSchema.index({ ratings: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ featured: -1 });
productSchema.index({ status: 1 });
productSchema.index({ stock: 1 });

// Virtual properties
productSchema.virtual('isLowStock').get(function() {
  return this.stock <= this.lowStockThreshold;
});

productSchema.virtual('isOutOfStock').get(function() {
  return this.stock === 0;
});

productSchema.virtual('formattedPrice').get(function() {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(this.price);
});

productSchema.virtual('formattedSalePrice').get(function() {
  if (this.salePrice) {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(this.salePrice);
  }
  return null;
});

productSchema.virtual('discountPercentage').get(function() {
  if (this.salePrice && this.price > this.salePrice) {
    return Math.round(((this.price - this.salePrice) / this.price) * 100);
  }
  return 0;
});

productSchema.virtual('currentPrice').get(function() {
  if (this.onSale && this.salePrice && 
      this.saleStartDate <= new Date() && 
      this.saleEndDate >= new Date()) {
    return this.salePrice;
  }
  return this.price;
});

// Methods
productSchema.methods.updateRatings = function() {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.ratings = (totalRating / this.reviews.length).toFixed(1);
    this.numOfReviews = this.reviews.length;
  } else {
    this.ratings = 0;
    this.numOfReviews = 0;
  }
};

productSchema.methods.updateStock = function(quantity, operation = 'subtract') {
  if (operation === 'subtract') {
    this.stock = Math.max(0, this.stock - quantity);
  } else if (operation === 'add') {
    this.stock += quantity;
  }
  
  if (this.stock === 0) {
    this.status = 'out_of_stock';
  } else if (this.status === 'out_of_stock') {
    this.status = 'active';
  }
};

// Auto-generate SKU if not provided
productSchema.pre('save', function(next) {
  if (!this.sku) {
    const prefix = this.protectionType.substring(0, 2).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    this.sku = `${prefix}${timestamp}`;
  }
  next();
});

export default mongoose.model('Product', productSchema);