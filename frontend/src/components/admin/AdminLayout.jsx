// File Path: frontend/src/components/admin/AdminLayout.jsx
import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const AdminLayout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navigationItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: '📊', 
      path: '/admin/dashboard',
      description: 'Overview & Analytics'
    },
    { 
      id: 'products', 
      name: 'Products', 
      icon: '📦', 
      path: '/admin/products',
      description: 'Manage Inventory'
    },
    { 
      id: 'orders', 
      name: 'Orders', 
      icon: '🛒', 
      path: '/admin/orders',
      description: 'Process Orders'
    },
    { 
      id: 'customers', 
      name: 'Customers', 
      icon: '👥', 
      path: '/admin/customers',
      description: 'Customer Management'
    },
    { 
      id: 'analytics', 
      name: 'Analytics', 
      icon: '📈', 
      path: '/admin/analytics',
      description: 'Sales & Traffic'
    },
    { 
      id: 'categories', 
      name: 'Categories', 
      icon: '🏷️', 
      path: '/admin/categories',
      description: 'Product Categories'
    },
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: '⚙️', 
      path: '/admin/settings',
      description: 'System Configuration'
    }
  ]

  const handleLogout = () => {
    localStorage.removeItem('bondex_admin_token')
    localStorage.removeItem('bondex_admin_user')
    navigate('/admin/login')
  }

  const isActivePage = (path) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-slate-900 text-white flex-shrink-0 flex flex-col`}>
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg">
              B
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold">Bondex Safety</h1>
                <p className="text-sm text-slate-400">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6 px-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                isActivePage(item.path)
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:transform hover:scale-105'
              }`}
            >
              <span className={`text-xl transition-transform ${isActivePage(item.path) ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              
              {sidebarOpen && (
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              )}

              {/* Active Indicator */}
              {isActivePage(item.path) && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
              )}
            </button>
          ))}
        </nav>>

        {/* Sidebar Footer */}
        <div className="mt-auto p-4 space-y-4">
          {/* Quick Stats (only when sidebar is open) */}
          {sidebarOpen && (
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-300 mb-2">Quick Stats</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Revenue Today:</span>
                  <span className="text-green-400 font-bold">KES 45,200</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">New Orders:</span>
                  <span className="text-blue-400 font-bold">12</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Low Stock:</span>
                  <span className="text-red-400 font-bold">5 items</span>
                </div>
              </div>
            </div>
          )}

          {/* Toggle Sidebar Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-slate-800 hover:bg-slate-700 p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
              title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              <span className={`transform transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`}>
                ◀
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {navigationItems.find(item => isActivePage(item.path))?.name || 'Admin Panel'}
              </h2>
              <p className="text-sm text-gray-600">
                {navigationItems.find(item => isActivePage(item.path))?.description || 'Management Dashboard'}
              </p>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="text-xl">🔔</span>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Admin Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-600">admin@bondexsafety.com</p>
                </div>
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout