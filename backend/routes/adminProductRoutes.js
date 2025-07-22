// backend/routes/adminProductRoutes.js
import express from 'express';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { 
  uploadProductImage, 
  handleUploadError, 
  validateProductImages,
  logUploadActivity,
  deleteCloudinaryImage 
} from '../middleware/upload.js';

const router = express.Router();

// @route   GET /api/admin/products
// @desc    Get all products for admin (with drafts, inactive, etc.)
// @access  Private (Admin only)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    // Status filter (admin can see all statuses)
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    // Category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    // Search filter
    if (req.query.search) {
      filter.$or = [
        { product_name: { $regex: req.query.search, $options: 'i' } },
        { product_description: { $regex: req.query.search, $options: 'i' } },
        { product_brand: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Low stock filter
    if (req.query.lowStock === 'true') {
      filter.$expr = { $lte: ['$stock', '$lowStockThreshold'] };
    }
    
    // Out of stock filter
    if (req.query.outOfStock === 'true') {
      filter.stock = 0;
    }
    
    // Sort options
    let sortOption = {};
    switch (req.query.sort) {
      case 'name_asc':
        sortOption = { product_name: 1 };
        break;
      case 'name_desc':
        sortOption = { product_name: -1 };
        break;
      case 'price_asc':
        sortOption = { product_price: 1 };
        break;
      case 'price_desc':
        sortOption = { product_price: -1 };
        break;
      case 'stock_asc':
        sortOption = { stock: 1 };
        break;
      case 'stock_desc':
        sortOption = { stock: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    // Execute query with population
    const products = await Product.find(filter)
      .populate('category', 'name slug type')
      .sort(sortOption)
      .limit(limit)
      .skip(skip)
      .exec();
    
    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    
    res.json({
      success: true,
      data: products,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: products.length,
        totalProducts: total
      },
      filters: {
        status: req.query.status,
        category: req.query.category,
        search: req.query.search,
        sort: req.query.sort
      }
    });
    
  } catch (error) {
    console.error('Error fetching admin products:', error);
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
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug type description');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
    
  } catch (error) {
    console.error('Error fetching product:', error);
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
      console.log('Creating product with data:', req.body);
      console.log('Uploaded files:', req.files?.length || 0);
      
      const {
        product_name,
        product_description,
        product_brand,
        category,
        product_price,
        stock,
        status,
        isOnSale,
        isFeatured,
        salePrice,
        saleEndDate,
        metaTitle,
        metaDescription,
        tags,
        lowStockThreshold,
        specifications
      } = req.body;
      
      // Validation
      if (!product_name || !product_description || !product_price || !category) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields: product_name, product_description, product_price, category'
        });
      }
      
      // Validate price
      const price = parseFloat(product_price);
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Product price must be a valid positive number'
        });
      }
      
      // Validate stock
      const stockQuantity = parseInt(stock) || 0;
      if (stockQuantity < 0) {
        return res.status(400).json({
          success: false,
          message: 'Stock quantity cannot be negative'
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
      
      // Validate sale price if on sale
      if (isOnSale === 'true' || isOnSale === true) {
        const salePriceNum = parseFloat(salePrice);
        if (isNaN(salePriceNum) || salePriceNum <= 0) {
          return res.status(400).json({
            success: false,
            message: 'Valid sale price is required when product is on sale'
          });
        }
        if (salePriceNum >= price) {
          return res.status(400).json({
            success: false,
            message: 'Sale price must be less than regular price'
          });
        }
      }
      
      // Process uploaded images from Cloudinary
      let imageArray = [];
      if (req.files && req.files.length > 0) {
        imageArray = req.files.map(file => ({
          url: file.path, // Cloudinary URL
          public_id: file.filename, // Cloudinary public_id
          alt: `${product_name} - Product Image`
        }));
      }
      
      // Parse tags if they're sent as a string
      let parsedTags = [];
      if (tags) {
        if (typeof tags === 'string') {
          try {
            parsedTags = JSON.parse(tags);
          } catch (e) {
            parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
          }
        } else if (Array.isArray(tags)) {
          parsedTags = tags;
        }
      }
      
      // Parse specifications if provided
      let parsedSpecifications = {};
      if (specifications) {
        if (typeof specifications === 'string') {
          try {
            parsedSpecifications = JSON.parse(specifications);
          } catch (e) {
            console.log('Could not parse specifications, using empty object');
          }
        } else if (typeof specifications === 'object') {
          parsedSpecifications = specifications;
        }
      }
      
      // Create product data object
      const productData = {
        product_name: product_name.trim(),
        product_description: product_description.trim(),
        product_brand: product_brand?.trim() || '',
        category,
        product_price: price,
        stock: stockQuantity,
        status: status || 'active',
        isOnSale: isOnSale === 'true' || isOnSale === true,
        isFeatured: isFeatured === 'true' || isFeatured === true,
        salePrice: (isOnSale === 'true' || isOnSale === true) ? parseFloat(salePrice) : null,
        saleEndDate: saleEndDate ? new Date(saleEndDate) : null,
        images: imageArray,
        mainImage: imageArray.length > 0 ? imageArray[0].url : '',
        product_image: imageArray.length > 0 ? imageArray[0].url : '', // For backward compatibility
        metaTitle: metaTitle || product_name.trim(),
        metaDescription: metaDescription || product_description.trim().substring(0, 160),
        tags: parsedTags,
        lowStockThreshold: parseInt(lowStockThreshold) || 10,
        specifications: parsedSpecifications
      };
      
      console.log('Creating product with processed data:', {
        ...productData,
        images: `${productData.images.length} images`
      });
      
      // Create the product
      const product = new Product(productData);
      const savedProduct = await product.save();
      
      // Populate the response
      const populatedProduct = await Product.findById(savedProduct._id)
        .populate('category', 'name slug type');
      
      console.log('✅ Product created successfully:', populatedProduct._id);
      
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: populatedProduct
      });
      
    } catch (error) {
      console.error('❌ Error creating product:', error);
      
      // Clean up uploaded images on error if they exist
      if (req.files && req.files.length > 0) {
        console.log('Cleaning up uploaded images due to error...');
        req.files.forEach(async (file) => {
          try {
            await deleteCloudinaryImage(file.filename);
          } catch (cleanupError) {
            console.error('Error cleaning up image:', cleanupError);
          }
        });
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
      
      // Handle duplicate errors
      if (error.code === 11000) {
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
  }
);

// @route   PUT /api/admin/products/:id
// @desc    Update product with optional new images
// @access  Private (Admin only)
router.put('/:id', 
  uploadProductImage.array('images', 5),
  logUploadActivity,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      console.log('Updating product:', req.params.id);
      console.log('New files uploaded:', req.files?.length || 0);
      
      const {
        product_name,
        product_description,
        product_brand,
        category,
        product_price,
        stock,
        status,
        isOnSale,
        isFeatured,
        salePrice,
        saleEndDate,
        metaTitle,
        metaDescription,
        tags,
        lowStockThreshold,
        specifications,
        existingImages
      } = req.body;
      
      // Handle existing images
      let currentImages = [];
      if (existingImages) {
        try {
          currentImages = typeof existingImages === 'string' 
            ? JSON.parse(existingImages) 
            : existingImages;
        } catch (e) {
          currentImages = product.images || [];
        }
      } else {
        currentImages = product.images || [];
      }
      
      // Handle new uploaded images
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => ({
          url: file.path,
          public_id: file.filename,
          alt: `${product_name || product.product_name} - Product Image`
        }));
        
        // Combine existing and new images
        currentImages = [...currentImages, ...newImages];
        
        // Limit to maximum 5 images
        if (currentImages.length > 5) {
          currentImages = currentImages.slice(0, 5);
        }
      }
      
      // Parse tags
      let parsedTags = product.tags || [];
      if (tags) {
        if (typeof tags === 'string') {
          try {
            parsedTags = JSON.parse(tags);
          } catch (e) {
            parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
          }
        } else if (Array.isArray(tags)) {
          parsedTags = tags;
        }
      }
      
      // Parse specifications
      let parsedSpecifications = product.specifications || {};
      if (specifications) {
        if (typeof specifications === 'string') {
          try {
            parsedSpecifications = JSON.parse(specifications);
          } catch (e) {
            console.log('Could not parse specifications, keeping existing');
          }
        } else if (typeof specifications === 'object') {
          parsedSpecifications = specifications;
        }
      }
      
      // Update fields (only update if provided)
      const updateData = {};
      
      if (product_name) updateData.product_name = product_name.trim();
      if (product_description) updateData.product_description = product_description.trim();
      if (product_brand !== undefined) updateData.product_brand = product_brand.trim();
      if (category) updateData.category = category;
      if (product_price !== undefined) {
        const price = parseFloat(product_price);
        if (isNaN(price) || price <= 0) {
          return res.status(400).json({
            success: false,
            message: 'Product price must be a valid positive number'
          });
        }
        updateData.product_price = price;
      }
      if (stock !== undefined) {
        const stockQuantity = parseInt(stock);
        if (stockQuantity < 0) {
          return res.status(400).json({
            success: false,
            message: 'Stock quantity cannot be negative'
          });
        }
        updateData.stock = stockQuantity;
      }
      if (status) updateData.status = status;
      if (isOnSale !== undefined) updateData.isOnSale = isOnSale === 'true' || isOnSale === true;
      if (isFeatured !== undefined) updateData.isFeatured = isFeatured === 'true' || isFeatured === true;
      if (salePrice !== undefined) updateData.salePrice = parseFloat(salePrice) || null;
      if (saleEndDate) updateData.saleEndDate = new Date(saleEndDate);
      if (metaTitle) updateData.metaTitle = metaTitle.trim();
      if (metaDescription) updateData.metaDescription = metaDescription.trim();
      if (lowStockThreshold !== undefined) updateData.lowStockThreshold = parseInt(lowStockThreshold) || 10;
      
      // Always update these
      updateData.images = currentImages;
      updateData.mainImage = currentImages.length > 0 ? currentImages[0].url : '';
      updateData.product_image = currentImages.length > 0 ? currentImages[0].url : '';
      updateData.tags = parsedTags;
      updateData.specifications = parsedSpecifications;
      updateData.updatedAt = new Date();
      
      // Validate sale price if on sale
      if (updateData.isOnSale && updateData.salePrice) {
        const currentPrice = updateData.product_price || product.product_price;
        if (updateData.salePrice >= currentPrice) {
          return res.status(400).json({
            success: false,
            message: 'Sale price must be less than regular price'
          });
        }
      }
      
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate('category', 'name slug type');
      
      console.log('✅ Product updated successfully:', updatedProduct._id);
      
      res.json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
      });
      
    } catch (error) {
      console.error('❌ Error updating product:', error);
      
      // Clean up newly uploaded images on error
      if (req.files && req.files.length > 0) {
        console.log('Cleaning up uploaded images due to error...');
        req.files.forEach(async (file) => {
          try {
            await deleteCloudinaryImage(file.filename);
          } catch (cleanupError) {
            console.error('Error cleaning up image:', cleanupError);
          }
        });
      }
      
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
  }
);

