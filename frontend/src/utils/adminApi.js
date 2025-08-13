// frontend/src/utils/adminApi.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // Handle authentication errors
    if (response.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      throw new Error('Authentication failed. Please login again.');
    }
    
    throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  
  return data;
};

// =============================================
// AUTHENTICATION API FUNCTIONS
// =============================================

export const loginAdmin = async (credentials) => {
  try {
    console.log('🔐 Admin login attempt...');
    
    const response = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await handleResponse(response);
    console.log('✅ Admin login successful');
    
    return data;
  } catch (error) {
    console.error('❌ Admin login error:', error);
    throw error;
  }
};

export const registerAdmin = async (adminData) => {
  try {
    console.log('📝 Admin registration attempt...');
    
    const response = await fetch(`${API_BASE}/admin/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData),
    });

    const data = await handleResponse(response);
    console.log('✅ Admin registration successful');
    
    return data;
  } catch (error) {
    console.error('❌ Admin registration error:', error);
    throw error;
  }
};

export const verifyAdminToken = async () => {
  try {
    const response = await fetch(`${API_BASE}/admin/verify`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error('❌ Token verification error:', error);
    throw error;
  }
};

// =============================================
// PRODUCTS API FUNCTIONS
// =============================================

export const getAdminProducts = async (params = {}) => {
  try {
    console.log('📦 Fetching admin products...');
    
    // Build query string
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const url = `${API_BASE}/admin/products${queryString ? `?${queryString}` : ''}`;
    
    console.log('🔍 API URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    console.log(`✅ Fetched ${data.data?.length || 0} products`);
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching admin products:', error);
    throw error;
  }
};

export const getAdminProduct = async (id) => {
  try {
    console.log(`📦 Fetching admin product: ${id}`);
    
    const response = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    console.log(`✅ Fetched product: ${data.data?.product_name}`);
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching admin product:', error);
    throw error;
  }
};

export const updateAdminProduct = async (id, productData) => {
  try {
    console.log(`🔄 Updating admin product: ${id}`);
    
    const response = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    const data = await handleResponse(response);
    console.log(`✅ Updated product: ${data.data?.product_name}`);
    
    return data;
  } catch (error) {
    console.error('❌ Error updating admin product:', error);
    throw error;
  }
};

export const deleteAdminProduct = async (id) => {
  try {
    console.log(`🗑️ Deleting admin product: ${id}`);
    
    const response = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    console.log('✅ Product deleted successfully');
    
    return data;
  } catch (error) {
    console.error('❌ Error deleting admin product:', error);
    throw error;
  }
};

export const bulkUpdateProducts = async (productIds, updates) => {
  try {
    console.log(`🔄 Bulk updating ${productIds.length} products`);
    
    const response = await fetch(`${API_BASE}/admin/products/bulk`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productIds, updates }),
    });

    const data = await handleResponse(response);
    console.log(`✅ Bulk update completed: ${data.data?.modifiedCount} products`);
    
    return data;
  } catch (error) {
    console.error('❌ Error in bulk update:', error);
    throw error;
  }
};

export const getProductAnalytics = async () => {
  try {
    console.log('📊 Fetching product analytics...');
    
    const response = await fetch(`${API_BASE}/admin/products/analytics`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    console.log('✅ Analytics fetched successfully');
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching analytics:', error);
    throw error;
  }
};

// =============================================
// CATEGORIES API FUNCTIONS
// =============================================

export const getAdminCategories = async (params = {}) => {
  try {
    console.log('📂 Fetching admin categories...');
    
    // Build query string
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const url = `${API_BASE}/admin/categories${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    console.log(`✅ Fetched ${data.data?.length || 0} categories`);
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching admin categories:', error);
    throw error;
  }
};

export const getAdminCategory = async (id) => {
  try {
    console.log(`📂 Fetching admin category: ${id}`);
    
    const response = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    console.log(`✅ Fetched category: ${data.data?.name}`);
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching admin category:', error);
    throw error;
  }
};

export const createAdminCategory = async (categoryData) => {
  try {
    console.log('➕ Creating admin category...');
    
    const response = await fetch(`${API_BASE}/admin/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });

    const data = await handleResponse(response);
    console.log(`✅ Created category: ${data.data?.name}`);
    
    return data;
  } catch (error) {
    console.error('❌ Error creating admin category:', error);
    throw error;
  }
};

export const updateAdminCategory = async (id, categoryData) => {
  try {
    console.log(`🔄 Updating admin category: ${id}`);
    
    const response = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });

    const data = await handleResponse(response);
    console.log(`✅ Updated category: ${data.data?.name}`);
    
    return data;
  } catch (error) {
    console.error('❌ Error updating admin category:', error);
    throw error;
  }
};

export const deleteAdminCategory = async (id) => {
  try {
    console.log(`🗑️ Deleting admin category: ${id}`);
    
    const response = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    console.log('✅ Category deleted successfully');
    
    return data;
  } catch (error) {
    console.error('❌ Error deleting admin category:', error);
    throw error;
  }
};

// =============================================
// ORDERS API FUNCTIONS
// =============================================

export const getAdminOrders = async (params = {}) => {
  try {
    console.log('📋 Fetching admin orders...');
    
    // Build query string
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const url = `${API_BASE}/admin/orders${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    console.log(`✅ Fetched ${data.data?.length || 0} orders`);
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching admin orders:', error);
    throw error;
  }
};

export const getAdminOrder = async (id) => {
  try {
    console.log(`📋 Fetching admin order: ${id}`);
    
    const response = await fetch(`${API_BASE}/admin/orders/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    console.log(`✅ Fetched order: ${data.data?.orderNumber}`);
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching admin order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (id, status, notes = '') => {
  try {
    console.log(`🔄 Updating order status: ${id} -> ${status}`);
    
    const response = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes }),
    });

    const data = await handleResponse(response);
    console.log(`✅ Order status updated: ${status}`);
    
    return data;
  } catch (error) {
    console.error('❌ Error updating order status:', error);
    throw error;
  }
};

// =============================================
// DASHBOARD/ANALYTICS API FUNCTIONS
// =============================================

export const getDashboardStats = async () => {
  try {
    console.log('📊 Fetching dashboard stats...');
    
    const response = await fetch(`${API_BASE}/admin/dashboard/stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    console.log('✅ Dashboard stats fetched');
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error);
    throw error;
  }
};

export const getRevenueAnalytics = async (period = '30d') => {
  try {
    console.log(`📈 Fetching revenue analytics: ${period}`);
    
    const response = await fetch(`${API_BASE}/admin/analytics/revenue?period=${period}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    console.log('✅ Revenue analytics fetched');
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching revenue analytics:', error);
    throw error;
  }
};

// =============================================
// FILE UPLOAD HELPERS
// =============================================

export const uploadProductImages = async (files) => {
  try {
    console.log(`📸 Uploading ${files.length} product images...`);
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE}/admin/upload/product-images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData
      },
      body: formData,
    });

    const data = await handleResponse(response);
    console.log(`✅ Uploaded ${data.data?.length || 0} images`);
    
    return data;
  } catch (error) {
    console.error('❌ Error uploading images:', error);
    throw error;
  }
};

export const uploadCategoryImage = async (file) => {
  try {
    console.log('📸 Uploading category image...');
    
    const formData = new FormData();
    formData.append('image', file);
    
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE}/admin/upload/category-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData
      },
      body: formData,
    });

    const data = await handleResponse(response);
    console.log('✅ Category image uploaded');
    
    return data;
  } catch (error) {
    console.error('❌ Error uploading category image:', error);
    throw error;
  }
};

// =============================================
// UTILITY FUNCTIONS
// =============================================

export const testConnection = async () => {
  try {
    console.log('🔌 Testing API connection...');
    
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
    });

    const data = await handleResponse(response);
    console.log('✅ API connection successful');
    
    return data;
  } catch (error) {
    console.error('❌ API connection failed:', error);
    throw error;
  }
};

export default {
  // Auth
  loginAdmin,
  registerAdmin,
  verifyAdminToken,
  
  // Products
  getAdminProducts,
  getAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  bulkUpdateProducts,
  getProductAnalytics,
  
  // Categories
  getAdminCategories,
  getAdminCategory,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  
  // Orders
  getAdminOrders,
  getAdminOrder,
  updateOrderStatus,
  
  // Analytics
  getDashboardStats,
  getRevenueAnalytics,
  
  // Uploads
  uploadProductImages,
  uploadCategoryImage,
  
  // Utils
  testConnection
};