import express from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get cart (works for both authenticated and guest users)
router.get('/', optionalAuth, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Cart retrieved successfully',
      data: {
        items: [],
        totalPrice: 0,
        currency: 'KES'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Add item to cart
router.post('/add', optionalAuth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      data: {
        productId,
        quantity,
        currency: 'KES'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update cart item
router.put('/update/:itemId', optionalAuth, async (req, res) => {
  try {
    const { quantity } = req.body;
    
    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      data: {
        itemId: req.params.itemId,
        quantity,
        currency: 'KES'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', optionalAuth, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Clear cart
router.delete('/clear', optionalAuth, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;