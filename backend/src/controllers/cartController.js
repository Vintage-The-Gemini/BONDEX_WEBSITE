import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';

// @desc    Get cart (Public/Private)
// @route   GET /api/cart
// @access  Public/Private
export const getCart = asyncHandler(async (req, res) => {
  let cart;

  if (req.user) {
    // Authenticated user
    cart = await Cart.findOne({ user: req.user.id })
      .populate({
        path: 'items.product',
        select: 'name price images stock status protectionType industry brand'
      });
  } else {
    // Anonymous user
    const sessionId = req.headers['x-session-id'];
    if (sessionId) {
      cart = await Cart.findOne({ sessionId })
        .populate({
          path: 'items.product',
          select: 'name price images stock status protectionType industry brand'
        });
    }
  }

  if (!cart) {
    return res.status(200).json({
      success: true,
      data: {
        items: [],
        totalItems: 0,
        subtotal: 0,
        formattedSubtotal: 'KES 0.00'
      }
    });
  }

  // Filter out products that are no longer available
  cart.items = cart.items.filter(item => 
    item.product && 
    item.product.status === 'active' && 
    item.product.stock > 0
  );

  await cart.save();

  res.status(200).json({
    success: true,
    data: {
      items: cart.items,
      totalItems: cart.totalItems,
      subtotal: cart.subtotal,
      formattedSubtotal: cart.formattedSubtotal,
      couponCode: cart.couponCode,
      discountAmount: cart.discountAmount
    }
  });
});

// @desc    Add item to cart (Public/Private)
// @route   POST /api/cart/add
// @access  Public/Private
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  // Validate product
  const product = await Product.findById(productId);
  if (!product || product.status !== 'active') {
    return res.status(404).json({
      success: false,
      message: 'Product not found or unavailable'
    });
  }

  // Check stock
  if (product.stock < quantity) {
    return res.status(400).json({
      success: false,
      message: `Only ${product.stock} items available in stock`
    });
  }

  let cart;

  if (req.user) {
    // Authenticated user
    cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }
  } else {
    // Anonymous user
    const sessionId = req.headers['x-session-id'];
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID required for anonymous users'
      });
    }

    cart = await Cart.findOne({ sessionId });
    if (!cart) {
      cart = new Cart({ sessionId, items: [] });
    }
  }

  // Use current price (considering sales)
  const currentPrice = product.currentPrice;

  cart.addItem(productId, quantity, currentPrice);
  await cart.save();

  // Populate the cart for response
  await cart.populate({
    path: 'items.product',
    select: 'name price images stock status protectionType industry brand'
  });

  res.status(200).json({
    success: true,
    message: 'Item added to cart',
    data: {
      items: cart.items,
      totalItems: cart.totalItems,
      subtotal: cart.subtotal,
      formattedSubtotal: cart.formattedSubtotal
    }
  });
});

// @desc    Update cart item quantity (Public/Private)
// @route   PUT /api/cart/update
// @access  Public/Private
export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (quantity < 0 || quantity > 10) {
    return res.status(400).json({
      success: false,
      message: 'Quantity must be between 0 and 10'
    });
  }

  let cart;

  if (req.user) {
    cart = await Cart.findOne({ user: req.user.id });
  } else {
    const sessionId = req.headers['x-session-id'];
    cart = await Cart.findOne({ sessionId });
  }

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  // Check product stock if increasing quantity
  if (quantity > 0) {
    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }
  }

  cart.updateQuantity(productId, quantity);
  await cart.save();

  // Populate the cart for response
  await cart.populate({
    path: 'items.product',
    select: 'name price images stock status protectionType industry brand'
  });

  res.status(200).json({
    success: true,
    message: quantity === 0 ? 'Item removed from cart' : 'Cart updated',
    data: {
      items: cart.items,
      totalItems: cart.totalItems,
      subtotal: cart.subtotal,
      formattedSubtotal: cart.formattedSubtotal
    }
  });
});

// @desc    Remove item from cart (Public/Private)
// @route   DELETE /api/cart/remove/:productId
// @access  Public/Private
export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  let cart;

  if (req.user) {
    cart = await Cart.findOne({ user: req.user.id });
  } else {
    const sessionId = req.headers['x-session-id'];
    cart = await Cart.findOne({ sessionId });
  }

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  cart.removeItem(productId);
  await cart.save();

  // Populate the cart for response
  await cart.populate({
    path: 'items.product',
    select: 'name price images stock status protectionType industry brand'
  });

  res.status(200).json({
    success: true,
    message: 'Item removed from cart',
    data: {
      items: cart.items,
      totalItems: cart.totalItems,
      subtotal: cart.subtotal,
      formattedSubtotal: cart.formattedSubtotal
    }
  });
});

// @desc    Clear cart (Public/Private)
// @route   DELETE /api/cart/clear
// @access  Public/Private
export const clearCart = asyncHandler(async (req, res) => {
  let cart;

  if (req.user) {
    cart = await Cart.findOne({ user: req.user.id });
  } else {
    const sessionId = req.headers['x-session-id'];
    cart = await Cart.findOne({ sessionId });
  }

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  cart.clearCart();
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Cart cleared',
    data: {
      items: [],
      totalItems: 0,
      subtotal: 0,
      formattedSubtotal: 'KES 0.00'
    }
  });
});

// @desc    Apply coupon to cart (Public/Private)
// @route   POST /api/cart/coupon
// @access  Public/Private
export const applyCoupon = asyncHandler(async (req, res) => {
  const { couponCode } = req.body;

  // Import Coupon model here to avoid circular dependency
  const Coupon = (await import('../models/Coupon.js')).default;

  const coupon = await Coupon.findOne({ 
    code: couponCode.toUpperCase(),
    isActive: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() }
  });

  if (!coupon || !coupon.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired coupon code'
    });
  }

  let cart;

  if (req.user) {
    cart = await Cart.findOne({ user: req.user.id });
  } else {
    const sessionId = req.headers['x-session-id'];
    cart = await Cart.findOne({ sessionId });
  }

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cart is empty'
    });
  }

  const discount = coupon.calculateDiscount(cart.subtotal);

  if (discount === 0) {
    return res.status(400).json({
      success: false,
      message: `Minimum order amount is KES ${coupon.minimumOrderAmount}`
    });
  }

  cart.couponCode = couponCode.toUpperCase();
  cart.discountAmount = discount;
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Coupon applied successfully',
    data: {
      couponCode: cart.couponCode,
      discountAmount: cart.discountAmount,
      formattedDiscount: new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES'
      }).format(discount),
      subtotal: cart.subtotal,
      finalAmount: cart.subtotal - discount
    }
  });
});

// @desc    Remove coupon from cart (Public/Private)
// @route   DELETE /api/cart/coupon
// @access  Public/Private
export const removeCoupon = asyncHandler(async (req, res) => {
  let cart;

  if (req.user) {
    cart = await Cart.findOne({ user: req.user.id });
  } else {
    const sessionId = req.headers['x-session-id'];
    cart = await Cart.findOne({ sessionId });
  }

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  cart.couponCode = undefined;
  cart.discountAmount = 0;
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Coupon removed',
    data: {
      subtotal: cart.subtotal,
      discountAmount: 0
    }
  });
});