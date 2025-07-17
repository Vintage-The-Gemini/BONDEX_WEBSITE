// backend/src/routes/products.js
import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getFeaturedProducts,
  getSaleProducts,
  searchProducts,
  getLowStockProducts,
  bulkUpdateStock
} from '../controllers/productController.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/sale', getSaleProducts);
router.get('/search', searchProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/:id', getProduct);

// Admin routes
router.use(protect);
router.use(admin);

router.post('/', upload.productImages, createProduct);
router.put('/:id', upload.productImages, updateProduct);
router.delete('/:id', deleteProduct);
router.get('/admin/low-stock', getLowStockProducts);
router.put('/admin/bulk-stock', bulkUpdateStock);

export default router;