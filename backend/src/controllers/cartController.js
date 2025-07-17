// backend/src/controllers/cartController.js
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import asyncHandler from 'express-async-handler';
import logger from '../config/logger.js';

// @desc    Get user's cart (Private)
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id })
    .populate('items.product', 'name price images stock status protectionType industry');

  if (!cart) {
    // Create empty cart for user
    cart = await Cart.create({
      user: req.user.id,
      items: []
    });
  }

  // Filter out inactive products or out of stock items
  const validItems = cart.items.filter(item => 
    item.product && 
    item.product.status === 'active' && 
    item.product.stock > 0
  );

  // If items were filtered out, update cart
  if (validItems.length !== cart.items.length) {
    cart.items = validItems;
    await cart.save();
  }

  res.status(200).json({
    success: true,
    data: {
      cart,
      summary: {
        totalItems: cart.totalItems,
        subtotal: cart.subtotal,
        formattedSubtotal: cart.formattedSubtotal,
        discountAmount: cart.discountAmount,
        total: cart.subtotal - cart.discountAmount
      }
    }
  });
});

// @desc    Add item to cart (Private)
// @route   POST /api/cart/add
// @access  Private
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  // Validate product exists and is available
  const product = await Product.findById(productId);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  if (product.status !== 'active') {
    return res.status(400).json({
      success: false,
      message: 'Product is not available'
    });
  }

  if (product.stock < quantity) {
    return res.status(400).json({
      success: false,
      message: `Insufficient stock. Only ${product.stock} items available.`
    });
  }

  // Find or create cart
  let cart = await Cart.findOne({ user: req.user.id });
  
  if (!cart) {
    cart = new Cart({
      user: req.user.id,
      items: []
    });
  }

  // Check if item already exists in cart
  const existingItem = cart.items.find(item => 
    item.product.toString() === productId
  );

  if (existingItem) {
    // Update quantity (max 10 per product)
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > 10) {
      return res.status(400).json({
        success: false,
        message: 'Cannot add more than 10 items of the same product'
      });
    }

    if (newQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Cannot add more items. Only ${product.stock} in stock.`
      });
    }

    existingItem.quantity = newQuantity;
    existingItem.price = product.currentPrice; // Update price in case it changed
  } else {
    // Add new item
    cart.items.push({
      product: productId,
      quantity,
      price: product.currentPrice
    });
  }

  await cart.save();

  // Populate cart for response
  await cart.populate('items.product', 'name price images stock');

  logger.info(`Product ${product.name} added to cart for user ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'Item added to cart successfully',
    data: {
      cart,
      summary: {
        totalItems: cart.totalItems,
        subtotal: cart.subtotal,
        formattedSubtotal: cart.formattedSubtotal
      }
    }
  });
});

// @desc    Update cart item quantity (Private)
// @route   PUT /api/cart/update
// @access  Private
export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (quantity < 0 || quantity > 10) {
    return res.status(400).json({
      success: false,
      message: 'Quantity must be between 0 and 10'
    });
  }

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  const item = cart.items.find(item => 
    item.product.toString() === productId
  );

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found in cart'
    });
  }

  // Check stock availability
  const product = await Product.findById(productId);
  if (quantity > product.stock) {
    return res.status(400).json({
      success: false,
      message: `Only ${product.stock} items available in stock`
    });
  }

  if (quantity === 0) {
    // Remove item from cart
    cart.items = cart.items.filter(item => 
      item.product.toString() !== productId
    );
  } else {
    // Update quantity
    item.quantity = quantity;
    item.price = product.currentPrice; // Update price
  }

  await cart.save();
  await cart.populate('items.product', 'name price images stock');

  res.status(200).json({
    success: true,
    message: 'Cart updated successfully',
    data: {
      cart,
      summary: {
        totalItems: cart.totalItems,
        subtotal: cart.subtotal,
        formattedSubtotal: cart.formattedSubtotal
      }
    }
  });
});