// @route   DELETE /api/admin/products/:id/images/:imageIndex
// @desc    Delete specific product image
// @access  Private (Admin only)
router.delete('/:id/images/:imageIndex', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const imageIndex = parseInt(req.params.imageIndex);
    
    if (imageIndex < 0 || imageIndex >= product.images.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image index'
      });
    }
    
    if (product.images.length <= 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete the last image. Products must have at least one image.'
      });
    }
    
    const imageToDelete = product.images[imageIndex];
    
    // Delete from Cloudinary
    if (imageToDelete.public_id) {
      try {
        await deleteCloudinaryImage(imageToDelete.public_id);
        console.log('✅ Image deleted from Cloudinary:', imageToDelete.public_id);
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Continue anyway - don't fail the entire operation
      }
    }
    
    // Remove from product
    product.images.splice(imageIndex, 1);
    
    // Update main image if we deleted the first image
    if (imageIndex === 0 && product.images.length > 0) {
      product.mainImage = product.images[0].url;
      product.product_image = product.images[0].url;
    }
    
    await product.save();
    
    res.json({
      success: true,
      message: 'Image deleted successfully',
      data: product
    });
    
  } catch (error) {
    console.error('Error deleting image:', error);
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
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Delete all images from Cloudinary
    if (product.images && product.images.length > 0) {
      console.log('Deleting product images from Cloudinary...');
      for (const image of product.images) {
        if (image.public_id) {
          try {
            await deleteCloudinaryImage(image.public_id);
            console.log('✅ Deleted image:', image.public_id);
          } catch (cloudinaryError) {
            console.error('Error deleting image from Cloudinary:', cloudinaryError);
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
    console.error('Error deleting product:', error);
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