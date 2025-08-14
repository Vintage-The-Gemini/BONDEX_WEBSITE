// File Path: backend/models/Product.js
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
  
  // 🔧 FIX: Add SKU field WITHOUT unique constraint
  sku: {
    type: String,
    trim: true,
    sparse: true // Only enforce uniqueness for non-null values
    // 🔥 REMOVED: unique: true - This was causing the problem!
  },
  
  // ✅ FIXED: Unique slug with better validation
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  
  // ENHANCED: Multiple Categories Support
  primaryCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Primary category (protection type) is required']
  },
  
  secondaryCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware
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
  
  next();
});

// PRE-VALIDATE MIDDLEWARE
productSchema.pre('validate', function(next) {
  try {
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