// backend/controllers/categoryController.js
import Category from '../models/Category.js';

// Default categories for seeding
const defaultCategories = [
  {
    name: 'Head Protection',
    description: 'Safety helmets, hard hats, and head protection equipment',
    type: 'safety',
    icon: '⛑️',
    colors: { primary: '#FFD700', secondary: '#FFFACD' },
    status: 'active',
    sortOrder: 1,
    isFeatured: true
  },
  {
    name: 'Eye Protection',
    description: 'Safety glasses, goggles, and face shields',
    type: 'safety', 
    icon: '👁️',
    colors: { primary: '#4169E1', secondary: '#B0C4DE' },
    status: 'active',
    sortOrder: 2,
    isFeatured: true
  },
  {
    name: 'Hand Protection',
    description: 'Safety gloves and hand protection equipment',
    type: 'safety',
    icon: '🧤', 
    colors: { primary: '#32CD32', secondary: '#98FB98' },
    status: 'active',
    sortOrder: 3,
    isFeatured: true
  },
  {
    name: 'Foot Protection',
    description: 'Safety boots, steel toe shoes, and foot protection',
    type: 'safety',
    icon: '🦶',
    colors: { primary: '#8B4513', secondary: '#DEB887' },
    status: 'active',
    sortOrder: 4,
    isFeatured: true
  },
  {
    name: 'Body Protection',
    description: 'High visibility vests, coveralls, and protective clothing',
    type: 'safety',
    icon: '🦺',
    colors: { primary: '#FF6347', secondary: '#FFE4E1' },
    status: 'active',
    sortOrder: 5,
    isFeatured: true
  },
  {
    name: 'Respiratory Protection',
    description: 'Masks, respirators, and breathing protection equipment',
    type: 'safety',
    icon: '😷',
    colors: { primary: '#9370DB', secondary: '#E6E6FA' },
    status: 'active',
    sortOrder: 6,
    isFeatured: true
  }
];

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    console.log('📂 Categories controller called');
    console.log('🔍 Request query:', req.query);
    
    const { type, status } = req.query;
    
    // Build query
    let query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    else query.status = 'active'; // Only show active by default
    
    console.log('🔍 Database query:', query);
    
    let categories = await Category.find(query).sort({ sortOrder: 1, name: 1 });
    
    console.log(`📊 Found ${categories.length} categories in database`);
    
    // If no categories exist, create default ones
    if (categories.length === 0) {
      console.log('🌱 No categories found, creating defaults...');
      try {
        categories = await Category.insertMany(defaultCategories);
        console.log(`✅ Created ${categories.length} default categories`);
      } catch (insertError) {
        console.error('❌ Error creating default categories:', insertError);
        // Return empty array with success rather than error
        categories = [];
      }
    }

    console.log(`✅ Returning ${categories.length} categories`);

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
      timestamp: new Date().toISOString(),
      currency: 'KES'
    });

  } catch (error) {
    console.error('❌ Get Categories Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res) => {
  try {
    console.log('🔍 Getting single category:', req.params.id);
    
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category,
      currency: 'KES'
    });

  } catch (error) {
    console.error('❌ Get Category Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
};

// @desc    Get featured categories only
// @route   GET /api/categories/featured  
// @access  Public
export const getFeaturedCategories = async (req, res) => {
  try {
    console.log('⭐ Getting featured categories');
    
    const categories = await Category.find({ 
      status: 'active',
      isFeatured: true 
    }).sort({ sortOrder: 1, name: 1 });

    console.log(`📊 Found ${categories.length} featured categories`);

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
      timestamp: new Date().toISOString(),
      currency: 'KES'
    });

  } catch (error) {
    console.error('❌ Get Featured Categories Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured categories',
      error: error.message
    });
  }
};

// @desc    Get category statistics
// @route   GET /api/categories/stats
// @access  Public
export const getCategoriesStats = async (req, res) => {
  try {
    console.log('📊 Getting category statistics');
    
    const totalCategories = await Category.countDocuments();
    const activeCategories = await Category.countDocuments({ status: 'active' });
    const featuredCategories = await Category.countDocuments({ 
      status: 'active', 
      isFeatured: true 
    });
    
    // Get categories by type
    const typeStats = await Category.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const stats = {
      total: totalCategories,
      active: activeCategories,
      featured: featuredCategories,
      inactive: totalCategories - activeCategories,
      byType: typeStats,
      currency: 'KES'
    };

    console.log('📊 Category stats:', stats);

    res.status(200).json({
      success: true,
      message: 'Category statistics retrieved successfully',
      data: stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Get Categories Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category statistics',
      error: error.message
    });
  }
};

// @desc    Get categories by type
// @route   GET /api/categories/type/:type
// @access  Public
export const getCategoriesByType = async (req, res) => {
  try {
    const { type } = req.params;
    console.log(`📂 Getting categories by type: ${type}`);
    
    const categories = await Category.find({ 
      type: type,
      status: 'active' 
    }).sort({ sortOrder: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      type: type,
      data: categories,
      currency: 'KES'
    });

  } catch (error) {
    console.error('❌ Get Categories by Type Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories by type',
      error: error.message
    });
  }
};

// @desc    Create new category
// @route   POST /api/categories  
// @access  Private (Admin only)
export const createCategory = async (req, res) => {
  try {
    console.log('➕ Creating new category:', req.body);
    
    const category = await Category.create(req.body);
    
    console.log('✅ Category created successfully:', category);
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
      currency: 'KES'
    });
    
  } catch (error) {
    console.error('❌ Create Category Error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin only)
export const updateCategory = async (req, res) => {
  try {
    console.log(`✏️ Updating category ${req.params.id}:`, req.body);
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    console.log('✅ Category updated successfully:', category);

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
      currency: 'KES'
    });
    
  } catch (error) {
    console.error('❌ Update Category Error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin only)  
export const deleteCategory = async (req, res) => {
  try {
    console.log(`🗑️ Deleting category: ${req.params.id}`);
    
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    console.log('✅ Category deleted successfully');

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      deletedCategory: category
    });
    
  } catch (error) {
    console.error('❌ Delete Category Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
};

// @desc    Seed default categories
// @route   POST /api/categories/seed
// @access  Public (consider protecting this in production)
export const seedCategories = async (req, res) => {
  try {
    console.log('🌱 Seeding categories...');
    
    // Check if categories already exist
    const existingCategories = await Category.countDocuments();
    
    if (existingCategories > 0 && req.query.force !== 'true') {
      return res.status(400).json({
        success: false,
        message: `Categories already exist (${existingCategories} found). Use ?force=true to override.`,
        existingCount: existingCategories
      });
    }

    // Force override if requested
    if (req.query.force === 'true') {
      await Category.deleteMany({});
      console.log('🗑️  Existing categories cleared');
    }

    // Insert default categories
    const categories = await Category.insertMany(defaultCategories);

    console.log(`✅ Successfully seeded ${categories.length} categories`);

    res.status(201).json({
      success: true,
      message: `Successfully seeded ${categories.length} categories`,
      count: categories.length,
      data: categories,
      currency: 'KES'
    });

  } catch (error) {
    console.error('❌ Seed Categories Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding categories',
      error: error.message
    });
  }
};