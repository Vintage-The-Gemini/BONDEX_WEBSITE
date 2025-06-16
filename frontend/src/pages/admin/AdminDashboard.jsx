import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import DashboardStats from '../../components/admin/dashboard/DashboardStats'
import LowStockAlert from '../../components/admin/dashboard/LowStockAlert'
import RecentOrders from '../../components/admin/dashboard/RecentOrders'
import QuickActions from '../../components/admin/dashboard/QuickActions'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 1247,
    totalOrders: 156,
    totalCustomers: 892,
    totalRevenue: 45670.50,
    lowStockItems: 23,
    pendingOrders: 12,
    pendingSupport: 5,
    safetyAlerts: 2
  })

  const [recentOrders] = useState([
    {
      id: 'ORD-001',
      customer: 'ABC Construction Co.',
      total: 1250.00,
      status: 'pending',
      date: '2024-06-16T10:30:00Z',
      items: 5
    },
    {
      id: 'ORD-002', 
      customer: 'MediCare Hospital',
      total: 850.75,
      status: 'processing',
      date: '2024-06-16T09:15:00Z',
      items: 12
    },
    {
      id: 'ORD-003',
      customer: 'SafeWork Industries',
      total: 2100.00,
      status: 'shipped',
      date: '2024-06-15T16:45:00Z',
      items: 8
    },
    {
      id: 'ORD-004',
      customer: 'Metro Fire Department',
      total: 3200.00,
      status: 'pending',
      date: '2024-06-15T14:20:00Z',
      items: 15
    },
    {
      id: 'ORD-005',
      customer: 'Industrial Solutions LLC',
      total: 675.50,
      status: 'delivered',
      date: '2024-06-14T11:30:00Z',
      items: 6
    }
  ])

  const [lowStockProducts] = useState([
    {
      id: 1,
      name: 'N95 Respirator Masks (Box of 20)',
      category: 'Respiratory Protection',
      currentStock: 5,
      reorderLevel: 50,
      sku: 'RES-N95-020'
    },
    {
      id: 2,
      name: 'Steel Toe Safety Boots Size 10',
      category: 'Foot Protection',
      currentStock: 8,
      reorderLevel: 20,
      sku: 'BOOT-ST-10'
    },
    {
      id: 3,
      name: 'Cut Resistant Gloves Level 5',
      category: 'Hand Protection',
      currentStock: 12,
      reorderLevel: 25,
      sku: 'GLV-CR-L5'
    },
    {
      id: 4,
      name: 'Safety Glasses Anti-Fog',
      category: 'Eye Protection',
      currentStock: 3,
      reorderLevel: 30,
      sku: 'EYE-AF-001'
    },
    {
      id: 5,
      name: 'Hard Hat with Chin Strap',
      category: 'Head Protection',
      currentStock: 0,
      reorderLevel: 15,
      sku: 'HEAD-HH-CS'
    }
  ])

  const handleReorder = (product) => {
    alert(`Reordering ${product.name}...`)
    // This would integrate with inventory management system
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              🛡️ Safety Equipment Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back! Here's what's happening with your safety equipment store today.
            </p>
            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
              <span>📅 {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
              <span>🕒 Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button className="btn-outline text-sm">
              📊 Generate Report
            </button>
            <button className="btn-primary text-sm">
              ➕ Quick Add Product
            </button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats stats={stats} />

        {/* Alerts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <LowStockAlert 
            lowStockItems={lowStockProducts} 
            onReorder={handleReorder}
          />
          <RecentOrders orders={recentOrders} />
        </div>

        {/* Quick Actions */}
        <QuickActions stats={stats} />

        {/* Additional Dashboard Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Highlights */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Today's Highlights</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-primary-800">New Orders</p>
                  <p className="text-2xl font-bold text-primary-600">12</p>
                </div>
                <div className="text-2xl">📦</div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-success-800">Orders Shipped</p>
                  <p className="text-2xl font-bold text-success-600">8</p>
                </div>
                <div className="text-2xl">🚚</div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-secondary-800">New Customers</p>
                  <p className="text-2xl font-bold text-secondary-600">5</p>
                </div>
                <div className="text-2xl">👥</div>
              </div>
            </CardBody>
          </Card>

          {/* Top Categories */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Top Categories</h3>
            </CardHeader>
            <CardBody className="space-y-3">
              {[
                { name: 'Head Protection', sales: 45, icon: '👷' },
                { name: 'Respiratory Protection', sales: 38, icon: '😷' },
                { name: 'Hand Protection', sales: 32, icon: '🧤' },
                { name: 'Eye Protection', sales: 28, icon: '👓' },
                { name: 'Foot Protection', sales: 22, icon: '👢' }
              ].map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-sm font-medium text-gray-900">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-primary-500 h-1.5 rounded-full" 
                        style={{ width: `${category.sales}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">{category.sales}%</span>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Server Status</span>
                <span className="flex items-center text-sm text-success-600">
                  <div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div>
                  Online
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="flex items-center text-sm text-success-600">
                  <div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div>
                  Connected
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Payment Gateway</span>
                <span className="flex items-center text-sm text-success-600">
                  <div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div>
                  Active
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email Service</span>
                <span className="flex items-center text-sm text-warning-600">
                  <div className="w-2 h-2 bg-warning-500 rounded-full mr-2"></div>
                  Warning
                </span>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <button className="text-sm text-primary-600 hover:text-primary-500">
                  View System Logs →
                </button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard