import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import asyncHandler from 'express-async-handler';
import { cloudinary } from '../config/cloudinary.js';
import logger from '../config/logger.js';

// @desc    Get reviews for a product (Public)
// @route   GET /api/products/:productId/reviews
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  // Build filter
  const filter = { 
    product: productId, 
    isApproved: true 
  };

  // Rating filter
  if (req.query.rating) {
    filter.rating = parseInt(req.query.rating);
  }

  // Verified purchase filter
  if (req.query.verified === 'true') {
    filter.isVerifiedPurchase = true;
  }

  const total = await Review.countDocuments(filter);
  const reviews = await Review.find(filter)
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(startIndex);

  // Get rating breakdown
  const ratingBreakdown = await Review.aggregate([
    { $match: { product: mongoose.Types.ObjectId(productId), isApproved: true } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } }
  ]);

  res.status(200).json({
    success: true,
    count: reviews.length,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total
    },
    ratingBreakdown,
    data: reviews
  });
});

// @desc    Create product review (Private)
// @route   POST /api/products/:productId/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, title, comment, pros, cons } = req.body;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({
    product: productId,
    user: req.user.id
  });

  if (existingReview) {
    return res.status(400).json({
      success: false,
      message: 'You have already reviewed this product'
    });
  }

  // Check if user purchased this product
  const order = await Order.findOne({
    user: req.user.id,
    'orderItems.product': productId,
    isPaid: true
  });

  const reviewData = {
    product: productId,
    user: req.user.id,
    rating,
    title,
    comment,
    pros: pros || [],
    cons: cons || [],
    isVerifiedPurchase: !!order
  };

  // Handle image uploads
  if (req.files && req.files.length > 0) {
    reviewData.images = req.files.map(file => ({
      public_id: file.filename,
      url: file.path,
      alt: `Review image for ${product.name}`
    }));
  }

  const review = await Review.create(reviewData);

  // Update product ratings
  product.updateRatings();
  await product.save();

  logger.info(`New review created for product ${product.name} by ${req.user.email}`);

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully and is pending approval',
    data: review
  });
});

// @desc    Update review (Private)
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = asyncHandler(async (req, res) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  // Check if user owns this review
  if (review.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this review'
    });
  }

  // Update review (reset approval status)
  const updateData = {
    ...req.body,
    isApproved: false // Require re-approval for updated reviews
  };

  review = await Review.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Review updated successfully and is pending re-approval',
    data: review
  });
});

// @desc    Delete review (Private)
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  // Check if user owns this review
  if (review.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this review'
    });
  }

  // Delete review images from cloudinary
  if (review.images && review.images.length > 0) {
    for (const image of review.images) {
      try {
        await cloudinary.uploader.destroy(image.public_id);
      } catch (error) {
        logger.error(`Failed to delete review image:`, error);
      }
    }
  }

  await Review.findByIdAndDelete(req.params.id);

  // Update product ratings
  const product = await Product.findById(review.product);
  if (product) {
    product.updateRatings();
    await product.save();
  }

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully'
  });
});

// @desc    Report review (Public/Private)
// @route   POST /api/reviews/:id/report
// @access  Public/Private
export const reportReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  review.reportCount += 1;
  await review.save();

  res.status(200).json({
    success: true,
    message: 'Review reported successfully'
  });
});

// @desc    Mark review as helpful (Public/Private)
// @route   POST /api/reviews/:id/helpful
// @access  Public/Private
export const markReviewHelpful = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  review.helpfulVotes += 1;
  await review.save();

  res.status(200).json({
    success: true,
    message: 'Review marked as helpful',
    helpfulVotes: review.helpfulVotes
  });
});

// ADMIN ROUTES

// @desc    Get all reviews for admin (Admin)
// @route   GET /api/admin/reviews
// @access  Private/Admin
export const getAdminReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  let filter = {};

  // Approval status filter
  if (req.query.status) {
    if (req.query.status === 'pending') {
      filter.isApproved = false;
    } else if (req.query.status === 'approved') {
      filter.isApproved = true;
    }
  }

  // Product filter
  if (req.query.product) {
    filter.product = req.query.product;
  }

  const total = await Review.countDocuments(filter);
  const reviews = await Review.find(filter)
    .populate('user', 'name email')
    .populate('product', 'name')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(startIndex);

  res.status(200).json({
    success: true,
    count: reviews.length,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total
    },
    data: reviews
  });
});

// @desc    Approve/Reject review (Admin)
// @route   PUT /api/admin/reviews/:id/status
// @access  Private/Admin
export const updateReviewStatus = asyncHandler(async (req, res) => {
  const { isApproved, adminResponse } = req.body;

  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  review.isApproved = isApproved;

  if (adminResponse) {
    review.adminResponse = {
      comment: adminResponse,
      respondedBy: req.user.id,
      respondedAt: new Date()
    };
  }

  await review.save();

  // Update product ratings if approved
  if (isApproved) {
    const product = await Product.findById(review.product);
    if (product) {
      product.updateRatings();
      await product.save();
    }
  }

  logger.info(`Review ${isApproved ? 'approved' : 'rejected'}: ${review._id} by ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
    data: review
  });
});

// @desc    Delete review (Admin)
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
export const adminDeleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  // Delete review images from cloudinary
  if (review.images && review.images.length > 0) {
    for (const image of review.images) {
      try {
        await cloudinary.uploader.destroy(image.public_id);
      } catch (error) {
        logger.error(`Failed to delete review image:`, error);
      }
    }
  }

  await Review.findByIdAndDelete(req.params.id);

  // Update product ratings
  const product = await Product.findById(review.product);
  if (product) {
    product.updateRatings();
    await product.save();
  }

  logger.info(`Review deleted by admin: ${review._id} by ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully'
  });
});