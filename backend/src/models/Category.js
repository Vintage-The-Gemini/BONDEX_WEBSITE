// backend/src/models/Category.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide category name'],
    unique: true,
    maxlength: [100, 'Category name cannot exceed 100 characters'],
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true // Use index: true in field definition instead of separate index
  },
  image: {
    public_id: String,
    url: String,
    alt: String
  },
  icon: String, // For category icons
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  protectionType: {
    type: String,
    enum: ['Head', 'Foot', 'Eye', 'Hand', 'Breathing'],
    required: true
  },
  industry: {
    type: String,
    enum: ['Medical', 'Construction', 'Manufacturing', 'All'],
    default: 'All'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  productCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes (removed duplicate slug index)
categorySchema.index({ protectionType: 1, industry: 1 });
categorySchema.index({ isActive: 1, isFeatured: -1 });

// Virtual for URL
categorySchema.virtual('url').get(function() {
  return `/categories/${this.slug}`;
});

// Create slug from name
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Update product count
categorySchema.methods.updateProductCount = async function() {
  const Product = mongoose.model('Product');
  this.productCount = await Product.countDocuments({ 
    category: this._id, 
    status: 'active' 
  });
  await this.save();
};

export default mongoose.model('Category', categorySchema);