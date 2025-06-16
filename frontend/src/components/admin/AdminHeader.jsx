import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

const AdminHeader = ({ setSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const notifications = [
    { id: 1, type: 'order', message: 'New order from ABC Construction', time: '5 min ago' },
    { id: 2, type: 'stock', message: 'Low stock alert: N95 Masks', time: '10 min ago' },
    { id: 3, type: 'customer', message: 'New customer registration', time: '15 min ago' }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`)
      // Implement search functionality here
    }
  }

  return (
    <div className="admin-header">
      {/* Mobile menu button */}
      <button
        type="button"
        className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
        onClick={() => setSidebarOpen(true)}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Search */}
      <div className="flex-1 flex justify-center lg:justify-start">
        <div className="w-full max-w-lg lg:max-w-xs">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search products, orders, customers..."
            />
          </form>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Quick Actions */}
        <div className="hidden md:flex space-x-2">
          <Link to="/admin/products/add">
            <Button variant="outline" size="sm">
              + Add Product
            </Button>
          </Link>
          <Link to="/admin/orders/pending">
            <Button variant="primary" size="sm">
              Process Orders
            </Button>
          </Link>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors"
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowUserMenu(false)
            }}
          >
            <BellIcon className="h-6 w-6" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-danger-500 text-white rounded-full text-xs flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 z-50 mt-2 w-80 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">Notifications</p>
                </div>
                {notifications.map((notification) => (
                  <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {notification.type === 'order' && (
                          <Badge variant="primary" size="sm">Order</Badge>
                        )}
                        {notification.type === 'stock' && (
                          <Badge variant="warning" size="sm">Stock</Badge>
                        )}
                        {notification.type === 'customer' && (
                          <Badge variant="success" size="sm">Customer</Badge>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-2 border-t border-gray-200">
                  <button 
                    className="text-sm text-primary-600 hover:text-primary-500"
                    onClick={() => setShowNotifications(false)}
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
            onClick={() => {
              setShowUserMenu(!showUserMenu)
              setShowNotifications(false)
            }}
          >
            <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">JD</span>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-gray-700">John Doe</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <Link
                  to="/admin/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <UserCircleIcon className="h-4 w-4 mr-3 text-gray-400" />
                  Your Profile
                </Link>
                <Link
                  to="/admin/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <CogIcon className="h-4 w-4 mr-3 text-gray-400" />
                  Settings
                </Link>
                <div className="border-t border-gray-100"></div>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setShowUserMenu(false)
                    alert('Signing out...')
                    // Implement logout functionality here
                  }}
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3 text-gray-400" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false)
            setShowUserMenu(false)
          }}
        />
      )}
    </div>
  )
}

export default AdminHeader