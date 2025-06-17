import Product from '../models/Product.js';
import Category from '../models/Category.js';
import asyncHandler from 'express-async-handler';
import { cloudinary } from '../config/cloudinary.js';
import logger from '../config/logger.js';

// @desc    Get all products with filtering, sorting, and pagination (Public)
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const startIndex = (page - 1) * limit;

  // Build filter object
  let filter = { status: 'active' };

  // Protection type filter
  if (req.query.protectionType) {
    filter.protectionType = req.query.protectionType;
  }

  // Industry filter
  if (req.query.industry) {
    filter.industry = req.query.industry;
  }

  // Category filter
  if (req.query.category) {
    filter.category = req.query.category;
  }

  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) {
      filter.price.$gte = parseFloat(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      filter.price.$lte = parseFloat(req.query.maxPrice);
    }
  }

  // In stock filter
  if (req.query.inStock === 'true') {
    filter.stock = { $gt: 0 };
  }

  // Featured filter
  if (req.query.featured === 'true') {
    filter.featured = true;
  }

  // On sale filter
  if (req.query.onSale === 'true') {
    filter.onSale = true;
    filter.saleStartDate = { $lte: new Date() };
    filter.saleEndDate = { $gte: new Date() };
  }

  // Search functionality
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  // Build sort object
  let sort = {};
  if (req.query.sort) {
    const sortBy = req.query.sort;
    switch (sortBy) {
      case 'price_low':
        sort = { price: 1 };
        break;
      case 'price_high':
        sort = { price: -1 };
        break;
      case 'rating':
        sort = { ratings: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'name':
        sort = { name: 1 };
        break;
      case 'popular':
        sort = { totalSold: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }
  } else {
    sort = { createdAt: -1 };
  }

  // Execute queries
  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort(sort)
    .limit(limit)
    .skip(startIndex)
    .select('-reviews'); // Exclude reviews for performance

  // Pagination info
  const pagination = {
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalProducts: total,
    hasNext: page < Math.ceil(total / limit),
    hasPrev: page > 1
  };

  res.status(200).json({
    success: true,
    count: products.length,
    pagination,
    data: products
  });
});

// @desc    Get single product by ID or slug (Public)
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Try to find by ID first, then by slug
  let product = await Product.findById(id)
    .populate('category', 'name slug description')
    .populate('relatedProducts', 'name price images ratings protectionType industry')
    .populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'name avatar'
      },
      match: { isApproved: true },
      options: { sort: { createdAt: -1 }, limit: 10 }
    });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Check if product is available
  if (product.status !== 'active') {
    return res.status(404).json({
      success: false,
      message: 'Product not available'
    });
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Get products by protection type (Public)
// @route   GET /api/products/protection/:type
// @access  Public
export const getProductsByProtectionType = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const startIndex = (page - 1) * limit;

  const validTypes = ['Head', 'Foot', 'Eye', 'Hand', 'Breathing'];
  
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid protection type'
    });
  }

  const filter = { 
    protectionType: type, 
    status: 'active',
    stock: { $gt: 0 }
  };

  // Add industry filter if provided
  if (req.query.industry) {
    filter.industry = req.query.industry;
  }

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort({ featured: -1, createdAt: -1 })
    .limit(limit)
    .skip(startIndex)
    .select('-reviews');

  const pagination = {
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalProducts: total
  };

  res.status(200).json({
    success: true,
    protectionType: type,
    count: products.length,
    pagination,
    data: products
  });
});

// @desc    Get products by industry (Public)
// @route   GET /api/products/industry/:industry
// @access  Public
export const getProductsByIndustry = asyncHandler(async (req, res) => {
  const { industry } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const startIndex = (page - 1) * limit;

  const validIndustries = ['Medical', 'Construction', 'Manufacturing'];
  
  if (!validIndustries.includes(industry)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid industry type'
    });
  }

  const filter = { 
    industry, 
    status: 'active',
    stock: { $gt: 0 }
  };

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort({ featured: -1, createdAt: -1 })
    .limit(limit)
    .skip(startIndex)
    .select('-reviews');

  const pagination = {
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalProducts: total
  };

  res.status(200).json({
    success: true,
    industry,
    count: products.length,
    pagination,
    data: products
  });
});

