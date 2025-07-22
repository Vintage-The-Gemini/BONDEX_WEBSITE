// backend/routes/debugRoutes.js
import express from 'express';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/debug/products
// @desc    Debug: Get all products without authentication
// @access  Public (for debugging only)
router.get('/products', async (req, res) => {
  try {
    console.log('🔧 DEBUG: Fetching all products...');
    
    const products = await Product.find({})
      .populate('category', 'name slug type')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    
    console.log(`🔧 DEBUG: Found ${products.length} products in database`);
    
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: 'active' });
    const draftProducts = await Product.countDocuments({ status: 'draft' });
    
    res.json({
      success: true,
      message: 'Debug products fetch',
      debug: true,
      stats: {
        total: totalProducts,
        active: activeProducts,
        draft: draftProducts,
        returned: products.length
      },
      data: products.map(product => ({
        _id: product._id,
        product_name: product.product_name,
        product_price: product.product_price,
        stock: product.stock,
        status: product.status,
        category: product.category?.name || 'No category',
        images: product.images?.length || 0,
        mainImage: product.mainImage ? 'Yes' : 'No',
        createdAt: product.createdAt,
        isOnSale: product.isOnSale,
        isFeatured: product.isFeatured
      }))
    });
    
  } catch (error) {
    console.error('🔧 DEBUG ERROR fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Debug error fetching products',
      error: error.message,
      debug: true
    });
  }
});

// @route   GET /api/debug/categories
// @desc    Debug: Get all categories
// @access  Public (for debugging only)
router.get('/categories', async (req, res) => {
  try {
    console.log('🔧 DEBUG: Fetching all categories...');
    
    const categories = await Category.find({}).sort({ name: 1 }).lean();
    
    console.log(`🔧 DEBUG: Found ${categories.length} categories in database`);
    
    res.json({
      success: true,
      message: 'Debug categories fetch',
      debug: true,
      count: categories.length,
      data: categories.map(cat => ({
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
        type: cat.type,
        status: cat.status,
        productCount: cat.productCount || 0
      }))
    });
    
  } catch (error) {
    console.error('🔧 DEBUG ERROR fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Debug error fetching categories',
      error: error.message,
      debug: true
    });
  }
});

// @route   GET /api/debug/database
// @desc    Debug: Check database connection and collections
// @access  Public (for debugging only)
router.get('/database', async (req, res) => {
  try {
    console.log('🔧 DEBUG: Checking database status...');
    
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();
    const userCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    const recentProducts = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('product_name status createdAt')
      .lean();
    
    console.log(`🔧 DEBUG: Database has ${productCount} products, ${categoryCount} categories, ${userCount} users`);
    
    res.json({
      success: true,
      message: 'Database debug info',
      debug: true,
      database: {
        connected: true,
        collections: {
          products: productCount,
          categories: categoryCount,
          users: userCount,
          admins: adminCount
        },
        recentProducts: recentProducts.map(p => ({
          name: p.product_name,
          status: p.status,
          created: p.createdAt
        }))
      }
    });
    
  } catch (error) {
    console.error('🔧 DEBUG ERROR checking database:', error);
    res.status(500).json({
      success: false,
      message: 'Debug error checking database',
      error: error.message,
      debug: true,
      database: {
        connected: false
      }
    });
  }
});

// @route   GET /api/debug/auth
// @desc    Debug: Test authentication headers
// @access  Public (for debugging only)
router.get('/auth', (req, res) => {
  try {
    console.log('🔧 DEBUG: Checking auth headers...');
    
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer') 
      ? authHeader.split(' ')[1] 
      : null;
    
    res.json({
      success: true,
      message: 'Auth debug info',
      debug: true,
      headers: {
        authorization: authHeader ? 'Present' : 'Missing',
        contentType: req.headers['content-type'],
        origin: req.headers.origin,
        userAgent: req.headers['user-agent']?.substring(0, 50) + '...'
      },
      token: {
        present: !!token,
        format: token ? 'Valid Bearer format' : 'Invalid or missing',
        length: token ? token.length : 0
      }
    });
    
  } catch (error) {
    console.error('🔧 DEBUG ERROR checking auth:', error);
    res.status(500).json({
      success: false,
      message: 'Debug error checking auth',
      error: error.message,
      debug: true
    });
  }
});

// @route   POST /api/debug/create-test-product
// @desc    Debug: Create a test product without authentication
// @access  Public (for debugging only)
router.post('/create-test-product', async (req, res) => {
  try {
    console.log('🔧 DEBUG: Creating test product...');
    
    const category = await Category.findOne({ status: 'active' });
    
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'No active category found. Create a category first.',
        debug: true
      });
    }
    
    const testProduct = {
      product_name: `Test Safety Helmet ${Date.now()}`,
      product_description: 'This is a test safety helmet for debugging purposes.',
      product_brand: 'Test Safety Brand',
      category: category._id,
      product_price: 2500,
      stock: 15,
      status: 'active',
      isOnSale: false,
      isFeatured: false,
      images: [{
        url: 'https://via.placeholder.com/400x400/007bff/ffffff?text=Test+Helmet',
        public_id: 'test_helmet_placeholder',
        alt: 'Test Safety Helmet'
      }],
      mainImage: 'https://via.placeholder.com/400x400/007bff/ffffff?text=Test+Helmet',
      product_image: 'https://via.placeholder.com/400x400/007bff/ffffff?text=Test+Helmet',
      tags: ['test', 'debug', 'safety', 'helmet'],
      specifications: {
        material: 'High-density polyethylene',
        certification: 'ANSI Z89.1',
        warranty: '2 years'
      },
      slug: `test-safety-helmet-${Date.now()}`
    };
    
    const product = await Product.create(testProduct);
    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name slug type');
    
    console.log('✅ DEBUG: Test product created:', product._id);
    
    res.status(201).json({
      success: true,
      message: 'Test product created successfully',
      debug: true,
      data: populatedProduct
    });
    
  } catch (error) {
    console.error('🔧 DEBUG ERROR creating test product:', error);
    res.status(500).json({
      success: false,
      message: 'Debug error creating test product',
      error: error.message,
      debug: true
    });
  }
});

// @route   DELETE /api/debug/clear-test-products
// @desc    Debug: Clear all test products
// @access  Public (for debugging only)
router.delete('/clear-test-products', async (req, res) => {
  try {
    console.log('🔧 DEBUG: Clearing test products...');
    
    const result = await Product.deleteMany({
      $or: [
        { product_name: /^Test/ },
        { tags: { $in: ['test', 'debug'] } }
      ]
    });
    
    console.log(`✅ DEBUG: Deleted ${result.deletedCount} test products`);
    
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} test products`,
      debug: true,
      deletedCount: result.deletedCount
    });
    
  } catch (error) {
    console.error('🔧 DEBUG ERROR clearing test products:', error);
    res.status(500).json({
      success: false,
      message: 'Debug error clearing test products',
      error: error.message,
      debug: true
    });
  }
});

export default router;