import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  adminLogin
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);

// Admin routes
router.post('/admin/login', adminLogin);

// Protected routes (require authentication)
router.use(protect); // All routes below this middleware require authentication

router.get('/me', getMe);
router.post('/logout', logout);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);

export default router;