// backend/routes/adminProductRoutes.js
import express from 'express';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { 
  uploadProductImage, 
  validateProductImages,
  logUploadActivity,
  handleUploadError,
  deleteCloudinaryImage 
} from '../middleware/upload.js';
import { protect, adminOnly } from '../middleware/adminAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);
router.use(adminOnly);

// Helper function to generate slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens
};

// @route   GET /api/admin/products
// @desc    Get all products for admin with pagination and filters
// @access  Private (Admin only)
router.get('/', async (req, res) => {
  try {
    console.log('🔍 Admin fetching products with query:', req.query);
    console.log('👤 Admin user:', req.user?.email);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    let filter = {};
    
    if (req.query.status && req.query.status !== '') {
      filter.status = req.query.status;
      console.log('📊 Filtering by status:', req.query.status);
    }
    
    if (req.query.category && req.query.category !== '') {
      filter.category = req.query.category;
      console.log('📂 Filtering by category:', req.query.category);
    }
    
    if (req.query.search && req.query.search.trim()) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      filter.$or = [
        { product_name: searchRegex },
        { product_description: searchRegex },
        { product_brand: searchRegex },
        { tags: { $in: [searchRegex] } }
      ];
      console.log('🔍 Searching for:', req.query.search);
    }
    
    // Build sort option
    let sortOption = { createdAt: -1 }; // Default: newest first
    
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'name':
          sortOption = { product_name: 1 };
          break;
        case 'price_low':
          sortOption = { product_price: 1 };
          break;
        case 'price_high':
          sortOption = { product_price: -1 };
          break;
        case 'stock_low':
          sortOption = { stock: 1 };
          break;
        case 'stock_high':
          sortOption = { stock: -1 };
          break;
        case 'oldest':
          sortOption = { createdAt: 1 };
          break;
        case 'newest':
        default:
          sortOption = { createdAt: -1 };
      }
      console.log('📈 Sorting by:', req.query.sort, '➡️', sortOption);
    }
    
    console.log('🎯 Final filter:', JSON.stringify(filter, null, 2));
    console.log('📊 Sort option:', sortOption);
    console.log('📄 Page:', page, 'Limit:', limit, 'Skip:', skip);
    
    // Execute query
    const products = await Product.find(filter)
      .populate('category', 'name slug type')
      .sort(sortOption)
      .limit(limit)
      .skip(skip)
      .lean() // Use lean for better performance
      .exec();
    
    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    
    console.log(`✅ Found ${products.length} products out of ${total} total`);
    
    // Format products for frontend
    const formattedProducts = products.map(product => ({
      ...product,
      formattedPrice: `KES ${(product.product_price || 0).toLocaleString()}`,
      formattedSalePrice: product.salePrice ? `KES ${product.salePrice.toLocaleString()}` : null,
      stockStatus: product.stock === 0 ? 'out_of_stock' : 
                   product.stock <= (product.lowStockThreshold || 10) ? 'low_stock' : 'in_stock'
    }));
    
    res.json({
      success: true,
      data: formattedProducts,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: products.length,
        totalProducts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      filters: {
        status: req.query.status,
        category: req.query.category,
        search: req.query.search,
        sort: req.query.sort
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching admin products:', error);
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
    console.log(`🔍 Admin fetching single product: ${req.params.id}`);
    
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug type description');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    console.log(`✅ Found product: ${product.product_name}`);
    
    res.json({
      success: true,
      data: product
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

// @route   POST /api/admin/products
// @desc    Create new product with Cloudinary image upload
// @access  Private (Admin only)
router.post('/', 
  uploadProductImage.array('images', 5), 
  validateProductImages,
  logUploadActivity,
  async (req, res) => {
    try {
      console.log('📦 Creating product with data:', JSON.stringify(req.body, null, 2));
      console.log('🖼️ Uploaded files:', req.files?.length || 0);
      console.log('👤 Admin user:', req.user?.email);
      
      // Check if at least one image was uploaded
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one product image is required'
        });
      }
      
      // Parse form data
      let productData = { ...req.body };
      
      // Parse JSON fields if they're strings
      if (typeof productData.tags === 'string') {
        try {
          productData.tags = JSON.parse(productData.tags);
        } catch (e) {
          console.log('⚠️ Invalid tags JSON, setting to empty array');
          productData.tags = [];
        }
      }
      
      if (typeof productData.specifications === 'string') {
        try {
          productData.specifications = JSON.parse(productData.specifications);
        } catch (e) {
          console.log('⚠️ Invalid specifications JSON, setting to empty object');
          productData.specifications = {};
        }
      }
      
      // Convert string values to proper types
      productData.product_price = parseFloat(productData.product_price);
      productData.stock = parseInt(productData.stock) || 0;
      productData.lowStockThreshold = parseInt(productData.lowStockThreshold) || 10;
      
      if (productData.salePrice) {
        productData.salePrice = parseFloat(productData.salePrice);
      }
      
      // Convert boolean strings
      productData.isOnSale = productData.isOnSale === 'true';
      productData.isFeatured = productData.isFeatured === 'true';
      
      // Generate slug
      productData.slug = generateSlug(productData.product_name);
      
      // Add admin tracking
      productData.createdBy = req.user._id;
      
      console.log('🔧 Processed product data:', JSON.stringify(productData, null, 2));
      
      // Check for existing product with similar name or slug
      const existingProduct = await Product.findOne({
        $or: [
          { slug: productData.slug },
          { product_name: { $regex: new RegExp(`^${productData.product_name}$`, 'i') } }
        ]
      });
      
      if (existingProduct) {
        console.log('⚠️ Product with similar name already exists:', existingProduct.product_name);
        
        // Delete uploaded images from Cloudinary since we're rejecting the product
        for (const file of req.files) {
          try {
            await deleteCloudinaryImage(file.filename);
            console.log('🗑️ Cleaned up uploaded image:', file.filename);
          } catch (deleteError) {
            console.error('❌ Error deleting uploaded image:', deleteError);
          }
        }
        
        return res.status(400).json({
          success: false,
          message: 'Product with similar name already exists'
        });
      }
      
      // Process uploaded images
      const images = req.files.map(file => ({
        url: file.path,
        public_id: file.filename,
        alt: `${productData.product_name} - Product Image`
      }));
      
      console.log('🖼️ Processed images:', images.length, 'images');
      
      // Set main image (first uploaded image)
      productData.mainImage = images[0].url;
      productData.product_image = images[0].url; // For backward compatibility
      productData.images = images;
      
      // Validate sale price if on sale
      if (productData.isOnSale && productData.salePrice) {
        if (productData.salePrice >= productData.product_price) {
          console.log('⚠️ Sale price validation failed');
          
          // Delete uploaded images
          for (const file of req.files) {
            try {
              await deleteCloudinaryImage(file.filename);
            } catch (deleteError) {
              console.error('❌ Error deleting uploaded image:', deleteError);
            }
          }
          
          return res.status(400).json({
            success: false,
            message: 'Sale price must be less than regular price'
          });
        }
      }
      
      console.log('💾 Creating product in database...');
      
      // Create the product
      const product = await Product.create(productData);
      
      console.log('✅ Product created with ID:', product._id);
      
      // Populate category information
      const populatedProduct = await Product.findById(product._id)
        .populate('category', 'name slug type');
      
      console.log('✅ Product created successfully:', populatedProduct.product_name);
      
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: populatedProduct
      });
      
    } catch (error) {
      console.error('❌ Create Product Error:', error);
      
      // Clean up uploaded images on error
      if (req.files) {
        for (const file of req.files) {
          try {
            await deleteCloudinaryImage(file.filename);
            console.log('🗑️ Cleaned up uploaded image on error:', file.filename);
          } catch (deleteError) {
            console.error('❌ Error deleting uploaded image:', deleteError);
          }
        }
      }
      
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
  }
);

// @route   PUT /api/admin/products/:id
// @desc    Update product
// @access  Private (Admin only)
router.put('/:id', async (req, res) => {
  try {
    console.log('📝 Updating product:', req.params.id);
    console.log('👤 Admin user:', req.user?.email);
    
    const updateData = {
      ...req.body,
      updatedAt: new Date(),
      updatedBy: req.user._id
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

    console.log('✅ Product updated successfully:', product.product_name);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
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

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
});

// @route   DELETE /api/admin/products/:id/images/:imageIndex
// @desc    Delete specific image from product
// @access  Private (Admin only)
router.delete('/:id/images/:imageIndex', async (req, res) => {
  try {
    const { id, imageIndex } = req.params;
    const index = parseInt(imageIndex);
    
    console.log(`🗑️ Deleting image ${index} from product ${id}`);
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    if (index < 0 || index >= product.images.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image index'
      });
    }
    
    // Don't allow deleting the last image
    if (product.images.length === 1) {
      return res.status(400).json({
        success: false,
        message: 'Products must have at least one image.'
      });
    }
    
    const imageToDelete = product.images[index];
    
    // Delete from Cloudinary
    if (imageToDelete.public_id) {
      try {
        await deleteCloudinaryImage(imageToDelete.public_id);
        console.log('✅ Image deleted from Cloudinary:', imageToDelete.public_id);
      } catch (cloudinaryError) {
        console.error('❌ Error deleting from Cloudinary:', cloudinaryError);
        // Continue anyway - don't fail the entire operation
      }
    }
    
    // Remove from product
    product.images.splice(index, 1);
    
    // Update main image if we deleted the first image
    if (index === 0 && product.images.length > 0) {
      product.mainImage = product.images[0].url;
      product.product_image = product.images[0].url;
    }
    
    product.updatedBy = req.user._id;
    await product.save();
    
    console.log('✅ Image deleted successfully from product');
    
    res.json({
      success: true,
      message: 'Image deleted successfully',
      data: product
    });
    
  } catch (error) {
    console.error('❌ Error deleting image:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error: error.message
    });
  }
});

// @route   DELETE /api/admin/products/:id
// @desc    Delete product
// @access  Private (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    console.log(`🗑️ Deleting product: ${req.params.id}`);
    console.log('👤 Admin user:', req.user?.email);
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    console.log(`📦 Deleting product: ${product.product_name}`);
    
    // Delete all images from Cloudinary
    if (product.images && product.images.length > 0) {
      console.log('🖼️ Deleting product images from Cloudinary...');
      for (const image of product.images) {
        if (image.public_id) {
          try {
            await deleteCloudinaryImage(image.public_id);
            console.log('✅ Deleted image:', image.public_id);
          } catch (cloudinaryError) {
            console.error('❌ Error deleting image from Cloudinary:', cloudinaryError);
          }
        }
      }
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    console.log('✅ Product deleted successfully:', req.params.id);
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
});

// Error handling middleware
router.use(handleUploadError);

export default router;