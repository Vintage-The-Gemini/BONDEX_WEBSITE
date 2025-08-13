// backend/controllers/adminProductController.js
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import cloudinary from '../config/cloudinary.js';
import mongoose from 'mongoose';

// Helper function to generate unique slug
const generateUniqueSlug = async (name, productId = null) => {
  let baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const query = { slug };
    if (productId) {
      query._id = { $ne: productId };
    }
    
    const existingProduct = await Product.findOne(query);
    if (!existingProduct) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

// Helper function to validate and convert category IDs
const validateAndConvertCategories = async (categoryId, secondaryIds = []) => {
  // Validate primary category
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new Error('Invalid primary category ID');
  }
  
  const primaryCategory = await Category.findById(categoryId);
  if (!primaryCategory) {
    throw new Error('Primary category not found');
  }
  
  // Validate secondary categories
  const validSecondaryIds = [];
  if (Array.isArray(secondaryIds) && secondaryIds.length > 0) {
    for (const id of secondaryIds) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const category = await Category.findById(id);
        if (category) {
          validSecondaryIds.push(id);
        } else {
          console.warn(`⚠️ Secondary category not found: ${id}`);
        }
      } else {
        console.warn(`⚠️ Invalid secondary category ID: ${id}`);
      }
    }
  }
  
  return {
    primaryCategory: categoryId,
    secondaryCategories: validSecondaryIds,
    allCategories: [categoryId, ...validSecondaryIds]
  };
};

