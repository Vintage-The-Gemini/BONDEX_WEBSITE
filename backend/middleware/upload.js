// backend/middleware/upload.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Configure Cloudinary storage for product images
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bondex-safety/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1200, height: 900, crop: 'limit', quality: 'auto:good' },
      { format: 'webp' }
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const originalName = file.originalname.split('.')[0];
      return `product_${timestamp}_${originalName}`.replace(/[^a-zA-Z0-9_]/g, '_');
    }
  },
});

// Configure Cloudinary storage for category images
const categoryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bondex-safety/categories',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 600, crop: 'fit', quality: 'auto:good' },
      { format: 'webp' }
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const originalName = file.originalname.split('.')[0];
      return `category_${timestamp}_${originalName}`.replace(/[^a-zA-Z0-9_]/g, '_');
    }
  },
});

// Configure Cloudinary storage for admin avatars
const adminStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bondex-safety/admin',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto:good' },
      { format: 'webp' }
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      return `admin_avatar_${timestamp}`;
    }
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      cb(new Error('File size too large. Maximum size is 5MB.'), false);
    } else {
      cb(null, true);
    }
  } else {
    cb(new Error('Only image files are allowed (jpg, jpeg, png, webp)'), false);
  }
};

// Multer configurations
export const uploadProductImage = multer({
  storage: productStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 5 // Maximum 5 files per upload
  }
});

export const uploadCategoryImage = multer({
  storage: categoryStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 1 // Single file upload for categories
  }
});

export const uploadAdminAvatar = multer({
  storage: adminStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for avatars
    files: 1 // Single file upload for avatars
  }
});

// Error handling middleware for upload errors
export const handleUploadError = (error, req, res, next) => {
  console.error('Upload Error:', error);

  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 5MB per file.',
          error: 'FILE_SIZE_LIMIT'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum is 5 files per upload.',
          error: 'FILE_COUNT_LIMIT'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Unexpected file field. Please check your form.',
          error: 'UNEXPECTED_FILE'
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'File upload error occurred.',
          error: error.code
        });
    }
  }

  // Handle Cloudinary errors
  if (error.message.includes('Cloudinary')) {
    return res.status(500).json({
      success: false,
      message: 'Image processing failed. Please try again.',
      error: 'CLOUDINARY_ERROR'
    });
  }

  // Handle custom validation errors
  if (error.message.includes('Only image files are allowed')) {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed (jpg, jpeg, png, webp)',
      error: 'INVALID_FILE_TYPE'
    });
  }

  // Generic upload error
  return res.status(500).json({
    success: false,
    message: 'Upload failed. Please try again.',
    error: 'UPLOAD_FAILED'
  });
};

// Utility function to delete image from Cloudinary
export const deleteCloudinaryImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Image deleted from Cloudinary:', result);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

// Utility function to get optimized image URL
export const getOptimizedImageUrl = (publicId, options = {}) => {
  const {
    width = 800,
    height = 600,
    crop = 'fit',
    quality = 'auto:good',
    format = 'webp'
  } = options;

  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop, quality },
      { format }
    ]
  });
};

// Middleware to validate product images before upload
export const validateProductImages = (req, res, next) => {
  // Check if files are present
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one product image is required',
      error: 'NO_IMAGES'
    });
  }

  // Validate file count
  if (req.files.length > 5) {
    return res.status(400).json({
      success: false,
      message: 'Maximum 5 images allowed per product',
      error: 'TOO_MANY_IMAGES'
    });
  }

  // Validate each file
  for (const file of req.files) {
    // Check file type
    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).json({
        success: false,
        message: `File ${file.originalname} is not a valid image`,
        error: 'INVALID_IMAGE_TYPE'
      });
    }

    // Check file size
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: `File ${file.originalname} is too large. Maximum size is 5MB`,
        error: 'IMAGE_TOO_LARGE'
      });
    }
  }

  next();
};

// Middleware to log upload activity
export const logUploadActivity = (req, res, next) => {
  const originalSend = res.json;
  
  res.json = function(data) {
    // Log successful uploads
    if (data.success && req.files) {
      console.log('Upload Activity:', {
        timestamp: new Date().toISOString(),
        userId: req.user?.id || 'anonymous',
        fileCount: req.files.length,
        totalSize: req.files.reduce((total, file) => total + file.size, 0),
        route: req.originalUrl,
        method: req.method,
        ip: req.ip
      });
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

// Test upload configuration
export const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful:', result);
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error);
    return false;
  }
};

export default {
  uploadProductImage,
  uploadCategoryImage,
  uploadAdminAvatar,
  handleUploadError,
  deleteCloudinaryImage,
  getOptimizedImageUrl,
  validateProductImages,
  logUploadActivity,
  testCloudinaryConnection
};