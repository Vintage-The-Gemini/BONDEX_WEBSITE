import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Category from '../models/Category.js';
import asyncHandler from 'express-async-handler';
import logger from '../config/logger.js';

// @desc    Get admin dashboard overview (Admin)
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getAdminDashboard = asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  // Get comprehensive dashboard statistics
  const [
    orderStats,
    productStats,
    userStats,
    revenueStats,
    topProducts,
    recentOrders,
    lowStockProducts,
    pendingReviews
  ] = await Promise.all([
    // Order Statistics
    Order.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          today: [
            { $match: { createdAt: { $gte: startOfDay } } },
            { $count: "count" }
          ],
          thisWeek: [
            { $match: { createdAt: { $gte: startOfWeek } } },
            { $count: "count" }
          ],
          thisMonth: [
            { $match: { createdAt: { $gte: startOfMonth } } },
            { $count: "count" }
          ],
          statusBreakdown: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ]
        }
      }
    ]),

    // Product Statistics
    Product.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          active: [
            { $match: { status: 'active' } },
            { $count: "count" }
          ],
          lowStock: [
            { $match: { $expr: { $lte: ['$stock', '$lowStockThreshold'] } } },
            { $count: "count" }
          ],
          outOfStock: [
            { $match: { stock: 0 } },
            { $count: "count" }
          ],
          protectionTypeBreakdown: [
            {
              $group: {
                _id: '$protectionType',
                count: { $sum: 1 }
              }
            }
          ]
        }
      }
    ]),

    // User Statistics
    User.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          today: [
            { $match: { createdAt: { $gte: startOfDay } } },
            { $count: "count" }
          ],
          thisMonth: [
            { $match: { createdAt: { $gte: startOfMonth } } },
            { $count: "count" }
          ]
        }
      }
    ]),

    // Revenue Statistics
    Order.aggregate([
      { $match: { isPaid: true } },
      {
        $facet: {
          total: [
            {
              $group: {
                _id: null,
                amount: { $sum: '$totalPrice' }
              }
            }
          ],
          today: [
            { $match: { paidAt: { $gte: startOfDay } } },
            {
              $group: {
                _id: null,
                amount: { $sum: '$totalPrice' }
              }
            }
          ],
          thisWeek: [
            { $match: { paidAt: { $gte: startOfWeek } } },
            {
              $group: {
                _id: null,
                amount: { $sum: '$totalPrice' }
              }
            }
          ],
          thisMonth: [
            { $match: { paidAt: { $gte: startOfMonth } } },
            {
              $group: {
                _id: null,
                amount: { $sum: '$totalPrice' }
              }
            }
          ],
          thisYear: [
            { $match: { paidAt: { $gte: startOfYear } } },
            {
              $group: {
                _id: null,
                amount: { $sum: '$totalPrice' }
              }
            }
          ]
        }
      }
    ]),

    // Top Products
    Product.aggregate([
      { $match: { status: 'active' } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $project: {
          name: 1,
          totalSold: 1,
          price: 1,
          stock: 1,
          images: { $arrayElemAt: ['$images', 0] }
        }
      }
    ]),

    // Recent Orders
    Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber status totalPrice createdAt user'),

    // Low Stock Products
    Product.find({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
      status: 'active'
    })
      .select('name stock lowStockThreshold price')
      .limit(10),

    // Pending Reviews
    Review.countDocuments({ isApproved: false })
  ]);

  // Format the response data
  const dashboardData = {
    orders: {
      total: orderStats[0].total[0]?.count || 0,
      today: orderStats[0].today[0]?.count || 0,
      thisWeek: orderStats[0].thisWeek[0]?.count || 0,
      thisMonth: orderStats[0].thisMonth[0]?.count || 0,
      statusBreakdown: orderStats[0].statusBreakdown
    },
    products: {
      total: productStats[0].total[0]?.count || 0,
      active: productStats[0].active[0]?.count || 0,
      lowStock: productStats[0].lowStock[0]?.count || 0,
      outOfStock: productStats[0].outOfStock[0]?.count || 0,
      protectionTypeBreakdown: productStats[0].protectionTypeBreakdown
    },
    users: {
      total: userStats[0].total[0]?.count || 0,
      today: userStats[0].today[0]?.count || 0,
      thisMonth: userStats[0].thisMonth[0]?.count || 0
    },
    revenue: {
      total: revenueStats[0].total[0]?.amount || 0,
      today: revenueStats[0].today[0]?.amount || 0,
      thisWeek: revenueStats[0].thisWeek[0]?.amount || 0,
      thisMonth: revenueStats[0].thisMonth[0]?.amount || 0,
      thisYear: revenueStats[0].thisYear[0]?.amount || 0,
      formattedTotal: new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES'
      }).format(revenueStats[0].total[0]?.amount || 0)
    },
    topProducts,
    recentOrders,
    lowStockProducts,
    pendingReviews,
    alerts: {
      lowStock: productStats[0].lowStock[0]?.count || 0,
      outOfStock: productStats[0].outOfStock[0]?.count || 0,
      pendingReviews
    }
  };

  res.status(200).json({
    success: true,
    data: dashboardData
  });
});

