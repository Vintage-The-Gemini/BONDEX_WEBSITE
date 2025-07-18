// backend/routes/adminProductRoutes.js
import express from 'express';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/adminAuth.js';
import { uploadProductImage } from '../config/cloudinary.js';

const router = express.Router();

// Apply authentication to all routes
router.use(protect);
router.use(adminOnly);

// ============================================
// ADMIN PRODUCT MANAGEMENT ROUTES
// ============================================

// @route   GET /api/admin/products
// @desc    Get all products for admin with advanced filtering
// @access  Private (Admin only)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query object
    let query = {};

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Search in product name and description
    if (req.query.search) {
      query.$or = [
        { product_name: { $regex: req.query.search, $options: 'i' } },
        { product_description: { $regex: req.query.search, $options: 'i' } },
        { product_brand: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Low stock filter
    if (req.query.lowStock === 'true') {
      query.$expr = { $lte: ['$stock', '$lowStockThreshold'] };
    }

    // Sorting
    let sortBy = {};
    switch (req.query.sortBy) {
      case 'name':
        sortBy.product_name = 1;
        break;
      case 'price_low':
        sortBy.product_price = 1;
        break;
      case 'price_high':
        sortBy.product_price = -1;
        break;
      case 'stock_low':
        sortBy.stock = 1;
        break;
      default:
        sortBy.createdAt = -1; // Newest first
    }

    // Execute query
    const products = await Product.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages,
      currentPage: page,
      data: products
    });

  } catch (error) {
    console.error('Get Admin Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// @route   GET /api/admin/products/:id
// @desc    Get single product for admin
// @access  Private (Admin only)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Get Admin Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// @route   POST /api/admin/products
// @desc    Create new product with image upload
// @access  Private (Admin only)
router.post('/', uploadProductImage.array('images', 5), async (req, res) => {
  try {
    const {
      product_name,
      product_description,
      product_brand,
      category,
      product_price,
      stock,
      status,
      isOnSale,
      isFeatured
    } = req.body;

    // Generate slug from product name
    const slug = product_name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create product object
    const productData = {
      product_name,
      product_description,
      product_brand,
      category,
      product_price: Number(product_price),
      stock: Number(stock) || 0,
      slug,
      status: status || 'active',
      isOnSale: isOnSale === 'true' || isOnSale === true,
      isFeatured: isFeatured === 'true' || isFeatured === true
    };

    // Handle images from Cloudinary upload
    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => ({
        url: file.path,
        public_id: file.filename,
        alt: product_name
      }));
      
      productData.images = images;
      productData.mainImage = images[0].url;
      productData.product_image = images[0].url;
    } else {
      return res.status(400).json({
        success: false,
        message: 'At least one product image is required'
      });
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });

  } catch (error) {
    console.error('Create Product Error:', error);

    // Handle validation errors
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
      message: 'Error creating product',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/products/:id
// @desc    Update product
// @access  Private (Admin only)
router.put('/:id', uploadProductImage.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const {
      product_name,
      product_description,
      product_brand,
      category,
      product_price,
      stock,
      status,
      isOnSale,
      isFeatured
    } = req.body;

    // Update basic fields
    if (product_name) {
      product.product_name = product_name;
      product.slug = product_name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    if (product_description) product.product_description = product_description;
    if (product_brand) product.product_brand = product_brand;
    if (category) product.category = category;
    if (product_price !== undefined) product.product_price = Number(product_price);
    if (stock !== undefined) product.stock = Number(stock);
    if (status) product.status = status;
    if (isOnSale !== undefined) product.isOnSale = isOnSale === 'true' || isOnSale === true;
    if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true' || isFeatured === true;

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: file.path,
        public_id: file.filename,
        alt: product.product_name
      }));

      product.images = newImages;
      product.mainImage = newImages[0].url;
      product.product_image = newImages[0].url;
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });

  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
});

// @route   DELETE /api/admin/products/:id
// @desc    Delete product
// @access  Private (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
});

export default router;