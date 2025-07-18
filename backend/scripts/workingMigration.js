// backend/scripts/workingMigration.js
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// Load environment variables
dotenv.config();

console.log('🚀 Bondex Safety - Image Migration Started\n');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get category from folder name
function getCategoryFromFolder(folderName) {
  const folderToCategoryMap = {
    'Foot protection': 'foot-protection',
    'Eye__images': 'eye-protection', 
    'Head__images': 'head-protection',
    'Hand__images': 'hand-protection',
    'body protec': 'body-protection',
    'Ear Protection': 'ear-protection',
    'Fall__images': 'fall-protection',
    'Face__images': 'respiratory-protection',
    'fabrics': 'fabrics',
    'logos': 'general',
    'offers': 'promotions'
  };
  
  return folderToCategoryMap[folderName] || 'general';
}

// Simple CSV parser
function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.replace(/"/g, '').trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.replace(/"/g, '').trim());
    
    if (values.length >= headers.length) {
      const product = {};
      headers.forEach((header, index) => {
        product[header] = values[index] || '';
      });
      data.push(product);
    }
  }
  
  return data;
}

// Test Cloudinary connection
async function testCloudinary() {
  try {
    console.log('🔍 Testing Cloudinary connection...');
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connected successfully!');
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    return false;
  }
}

// Upload image to Cloudinary
async function uploadImage(imagePath, category, fileName) {
  try {
    const folder = `bondex-safety/products/${category}`;
    
    // Clean filename for public_id
    const cleanName = path.basename(fileName, path.extname(fileName))
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .toLowerCase();
    
    const publicId = `${cleanName}-${Date.now()}`;
    
    console.log(`📤 Uploading to: ${folder}/${publicId}`);
    
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: folder,
      public_id: publicId,
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 600, crop: 'fill', quality: 'auto:good' }
      ]
    });
    
    console.log(`✅ Uploaded: ${result.secure_url}`);
    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error(`❌ Upload failed for ${fileName}:`, error.message);
    return null;
  }
}

// Find image file
async function findImage(imageName, category) {
  const possiblePaths = [
    `../migration/${imageName}`,
    `../migration/${categoryMap[category.toLowerCase()]}/${imageName}`,
    `../migration/${category}/${imageName}`
  ];
  
  for (const imagePath of possiblePaths) {
    try {
      await fs.access(imagePath);
      return imagePath;
    } catch (error) {
      continue;
    }
  }
  
  // Search in all folders
  try {
    const folders = await fs.readdir('../migration');
    for (const folder of folders) {
      try {
        const folderPath = `../migration/${folder}`;
        const stat = await fs.stat(folderPath);
        if (stat.isDirectory()) {
          const imagePath = `${folderPath}/${imageName}`;
          await fs.access(imagePath);
          return imagePath;
        }
      } catch (error) {
        continue;
      }
    }
  } catch (error) {
    // Continue
  }
  
  return null;
}

// Main migration function
async function runMigration() {
  try {
    // Test Cloudinary first
    const cloudinaryOk = await testCloudinary();
    if (!cloudinaryOk) {
      console.log('❌ Cannot proceed without Cloudinary connection');
      process.exit(1);
    }
    
    // Read CSV
    console.log('\n📖 Reading CSV file...');
    const csvContent = await fs.readFile('../products (2).csv', 'utf8');
    const products = parseCSV(csvContent);
    console.log(`Found ${products.length} products`);
    
    // Migration stats
    const stats = { total: products.length, success: 0, failed: 0, noImage: 0 };
    const migratedProducts = [];
    
    // Process each product
    for (let i = 0; i < products.length; i++) { // Process ALL products now
      const product = products[i];
      console.log(`\n--- Processing ${i + 1}/${products.length}: ${product.product_name} ---`);
      
      if (!product.product_image || product.product_image.trim() === '') {
        console.log('⚠️  No image specified');
        stats.noImage++;
        continue;
      }
      
      // Clean image path
      let imageName = product.product_image.replace(/\\/g, '/');
      if (imageName.includes('/')) {
        imageName = path.basename(imageName);
      }
      
      // Find image file
      const imagePath = await findImage(imageName, product.category);
      if (!imagePath) {
        console.log(`⚠️  Image not found: ${imageName} - skipping product`);
        stats.failed++;
        continue;
      }
      
      // Upload to Cloudinary
      const uploadResult = await uploadImage(imagePath, product.category, product.product_name);
      if (uploadResult) {
        // Create complete product data for MongoDB
        const productData = {
          // Original CSV data
          product_id: product.product_id,
          product_name: product.product_name.trim(),
          product_brand: product.product_brand?.trim() || '',
          category: product.category?.trim() || '',
          product_description: product.product_description?.trim() || '',
          links: product.links?.trim() || '',
          product_price: parseFloat(product.product_price) || 0,
          
          // Cloudinary data
          product_image: uploadResult.url,
          images: [{
            url: uploadResult.url,
            public_id: uploadResult.public_id,
            alt: product.product_name
          }],
          mainImage: uploadResult.url,
          
          // Additional fields for MongoDB
          slug: product.product_name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/(^-|-$)/g, ''),
          status: 'active',
          stock: 10, // Default stock
          rating: 0,
          reviewCount: 0,
          salesCount: 0,
          isOnSale: false,
          isFeatured: false,
          lowStockThreshold: 5
        };
        
        migratedProducts.push(productData);
        stats.success++;
        console.log(`✅ Product migrated and ready for MongoDB!`);
      } else {
        stats.failed++;
      }
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Save results
    await fs.writeFile(
      '../migration/migrated_products.json',
      JSON.stringify(migratedProducts, null, 2)
    );
    
    // Summary
    console.log('\n🎉 Migration Complete!');
    console.log('======================');
    console.log(`📊 Total Products: ${stats.total}`);
    console.log(`✅ Successfully Migrated: ${stats.success}`);
    console.log(`⚠️  Images Not Found: ${stats.failed}`);
    console.log(`📝 No Image Specified: ${stats.noImage}`);
    console.log(`📁 Ready for MongoDB: ${migratedProducts.length} products`);
    console.log(`💾 Results saved to: ../migration/migrated_products.json`);
    
    if (stats.success > 0) {
      console.log('\n🎯 Next Steps:');
      console.log('1. Review migrated_products.json');
      console.log('2. Import to MongoDB: node scripts/importToMongoDB.js import');
      console.log('3. Set sample prices: node scripts/importToMongoDB.js prices');
    }
    
  } catch (error) {
    console.error('💥 Migration failed:', error.message);
    console.error(error.stack);
  }
}

// Get command line argument
const command = process.argv[2];

if (command === 'test') {
  testCloudinary();
} else if (command === 'migrate') {
  runMigration();
} else if (command === 'upload-all') {
  runMigration(); // Same function now handles all images
} else {
  console.log('Usage:');
  console.log('  node scripts/workingMigration.js test        - Test Cloudinary connection');
  console.log('  node scripts/workingMigration.js migrate     - Upload ALL images from migration folders');
  console.log('  node scripts/workingMigration.js upload-all  - Same as migrate');
  console.log('\nThis will upload EVERY image found in your migration folders!');
}