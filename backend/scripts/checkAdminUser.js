// backend/scripts/checkAdminUser.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const checkAdminUser = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bondex-safety';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Find all admin users
    const adminUsers = await User.find({ role: 'admin' });
    
    console.log('\n📋 Admin Users in Database:');
    console.log('============================');
    
    if (adminUsers.length === 0) {
      console.log('❌ NO ADMIN USERS FOUND!');
      console.log('You need to create an admin user first.');
      console.log('\nRun: node scripts/createAdmin.js');
    } else {
      adminUsers.forEach((admin, index) => {
        console.log(`\n👤 Admin ${index + 1}:`);
        console.log(`   ID: ${admin._id}`);
        console.log(`   Name: ${admin.name}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   Status: ${admin.status}`);
        console.log(`   Email Verified: ${admin.isEmailVerified}`);
        console.log(`   Created: ${admin.createdAt}`);
        console.log(`   Last Login: ${admin.lastLogin || 'Never'}`);
        console.log(`   Login Attempts: ${admin.loginAttempts || 0}`);
        console.log(`   Account Locked: ${admin.isLocked || false}`);
      });
    }

    // Check for any users (not just admins)
    const allUsers = await User.find({});
    console.log(`\n📊 Total Users in Database: ${allUsers.length}`);
    
    if (allUsers.length > 0) {
      console.log('\n👥 All Users:');
      allUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (${user.role}) - ${user.status}`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking admin user:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the script
checkAdminUser();