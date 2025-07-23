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
  XCircle
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
    categories
  } = useAdmin();

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [statsLoading, setStatsLoading] = useState(false);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadDashboardStats(),
          loadProducts({ limit: 5 }),
          loadCategories()
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Mock analytics data (replace with real API calls later)
  const [analyticsData] = useState({
    revenue: {
      total: 125400,
      change: 12.5,
      trend: 'up'
    },
    orders: {
      total: 156,
      change: -3.2,
      trend: 'down'
    },
    customers: {
      total: 89,
      change: 8.7,
      trend: 'up'
    },
    products: {
      total: products.length || 0,
      change: 15.3,
      trend: 'up'
    },
    topProducts: [
      { id: 1, name: 'Safety Helmet Professional', sales: 45, revenue: 112500 },
      { id: 2, name: 'Safety Goggles Clear', sales: 38, revenue: 45600 },
      { id: 3, name: 'Work Gloves Heavy Duty', sales: 32, revenue: 25600 },
      { id: 4, name: 'High-Vis Vest', sales: 28, revenue: 16800 },
      { id: 5, name: 'Safety Boots Steel Toe', sales: 25, revenue: 87500 }
    ],
    recentOrders: [
      { id: 'ORD-001', customer: 'John Construction Co.', amount: 15600, status: 'processing', date: new Date() },
      { id: 'ORD-002', customer: 'Safety First Ltd.', amount: 8900, status: 'shipped', date: new Date(Date.now() - 86400000) },
      { id: 'ORD-003', customer: 'Industrial Solutions', amount: 12400, status: 'delivered', date: new Date(Date.now() - 172800000) },
      { id: 'ORD-004', customer: 'WorkSafe Inc.', amount: 6700, status: 'pending', date: new Date(Date.now() - 259200000) },
      { id: 'ORD-005', customer: 'ProTech Equipment', amount: 9200, status: 'processing', date: new Date(Date.now() - 345600000) }
    ],
    lowStockProducts: [
      { id: 1, name: 'Safety Helmet Professional', stock: 5, threshold: 10 },
      { id: 2, name: 'Work Gloves Heavy Duty', stock: 3, threshold: 15 },
      { id: 3, name: 'Safety Goggles Clear', stock: 8, threshold: 20 }
    ]
  });

  // Refresh stats
  const handleRefreshStats = async () => {
    setStatsLoading(true);
    try {
      await loadDashboardStats();
    } catch (error) {
      console.error('Error refreshing stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Get status color and icon
  const getOrderStatus = (status) => {
    const statusConfig = {
      pending: { color: 'text-yellow-600 bg-yellow-100', icon: Clock },
      processing: { color: 'text-blue-600 bg-blue-100', icon: RefreshCw },
      shipped: { color: 'text-purple-600 bg-purple-100', icon: Package },
      delivered: { color: 'text-green-600 bg-green-100', icon: CheckCircle },
      cancelled: { color: 'text-red-600 bg-red-100', icon: XCircle }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {admin?.name || 'Admin'}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your safety equipment store today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={handleRefreshStats}
            disabled={statsLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${statsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency ? formatCurrency(analyticsData.revenue.total) : `KES ${analyticsData.revenue.total.toLocaleString()}`}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {analyticsData.revenue.trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm ${analyticsData.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {analyticsData.revenue.change > 0 ? '+' : ''}{analyticsData.revenue.change}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.orders.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {analyticsData.orders.trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm ${analyticsData.orders.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {analyticsData.orders.change > 0 ? '+' : ''}{analyticsData.orders.change}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Customers</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.customers.total}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {analyticsData.customers.trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm ${analyticsData.customers.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {analyticsData.customers.change > 0 ? '+' : ''}{analyticsData.customers.change}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length || 0}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <FolderTree className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-sm text-blue-600">{categories.length || 0} Categories</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/products/create"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Add Product</p>
              <p className="text-sm text-gray-500">Create new product</p>
            </div>
          </Link>

          <Link
            to="/admin/categories/create"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <FolderTree className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Add Category</p>
              <p className="text-sm text-gray-500">Create category</p>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">View Orders</p>
              <p className="text-sm text-gray-500">Manage orders</p>
            </div>
          </Link>

          <Link
            to="/admin/analytics"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Analytics</p>
              <p className="text-sm text-gray-500">View reports</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link
                to="/admin/orders"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                View All <Eye className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData.recentOrders.map((order) => {
                const statusConfig = getOrderStatus(order.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${statusConfig.color}`}>
                        <StatusIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-500">{order.customer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatCurrency ? formatCurrency(order.amount) : `KES ${order.amount.toLocaleString()}`}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">{order.status}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
              <Link
                to="/admin/products"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                View All <Eye className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                      <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency ? formatCurrency(product.revenue) : `KES ${product.revenue.toLocaleString()}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {analyticsData.lowStockProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analyticsData.lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-red-600">
                      Only {product.stock} left (threshold: {product.threshold})
                    </p>
                  </div>
                  <Link
                    to={`/admin/products/${product.id}/edit`}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Restock
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;