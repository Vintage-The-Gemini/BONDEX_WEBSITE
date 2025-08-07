// frontend/src/components/admin/AdminSidebar.jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Plus,
  FolderTree,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Target,
  Globe,
  Eye,
  Edit
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/admin' || location.pathname === '/admin/dashboard'
    },
    {
      name: 'Products',
      icon: Package,
      children: [
        {
          name: 'All Products',
          href: '/admin/products',
          icon: Package,
          current: location.pathname === '/admin/products'
        },
        {
          name: 'Create Product',
          href: '/admin/products/create',
          icon: Plus,
          current: location.pathname === '/admin/products/create',
          highlight: true // 🎯 Highlight the enhanced create page
        },
        {
          name: 'Product Details',
          href: '#',
          icon: Eye,
          current: location.pathname.includes('/admin/products/') && 
                   !location.pathname.includes('/edit') && 
                   !location.pathname.includes('/create'),
          disabled: true,
          note: 'Select a product to view details' // 🎯 Dynamic route
        }
      ]
    },
    {
      name: 'Categories',
      icon: FolderTree,
      children: [
        {
          name: 'All Categories',
          href: '/admin/categories',
          icon: FolderTree,
          current: location.pathname === '/admin/categories'
        },
        {
          name: 'Create Category',
          href: '/admin/categories/create',
          icon: Plus,
          current: location.pathname === '/admin/categories/create'
        }
      ]
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
      current: location.pathname.startsWith('/admin/orders')
    },
    {
      name: 'Customers',
      href: '/admin/customers',
      icon: Users,
      current: location.pathname.startsWith('/admin/customers')
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      current: location.pathname.startsWith('/admin/analytics')
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      current: location.pathname.startsWith('/admin/settings')
    }
  ];

  const NavItem = ({ item, isChild = false }) => {
    const Icon = item.icon;
    
    if (item.children) {
      return (
        <div className="space-y-1">
          <div className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
            item.children.some(child => child.current)
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}>
            <Icon className="mr-3 h-5 w-5" />
            {item.name}
          </div>
          
          <div className="ml-6 space-y-1">
            {item.children.map((child) => (
              <NavItem key={child.name} item={child} isChild={true} />
            ))}
          </div>
        </div>
      );
    }

    if (item.disabled) {
      return (
        <div className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg cursor-not-allowed ${
          isChild ? 'ml-0' : ''
        } ${
          item.current
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-400'
        }`}>
          <Icon className="mr-3 h-4 w-4" />
          <span>{item.name}</span>
          {item.note && (
            <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
              {item.note}
            </span>
          )}
        </div>
      );
    }

    return (
      <NavLink
        to={item.href}
        className={({ isActive }) => 
          `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
            isChild ? 'ml-0' : ''
          } ${
            isActive || item.current
              ? 'bg-blue-100 text-blue-700 shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          } ${
            item.highlight ? 'ring-2 ring-blue-200 bg-gradient-to-r from-blue-50 to-purple-50' : ''
          }`
        }
        onClick={onClose}
      >
        <Icon className="mr-3 h-4 w-4" />
        <span>{item.name}</span>
        {item.highlight && (
          <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded font-bold">
            🎯 ENHANCED
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Target className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Bondex Admin</span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="mt-8 px-4 space-y-2">
          {navigationItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        {/* 🎯 QUICK ACTIONS SECTION */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="space-y-2">
            <NavLink
              to="/admin/products/create"
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              🎯 Create Product
            </NavLink>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Multi-Category & Advanced SEO
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;