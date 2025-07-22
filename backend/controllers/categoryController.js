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
      timestamp: new Date().toISOString()
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
export const getCategory = async (req, res) => {
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
      data: category
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
      data: categories
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

// @desc    Get categories by type
// @route   GET /api/categories/type/:type
// @access  Public
export const getCategoriesByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    const categories = await Category.find({ 
      type: type,
      status: 'active' 
    }).sort({ sortOrder: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      type: type,
      data: categories
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

// Other controller methods...
export const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('❌ Create Category Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
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

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('❌ Update Category Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
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