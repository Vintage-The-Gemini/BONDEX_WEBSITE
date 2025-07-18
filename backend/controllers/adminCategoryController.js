// backend/controllers/adminCategoryController.js
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get all categories for admin
// @route   GET /api/admin/categories
// @access  Private (Admin only)
export const getAdminCategories = async (req, res) => {
  try {
    const { type, status, search } = req.query;
    
    let query = {};
    
    // Filter by type
    if (type) {
      query.type = type;
    }
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Search in name and description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const categories = await Category.find(query)
      .populate('parent', 'name')
      .sort({ type: 1, sortOrder: 1, name: 1 });

    // Calculate product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({ 
          category: category.name,
          status: 'active'
        });
        
        return {
          ...category.toObject(),
          productCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: categoriesWithCounts.length,
      data: categoriesWithCounts
    });

  } catch (error) {
    console.error('Get Admin Categories Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// @desc    Get single category for admin
// @route   GET /api/admin/categories/:id
// @access  Private (Admin only)
export const getAdminCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parent', 'name');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get product count
    const productCount = await Product.countDocuments({ 
      category: category.name 
    });

    const categoryWithCount = {
      ...category.toObject(),
      productCount
    };

    res.status(200).json({
      success: true,
      data: categoryWithCount
    });

  } catch (error) {
    console.error('Get Admin Category Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
};

// @desc    Create new category
// @route   POST /api/admin/categories
// @access  Private (Admin only)
export const createCategory = async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      parent,
      icon,
      colors,
      status,
      sortOrder,
      isFeatured,
      metaTitle,
      metaDescription,
      keywords
    } = req.body;

    // Check if category with same name exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const categoryData = {
      name,
      description,
      type,
      icon: icon || '📦',
      colors: colors || { primary: '#f59e0b', secondary: '#fef3c7' },
      status: status || 'active',
      sortOrder: sortOrder || 0,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      metaTitle: metaTitle || name,
      metaDescription: metaDescription || description,
      keywords: keywords ? (Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim())) : []
    };

    // Add parent if provided
    if (parent) {
      categoryData.parent = parent;
    }

    // Handle image upload if provided
    if (req.file) {
      categoryData.image = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    const category = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });

  } catch (error) {
    console.error('Create Category Error:', error);

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
      message: 'Error creating category',
      error: error.message
    });
  }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private (Admin only)
export const updateCategory = async (req, res) => {
  try {
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
      type,
      parent,
      icon,
      colors,
      status,
      sortOrder,
      isFeatured,
      metaTitle,
      metaDescription,
      keywords
    } = req.body;

    // Check if new name conflicts with existing category
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }
      category.name = name;
    }

    // Update fields
    if (description) category.description = description;
    if (type) category.type = type;
    if (parent !== undefined) category.parent = parent || null;
    if (icon) category.icon = icon;
    if (colors) category.colors = { ...category.colors, ...colors };
    if (status) category.status = status;
    if (sortOrder !== undefined) category.sortOrder = Number(sortOrder);
    if (isFeatured !== undefined) category.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (metaTitle) category.metaTitle = metaTitle;
    if (metaDescription) category.metaDescription = metaDescription;

    // Update keywords
    if (keywords) {
      category.keywords = Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim());
    }

    // Handle new image upload
    if (req.file) {
      // Delete old image from Cloudinary
      if (category.image && category.image.public_id) {
        try {
          await deleteFromCloudinary(category.image.public_id);
        } catch (deleteError) {
          console.error('Error deleting old category image:', deleteError);
        }
      }

      category.image = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    const updatedCategory = await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    });

  } catch (error) {
    console.error('Update Category Error:', error);

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
// @route   DELETE /api/admin/categories/:id
// @access  Private (Admin only)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: category.name });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${productCount} products. Please move or delete the products first.`
      });
    }

    // Check if category has subcategories
    const subcategoryCount = await Category.countDocuments({ parent: category._id });
    if (subcategoryCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${subcategoryCount} subcategories. Please delete subcategories first.`
      });
    }

    // Delete image from Cloudinary
    if (category.image && category.image.public_id) {
      try {
        await deleteFromCloudinary(category.image.public_id);
      } catch (deleteError) {
        console.error('Error deleting category image:', deleteError);
      }
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Delete Category Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
};

// @desc    Seed default categories
// @route   POST /api/admin/categories/seed
// @access  Private (Admin only)
export const seedCategories = async (req, res) => {
  try {
    // Check if categories already exist
    const existingCategories = await Category.countDocuments();
    if (existingCategories > 0) {
      return res.status(400).json({
        success: false,
        message: 'Categories already exist. Use regular create/update operations.'
      });
    }

    // Import default categories
    const { defaultCategories } = await import('../models/Category.js');
    
    const createdCategories = await Category.insertMany(defaultCategories);

    res.status(201).json({
      success: true,
      message: `${createdCategories.length} default categories created successfully`,
      data: createdCategories
    });

  } catch (error) {
    console.error('Seed Categories Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding categories',
      error: error.message
    });
  }
};

// @desc    Reorder categories
// @route   PUT /api/admin/categories/reorder
// @access  Private (Admin only)
export const reorderCategories = async (req, res) => {
  try {
    const { categoryOrders } = req.body;

    if (!categoryOrders || !Array.isArray(categoryOrders)) {
      return res.status(400).json({
        success: false,
        message: 'Category orders array is required'
      });
    }

    // Update sort order for each category
    const updatePromises = categoryOrders.map(({ id, sortOrder }) =>
      Category.findByIdAndUpdate(id, { sortOrder: Number(sortOrder) })
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Categories reordered successfully'
    });

  } catch (error) {
    console.error('Reorder Categories Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reordering categories',
      error: error.message
    });
  }
};