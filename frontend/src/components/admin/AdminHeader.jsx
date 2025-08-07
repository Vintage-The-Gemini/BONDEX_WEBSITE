// frontend/src/components/admin/AdminHeader.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  RefreshCw
} from 'lucide-react';

const AdminHeader = () => {
  const { 
    toggleSidebar, 
    admin, 
    logout, 
    notifications,
    loadDashboardStats 
  } = useAdmin();
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setNotificationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/admin' || path === '/admin/dashboard') return 'Dashboard';
    if (path === '/admin/products') return 'Products';
    if (path === '/admin/products/create') return 'Create Product';
    if (path.includes('/admin/products/') && path.includes('/edit')) return 'Edit Product';
    if (path.includes('/admin/products/')) return 'Product Details';
    if (path === '/admin/categories') return 'Categories';
    if (path === '/admin/categories/create') return 'Create Category';
    if (path.includes('/admin/categories/') && path.includes('/edit')) return 'Edit Category';
    if (path === '/admin/orders') return 'Orders';
    if (path === '/admin/customers') return 'Customers';
    if (path === '/admin/analytics') return 'Analytics';
    if (path === '/admin/settings') return 'Settings';
    
    return 'Admin Panel';
  };

  // Get breadcrumb items
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const breadcrumbs = [{ name: 'Admin', href: '/admin/dashboard' }];
    
    if (path.includes('/products')) {
      breadcrumbs.push({ name: 'Products', href: '/admin/products' });
      if (path.includes('/create')) {
        breadcrumbs.push({ name: 'Create', href: null });
      } else if (path.includes('/edit')) {
        breadcrumbs.push({ name: 'Edit', href: null });
      }
    } else if (path.includes('/categories')) {
      breadcrumbs.push({ name: 'Categories', href: '/admin/categories' });
      if (path.includes('/create')) {
        breadcrumbs.push({ name: 'Create', href: null });
      } else if (path.includes('/edit')) {
        breadcrumbs.push({ name: 'Edit', href: null });
      }
    } else if (path.includes('/orders')) {
      breadcrumbs.push({ name: 'Orders', href: null });
    } else if (path.includes('/customers')) {
      breadcrumbs.push({ name: 'Customers', href: null });
    } else if (path.includes('/analytics')) {
      breadcrumbs.push({ name: 'Analytics', href: null });
    } else if (path.includes('/settings')) {
      breadcrumbs.push({ name: 'Settings', href: null });
    }
    
    return breadcrumbs;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Page Title & Breadcrumbs */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
              {getBreadcrumbs().map((item, index) => (
                <React.Fragment key={item.name}>
                  {index > 0 && <span>/</span>}
                  {item.href ? (
                    <button
                      onClick={() => navigate(item.href)}
                      className="hover:text-gray-700 transition-colors"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <span className="text-gray-900 font-medium">
                      {item.name}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Refresh Data Button */}
          <button
            onClick={loadDashboardStats}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationDropdownRef}>
            <button
              onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
              className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-1 rounded-full ${
                            notification.type === 'success' ? 'bg-green-100' :
                            notification.type === 'error' ? 'bg-red-100' :
                            notification.type === 'warning' ? 'bg-orange-100' : 'bg-blue-100'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              notification.type === 'success' ? 'bg-green-500' :
                              notification.type === 'error' ? 'bg-red-500' :
                              notification.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm text-gray-500">No notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-3 p-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-black rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="font-medium text-gray-900">
                  {admin?.name || 'Bondex Admin'}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {/* Profile Dropdown */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {admin?.email || 'admin@bondex.com'}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                
                <button
                  onClick={() => {
                    navigate('/admin/settings');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;