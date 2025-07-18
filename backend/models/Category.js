// backend/models/Category.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Category description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  
  // Category type (protection_type or industry)
  type: {
    type: String,
    enum: ['protection_type', 'industry', 'brand', 'certification'],
    required: [true, 'Category type is required']
  },
  
  // Parent category (for subcategories)
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  
  // Category image (will use Cloudinary)
  image: {
    url: {
      type: String,
      default: null
    },
    public_id: {
      type: String,
      default: null
    }
  },
  
  // Category icon (emoji or icon class)
  icon: {
    type: String,
    required: [true, 'Category icon is required']
  },
  
  // Colors for frontend theming
  colors: {
    primary: {
      type: String,
      default: '#f59e0b' // Primary yellow
    },
    secondary: {
      type: String,
      default: '#fef3c7' // Light yellow
    }
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  
  // Display order for frontend
  sortOrder: {
    type: Number,
    default: 0
  },
  
  // Product count (will be calculated)
  productCount: {
    type: Number,
    default: 0
  },
  
  // SEO fields
  metaTitle: String,
  metaDescription: String,
  keywords: [String],
  
  // Featured category flag
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate slug before saving
categorySchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens
  }
  next();
});

// Also generate slug for insertMany operations
categorySchema.pre('insertMany', function(next, docs) {
  if (Array.isArray(docs)) {
    docs.forEach(doc => {
      if (doc.name && !doc.slug) {
        doc.slug = doc.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
    });
  }
  next();
});

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Index for better performance
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ type: 1 });
categorySchema.index({ status: 1 });
categorySchema.index({ parent: 1 });

const Category = mongoose.model('Category', categorySchema);

