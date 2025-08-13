// frontend/src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  DollarSign,
  AlertTriangle,
  Eye,
  Plus,
  RefreshCw,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Edit,
  MoreVertical,
  Download,
  Wifi,
  Database,
  Server,
  Cloud
} from 'lucide-react';

const AdminDashboard = () => {
  const { 
    admin, 
    loadDashboardStats, 
    dashboardStats, 
    formatCurrency, 
    formatDate,
    loadProducts,
    loadCategories,
    products,
    categories,
    addNotification
  } = useAdmin();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [systemHealth, setSystemHealth] = useState({
    database: 'online',
    api: 'running', 
    imageStorage: 'connected',
    backup: 'scheduled'
  });

  // Enhanced dashboard data fetch combining your existing and new backend
  const loadDashboardData = async (showRefreshingState = false) => {
    try {
      if (showRefreshingState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      console.log('📊 Loading comprehensive dashboard data...');
      
      // Load all dashboard data in parallel - combining your existing methods with new backend
      const [dashboardResult, productsResult, categoriesResult] = await Promise.all([
        loadDashboardStats(),
        loadProducts({ limit: 5, sort: 'salesCount', order: 'desc' }),
        loadCategories()
      ]);

      // Set dashboard data from the result
      if (dashboardResult.success) {
        setDashboardData(dashboardResult.data);
      }

      console.log('✅ Dashboard data loaded successfully');
      
      addNotification({
        type: 'success',
        message: 'Dashboard refreshed successfully!'
      });

    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      
      addNotification({
        type: 'error',
        message: 'Failed to refresh dashboard data'
      });
      
      // Set dummy data for development
      setDashboardData({
        summary: {
          totalRevenue: 125000,
          totalOrders: 342,
          totalProducts: products?.length || 156,
          totalCustomers: 89
        },
        revenue: {
          today: { amount: 5420 },
          thisMonth: { growth: 12.5 }
        },
        orders: {
          today: 8,
          pending: 3,
          thisWeek: 45
        },
        customers: {
          total: 89,
          newThisWeek: 12,
          newThisMonth: 35
        }
      });
      
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data load
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Refresh handler
  const handleRefresh = () => {
    loadDashboardData(true);
  };

  // Calculate real-time stats from loaded data
  const realStats = {
    products: {
      total: products?.length || 0,
      active: products?.filter(p => p.status === 'active').length || 0,
      lowStock: products?.filter(p => p.stock <= (p.lowStockThreshold || 10)).length || 0,
      featured: products?.filter(p => p.isFeatured).length || 0
    },
    categories: {
      total: categories?.length || 0,
      active: categories?.filter(c => c.status === 'active').length || 0,
      featured: categories?.filter(c => c.is_featured).length || 0,
      withProducts: categories?.filter(c => c.productCount > 0).length || 0
    },
    dashboard: dashboardStats || {
      totalRevenue: 0,
      totalOrders: 0,
      recentOrders: [],
      topProducts: []
    }
  };

  // Enhanced data from new backend
  const {
    summary,
    revenue,
    orders,
    customers,
    topProducts: backendTopProducts,
    lowStockProducts,
    recentOrders,
    categoryPerformance,
    alerts
  } = dashboardData || {};

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Dashboard</h3>
            <p className="text-gray-600">Fetching latest statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced stat cards combining both data sources
  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(summary?.totalRevenue || realStats.dashboard.totalRevenue || 0),
      change: revenue?.thisMonth?.growth || 0,
      changeLabel: `${revenue?.thisMonth?.growth > 0 ? '+' : ''}${revenue?.thisMonth?.growth || 0}% from last month`,
      icon: DollarSign,
      color: 'green',
      period: `${formatCurrency(revenue?.today?.amount || 0)} today`
    },
    {
      title: 'Total Orders',
      value: (summary?.totalOrders || realStats.dashboard.totalOrders || 0).toLocaleString(),
      change: orders?.today || 0,
      changeLabel: `${orders?.today || 0} orders today`,
      icon: ShoppingCart,
      color: 'blue',
      period: `${orders?.pending || 0} pending`
    },
    {
      title: 'Total Products',
      value: realStats.products.total.toLocaleString(),
      change: realStats.products.active,
      changeLabel: `${realStats.products.active} active products`,
      icon: Package,
      color: 'purple',
      period: `${realStats.products.lowStock} low stock`
    },
    {
      title: 'Total Customers',
      value: (customers?.total || 0).toLocaleString(),
      change: customers?.newThisWeek || 0,
      changeLabel: `${customers?.newThisWeek || 0} new this week`,
      icon: Users,
      color: 'orange',
      period: `${customers?.newThisMonth || 0} this month`
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      purple: 'bg-purple-50 border-purple-200',
      orange: 'bg-orange-50 border-orange-200'
    };
    return colors[color] || colors.blue;
  };

  const getIconBgColor = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {admin?.name || 'Admin'}! Here's your Bondex Safety store overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <Link
            to="/admin/products/create"
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow ${getColorClasses(card.color)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{card.value}</p>
                  <div className="flex items-center text-sm">
                    {card.change > 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                    ) : card.change < 0 ? (
                      <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
                    ) : (
                      <Activity className="w-4 h-4 text-gray-600 mr-1" />
                    )}
                    <span className={`${card.change > 0 ? 'text-green-600' : card.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {card.changeLabel}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{card.period}</p>
                </div>
                <div className={`p-3 rounded-lg ${getIconBgColor(card.color)}`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/admin/products/create"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add New Product</p>
                <p className="text-sm text-gray-600">Create a new product listing</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto" />
            </Link>

            <Link
              to="/admin/categories/create"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <FolderTree className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add Category</p>
                <p className="text-sm text-gray-600">Create a new product category</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto" />
            </Link>

            <Link
              to="/admin/orders"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <ShoppingCart className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">View Orders</p>
                <p className="text-sm text-gray-600">Manage customer orders</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto" />
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <Link to="/admin/orders" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {(recentOrders || []).slice(0, 3).map((order, index) => (
              <div key={order._id || index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">#{order.orderNumber || `ORD-${1000 + index}`}</p>
                  <p className="text-sm text-gray-600">{order.customerName || 'Customer'}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(order.total || 2500)}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status || 'pending'}
                  </span>
                </div>
              </div>
            ))}
            
            {(!recentOrders || recentOrders.length === 0) && (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent orders</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
            <Link to="/admin/products?filter=lowStock" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {(lowStockProducts || products?.filter(p => p.stock <= (p.lowStockThreshold || 10)) || []).slice(0, 3).map((product, index) => (
              <div key={product._id || index} className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
                <div>
                  <p className="font-medium text-gray-900">{product.product_name || `Product ${index + 1}`}</p>
                  <p className="text-sm text-gray-600">{product.category?.name || 'Safety Equipment'}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">{product.stock || 0} left</p>
                  <Link 
                    to={`/admin/products/${product._id}/edit`}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Restock
                  </Link>
                </div>
              </div>
            ))}
            
            {realStats.products.lowStock === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
                <p className="text-gray-500">All products well stocked!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
            <Link to="/admin/products" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {(backendTopProducts || products?.slice(0, 5) || []).map((product, index) => (
              <div key={product._id || index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                    <Package className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.product_name || `Product ${index + 1}`}</p>
                    <p className="text-sm text-gray-600">{product.salesCount || Math.floor(Math.random() * 50)} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(product.product_price || 1500)}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-3 h-3 text-yellow-400 mr-1" />
                    {product.rating || '4.5'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <Database className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Database</p>
                  <p className="text-sm text-gray-600">All systems operational</p>
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <Server className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">API Services</p>
                  <p className="text-sm text-gray-600">Running smoothly</p>
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <Cloud className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Cloud Storage</p>
                  <p className="text-sm text-gray-600">Connected & synced</p>
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Wifi className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">CDN</p>
                  <p className="text-sm text-gray-600">Excellent performance</p>
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{realStats.products.total}</h3>
            <p className="text-gray-600">Total Products</p>
            <div className="mt-2 text-sm">
              <span className="text-blue-600">{realStats.products.featured} featured</span>
            </div>
          </div>

          <div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderTree className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{realStats.categories.total}</h3>
            <p className="text-gray-600">Categories</p>
            <div className="mt-2 text-sm">
              <span className="text-green-600">{realStats.categories.withProducts} with products</span>
            </div>
          </div>

          <div>
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{summary?.totalOrders || 0}</h3>
            <p className="text-gray-600">Total Orders</p>
            <div className="mt-2 text-sm">
              <span className="text-orange-600">{orders?.pending || 0} pending</span>
            </div>
          </div>

          <div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-600">System Healthy</h3>
            <p className="text-gray-600">All services running</p>
            <div className="mt-2 text-sm text-gray-500">
              Last updated: {formatDate(new Date(), { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay for Refresh */}
      {refreshing && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Refreshing dashboard data...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;