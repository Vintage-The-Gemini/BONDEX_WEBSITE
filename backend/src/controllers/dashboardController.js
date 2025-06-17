import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';
import asyncHandler from 'express-async-handler';

// @desc    Get public dashboard stats (Public)
// @route   GET /api/dashboard/public
// @access  Public
export const getPublicDashboard = asyncHandler(async (req, res) => {
  const [
    totalProducts,
    totalCategories,
    featuredProducts,
    protectionTypeStats,
    industryStats,
    topRatedProducts
  ] = await Promise.all([
    // Total active products
    Product.countDocuments({ status: 'active' }),
    
    // Total active categories
    Category.countDocuments({ isActive: true }),
    
    // Featured products
    Product.find({ 
      featured: true, 
      status: 'active',
      stock: { $gt: 0 }
    })
      .select('name price images ratings protectionType industry')
      .limit(8),
    
    // Protection type breakdown
    Product.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$protectionType',
          count: { $sum: 1 },
          averagePrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]),
    
    // Industry breakdown
    Product.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$industry',
          count: { $sum: 1 },
          averagePrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]),
    
    // Top rated products
    Product.find({ 
      status: 'active',
      ratings: { $gte: 4.0 },
      numOfReviews: { $gte: 5 }
    })
      .select('name price images ratings numOfReviews protectionType')
      .sort({ ratings: -1 })
      .limit(6)
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalProducts,
        totalCategories,
        totalProtectionTypes: protectionTypeStats.length,
        totalIndustries: industryStats.length
      },
      featuredProducts,
      protectionTypeStats: protectionTypeStats.map(item => ({
        type: item._id,
        count: item.count,
        averagePrice: Math.round(item.averagePrice),
        formattedAveragePrice: new Intl.NumberFormat('en-KE', {
          style: 'currency',
          currency: 'KES'
        }).format(item.averagePrice)
      })),
      industryStats: industryStats.map(item => ({
        industry: item._id,
        count: item.count,
        averagePrice: Math.round(item.averagePrice),
        formattedAveragePrice: new Intl.NumberFormat('en-KE', {
          style: 'currency',
          currency: 'KES'
        }).format(item.averagePrice)
      })),
      topRatedProducts
    }
  });
});

// @desc    Get user dashboard (Private)
// @route   GET /api/dashboard/user
// @access  Private
export const getUserDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  const [
    orderStats,
    recentOrders,
    wishlistCount,
    reviewStats,
    addressInfo
  ] = await Promise.all([
    // User order statistics
    Order.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalPrice' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          },
          averageOrderValue: { $avg: '$totalPrice' }
        }
      }
    ]),
    
    // Recent orders
    Order.find({ user: userId })
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber status totalPrice createdAt orderItems'),
    
    // Wishlist count (if implemented)
    // Wishlist.countDocuments({ user: userId }),
    0, // Placeholder
    
    // User review statistics
    Review.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          approvedReviews: {
            $sum: { $cond: [{ $eq: ['$isApproved', true] }, 1, 0] }
          }
        }
      }
    ]),
    
    // User address information
    User.findById(userId).select('address')
  ]);

  const stats = orderStats[0] || {
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    averageOrderValue: 0
  };

  const reviewData = reviewStats[0] || {
    totalReviews: 0,
    averageRating: 0,
    approvedReviews: 0
  };

  res.status(200).json({
    success: true,
    data: {
      user: {
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        memberSince: req.user.createdAt,
        isVerified: req.user.isVerified
      },
      orderStats: {
        ...stats,
        formattedTotalSpent: new Intl.NumberFormat('en-KE', {
          style: 'currency',
          currency: 'KES'
        }).format(stats.totalSpent),
        formattedAverageOrderValue: new Intl.NumberFormat('en-KE', {
          style: 'currency',
          currency: 'KES'
        }).format(stats.averageOrderValue)
      },
      recentOrders,
      reviewStats: reviewData,
      hasAddress: !!(addressInfo?.address?.street),
      quickActions: [
        {
          title: 'Browse Products',
          description: 'Explore our safety equipment',
          link: '/products',
          icon: 'shopping-bag'
        },
        {
          title: 'Track Orders',
          description: 'Check your order status',
          link: '/orders',
          icon: 'truck'
        },
        {
          title: 'Update Profile',
          description: 'Manage your account',
          link: '/profile',
          icon: 'user'
        },
        {
          title: 'Safety Guide',
          description: 'Learn about safety equipment',
          link: '/guide',
          icon: 'shield'
        }
      ]
    }
  });
});

