// backend/controllers/adminProductController.js
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import cloudinary from '../config/cloudinary.js'; // ✅ FIXED: Default import

// Helper function to update category product counts
const updateCategoryProductCounts = async (categoryIds) => {
  try {
    for (const categoryId of categoryIds) {
      if (categoryId) {
        const productCount = await Product.countDocuments({
          $or: [
            { primaryCategory: categoryId },
            { secondaryCategories: categoryId }
          ],
          status: 'active'
        });
        
        await Category.findByIdAndUpdate(categoryId, {
          productCount: productCount
        });
      }
    }
  } catch (error) {
    console.error('Error updating category counts:', error);
  }
};

// @desc    Create new product with multi-category support
// @route   POST /api/admin/products
// @access  Private (Admin only)
export const createProduct = async (req, res) => {
  try {
    console.log('🎯 CREATING PRODUCT - Backend Controller');
    console.log('📋 Request Body:', JSON.stringify(req.body, null, 2));
    console.log('📎 Files uploaded:', req.files?.length || 0);
    console.log('👤 Admin ID:', req.user?.id);

    // ✅ EXTRACT AND VALIDATE DATA
    const {
      // Basic product info
      product_name,
      product_description,
      product_brand,
      
      // 🎯 MULTI-CATEGORY SUPPORT
      primaryCategory,
      secondaryCategories,
      
      // Pricing & inventory
      product_price,
      stock,
      lowStockThreshold,
      
      // Sale configuration
      isOnSale,
      salePrice,
      saleStartDate,
      saleEndDate,
      
      // Status & features
      status,
      isFeatured,
      isNewArrival,
      
      // 🚀 SEO FIELDS
      metaTitle,
      metaDescription,
      keywords,
      slug,
      
      // Additional data (JSON strings)
      features,
      specifications,
      tags,
      certifications,
      complianceStandards
    } = req.body;

    console.log('🔍 VALIDATION CHECK:');
    console.log('  product_name:', product_name);
    console.log('  product_description:', product_description);
    console.log('  product_brand:', product_brand);
    console.log('  primaryCategory:', primaryCategory);
    console.log('  secondaryCategories:', secondaryCategories);
    console.log('  product_price:', product_price);
    console.log('  stock:', stock);

    // ✅ STEP 1: VALIDATE REQUIRED FIELDS
    if (!product_name || !product_name.trim()) {
      console.log('❌ Missing product_name');
      return res.status(400).json({
        success: false,
        message: 'Product name is required'
      });
    }

    if (!product_description || !product_description.trim()) {
      console.log('❌ Missing product_description');
      return res.status(400).json({
        success: false,
        message: 'Product description is required'
      });
    }

    if (!product_brand || !product_brand.trim()) {
      console.log('❌ Missing product_brand');
      return res.status(400).json({
        success: false,
        message: 'Product brand is required'
      });
    }

    if (!primaryCategory) {
      console.log('❌ Missing primaryCategory');
      return res.status(400).json({
        success: false,
        message: 'Primary category (protection type) is required'
      });
    }

    if (!product_price || parseFloat(product_price) <= 0) {
      console.log('❌ Invalid product_price:', product_price);
      return res.status(400).json({
        success: false,
        message: 'Valid product price is required'
      });
    }

    if (stock === undefined || parseInt(stock) < 0) {
      console.log('❌ Invalid stock:', stock);
      return res.status(400).json({
        success: false,
        message: 'Valid stock quantity is required'
      });
    }

    if (!req.files || req.files.length === 0) {
      console.log('❌ No images uploaded');
      return res.status(400).json({
        success: false,
        message: 'At least one product image is required'
      });
    }

    console.log('✅ Basic validation passed');

    // ✅ STEP 2: VALIDATE CATEGORIES EXIST
    console.log('🔍 Validating categories...');
    
    // Check primary category
    const primaryCat = await Category.findById(primaryCategory);
    if (!primaryCat) {
      console.log('❌ Primary category not found:', primaryCategory);
      return res.status(400).json({
        success: false,
        message: 'Primary category not found'
      });
    }
    console.log('✅ Primary category found:', primaryCat.name);

    // Parse and validate secondary categories
    let parsedSecondaryCategories = [];
    if (secondaryCategories) {
      try {
        // Handle comma-separated string from FormData
        if (typeof secondaryCategories === 'string') {
          parsedSecondaryCategories = secondaryCategories.split(',').filter(id => id.trim());
        } else if (Array.isArray(secondaryCategories)) {
          parsedSecondaryCategories = secondaryCategories;
        }
        
        console.log('🔍 Parsed secondary categories:', parsedSecondaryCategories);
        
        // Validate all secondary categories exist
        if (parsedSecondaryCategories.length > 0) {
          const industryCats = await Category.find({
            _id: { $in: parsedSecondaryCategories }
          });
          
          if (industryCats.length !== parsedSecondaryCategories.length) {
            console.log('❌ Some secondary categories not found');
            return res.status(400).json({
              success: false,
              message: 'One or more secondary categories not found'
            });
          }
          console.log('✅ All secondary categories found:', industryCats.map(c => c.name));
        }
        
      } catch (error) {
        console.log('❌ Error parsing secondary categories:', error);
        return res.status(400).json({
          success: false,
          message: 'Invalid secondary categories format'
        });
      }
    }

    // ✅ STEP 3: PROCESS UPLOADED IMAGES
    console.log('🖼️ Processing uploaded images...');
    const uploadedImages = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
      alt: `${product_name} - Product Image`
    }));
    console.log('✅ Images processed:', uploadedImages.length);

    // ✅ STEP 4: PARSE ARRAY FIELDS FROM COMMA-SEPARATED STRINGS
    const parseCommaSeparated = (field, defaultValue = []) => {
      if (!field) return defaultValue;
      if (typeof field === 'string') {
        return field.split(',').map(item => item.trim()).filter(item => item);
      }
      return Array.isArray(field) ? field : defaultValue;
    };

    const parseSpecifications = (field) => {
      if (!field) return [];
      if (typeof field === 'string') {
        return field.split(',').map(spec => {
          const [key, value] = spec.split(':');
          return { key: key?.trim() || '', value: value?.trim() || '' };
        }).filter(spec => spec.key && spec.value);
      }
      return Array.isArray(field) ? field : [];
    };

    const parsedFeatures = parseCommaSeparated(features);
    const parsedSpecifications = parseSpecifications(specifications);
    const parsedTags = parseCommaSeparated(tags);
    const parsedCertifications = parseCommaSeparated(certifications);
    const parsedCompliance = parseCommaSeparated(complianceStandards);

    // ✅ STEP 5: BUILD PRODUCT DATA
    const generatedSku = `BDX-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    console.log('🏷️ Generated SKU:', generatedSku);
    
    const productData = {
      // Basic Information
      product_name: product_name.trim(),
      product_description: product_description.trim(),
      product_brand: product_brand.trim(),
      
      // ✅ GENERATE UNIQUE SKU
      sku: generatedSku,
      
      // Categories
      primaryCategory: primaryCategory,
      secondaryCategories: parsedSecondaryCategories,
      
      // Pricing & Inventory
      product_price: parseFloat(product_price),
      stock: parseInt(stock),
      lowStockThreshold: parseInt(lowStockThreshold) || 10,
      
      // Sale Configuration
      isOnSale: Boolean(isOnSale === 'true' || isOnSale === true),
      salePrice: isOnSale && salePrice ? parseFloat(salePrice) : null,
      saleStartDate: saleStartDate || null,
      saleEndDate: saleEndDate || null,
      
      // Status & Features
      status: status || 'active',
      isFeatured: Boolean(isFeatured === 'true' || isFeatured === true),
      isNewArrival: Boolean(isNewArrival === 'true' || isNewArrival === true),
      
      // Images
      images: uploadedImages,
      mainImage: uploadedImages[0]?.url || null,
      product_image: uploadedImages[0]?.url || null, // For backward compatibility
      
      // SEO Fields
      metaTitle: metaTitle?.trim() || `${product_name} - ${product_brand} | Kenya`,
      metaDescription: metaDescription?.trim() || `${product_description.substring(0, 150)}... Available in Kenya.`,
      keywords: keywords?.trim() || `${product_name}, ${product_brand}, safety equipment, kenya`,
      slug: slug?.trim() || product_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      
      // Additional Data
      features: parsedFeatures,
      specifications: parsedSpecifications,
      tags: parsedTags,
      certifications: parsedCertifications,
      complianceStandards: parsedCompliance,
      
      // Metadata
      createdBy: req.user.id,
      lastModifiedBy: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('🎯 FINAL PRODUCT DATA:', {
      name: productData.product_name,
      brand: productData.product_brand,
      price: productData.product_price,
      stock: productData.stock,
      sku: productData.sku, // ✅ Log the SKU
      primaryCategory: primaryCat.name,
      secondaryCategories: parsedSecondaryCategories.length,
      images: uploadedImages.length,
      seoOptimized: !!(productData.metaTitle && productData.metaDescription)
    });

    // ✅ STEP 6: CREATE THE PRODUCT
    console.log('💾 Creating product in database...');
    const product = new Product(productData);
    const savedProduct = await product.save();
    console.log('✅ Product saved with ID:', savedProduct._id);

    // ✅ STEP 7: UPDATE CATEGORY PRODUCT COUNTS
    console.log('📊 Updating category product counts...');
    await updateCategoryProductCounts([primaryCategory, ...parsedSecondaryCategories]);

    // ✅ STEP 8: POPULATE AND RETURN
    const populatedProduct = await Product.findById(savedProduct._id)
      .populate('primaryCategory', 'name slug type icon')
      .populate('secondaryCategories', 'name slug type icon')
      .populate('createdBy', 'name email');

    console.log('🎉 PRODUCT CREATION SUCCESS!');

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
      return res.status(400).json({
        success: false,
        message: 'Product with this name or slug already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create product',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Get all products for admin
// @route   GET /api/admin/products
// @access  Private (Admin only)
export const getAdminProducts = async (req, res) => {
  try {
    console.log('📋 Admin fetching products with filters:', req.query);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.category) {
      filter.$or = [
        { primaryCategory: req.query.category },
        { secondaryCategories: req.query.category }
      ];
    }
    
    if (req.query.search) {
      filter.$or = [
        { product_name: { $regex: req.query.search, $options: 'i' } },
        { product_description: { $regex: req.query.search, $options: 'i' } },
        { product_brand: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Build sort object
    let sort = { createdAt: -1 }; // Default sort
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'name':
          sort = { product_name: 1 };
          break;
        case 'price':
          sort = { product_price: 1 };
          break;
        case 'stock':
          sort = { stock: 1 };
          break;
        case 'created':
          sort = { createdAt: -1 };
          break;
      }
    }
    
    // Execute queries
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('primaryCategory', 'name slug type')
        .populate('secondaryCategories', 'name slug type')
        .populate('createdBy', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter)
    ]);
    
    console.log(`✅ Found ${products.length} products (${total} total)`);
    
    // Format products for admin
    const formattedProducts = products.map(product => ({
      ...product.toObject(),
      formattedPrice: `KES ${product.product_price.toLocaleString()}`,
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
};

// @desc    Get single product for admin
// @route   GET /api/admin/products/:id
// @access  Private (Admin only)
export const getAdminProduct = async (req, res) => {
  try {
    console.log(`🔍 Admin fetching single product: ${req.params.id}`);
    
    const product = await Product.findById(req.params.id)
      .populate('primaryCategory', 'name slug type description')
      .populate('secondaryCategories', 'name slug type description')
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email');
    
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
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private (Admin only)
export const updateAdminProduct = async (req, res) => {
  try {
    console.log('📝 Updating product:', req.params.id);
    console.log('👤 Admin user:', req.user?.email);
    
    const updateData = {
      ...req.body,
      updatedAt: new Date(),
      lastModifiedBy: req.user.id
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

    // Handle boolean fields
    if (updateData.isOnSale !== undefined) {
      updateData.isOnSale = Boolean(updateData.isOnSale);
    }
    if (updateData.isFeatured !== undefined) {
      updateData.isFeatured = Boolean(updateData.isFeatured);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true,
        runValidators: true
      }
    ).populate('primaryCategory', 'name slug type')
     .populate('secondaryCategories', 'name slug type');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    console.log('✅ Product updated successfully:', product.product_name);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
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
      console.log('🖼️ Deleting images from Cloudinary...');
      for (const image of product.images) {
        try {
          if (image.public_id) {
            await cloudinary.uploader.destroy(image.public_id);
            console.log('✅ Deleted image:', image.public_id);
          }
        } catch (imageError) {
          console.error('❌ Error deleting image:', imageError);
        }
      }
    }

    // Delete the product
    await Product.findByIdAndDelete(req.params.id);

    // Update category product counts
    const categoryIds = [product.primaryCategory, ...product.secondaryCategories].filter(id => id);
    await updateCategoryProductCounts(categoryIds);

    console.log('✅ Product deleted successfully:', product.product_name);

    res.json({
      success: true,
      message: 'Product deleted successfully'
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

export default {
  createProduct,
  getAdminProducts,
  getAdminProduct,
  updateAdminProduct,
  deleteAdminProduct
};