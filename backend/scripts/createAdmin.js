// backend/scripts/createAdmin.js
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bondex-safety';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Admin details - CHANGE THESE VALUES
    const adminData = {
      name: 'Bondex Admin',
      email: 'admin@bondexsafety.co.ke',
      password: 'BondexAdmin123!', // CHANGE THIS PASSWORD
      phone: '+254700000000',
      role: 'admin',
      status: 'active',
      isEmailVerified: true,
      address: {
        city: 'Nairobi',
        county: 'Nairobi',
        country: 'Kenya'
      },
      preferences: {
        currency: 'KES',
        language: 'en'
      }
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: adminData.email },
        { role: 'admin' }
      ]
    });

    if (existingAdmin) {
      console.log('❌ Admin user already exists!');
      console.log('Existing admin email:', existingAdmin.email);
      process.exit(1);
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcryptjs.hash(adminData.password, saltRounds);

    // Create admin user
    const admin = new User({
      ...adminData,
      password: hashedPassword
    });

    await admin.save();

    console.log('🎉 Admin user created successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    console.log('🌐 Login at: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the script
createAdmin();