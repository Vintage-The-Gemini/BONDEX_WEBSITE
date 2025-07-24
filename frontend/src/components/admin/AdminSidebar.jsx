// frontend/src/components/admin/AdminSidebar.jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  BarChart3,
  FileText,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  HardHat,
  Eye,
  Footprints,
  Hand
} from 'lucide-react';

const AdminSidebar = () => {
  const { sidebarOpen, toggleSidebar, logout, admin } = useAdmin();
  const location = useLocation();

  const navigationItems = [
    {
      section: 'Overview',
      items: [
        {
          name: 'Dashboard',
          href: '/admin/dashboard',
          icon: LayoutDashboard,
          badge: null
        }
      ]
    },
    {
      section: 'Catalog Management',
      items: [
        {
          name: 'Products',
          href: '/admin/products',
          icon: Package,
          badge: null
        },
        {
          name: 'Categories',
          href: '/admin/categories',
          icon: FolderTree,
          badge: null
        }
      ]
    },
    {
      section: 'Safety Equipment',
      items: [
        {
          name: 'Head Protection',
          href: '/admin/products?category=Head Protection',
          icon: HardHat,
          badge: null
        },
        {
          name: 'Eye Protection',
          href: '/admin/products?category=Eye Protection',
          icon: Eye,
          badge: null
        },
        {
          name: 'Foot Protection',
          href: '/admin/products?category=Foot Protection',
          icon: Footprints,
          badge: null
        },
        {
          name: 'Hand Protection',
          href: '/admin/products?category=Hand Protection',
          icon: Hand,
          badge: null
        }
      ]
    },
    {
      section: 'Business',
      items: [
        {
          name: 'Orders',
          href: '/admin/orders',
          icon: ShoppingCart,
          badge: null, // You can add dynamic badge later
          disabled: false // CHANGED: Enable orders now that backend is ready
        },
        {
          name: 'Customers',
          href: '/admin/customers',
          icon: Users,
          badge: null,
          disabled: true // Will enable when customer management is built
        }
      ]
    },
    {
      section: 'Analytics',
      items: [
        {
          name: 'Analytics',
          href: '/admin/analytics',
          icon: BarChart3,
          badge: null
        },
        {
          name: 'Reports',
          href: '/admin/reports',
          icon: FileText,
          badge: null
        }
      ]
    },
    {
      section: 'Settings',
      items: [
        {
          name: 'Profile',
          href: '/admin/profile',
          icon: User,
          badge: null
        },
        {
          name: 'Settings',
          href: '/admin/settings',
          icon: Settings,
          badge: null
        }
      ]
    }
  ];

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  const isActive = (href) => {
    if (href === '/admin/dashboard') {
      return location.pathname === '/admin/dashboard' || location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full bg-gray-900 text-white transition-all duration-300 flex flex-col
        ${sidebarOpen ? 'w-64' : 'w-20'}
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className={`p-6 border-b border-gray-800 flex items-center ${
          sidebarOpen ? 'justify-between' : 'justify-center'
        }`}>
          {sidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-gray-900" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Bondex Safety</h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            </div>
          )}
          
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          {navigationItems.map((section) => (
            <div key={section.section}>
              {sidebarOpen && (
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  {section.section}
                </h3>
              )}
              
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <li key={item.name}>
                      {item.disabled ? (
                        <div className={`
                          flex items-center px-3 py-2 rounded-lg opacity-50 cursor-not-allowed
                          ${sidebarOpen ? 'justify-start' : 'justify-center'}
                        `}>
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          {sidebarOpen && (
                            <>
                              <span className="ml-3 text-sm font-medium">
                                {item.name}
                              </span>
                              <span className="ml-auto text-xs bg-gray-700 px-2 py-1 rounded">
                                Soon
                              </span>
                            </>
                          )}
                        </div>
                      ) : (
                        <NavLink
                          to={item.href}
                          className={`
                            flex items-center px-3 py-2 rounded-lg transition-colors group
                            ${sidebarOpen ? 'justify-start' : 'justify-center'}
                            ${active 
                              ? 'bg-yellow-500 text-gray-900' 
                              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }
                          `}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          {sidebarOpen && (
                            <>
                              <span className="ml-3 text-sm font-medium">
                                {item.name}
                              </span>
                              {item.badge && (
                                <span className={`
                                  ml-auto text-xs px-2 py-1 rounded-full
                                  ${active 
                                    ? 'bg-gray-900 text-yellow-500' 
                                    : 'bg-red-500 text-white'
                                  }
                                `}>
                                  {item.badge}
                                </span>
                              )}
                            </>
                          )}
                          
                          {/* Tooltip for collapsed sidebar */}
                          {!sidebarOpen && (
                            <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                              {item.name}
                            </div>
                          )}
                        </NavLink>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Admin Info & Logout */}
        <div className="p-4 border-t border-gray-800">
          {sidebarOpen ? (
            <div className="space-y-3">
              {/* Admin Profile Info */}
              <div className="flex items-center space-x-3 px-2 py-1">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {admin?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {admin?.email || 'admin@bondex.com'}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors group"
              >
                <LogOut className="h-4 w-4 mr-3" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              {/* Collapsed Admin Avatar */}
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mx-auto group relative">
                <User className="h-4 w-4" />
                <div className="absolute left-12 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {admin?.name || 'Admin User'}
                </div>
              </div>

              {/* Collapsed Logout Button */}
              <button
                onClick={handleLogout}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-800 rounded-lg transition-colors group relative mx-auto"
              >
                <LogOut className="h-4 w-4 text-gray-300 group-hover:text-white" />
                <div className="absolute left-12 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  Logout
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;