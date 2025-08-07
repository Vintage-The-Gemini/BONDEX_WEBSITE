// frontend/src/components/admin/AdminSidebar.jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
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
  X,
  Search,
  TrendingUp,
  Globe,
  ChevronDown,
  ChevronRight,
  Menu
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useAdmin();
  const [expandedMenus, setExpandedMenus] = React.useState(new Set(['products', 'analytics']));

  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'products',
      name: 'Products',
      icon: Package,
      children: [
        { name: 'All Products', href: '/admin/products', icon: Package },
        { name: 'Create Product', href: '/admin/products/create', icon: Plus, highlight: true }
      ]
    },
    {
      id: 'categories',
      name: 'Categories',
      icon: FolderTree,
      children: [
        { name: 'All Categories', href: '/admin/categories', icon: FolderTree },
        { name: 'Create Category', href: '/admin/categories/create', icon: Plus }
      ]
    },
    {
      id: 'orders',
      name: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart
    },
    {
      id: 'customers',
      name: 'Customers',
      href: '/admin/customers',
      icon: Users
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      children: [
        { name: 'Sales Analytics', href: '/admin/analytics/sales', icon: TrendingUp },
        { name: 'SEO Monitoring', href: '/admin/analytics/seo', icon: Search, highlight: true },
        { name: 'Site Analytics', href: '/admin/analytics/site', icon: Globe }
      ]
    },
    {
      id: 'settings',
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings
    }
  ];

  const isActive = (href) => {
    if (href === '/admin/dashboard') {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    }
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const isParentActive = (children) => {
    return children.some(child => isActive(child.href));
  };

  const toggleMenu = (menuId) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId);
    } else {
      newExpanded.add(menuId);
    }
    setExpandedMenus(newExpanded);
  };

  const renderNavItem = (item) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.has(item.id);
    const itemIsActive = hasChildren ? isParentActive(item.children) : isActive(item.href);

    if (hasChildren) {
      return (
        <div key={item.id} className="space-y-1">
          <button
            onClick={() => toggleMenu(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all ${
              itemIsActive
                ? 'bg-orange-100 text-orange-800 border-l-4 border-orange-500'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center">
              <item.icon className="mr-3 h-5 w-5" />
              {sidebarOpen && <span>{item.name}</span>}
            </div>
            {sidebarOpen && (
              isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
            )}
          </button>
          
          {sidebarOpen && isExpanded && (
            <div className="ml-6 space-y-1">
              {item.children.map((child) => (
                <NavLink
                  key={child.href}
                  to={child.href}
                  className={({ isActive }) => 
                    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                      isActive
                        ? 'bg-orange-100 text-orange-800 border-l-4 border-orange-500'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    } ${child.highlight ? 'ring-1 ring-orange-200' : ''}`
                  }
                >
                  <child.icon className="mr-3 h-4 w-4" />
                  <span>{child.name}</span>
                  {child.highlight && (
                    <span className="ml-2 text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded font-bold">
                      NEW
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.id}
        to={item.href}
        className={({ isActive }) => 
          `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
            isActive
              ? 'bg-orange-100 text-orange-800 border-l-4 border-orange-500'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`
        }
      >
        <item.icon className="mr-3 h-5 w-5" />
        {sidebarOpen && <span>{item.name}</span>}
      </NavLink>
    );
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
      <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'w-64' : 'w-20'
      } flex flex-col`}>
        
        {/* Header with Logo and Toggle */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Target className="h-8 w-8 text-orange-500" />
            {sidebarOpen && (
              <span className="text-xl font-bold text-gray-900">Bondex Admin</span>
            )}
          </div>
          
          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
        
        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
          {navigationItems.map(renderNavItem)}
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;