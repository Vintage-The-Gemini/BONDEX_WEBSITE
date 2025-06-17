import Category from '../models/Category.js';
import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';
import { cloudinary } from '../config/cloudinary.js';
import logger from '../config/logger.js';

// @desc    Get all categories (Public)
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const filter = { isActive: true };

  // Protection type filter
  if (req.query.protectionType) {
    filter.protectionType = req.query.protectionType;
  }

  // Industry filter
  if (req.query.industry) {
    filter.industry = req.query.industry;
  }

  const categories = await Category.find(filter)
    .populate('parentCategory', 'name slug')
    .sort({ sortOrder: 1, name: 1 });

  // Group categories by protection type
  const categoriesByType = categories.reduce((acc, category) => {
    if (!acc[category.protectionType]) {
      acc[category.protectionType] = [];
    }
    acc[category.protectionType].push(category);
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
    groupedByType: categoriesByType
  });
});

// @desc    Get single category (Public)
// @route   GET /api/categories/:slug
// @access  Public
export const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ 
    slug: req.params.slug, 
    isActive: true 
  }).populate('parentCategory', 'name slug');

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  // Get subcategories
  const subcategories = await Category.find({ 
    parentCategory: category._id, 
    isActive: true 
  }).sort({ sortOrder: 1 });

  res.status(200).json({
    success: true,
    data: {
      ...category.toObject(),
      subcategories
    }
  });
});

// @desc    Get categories by protection type (Public)
// @route   GET /api/categories/protection/:type
// @access  Public
export const getCategoriesByProtectionType = asyncHandler(async (req, res) => {
  const { type } = req.params;
  
  const validTypes = ['Head', 'Foot', 'Eye', 'Hand', 'Breathing'];
  
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid protection type'
    });
  }

  const categories = await Category.find({ 
    protectionType: type, 
    isActive: true 
  })
    .populate('parentCategory', 'name slug')
    .sort({ sortOrder: 1, name: 1 });

  res.status(200).json({
    success: true,
    protectionType: type,
    count: categories.length,
    data: categories
  });
});

// @desc    Get featured categories (Public)
// @route   GET /api/categories/featured
// @access  Public
export const getFeaturedCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ 
    isFeatured: true, 
    isActive: true 
  })
    .populate('parentCategory', 'name slug')
    .sort({ sortOrder: 1 })
    .limit(8);

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// ADMIN ROUTES

// @desc    Get all categories for admin (Admin)
// @route   GET /api/admin/categories
// @access  Private/Admin
export const getAdminCategories = asyncHandler(async (req, res) => {
 const categories = await Category.find({})
   .populate('parentCategory', 'name slug')
   .sort({ protectionType: 1, sortOrder: 1, name: 1 });

 res.status(200).json({
   success: true,
   count: categories.length,
   data: categories
 });
});

// @desc    Create new category (Admin)
// @route   POST /api/admin/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
 // Handle image upload
 if (req.file) {
   req.body.image = {
     public_id: req.file.filename,
     url: req.file.path,
     alt: `${req.body.name} category image`
   };
 }

 const category = await Category.create(req.body);

 logger.info(`New category created: ${category.name} (${category.protectionType})`);

 res.status(201).json({
   success: true,
   message: 'Category created successfully',
   data: category
 });
});

// @desc    Update category (Admin)
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
 let category = await Category.findById(req.params.id);

 if (!category) {
   return res.status(404).json({
     success: false,
     message: 'Category not found'
   });
 }

 // Handle new image upload
 if (req.file) {
   // Delete old image if exists
   if (category.image && category.image.public_id) {
     try {
       await cloudinary.uploader.destroy(category.image.public_id);
     } catch (error) {
       logger.error(`Failed to delete old category image:`, error);
     }
   }

   req.body.image = {
     public_id: req.file.filename,
     url: req.file.path,
     alt: `${req.body.name || category.name} category image`
   };
 }

 category = await Category.findByIdAndUpdate(req.params.id, req.body, {
   new: true,
   runValidators: true
 });

 res.status(200).json({
   success: true,
   message: 'Category updated successfully',
   data: category
 });
});

// @desc    Delete category (Admin)
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
 const category = await Category.findById(req.params.id);

 if (!category) {
   return res.status(404).json({
     success: false,
     message: 'Category not found'
   });
 }

 // Check if category has products
 const productCount = await Product.countDocuments({ category: category._id });
 
 if (productCount > 0) {
   return res.status(400).json({
     success: false,
     message: `Cannot delete category. It has ${productCount} products associated with it.`
   });
 }

 // Check if category has subcategories
 const subcategoryCount = await Category.countDocuments({ parentCategory: category._id });
 
 if (subcategoryCount > 0) {
   return res.status(400).json({
     success: false,
     message: `Cannot delete category. It has ${subcategoryCount} subcategories.`
   });
 }

 // Delete image from cloudinary
 if (category.image && category.image.public_id) {
   try {
     await cloudinary.uploader.destroy(category.image.public_id);
   } catch (error) {
     logger.error(`Failed to delete category image:`, error);
   }
 }

 await Category.findByIdAndDelete(req.params.id);

 logger.info(`Category deleted: ${category.name} (ID: ${category._id})`);

 res.status(200).json({
   success: true,
   message: 'Category deleted successfully'
 });
});