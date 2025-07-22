// backend/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // Fields matching your SQL database structure
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
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  links: {
    type: String,
    trim: true,
    default: ''
  },
  product_price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  product_image: {
    type: String,
    default: ''
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
  
  // Product features and specifications
  features: [{
    type: String,
    trim: true
  }],
  specifications: {
    weight: String,
    dimensions: String,
    material: String,
    certification: String,
    warranty: String
  },
  
  // Images (will use Cloudinary URLs)
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
    }
  }],
  mainImage: {
    type: String, // Primary image URL
    default: ''
  },
  
  // Inventory management
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  
  // Product status and visibility
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft', 'out_of_stock'],
    default: 'active'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // SEO and marketing
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    sparse: true
  },
  metaTitle: {
    type: String,
    trim: true,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Sales and rating data
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: [0, 'Review count cannot be negative']
  },
  salesCount: {
    type: Number,
    default: 0,
    min: [0, 'Sales count cannot be negative']
  },
  views: {
    type: Number,
    default: 0
  },
  purchaseCount: {
    type: Number,
    default: 0
  },
  
  // Migration fields (to help with SQL to MongoDB conversion)
  product_id: {
    type: Number, // Original SQL database ID
    unique: true,
    sparse: true
  },
  
  // Admin tracking
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculating final price (regular price or sale price)
productSchema.virtual('finalPrice').get(function() {
  if (this.isOnSale && this.salePrice) {
    // Check if sale is still valid
    if (!this.saleEndDate || this.saleEndDate > new Date()) {
      return this.salePrice;
    }
  }
  return this.product_price;
});

// Virtual for calculating discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.isOnSale && this.salePrice && this.product_price) {
    return Math.round(((this.product_price - this.salePrice) / this.product_price) * 100);
  }
  return 0;
});

// Virtual for checking if product is low in stock
productSchema.virtual('isLowStock').get(function() {
  return this.stock <= this.lowStockThreshold && this.stock > 0;
});

// Virtual for checking if product is out of stock
productSchema.virtual('isOutOfStock').get(function() {
  return this.stock <= 0;
});

// Virtual for formatted price in KES
productSchema.virtual('formattedPrice').get(function() {
  return `KES ${this.product_price.toLocaleString()}`;
});

// Virtual for formatted final price in KES
productSchema.virtual('formattedFinalPrice').get(function() {
  return `KES ${this.finalPrice.toLocaleString()}`;
});

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  // Generate slug from product name if modified
  if (this.isModified('product_name') || !this.slug) {
    this.slug = this.product_name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens
  }
  
  // Auto-generate meta fields if not provided
  if (!this.metaTitle) {
    this.metaTitle = this.product_name.length > 60 
      ? this.product_name.substring(0, 57) + '...' 
      : this.product_name;
  }
  
  if (!this.metaDescription) {
    this.metaDescription = this.product_description.length > 160 
      ? this.product_description.substring(0, 157) + '...' 
      : this.product_description;
  }
  
  // Update status based on stock
  if (this.stock <= 0 && this.status === 'active') {
    this.status = 'out_of_stock';
  } else if (this.stock > 0 && this.status === 'out_of_stock') {
    this.status = 'active';
  }
  
  // Validate sale end date
  if (this.isOnSale && this.saleEndDate && this.saleEndDate <= new Date()) {
    this.isOnSale = false;
    this.salePrice = null;
    this.saleEndDate = null;
  }
  
  next();
});

// Index for better query performance
productSchema.index({ product_name: 'text', product_description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isOnSale: 1 });
productSchema.index({ product_price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ stock: 1 });
productSchema.index({ slug: 1 });

// Instance method to check if product is available
productSchema.methods.isAvailable = function() {
  return this.status === 'active' && this.stock > 0;
};

// Instance method to get main image
productSchema.methods.getMainImage = function() {
  return this.images && this.images.length > 0 
    ? this.images[0].url 
    : this.mainImage || '/images/placeholder-product.jpg';
};

// Static method to get products by category
productSchema.statics.findByCategory = function(categoryId, options = {}) {
  const query = { category: categoryId, status: 'active' };
  
  let queryBuilder = this.find(query).populate('category', 'name slug');
  
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

// Static method to get featured products
productSchema.statics.getFeatured = function(limit = 8) {
  return this.find({ 
    isFeatured: true, 
    status: 'active',
    stock: { $gt: 0 }
  })
  .populate('category', 'name slug')
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
  .populate('category', 'name slug')
  .sort({ createdAt: -1 })
  .limit(limit)
  .exec();
};

// Static method to search products
productSchema.statics.searchProducts = function(searchTerm, options = {}) {
  const query = {
    $and: [
      { status: 'active' },
      {
        $or: [
          { product_name: { $regex: searchTerm, $options: 'i' } },
          { product_description: { $regex: searchTerm, $options: 'i' } },
          { product_brand: { $regex: searchTerm, $options: 'i' } },
          { tags: { $in: [new RegExp(searchTerm, 'i')] } }
        ]
      }
    ]
  };
  
  let queryBuilder = this.find(query).populate('category', 'name slug');
  
  // Apply filters
  if (options.category) {
    query.$and.push({ category: options.category });
  }
  
  if (options.minPrice !== undefined || options.maxPrice !== undefined) {
    const priceFilter = {};
    if (options.minPrice !== undefined) priceFilter.$gte = options.minPrice;
    if (options.maxPrice !== undefined) priceFilter.$lte = options.maxPrice;
    query.$and.push({ product_price: priceFilter });
  }
  
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

// Static method to get low stock products (for admin)
productSchema.statics.getLowStockProducts = function() {
  return this.find({
    status: 'active',
    $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    stock: { $gt: 0 }
  })
  .populate('category', 'name slug')
  .sort({ stock: 1 })
  .exec();
};

// Static method to get out of stock products (for admin)
productSchema.statics.getOutOfStockProducts = function() {
  return this.find({
    stock: 0,
    status: { $in: ['active', 'out_of_stock'] }
  })
  .populate('category', 'name slug')
  .sort({ updatedAt: -1 })
  .exec();
};

// Static method to get product statistics (for admin dashboard)
productSchema.statics.getProductStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        activeProducts: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        draftProducts: {
          $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
        },
        outOfStockProducts: {
          $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] }
        },
        lowStockProducts: {
          $sum: { 
            $cond: [
              { 
                $and: [
                  { $lte: ['$stock', '$lowStockThreshold'] },
                  { $gt: ['$stock', 0] }
                ]
              }, 
              1, 
              0
            ]
          }
        },
        featuredProducts: {
          $sum: { $cond: ['$isFeatured', 1, 0] }
        },
        productsOnSale: {
          $sum: { $cond: ['$isOnSale', 1, 0] }
        },
        totalValue: { $sum: { $multiply: ['$product_price', '$stock'] } },
        averagePrice: { $avg: '$product_price' },
        totalViews: { $sum: '$views' },
        totalPurchases: { $sum: '$purchaseCount' }
      }
    }
  ]);
  
  return stats[0] || {
    totalProducts: 0,
    activeProducts: 0,
    draftProducts: 0,
    outOfStockProducts: 0,
    lowStockProducts: 0,
    featuredProducts: 0,
    productsOnSale: 0,
    totalValue: 0,
    averagePrice: 0,
    totalViews: 0,
    totalPurchases: 0
  };
};

const Product = mongoose.model('Product', productSchema);

export default Product;