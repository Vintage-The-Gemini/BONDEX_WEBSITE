// backend/controllers/adminProductController.js
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { cloudinary } from '../config/cloudinary.js';

// @desc    Create new product with multi-category support
// @route   POST /api/admin/products
// @access  Private (Admin only)
export const createProduct = async (req, res) => {
  try {
    console.log('🎯 PRECISION: Creating multi-category product');
    console.log('Form Data:', req.body);
    console.log('Files:', req.files?.length || 0);

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
      
      // 🚀 ENHANCED SEO
      metaTitle,
      metaDescription,
      keywords,
      slug,
      focusKeyword,
      
      // Additional data (JSON strings)
      features,
      specifications,
      productTags,
      certifications,
      complianceStandards
    } = req.body;

    // 🎯 VALIDATION: Multi-category requirements
    if (!product_name || !product_description || !product_brand) {
      return res.status(400).json({
        success: false,
        message: 'Product name, description, and brand are required'
      });
    }

    if (!primaryCategory) {
      return res.status(400).json({
        success: false,
        message: 'Primary category (protection type) is required'
      });
    }

    // Parse secondary categories
    let parsedSecondaryCategories = [];
    if (secondaryCategories) {
      try {
        parsedSecondaryCategories = Array.isArray(secondaryCategories) 
          ? secondaryCategories 
          : JSON.parse(secondaryCategories);
      } catch (error) {
        console.log('📝 Secondary categories as string array:', secondaryCategories);
        parsedSecondaryCategories = [secondaryCategories];
      }
    }

    if (parsedSecondaryCategories.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one industry/sector must be selected'
      });
    }

    // 🎯 VALIDATE: Categories exist and are correct types
    const primaryCat = await Category.findById(primaryCategory);
    if (!primaryCat || primaryCat.type !== 'protection_type') {
      return res.status(400).json({
        success: false,
        message: 'Invalid protection type selected'
      });
    }

    const industryCats = await Category.find({
      _id: { $in: parsedSecondaryCategories },
      type: 'industry'
    });

    if (industryCats.length !== parsedSecondaryCategories.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid industry categories selected'
      });
    }

    // 📸 HANDLE IMAGE UPLOADS with Cloudinary
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      console.log(`🖼️ Processing ${req.files.length} images`);
      
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'bondex-safety/products',
            transformation: [
              { width: 800, height: 800, crop: 'limit', quality: 'auto:good' },
              { format: 'webp' }
            ]
          });

          uploadedImages.push({
            url: result.secure_url,
            public_id: result.public_id,
            isMain: uploadedImages.length === 0 // First image is main
          });
        } catch (uploadError) {
          console.error('❌ Image upload error:', uploadError);
          return res.status(500).json({
            success: false,
            message: `Image upload failed: ${uploadError.message}`
          });
        }
      }
    }

    // 🏷️ PARSE ADDITIONAL DATA
    let parsedFeatures = [];
    let parsedSpecifications = {};
    let parsedTags = [];
    let parsedCertifications = [];
    let parsedCompliance = [];

    try {
      if (features) parsedFeatures = JSON.parse(features);
      if (specifications) parsedSpecifications = JSON.parse(specifications);
      if (productTags) parsedTags = JSON.parse(productTags);
      if (certifications) parsedCertifications = JSON.parse(certifications);
      if (complianceStandards) parsedCompliance = JSON.parse(complianceStandards);
    } catch (parseError) {
      console.log('📝 JSON parse warning:', parseError.message);
    }

    // 🎯 PRECISION: Create product with multi-category support
    const productData = {
      // Basic info
      product_name: product_name.trim(),
      product_description: product_description.trim(),
      product_brand: product_brand.trim(),
      
      // 🚀 MULTI-CATEGORY ASSIGNMENT
      primaryCategory,
      secondaryCategories: parsedSecondaryCategories,
      allCategories: [primaryCategory, ...parsedSecondaryCategories],
      
      // Legacy support
      category: primaryCategory,
      
      // Pricing
      product_price: parseFloat(product_price),
      currency: 'KES',
      
      // Inventory
      stock: parseInt(stock),
      lowStockThreshold: parseInt(lowStockThreshold) || 10,
      
      // Sale configuration
      isOnSale: isOnSale === 'true' || isOnSale === true,
      salePrice: salePrice ? parseFloat(salePrice) : null,
      saleStartDate: saleStartDate || null,
      saleEndDate: saleEndDate || null,
      
      // Status & visibility
      status: status || 'active',
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isNewArrival: isNewArrival === 'true' || isNewArrival === true,
      
      // 🎯 ENHANCED SEO FIELDS
      metaTitle: metaTitle || product_name,
      metaDescription: metaDescription || product_description.substring(0, 160),
      keywords: keywords || '',
      slug: slug || product_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      focusKeyword: focusKeyword || '',
      
      // Images
      images: uploadedImages,
      mainImage: uploadedImages.length > 0 ? uploadedImages[0].url : null,
      product_image: uploadedImages.length > 0 ? uploadedImages[0].url : null,
      
      // Additional data
      features: parsedFeatures,
      specifications: parsedSpecifications,
      tags: parsedTags,
      certifications: parsedCertifications,
      complianceStandards: parsedCompliance,
      
      // Metadata
      createdBy: req.admin.id,
      lastModifiedBy: req.admin.id
    };

    console.log('🎯 CREATING PRODUCT WITH DATA:', {
      name: productData.product_name,
      primaryCategory: primaryCat.name,
      secondaryCategories: industryCats.map(c => c.name),
      images: uploadedImages.length,
      seoOptimized: !!(metaTitle && metaDescription)
    });

    // Create the product
    const product = new Product(productData);
    const savedProduct = await product.save();

    // 📊 UPDATE CATEGORY PRODUCT COUNTS
    await updateCategoryProductCounts([primaryCategory, ...parsedSecondaryCategories]);

    // 🎯 POPULATE AND RETURN
    const populatedProduct = await Product.findById(savedProduct._id)
      .populate('primaryCategory', 'name slug type icon')
      .populate('secondaryCategories', 'name slug type icon')
      .populate('createdBy', 'name email');

    console.log('✅ PRECISION SUCCESS: Multi-category product created');

    res.status(201).json({
      success: true,
      message: '🎯 Product created successfully with multi-category targeting!',
      data: populatedProduct,
      stats: {
        totalCategories: parsedSecondaryCategories.length + 1,
        seoOptimized: !!(metaTitle && metaDescription),
        imagesUploaded: uploadedImages.length,
        discoveryPaths: parsedSecondaryCategories.length + 1
      }
    });

  } catch (error) {
    console.error('❌ PRODUCT CREATION ERROR:', error);
    
    // Clean up uploaded images if product creation fails
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          if (file.filename) {
            await cloudinary.uploader.destroy(file.filename);
          }
        } catch (cleanupError) {
          console.error('🧹 Image cleanup error:', cleanupError);
        }
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create product',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// 📊 HELPER: Update category product counts
const updateCategoryProductCounts = async (categoryIds) => {
  try {
    for (const categoryId of categoryIds) {
      const count = await Product.countDocuments({
        allCategories: categoryId,
        status: 'active'
      });
      
      await Category.findByIdAndUpdate(categoryId, {
        productCount: count
      });
    }
    console.log('📊 Category product counts updated');
  } catch (error) {
    console.error('❌ Error updating category counts:', error);
  }
};