// @desc    Get homepage data (Public)
// @route   GET /api/dashboard/homepage
// @access  Public
export const getHomepageData = asyncHandler(async (req, res) => {
  const [
    heroProducts,
    featuredCategories,
    newArrivals,
    bestSellers,
    protectionTypeShowcase,
    testimonials,
    blogPosts
  ] = await Promise.all([
    // Hero section products
    Product.find({ 
      featured: true,
      status: 'active',
      stock: { $gt: 0 }
    })
      .select('name shortDescription price images protectionType industry onSale salePrice')
      .limit(3),
    
    // Featured categories
    Category.find({ 
      isFeatured: true,
      isActive: true 
    })
      .select('name description image protectionType')
      .sort({ sortOrder: 1 })
      .limit(6),
    
    // New arrivals
    Product.find({ 
      status: 'active',
      stock: { $gt: 0 }
    })
      .select('name price images ratings protectionType createdAt')
      .sort({ createdAt: -1 })
      .limit(8),
    
    // Best sellers
    Product.find({ 
      status: 'active',
      stock: { $gt: 0 }
    })
      .select('name price images ratings totalSold protectionType')
      .sort({ totalSold: -1 })
      .limit(8),
    
    // Protection type showcase
    Product.aggregate([
      { $match: { status: 'active', featured: true } },
      {
        $group: {
          _id: '$protectionType',
          products: { 
            $push: {
              _id: '$_id',
              name: '$name',
              price: '$price',
              images: { $arrayElemAt: ['$images', 0] },
              ratings: '$ratings'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          protectionType: '$_id',
          products: { $slice: ['$products', 2] },
          totalProducts: '$count'
        }
      }
    ]),
    
    // Sample testimonials (can be from reviews)
    Review.find({ 
      isApproved: true,
      rating: { $gte: 4 }
    })
      .populate('user', 'name avatar')
      .populate('product', 'name')
      .select('rating comment user product createdAt')
      .sort({ createdAt: -1 })
      .limit(6),
    
    // Blog posts placeholder
    []
  ]);

  res.status(200).json({
    success: true,
    data: {
      hero: {
        title: "Kenya's Premier Safety Equipment Store",
        subtitle: "Protecting Lives with Quality Safety Gear",
        description: "From construction sites to medical facilities, we provide top-quality protection equipment for all industries across Kenya.",
        currency: "KES",
        products: heroProducts
      },
      sections: {
        featuredCategories,
        newArrivals,
        bestSellers,
        protectionTypeShowcase: protectionTypeShowcase.map(item => ({
          type: item.protectionType,
          products: item.products,
          totalProducts: item.totalProducts,
          viewAllLink: `/products/protection/${item.protectionType.toLowerCase()}`
        })),
        testimonials: testimonials.map(review => ({
          id: review._id,
          rating: review.rating,
          comment: review.comment.substring(0, 150) + '...',
          userName: review.user.name,
          userAvatar: review.user.avatar,
          productName: review.product.name,
          date: review.createdAt
        })),
        features: [
          {
            title: "Kenya-Wide Delivery",
            description: "Fast and reliable delivery across all 47 counties",
            icon: "truck"
          },
          {
            title: "Quality Certified",
            description: "All products meet international safety standards",
            icon: "shield-check"
          },
          {
            title: "Expert Support",
            description: "Professional guidance from safety equipment experts",
            icon: "users"
          },
          {
            title: "Secure Payments",
            description: "Multiple payment options including M-Pesa and cards",
            icon: "credit-card"
          }
        ]
      }
    }
  });
});

// @desc    Get search suggestions (Public)
// @route   GET /api/dashboard/search-suggestions
// @access  Public
export const getSearchSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.length < 2) {
    return res.status(200).json({
      success: true,
      data: {
        products: [],
        categories: [],
        brands: []
      }
    });
  }

  const searchRegex = new RegExp(q, 'i');

  const [products, categories, brands] = await Promise.all([
    // Product suggestions
    Product.find({
      status: 'active',
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex }
      ]
    })
      .select('name price images protectionType')
      .limit(5),
    
    // Category suggestions
    Category.find({
      isActive: true,
      name: searchRegex
    })
      .select('name slug protectionType')
      .limit(3),
    
    // Brand suggestions
    Product.aggregate([
      {
        $match: {
          status: 'active',
          brand: searchRegex
        }
      },
      {
        $group: {
          _id: '$brand',
          count: { $sum: 1 }
        }
      },
      { $limit: 3 }
    ])
  ]);

  res.status(200).json({
    success: true,
    data: {
      products,
      categories,
      brands: brands.map(item => ({
        name: item._id,
        productCount: item.count
      }))
    }
  });
});

// @desc    Get site statistics for footer (Public)
// @route   GET /api/dashboard/site-stats
// @access  Public
export const getSiteStats = asyncHandler(async (req, res) => {
  const [
    totalProducts,
    totalCategories,
    totalOrders,
    totalCustomers
  ] = await Promise.all([
    Product.countDocuments({ status: 'active' }),
    Category.countDocuments({ isActive: true }),
    Order.countDocuments({ isPaid: true }),
    User.countDocuments({ role: 'customer' })
  ]);

  res.status(200).json({
    success: true,
    data: {
      products: totalProducts,
      categories: totalCategories,
      orders: totalOrders,
      customers: totalCustomers,
      yearsInBusiness: new Date().getFullYear() - 2020, // Assuming started in 2020
      counties: 47, // All Kenyan counties
      currency: 'KES'
    }
  });
});