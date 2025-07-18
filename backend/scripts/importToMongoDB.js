// backend/scripts/importToMongoDB.js
import fs from 'fs/promises';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Import your Product model
import Product from '../models/Product.js';
import Category from '../models/Category.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bondex-safety';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Function to create categories based on products
const createCategories = async (products) => {
  try {
    console.log('📂 Creating categories...');
    
    // Get unique categories from products
    const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
    
    const categoryData = uniqueCategories.map(catName => {
      const normalizedName = catName.toLowerCase().trim();
      
      // Map category names to icons and colors
      const categoryConfig = {
        'foot protection': { icon: '🦶', colors: { primary: '#8B4513', secondary: '#DEB887' } },
        'eye protection': { icon: '👁️', colors: { primary: '#4169E1', secondary: '#B0C4DE' } },
        'head protection': { icon: '⛑️', colors: { primary: '#FFD700', secondary: '#FFFACD' } },
        'hand protection': { icon: '🧤', colors: { primary: '#32CD32', secondary: '#98FB98' } },
        'body protection': { icon: '🦺', colors: { primary: '#FF6347', secondary: '#FFE4E1' } },
        'ear protection': { icon: '🎧', colors: { primary: '#9370DB', secondary: '#E6E6FA' } },
        'fall protection': { icon: '🪢', colors: { primary: '#FF4500', secondary: '#FFEEE6' } },
        'respiratory protection': { icon: '😷', colors: { primary: '#00CED1', secondary: '#E0FFFF' } },
        'fabrics': { icon: '🧵', colors: { primary: '#DC143C', secondary: '#FFB6C1' } }
      };
      
      const config = categoryConfig[normalizedName] || { 
        icon: '🛡️', 
        colors: { primary: '#f59e0b', secondary: '#fef3c7' } 
      };
      
      return {
        name: catName,
        description: `High-quality ${catName.toLowerCase()} equipment for workplace safety`,
        type: 'protection_type',
        icon: config.icon,
        colors: config.colors,
        status: 'active',
        isFeatured: true,
        sortOrder: uniqueCategories.indexOf(catName)
      };
    });

    // Insert categories (ignore duplicates)
    for (const catData of categoryData) {
      try {
        await Category.findOneAndUpdate(
          { name: catData.name },
          catData,
          { upsert: true, new: true }
        );
        console.log(`✅ Category created/updated: ${catData.name}`);
      } catch (error) {
        console.log(`⚠️  Category exists: ${catData.name}`);
      }
    }

    console.log(`📂 Created ${categoryData.length} categories\n`);
    
  } catch (error) {
    console.error('❌ Error creating categories:', error.message);
  }
};

// Function to import products to MongoDB
const importProducts = async () => {
  try {
    console.log('🚀 Starting MongoDB import...\n');

    // Connect to database
    await connectDB();

    // Read migrated products JSON
    console.log('📖 Reading migrated products...');
    const jsonContent = await fs.readFile('migration/migrated_products.json', 'utf8');
    const products = JSON.parse(jsonContent);
    
    console.log(`Found ${products.length} products to import\n`);

    // Create categories first
    await createCategories(products);

    // Import statistics
    const stats = {
      total: products.length,
      created: 0,
      updated: 0,
      errors: 0
    };

    console.log('📦 Importing products...');

    // Process each product
    for (let i = 0; i < products.length; i++) {
      const productData = products[i];
      
      try {
        console.log(`Processing ${i + 1}/${products.length}: ${productData.product_name}`);

        // Check if product already exists (by product_id or name)
        const existingProduct = await Product.findOne({
          $or: [
            { product_id: productData.product_id },
            { product_name: productData.product_name }
          ]
        });

        if (existingProduct) {
          // Update existing product with new Cloudinary data
          await Product.findByIdAndUpdate(existingProduct._id, {
            ...productData,
            updatedAt: new Date()
          });
          
          console.log(`✅ Updated: ${productData.product_name}`);
          stats.updated++;
          
        } else {
          // Create new product
          const newProduct = new Product(productData);
          await newProduct.save();
          
          console.log(`✅ Created: ${productData.product_name}`);
          stats.created++;
        }

      } catch (error) {
        console.error(`❌ Error with ${productData.product_name}:`, error.message);
        stats.errors++;
      }
    }

    // Update category product counts
    console.log('\n📊 Updating category product counts...');
    const categories = await Category.find({});
    
    for (const category of categories) {
      const productCount = await Product.countDocuments({ category: category.name });
      await Category.findByIdAndUpdate(category._id, { productCount });
      console.log(`📊 ${category.name}: ${productCount} products`);
    }

    // Print import summary
    console.log('\n🎉 Import Complete!');
    console.log('==========================================');
    console.log(`📊 Total Products: ${stats.total}`);
    console.log(`✅ Created: ${stats.created}`);
    console.log(`🔄 Updated: ${stats.updated}`);
    console.log(`❌ Errors: ${stats.errors}`);
    console.log('==========================================\n');

    console.log('🎯 Next Steps:');
    console.log('1. Test your API: GET /api/products');
    console.log('2. Check categories: GET /api/categories');
    console.log('3. View products in your frontend');
    console.log('4. Set proper prices for products (currently 0)');

  } catch (error) {
    console.error('💥 Import failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔒 MongoDB connection closed');
  }
};

