// backend/src/config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import logger from './logger.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Test connection
const testCloudinaryConnection = async () => {
  try {
    // First check if credentials are set
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary credentials not found in environment variables');
    }

    const result = await cloudinary.api.ping();
    logger.info('☁️ Cloudinary connected successfully');
    return result;
  } catch (error) {
    logger.error('❌ Cloudinary connection failed:', {
      message: error.message,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
      apiKey: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
      apiSecret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing'
    });
    throw error;
  }
};

// Helper function to delete image
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info(`Image deleted from Cloudinary: ${publicId}`);
    return result;
  } catch (error) {
    logger.error(`Failed to delete image ${publicId}:`, error.message);
    throw error;
  }
};

// Helper function to upload image
export const uploadImage = async (file, folder = 'safety-equipment', transformation = {}) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      transformation,
      resource_type: 'auto'
    });
    logger.info(`Image uploaded to Cloudinary: ${result.public_id}`);
    return result;
  } catch (error) {
    logger.error('Failed to upload image to Cloudinary:', error.message);
    throw error;
  }
};

// Initialize connection test
testCloudinaryConnection().catch((error) => {
  logger.warn('Cloudinary connection test failed - image uploads may not work');
});

export { cloudinary };