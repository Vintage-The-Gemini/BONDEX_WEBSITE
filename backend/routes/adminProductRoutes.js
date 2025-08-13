// backend/routes/adminProductRoutes.js
import express from 'express';
import { 
  uploadProductImage, 
  validateProductImages,
  logUploadActivity,
  handleUploadError 
} from '../middleware/upload.js';
import { protect, adminOnly } from '../middleware/adminAuth.js';

// Import the FIXED controller functions
import {
  createProduct,
  getAdminProducts,
  getAdminProduct,
  updateAdminProduct,
  deleteAdminProduct
} from '../controllers/adminProductController.js';

const router = express.Router();

console.log('🚨🚨🚨 NEW ADMIN PRODUCT ROUTES LOADED 🚨🚨🚨');

// Apply authentication middleware to all routes
router.use(protect);
router.use(adminOnly);

// @route   GET /api/admin/products
// @desc    Get all products for admin with pagination and filters
// @access  Private (Admin only)
router.get('/', getAdminProducts);

// @route   GET /api/admin/products/:id
// @desc    Get single product for admin
// @access  Private (Admin only)
router.get('/:id', getAdminProduct);

// @route   POST /api/admin/products
// @desc    Create new product with multi-category support and Cloudinary upload
// @access  Private (Admin only)
router.post('/', 
  (req, res, next) => {
    console.log('🚨 ROUTE HIT: POST /api/admin/products');
    console.log('📋 Body Keys:', Object.keys(req.body));
    console.log('📎 Files:', req.files?.length || 0);
    console.log('👤 Admin:', req.user?.email);
    next();
  },
  uploadProductImage.array('images', 5), // Just multer, no extra middleware
  (req, res, next) => {
    console.log('🔍 After multer - Body Keys:', Object.keys(req.body));
    console.log('📎 After multer - Files:', req.files?.length || 0);
    if (req.files && req.files.length > 0) {
      console.log('📸 File details:', req.files.map(f => ({ name: f.originalname, size: f.size })));
    }
    next();
  },
  createProduct // ✅ Use our FIXED controller
);

// @route   PUT /api/admin/products/:id
// @desc    Update product
// @access  Private (Admin only)
router.put('/:id', updateAdminProduct);

// @route   DELETE /api/admin/products/:id
// @desc    Delete product
// @access  Private (Admin only)
router.delete('/:id', deleteAdminProduct);

export default router;