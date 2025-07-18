// backend/scripts/migrateCsvToCloudinary.js
import fs from 'fs/promises';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Simple CSV parser (in case papaparse isn't available)
const parseCSV = (csvContent) => {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index]?.replace(/"/g, '') || '';
      });
      data.push(row);
    }
  }
  
  return { data, meta: { fields: headers } };
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Mapping your CSV categories to folder names and Cloudinary folders
const categoryFolderMap = {
  // Normalize category names to match your EXACT folder names
  'foot protection': {
    localFolder: 'Foot protection',
    cloudinaryFolder: 'bondex-safety/products/foot-protection'
  },
  'eye protection': {
    localFolder: 'Eye__images', 
    cloudinaryFolder: 'bondex-safety/products/eye-protection'
  },
  'head protection': {
    localFolder: 'Head__images',
    cloudinaryFolder: 'bondex-safety/products/head-protection'
  },
  'hand protection': {
    localFolder: 'Hand__images',
    cloudinaryFolder: 'bondex-safety/products/hand-protection'
  },
  'body protection': {
    localFolder: 'body protec',
    cloudinaryFolder: 'bondex-safety/products/body-protection'
  },
  'ear protection': {
    localFolder: 'Ear Protection',
    cloudinaryFolder: 'bondex-safety/products/ear-protection'
  },
  'fall protection': {
    localFolder: 'Fall__images',
    cloudinaryFolder: 'bondex-safety/products/fall-protection'
  },
  'respiratory protection': {
    localFolder: 'Face__images',
    cloudinaryFolder: 'bondex-safety/products/respiratory-protection'
  },
  'fabrics': {
    localFolder: 'fabrics',
    cloudinaryFolder: 'bondex-safety/products/fabrics'
  }
};

// Function to normalize category name
const normalizeCategory = (category) => {
  if (!category) return 'general';
  return category.toLowerCase().trim();
};

// Function to clean filename for Cloudinary public_id
const cleanFilename = (filename) => {
  return filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9_-]/g, '_') // Replace special chars with underscore
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .toLowerCase();
};

// Function to find image file in migration folders
const findImageFile = async (imagePath, category) => {
  try {
    // Clean up the image path from CSV
    let cleanPath = imagePath.replace(/\\/g, '/'); // Fix backslashes
    
    // Remove leading "images/" if present
    if (cleanPath.startsWith('images/')) {
      cleanPath = cleanPath.replace('images/', '');
    }
    
    // Try different possible locations
    const possiblePaths = [
      // Direct path as specified in CSV
      `migration/images/${cleanPath}`,
      
      // Try category folder mapping
      ...(categoryFolderMap[normalizeCategory(category)] ? [
        `migration/images/${categoryFolderMap[normalizeCategory(category)].localFolder}/${path.basename(cleanPath)}`
      ] : []),
      
      // Try just filename in category folder
      `migration/images/${category}/${path.basename(cleanPath)}`,
      
      // Try searching in all folders for the filename
      ...(await searchInAllFolders(path.basename(cleanPath)))
    ];

    for (const filePath of possiblePaths) {
      try {
        await fs.access(filePath);
        console.log(`✅ Found image: ${filePath}`);
        return filePath;
      } catch (error) {
        // File not found, try next path
        continue;
      }
    }

    console.log(`⚠️  Image not found: ${imagePath} (tried ${possiblePaths.length} locations)`);
    return null;

  } catch (error) {
    console.error(`Error finding image ${imagePath}:`, error.message);
    return null;
  }
};

// Function to search for filename in all migration folders
const searchInAllFolders = async (filename) => {
  const searchPaths = [];
  
  try {
    const migrationPath = '../migration';
    const folders = await fs.readdir(migrationPath, { withFileTypes: true });
    
    for (const folder of folders) {
      if (folder.isDirectory()) {
        searchPaths.push(`${migrationPath}/${folder.name}/${filename}`);
      }
    }
  } catch (error) {
    // Migration folder might not exist yet
  }
  
  return searchPaths;
};

