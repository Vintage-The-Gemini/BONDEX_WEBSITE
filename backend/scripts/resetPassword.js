// backend/scripts/resetPassword.js
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const resetPassword = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bondex-safety';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // New password - CHANGE THIS TO WHAT YOU WANT
    const newPassword = 'BondexAdmin123!';
    const adminEmail = 'admin@bondexsafety.co.ke';

    console.log('\n🔑 Resetting Admin Password...');
    console.log('===============================');
    console.log(`Email: ${adminEmail}`);
    console.log(`New Password: ${newPassword}`);

    // Hash the new password
    console.log('\n🔐 Hashing password...');
    const saltRounds = 12;
    const hashedPassword = await bcryptjs.hash(newPassword, saltRounds);
    console.log(`✅ Password hashed: ${hashedPassword.substring(0, 20)}...`);

    // Update the admin user
    console.log('\n💾 Updating admin user...');
    const result = await User.updateOne(
      { email: adminEmail },
      { 
        password: hashedPassword,
        loginAttempts: 0,          // Reset failed attempts
        lockUntil: undefined,      // Remove any account lock
        lastLogin: null            // Reset last login
      }
    );

    if (result.matchedCount === 0) {
      console.log('❌ Admin user not found!');
      return;
    }

    if (result.modifiedCount === 0) {
      console.log('⚠️  No changes made (password might be the same)');
    } else {
      console.log('✅ Admin password updated successfully!');
    }

    console.log('\n🎉 Password Reset Complete!');
    console.log('============================');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${newPassword}`);
    console.log('🌐 Login URL: http://localhost:3000/admin/login');
    console.log('\n⚠️  Remember to change this password after first login!');

    // Verify the new password works
    console.log('\n🔍 Verifying new password...');
    const updatedUser = await User.findOne({ email: adminEmail }).select('+password');
    const isPasswordCorrect = await bcryptjs.compare(newPassword, updatedUser.password);
    
    if (isPasswordCorrect) {
      console.log('✅ Password verification successful!');
    } else {
      console.log('❌ Password verification failed!');
    }

  } catch (error) {
    console.error('❌ Error resetting password:', error.message);
    console.error('Full error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the script
resetPassword();