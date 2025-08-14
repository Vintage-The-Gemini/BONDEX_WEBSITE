// File Path: backend/scripts/dropSkuIndex.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dropSkuIndex = async () => {
  try {
    console.log('🔧 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('products');

    console.log('🔍 Checking existing indexes...');
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(i => i.name));

    // Drop SKU index if it exists
    try {
      await collection.dropIndex('sku_1');
      console.log('✅ Dropped SKU index successfully');
    } catch (error) {
      if (error.codeName === 'IndexNotFound') {
        console.log('ℹ️ SKU index not found (already dropped or never existed)');
      } else {
        console.error('❌ Error dropping SKU index:', error.message);
      }
    }

    // Also try to drop any other SKU-related indexes
    try {
      const allIndexes = await collection.indexes();
      for (const index of allIndexes) {
        if (index.name.includes('sku') && index.name !== '_id_') {
          await collection.dropIndex(index.name);
          console.log(`✅ Dropped index: ${index.name}`);
        }
      }
    } catch (error) {
      console.log('ℹ️ No additional SKU indexes to drop');
    }

    console.log('🔍 Final indexes:');
    const finalIndexes = await collection.indexes();
    console.log(finalIndexes.map(i => i.name));

    console.log('🎉 SKU index cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

dropSkuIndex();
