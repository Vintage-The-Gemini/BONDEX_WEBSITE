// backend/routes/productRoutes.js - FIXED VERSION (Public Routes Only)
import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// ============================================
// PUBLIC PRODUCT ROUTES ONLY (No authentication needed)
// ============================================

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('📦 Public products route hit');
    
    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      sort = 'createdAt',
      order = 'desc',
      featured,
      onSale
    } = req.query;

    // Build filter object
    let filter = { status: 'active' };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { product_name: { $regex: search, $options: 'i' } },
        { product_description: { $regex: search, $options: 'i' } },
        { product_brand: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      filter.product_price = {};
      if (minPrice) filter.product_price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.product_price.$lte = parseFloat(maxPrice);
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    if (onSale === 'true') {
      filter.isOnSale = true;
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with error handling
    const products = await Product.find(filter)
      .populate('primaryCategory', 'name slug') // 🔧 FIX: Use primaryCategory instead of category
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    // Format response
    const formattedProducts = products.map(product => ({
      ...product,
      formattedPrice: `KES ${product.product_price.toLocaleString()}`,
      saleFormattedPrice: product.salePrice ? `KES ${product.salePrice.toLocaleString()}` : null,
      inStock: product.stock > 0,
      lowStock: product.stock <= (product.lowStockThreshold || 10)
    }));

    res.json({
      success: true,
      data: formattedProducts,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: products.length,
        totalProducts: total,
        hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('❌ Error fetching public products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// @route   GET /api/products/search
// @desc    Search products
// @access  Public
router.get('/search', async (req, res) => {
  try {
    console.log('🔍 Product search route hit');
    
    const { q: searchQuery, limit = 10 } = req.query;

    if (!searchQuery) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const products = await Product.find({
      status: 'active',
      $or: [
        { product_name: { $regex: searchQuery, $options: 'i' } },
        { product_description: { $regex: searchQuery, $options: 'i' } },
        { product_brand: { $regex: searchQuery, $options: 'i' } },
        { keywords: { $regex: searchQuery, $options: 'i' } }
      ]
    })
    .populate('primaryCategory', 'name slug') // 🔧 FIX: Use primaryCategory
    .limit(parseInt(limit))
    .lean();

    res.json({
      success: true,
      data: products,
      count: products.length
    });

  } catch (error) {
    console.error('❌ Error searching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    console.log('⭐ Featured products route hit');
    
    const { limit = 8 } = req.query;

    const products = await Product.find({
      status: 'active',
      isFeatured: true
    })
    .populate('primaryCategory', 'name slug') // 🔧 FIX: Use primaryCategory
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .lean();

    res.json({
      success: true,
      data: products,
      count: products.length
    });

  } catch (error) {
    console.error('❌ Error fetching featured products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    });
  }
});

// @route   GET /api/products/sale
// @desc    Get products on sale
// @access  Public
router.get('/sale', async (req, res) => {
  try {
    console.log('💰 Sale products route hit');
    
    const { limit = 12 } = req.query;

    const products = await Product.find({
      status: 'active',
      isOnSale: true,
      salePrice: { $exists: true, $ne: null }
    })
    .populate('primaryCategory', 'name slug') // 🔧 FIX: Use primaryCategory
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .lean();

    res.json({
      success: true,
      data: products,
      count: products.length
    });

  } catch (error) {
    console.error('❌ Error fetching sale products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sale products',
      error: error.message
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID or slug
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    console.log(`🔍 Single product route hit for: ${req.params.id}`);
    
    let product;
    
    // Try to find by MongoDB ObjectId first, then by slug
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      // It's a valid ObjectId
      product = await Product.findById(req.params.id)
        .populate('primaryCategory', 'name slug description') // 🔧 FIX: Use primaryCategory
        .lean();
    } else {
      // It's likely a slug
      product = await Product.findOne({ slug: req.params.id, status: 'active' })
        .populate('primaryCategory', 'name slug description') // 🔧 FIX: Use primaryCategory
        .lean();
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get related products from the same category
    const relatedProducts = await Product.find({
      primaryCategory: product.primaryCategory._id, // 🔧 FIX: Use primaryCategory
      _id: { $ne: product._id },
      status: 'active'
    })
    .populate('primaryCategory', 'name slug') // 🔧 FIX: Use primaryCategory
    .limit(4)
    .lean();

    // Format the response
    const formattedProduct = {
      ...product,
      formattedPrice: `KES ${product.product_price.toLocaleString()}`,
      saleFormattedPrice: product.salePrice ? `KES ${product.salePrice.toLocaleString()}` : null,
      inStock: product.stock > 0,
      lowStock: product.stock <= (product.lowStockThreshold || 10),
      relatedProducts
    };

    console.log(`✅ Found product: ${product.product_name}`);

    res.json({
      success: true,
      data: formattedProduct
    });

  } catch (error) {
    console.error('❌ Error fetching product:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// ============================================
// PRODUCT STATISTICS (Public)
// ============================================

// @route   GET /api/products/stats/overview
// @desc    Get public product statistics
// @access  Public
router.get('/stats/overview', async (req, res) => {
  try {
    console.log('📊 Product stats route hit');
    
    const totalProducts = await Product.countDocuments({ status: 'active' });
    const featuredProducts = await Product.countDocuments({ status: 'active', isFeatured: true });
    const productsOnSale = await Product.countDocuments({ status: 'active', isOnSale: true });
    
    // Get categories with product counts
    const categoryStats = await Product.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$primaryCategory', count: { $sum: 1 } } }, // 🔧 FIX: Use primaryCategory
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $project: { name: '$category.name', count: 1 } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        featuredProducts,
        productsOnSale,
        categoryStats
      }
    });

  } catch (error) {
    console.error('❌ Error fetching product stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product statistics',
      error: error.message
    });
  }
});

export default router;