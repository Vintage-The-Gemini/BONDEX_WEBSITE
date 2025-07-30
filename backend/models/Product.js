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
    weight: String,
    dimensions: String,
    material: String,
    certification: String,
    warranty: String,
    standards: [String], // Safety standards like ANSI, CE, etc.
    applications: [String], // Where it can be used
    compliance: [String] // Regulatory compliance
  },
  
  // Product Status and Visibility
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft', 'discontinued'],
    default: 'active'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: true
  },
  
  // SEO and Marketing
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  metaTitle: String,
  metaDescription: String,
  keywords: [String],
  tags: [String],
  
  // Analytics and Performance
  views: {
    type: Number,
    default: 0
  },
  totalSold: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  
  // Legacy fields for compatibility
  links: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
productSchema.index({ primaryCategory: 1, status: 1 });
productSchema.index({ secondaryCategories: 1, status: 1 });
productSchema.index({ allCategories: 1, status: 1 });
productSchema.index({ product_name: 'text', product_description: 'text' });
productSchema.index({ product_price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ slug: 1 });
productSchema.index({ isFeatured: 1, status: 1 });
productSchema.index({ isOnSale: 1, status: 1 });

// Virtual for effective price (sale price if on sale, otherwise regular price)
productSchema.virtual('effectivePrice').get(function() {
  if (this.isOnSale && this.salePrice && (!this.saleEndDate || this.saleEndDate > new Date())) {
    return this.salePrice;
  }
  return this.product_price;
});

// Virtual for savings amount
productSchema.virtual('savingsAmount').get(function() {
  if (this.isOnSale && this.salePrice) {
    return this.product_price - this.salePrice;
  }
  return 0;
});

// Virtual for savings percentage
productSchema.virtual('savingsPercentage').get(function() {
  if (this.isOnSale && this.salePrice && this.product_price > 0) {
    return Math.round(((this.product_price - this.salePrice) / this.product_price) * 100);
  }
  return 0;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stock <= 0) return 'out_of_stock';
  if (this.stock <= this.lowStockThreshold) return 'low_stock';
  return 'in_stock';
});

// Virtual for main image URL
productSchema.virtual('mainImageUrl').get(function() {
  return this.mainImage || 
    (this.images && this.images.length > 0 ? this.images[0].url : '') ||
    this.product_image || 
    '/images/placeholder-product.jpg';
});