// @desc    Remove item from cart (Private)
// @route   DELETE /api/cart/remove/:productId
// @access  Private
export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  // Remove item
  const initialLength = cart.items.length;
  cart.items = cart.items.filter(item => 
    item.product.toString() !== productId
  );

  if (cart.items.length === initialLength) {
    return res.status(404).json({
      success: false,
      message: 'Item not found in cart'
    });
  }

  await cart.save();
  await cart.populate('items.product', 'name price images stock');

  res.status(200).json({
    success: true,
    message: 'Item removed from cart successfully',
    data: {
      cart,
      summary: {
        totalItems: cart.totalItems,
        subtotal: cart.subtotal,
        formattedSubtotal: cart.formattedSubtotal
      }
    }
  });
});

// @desc    Clear entire cart (Private)
// @route   DELETE /api/cart/clear
// @access  Private
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  cart.items = [];
  cart.couponCode = undefined;
  cart.discountAmount = 0;
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Cart cleared successfully',
    data: {
      cart,
      summary: {
        totalItems: 0,
        subtotal: 0,
        formattedSubtotal: 'KES 0'
      }
    }
  });
});

// @desc    Apply coupon to cart (Private)
// @route   POST /api/cart/coupon
// @access  Private
export const applyCoupon = asyncHandler(async (req, res) => {
  const { couponCode } = req.body;

  if (!couponCode) {
    return res.status(400).json({
      success: false,
      message: 'Coupon code is required'
    });
  }

  const cart = await Cart.findOne({ user: req.user.id })
    .populate('items.product');

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cart is empty'
    });
  }

  // Find coupon
  const coupon = await Coupon.findOne({
    code: couponCode.toUpperCase(),
    isActive: true
  });

  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: 'Invalid coupon code'
    });
  }

  // Check if coupon is valid
  if (!coupon.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Coupon has expired or reached usage limit'
    });
  }

  // Check minimum order amount
  if (cart.subtotal < coupon.minimumOrderAmount) {
    return res.status(400).json({
      success: false,
      message: `Minimum order amount of KES ${coupon.minimumOrderAmount.toLocaleString()} required`
    });
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.type === 'percentage') {
    discountAmount = (cart.subtotal * coupon.value) / 100;
    if (coupon.maximumDiscountAmount) {
      discountAmount = Math.min(discountAmount, coupon.maximumDiscountAmount);
    }
  } else {
    discountAmount = coupon.value;
  }

  // Apply coupon
  cart.couponCode = coupon.code;
  cart.discountAmount = discountAmount;
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Coupon applied successfully',
    data: {
      cart,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount
      },
      summary: {
        totalItems: cart.totalItems,
        subtotal: cart.subtotal,
        discountAmount,
        total: cart.subtotal - discountAmount,
        formattedTotal: new Intl.NumberFormat('en-KE', {
          style: 'currency',
          currency: 'KES'
        }).format(cart.subtotal - discountAmount)
      }
    }
  });
});

// @desc    Remove coupon from cart (Private)
// @route   DELETE /api/cart/coupon
// @access  Private
export const removeCoupon = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  cart.couponCode = undefined;
  cart.discountAmount = 0;
  await cart.save();

  await cart.populate('items.product', 'name price images stock');

  res.status(200).json({
    success: true,
    message: 'Coupon removed successfully',
    data: {
      cart,
      summary: {
        totalItems: cart.totalItems,
        subtotal: cart.subtotal,
        formattedSubtotal: cart.formattedSubtotal
      }
    }
  });
});

// @desc    Get cart summary (Private)
// @route   GET /api/cart/summary
// @access  Private
export const getCartSummary = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(200).json({
      success: true,
      data: {
        totalItems: 0,
        subtotal: 0,
        discountAmount: 0,
        total: 0,
        formattedTotal: 'KES 0',
        isEmpty: true
      }
    });
  }

  const total = cart.subtotal - cart.discountAmount;

  res.status(200).json({
    success: true,
    data: {
      totalItems: cart.totalItems,
      subtotal: cart.subtotal,
      discountAmount: cart.discountAmount,
      total,
      formattedSubtotal: cart.formattedSubtotal,
      formattedTotal: new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES'
      }).format(total),
      isEmpty: cart.items.length === 0,
      couponCode: cart.couponCode
    }
  });
});