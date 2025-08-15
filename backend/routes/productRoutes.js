// File Path: backend/routes/productRoutes.js - FIXED VERSION
import express from 'express';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

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
    console.log('🔍 Query params:', req.query);
    
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
      onSale,
      inStock
    } = req.query;

    // Build filter object
    let filter = { status: 'active' };

    // 🔧 FIX: Handle category filtering with slug support
    if (category) {
      console.log('🏷️ Filtering by category:', category);
      
      try {
        // First, try to find the category by slug
        const categoryDoc = await Category.findOne({ 
          slug: category,
          status: 'active' 
        });
        
        if (categoryDoc) {
          console.log('✅ Found category by slug:', categoryDoc.name);
          // Use the ObjectId for filtering
          filter.primaryCategory = categoryDoc._id;
        } else {
          console.log('⚠️ Category not found for slug:', category);
          // If category doesn't exist, return empty results
          return res.json({
            success: true,
            data: [],
            pagination: {
              current: parseInt(page),
              total: 0,
              count: 0,
              totalProducts: 0,
              hasNext: false,
              hasPrev: false
            },
            message: `No products found for category: ${category}`
          });
        }
      } catch (categoryError) {
        console.error('❌ Error finding category:', categoryError);
        return res.status(400).json({
          success: false,
          message: 'Invalid category parameter'
        });
      }
    }

    // Search functionality
    if (search) {
      console.log('🔍 Searching for:', search);
      filter.$or = [
        { product_name: { $regex: search, $options: 'i' } },
        { product_description: { $regex: search, $options: 'i' } },
        { product_brand: { $regex: search, $options: 'i' } },
        { keywords: { $regex: search, $options: 'i' } }
      ];
    }

    // Price range filtering
    if (minPrice || maxPrice) {
      filter.product_price = {};
      if (minPrice) filter.product_price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.product_price.$lte = parseFloat(maxPrice);
    }

    // Feature flags
    if (featured === 'true') {
      filter.isFeatured = true;
    }

    if (onSale === 'true') {
      filter.isOnSale = true;
    }

    // Stock filtering
    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    console.log('🎯 Final filter object:', JSON.stringify(filter, null, 2));

    // Build sort object
    const sortObj = {};
    switch (sort) {
      case 'price-low':
        sortObj.product_price = 1;
        break;
      case 'price-high':
        sortObj.product_price = -1;
        break;
      case 'newest':
        sortObj.createdAt = -1;
        break;
      case 'rating':
        sortObj.averageRating = -1;
        break;
      case 'name':
      default:
        sortObj.product_name = 1;
        break;
    }

    console.log('📊 Sort object:', sortObj);

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with error handling
    const products = await Product.find(filter)
      .populate('primaryCategory', 'name slug type icon colors')
      .populate('secondaryCategories', 'name slug type icon')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    console.log(`📦 Found ${products.length} products`);

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    // Format response with KES currency
    const formattedProducts = products.map(product => ({
      ...product,
      formattedPrice: `KES ${product.product_price.toLocaleString()}`,
      saleFormattedPrice: product.salePrice ? 
        `KES ${product.salePrice.toLocaleString()}` : null,
      inStock: product.stock > 0,
      lowStock: product.stock <= (product.lowStockThreshold || 10),
      category: product.primaryCategory?.slug || 'uncategorized',
      categoryName: product.primaryCategory?.name || 'Uncategorized',
      categoryIcon: product.primaryCategory?.icon || '📦'
    }));

    // Build pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const currentPage = parseInt(page);

    res.json({
      success: true,
      data: formattedProducts,
      pagination: {
        current: currentPage,
        total: totalPages,
        count: products.length,
        totalProducts: total,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
        limit: parseInt(limit)
      },
      filters: {
        category: category || 'all',
        search: search || '',
        priceRange: { min: minPrice, max: maxPrice },
        featured: featured === 'true',
        onSale: onSale === 'true',
        inStock: inStock === 'true'
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
    .populate('primaryCategory', 'name slug type icon')
    .limit(parseInt(limit))
    .lean();

    // Format response
    const formattedProducts = products.map(product => ({
      ...product,
      formattedPrice: `KES ${product.product_price.toLocaleString()}`,
      category: product.primaryCategory?.slug || 'uncategorized',
      categoryName: product.primaryCategory?.name || 'Uncategorized'
    }));

    res.json({
      success: true,
      data: formattedProducts,
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
    .populate('primaryCategory', 'name slug type icon')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .lean();

    // Format response
    const formattedProducts = products.map(product => ({
      ...product,
      formattedPrice: `KES ${product.product_price.toLocaleString()}`,
      category: product.primaryCategory?.slug || 'uncategorized',
      categoryName: product.primaryCategory?.name || 'Uncategorized'
    }));

    res.json({
      success: true,
      data: formattedProducts,
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
    .populate('primaryCategory', 'name slug type icon')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .lean();

    // Format response
    const formattedProducts = products.map(product => ({
      ...product,
      formattedPrice: `KES ${product.product_price.toLocaleString()}`,
      saleFormattedPrice: `KES ${product.salePrice.toLocaleString()}`,
      category: product.primaryCategory?.slug || 'uncategorized',
      categoryName: product.primaryCategory?.name || 'Uncategorized'
    }));

    res.json({
      success: true,
      data: formattedProducts,
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

// @route   GET /api/products/categories/:categorySlug
// @desc    Get products by category slug
// @access  Public
router.get('/categories/:categorySlug', async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const { page = 1, limit = 12, sort = 'name' } = req.query;
    
    console.log(`🏷️ Getting products for category: ${categorySlug}`);

    // Find category by slug first
    const category = await Category.findOne({ 
      slug: categorySlug,
      status: 'active' 
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category '${categorySlug}' not found`
      });
    }

    // Build sort object
    const sortObj = {};
    switch (sort) {
      case 'price-low':
        sortObj.product_price = 1;
        break;
      case 'price-high':
        sortObj.product_price = -1;
        break;
      case 'newest':
        sortObj.createdAt = -1;
        break;
      default:
        sortObj.product_name = 1;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Find products in this category
    const products = await Product.find({
      primaryCategory: category._id,
      status: 'active'
    })
    .populate('primaryCategory', 'name slug type icon colors')
    .sort(sortObj)
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

    const total = await Product.countDocuments({
      primaryCategory: category._id,
      status: 'active'
    });

    // Format response
    const formattedProducts = products.map(product => ({
      ...product,
      formattedPrice: `KES ${product.product_price.toLocaleString()}`,
      saleFormattedPrice: product.salePrice ? 
        `KES ${product.salePrice.toLocaleString()}` : null,
      inStock: product.stock > 0,
      lowStock: product.stock <= (product.lowStockThreshold || 10)
    }));

    res.json({
      success: true,
      data: formattedProducts,
      category: {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        colors: category.colors
      },
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
    console.error('❌ Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category',
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
        .populate('primaryCategory', 'name slug description icon colors')
        .populate('secondaryCategories', 'name slug description icon')
        .lean();
    } else {
      // It's likely a slug
      product = await Product.findOne({ slug: req.params.id, status: 'active' })
        .populate('primaryCategory', 'name slug description icon colors')
        .populate('secondaryCategories', 'name slug description icon')
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
      primaryCategory: product.primaryCategory._id,
      _id: { $ne: product._id },
      status: 'active'
    })
    .populate('primaryCategory', 'name slug icon')
    .limit(4)
    .lean();

    // Format the response
    const formattedProduct = {
      ...product,
      formattedPrice: `KES ${product.product_price.toLocaleString()}`,
      saleFormattedPrice: product.salePrice ? 
        `KES ${product.salePrice.toLocaleString()}` : null,
      inStock: product.stock > 0,
      lowStock: product.stock <= (product.lowStockThreshold || 10),
      category: product.primaryCategory?.slug || 'uncategorized',
      categoryName: product.primaryCategory?.name || 'Uncategorized'
    };

    const formattedRelated = relatedProducts.map(related => ({
      ...related,
      formattedPrice: `KES ${related.product_price.toLocaleString()}`,
      category: related.primaryCategory?.slug || 'uncategorized',
      categoryName: related.primaryCategory?.name || 'Uncategorized'
    }));

    res.json({
      success: true,
      data: formattedProduct,
      relatedProducts: formattedRelated
    });

  } catch (error) {
    console.error('❌ Error fetching single product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

export default router;