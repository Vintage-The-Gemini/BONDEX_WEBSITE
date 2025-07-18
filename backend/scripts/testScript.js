// backend/scripts/testScript.js
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

// Load environment variables
dotenv.config();

console.log('🔍 Testing Basic Setup...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test Cloudinary connection
const testCloudinary = async () => {
  try {
    console.log('\n🔍 Testing Cloudinary connection...');
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful!');
    console.log('Status:', result.status);
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:');
    console.error('Error:', error.message);
    return false;
  }
};

// Check if CSV exists
const checkCSV = async () => {
  try {
    console.log('\n📁 Checking for CSV file...');
    const { readFile } = await import('fs/promises');
    
    // Try different locations
    const possiblePaths = [
      '../products 2.csv',
      './products 2.csv', 
      '../../products 2.csv',
      '../products2.csv',
      './products2.csv'
    ];
    
    for (const csvPath of possiblePaths) {
      try {
        await readFile(csvPath);
        console.log(`✅ Found CSV at: ${csvPath}`);
        return csvPath;
      } catch (error) {
        console.log(`❌ CSV not found at: ${csvPath}`);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error checking CSV:', error.message);
    return null;
  }
};

// Check migration folder
const checkMigrationFolder = async () => {
  try {
    console.log('\n📂 Checking migration folders...');
    const { readdir } = await import('fs/promises');
    
    const possiblePaths = [
      '../migration',
      './migration',
      '../../migration',
      '../migration/images',
      './migration/images'
    ];
    
    for (const migrationPath of possiblePaths) {
      try {
        const folders = await readdir(migrationPath);
        console.log(`✅ Found migration folder at: ${migrationPath}`);
        console.log('📁 Image folders:', folders.join(', '));
        return migrationPath;
      } catch (error) {
        console.log(`❌ Migration folder not found at: ${migrationPath}`);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error checking migration folder:', error.message);
    return null;
  }
};

// Run all tests
const runTests = async () => {
  console.log('🚀 Running comprehensive setup test...\n');
  
  const cloudinaryWorking = await testCloudinary();
  const csvPath = await checkCSV();
  const migrationPath = await checkMigrationFolder();
  
  console.log('\n📊 Test Results:');
  console.log('=================');
  console.log('Cloudinary:', cloudinaryWorking ? '✅ Working' : '❌ Failed');
  console.log('CSV File:', csvPath ? '✅ Found' : '❌ Missing');
  console.log('Migration Folder:', migrationPath ? '✅ Found' : '❌ Missing');
  
  if (cloudinaryWorking && csvPath && migrationPath) {
    console.log('\n🎉 All checks passed! Ready for migration.');
  } else {
    console.log('\n⚠️  Some issues need to be resolved before migration.');
  }
};

// Run all tests when script is executed
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(error => {
    console.error('💥 Test failed:', error.message);
    process.exit(1);
  });
}