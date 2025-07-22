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
  console.log('File filter - Processing file:', file.originalname, 'Type:', file.mimetype);
  
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    // Additional check for allowed formats
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP image files are allowed'), false);
    }
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Size limit function
const checkFileSize = (req, file, cb) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    cb(new Error('File size too large. Maximum size is 5MB.'), false);
  } else {
    cb(null, true);
  }
};

// Create multer upload instances
export const uploadProductImage = multer({
  storage: productStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files
  }
});

export const uploadCategoryImage = multer({
  storage: categoryStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only 1 file for categories
  }
});

export const uploadAdminAvatar = multer({
  storage: adminStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for avatars
    files: 1
  }
});

// General upload for other images
const generalStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bondex-safety/general',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1000, height: 1000, crop: 'limit', quality: 'auto:good' },
      { format: 'webp' }
    ]
  }
});

export const uploadGeneral = multer({
  storage: generalStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10
  }
});

// Error handling middleware
export const handleUploadError = (error, req, res, next) => {
  console.error('Upload Error:', error);
  
  // Handle multer errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size too large. Maximum size is 5MB per file.',
      error: 'FILE_TOO_LARGE'
    });
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Too many files. Maximum 5 images allowed per product.',
      error: 'TOO_MANY_FILES'
    });
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected file field name. Use "images" for product uploads.',
      error: 'UNEXPECTED_FIELD'
    });
  }

  // Handle Cloudinary errors
  if (error.message && error.message.includes('cloudinary')) {
    return res.status(500).json({
      success: false,
      message: 'Image upload service is temporarily unavailable. Please try again.',
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

  if (error.message.includes('File size too large')) {
    return res.status(400).json({
      success: false,
      message: 'File size too large. Maximum size is 5MB',
      error: 'IMAGE_TOO_LARGE'
    });
  }

  // Generic upload error
  return res.status(500).json({
    success: false,
    message: 'Upload failed. Please try again.',
    error: 'UPLOAD_FAILED'
  });
};

// Middleware to log upload activity
export const logUploadActivity = (req, res, next) => {
  const originalSend = res.json;
  
  res.json = function(data) {
    // Log successful uploads
    if (data.success && req.files) {
      console.log('📸 Upload Activity:', {
        timestamp: new Date().toISOString(),
        userId: req.user?.id || 'anonymous',
        fileCount: req.files.length,
        totalSize: req.files.reduce((total, file) => total + file.size, 0),
        route: req.originalUrl,
        method: req.method,
        ip: req.ip,
        files: req.files.map(f => ({ name: f.originalname, size: f.size }))
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

// Utility function to delete image from Cloudinary
export const deleteCloudinaryImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('🗑️ Image deleted from Cloudinary:', result);
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
  console.log('🔍 Validating product images...', req.files?.length || 0, 'files');
  
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

  console.log('✅ Image validation passed');
  next();
};

export default {
  uploadProductImage,
  uploadCategoryImage,
  uploadAdminAvatar,
  uploadGeneral,
  handleUploadError,
  deleteCloudinaryImage,
  getOptimizedImageUrl,
  validateProductImages,
  logUploadActivity,
  testCloudinaryConnection
};