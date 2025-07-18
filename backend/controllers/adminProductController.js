// backend/controllers/adminProductController.js
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get all products for admin (includes inactive)
// @route   GET /api/admin/products
// @access  Private (Admin only)
export const getAdminProducts = async (req, res) => {
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

    // Filter by brand
    if (req.query.brand) {
      query.product_brand = req.query.brand;
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

    // Price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.product_price = {};
      if (req.query.minPrice) {
        query.product_price.$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.product_price.$lte = Number(req.query.maxPrice);
      }
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
      case 'stock_high':
        sortBy.stock = -1;
        break;
      case 'oldest':
        sortBy.createdAt = 1;
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

    // Get categories for filter options
    const categories = await Category.find({ type: 'protection_type', status: 'active' })
      .select('name')
      .sort({ name: 1 });

    // Get brands for filter options
    const brands = await Product.distinct('product_brand', { product_brand: { $ne: null, $ne: '' } });

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages,
      currentPage: page,
      data: products,
      filters: {
        categories: categories.map(cat => cat.name),
        brands: brands.sort()
      }
    });

  } catch (error) {
    console.error('Get Admin Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// @desc    Get single product for admin
// @route   GET /api/admin/products/:id
// @access  Private (Admin only)
export const getAdminProduct = async (req, res) => {
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
};

// @desc    Create new product
// @route   POST /api/admin/products
// @access  Private (Admin only)
export const createProduct = async (req, res) => {
  try {
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
      metaTitle,
      metaDescription,
      keywords
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
      isFeatured: isFeatured === 'true' || isFeatured === true,
      metaTitle: metaTitle || product_name,
      metaDescription: metaDescription || product_description,
      keywords: keywords ? (Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim())) : []
    };

    // Add features if provided
    if (features) {
      productData.features = Array.isArray(features) ? features : features.split(',').map(f => f.trim());
    }

    // Add specifications if provided
    if (specifications) {
      productData.specifications = typeof specifications === 'object' ? specifications : {};
    }

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

    // Handle duplicate slug error
    if (error.code === 11000 && error.keyPattern?.slug) {
      return res.status(400).json({
        success: false,
        message: 'Product with similar name already exists'
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
// @route   PUT /api/admin/products/:id
// @access  Private (Admin only)
export const updateProduct = async (req, res) => {
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
      features,
      specifications,
      status,
      isOnSale,
      isFeatured,
      metaTitle,
      metaDescription,
      keywords
    } = req.body;

    // Update basic fields
    if (product_name) {
      product.product_name = product_name;
      // Regenerate slug if name changed
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
    if (metaTitle) product.metaTitle = metaTitle;
    if (metaDescription) product.metaDescription = metaDescription;

    // Update features
    if (features) {
      product.features = Array.isArray(features) ? features : features.split(',').map(f => f.trim());
    }

    // Update specifications
    if (specifications) {
      product.specifications = typeof specifications === 'object' ? specifications : {};
    }

    // Update keywords
    if (keywords) {
      product.keywords = Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim());
    }

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      if (product.images && product.images.length > 0) {
        for (const image of product.images) {
          if (image.public_id) {
            try {
              await deleteFromCloudinary(image.public_id);
            } catch (deleteError) {
              console.error('Error deleting old image:', deleteError);
            }
          }
        }
      }

      // Add new images
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
// @route   DELETE /api/admin/products/:id
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

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        if (image.public_id) {
          try {
            await deleteFromCloudinary(image.public_id);
          } catch (deleteError) {
            console.error('Error deleting image:', deleteError);
          }
        }
      }
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

// @desc    Bulk update products
// @route   PUT /api/admin/products/bulk
// @access  Private (Admin only)
export const bulkUpdateProducts = async (req, res) => {
  try {
    const { productIds, updates } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required'
      });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Updates object is required'
      });
    }

    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: updates }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} products updated successfully`,
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      }
    });

  } catch (error) {
    console.error('Bulk Update Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating products',
      error: error.message
    });
  }
};

// @desc    Duplicate product
// @route   POST /api/admin/products/:id/duplicate
// @access  Private (Admin only)
export const duplicateProduct = async (req, res) => {
  try {
    const originalProduct = await Product.findById(req.params.id);

    if (!originalProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Create duplicate data
    const duplicateData = originalProduct.toObject();
    delete duplicateData._id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    delete duplicateData.__v;

    // Modify name and slug for duplicate
    duplicateData.product_name = `${duplicateData.product_name} (Copy)`;
    duplicateData.slug = `${duplicateData.slug}-copy-${Date.now()}`;
    duplicateData.status = 'inactive'; // Set as inactive by default

    const duplicateProduct = await Product.create(duplicateData);

    res.status(201).json({
      success: true,
      message: 'Product duplicated successfully',
      data: duplicateProduct
    });

  } catch (error) {
    console.error('Duplicate Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error duplicating product',
      error: error.message
    });
  }
};