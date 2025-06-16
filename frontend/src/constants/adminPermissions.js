// Admin Panel Permissions
export const ADMIN_PERMISSIONS = {
  // Product Permissions
  PRODUCTS_VIEW: 'products:view',
  PRODUCTS_CREATE: 'products:create',
  PRODUCTS_EDIT: 'products:edit',
  PRODUCTS_DELETE: 'products:delete',
  PRODUCTS_BULK: 'products:bulk',
  
  // Order Permissions
  ORDERS_VIEW: 'orders:view',
  ORDERS_EDIT: 'orders:edit',
  ORDERS_REFUND: 'orders:refund',
  ORDERS_SHIP: 'orders:ship',
  
  // Customer Permissions
  CUSTOMERS_VIEW: 'customers:view',
  CUSTOMERS_EDIT: 'customers:edit',
  CUSTOMERS_DELETE: 'customers:delete',
  
  // Analytics Permissions
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',
  
  // Settings Permissions
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  
  // User Management
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete'
}

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff'
}