// @desc    Get sales analytics (Admin)
// @route   GET /api/admin/analytics/sales
// @access  Private/Admin
export const getSalesAnalytics = asyncHandler(async (req, res) => {
  const { period = '30d' } = req.query;
  
  let startDate;
  const endDate = new Date();
  
  switch (period) {
    case '7d':
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  }

  const salesData = await Order.aggregate([
    {
      $match: {
        isPaid: true,
        paidAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$paidAt"
          }
        },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
        averageOrderValue: { $avg: '$totalPrice' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Product performance
  const productPerformance = await Order.aggregate([
    {
      $match: {
        isPaid: true,
        paidAt: { $gte: startDate, $lte: endDate }
      }
    },
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product',
        name: { $first: '$orderItems.name' },
        totalSold: { $sum: '$orderItems.quantity' },
        revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: 10 }
  ]);

  // Protection type performance
  const protectionTypePerformance = await Order.aggregate([
    {
      $match: {
        isPaid: true,
        paidAt: { $gte: startDate, $lte: endDate }
      }
    },
    { $unwind: '$orderItems' },
    {
      $lookup: {
        from: 'products',
        localField: 'orderItems.product',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $group: {
        _id: '$product.protectionType',
        revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
        units: { $sum: '$orderItems.quantity' }
      }
    },
    { $sort: { revenue: -1 } }
  ]);

  res.status(200).json({
    success: true,
    period,
    data: {
      dailySales: salesData,
      productPerformance,
      protectionTypePerformance,
      summary: {
        totalRevenue: salesData.reduce((sum, day) => sum + day.revenue, 0),
        totalOrders: salesData.reduce((sum, day) => sum + day.orders, 0),
        averageOrderValue: salesData.length > 0 
          ? salesData.reduce((sum, day) => sum + day.averageOrderValue, 0) / salesData.length 
          : 0
      }
    }
  });
});

// @desc    Get inventory alerts (Admin)
// @route   GET /api/admin/alerts/inventory
// @access  Private/Admin
export const getInventoryAlerts = asyncHandler(async (req, res) => {
  const [lowStockProducts, outOfStockProducts] = await Promise.all([
    Product.find({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
      status: 'active',
      stock: { $gt: 0 }
    })
      .select('name stock lowStockThreshold price protectionType')
      .sort({ stock: 1 }),

    Product.find({
      stock: 0,
      status: 'active'
    })
      .select('name stock price protectionType')
      .sort({ name: 1 })
  ]);

  res.status(200).json({
    success: true,
    data: {
      lowStock: {
        count: lowStockProducts.length,
        products: lowStockProducts
      },
      outOfStock: {
        count: outOfStockProducts.length,
        products: outOfStockProducts
      }
    }
  });
});

// @desc    Export data (Admin)
// @route   GET /api/admin/export/:type
// @access  Private/Admin
export const exportData = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { startDate, endDate, format = 'json' } = req.query;

  let data = [];
  let filename = '';

  const dateFilter = {};
  if (startDate) dateFilter.$gte = new Date(startDate);
  if (endDate) dateFilter.$lte = new Date(endDate);

  switch (type) {
    case 'orders':
      data = await Order.find(dateFilter.createdAt ? { createdAt: dateFilter } : {})
        .populate('user', 'name email')
        .select('orderNumber status totalPrice createdAt user paymentMethod')
        .sort({ createdAt: -1 });
      filename = `orders_export_${new Date().toISOString().split('T')[0]}`;
      break;

    case 'products':
      data = await Product.find({})
        .select('name price stock protectionType industry status createdAt')
        .sort({ createdAt: -1 });
      filename = `products_export_${new Date().toISOString().split('T')[0]}`;
      break;

    case 'users':
      data = await User.find({})
        .select('name email role createdAt isVerified')
        .sort({ createdAt: -1 });
      filename = `users_export_${new Date().toISOString().split('T')[0]}`;
      break;

    default:
      return res.status(400).json({
        success: false,
        message: 'Invalid export type'
      });
  }

  if (format === 'csv') {
    // Convert to CSV format
    const csv = convertToCSV(data);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
    return res.status(200).send(csv);
  }

  res.status(200).json({
    success: true,
    filename,
    count: data.length,
    data
  });
});

// Helper function to convert data to CSV
const convertToCSV = (data) => {
  if (!data.length) return '';
  
  const headers = Object.keys(data[0].toObject ? data[0].toObject() : data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(item => {
      const obj = item.toObject ? item.toObject() : item;
      return headers.map(header => {
        const value = obj[header];
        if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value).replace(/"/g, '""');
        }
        return value;
      }).join(',');
    })
  ].join('\n');
  
  return csvContent;
};

// @desc    System health check (Admin)
// @route   GET /api/admin/system/health
// @access  Private/Admin
export const getSystemHealth = asyncHandler(async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {},
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  };

  try {
    // Check database connection
    const dbStart = Date.now();
    await User.findOne().limit(1);
    health.services.database = {
      status: 'healthy',
      responseTime: `${Date.now() - dbStart}ms`
    };
  } catch (error) {
    health.services.database = {
      status: 'unhealthy',
      error: error.message
    };
    health.status = 'degraded';
  }

  // Check memory usage
  const memUsage = process.memoryUsage();
  health.services.memory = {
    status: memUsage.heapUsed < 500 * 1024 * 1024 ? 'healthy' : 'warning', // 500MB threshold
    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`
  };

  // Check disk space (simplified)
  health.services.storage = {
    status: 'healthy',
    note: 'Using cloud storage (Cloudinary)'
  };

  res.status(200).json({
    success: true,
    data: health
  });
});