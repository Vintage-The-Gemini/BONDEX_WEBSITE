// backend/src/config/database.js
import mongoose from 'mongoose';
import logger from './logger.js';

const connectDB = async () => {
  try {
    // Remove deprecated options - they're no longer needed in v4+
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    logger.info(`💰 Currency: KES (Kenyan Shilling)`);
    logger.info(`🛒 Safety Equipment E-commerce Database Ready`);
    
    return conn;
  } catch (error) {
    logger.error(`❌ Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;