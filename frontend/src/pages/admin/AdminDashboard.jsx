// File Path: frontend/src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react'
import { dashboardAPI, ordersAPI } from '../../services/api'

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    monthlyRevenue: 0,
    lowStockItems: 0,
    pendingOrders: 0
  })

  const [recentOrders, setRecentOrders] = useState([])
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError('')

      // Fetch dashboard stats
      const statsResponse = await dashboardAPI.getStats()
      if (statsResponse.success) {
        const stats = statsResponse.data
        setDashboardStats({
          totalProducts: stats.totalProducts || 0,
          totalOrders: stats.totalOrders || 0,
          totalCustomers: stats.totalCustomers || 0,
          monthlyRevenue: stats.monthlyRevenue || 0,
          lowStockItems: stats.alerts?.lowStock || 0,
          pendingOrders: stats.alerts?.pendingOrders || 0
        })

        // Set recent orders and low stock products
        setRecentOrders(stats.recentOrders || [])
        setLowStockProducts(stats.lowStockProducts || [])
      } else {
        throw new Error(statsResponse.error)
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err.message || 'Failed to fetch dashboard data')
      
      // Fall back to mock data if API fails
      setDashboardStats({
        totalProducts: 156,
        totalOrders: 89,
        totalCustomers: 234,
        monthlyRevenue: 2850000,
        lowStockItems: 12,
        pendingOrders: 15
      })
      
      setRecentOrders([
        { id: 'ORD-001', customer: 'SafeBuild Construction', amount: 45000, status: 'pending', date: '2025-08-13' },
        { id: 'ORD-002', customer: 'Medical Plus Clinic', amount: 12500, status: 'completed', date: '2025-08-12' }
      ])
      
      setLowStockProducts([
        { name: 'Safety Boots Size 42', stock: 5, category: 'Foot Protection' },
        { name: 'Hard Hat Yellow', stock: 3, category: 'Head Protection' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const StatCard = ({ title, value, subtitle, color = 'bg-orange-500', icon }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <span className="text-red-400 text-xl mr-3">⚠️</span>
            <div>
              <h3 className="text-sm font-medium text-red-800">Connection Issue</h3>
              <p className="text-sm text-red-700 mt-1">
                {error} - Showing fallback data
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard 
          title="Total Products" 
          value={dashboardStats.totalProducts.toLocaleString()}
          subtitle="Active in catalog"
          icon="📦"
          color="bg-blue-500"
        />
        <StatCard 
          title="Total Orders" 
          value={dashboardStats.totalOrders.toLocaleString()}
          subtitle="This month"
          icon="🛒"
          color="bg-green-500"
        />
        <StatCard 
          title="Total Customers" 
          value={dashboardStats.totalCustomers.toLocaleString()}
          subtitle="Registered users"
          icon="👥"
          color="bg-purple-500"
        />
        <StatCard 
          title="Monthly Revenue" 
          value={formatPrice(dashboardStats.monthlyRevenue)}
          subtitle="August 2025"
          icon="💰"
          color="bg-orange-500"
        />
        <StatCard 
          title="Low Stock Items" 
          value={dashboardStats.lowStockItems.toLocaleString()}
          subtitle="Need restocking"
          icon="⚠️"
          color="bg-red-500"
        />
        <StatCard 
          title="Pending Orders" 
          value={dashboardStats.pendingOrders.toLocaleString()}
          subtitle="Require attention"
          icon="⏳"
          color="bg-yellow-500"
        />
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <button 
                onClick={() => window.location.href = '/admin/orders'}
                className="text-orange-500 hover:text-orange-600 text-sm font-medium"
              >
                View All →
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.length > 0 ? recentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.orderNumber || order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatPrice(order.total || order.amount)}</p>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-4 block">📋</span>
                  <p>No recent orders</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
            <p className="text-sm text-gray-600">Items that need restocking</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {lowStockProducts.length > 0 ? lowStockProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 text-xs font-bold bg-red-100 text-red-800 rounded-full">
                      {product.stock} left
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-4 block">✅</span>
                  <p className="text-sm">All products in stock</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => window.location.href = '/admin/products'}
              className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              Manage Inventory
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={() => window.location.href = '/admin/products'}
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition-colors text-center"
          >
            <span className="block text-2xl mb-2">📦</span>
            <span className="text-sm font-medium">Manage Products</span>
          </button>
          
          <button 
            onClick={() => window.location.href = '/admin/orders'}
            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg transition-colors text-center"
          >
            <span className="block text-2xl mb-2">🛒</span>
            <span className="text-sm font-medium">Process Orders</span>
          </button>
          
          <button 
            onClick={() => window.location.href = '/admin/customers'}
            className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg transition-colors text-center"
          >
            <span className="block text-2xl mb-2">👥</span>
            <span className="text-sm font-medium">View Customers</span>
          </button>
          
          <button 
            onClick={() => window.location.href = '/admin/analytics'}
            className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg transition-colors text-center"
          >
            <span className="block text-2xl mb-2">📈</span>
            <span className="text-sm font-medium">View Analytics</span>
          </button>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={fetchDashboardData}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <span>🔄</span>
          Refresh Data
        </button>
      </div>
    </div>
  )
}

export default AdminDashboard