// File Path: frontend/src/components/admin/AdminSidebar.jsx
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const AdminSidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const navigationItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: '📊', 
      path: '/admin/dashboard',
      badge: null
    },
    { 
      id: 'products', 
      name: 'Products', 
      icon: '📦', 
      path: '/admin/products',
      badge: 'NEW'
    },
    { 
      id: 'orders', 
      name: 'Orders', 
      icon: '🛒', 
      path: '/admin/orders',
      badge: '12'
    },
    { 
      id: 'customers', 
      name: 'Customers', 
      icon: '👥', 
      path: '/admin/customers',
      badge: null
    },
    { 
      id: 'analytics', 
      name: 'Analytics', 
      icon: '📈', 
      path: '/admin/analytics',
      badge: null
    },
    { 
      id: 'categories', 
      name: 'Categories', 
      icon: '🏷️', 
      path: '/admin/categories',
      badge: null
    },
    { 
      id: 'inventory', 
      name: 'Inventory', 
      icon: '📋', 
      path: '/admin/inventory',
      badge: '5'
    },
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: '⚙️', 
      path: '/admin/settings',
      badge: null
    }
  ]

  const isActivePage = (path) => {
    return location.pathname === path
  }

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-slate-900 text-white flex-shrink-0 relative`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg">
            B
          </div>
          {isOpen && (
            <div>
              <h1 className="text-xl font-bold">Bondex Safety</h1>
              <p className="text-sm text-slate-400">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-4 space-y-2">
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
            
            {isOpen && (
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">{item.name}</div>
              </div>
            )}
            
            {/* Badge */}
            {item.badge && isOpen && (
              <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                item.badge === 'NEW' 
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}>
                {item.badge}
              </span>
            )}

            {/* Active Indicator */}
            {isActivePage(item.path) && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
            )}
          </button>
        ))}
      </nav>

      {/* Quick Stats (only when sidebar is open) */}
      {isOpen && (
        <div className="absolute bottom-20 left-4 right-4 bg-slate-800 rounded-lg p-4">
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
      <button
        onClick={onToggle}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-800 hover:bg-slate-700 p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
        title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
      >
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          ◀
        </span>
      </button>
    </div>
  )
}

export default AdminSidebar