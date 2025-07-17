// backend/src/controllers/productController.js
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import asyncHandler from 'express-async-handler';
import { cloudinary } from '../config/cloudinary.js';
import logger from '../config/logger.js';

// @desc    Get all products with filtering, sorting, pagination (Public)
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  // Build query object
  const queryObj = { status: 'active' };

  // Filter by protection type
  if (req.query.protectionType) {
    queryObj.protectionType = req.query.protectionType;
  }

  // Filter by industry
  if (req.query.industry) {
    queryObj.industry = req.query.industry;
  }

  // Filter by category
  if (req.query.category) {
    queryObj.category = req.query.category;
  }

  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    queryObj.price = {};
    if (req.query.minPrice) {
      queryObj.price.$gte = Number(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      queryObj.price.$lte = Number(req.query.maxPrice);
    }
  }

  // Stock filter
  if (req.query.inStock === 'true') {
    queryObj.stock = { $gt: 0 };
  }

  // Featured filter
  if (req.query.featured === 'true') {
    queryObj.featured = true;
  }

  // On sale filter
  if (req.query.onSale === 'true') {
    queryObj.onSale = true;
    queryObj.saleStartDate = { $lte: new Date() };
    queryObj.saleEndDate = { $gte: new Date() };
  }

  // Search functionality
  let query = Product.find(queryObj);

  if (req.query.search) {
    query = Product.find({
      ...queryObj,
      $text: { $search: req.query.search }
    });
  }

  // Sorting
  let sortBy = {};
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'price-low':
        sortBy = { price: 1 };
        break;
      case 'price-high':
        sortBy = { price: -1 };
        break;
      case 'newest':
        sortBy = { createdAt: -1 };
        break;
      case 'rating':
        sortBy = { ratings: -1 };
        break;
      case 'popular':
        sortBy = { totalSold: -1 };
        break;
      default:
        sortBy = { createdAt: -1 };
    }
  } else {
    sortBy = { createdAt: -1 };
  }

  query = query.sort(sortBy);

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  // Populate category
  query = query.populate('category', 'name slug');

  // Execute query
  const products = await query;
  const total = await Product.countDocuments(queryObj);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: products
  });
});

// @desc    Get single product by ID (Public)
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug description')
    .populate('relatedProducts', 'name price images ratings protectionType')
    .populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'name avatar'
      }
    });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Increment view count (optional analytics)
  // product.views = (product.views || 0) + 1;
  // await product.save();

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Create new product (Admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;

  // Validate required fields
  const requiredFields = ['name', 'description', 'price', 'protectionType', 'industry', 'stock'];
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({
        success: false,
        message: `Please provide ${field}`
      });
    }
  }

  // Handle image uploads
  if (req.files && req.files.length > 0) {
    req.body.images = req.files.map(file => ({
      public_id: file.filename,
      url: file.path,
      alt: req.body.name
    }));
  }

  // Create product
  const product = await Product.create(req.body);

  logger.info(`New product created: ${product.name} by ${req.user.email}`);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product
  });
});

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Handle new image uploads
  if (req.files && req.files.length > 0) {
    // Delete old images from cloudinary
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        if (image.public_id) {
          try {
            await cloudinary.uploader.destroy(image.public_id);
          } catch (error) {
            logger.error('Failed to delete old image:', error);
          }
        }
      }
    }

    // Add new images
    req.body.images = req.files.map(file => ({
      public_id: file.filename,
      url: file.path,
      alt: req.body.name || product.name
    }));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  logger.info(`Product updated: ${product.name} by ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: product
  });
});

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Delete images from cloudinary
  if (product.images && product.images.length > 0) {
    for (const image of product.images) {
      if (image.public_id) {
        try {
          await cloudinary.uploader.destroy(image.public_id);
        } catch (error) {
          logger.error('Failed to delete product image:', error);
        }
      }
    }
  }

  await Product.findByIdAndDelete(req.params.id);

  logger.info(`Product deleted: ${product.name} by ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// @desc    Get products by category (Public)
// @route   GET /api/products/category/:categoryId
// @access  Public
export const getProductsByCategory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const products = await Product.find({
    category: req.params.categoryId,
    status: 'active'
  })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments({
    category: req.params.categoryId,
    status: 'active'
  });

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: products
  });
});

// @desc    Get featured products (Public)
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 8;

  const products = await Product.find({
    featured: true,
    status: 'active',
    stock: { $gt: 0 }
  })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(limit);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get products on sale (Public)
// @route   GET /api/products/sale
// @access  Public
export const getSaleProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const products = await Product.find({
    onSale: true,
    saleStartDate: { $lte: new Date() },
    saleEndDate: { $gte: new Date() },
    status: 'active'
  })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments({
    onSale: true,
    saleStartDate: { $lte: new Date() },
    saleEndDate: { $gte: new Date() },
    status: 'active'
  });

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: products
  });
});

// @desc    Search products (Public)
// @route   GET /api/products/search
// @access  Public
export const searchProducts = asyncHandler(async (req, res) => {
  const { q, protectionType, industry, minPrice, maxPrice } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const queryObj = {
    $text: { $search: q },
    status: 'active'
  };

  // Additional filters
  if (protectionType) queryObj.protectionType = protectionType;
  if (industry) queryObj.industry = industry;
  if (minPrice || maxPrice) {
    queryObj.price = {};
    if (minPrice) queryObj.price.$gte = Number(minPrice);
    if (maxPrice) queryObj.price.$lte = Number(maxPrice);
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const products = await Product.find(queryObj)
    .populate('category', 'name slug')
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(queryObj);

  res.status(200).json({
    success: true,
    query: q,
    count: products.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: products
  });
});

// @desc    Get low stock products (Admin)
// @route   GET /api/products/admin/low-stock
// @access  Private/Admin
export const getLowStockProducts = asyncHandler(async (req, res) => {
  const threshold = parseInt(req.query.threshold) || 10;

  const products = await Product.find({
    stock: { $lte: threshold },
    status: 'active'
  })
    .populate('category', 'name')
    .sort({ stock: 1 });

  res.status(200).json({
    success: true,
    threshold,
    count: products.length,
    data: products
  });
});

// @desc    Bulk update product stock (Admin)
// @route   PUT /api/products/admin/bulk-stock
// @access  Private/Admin
export const bulkUpdateStock = asyncHandler(async (req, res) => {
  const { updates } = req.body; // Array of {productId, stock}

  if (!updates || !Array.isArray(updates)) {
    return res.status(400).json({
      success: false,
      message: 'Updates array is required'
    });
  }

  const results = [];

  for (const update of updates) {
    try {
      const product = await Product.findByIdAndUpdate(
        update.productId,
        { stock: update.stock },
        { new: true }
      );

      if (product) {
        results.push({
          productId: update.productId,
          name: product.name,
          newStock: product.stock,
          success: true
        });
      } else {
        results.push({
          productId: update.productId,
          success: false,
          error: 'Product not found'
        });
      }
    } catch (error) {
      results.push({
        productId: update.productId,
        success: false,
        error: error.message
      });
    }
  }

  logger.info(`Bulk stock update performed by ${req.user.email} - ${results.length} products`);

  res.status(200).json({
    success: true,
    message: 'Bulk stock update completed',
    results
  });
});