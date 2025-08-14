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
      category,
      industries,
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

    // Handle SKU properly
    const sku = req.body.sku?.trim();

    console.log('📋 EXTRACTED FIELDS:');
    console.log('- product_name:', product_name);
    console.log('- category:', category);
    console.log('- industries:', industries, 'Type:', typeof industries);
    console.log('- sku:', sku, 'Length:', sku?.length || 0);
    console.log('- metaTitle:', metaTitle);
    console.log('- metaTitle length:', metaTitle?.length || 0);
    console.log('- files count:', req.files?.length || 0);

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

    // 🔧 FIX META TITLE LENGTH
    let finalMetaTitle = metaTitle;
    if (!finalMetaTitle || finalMetaTitle.length > 50) {
      finalMetaTitle = product_name.length > 30 
        ? `${product_name.substring(0, 30)}... - Bondex`
        : `${product_name} - Bondex`;
    }
    
    console.log('🏷️ FINAL META TITLE:', finalMetaTitle, '(Length:', finalMetaTitle.length, ')');

    // ✅ CHECK FOR EXISTING PRODUCT BY NAME
    const existingProductByName = await Product.findOne({
      product_name: { $regex: new RegExp(`^${product_name.trim()}$`, 'i') }
    });

    if (existingProductByName) {
      return res.status(400).json({
        success: false,
        message: `Product with name "${product_name}" already exists.`,
        suggestion: `Try: "${product_name} - ${new Date().getFullYear()}"`
      });
    }

    // 🔧 FIX: Only check SKU if it's provided and not empty
    if (sku && sku.length > 0) {
      const existingProductBySku = await Product.findOne({
        sku: { $regex: new RegExp(`^${sku}$`, 'i') }
      });

      if (existingProductBySku) {
        return res.status(400).json({
          success: false,
          message: `Product with SKU "${sku}" already exists.`,
          suggestion: `Try a different SKU or leave it empty to auto-generate`
        });
      }
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

    // 🔧 FIX IMAGE PROCESSING
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
        
        const imageData = {
          url: file.path,
          public_id: file.filename,
          alt: `${product_name} - Image ${i + 1}`,
          isMain: i === 0
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
      sku: sku || undefined,
      slug,
      primaryCategory: categoryData.primaryCategory,
      secondaryCategories: categoryData.secondaryCategories,
      allCategories: categoryData.allCategories,
      product_price: parseFloat(product_price),
      stock: parseInt(stock),
      lowStockThreshold: parseInt(lowStockThreshold),
      images: productImages,
      status,
      isFeatured: isFeatured === true || isFeatured === 'true',
      isNewArrival: isNewArrival === true || isNewArrival === 'true',
      createdBy: req.user._id,
      
      // SEO fields
      metaTitle: finalMetaTitle,
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

    // Handle specific error types
    if (error.name === 'ValidationError') {
      console.error('📋 VALIDATION ERROR DETAILS:');
      const messages = Object.values(error.errors).map(err => {
        console.error(`- Field: ${err.path}, Message: ${err.message}, Value: ${err.value}`);
        return `${err.path}: ${err.message}`;
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

// Other controller methods (keeping them simple for now)
export const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate('primaryCategory', 'name slug type icon')
      .populate('secondaryCategories', 'name slug type icon')
      .populate('createdBy', 'email firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

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
    console.error('❌ Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

export const updateAdminProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('primaryCategory', 'name slug type icon')
    .populate('secondaryCategories', 'name slug type icon');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('❌ Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

export const deleteAdminProduct = async (req, res) => {
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
        try {
          if (image.public_id) {
            await cloudinary.uploader.destroy(image.public_id);
          }
        } catch (deleteError) {
          console.error(`❌ Failed to delete image ${image.public_id}:`, deleteError);
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);

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