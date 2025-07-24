// backend/routes/adminCategoryRoutes.js
import express from 'express';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/adminAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);
router.use(adminOnly);

// =============================================
// UTILITY FUNCTIONS
// =============================================

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// =============================================
// MAIN CATEGORY ROUTES
// =============================================

// @route   GET /api/admin/categories
// @desc    Get all categories for admin with stats
// @access  Private (Admin only)
router.get('/', async (req, res) => {
  try {
    console.log('📂 Admin fetching categories');
    console.log('👤 Admin user:', req.user?.email);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Build filter object
    let filter = {};
    
    if (req.query.status && req.query.status !== '') {
      filter.status = req.query.status;
    }
    
    if (req.query.search && req.query.search.trim()) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } }
      ];
    }
    
    // Build sort option
    let sortOption = { createdAt: -1 };
    
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'name':
          sortOption = { name: 1 };
          break;
        case 'products':
          sortOption = { productCount: -1 };
          break;
        case 'oldest':
          sortOption = { createdAt: 1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    }
    
    // Get categories with pagination
    const categories = await Category.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for pagination
    const totalCategories = await Category.countDocuments(filter);
    
    // Add product count for each category
    const categoriesWithStats = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({ 
          category: category._id,
          status: 'active'
        });
        
        const totalProducts = await Product.countDocuments({ 
          category: category._id 
        });
        
        return {
          ...category,
          productCount,
          totalProducts,
          activeProducts: productCount
        };
      })
    );
    
    console.log(`✅ Found ${categoriesWithStats.length} categories`);
    
    res.json({
      success: true,
      data: categoriesWithStats,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCategories / limit),
        totalCategories,
        categoriesPerPage: limit,
        hasNextPage: page < Math.ceil(totalCategories / limit),
        hasPrevPage: page > 1
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching admin categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/admin/categories/:id
// @desc    Get single category by ID for admin
// @access  Private (Admin only)
router.get('/:id', async (req, res) => {
  try {
    console.log(`🔍 Admin fetching category ID: ${req.params.id}`);
    
    const category = await Category.findById(req.params.id).lean();
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Get product statistics for this category
    const productStats = await Product.aggregate([
      { $match: { category: category._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$product_price' }
        }
      }
    ]);
    
    // Get recent products in this category
    const recentProducts = await Product.find({ category: category._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('product_name product_price status createdAt')
      .lean();
    
    const categoryWithStats = {
      ...category,
      productStats,
      recentProducts,
      totalProducts: productStats.reduce((sum, stat) => sum + stat.count, 0)
    };
    
    console.log(`✅ Category found: ${category.name}`);
    
    res.json({
      success: true,
      data: categoryWithStats
    });
    
  } catch (error) {
    console.error('❌ Error fetching admin category:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/admin/categories
// @desc    Create new category
// @access  Private (Admin only)
router.post('/', async (req, res) => {
  try {
    console.log('➕ Admin creating new category');
    console.log('📦 Category data:', req.body);
    
    const {
      name,
      description,
      parent_category,
      image_url,
      icon,
      status = 'active',
      is_featured = false,
      meta_title,
      meta_description,
      tags = []
    } = req.body;
    
    // Validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Category name and description are required'
      });
    }
    
    // Check if category with same name exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }
    
    // Generate slug
    const slug = generateSlug(name);
    
    // Check if slug exists
    const existingSlug = await Category.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: 'Category slug already exists. Please choose a different name.'
      });
    }
    
    // Create category
    const category = new Category({
      name: name.trim(),
      description: description.trim(),
      slug,
      parent_category: parent_category || null,
      image_url: image_url || '',
      icon: icon || '',
      status,
      is_featured,
      meta_title: meta_title || name,
      meta_description: meta_description || description,
      tags: Array.isArray(tags) ? tags : [],
      created_by: req.user._id,
      updated_by: req.user._id
    });
    
    await category.save();
    
    console.log(`✅ Category created: ${category.name} (ID: ${category._id})`);
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
    
  } catch (error) {
    console.error('❌ Error creating category:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/admin/categories/:id
// @desc    Update category
// @access  Private (Admin only)
router.put('/:id', async (req, res) => {
  try {
    console.log(`✏️ Admin updating category ID: ${req.params.id}`);
    
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    const {
      name,
      description,
      parent_category,
      image_url,
      icon,
      status,
      is_featured,
      meta_title,
      meta_description,
      tags
    } = req.body;
    
    // Check if new name conflicts with existing category
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }
    }
    
    // Update fields
    if (name) {
      category.name = name.trim();
      category.slug = generateSlug(name);
    }
    if (description) category.description = description.trim();
    if (parent_category !== undefined) category.parent_category = parent_category;
    if (image_url !== undefined) category.image_url = image_url;
    if (icon !== undefined) category.icon = icon;
    if (status !== undefined) category.status = status;
    if (is_featured !== undefined) category.is_featured = is_featured;
    if (meta_title !== undefined) category.meta_title = meta_title;
    if (meta_description !== undefined) category.meta_description = meta_description;
    if (tags !== undefined) category.tags = Array.isArray(tags) ? tags : [];
    
    category.updated_by = req.user._id;
    category.updated_at = new Date();
    
    await category.save();
    
    console.log(`✅ Category updated: ${category.name}`);
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
    
  } catch (error) {
    console.error('❌ Error updating category:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format'
      });
    }
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/admin/categories/:id
// @desc    Delete category
// @access  Private (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    console.log(`🗑️ Admin deleting category ID: ${req.params.id}`);
    
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if category has products
    const productCount = await Product.countDocuments({ category: req.params.id });
    
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${productCount} products associated with it.`,
        productCount
      });
    }
    
    // Check if category has subcategories
    const subcategoryCount = await Category.countDocuments({ parent_category: req.params.id });
    
    if (subcategoryCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${subcategoryCount} subcategories.`,
        subcategoryCount
      });
    }
    
    await Category.findByIdAndDelete(req.params.id);
    
    console.log(`✅ Category deleted: ${category.name}`);
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Error deleting category:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// =============================================
// CATEGORY STATISTICS & ANALYTICS
// =============================================

// @route   GET /api/admin/categories/stats
// @desc    Get category statistics for dashboard
// @access  Private (Admin only)
router.get('/stats', async (req, res) => {
  try {
    console.log('📊 Admin fetching category stats');
    
    const stats = await Category.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalCategories = await Category.countDocuments();
    const featuredCategories = await Category.countDocuments({ is_featured: true });
    const categoriesWithProducts = await Category.countDocuments({
      _id: { $in: await Product.distinct('category') }
    });
    
    const categoryStats = {
      total: totalCategories,
      active: stats.find(s => s._id === 'active')?.count || 0,
      inactive: stats.find(s => s._id === 'inactive')?.count || 0,
      featured: featuredCategories,
      withProducts: categoriesWithProducts,
      empty: totalCategories - categoriesWithProducts
    };
    
    console.log('✅ Category stats calculated:', categoryStats);
    
    res.json({
      success: true,
      data: categoryStats
    });
    
  } catch (error) {
    console.error('❌ Error fetching category stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// =============================================
// CATEGORY FEATURE MANAGEMENT
// =============================================

// @route   PATCH /api/admin/categories/:id/toggle-featured
// @desc    Toggle featured status of category
// @access  Private (Admin only)
router.patch('/:id/toggle-featured', async (req, res) => {
  try {
    console.log(`⭐ Toggling featured status for category: ${req.params.id}`);
    
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    category.is_featured = !category.is_featured;
    category.updated_by = req.user._id;
    category.updated_at = new Date();
    
    await category.save();
    
    console.log(`✅ Featured status updated: ${category.name} - Featured: ${category.is_featured}`);
    
    res.json({
      success: true,
      message: `Category ${category.is_featured ? 'featured' : 'unfeatured'} successfully`,
      data: category
    });
    
  } catch (error) {
    console.error('❌ Error toggling featured status:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update featured status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// =============================================
// BULK OPERATIONS
// =============================================

// @route   PATCH /api/admin/categories/bulk/update-status
// @desc    Bulk update category status
// @access  Private (Admin only)
router.patch('/bulk/update-status', async (req, res) => {
  try {
    console.log('📦 Bulk updating category status');
    
    const { categoryIds, status } = req.body;
    
    if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Category IDs array is required'
      });
    }
    
    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status (active/inactive) is required'
      });
    }
    
    const result = await Category.updateMany(
      { _id: { $in: categoryIds } },
      { 
        status,
        updated_by: req.user._id,
        updated_at: new Date()
      }
    );
    
    console.log(`✅ Bulk update completed: ${result.modifiedCount} categories updated`);
    
    res.json({
      success: true,
      message: `${result.modifiedCount} categories updated successfully`,
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      }
    });
    
  } catch (error) {
    console.error('❌ Error in bulk update:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk update categories',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;