// Function to upload image to Cloudinary
const uploadToCloudinary = async (localPath, category, filename, productName) => {
  try {
    // Determine Cloudinary folder
    const normalizedCategory = normalizeCategory(category);
    const cloudinaryFolder = categoryFolderMap[normalizedCategory]?.cloudinaryFolder || 
                            'bondex-safety/products/general';

    // Create unique public_id
    const cleanName = cleanFilename(productName);
    const cleanFile = cleanFilename(filename);
    const timestamp = Date.now();
    const publicId = `${cleanName}-${cleanFile}-${timestamp}`;

    console.log(`📤 Uploading: ${path.basename(localPath)} → ${cloudinaryFolder}/${publicId}`);

    // Read and upload file
    const fileBuffer = await fs.readFile(localPath);
    const base64Image = `data:image/png;base64,${fileBuffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: cloudinaryFolder,
      public_id: publicId,
      overwrite: false,
      resource_type: 'auto',
      transformation: [
        {
          width: 800,
          height: 600,
          crop: 'fill',
          quality: 'auto:good',
          fetch_format: 'auto'
        }
      ]
    });

    console.log(`✅ Uploaded successfully: ${result.secure_url}`);

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      folder: cloudinaryFolder,
      original_filename: filename,
      size: result.bytes,
      format: result.format
    };

  } catch (error) {
    console.error(`❌ Upload failed for ${filename}:`, error.message);
    return {
      success: false,
      error: error.message,
      original_filename: filename
    };
  }
};

// Main migration function
const migrateCsvToCloudinary = async () => {
  try {
    console.log('🚀 Starting CSV to Cloudinary Migration...\n');

    // Read and parse CSV
    console.log('📖 Reading products CSV...');
    const csvContent = await fs.readFile('../products (2).csv', 'utf8');
    
    const parsedData = parseCSV(csvContent);

    const products = parsedData.data;
    console.log(`Found ${products.length} products in CSV\n`);

    // Migration statistics
    const stats = {
      total: products.length,
      successful: 0,
      failed: 0,
      noImage: 0,
      imageNotFound: 0
    };

    // Store results for MongoDB import later
    const migratedProducts = [];

    // Process each product
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`\n--- Processing ${i + 1}/${products.length}: ${product.product_name} ---`);

      // Skip products without images
      if (!product.product_image || product.product_image.trim() === '') {
        console.log('⚠️  No image specified, skipping...');
        stats.noImage++;
        continue;
      }

      try {
        // Find the image file locally
        const localImagePath = await findImageFile(product.product_image, product.category);
        
        if (!localImagePath) {
          console.log('❌ Image file not found locally');
          stats.imageNotFound++;
          continue;
        }

        // Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(
          localImagePath,
          product.category,
          product.product_image,
          product.product_name
        );

        if (uploadResult.success) {
          // Prepare product data for MongoDB
          const productData = {
            // Original CSV data
            product_id: product.product_id,
            product_name: product.product_name.trim(),
            product_brand: product.product_brand?.trim() || '',
            category: product.category?.trim() || '',
            product_description: product.product_description?.trim() || '',
            links: product.links?.trim() || '',
            product_price: product.product_price || 0,
            
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
            isFeatured: false
          };

          migratedProducts.push(productData);
          stats.successful++;
          
          console.log(`✅ Product migrated successfully!`);
          
        } else {
          stats.failed++;
        }

      } catch (error) {
        console.error(`💥 Error processing ${product.product_name}:`, error.message);
        stats.failed++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Save migrated data to JSON file for MongoDB import
    await fs.writeFile(
      '../migration/migrated_products.json',
      JSON.stringify(migratedProducts, null, 2)
    );

    // Print migration summary
    console.log('\n🎉 Migration Complete!');
    console.log('==========================================');
    console.log(`📊 Total Products: ${stats.total}`);
    console.log(`✅ Successfully Migrated: ${stats.successful}`);
    console.log(`❌ Failed Uploads: ${stats.failed}`);
    console.log(`⚠️  No Image Specified: ${stats.noImage}`);
    console.log(`🔍 Image Files Not Found: ${stats.imageNotFound}`);
    console.log(`📁 Migrated data saved to: ../migration/migrated_products.json`);
    console.log('==========================================\n');

    console.log('🎯 Next Steps:');
    console.log('1. Review migration/migrated_products.json');
    console.log('2. Import data to MongoDB using: npm run import:products');
    console.log('3. Test your application with new Cloudinary images');

  } catch (error) {
    console.error('💥 Migration failed:', error.message);
    process.exit(1);
  }
};

// Test Cloudinary connection
const testConnection = async () => {
  try {
    console.log('🔍 Testing Cloudinary connection...');
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful!', result);
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    console.error('Please check your .env file for correct Cloudinary credentials');
    return false;
  }
};

// Run migration based on command line argument
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  switch (command) {
    case 'test':
      testConnection();
      break;
      
    case 'migrate':
      testConnection().then(connected => {
        if (connected) {
          migrateCsvToCloudinary();
        } else {
          process.exit(1);
        }
      });
      break;
      
    default:
      console.log('Bondex Safety - CSV to Cloudinary Migration');
      console.log('===========================================\n');
      console.log('Usage:');
      console.log('  node scripts/migrateCsvToCloudinary.js test     - Test Cloudinary connection');
      console.log('  node scripts/migrateCsvToCloudinary.js migrate  - Migrate all images');
      console.log('\nMake sure your CSV is named "products 2.csv" in the root directory');
      break;
  }
}

export { migrateCsvToCloudinary, testConnection };