// Pre-save middleware to generate slug and manage categories
productSchema.pre('save', function(next) {
  // Generate slug from product name
  if (this.isModified('product_name') || !this.slug) {
    this.slug = this.product_name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Set legacy category field for backward compatibility
  if (this.primaryCategory && !this.category) {
    this.category = this.primaryCategory;
  }
  
  // Update allCategories array
  this.allCategories = [this.primaryCategory, ...this.secondaryCategories].filter(Boolean);
  
  // Set main image
  if (this.images && this.images.length > 0 && !this.mainImage) {
    const mainImg = this.images.find(img => img.isMain) || this.images[0];
    this.mainImage = mainImg.url;
    this.product_image = mainImg.url;
  }
  
  // Auto-generate meta fields if not provided
  if (!this.metaTitle) {
    this.metaTitle = this.product_name;
  }
  if (!this.metaDescription) {
    this.metaDescription = this.product_description.substring(0, 160);
  }
  
  next();
});

// Pre-save middleware for insertMany operations
productSchema.pre('insertMany', function(next, docs) {
  if (Array.isArray(docs)) {
    docs.forEach(doc => {
      if (!doc.slug && doc.product_name) {
        doc.slug = doc.product_name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      
      // Set allCategories
      if (doc.primaryCategory) {
        doc.allCategories = [doc.primaryCategory, ...(doc.secondaryCategories || [])].filter(Boolean);
        if (!doc.category) {
          doc.category = doc.primaryCategory;
        }
      }
    });
  }
  next();
});

// Static method to find products by multiple categories
productSchema.statics.findByCategories = function(categoryIds, options = {}) {
  const query = { 
    allCategories: { $in: categoryIds },
    status: 'active' 
  };
  
  let queryBuilder = this.find(query)
    .populate('primaryCategory', 'name slug type')
    .populate('secondaryCategories', 'name slug type');
  
  // Apply sorting
  if (options.sort) {
    queryBuilder = queryBuilder.sort(options.sort);
  } else {
    queryBuilder = queryBuilder.sort({ createdAt: -1 });
  }
  
  // Apply pagination
  if (options.page && options.limit) {
    const skip = (options.page - 1) * options.limit;
    queryBuilder = queryBuilder.skip(skip).limit(options.limit);
  }
  
  return queryBuilder.exec();
};

// Static method to get products by protection type AND industry
productSchema.statics.findByProtectionAndIndustry = function(protectionTypeId, industryId, options = {}) {
  const query = {
    primaryCategory: protectionTypeId,
    secondaryCategories: industryId,
    status: 'active'
  };
  
  return this.find(query)
    .populate('primaryCategory', 'name slug type')
    .populate('secondaryCategories', 'name slug type')
    .sort(options.sort || { createdAt: -1 })
    .exec();
};

// Static method to get featured products with category info
productSchema.statics.getFeatured = function(limit = 8) {
  return this.find({ 
    isFeatured: true, 
    status: 'active',
    stock: { $gt: 0 }
  })
  .populate('primaryCategory', 'name slug type')
  .populate('secondaryCategories', 'name slug type')
  .sort({ createdAt: -1 })
  .limit(limit)
  .exec();
};

// Static method to get products on sale
productSchema.statics.getOnSale = function(limit = 12) {
  return this.find({ 
    isOnSale: true, 
    status: 'active',
    stock: { $gt: 0 },
    $or: [
      { saleEndDate: { $gt: new Date() } },
      { saleEndDate: null }
    ]
  })
  .populate('primaryCategory', 'name slug type')
  .populate('secondaryCategories', 'name slug type')
  .sort({ createdAt: -1 })
  .limit(limit)
  .exec();
};

// Static method to search products across categories
productSchema.statics.searchProducts = function(searchTerm, options = {}) {
  const query = {
    $and: [
      { status: 'active' },
      {
        $or: [
          { product_name: { $regex: searchTerm, $options: 'i' } },
          { product_description: { $regex: searchTerm, $options: 'i' } },
          { product_brand: { $regex: searchTerm, $options: 'i' } },
          { keywords: { $regex: searchTerm, $options: 'i' } },
          { tags: { $regex: searchTerm, $options: 'i' } }
        ]
      }
    ]
  };
  
  // Add category filters if provided
  if (options.categoryIds && options.categoryIds.length > 0) {
    query.$and.push({
      allCategories: { $in: options.categoryIds }
    });
  }
  
  // Add price range filter
  if (options.minPrice || options.maxPrice) {
    const priceFilter = {};
    if (options.minPrice) priceFilter.$gte = parseFloat(options.minPrice);
    if (options.maxPrice) priceFilter.$lte = parseFloat(options.maxPrice);
    query.$and.push({ product_price: priceFilter });
  }
  
  let queryBuilder = this.find(query)
    .populate('primaryCategory', 'name slug type')
    .populate('secondaryCategories', 'name slug type');
  
  // Apply sorting
  if (options.sort) {
    queryBuilder = queryBuilder.sort(options.sort);
  } else {
    queryBuilder = queryBuilder.sort({ createdAt: -1 });
  }
  
  // Apply pagination
  if (options.page && options.limit) {
    const skip = (options.page - 1) * options.limit;
    queryBuilder = queryBuilder.skip(skip).limit(options.limit);
  }
  
  return queryBuilder.exec();
};

// Instance method to add category
productSchema.methods.addSecondaryCategory = function(categoryId) {
  if (!this.secondaryCategories.includes(categoryId)) {
    this.secondaryCategories.push(categoryId);
    this.allCategories = [this.primaryCategory, ...this.secondaryCategories].filter(Boolean);
  }
  return this.save();
};

// Instance method to remove category
productSchema.methods.removeSecondaryCategory = function(categoryId) {
  this.secondaryCategories = this.secondaryCategories.filter(
    cat => cat.toString() !== categoryId.toString()
  );
  this.allCategories = [this.primaryCategory, ...this.secondaryCategories].filter(Boolean);
  return this.save();
};

// Instance method to check if product belongs to category
productSchema.methods.belongsToCategory = function(categoryId) {
  return this.allCategories.some(cat => cat.toString() === categoryId.toString());
};

// Instance method to get category names
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

// Post-save middleware to update category product counts
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

const Product = mongoose.model('Product', productSchema);

export default Product;