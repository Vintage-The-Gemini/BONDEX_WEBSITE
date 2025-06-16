import { Link, useLocation } from 'react-router-dom'
import { Fragment } from 'react'
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  TagIcon,
  BuildingStorefrontIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: HomeIcon,
      current: location.pathname === '/admin/dashboard'
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: CubeIcon,
      current: location.pathname.startsWith('/admin/products'),
      badge: '1,247',
      children: [
        { name: 'All Products', href: '/admin/products' },
        { name: 'Add Product', href: '/admin/products/add' },
        { name: 'Categories', href: '/admin/products/categories' },
        { name: 'Inventory', href: '/admin/products/inventory' }
      ]
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCartIcon,
      current: location.pathname.startsWith('/admin/orders'),
      badge: '23',
      badgeColor: 'bg-secondary-500',
      children: [
        { name: 'All Orders', href: '/admin/orders' },
        { name: 'Pending Orders', href: '/admin/orders/pending', badge: '12' },
        { name: 'Shipped Orders', href: '/admin/orders/shipped' },
        { name: 'Returns', href: '/admin/orders/returns', badge: '3' }
      ]
    },
    {
      name: 'Customers',
      href: '/admin/customers',
      icon: UsersIcon,
      current: location.pathname.startsWith('/admin/customers'),
      badge: '892'
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: ChartBarIcon,
      current: location.pathname.startsWith('/admin/analytics'),
      children: [
        { name: 'Sales Reports', href: '/admin/analytics/sales' },
        { name: 'Product Analytics', href: '/admin/analytics/products' },
        { name: 'Customer Analytics', href: '/admin/analytics/customers' },
        { name: 'Inventory Reports', href: '/admin/analytics/inventory' }
      ]
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: CogIcon,
      current: location.pathname.startsWith('/admin/settings'),
      children: [
        { name: 'General Settings', href: '/admin/settings/general' },
        { name: 'Payment Settings', href: '/admin/settings/payment' },
        { name: 'Shipping Settings', href: '/admin/settings/shipping' },
        { name: 'User Management', href: '/admin/settings/users' }
      ]
    }
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-700">
        <ShieldCheckIcon className="h-8 w-8 text-primary-400" />
        <div className="ml-3">
          <h1 className="text-lg font-bold text-white">Bondex Admin</h1>
          <p className="text-xs text-gray-400">Safety Equipment</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => (
          <div key={item.name}>
            <Link
              to={item.href}
              className={`admin-sidebar-item ${item.current ? 'active' : ''} group relative`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  item.badgeColor || 'bg-primary-500'
                } text-white`}>
                  {item.badge}
                </span>
              )}
            </Link>
            
            {/* Sub-navigation */}
            {item.children && item.current && (
              <div className="ml-8 mt-2 space-y-1">
                {item.children.map((child) => (
                  <Link
                    key={child.name}
                    to={child.href}
                    className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      location.pathname === child.href
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <span className="flex-1">{child.name}</span>
                    {child.badge && (
                      <span className="ml-2 px-2 py-1 text-xs bg-secondary-500 text-brandBlack rounded-full">
                        {child.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Info */}
      <div className="px-4 py-4 border-t border-gray-700">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">JD</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">John Doe</p>
            <p className="text-xs text-gray-400">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6 text-white" />
                    </button>
                  </div>
                </Transition.Child>
                
                <div className="admin-sidebar">
                  <SidebarContent />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:block admin-sidebar">
        <SidebarContent />
      </div>
    </>
  )
}

export default AdminSidebar