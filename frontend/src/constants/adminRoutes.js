// Admin Panel Routes Configuration
export const ADMIN_ROUTES = {
  // Main Admin Routes
  DASHBOARD: '/admin/dashboard',
  
  // Product Management
  PRODUCTS: '/admin/products',
  PRODUCTS_ADD: '/admin/products/add',
  PRODUCTS_EDIT: '/admin/products/edit/:id',
  PRODUCTS_CATEGORIES: '/admin/products/categories',
  PRODUCTS_INVENTORY: '/admin/products/inventory',
  
  // Order Management
  ORDERS: '/admin/orders',
  ORDERS_PENDING: '/admin/orders/pending',
  ORDERS_SHIPPED: '/admin/orders/shipped',
  ORDERS_RETURNS: '/admin/orders/returns',
  ORDERS_DETAILS: '/admin/orders/:id',
  
  // Customer Management
  CUSTOMERS: '/admin/customers',
  CUSTOMERS_DETAILS: '/admin/customers/:id',
  
  // Analytics
  ANALYTICS: '/admin/analytics',
  ANALYTICS_SALES: '/admin/analytics/sales',
  ANALYTICS_PRODUCTS: '/admin/analytics/products',
  ANALYTICS_CUSTOMERS: '/admin/analytics/customers',
  ANALYTICS_INVENTORY: '/admin/analytics/inventory',
  
  // Settings
  SETTINGS: '/admin/settings',
  SETTINGS_GENERAL: '/admin/settings/general',
  SETTINGS_PAYMENT: '/admin/settings/payment',
  SETTINGS_SHIPPING: '/admin/settings/shipping',
  SETTINGS_USERS: '/admin/settings/users'
}
