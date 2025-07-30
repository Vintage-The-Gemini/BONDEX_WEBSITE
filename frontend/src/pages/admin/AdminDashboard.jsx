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
      await Promise.all([
        loadDashboardStats(),
        loadProducts({ limit: 5, sort: 'salesCount', order: 'desc' }),
        loadCategories(),
        fetchEnhancedDashboardData() // New comprehensive backend data
      ]);

      console.log('✅ Dashboard data loaded successfully');
      
      if (showRefreshingState) {
        addNotification({
          type: 'success',
          message: 'Dashboard refreshed successfully'
        });
      }
      
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      addNotification({
        type: 'error',
        message: 'Failed to load dashboard data'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch enhanced data from your new comprehensive backend
  const fetchEnhancedDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setDashboardData(result.data);
          // Update system health based on successful API call
          setSystemHealth(prev => ({
            ...prev,
            database: 'online',
            api: 'running'
          }));
        }
      }
    } catch (error) {
      console.error('Enhanced dashboard fetch error:', error);
      // Update system health on error
      setSystemHealth(prev => ({
        ...prev,
        api: 'error'
      }));
    }
  };

  // Initial load
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Manual refresh
  const handleRefresh = () => {
    loadDashboardData(true);
  };

  // Calculate real statistics from loaded data (your existing logic)
  const realStats = {
    products: {
      total: products.length,
      active: products.filter(p => p.status === 'active').length,
      lowStock: products.filter(p => p.stock <= (p.lowStockThreshold || 10)).length,
      featured: products.filter(p => p.isFeatured).length
    },
    categories: {
      total: categories.length,
      active: categories.filter(c => c.status === 'active').length,
      featured: categories.filter(c => c.is_featured).length,
      withProducts: categories.filter(c => c.productCount > 0).length
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
      value: formatCurrency(summary?.totalRevenue || realStats.dashboard.totalRevenue),
      change: revenue?.thisMonth?.growth || 0,
      changeLabel: `${revenue?.thisMonth?.growth > 0 ? '+' : ''}${revenue?.thisMonth?.growth || 0}% from last month`,
      icon: DollarSign,
      color: 'green',
      period: `KES ${revenue?.today?.amount?.toLocaleString() || '0'} today`
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
          <div className="text-sm text-gray-500">
            Last updated: {formatDate(new Date(), { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Alert Summary */}
      {(alerts?.lowStock > 0 || alerts?.pendingOrders > 0 || alerts?.outOfStock > 0 || realStats.products.lowStock > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="font-medium text-yellow-800">Attention Required</h3>
          </div>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-yellow-700">
            {(alerts?.lowStock > 0 || realStats.products.lowStock > 0) && (
              <Link to="/admin/products?lowStock=true" className="hover:underline">
                📦 {alerts?.lowStock || realStats.products.lowStock} products are low in stock
              </Link>
            )}
            {alerts?.outOfStock > 0 && (
              <Link to="/admin/products?stock=0" className="hover:underline">
                ❌ {alerts.outOfStock} products are out of stock
              </Link>
            )}
            {alerts?.pendingOrders > 0 && (
              <Link to="/admin/orders?status=pending" className="hover:underline">
                ⏳ {alerts.pendingOrders} orders need attention
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className={`p-6 rounded-lg border shadow-sm ${getColorClasses(stat.color)}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  {stat.change !== undefined && (
                    <div className="flex items-center mt-2">
                      {stat.change > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : stat.change < 0 ? (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      ) : null}
                      <span className="text-xs text-gray-600">{stat.changeLabel}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{stat.period}</p>
                </div>
                <div className={`p-3 rounded-full ${getIconBgColor(stat.color)}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <Link
                to="/admin/orders"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
              >
                View All <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(recentOrders || realStats.dashboard.recentOrders)?.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900">#{order.orderNumber}</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(new Date(order.date || order.createdAt))}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900">{order.customer || order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900">
                        {formatCurrency(order.total || order.totalAmount)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link to={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-700">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={5} className="py-8 px-6 text-center text-gray-500">
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health & Quick Actions */}
        <div className="space-y-6">
          {/* System Health Checks - Your Original Feature */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    systemHealth.database === 'online' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <Database className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Database</span>
                </div>
                <span className={`text-sm font-medium ${
                  systemHealth.database === 'online' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {systemHealth.database === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    systemHealth.api === 'running' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <Server className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">API Server</span>
                </div>
                <span className={`text-sm font-medium ${
                  systemHealth.api === 'running' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {systemHealth.api === 'running' ? 'Running' : 'Error'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <Cloud className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Image Storage</span>
                </div>
                <span className="text-sm font-medium text-green-600">Connected</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Backup</span>
                </div>
                <span className="text-sm font-medium text-yellow-600">Scheduled</span>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-medium text-green-600">System Healthy</h4>
                  <p className="text-sm text-gray-600">All services running</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Last checked: {formatDate(new Date(), { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-3">
              <Link
                to="/admin/products/create"
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Link>
              <Link
                to="/admin/orders?status=pending"
                className="w-full flex items-center justify-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Process Orders ({orders?.pending || 0})
              </Link>
              <Link
                to="/admin/products?lowStock=true"
                className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Check Low Stock ({realStats.products.lowStock})
              </Link>
              <Link
                to="/admin/categories"
                className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FolderTree className="w-4 h-4 mr-2" />
                Manage Categories
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Store Health Overview - Your Original Feature Enhanced */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Store Health Overview</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Products Health */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{realStats.products.total}</h3>
              <p className="text-gray-600">Total Products</p>
              <div className="mt-2 text-sm">
                <span className="text-green-600">{realStats.products.active} active</span>
                {realStats.products.lowStock > 0 && (
                  <span className="text-red-600 ml-2">{realStats.products.lowStock} low stock</span>
                )}
              </div>
            </div>

            {/* Categories Health */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderTree className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{realStats.categories.total}</h3>
              <p className="text-gray-600">Categories</p>
              <div className="mt-2 text-sm">
                <span className="text-green-600">{realStats.categories.withProducts} with products</span>
              </div>
            </div>

            {/* System Status */}
            <div className="text-center">
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