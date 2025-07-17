// backend/src/routes/cart.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  getCartSummary
} from '../controllers/cartController.js';

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.route('/')
  .get(getCart);

router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);

router.route('/coupon')
  .post(applyCoupon)
  .delete(removeCoupon);

router.get('/summary', getCartSummary);

export default router;