// @desc    Create new product
// @route   POST /api/admin/products
// @access  Private (Admin only)
export const createAdminProduct = async (req, res) => {
  try {
    console.log('🎯 Creating new product...');
    console.log('👤 Admin user:', req.user?.email);
    console.log('📝 Request body fields:', Object.keys(req.body));
    console.log('📷 Uploaded files:', req.files?.length || 0);

    // Extract and validate required fields
    const {
      product_name,
      product_description,
      product_brand,
      category, // Frontend sends 'category' (primary)
      industries, // Frontend sends 'industries' (secondary)
      product_price,
      stock,
      lowStockThreshold = 10,
      isOnSale = false,
      salePrice,
      saleStartDate,
      saleEndDate,
      status = 'active',
      isFeatured = false,
      isNewArrival = false,
      metaTitle,
      metaDescription,
      keywords,
      features,
      specifications,
      tags,
      certifications,
      complianceStandards
    } = req.body;

    // 🔍 DEBUG: Log the received data
    console.log('📊 Received product data:', {
      product_name,
      category,
      industries: typeof industries === 'string' ? JSON.parse(industries || '[]') : industries,
      product_price,
      stock
    });

    // ✅ VALIDATION: Required fields
    if (!product_name?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required'
      });
    }

    if (!product_description?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product description is required'
      });
    }

    if (!actualPrimaryCategory) {
      return res.status(400).json({
        success: false,
        message: 'Primary category (protection type) is required',
        debug: {
          receivedPrimaryCategory: primaryCategory,
          receivedCategory: category,
          finalValue: actualPrimaryCategory
        }
      });
    }

    if (!product_price || parseFloat(product_price) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid product price is required'
      });
    }

    if (stock === undefined || parseInt(stock) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid stock quantity is required'
      });
    }

    // ✅ CHECK FOR EXISTING PRODUCT BY NAME (case insensitive)
    const existingProduct = await Product.findOne({
      product_name: { $regex: new RegExp(`^${product_name.trim()}$`, 'i') }
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: `Product with name "${product_name}" already exists. Please use a different name.`,
        suggestion: `Try: "${product_name} - ${new Date().getFullYear()}" or "${product_name} - ${product_brand || 'New Model'}"`
      });
    }

    // ✅ GENERATE UNIQUE SLUG
    const uniqueSlug = await generateUniqueSlug(product_name);
    console.log('🔗 Generated unique slug:', uniqueSlug);

    // ✅ VALIDATE AND CONVERT CATEGORIES - FIXED
    const parsedSecondaryCategories = (() => {
      if (typeof actualSecondaryCategories === 'string') {
        try {
          return JSON.parse(actualSecondaryCategories || '[]');
        } catch {
          return actualSecondaryCategories.split(',').filter(Boolean);
        }
      }
      return Array.isArray(actualSecondaryCategories) ? actualSecondaryCategories : [];
    })();

    const categoryData = await validateAndConvertCategories(actualPrimaryCategory, parsedSecondaryCategories);
    console.log('📂 Category validation result:', categoryData);

    // ✅ HANDLE IMAGE UPLOADS
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      console.log('📷 Processing image uploads...');
      
      for (const file of req.files) {
        try {
          console.log(`🔄 Uploading image: ${file.originalname}`);
          
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'safety-equipment/products',
            transformation: [
              { width: 800, height: 800, crop: 'limit', quality: 'auto:good' },
              { format: 'auto' }
            ]
          });

          uploadedImages.push({
            url: result.secure_url,
            public_id: result.public_id,
            alt: `${product_name} - Product Image`,
            isMain: uploadedImages.length === 0 // First image is main
          });

          console.log(`✅ Image uploaded: ${result.public_id}`);
        } catch (uploadError) {
          console.error(`❌ Image upload failed for ${file.originalname}:`, uploadError);
          throw new Error(`Failed to upload image: ${file.originalname}`);
        }
      }
    }

    if (uploadedImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one product image is required'
      });
    }

    const parseArrayField = (field, fieldName) => {
      if (!field) return [];
      if (Array.isArray(field)) return field.filter(item => item?.trim());
      if (typeof field === 'string') {
        try {
          const parsed = JSON.parse(field);
          return Array.isArray(parsed) ? parsed.filter(item => item?.trim()) : [];
        } catch {
          return field.split(',').map(item => item.trim()).filter(Boolean);
        }
      }
      return [];
    };

    const parseSpecifications = (spec) => {
      if (!spec) return {};
      if (typeof spec === 'object' && !Array.isArray(spec)) return spec;
      if (typeof spec === 'string') {
        try {
          const parsed = JSON.parse(spec);
          if (Array.isArray(parsed)) {
            // Convert array format [{key, value}] to object
            return parsed.reduce((acc, item) => {
              if (item && item.key && item.value) {
                acc[item.key] = item.value;
              }
              return acc;
            }, {});
          }
          return parsed;
        } catch {
          // Handle comma-separated format "key:value,key2:value2"
          return spec.split(',').reduce((acc, item) => {
            const [key, value] = item.split(':').map(s => s?.trim());
            if (key && value) {
              acc[key] = value;
            }
            return acc;
          }, {});
        }
      }
      return {};
    };

    // ✅ CREATE PRODUCT DATA
    const productData = {
      // Basic Information
      product_name: product_name.trim(),
      product_description: product_description.trim(),
      product_brand: product_brand?.trim() || '',
      slug: uniqueSlug,

      // Categories (mapped from frontend fields)
      primaryCategory: categoryData.primaryCategory,
      secondaryCategories: categoryData.secondaryCategories,
      allCategories: categoryData.allCategories,
      category: categoryData.primaryCategory, // Legacy field

      // Pricing & Inventory
      product_price: parseFloat(product_price),
      stock: parseInt(stock),
      lowStockThreshold: parseInt(lowStockThreshold),

      // Sale Configuration
      isOnSale: isOnSale === 'true' || isOnSale === true,
      ...(salePrice && { salePrice: parseFloat(salePrice) }),
      ...(saleStartDate && { saleStartDate: new Date(saleStartDate) }),
      ...(saleEndDate && { saleEndDate: new Date(saleEndDate) }),

      // Status & Features
      status,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isNewArrival: isNewArrival === 'true' || isNewArrival === true,

      // Images
      images: uploadedImages,
      mainImage: uploadedImages[0]?.url || '',
      product_image: uploadedImages[0]?.url || '',

      // SEO Fields
      metaTitle: metaTitle?.trim() || product_name,
      metaDescription: metaDescription?.trim() || product_description.substring(0, 160),
      keywords: parseArrayField(keywords, 'keywords'),

      // Product Details
      features: parseArrayField(features, 'features'),
      specifications: parseSpecifications(specifications),
      tags: parseArrayField(tags, 'tags'),
      certifications: parseArrayField(certifications, 'certifications'),
      complianceStandards: parseArrayField(complianceStandards, 'complianceStandards'),

      // Metadata
      createdBy: req.user._id,
      lastUpdatedBy: req.user._id
    };

    console.log('💾 Creating product with data:', {
      name: productData.product_name,
      slug: productData.slug,
      primaryCategory: productData.primaryCategory,
      secondaryCategories: productData.secondaryCategories,
      images: productData.images.length
    });

    // ✅ CREATE PRODUCT
    const product = new Product(productData);
    await product.save();

    // ✅ POPULATE REFERENCES FOR RESPONSE
    const populatedProduct = await Product.findById(product._id)
      .populate('primaryCategory', 'name slug type icon')
      .populate('secondaryCategories', 'name slug type icon')
      .populate('createdBy', 'email firstName lastName');

    console.log('✅ Product created successfully:', populatedProduct.product_name);

    res.status(201).json({
      success: true,
      message: '🎯 Product created successfully with multi-category targeting!',
      data: populatedProduct,
      stats: {
        totalCategories: parsedSecondaryCategories.length + 1,
        seoOptimized: !!(productData.metaTitle && productData.metaDescription),
        imagesUploaded: uploadedImages.length,
        discoveryPaths: parsedSecondaryCategories.length + 1
      }
    });

  } catch (error) {
    console.error('❌ PRODUCT CREATION ERROR:', error);
    
    // Clean up uploaded images if product creation fails
    if (req.files && req.files.length > 0) {
      console.log('🧹 Cleaning up uploaded images...');
      for (const file of req.files) {
        try {
          if (file.filename) {
            await cloudinary.uploader.destroy(file.filename);
            console.log('🗑️ Cleaned up image:', file.filename);
          }
        } catch (cleanupError) {
          console.error('❌ Image cleanup error:', cleanupError);
        }
      }
    }

    // Handle specific error types
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Database validation error',
        errors: messages,
        details: error.errors
      });
    }

    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      const duplicateValue = error.keyValue[duplicateField];
      
      return res.status(400).json({
        success: false,
        message: `Product with ${duplicateField} "${duplicateValue}" already exists. Please use a different ${duplicateField}.`,
        field: duplicateField,
        value: duplicateValue,
        suggestion: duplicateField === 'product_name' 
          ? `Try: "${duplicateValue} - ${new Date().getFullYear()}" or add model/version number`
          : `Try modifying the ${duplicateField}`
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create product',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Get all admin products
// @route   GET /api/admin/products
// @access  Private (Admin only)
export const getAdminProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured,
      lowStock
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (category) {
      filter.allCategories = category;
    }
    
    if (search) {
      filter.$or = [
        { product_name: { $regex: search, $options: 'i' } },
        { product_description: { $regex: search, $options: 'i' } },
        { product_brand: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (featured === 'true') {
      filter.isFeatured = true;
    }
    
    if (lowStock === 'true') {
      filter.$expr = { $lte: ['$stock', '$lowStockThreshold'] };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('primaryCategory', 'name slug type icon')
        .populate('secondaryCategories', 'name slug type icon')
        .populate('createdBy', 'email firstName lastName')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total,
        hasNext: skip + products.length < total,
        hasPrev: parseInt(page) > 1
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
};

// @desc    Get single admin product
// @route   GET /api/admin/products/:id
// @access  Private (Admin only)
export const getAdminProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('primaryCategory', 'name slug type icon')
      .populate('secondaryCategories', 'name slug type icon')
      .populate('createdBy', 'email firstName lastName')
      .populate('lastUpdatedBy', 'email firstName lastName');

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
    console.error('❌ Error fetching admin product:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// ... (other controller methods remain the same)

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private (Admin only)
export const updateAdminProduct = async (req, res) => {
  try {
    console.log('🔄 Updating product:', req.params.id);
    console.log('👤 Admin user:', req.user?.email);
    console.log('📝 Update data:', Object.keys(req.body));

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Handle image uploads if present
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      console.log('📷 Processing image uploads for update...');
      
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'safety-equipment/products',
            transformation: [
              { width: 800, height: 800, crop: 'limit', quality: 'auto:good' },
              { format: 'auto' }
            ]
          });

          uploadedImages.push({
            url: result.secure_url,
            public_id: result.public_id,
            alt: `${req.body.product_name || product.product_name} - Product Image`,
            isMain: uploadedImages.length === 0
          });

          console.log(`✅ Image uploaded: ${result.public_id}`);
        } catch (uploadError) {
          console.error(`❌ Image upload failed:`, uploadError);
          throw new Error(`Failed to upload image: ${file.originalname}`);
        }
      }
    }

    // Prepare update data
    const updateData = { ...req.body };
    
    // Handle categories if provided
    if (req.body.category) {
      updateData.primaryCategory = req.body.category;
    }
    if (req.body.industries) {
      const parsedSecondaryCategories = typeof req.body.industries === 'string' 
        ? JSON.parse(req.body.industries || '[]') 
        : (Array.isArray(req.body.industries) ? req.body.industries : []);
      updateData.secondaryCategories = parsedSecondaryCategories;
    }

    // Add uploaded images to existing images
    if (uploadedImages.length > 0) {
      updateData.images = [...(product.images || []), ...uploadedImages];
      updateData.mainImage = uploadedImages[0].url;
      updateData.product_image = uploadedImages[0].url;
    }

    // Update slug if name changed
    if (req.body.product_name && req.body.product_name !== product.product_name) {
      updateData.slug = await generateUniqueSlug(req.body.product_name, req.params.id);
    }

    updateData.lastUpdatedBy = req.user._id;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true,
        runValidators: true
      }
    ).populate('primaryCategory', 'name slug type icon')
     .populate('secondaryCategories', 'name slug type icon');

    console.log('✅ Product updated successfully:', updatedProduct.product_name);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });

  } catch (error) {
    console.error('❌ Update Product Error:', error);
    
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
        message: 'Invalid product ID'
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
export const deleteAdminProduct = async (req, res) => {
  try {
    console.log('🗑️ Deleting product:', req.params.id);
    console.log('👤 Admin user:', req.user?.email);

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      console.log('🧹 Cleaning up product images...');
      for (const image of product.images) {
        try {
          if (image.public_id) {
            await cloudinary.uploader.destroy(image.public_id);
            console.log('🗑️ Deleted image:', image.public_id);
          }
        } catch (deleteError) {
          console.error('❌ Image deletion error:', deleteError);
        }
      }
    }

    // Delete the product
    await Product.findByIdAndDelete(req.params.id);

    console.log('✅ Product deleted successfully:', product.product_name);

    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: { id: req.params.id }
    });

  } catch (error) {
    console.error('❌ Delete Product Error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// ✅ EXPORT ALIASES FOR ROUTES (matching what routes expect)
export { createAdminProduct as createProduct };
export { getAdminProducts as getProducts }; 
export { getAdminProduct as getProduct };
export { updateAdminProduct as updateProduct };
export { deleteAdminProduct as deleteProduct };