// @desc    Get featured products (Public)
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 8;

  const products = await Product.find({ 
    featured: true, 
    status: 'active',
    stock: { $gt: 0 }
  })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('-reviews');

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get products on sale (Public)
// @route   GET /api/products/sale
// @access  Public
export const getProductsOnSale = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const startIndex = (page - 1) * limit;

  const filter = {
    onSale: true,
    status: 'active',
    stock: { $gt: 0 },
    saleStartDate: { $lte: new Date() },
    saleEndDate: { $gte: new Date() }
  };

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort({ saleEndDate: 1 }) // Show products ending sale soon first
    .limit(limit)
    .skip(startIndex)
    .select('-reviews');

  const pagination = {
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalProducts: total
  };

  res.status(200).json({
    success: true,
    count: products.length,
    pagination,
    data: products
  });
});

// @desc    Search products (Public)
// @route   GET /api/products/search
// @access  Public
export const searchProducts = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const startIndex = (page - 1) * limit;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Search query must be at least 2 characters'
    });
  }

  const filter = {
    $text: { $search: q },
    status: 'active'
  };

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter, { score: { $meta: 'textScore' } })
    .populate('category', 'name slug')
    .sort({ score: { $meta: 'textScore' }, ratings: -1 })
    .limit(limit)
    .skip(startIndex)
    .select('-reviews');

  const pagination = {
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalProducts: total
  };

  res.status(200).json({
    success: true,
    searchQuery: q,
    count: products.length,
    pagination,
    data: products
  });
});

// @desc    Get product filters and aggregations (Public)
// @route   GET /api/products/filters
// @access  Public
export const getProductFilters = asyncHandler(async (req, res) => {
  // Get protection types with counts
  const protectionTypes = await Product.aggregate([
    { $match: { status: 'active', stock: { $gt: 0 } } },
    { $group: { _id: '$protectionType', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  // Get industries with counts
  const industries = await Product.aggregate([
    { $match: { status: 'active', stock: { $gt: 0 } } },
    { $group: { _id: '$industry', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  // Get price range
  const priceRange = await Product.aggregate([
    { $match: { status: 'active', stock: { $gt: 0 } } },
    {
      $group: {
        _id: null,
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    }
  ]);

  // Get brands with counts
  const brands = await Product.aggregate([
    { $match: { status: 'active', stock: { $gt: 0 } } },
    { $group: { _id: '$brand', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 20 }
  ]);

  res.status(200).json({
    success: true,
    filters: {
      protectionTypes: protectionTypes.map(item => ({
        type: item._id,
        count: item.count
      })),
      industries: industries.map(item => ({
        industry: item._id,
        count: item.count
      })),
      priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0 },
      brands: brands.map(item => ({
        brand: item._id,
        count: item.count
      }))
    }
  });
});

// ADMIN ROUTES BELOW

// @desc    Create new product (Admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;

  // Handle images from multer
  if (req.files && req.files.length > 0) {
    req.body.images = req.files.map((file, index) => ({
      public_id: file.filename,
      url: file.path,
      alt: `${req.body.name} - Image ${index + 1}`,
      isPrimary: index === 0
    }));
  }

  const product = await Product.create(req.body);

  // Update category product count
  if (product.category) {
    const category = await Category.findById(product.category);
    if (category) {
      await category.updateProductCount();
    }
  }

  logger.info(`New product created: ${product.name} (ID: ${product._id}) - KES ${product.price}`);

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

  // Handle new images
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file, index) => ({
      public_id: file.filename,
      url: file.path,
      alt: `${req.body.name || product.name} - Image ${product.images.length + index + 1}`
    }));
    
    req.body.images = [...product.images, ...newImages];
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

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
  for (const image of product.images) {
    try {
      await cloudinary.uploader.destroy(image.public_id);
    } catch (error) {
      logger.error(`Failed to delete image ${image.public_id}:`, error);
    }
  }

  await Product.findByIdAndDelete(req.params.id);

  // Update category product count
  if (product.category) {
    const category = await Category.findById(product.category);
    if (category) {
      await category.updateProductCount();
    }
  }

  logger.info(`Product deleted: ${product.name} (ID: ${product._id})`);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// @desc    Get all products for admin (Admin)
// @route   GET /api/admin/products
// @access  Private/Admin
export const getAdminProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  let filter = {};

  // Status filter
  if (req.query.status) {
    filter.status = req.query.status;
  }

  // Low stock filter
  if (req.query.lowStock === 'true') {
    filter.$expr = { $lte: ['$stock', '$lowStockThreshold'] };
  }

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('category', 'name')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(startIndex)
    .select('-reviews');

  res.status(200).json({
    success: true,
    count: products.length,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    },
    data: products
  });
});