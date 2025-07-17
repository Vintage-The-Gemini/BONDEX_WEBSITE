// backend/src/config/validateEnv.js
import logger from './logger.js';

export const validateEnvironment = () => {
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_EXPIRE'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    logger.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
    
    // Set default values for development
    if (process.env.NODE_ENV === 'development') {
      if (!process.env.JWT_SECRET) {
        process.env.JWT_SECRET = 'development_jwt_secret_key_not_for_production_use_12345678';
        logger.warn('🔧 Using default JWT_SECRET for development');
      }
      if (!process.env.JWT_EXPIRE) {
        process.env.JWT_EXPIRE = '7d';
        logger.warn('🔧 Using default JWT_EXPIRE for development');
      }
      if (!process.env.JWT_COOKIE_EXPIRE) {
        process.env.JWT_COOKIE_EXPIRE = '7';
        logger.warn('🔧 Using default JWT_COOKIE_EXPIRE for development');
      }
    } else {
      logger.error('❌ Cannot start server without required environment variables');
      process.exit(1);
    }
  }

  // Validate JWT_SECRET length
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    logger.warn('⚠️ JWT_SECRET should be at least 32 characters long for security');
  }

  // Validate JWT_EXPIRE format
  const validExpiresIn = /^(\d+[smhd]|\d+)$/.test(process.env.JWT_EXPIRE);
  if (!validExpiresIn) {
    logger.error('❌ JWT_EXPIRE must be in format like "7d", "24h", "60m", or "3600s"');
    process.env.JWT_EXPIRE = '7d';
    logger.warn('🔧 Using default JWT_EXPIRE: 7d');
  }

  logger.info('✅ Environment variables validated');
  
  // Log current configuration (without sensitive data)
  logger.info('📋 Current Configuration:');
  logger.info(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`   JWT_EXPIRE: ${process.env.JWT_EXPIRE}`);
  logger.info(`   JWT_SECRET: ${process.env.JWT_SECRET ? '[SET]' : '[NOT SET]'}`);
  logger.info(`   MONGODB_URI: ${process.env.MONGODB_URI ? '[SET]' : '[NOT SET]'}`);
  logger.info(`   EMAIL_USER: ${process.env.EMAIL_USER ? '[SET]' : '[NOT SET]'}`);
  logger.info(`   CLOUDINARY_CLOUD_NAME: ${process.env.CLOUDINARY_CLOUD_NAME ? '[SET]' : '[NOT SET]'}`);
};