// @desc    Get products with multi-category filtering
// @route   GET /api/admin/products
// @access  Private (Admin only)
export const getAdminProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      category = '',
      industries = '', // Comma-separated industry IDs
      status = '',
      sortBy = 'newest',
      priceMin = '',
      priceMax = '',
      stockMin = '',
      featured = '',
      onSale = ''
    } = req.query;

    // Build query with multi-category support
    const query = {};
    
    // Search across multiple fields
    if (search) {
      query.$or = [
        { product_name: { $regex: search, $options: 'i' } },
        { product_description: { $regex: search, $options: 'i' } },
        { product_brand: { $regex: search, $options: 'i' } },
        { keywords: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by primary category (protection type)
    if (category) {
      query.primaryCategory = category;
    }

    // 🎯 MULTI-CATEGORY FILTERING: Filter by industries
    if (industries) {
      const industryIds = industries.split(',').filter(Boolean);
      query.secondaryCategories = { $in: industryIds };
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Price range filter
    if (priceMin || priceMax) {
      query.product_price = {};
      if (priceMin) query.product_price.$gte = parseFloat(priceMin);
      if (priceMax) query.product_price.$lte = parseFloat(priceMax);
    }

    // Stock filter
    if (stockMin) {
      query.stock = { $gte: parseInt(stockMin) };
    }

    // Feature filters
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    if (onSale === 'true') {
      query.isOnSale = true;
    }

    // 📊 SORTING with multi-category awareness
    let sortOptions = {};
    switch (sortBy) {
      case 'name':
        sortOptions.product_name = 1;
        break;
      case 'price_low':
        sortOptions.product_price = 1;
        break;
      case 'price_high':
        sortOptions.product_price = -1;
        break;
      case 'stock_low':
        sortOptions.stock = 1;
        break;
      case 'stock_high':
        sortOptions.stock = -1;
        break;
      case 'oldest':
        sortOptions.createdAt = 1;
        break;
      case 'most_categories':
        // Sort by number of categories (for multi-category products)
        sortOptions = { $expr: { $size: '$allCategories' } };
        break;
      default:
        sortOptions.createdAt = -1; // Newest first
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with population
    const products = await Product.find(query)
      .populate('primaryCategory', 'name slug type icon colors')
      .populate('secondaryCategories', 'name slug type icon colors')
      .populate('createdBy', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));

    // 📊 GET FILTER OPTIONS for frontend
    const filterOptions = await getFilterOptions();

    console.log(`📊 Retrieved ${products.length} products (${totalProducts} total)`);

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages,
      currentPage: parseInt(page),
      data: products,
      filters: filterOptions,
      query: {
        search,
        category,
        industries,
        status,
        sortBy,
        multiCategoryCount: products.filter(p => p.secondaryCategories.length > 1).length
      }
    });

  } catch (error) {
    console.error('❌ Get Admin Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// 🎯 HELPER: Get filter options for admin interface
const getFilterOptions = async () => {
  try {
    const [protectionTypes, industries, brands, statuses] = await Promise.all([
      Category.find({ type: 'protection_type', status: 'active' })
        .select('name _id productCount')
        .sort({ name: 1 }),
      Category.find({ type: 'industry', status: 'active' })
        .select('name _id productCount')
        .sort({ name: 1 }),
      Product.distinct('product_brand', { product_brand: { $ne: null, $ne: '' } }),
      Product.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    return {
      protectionTypes,
      industries,
      brands: brands.sort(),
      statuses: statuses.map(s => ({ name: s._id, count: s.count }))
    };
  } catch (error) {
    console.error('❌ Error getting filter options:', error);
    return { protectionTypes: [], industries: [], brands: [], statuses: [] };
  }
};

// @desc    Get single product with full category info
// @route   GET /api/admin/products/:id
// @access  Private (Admin only)
export const getAdminProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('primaryCategory', 'name slug type icon colors description')
      .populate('secondaryCategories', 'name slug type icon colors description')
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // 📊 Get category-based analytics
    const categoryAnalytics = await getCategoryAnalytics(product);

    res.status(200).json({
      success: true,
      data: product,
      analytics: categoryAnalytics
    });

  } catch (error) {
    console.error('❌ Get Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// 🎯 HELPER: Get category-based analytics for a product
const getCategoryAnalytics = async (product) => {
  try {
    // Count products in same categories
    const similarProducts = await Product.countDocuments({
      $or: [
        { primaryCategory: product.primaryCategory._id },
        { secondaryCategories: { $in: product.secondaryCategories.map(c => c._id) } }
      ],
      _id: { $ne: product._id },
      status: 'active'
    });

    // Get cross-category performance
    const categoryPerformance = await Product.aggregate([
      {
        $match: {
          allCategories: { $in: product.allCategories },
          status: 'active'
        }
      },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$product_price' },
          totalProducts: { $sum: 1 },
          avgStock: { $avg: '$stock' }
        }
      }
    ]);

    return {
      similarProducts,
      categoryPerformance: categoryPerformance[0] || {},
      multiCategoryAdvantage: product.secondaryCategories.length > 1
    };
  } catch (error) {
    console.error('❌ Category analytics error:', error);
    return {};
  }
};

// @desc    Update product with multi-category support
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

    // 🎯 HANDLE CATEGORY UPDATES
    const { primaryCategory, secondaryCategories } = req.body;
    
    if (primaryCategory) {
      const primaryCat = await Category.findById(primaryCategory);
      if (!primaryCat || primaryCat.type !== 'protection_type') {
        return res.status(400).json({
          success: false,
          message: 'Invalid protection type'
        });
      }
    }

    if (secondaryCategories) {
      let parsedSecondaryCategories = Array.isArray(secondaryCategories) 
        ? secondaryCategories 
        : JSON.parse(secondaryCategories);
      
      const industryCats = await Category.find({
        _id: { $in: parsedSecondaryCategories },
        type: 'industry'
      });

      if (industryCats.length !== parsedSecondaryCategories.length) {
        return res.status(400).json({
          success: false,
          message: 'Invalid industry categories'
        });
      }
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined && req.body[key] !== '') {
        product[key] = req.body[key];
      }
    });

    // Update metadata
    product.lastModifiedBy = req.admin.id;
    product.lastModified = new Date();

    // Save with validation
    const updatedProduct = await product.save();

    // Update category counts
    if (primaryCategory || secondaryCategories) {
      await updateCategoryProductCounts(updatedProduct.allCategories);
    }

    // Return populated product
    const populatedProduct = await Product.findById(updatedProduct._id)
      .populate('primaryCategory', 'name slug type icon colors')
      .populate('secondaryCategories', 'name slug type icon colors');

    console.log('✅ PRODUCT UPDATED with multi-category support');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: populatedProduct
    });

  } catch (error) {
    console.error('❌ Update Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// @desc    Delete product and cleanup
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

    // 🧹 CLEANUP: Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        try {
          if (image.public_id) {
            await cloudinary.uploader.destroy(image.public_id);
          }
        } catch (imageError) {
          console.error('🖼️ Image deletion error:', imageError);
        }
      }
    }

    // Store category IDs before deletion
    const categoryIds = product.allCategories || [];

    // Delete the product
    await Product.findByIdAndDelete(req.params.id);

    // Update category product counts
    await updateCategoryProductCounts(categoryIds);

    console.log('🗑️ PRODUCT DELETED with cleanup');

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

export {
  createProduct,
  getAdminProducts,
  getAdminProductById,
  updateProduct,
  deleteProduct
};