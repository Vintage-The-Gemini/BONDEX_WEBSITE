// backend/controllers/productController.js
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import mongoose from 'mongoose';

// Helper function to generate slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status = 'active'
    } = req.query;

    // Build query
    const query = { status };

    // Category filter
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        const categoryDoc = await Category.findOne({ 
          $or: [{ slug: category }, { name: { $regex: category, $options: 'i' } }] 
        });
        if (categoryDoc) {
          query.category = categoryDoc._id;
        }
      }
    }

    // Search filter
    if (search) {
      query.$or = [
        { product_name: { $regex: search, $options: 'i' } },
        { product_description: { $regex: search, $options: 'i' } },
        { product_brand: { $regex: search, $options: 'i' } },
        { keywords: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.product_price = {};
      if (minPrice) query.product_price.$gte = parseFloat(minPrice);
      if (maxPrice) query.product_price.$lte = parseFloat(maxPrice);
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(query)
    ]);

    // Format prices for KES currency
    const formattedProducts = products.map(product => ({
      ...product,
      formattedPrice: new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES'
      }).format(product.product_price),
      formattedSalePrice: product.salePrice ? new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES'
      }).format(product.salePrice) : null
    }));

    res.status(200).json({
      success: true,
      data: formattedProducts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total,
        hasNextPage: page < Math.ceil(total / parseInt(limit)),
        hasPrevPage: page > 1
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

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find by ID or slug
    const query = mongoose.Types.ObjectId.isValid(id) 
      ? { _id: id } 
      : { slug: id };
    
    const product = await Product.findOne(query)
      .populate('category', 'name slug description')
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Format prices for KES currency
    const formattedProduct = {
      ...product,
      formattedPrice: new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES'
      }).format(product.product_price),
      formattedSalePrice: product.salePrice ? new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES'
      }).format(product.salePrice) : null
    };

    res.status(200).json({
      success: true,
      data: formattedProduct
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

// @desc    Create product (Admin only)
// @route   POST /api/products
// @access  Private (Admin only)
export const createProduct = async (req, res) => {
  try {
    console.log('Creating product with data:', req.body);

    const {
      product_name,
      product_description,
      product_brand,
      category,
      product_price,
      stock,
      features,
      specifications,
      status = 'active',
      isOnSale = false,
      isFeatured = false,
      salePrice,
      saleEndDate,
      metaTitle,
      metaDescription,
      keywords,
      tags
    } = req.body;

    // Validate required fields
    if (!product_name || !product_description || !category || !product_price || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: product_name, product_description, category, product_price, stock'
      });
    }

    // Validate category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category selected'
      });
    }

    // Generate slug from product name
    const slug = generateSlug(product_name);

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with similar name already exists'
      });
    }

    // Prepare product data
    const productData = {
      product_name: product_name.trim(),
      product_description: product_description.trim(),
      product_brand: product_brand?.trim() || '',
      category,
      product_price: parseFloat(product_price),
      stock: parseInt(stock),
      slug,
      status,
      isOnSale: Boolean(isOnSale),
      isFeatured: Boolean(isFeatured),
      metaTitle: metaTitle || product_name,
      metaDescription: metaDescription || product_description.substring(0, 160),
      keywords: keywords ? (Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim())) : [],
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : []
    };

    // Handle sale pricing
    if (isOnSale && salePrice) {
      productData.salePrice = parseFloat(salePrice);
      if (saleEndDate) {
        productData.saleEndDate = new Date(saleEndDate);
      }
    }

    // Handle features
    if (features) {
      productData.features = Array.isArray(features) ? features : features.split(',').map(f => f.trim());
    }

    // Handle specifications
    if (specifications) {
      productData.specifications = typeof specifications === 'object' ? specifications : {};
    }

    // Handle images (assuming they're handled by middleware like multer/cloudinary)
    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => ({
        url: file.path || file.secure_url,
        public_id: file.filename || file.public_id,
        alt: product_name
      }));
      
      productData.images = images;
      productData.mainImage = images[0].url;
      productData.product_image = images[0].url;
    }

    const product = await Product.create(productData);
    
    // Populate category data in response
    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name slug');

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

