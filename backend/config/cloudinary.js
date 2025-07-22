// backend/config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Always use HTTPS
});

// Storage configurations for different upload types
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

const generalStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bondex-safety/general',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1200, height: 900, crop: 'limit', quality: 'auto:good' },
      { format: 'webp' }
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const originalName = file.originalname.split('.')[0];
      return `general_${timestamp}_${originalName}`.replace(/[^a-zA-Z0-9_]/g, '_');
    }
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Multer configuration for product images
export const uploadProductImage = multer({
  storage: productStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files per upload
  }
});

// Multer configuration for category images
export const uploadCategoryImage = multer({
  storage: categoryStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB limit
    files: 1 // Single file upload
  }
});

// Multer configuration for general uploads
export const uploadGeneral = multer({
  storage: generalStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files
  }
});

// Helper function to delete image from Cloudinary (matching your existing code)
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('🗑️ Image deleted from Cloudinary:', publicId, result.result);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

// Alternative export name for consistency
export const deleteImage = deleteFromCloudinary;

// Helper function to upload base64 image (for data migration)
export const uploadBase64Image = async (base64String, folder = 'bondex-safety/products') => {
  try {
    const result = await cloudinary.uploader.upload(base64String, {
      folder: folder,
      transformation: [
        {
          width: 800,
          height: 600,
          crop: 'fill',
          quality: 'auto:good',
          fetch_format: 'auto'
        }
      ]
    });
    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Error uploading base64 image:', error);
    throw error;
  }
};

// Helper function to get optimized image URL
export const getOptimizedImageUrl = (publicId, options = {}) => {
  const {
    width = 800,
    height = 600,
    crop = 'fill',
    quality = 'auto:good',
    format = 'auto'
  } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    fetch_format: format
  });
};

// Test Cloudinary connection
export const testCloudinaryConnection = async () => {
  try {
    console.log('🔧 Testing Cloudinary connection...');
    
    // Re-configure cloudinary to ensure settings are applied
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    
    console.log('📝 Configuration check:');
    console.log('  Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME || 'NOT_SET');
    console.log('  API Key:', process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT_SET');
    console.log('  API Secret:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT_SET');
    
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful!', result);
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    return false;
  }
};

// Helper function to upload image buffer
export const uploadImage = async (buffer, options = {}) => {
  try {
    const defaultOptions = {
      resource_type: 'image',
      folder: 'bondex-safety/products',
      transformation: [
        { width: 1200, height: 900, crop: 'limit', quality: 'auto:good' },
        { format: 'webp' }
      ],
      ...options
    };

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        defaultOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('✅ Image uploaded successfully:', result.public_id);
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
              bytes: result.bytes
            });
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    console.error('Error in uploadImage function:', error);
    throw error;
  }
};

// Helper function to get image details
export const getImageDetails = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return {
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      created_at: result.created_at
    };
  } catch (error) {
    console.error('Error getting image details:', error);
    throw error;
  }
};

// Test connection on module load
testCloudinaryConnection();

export default cloudinary;