// frontend/src/pages/admin/AdminDashboard.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import {
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertTriangle,
  Plus,
  Eye,
  DollarSign,
  BarChart3
} from 'lucide-react';

const AdminDashboard = () => {
  const { 
    dashboardStats, 
    loadDashboardStats, 
    admin,
    formatCurrency,
    formatDate 
  } = useAdmin();

  useEffect(() => {
    // Load dashboard stats when component mounts
    loadDashboardStats();
  }, []);

  // Mock data for demo (replace with real data from dashboardStats)
  const stats = dashboardStats || {
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalCustomers: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    lowStockItems: 0,
    pendingOrders: 0
  };

  const quickStats = [
    {
      name: 'Total Products',
      value: stats.totalProducts || 0,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Categories',
      value: stats.totalCategories || 0,
      icon: FolderTree,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: '+2%',
      changeType: 'positive'
    },
    {
      name: 'Total Orders',
      value: stats.totalOrders || 0,
      icon: ShoppingCart,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      change: '+18%',
      changeType: 'positive'
    },
    {
      name: 'Customers',
      value: stats.totalCustomers || 0,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '+8%',
      changeType: 'positive'
    }
  ];

  const revenueStats = [
    {
      name: 'Today\'s Revenue',
      value: formatCurrency(stats.todayRevenue || 0),
      icon: DollarSign,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      name: 'Monthly Revenue',
      value: formatCurrency(stats.monthlyRevenue || 0),
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    }
  ];

  const alerts = [
    {
      type: 'warning',
      message: `${stats.lowStockItems || 0} products are low in stock`,
      action: 'View Inventory',
      link: '/admin/products?lowStock=true'
    },
    {
      type: 'info',
      message: `${stats.pendingOrders || 0} orders are pending processing`,
      action: 'View Orders',
      link: '/admin/orders?status=pending'
    }
  ];

  const quickActions = [
    {
      name: 'Add Product',
      description: 'Add new safety equipment',
      icon: Package,
      link: '/admin/products/create',
      color: 'bg-blue-500'
    },
    {
      name: 'Add Category',
      description: 'Create product category',
      icon: FolderTree,
      link: '/admin/categories/create',
      color: 'bg-green-500'
    },
    {
      name: 'View Analytics',
      description: 'Check sales reports',
      icon: BarChart3,
      link: '/admin/analytics',
      color: 'bg-purple-500'
    },
    {
      name: 'Manage Orders',
      description: 'Process customer orders',
      icon: ShoppingCart,
      link: '/admin/orders',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {admin?.name || 'Admin'}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your safety equipment store today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Last updated: {formatDate(new Date())}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Dashboard refreshes automatically
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
              {stat.change && (
                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">from last month</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {revenueStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts & Notifications */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🚨 Attention Required
          </h3>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                alert.type === 'warning' 
                  ? 'bg-yellow-50 border-yellow-400' 
                  : 'bg-blue-50 border-blue-400'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className={`h-5 w-5 mr-3 ${
                      alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                    }`} />
                    <p className="text-sm font-medium text-gray-900">
                      {alert.message}
                    </p>
                  </div>
                  <Link
                    to={alert.link}
                    className="text-sm font-medium text-yellow-600 hover:text-yellow-700"
                  >
                    {alert.action}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          ⚡ Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                to={action.link}
                className="group p-4 border border-gray-200 rounded-lg hover:border-yellow-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-yellow-600">
                      {action.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {!dashboardStats && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard statistics...</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;