// @desc    Update product (FIXED VERSION)
// @route   PUT /api/products/:id
// @access  Private (Admin only)
export const updateProduct = async (req, res) => {
  try {
    console.log('🔄 Updating product:', req.params.id);
    console.log('📝 Update data received:', req.body);
    
    const product = await Product.findById(req.params.id);

    if (!product) {
      console.log('❌ Product not found:', req.params.id);
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
      features,
      specifications,
      status,
      isOnSale,
      isFeatured,
      salePrice,
      saleEndDate,
      metaTitle,
      metaDescription,
      keywords,
      tags
    } = req.body;

    // Validate category if provided
    if (category && category !== product.category.toString()) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category selected'
        });
      }
    }

    // Prepare update data
    const updateData = {};

    // Update basic fields
    if (product_name !== undefined) {
      updateData.product_name = product_name.trim();
      // Update slug if name changed
      if (product_name.trim() !== product.product_name) {
        const newSlug = generateSlug(product_name);
        const existingProduct = await Product.findOne({ 
          slug: newSlug, 
          _id: { $ne: req.params.id } 
        });
        if (existingProduct) {
          return res.status(400).json({
            success: false,
            message: 'Product with similar name already exists'
          });
        }
        updateData.slug = newSlug;
      }
    }

    if (product_description !== undefined) {
      updateData.product_description = product_description.trim();
    }

    if (product_brand !== undefined) {
      updateData.product_brand = product_brand.trim();
    }

    if (category !== undefined) {
      updateData.category = category;
    }

    if (product_price !== undefined) {
      updateData.product_price = parseFloat(product_price);
    }

    if (stock !== undefined) {
      updateData.stock = parseInt(stock);
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    if (isOnSale !== undefined) {
      updateData.isOnSale = Boolean(isOnSale);
    }

    if (isFeatured !== undefined) {
      updateData.isFeatured = Boolean(isFeatured);
    }

    // Handle sale pricing
    if (salePrice !== undefined) {
      updateData.salePrice = salePrice ? parseFloat(salePrice) : null;
    }

    if (saleEndDate !== undefined) {
      updateData.saleEndDate = saleEndDate ? new Date(saleEndDate) : null;
    }

    // Handle arrays and objects
    if (features !== undefined) {
      updateData.features = Array.isArray(features) ? features : 
        (features ? features.split(',').map(f => f.trim()) : []);
    }

    if (specifications !== undefined) {
      updateData.specifications = typeof specifications === 'object' ? specifications : {};
    }

    if (keywords !== undefined) {
      updateData.keywords = Array.isArray(keywords) ? keywords :
        (keywords ? keywords.split(',').map(k => k.trim()) : []);
    }

    if (tags !== undefined) {
      updateData.tags = Array.isArray(tags) ? tags :
        (tags ? tags.split(',').map(t => t.trim()) : []);
    }

    // Handle meta fields
    if (metaTitle !== undefined) {
      updateData.metaTitle = metaTitle || updateData.product_name || product.product_name;
    }

    if (metaDescription !== undefined) {
      updateData.metaDescription = metaDescription || 
        (updateData.product_description || product.product_description).substring(0, 160);
    }

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => ({
        url: file.path || file.secure_url,
        public_id: file.filename || file.public_id,
        alt: updateData.product_name || product.product_name
      }));
      
      updateData.images = images;
      updateData.mainImage = images[0].url;
      updateData.product_image = images[0].url;
    }

    // Set updated timestamp
    updateData.updatedAt = new Date();

    console.log('💾 Final update data:', updateData);

    // Perform the update with validation
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validation
        context: 'query' // Needed for some validators
      }
    ).populate('category', 'name slug type');

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found after update'
      });
    }

    console.log('✅ Product updated successfully:', updatedProduct._id);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });

  } catch (error) {
    console.error('❌ Update Product Error:', error);
    
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
        message: 'Product with this name already exists'
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
};

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};