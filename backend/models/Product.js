// backend/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // Basic Product Information
  product_name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  product_description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  product_brand: {
    type: String,
    trim: true,
    default: ''
  },
  
  // ✅ FIXED: Unique slug with better validation
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    index: true // Add index for better query performance
  },
  
  // ENHANCED: Multiple Categories Support
  // Primary category (protection type - required)
  primaryCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Primary category (protection type) is required']
  },
  
  // Secondary categories (industries, certifications, etc.)
  secondaryCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  
  // ALL categories (computed field for easy querying)
  allCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  
  // Legacy field for backward compatibility
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  
  // Pricing
  product_price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  
  // Sale functionality
  salePrice: {
    type: Number,
    min: [0, 'Sale price cannot be negative'],
    validate: {
      validator: function(value) {
        if (value && this.product_price) {
          return value < this.product_price;
        }
        return true;
      },
      message: 'Sale price must be less than regular price'
    }
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  saleStartDate: {
    type: Date
  },
  saleEndDate: {
    type: Date,
    validate: {
      validator: function(value) {
        if (this.isOnSale && value) {
          return value > new Date();
        }
        return true;
      },
      message: 'Sale end date must be in the future'
    }
  },
  
  // Inventory Management
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: [0, 'Low stock threshold cannot be negative']
  },
  
  // Product Images (Cloudinary integration)
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  mainImage: {
    type: String,
    default: ''
  },
  product_image: {
    type: String,
    default: ''
  },
  
  // Product Features and Specifications
  features: [{
    type: String,
    trim: true
  }],
  specifications: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Certifications and Compliance
  certifications: [{
    type: String,
    trim: true
  }],
  complianceStandards: [{
    type: String,
    trim: true
  }],
  
  // Product Status and Visibility
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft', 'archived'],
    default: 'active'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  
  // SEO and Marketing
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  keywords: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Analytics and Performance
  views: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  },
  avgRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Tracking fields
  lastViewedAt: {
    type: Date,
    default: Date.now
  },
  lastOrderedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ✅ INDEXES for better query performance
productSchema.index({ product_name: 'text', product_description: 'text', product_brand: 'text' });
productSchema.index({ allCategories: 1, status: 1 });
productSchema.index({ status: 1, isFeatured: -1, createdAt: -1 });
productSchema.index({ stock: 1, lowStockThreshold: 1 }); // For low stock queries
productSchema.index({ isOnSale: 1, saleEndDate: 1 }); // For sale products
productSchema.index({ createdAt: -1 }); // For recent products
productSchema.index({ salesCount: -1 }); // For popular products
productSchema.index({ product_price: 1 }); // For price sorting

// ✅ COMPOUND INDEX for category + status
productSchema.index({ primaryCategory: 1, status: 1 });
productSchema.index({ allCategories: 1, status: 1, isFeatured: -1 });

// ✅ VIRTUAL FIELDS
productSchema.virtual('isLowStock').get(function() {
  return this.stock <= this.lowStockThreshold;
});

productSchema.virtual('isOutOfStock').get(function() {
  return this.stock === 0;
});

productSchema.virtual('currentPrice').get(function() {
  if (this.isOnSale && this.salePrice && this.saleEndDate > new Date()) {
    return this.salePrice;
  }
  return this.product_price;
});

productSchema.virtual('discount').get(function() {
  if (this.isOnSale && this.salePrice && this.product_price > this.salePrice) {
    return Math.round(((this.product_price - this.salePrice) / this.product_price) * 100);
  }
  return 0;
});

productSchema.virtual('displayImage').get(function() {
  return (this.images && this.images.length > 0 ? 
    this.images.find(img => img.isMain)?.url || this.images[0].url : '') ||
    this.mainImage || 
    this.product_image || 
    '/images/placeholder-product.jpg';
});

// ✅ REMOVED problematic pre-save slug generation middleware
// Slug generation is now handled in the controller for better control

// Pre-save middleware for other fields (keeping the good parts)
productSchema.pre('save', function(next) {
  // Set legacy category field for backward compatibility
  if (this.primaryCategory && !this.category) {
    this.category = this.primaryCategory;
  }
  
  // Update allCategories array
  this.allCategories = [this.primaryCategory, ...this.secondaryCategories].filter(Boolean);
  
  // Set main image
  if (this.images && this.images.length > 0) {
    const mainImg = this.images.find(img => img.isMain) || this.images[0];
    if (mainImg) {
      this.mainImage = mainImg.url;
      this.product_image = mainImg.url;
    }
  }
  
  // Auto-generate meta fields if not provided
  if (!this.metaTitle) {
    this.metaTitle = this.product_name;
  }
  if (!this.metaDescription && this.product_description) {
    this.metaDescription = this.product_description.substring(0, 160);
  }
  
  // Update lastUpdatedBy if this is an update
  if (!this.isNew && this.modifiedPaths().length > 0) {
    this.lastUpdatedBy = this.lastUpdatedBy || this.createdBy;
  }
  
  next();
});

// ✅ INSTANCE METHODS
// Method to add secondary category
productSchema.methods.addSecondaryCategory = function(categoryId) {
  if (!this.secondaryCategories.includes(categoryId)) {
    this.secondaryCategories.push(categoryId);
    this.allCategories = [this.primaryCategory, ...this.secondaryCategories].filter(Boolean);
  }
  return this.save();
};

// Method to remove secondary category
productSchema.methods.removeSecondaryCategory = function(categoryId) {
  this.secondaryCategories = this.secondaryCategories.filter(
    cat => cat.toString() !== categoryId.toString()
  );
  this.allCategories = [this.primaryCategory, ...this.secondaryCategories].filter(Boolean);
  return this.save();
};

