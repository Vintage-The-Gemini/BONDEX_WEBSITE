// File Path: backend/controllers/adminProductController.js
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

// Helper function to validate and convert categories
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
export const createProduct = async (req, res) => {
  try {
    console.log('🎯 Creating new product...');
    console.log('👤 Admin user:', req.user?.email);
    console.log('📝 Request body fields:', Object.keys(req.body));
    console.log('📷 Uploaded files:', req.files?.length || 0);
    
    // 🔍 DEBUG: Log all received data
    console.log('📊 FULL REQUEST DATA:');
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Files:', req.files?.map(f => ({ 
      name: f.originalname, 
      size: f.size, 
      path: f.path,
      filename: f.filename
    })));

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

    console.log('📋 EXTRACTED FIELDS:');
    console.log('- product_name:', product_name);
    console.log('- category:', category);
    console.log('- industries:', industries);
    console.log('- metaTitle:', metaTitle);
    console.log('- metaTitle length:', metaTitle?.length || 0);

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

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Primary category (protection type) is required'
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

    // 🔧 FIX META TITLE LENGTH - Ensure it's never over 50 characters
    let finalMetaTitle = metaTitle;
    if (!finalMetaTitle || finalMetaTitle.length > 50) {
      // Generate a safe meta title
      finalMetaTitle = product_name.length > 30 
        ? `${product_name.substring(0, 30)}... - Bondex`
        : `${product_name} - Bondex`;
    }
    
    console.log('🏷️ FINAL META TITLE:', finalMetaTitle, '(Length:', finalMetaTitle.length, ')');

    // ✅ CHECK FOR EXISTING PRODUCT BY NAME
    const existingProduct = await Product.findOne({
      product_name: { $regex: new RegExp(`^${product_name.trim()}$`, 'i') }
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: `Product with name "${product_name}" already exists.`,
        suggestion: `Try: "${product_name} - ${new Date().getFullYear()}"`
      });
    }

    // ✅ VALIDATE CATEGORIES
    const secondaryCategories = industries ? 
      (typeof industries === 'string' ? JSON.parse(industries) : industries) : 
      [];
    
    console.log('📂 PROCESSING CATEGORIES:');
    console.log('- Primary (category):', category);
    console.log('- Secondary (industries):', secondaryCategories);
    
    const categoryData = await validateAndConvertCategories(category, secondaryCategories);
    console.log('✅ Category validation result:', categoryData);

    // ✅ GENERATE UNIQUE SLUG
    const slug = await generateUniqueSlug(product_name);
    console.log('🔗 Generated slug:', slug);

    // 🔧 FIX IMAGE PROCESSING - Use multer+cloudinary uploaded files properly
    console.log('📸 PROCESSING IMAGES...');
    let productImages = [];
    
    if (req.files && req.files.length > 0) {
      console.log(`Found ${req.files.length} uploaded files`);
      
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        console.log(`Processing file ${i + 1}:`, {
          originalname: file.originalname,
          filename: file.filename,
          path: file.path,
          size: file.size
        });
        
        // 🔧 FIX: Use correct field names that match Product model
        const imageData = {
          url: file.path,          // Cloudinary URL from multer
          public_id: file.filename, // 🔧 FIX: Use 'public_id' not 'publicId'
          alt: `${product_name} - Image ${i + 1}`,
          isMain: i === 0          // First image is main
        };
        
        console.log('📷 Image data created:', imageData);
        productImages.push(imageData);
      }
    }

    // ✅ VALIDATE: At least one image is required
    if (productImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one product image is required'
      });
    }

    console.log('✅ Final image array:', productImages);

    // ✅ PARSE ARRAY FIELDS
    const parseArrayField = (field) => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      try {
        return JSON.parse(field);
      } catch {
        return typeof field === 'string' ? field.split(',').map(item => item.trim()) : [];
      }
    };

    // ✅ CREATE PRODUCT OBJECT
    const productData = {
      product_name: product_name.trim(),
      product_description: product_description.trim(),
      product_brand: product_brand?.trim() || '',
      slug,
      primaryCategory: categoryData.primaryCategory,
      secondaryCategories: categoryData.secondaryCategories,
      allCategories: categoryData.allCategories,
      product_price: parseFloat(product_price),
      stock: parseInt(stock),
      lowStockThreshold: parseInt(lowStockThreshold),
      images: productImages, // 🔧 FIX: Use processed image array
      status,
      isFeatured: isFeatured === true || isFeatured === 'true',
      isNewArrival: isNewArrival === true || isNewArrival === 'true',
      createdBy: req.user._id,
      
      // SEO fields - with fixed meta title
      metaTitle: finalMetaTitle, // 🔧 FIX: Use safe meta title
      metaDescription: metaDescription?.trim() || `${product_name} from Bondex Safety Kenya. Professional safety equipment.`,
      keywords: parseArrayField(keywords),
      
      // Optional fields
      features: parseArrayField(features),
      specifications: parseArrayField(specifications),
      tags: parseArrayField(tags),
      certifications: parseArrayField(certifications),
      complianceStandards: parseArrayField(complianceStandards),
      
      // Sale data
      isOnSale: isOnSale === true || isOnSale === 'true',
      ...(isOnSale && salePrice && {
        salePrice: parseFloat(salePrice),
        saleStartDate: saleStartDate ? new Date(saleStartDate) : new Date(),
        saleEndDate: saleEndDate ? new Date(saleEndDate) : null
      })
    };

    console.log('💾 FINAL PRODUCT DATA:');
    console.log('- Name:', productData.product_name);
    console.log('- Meta Title:', productData.metaTitle, '(Length:', productData.metaTitle.length, ')');
    console.log('- Images count:', productData.images.length);
    console.log('- Image details:', productData.images);

    // ✅ CREATE PRODUCT
    const product = await Product.create(productData);
    console.log('✅ Product created in database with ID:', product._id);

    // ✅ POPULATE AND RETURN
    const populatedProduct = await Product.findById(product._id)
      .populate('primaryCategory', 'name slug type icon')
      .populate('secondaryCategories', 'name slug type icon')
      .populate('createdBy', 'email firstName lastName');

    console.log(`✅ Product created successfully: ${product.product_name}`);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: populatedProduct,
      debug: {
        imageCount: productImages.length,
        metaTitleLength: finalMetaTitle.length,
        categoryCount: categoryData.allCategories.length
      }
    });

  } catch (error) {
    console.error('❌ PRODUCT CREATION ERROR:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    // Handle specific error types
    if (error.name === 'ValidationError') {
      console.error('📋 VALIDATION ERROR DETAILS:');
      const messages = Object.values(error.errors).map(err => {
        console.error(`- ${err.path}: ${err.message}`);
        return err.message;
      });
      
      return res.status(400).json({
        success: false,
        message: 'Product validation failed',
        errors: messages,
        details: error.errors
      });
    }

    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      const duplicateValue = error.keyValue[duplicateField];
      
      return res.status(400).json({
        success: false,
        message: `Product with this ${duplicateField} already exists.`,
        field: duplicateField,
        value: duplicateValue
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
      .populate('createdBy', 'email firstName lastName');

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
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// @desc    Update admin product
// @route   PUT /api/admin/products/:id
// @access  Private (Admin only)
export const updateAdminProduct = async (req, res) => {
  try {
    console.log(`🔄 Updating product ID: ${req.params.id}`);
    console.log('📝 Update data received:', req.body);
    
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
      industries,
      product_price,
      stock,
      lowStockThreshold,
      status,
      isFeatured,
      isNewArrival,
      sku
    } = req.body;

    // Validate categories if provided
    let categoryData = null;
    if (category) {
      const secondaryCategories = industries ? 
        (typeof industries === 'string' ? JSON.parse(industries) : industries) : 
        [];
      categoryData = await validateAndConvertCategories(category, secondaryCategories);
      console.log('📂 Updated category data:', categoryData);
    }

    // Build update object with only provided fields
    const updateData = {};
    
    if (product_name) {
      updateData.product_name = product_name.trim();
      updateData.slug = await generateUniqueSlug(product_name, product._id);
    }
    if (product_description) updateData.product_description = product_description.trim();
    if (product_brand !== undefined) updateData.product_brand = product_brand?.trim() || '';
    if (product_price !== undefined) updateData.product_price = parseFloat(product_price);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (lowStockThreshold !== undefined) updateData.lowStockThreshold = parseInt(lowStockThreshold);
    if (status) updateData.status = status;
    if (sku !== undefined) updateData.sku = sku?.trim() || '';
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured === true || isFeatured === 'true';
    if (isNewArrival !== undefined) updateData.isNewArrival = isNewArrival === true || isNewArrival === 'true';
    
    // Category updates
    if (categoryData) {
      updateData.primaryCategory = categoryData.primaryCategory;
      updateData.secondaryCategories = categoryData.secondaryCategories;
      updateData.allCategories = categoryData.allCategories;
    }

    updateData.updatedAt = new Date();
    updateData.lastUpdatedBy = req.user._id;

    console.log('💾 Final update data:', updateData);

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('primaryCategory', 'name slug type icon')
    .populate('secondaryCategories', 'name slug type icon')
    .populate('createdBy', 'email firstName lastName');

    console.log(`✅ Product updated: ${updatedProduct.product_name}`);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });

  } catch (error) {
    console.error('❌ Error updating product:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Product validation failed',
        errors: messages,
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// @desc    Delete admin product
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin only)
export const deleteAdminProduct = async (req, res) => {
  try {
    console.log(`🗑️ Deleting product ID: ${req.params.id}`);
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      console.log(`🗑️ Deleting ${product.images.length} images from Cloudinary...`);
      for (const image of product.images) {
        try {
          if (image.public_id) {
            await cloudinary.uploader.destroy(image.public_id);
            console.log(`✅ Deleted image: ${image.public_id}`);
          }
        } catch (deleteError) {
          console.error(`❌ Failed to delete image ${image.public_id}:`, deleteError);
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    
    console.log(`✅ Product deleted: ${product.product_name}`);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};