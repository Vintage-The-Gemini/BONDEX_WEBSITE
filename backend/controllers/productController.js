// backend/controllers/productController.js
import Product from '../models/Product.js';

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    // Build query object for filtering
    let query = {};

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by brand
    if (req.query.product_brand) {
      query.product_brand = req.query.product_brand;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.product_price = {};
      if (req.query.minPrice) {
        query.product_price.$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.product_price.$lte = Number(req.query.maxPrice);
      }
    }

    // Search in product name and description
    if (req.query.search) {
      query.$or = [
        { product_name: { $regex: req.query.search, $options: 'i' } },
        { product_description: { $regex: req.query.search, $options: 'i' } },
        { product_brand: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    // Featured products filter
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }

    // On sale filter
    if (req.query.onSale === 'true') {
      query.isOnSale = true;
    }

    // Only show active products by default for public API
    if (!req.query.includeInactive) {
      query.status = 'active';
    }

    // Sorting options
    let sortBy = {};
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'price_low':
          sortBy.product_price = 1;
          break;
        case 'price_high':
          sortBy.product_price = -1;
          break;
        case 'name_asc':
          sortBy.product_name = 1;
          break;
        case 'name_desc':
          sortBy.product_name = -1;
          break;
        case 'newest':
          sortBy.createdAt = -1;
          break;
        case 'oldest':
          sortBy.createdAt = 1;
          break;
        case 'rating':
          sortBy['rating.average'] = -1;
          break;
        default:
          sortBy.createdAt = -1; // Default: newest first
      }
    } else {
      sortBy.createdAt = -1; // Default sorting
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Execute query with population
    const products = await Product.find(query)
      .populate('category', 'name slug type')
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    // Add final price calculation for each product
    const productsWithFinalPrice = products.map(product => ({
      ...product._doc,
      finalPrice: product.isOnSale && product.salePrice ? product.salePrice : product.product_price,
      formattedPrice: `KES ${product.product_price.toLocaleString()}`,
      formattedFinalPrice: `KES ${(product.isOnSale && product.salePrice ? product.salePrice : product.product_price).toLocaleString()}`
    }));

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages,
      currentPage: page,
      data: productsWithFinalPrice,
      pagination: {
        current: page,
        total: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug type description');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    product.views = (product.views || 0) + 1;
    await product.save();

    // Add final price calculation
    const productWithFinalPrice = {
      ...product._doc,
      finalPrice: product.isOnSale && product.salePrice ? product.salePrice : product.product_price,
      formattedPrice: `KES ${product.product_price.toLocaleString()}`,
      formattedFinalPrice: `KES ${(product.isOnSale && product.salePrice ? product.salePrice : product.product_price).toLocaleString()}`
    };

    res.status(200).json({
      success: true,
      data: productWithFinalPrice
    });

  } catch (error) {
    console.error('Get Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin only - basic version)
export const createProduct = async (req, res) => {
  try {
    console.log('Creating product with data:', req.body);
    
    const productData = {
      ...req.body,
      product_price: parseFloat(req.body.product_price),
      stock: parseInt(req.body.stock) || 0
    };

    // Create new product
    const product = await Product.create(productData);

    // Populate category information
    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name slug type');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: populatedProduct
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

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product with this slug already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin only)
export const updateProduct = async (req, res) => {
  try {
    console.log('Updating product:', req.params.id);
    
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    // Convert string numbers to proper types
    if (updateData.product_price) {
      updateData.product_price = parseFloat(updateData.product_price);
    }
    if (updateData.stock !== undefined) {
      updateData.stock = parseInt(updateData.stock);
    }
    if (updateData.salePrice) {
      updateData.salePrice = parseFloat(updateData.salePrice);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true, // Return updated document
        runValidators: true // Run schema validation
      }
    ).populate('category', 'name slug type');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });

  } catch (error) {
    console.error('Update Product Error:', error);
    
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
      message: 'Error updating product',
      error: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: product
    });

  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query - category can be ID or name
    let query = { status: 'active' };
    
    // Check if category is ObjectId or name
    if (category.match(/^[0-9a-fA-F]{24}$/)) {
      // It's an ObjectId
      query.category = category;
    } else {
      // It's a category name, need to find by name first
      const categoryDoc = await Product.findOne({}).populate('category');
      if (categoryDoc && categoryDoc.category && categoryDoc.category.name.toLowerCase() === category.toLowerCase()) {
        query.category = categoryDoc.category._id;
      } else {
        // Fallback: search by category name in populated field
        const products = await Product.find({ status: 'active' })
          .populate('category', 'name slug type')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
        
        const filteredProducts = products.filter(product => 
          product.category && 
          product.category.name.toLowerCase() === category.toLowerCase()
        );

        return res.status(200).json({
          success: true,
          count: filteredProducts.length,
          category,
          data: filteredProducts
        });
      }
    }

    const products = await Product.find(query)
      .populate('category', 'name slug type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);

    // Add final price calculation
    const productsWithFinalPrice = products.map(product => ({
      ...product._doc,
      finalPrice: product.isOnSale && product.salePrice ? product.salePrice : product.product_price,
      formattedPrice: `KES ${product.product_price.toLocaleString()}`,
      formattedFinalPrice: `KES ${(product.isOnSale && product.salePrice ? product.salePrice : product.product_price).toLocaleString()}`
    }));

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      category,
      data: productsWithFinalPrice
    });

  } catch (error) {
    console.error('Get Products by Category Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category',
      error: error.message
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const products = await Product.find({ 
      isFeatured: true, 
      status: 'active',
      stock: { $gt: 0 }
    })
    .populate('category', 'name slug type')
    .sort({ createdAt: -1 })
    .limit(limit);

    // Add final price calculation
    const productsWithFinalPrice = products.map(product => ({
      ...product._doc,
      finalPrice: product.isOnSale && product.salePrice ? product.salePrice : product.product_price,
      formattedPrice: `KES ${product.product_price.toLocaleString()}`,
      formattedFinalPrice: `KES ${(product.isOnSale && product.salePrice ? product.salePrice : product.product_price).toLocaleString()}`
    }));

    res.status(200).json({
      success: true,
      count: products.length,
      data: productsWithFinalPrice
    });

  } catch (error) {
    console.error('Get Featured Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    });
  }
};

// @desc    Get products on sale
// @route   GET /api/products/sale
// @access  Public
export const getProductsOnSale = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    
    const products = await Product.find({ 
      isOnSale: true, 
      status: 'active',
      stock: { $gt: 0 },
      $or: [
        { saleEndDate: { $gt: new Date() } },
        { saleEndDate: null }
      ]
    })
    .populate('category', 'name slug type')
    .sort({ createdAt: -1 })
    .limit(limit);

    // Add final price calculation
    const productsWithFinalPrice = products.map(product => ({
      ...product._doc,
      finalPrice: product.salePrice || product.product_price,
      formattedPrice: `KES ${product.product_price.toLocaleString()}`,
      formattedFinalPrice: `KES ${(product.salePrice || product.product_price).toLocaleString()}`,
      savings: product.salePrice ? product.product_price - product.salePrice : 0,
      discountPercentage: product.salePrice ? Math.round(((product.product_price - product.salePrice) / product.product_price) * 100) : 0
    }));

    res.status(200).json({
      success: true,
      count: products.length,
      data: productsWithFinalPrice
    });

  } catch (error) {
    console.error('Get Products on Sale Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products on sale',
      error: error.message
    });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchRegex = new RegExp(q.trim(), 'i');
    
    const query = {
      status: 'active',
      $or: [
        { product_name: searchRegex },
        { product_description: searchRegex },
        { product_brand: searchRegex },
        { tags: { $in: [searchRegex] } }
      ]
    };

    const products = await Product.find(query)
      .populate('category', 'name slug type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);

    // Add final price calculation
    const productsWithFinalPrice = products.map(product => ({
      ...product._doc,
      finalPrice: product.isOnSale && product.salePrice ? product.salePrice : product.product_price,
      formattedPrice: `KES ${product.product_price.toLocaleString()}`,
      formattedFinalPrice: `KES ${(product.isOnSale && product.salePrice ? product.salePrice : product.product_price).toLocaleString()}`
    }));

    res.status(200).json({
      success: true,
      query: q,
      count: products.length,
      totalProducts,
      data: productsWithFinalPrice
    });

  } catch (error) {
    console.error('Search Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    });
  }
};