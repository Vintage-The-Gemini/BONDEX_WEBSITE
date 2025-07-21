// backend/scripts/testLogin.js
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const testLogin = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bondex-safety';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Test credentials - UPDATE THESE WITH YOUR ACTUAL CREDENTIALS
    const testEmail = 'admin@bondexsafety.co.ke'; // Change to your admin email
    const testPassword = 'BondexAdmin123!'; // Change to your admin password

    console.log('\n🔍 Testing Login Process...');
    console.log('============================');
    console.log(`Email: ${testEmail}`);
    console.log(`Password: ${testPassword}`);

    // Step 1: Find user by email
    console.log('\n📧 Step 1: Finding user by email...');
    const user = await User.findOne({ email: testEmail.toLowerCase() }).select('+password');
    
    if (!user) {
      console.log('❌ User not found with this email!');
      console.log('\nTry these emails instead:');
      const allUsers = await User.find({}, 'email role');
      allUsers.forEach(u => console.log(`   - ${u.email} (${u.role})`));
      return;
    }

    console.log('✅ User found!');
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Status: ${user.status}`);

    // Step 2: Check if user is admin
    console.log('\n🛡️ Step 2: Checking admin role...');
    if (user.role !== 'admin') {
      console.log(`❌ User role is '${user.role}', not 'admin'!`);
      return;
    }
    console.log('✅ User has admin role');

    // Step 3: Check if account is locked
    console.log('\n🔒 Step 3: Checking account lock status...');
    if (user.isLocked) {
      console.log('❌ Account is locked!');
      console.log(`   Login attempts: ${user.loginAttempts}`);
      console.log(`   Locked until: ${user.lockUntil}`);
      return;
    }
    console.log('✅ Account is not locked');

    // Step 4: Check password
    console.log('\n🔑 Step 4: Testing password...');
    console.log(`   Stored password hash: ${user.password.substring(0, 20)}...`);
    
    const isPasswordMatch = await bcryptjs.compare(testPassword, user.password);
    
    if (!isPasswordMatch) {
      console.log('❌ Password does not match!');
      console.log('\nPassword troubleshooting:');
      console.log('1. Check if password is case-sensitive');
      console.log('2. Check for extra spaces');
      console.log('3. Verify the password you used when creating admin');
      
      // Test with common passwords
      const commonPasswords = ['password', 'admin123', 'Admin123', 'admin', '123456'];
      console.log('\n🔍 Testing common passwords...');
      for (const pwd of commonPasswords) {
        const match = await bcryptjs.compare(pwd, user.password);
        if (match) {
          console.log(`✅ FOUND! Correct password is: ${pwd}`);
          break;
        }
      }
      return;
    }

    console.log('✅ Password matches!');
    
    // Step 5: Complete login simulation
    console.log('\n🎉 Step 5: Login simulation complete');
    console.log('✅ ALL CHECKS PASSED - Login should work!');
    
    // Update last login
    await user.updateLastLogin();
    console.log('✅ Last login updated');

  } catch (error) {
    console.error('❌ Error testing login:', error.message);
    console.error('Full error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the script
testLogin();