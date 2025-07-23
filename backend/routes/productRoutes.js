// backend/routes/productRoutes.js
import express from 'express';
import Product from '../models/Product.js';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/adminAuth.js';

const router = express.Router();

// ============================================
// PUBLIC PRODUCT ROUTES (No authentication)
// ============================================

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, pagination
// @access  Public
router.get('/', (req, res, next) => {
  console.log('📦 Public products route hit');
  getProducts(req, res, next);
});

// @route   GET /api/products/search
// @desc    Search products
// @access  Public
router.get('/search', (req, res, next) => {
  console.log('🔍 Product search route hit');
  // You can implement searchProducts function later
  getProducts(req, res, next);
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', (req, res, next) => {
  console.log('⭐ Featured products route hit');
  req.query.isFeatured = 'true';
  getProducts(req, res, next);
});

// @route   GET /api/products/sale
// @desc    Get products on sale
// @access  Public
router.get('/sale', (req, res, next) => {
  console.log('💰 Sale products route hit');
  req.query.isOnSale = 'true';
  getProducts(req, res, next);
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', (req, res, next) => {
  console.log(`🔍 Single product route hit for ID: ${req.params.id}`);
  getProduct(req, res, next);
});

// ============================================
// ADMIN PRODUCT ROUTES (Authentication required)
// ============================================

// @route   POST /api/products
// @desc    Create new product
// @access  Private (Admin only)
router.post('/', protect, adminOnly, (req, res, next) => {
  console.log('➕ Create product route hit (authenticated)');
  console.log('👤 Admin user:', req.user?.email);
  createProduct(req, res, next);
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Admin only)
router.put('/:id', protect, adminOnly, (req, res, next) => {
  console.log(`✏️ Update product route hit for ID: ${req.params.id} (authenticated)`);
  console.log('👤 Admin user:', req.user?.email);
  updateProduct(req, res, next);
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Admin only)
router.delete('/:id', protect, adminOnly, (req, res, next) => {
  console.log(`🗑️ Delete product route hit for ID: ${req.params.id} (authenticated)`);
  console.log('👤 Admin user:', req.user?.email);
  deleteProduct(req, res, next);
});

// @route   PATCH /api/products/:id/status
// @desc    Update product status
// @access  Private (Admin only)
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    console.log(`🎯 Update product status route hit for ID: ${req.params.id}`);
    
    const { status } = req.body;
    
    if (!['active', 'inactive', 'draft'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active, inactive, or draft'
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Product status updated to ${status}`,
      data: product
    });

  } catch (error) {
    console.error('Update product status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product status',
      error: error.message
    });
  }
});

// @route   PATCH /api/products/bulk-update
// @desc    Bulk update products
// @access  Private (Admin only)
router.patch('/bulk-update', protect, adminOnly, async (req, res) => {
  try {
    console.log('📦 Bulk update products route hit');
    
    const { productIds, updateData } = req.body;
    
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required'
      });
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Update data is required'
      });
    }

    // Add timestamp to update data
    updateData.updatedAt = new Date();

    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      updateData,
      { runValidators: true }
    );

    // Get updated products
    const updatedProducts = await Product.find({ _id: { $in: productIds } })
      .populate('category', 'name slug')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} products updated successfully`,
      data: {
        modifiedCount: result.modifiedCount,
        products: updatedProducts
      }
    });

  } catch (error) {
    console.error('Bulk update products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating products',
      error: error.message
    });
  }
});

export default router;