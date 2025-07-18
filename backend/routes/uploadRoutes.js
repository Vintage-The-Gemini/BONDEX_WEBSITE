// backend/routes/uploadRoutes.js
import express from 'express';
import { 
  uploadProductImage, 
  uploadCategoryImage, 
  uploadGeneral,
  deleteFromCloudinary,
  testCloudinaryConnection 
} from '../config/cloudinary.js';

const router = express.Router();

// Test Cloudinary connection
// @route   GET /api/upload/test
// @desc    Test Cloudinary connection
// @access  Public (for now)
router.get('/test', async (req, res) => {
  try {
    const isConnected = await testCloudinaryConnection();
    
    if (isConnected) {
      res.status(200).json({
        success: true,
        message: 'Cloudinary connection successful!',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Cloudinary connection failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error testing Cloudinary connection',
      error: error.message
    });
  }
});

// Upload product images (multiple files)
// @route   POST /api/upload/product
// @desc    Upload product images to Cloudinary
// @access  Private (Admin only - we'll add auth later)
router.post('/product', uploadProductImage.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Format response with image data
    const uploadedImages = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
      original_name: file.originalname,
      size: file.size,
      format: file.format || file.mimetype.split('/')[1]
    }));

    res.status(200).json({
      success: true,
      message: `${req.files.length} image(s) uploaded successfully`,
      data: uploadedImages,
      count: req.files.length
    });

  } catch (error) {
    console.error('Product Image Upload Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading product images',
      error: error.message
    });
  }
});

// Upload single product image
// @route   POST /api/upload/product/single
// @desc    Upload single product image to Cloudinary
// @access  Private (Admin only)
router.post('/product/single', uploadProductImage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const imageData = {
      url: req.file.path,
      public_id: req.file.filename,
      original_name: req.file.originalname,
      size: req.file.size,
      format: req.file.format || req.file.mimetype.split('/')[1]
    };

    res.status(200).json({
      success: true,
      message: 'Product image uploaded successfully',
      data: imageData
    });

  } catch (error) {
    console.error('Single Product Image Upload Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading product image',
      error: error.message
    });
  }
});

// Upload category image
// @route   POST /api/upload/category
// @desc    Upload category image to Cloudinary
// @access  Private (Admin only)
router.post('/category', uploadCategoryImage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const imageData = {
      url: req.file.path,
      public_id: req.file.filename,
      original_name: req.file.originalname,
      size: req.file.size,
      format: req.file.format || req.file.mimetype.split('/')[1]
    };

    res.status(200).json({
      success: true,
      message: 'Category image uploaded successfully',
      data: imageData
    });

  } catch (error) {
    console.error('Category Image Upload Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading category image',
      error: error.message
    });
  }
});

// Upload general images (banners, logos, etc.)
// @route   POST /api/upload/general
// @desc    Upload general images to Cloudinary
// @access  Private (Admin only)
router.post('/general', uploadGeneral.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedImages = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
      original_name: file.originalname,
      size: file.size,
      format: file.format || file.mimetype.split('/')[1]
    }));

    res.status(200).json({
      success: true,
      message: `${req.files.length} image(s) uploaded successfully`,
      data: uploadedImages,
      count: req.files.length
    });

  } catch (error) {
    console.error('General Image Upload Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message
    });
  }
});

// Delete image from Cloudinary
// @route   DELETE /api/upload/:public_id
// @desc    Delete image from Cloudinary
// @access  Private (Admin only)
router.delete('/:public_id', async (req, res) => {
  try {
    const { public_id } = req.params;
    
    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    // Decode the public_id (in case it's URL encoded)
    const decodedPublicId = decodeURIComponent(public_id);

    const result = await deleteFromCloudinary(decodedPublicId);

    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
        public_id: decodedPublicId
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to delete image',
        result: result
      });
    }

  } catch (error) {
    console.error('Delete Image Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error: error.message
    });
  }
});

// Get image info from Cloudinary
// @route   GET /api/upload/info/:public_id
// @desc    Get image information from Cloudinary
// @access  Private (Admin only)
router.get('/info/:public_id', async (req, res) => {
  try {
    const { public_id } = req.params;
    const decodedPublicId = decodeURIComponent(public_id);

    // Import cloudinary here to avoid circular imports
    const { v2: cloudinary } = await import('cloudinary');
    
    const result = await cloudinary.api.resource(decodedPublicId);

    res.status(200).json({
      success: true,
      message: 'Image info retrieved successfully',
      data: {
        public_id: result.public_id,
        url: result.secure_url,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height,
        created_at: result.created_at
      }
    });

  } catch (error) {
    console.error('Get Image Info Error:', error);
    res.status(404).json({
      success: false,
      message: 'Image not found or error retrieving info',
      error: error.message
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB per file.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 5 files per upload.'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files (JPG, PNG, WebP) are allowed.'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Upload error',
    error: error.message
  });
});

export default router;