// Function to backup current database before import
const backupDatabase = async () => {
  try {
    console.log('💾 Creating database backup...');
    
    await connectDB();
    
    const products = await Product.find({});
    const categories = await Category.find({});
    
    const backup = {
      timestamp: new Date().toISOString(),
      products,
      categories
    };
    
    const backupFilename = `migration/backup_${Date.now()}.json`;
    await fs.writeFile(backupFilename, JSON.stringify(backup, null, 2));
    
    console.log(`✅ Backup saved to: ${backupFilename}`);
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
  }
};

// Function to clear database (use with caution!)
const clearDatabase = async () => {
  try {
    console.log('⚠️  Clearing database...');
    
    await connectDB();
    
    await Product.deleteMany({});
    await Category.deleteMany({});
    
    console.log('✅ Database cleared');
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Clear failed:', error.message);
  }
};

// Function to set sample prices (since CSV has 0 prices)
const setSamplePrices = async () => {
  try {
    console.log('💰 Setting sample prices...');
    
    await connectDB();
    
    const products = await Product.find({ product_price: 0 });
    
    for (const product of products) {
      // Set sample prices based on category
      let price = 0;
      const category = product.category.toLowerCase();
      
      if (category.includes('foot')) price = Math.floor(Math.random() * 5000) + 3000; // KES 3000-8000
      else if (category.includes('head')) price = Math.floor(Math.random() * 3000) + 2000; // KES 2000-5000
      else if (category.includes('eye')) price = Math.floor(Math.random() * 2000) + 800; // KES 800-2800
      else if (category.includes('hand')) price = Math.floor(Math.random() * 1500) + 500; // KES 500-2000
      else if (category.includes('body')) price = Math.floor(Math.random() * 4000) + 2500; // KES 2500-6500
      else price = Math.floor(Math.random() * 2000) + 1000; // KES 1000-3000
      
      await Product.findByIdAndUpdate(product._id, { product_price: price });
      console.log(`💰 ${product.product_name}: KES ${price.toLocaleString()}`);
    }
    
    console.log(`✅ Updated prices for ${products.length} products`);
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Price update failed:', error.message);
  }
};

// Run based on command line argument
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  switch (command) {
    case 'backup':
      backupDatabase();
      break;
      
    case 'clear':
      console.log('⚠️  WARNING: This will delete all products and categories!');
      console.log('Type "yes" to confirm:');
      process.stdin.setEncoding('utf8');
      process.stdin.on('readable', () => {
        const chunk = process.stdin.read();
        if (chunk === 'yes\n') {
          clearDatabase();
        } else {
          console.log('❌ Cancelled');
          process.exit(0);
        }
      });
      break;
      
    case 'import':
      importProducts();
      break;
      
    case 'prices':
      setSamplePrices();
      break;
      
    default:
      console.log('Bondex Safety - MongoDB Import Tool');
      console.log('===================================\n');
      console.log('Usage:');
      console.log('  node scripts/importToMongoDB.js backup  - Backup current database');
      console.log('  node scripts/importToMongoDB.js clear   - Clear database (DANGEROUS!)');
      console.log('  node scripts/importToMongoDB.js import  - Import migrated products');
      console.log('  node scripts/importToMongoDB.js prices  - Set sample prices (KES)');
      console.log('\nMake sure migration/migrated_products.json exists first!');
      break;
  }
}

export { importProducts, backupDatabase, clearDatabase, setSamplePrices };