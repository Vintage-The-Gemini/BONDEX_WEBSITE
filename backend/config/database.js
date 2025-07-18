// backend/config/database.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // MongoDB connection options for better performance and reliability
    const options = {
      // Connection pool settings
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      
      // Heartbeat settings
      heartbeatFrequencyMS: 10000, // Send heartbeat every 10 seconds
    };

    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bondex-safety';

    // Connect to MongoDB
    const conn = await mongoose.connect(mongoURI, options);

    console.log(`
📦 MongoDB Connected Successfully!
🌐 Host: ${conn.connection.host}
🗄️  Database: ${conn.connection.name}
📍 Port: ${conn.connection.port}
🔗 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}
⏰ Connected at: ${new Date().toLocaleString()}
    `);

    // Listen for connection events
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected from MongoDB');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('🔒 MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during MongoDB disconnection:', error);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ MongoDB Connection Failed:');
    console.error('Error:', error.message);
    console.error('Possible solutions:');
    console.error('1. Make sure MongoDB is running locally (mongod)');
    console.error('2. Check your MONGODB_URI in .env file');
    console.error('3. For MongoDB Atlas, check your connection string and network access');
    
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;