// Default categories data for seeding
export const defaultCategories = [
  // PROTECTION TYPES
  {
    name: 'Head Protection',
    description: 'Safety helmets, hard hats, bump caps, and head protection equipment',
    type: 'protection_type',
    icon: '🪖',
    colors: { primary: '#3b82f6', secondary: '#dbeafe' },
    sortOrder: 1,
    isFeatured: true,
    metaTitle: 'Head Protection Equipment - Safety Helmets & Hard Hats',
    metaDescription: 'Professional head protection equipment including safety helmets, hard hats, and bump caps for construction, industrial, and workplace safety.',
    keywords: ['safety helmet', 'hard hat', 'head protection', 'construction helmet']
  },
  {
    name: 'Foot Protection',
    description: 'Safety boots, shoes, toe caps, and foot protection equipment',
    type: 'protection_type',
    icon: '🥾',
    colors: { primary: '#059669', secondary: '#d1fae5' },
    sortOrder: 2,
    isFeatured: true,
    metaTitle: 'Foot Protection Equipment - Safety Boots & Shoes',
    metaDescription: 'Professional foot protection including steel toe boots, safety shoes, and slip-resistant footwear for workplace safety.',
    keywords: ['safety boots', 'steel toe', 'foot protection', 'work boots']
  },
  {
    name: 'Eye Protection',
    description: 'Safety glasses, goggles, face shields, and eye protection equipment',
    type: 'protection_type',
    icon: '🥽',
    colors: { primary: '#7c3aed', secondary: '#ede9fe' },
    sortOrder: 3,
    isFeatured: true,
    metaTitle: 'Eye Protection Equipment - Safety Glasses & Goggles',
    metaDescription: 'Professional eye protection including safety glasses, goggles, and face shields for industrial and workplace safety.',
    keywords: ['safety glasses', 'goggles', 'eye protection', 'face shield']
  },
  {
    name: 'Hand Protection',
    description: 'Work gloves, chemical resistant gloves, and hand protection equipment',
    type: 'protection_type',
    icon: '🧤',
    colors: { primary: '#dc2626', secondary: '#fee2e2' },
    sortOrder: 4,
    isFeatured: true,
    metaTitle: 'Hand Protection Equipment - Work Gloves & Safety Gloves',
    metaDescription: 'Professional hand protection including work gloves, chemical resistant gloves, and cut-resistant gloves for workplace safety.',
    keywords: ['work gloves', 'safety gloves', 'hand protection', 'chemical resistant']
  },
  {
    name: 'Breathing Protection',
    description: 'Masks, respirators, filters, and breathing protection equipment',
    type: 'protection_type',
    icon: '😷',
    colors: { primary: '#0891b2', secondary: '#cffafe' },
    sortOrder: 5,
    isFeatured: true,
    metaTitle: 'Breathing Protection Equipment - Masks & Respirators',
    metaDescription: 'Professional breathing protection including N95 masks, respirators, and air filtration equipment for workplace safety.',
    keywords: ['respirator', 'N95 mask', 'breathing protection', 'air filter']
  },
  {
    name: 'Workwear & Clothing',
    description: 'High-visibility vests, coveralls, uniforms, and protective clothing',
    type: 'protection_type',
    icon: '🦺',
    colors: { primary: '#ea580c', secondary: '#fed7aa' },
    sortOrder: 6,
    isFeatured: true,
    metaTitle: 'Workwear & Protective Clothing - High-Vis Vests & Coveralls',
    metaDescription: 'Professional workwear and protective clothing including high-visibility vests, coveralls, and safety uniforms.',
    keywords: ['high-vis vest', 'coveralls', 'workwear', 'protective clothing']
  },
  
  // INDUSTRIES
  {
    name: 'Medical & Healthcare',
    description: 'Safety equipment for hospitals, clinics, and healthcare professionals',
    type: 'industry',
    icon: '🏥',
    colors: { primary: '#0891b2', secondary: '#cffafe' },
    sortOrder: 10,
    isFeatured: true,
    metaTitle: 'Medical Safety Equipment - Healthcare PPE & Supplies',
    metaDescription: 'Professional medical safety equipment and PPE for healthcare facilities, hospitals, and medical professionals.',
    keywords: ['medical PPE', 'healthcare safety', 'hospital equipment', 'medical supplies']
  },
  {
    name: 'Construction & Building',
    description: 'Safety equipment for construction sites, building, and infrastructure projects',
    type: 'industry',
    icon: '🏗️',
    colors: { primary: '#ea580c', secondary: '#fed7aa' },
    sortOrder: 11,
    isFeatured: true,
    metaTitle: 'Construction Safety Equipment - Building Site PPE',
    metaDescription: 'Professional construction safety equipment and PPE for building sites, contractors, and construction workers.',
    keywords: ['construction safety', 'building site PPE', 'contractor equipment', 'construction gear']
  },
  {
    name: 'Manufacturing & Industrial',
    description: 'Safety equipment for factories, plants, and industrial environments',
    type: 'industry',
    icon: '🏭',
    colors: { primary: '#059669', secondary: '#d1fae5' },
    sortOrder: 12,
    isFeatured: true,
    metaTitle: 'Industrial Safety Equipment - Manufacturing PPE',
    metaDescription: 'Professional industrial safety equipment and PPE for manufacturing facilities, factories, and industrial workers.',
    keywords: ['industrial safety', 'manufacturing PPE', 'factory equipment', 'industrial gear']
  },
  {
    name: 'Oil & Gas',
    description: 'Safety equipment for oil rigs, gas plants, and petroleum industry',
    type: 'industry',
    icon: '⛽',
    colors: { primary: '#7c2d12', secondary: '#fed7aa' },
    sortOrder: 13,
    metaTitle: 'Oil & Gas Safety Equipment - Petroleum Industry PPE',
    metaDescription: 'Professional oil and gas safety equipment and PPE for petroleum industry, refineries, and offshore operations.',
    keywords: ['oil gas safety', 'petroleum PPE', 'refinery equipment', 'offshore safety']
  },
  {
    name: 'Mining & Quarrying',
    description: 'Safety equipment for mines, quarries, and extraction operations',
    type: 'industry',
    icon: '⛏️',
    colors: { primary: '#92400e', secondary: '#fef3c7' },
    sortOrder: 14,
    metaTitle: 'Mining Safety Equipment - Quarrying PPE & Gear',
    metaDescription: 'Professional mining safety equipment and PPE for mines, quarries, and mineral extraction operations.',
    keywords: ['mining safety', 'quarry PPE', 'mining equipment', 'extraction gear']
  },
  {
    name: 'Agriculture & Forestry',
    description: 'Safety equipment for farms, forestry, and agricultural operations',
    type: 'industry',
    icon: '🌾',
    colors: { primary: '#16a34a', secondary: '#dcfce7' },
    sortOrder: 15,
    metaTitle: 'Agricultural Safety Equipment - Farming & Forestry PPE',
    metaDescription: 'Professional agricultural safety equipment and PPE for farms, forestry operations, and agricultural workers.',
    keywords: ['agricultural safety', 'farming PPE', 'forestry equipment', 'farm gear']
  }
];

export default Category;