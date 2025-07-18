// backend/scripts/deleteCloudinaryImages.js
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

// Load environment variables
dotenv.config();

console.log('🗑️  Cloudinary Cleanup Tool - Bondex Safety\n');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test Cloudinary connection
async function testConnection() {
  try {
    console.log('🔍 Testing Cloudinary connection...');
    const result = await cloudinary.api.ping();
    console.log('✅ Connected to Cloudinary successfully!\n');
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    return false;
  }
}

// List all resources in bondex-safety folder
async function listBondexImages() {
  try {
    console.log('📋 Finding all Bondex Safety images...\n');
    
    const resources = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'bondex-safety/',
      max_results: 500 // Increase if you have more images
    });
    
    if (resources.resources.length === 0) {
      console.log('✅ No Bondex Safety images found in Cloudinary');
      return [];
    }
    
    console.log(`Found ${resources.resources.length} images in bondex-safety/ folder:`);
    resources.resources.forEach((resource, index) => {
      console.log(`${index + 1}. ${resource.public_id}`);
      console.log(`   URL: ${resource.secure_url}`);
      console.log(`   Size: ${(resource.bytes / 1024).toFixed(2)} KB`);
      console.log('');
    });
    
    return resources.resources;
    
  } catch (error) {
    console.error('❌ Error listing images:', error.message);
    return [];
  }
}

// Delete all bondex-safety images
async function deleteAllBondexImages() {
  try {
    console.log('🗑️  Deleting all Bondex Safety images...\n');
    
    const resources = await listBondexImages();
    
    if (resources.length === 0) {
      console.log('✅ Nothing to delete!');
      return;
    }
    
    const stats = { total: resources.length, deleted: 0, failed: 0 };
    
    for (const resource of resources) {
      try {
        console.log(`🗑️  Deleting: ${resource.public_id}`);
        
        const result = await cloudinary.uploader.destroy(resource.public_id);
        
        if (result.result === 'ok') {
          console.log(`   ✅ Deleted successfully`);
          stats.deleted++;
        } else {
          console.log(`   ⚠️  Delete result: ${result.result}`);
          stats.failed++;
        }
        
      } catch (error) {
        console.error(`   ❌ Failed to delete: ${error.message}`);
        stats.failed++;
      }
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('\n🎉 Cleanup Complete!');
    console.log('===================');
    console.log(`📊 Total Images: ${stats.total}`);
    console.log(`✅ Successfully Deleted: ${stats.deleted}`);
    console.log(`❌ Failed to Delete: ${stats.failed}`);
    
  } catch (error) {
    console.error('💥 Cleanup failed:', error.message);
  }
}

// Delete specific images by public_id
async function deleteSpecificImages(publicIds) {
  try {
    console.log(`🗑️  Deleting ${publicIds.length} specific images...\n`);
    
    const stats = { total: publicIds.length, deleted: 0, failed: 0 };
    
    for (const publicId of publicIds) {
      try {
        console.log(`🗑️  Deleting: ${publicId}`);
        
        const result = await cloudinary.uploader.destroy(publicId);
        
        if (result.result === 'ok') {
          console.log(`   ✅ Deleted successfully`);
          stats.deleted++;
        } else {
          console.log(`   ⚠️  Delete result: ${result.result}`);
          stats.failed++;
        }
        
      } catch (error) {
        console.error(`   ❌ Failed to delete: ${error.message}`);
        stats.failed++;
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('\n🎉 Specific Cleanup Complete!');
    console.log('==============================');
    console.log(`📊 Total Images: ${stats.total}`);
    console.log(`✅ Successfully Deleted: ${stats.deleted}`);
    console.log(`❌ Failed to Delete: ${stats.failed}`);
    
  } catch (error) {
    console.error('💥 Specific cleanup failed:', error.message);
  }
}

// Delete bondex-safety folder completely
async function deleteBondexFolder() {
  try {
    console.log('🗑️  Deleting entire bondex-safety folder...\n');
    
    // First delete all resources in the folder
    await deleteAllBondexImages();
    
    // Then try to delete the folder structure
    try {
      await cloudinary.api.delete_folder('bondex-safety/products');
      console.log('✅ Deleted products folder');
    } catch (error) {
      console.log('⚠️  Products folder may not exist or already empty');
    }
    
    try {
      await cloudinary.api.delete_folder('bondex-safety');
      console.log('✅ Deleted bondex-safety folder');
    } catch (error) {
      console.log('⚠️  Main folder may not exist or already empty');
    }
    
    console.log('\n🎉 Complete folder cleanup finished!');
    
  } catch (error) {
    console.error('💥 Folder cleanup failed:', error.message);
  }
}

// Backup function - save image URLs before deleting
async function backupImageList() {
  try {
    console.log('💾 Creating backup of image list...\n');
    
    const resources = await listBondexImages();
    
    if (resources.length === 0) {
      console.log('✅ No images to backup');
      return;
    }
    
    const backup = {
      timestamp: new Date().toISOString(),
      total_images: resources.length,
      images: resources.map(resource => ({
        public_id: resource.public_id,
        url: resource.secure_url,
        size_kb: Math.round(resource.bytes / 1024),
        format: resource.format,
        created_at: resource.created_at
      }))
    };
    
    await fs.writeFile(
      `../migration/cloudinary_backup_${Date.now()}.json`,
      JSON.stringify(backup, null, 2)
    );
    
    console.log(`✅ Backup saved to: ../migration/cloudinary_backup_${Date.now()}.json`);
    console.log(`📊 Backed up ${resources.length} image records\n`);
    
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
  }
}

// Main function
async function main() {
  const command = process.argv[2];
  
  const connected = await testConnection();
  if (!connected) {
    console.log('❌ Cannot proceed without Cloudinary connection');
    return;
  }
  
  switch (command) {
    case 'list':
      await listBondexImages();
      break;
      
    case 'backup':
      await backupImageList();
      break;
      
    case 'delete-all':
      console.log('⚠️  WARNING: This will delete ALL Bondex Safety images!');
      console.log('Are you sure? This action cannot be undone.');
      console.log('If you are sure, run: node scripts/deleteCloudinaryImages.js confirm-delete-all');
      break;
      
    case 'confirm-delete-all':
      await deleteAllBondexImages();
      break;
      
    case 'delete-folder':
      console.log('⚠️  WARNING: This will delete the ENTIRE bondex-safety folder!');
      console.log('Are you sure? This action cannot be undone.');
      console.log('If you are sure, run: node scripts/deleteCloudinaryImages.js confirm-delete-folder');
      break;
      
    case 'confirm-delete-folder':
      await deleteBondexFolder();
      break;
      
    default:
      console.log('Cloudinary Cleanup Tool');
      console.log('=======================\n');
      console.log('Usage:');
      console.log('  node scripts/deleteCloudinaryImages.js list              - List all Bondex images');
      console.log('  node scripts/deleteCloudinaryImages.js backup            - Backup image list to JSON');
      console.log('  node scripts/deleteCloudinaryImages.js delete-all        - Delete all Bondex images (with confirmation)');
      console.log('  node scripts/deleteCloudinaryImages.js delete-folder     - Delete entire bondex-safety folder (with confirmation)');
      console.log('\n⚠️  IMPORTANT: Always backup before deleting!');
      break;
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error.message);
  process.exit(1);
});