// Method to check if product belongs to category
productSchema.methods.belongsToCategory = function(categoryId) {
  return this.allCategories.some(cat => cat.toString() === categoryId.toString());
};

// Method to get category names
productSchema.methods.getCategoryNames = function() {
  const categories = [];
  if (this.primaryCategory && this.primaryCategory.name) {
    categories.push(this.primaryCategory.name);
  }
  if (this.secondaryCategories) {
    this.secondaryCategories.forEach(cat => {
      if (cat.name) categories.push(cat.name);
    });
  }
  return categories;
};

// Method to update view count
productSchema.methods.incrementViews = function() {
  this.views += 1;
  this.lastViewedAt = new Date();
  return this.save();
};

// Method to update sales count
productSchema.methods.incrementSales = function(quantity = 1) {
  this.salesCount += quantity;
  this.lastOrderedAt = new Date();
  return this.save();
};

// Method to update stock
productSchema.methods.updateStock = function(quantity, operation = 'subtract') {
  if (operation === 'subtract') {
    this.stock = Math.max(0, this.stock - quantity);
  } else if (operation === 'add') {
    this.stock += quantity;
  } else if (operation === 'set') {
    this.stock = Math.max(0, quantity);
  }
  return this.save();
};

// ✅ STATIC METHODS
// Find products by category
productSchema.statics.findByCategory = function(categoryId, options = {}) {
  const query = { allCategories: categoryId, status: 'active' };
  return this.find(query, null, options)
    .populate('primaryCategory', 'name slug type icon')
    .populate('secondaryCategories', 'name slug type icon');
};

// Find low stock products
productSchema.statics.findLowStock = function() {
  return this.find({
    $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    status: 'active'
  }).populate('primaryCategory', 'name slug type icon');
};

// Find featured products
productSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ isFeatured: true, status: 'active' })
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate('primaryCategory', 'name slug type icon');
};

// Find products on sale
productSchema.statics.findOnSale = function() {
  return this.find({
    isOnSale: true,
    saleEndDate: { $gt: new Date() },
    status: 'active'
  }).populate('primaryCategory', 'name slug type icon');
};

// Search products
productSchema.statics.searchProducts = function(searchTerm, options = {}) {
  const {
    category,
    priceRange,
    inStock = true,
    limit = 20,
    skip = 0,
    sortBy = 'relevance'
  } = options;

  let query = {
    $text: { $search: searchTerm },
    status: 'active'
  };

  if (category) {
    query.allCategories = category;
  }

  if (priceRange) {
    query.product_price = {
      $gte: priceRange.min || 0,
      $lte: priceRange.max || Number.MAX_VALUE
    };
  }

  if (inStock) {
    query.stock = { $gt: 0 };
  }

  let sort = {};
  switch (sortBy) {
    case 'price_low':
      sort = { product_price: 1 };
      break;
    case 'price_high':
      sort = { product_price: -1 };
      break;
    case 'newest':
      sort = { createdAt: -1 };
      break;
    case 'popular':
      sort = { salesCount: -1, views: -1 };
      break;
    case 'rating':
      sort = { avgRating: -1, reviewCount: -1 };
      break;
    default: // relevance
      sort = { score: { $meta: 'textScore' } };
  }

  return this.find(query)
    .select(sortBy === 'relevance' ? { score: { $meta: 'textScore' } } : {})
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('primaryCategory', 'name slug type icon')
    .populate('secondaryCategories', 'name slug type icon');
};

// ✅ POST-SAVE MIDDLEWARE to update category product counts
productSchema.post('save', async function(doc) {
  try {
    // Update product count for all associated categories
    const Category = mongoose.model('Category');
    
    if (doc.allCategories && doc.allCategories.length > 0) {
      for (const categoryId of doc.allCategories) {
        const count = await mongoose.model('Product').countDocuments({
          allCategories: categoryId,
          status: 'active'
        });
        
        await Category.findByIdAndUpdate(categoryId, {
          productCount: count
        });
      }
    }
  } catch (error) {
    console.error('Error updating category product counts:', error);
  }
});

// ✅ POST-REMOVE MIDDLEWARE to update category counts when product is deleted
productSchema.post('findOneAndDelete', async function(doc) {
  if (doc && doc.allCategories) {
    try {
      const Category = mongoose.model('Category');
      
      for (const categoryId of doc.allCategories) {
        const count = await mongoose.model('Product').countDocuments({
          allCategories: categoryId,
          status: 'active'
        });
        
        await Category.findByIdAndUpdate(categoryId, {
          productCount: count
        });
      }
    } catch (error) {
      console.error('Error updating category product counts after deletion:', error);
    }
  }
});

// ✅ VALIDATION HELPERS
productSchema.methods.validateSalePrice = function() {
  if (this.isOnSale) {
    if (!this.salePrice) {
      throw new Error('Sale price is required when product is on sale');
    }
    if (this.salePrice >= this.product_price) {
      throw new Error('Sale price must be less than regular price');
    }
    if (this.saleEndDate && this.saleEndDate <= new Date()) {
      throw new Error('Sale end date must be in the future');
    }
  }
};

// ✅ PRE-VALIDATE MIDDLEWARE
productSchema.pre('validate', function(next) {
  try {
    // Validate sale configuration
    this.validateSalePrice();
    
    // Ensure at least one image
    if (!this.images || this.images.length === 0) {
      this.invalidate('images', 'At least one product image is required');
    }
    
    // Validate categories
    if (!this.primaryCategory) {
      this.invalidate('primaryCategory', 'Primary category is required');
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;