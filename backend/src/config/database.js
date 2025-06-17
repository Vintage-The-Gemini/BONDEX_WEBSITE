import mongoose from 'mongoose';
import winston from 'winston';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    winston.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    winston.info(`💰 Currency: KES (Kenyan Shilling)`);
    winston.info(`🛒 Safety Equipment E-commerce Database Ready`);
    
    return conn;
  } catch (error) {
    winston.error(`❌ Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;