// frontend/src/context/AdminContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import adminApi from '../services/adminApi';

// Action types
export const ADMIN_ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_AUTH: 'SET_AUTH',
  CLEAR_AUTH: 'CLEAR_AUTH',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_PRODUCTS_LOADING: 'SET_PRODUCTS_LOADING',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  SET_CURRENT_PRODUCT: 'SET_CURRENT_PRODUCT',
  SET_CATEGORIES: 'SET_CATEGORIES',
  ADD_CATEGORY: 'ADD_CATEGORY',
  UPDATE_CATEGORY: 'UPDATE_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
  SET_DASHBOARD_STATS: 'SET_DASHBOARD_STATS',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Initial state
const initialState = {
  loading: false,
  isAuthenticated: false,
  admin: null,
  token: localStorage.getItem('adminToken'),
  products: [],
  productsLoading: false,
  totalProducts: 0,
  currentProduct: null,
  categories: [],
  currentCategory: null,
  dashboardStats: null,
  sidebarOpen: true,
  notifications: [],
  error: null,
};

// Reducer
const adminReducer = (state, action) => {
  switch (action.type) {
    case ADMIN_ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };

    case ADMIN_ACTION_TYPES.SET_AUTH:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        admin: action.payload.admin,
        token: action.payload.token,
        loading: false,
      };

    case ADMIN_ACTION_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        admin: action.payload.admin,
        token: action.payload.token,
        loading: false,
      };

    case ADMIN_ACTION_TYPES.LOGOUT:
    case ADMIN_ACTION_TYPES.CLEAR_AUTH:
      return {
        ...state,
        isAuthenticated: false,
        admin: null,
        token: null,
        loading: false,
      };

    case ADMIN_ACTION_TYPES.SET_PRODUCTS_LOADING:
      return { ...state, productsLoading: action.payload };

    case ADMIN_ACTION_TYPES.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload.products || action.payload,
        totalProducts: action.payload.totalCount || (action.payload.products ? action.payload.products.length : action.payload.length),
        productsLoading: false,
      };

    case ADMIN_ACTION_TYPES.ADD_PRODUCT:
      return {
        ...state,
        products: [action.payload, ...state.products],
        totalProducts: state.totalProducts + 1,
      };

    case ADMIN_ACTION_TYPES.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map(product =>
          product._id === action.payload._id ? action.payload : product
        ),
        currentProduct: state.currentProduct?._id === action.payload._id 
          ? action.payload : state.currentProduct,
      };

    case ADMIN_ACTION_TYPES.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(product => product._id !== action.payload),
        totalProducts: Math.max(0, state.totalProducts - 1),
        currentProduct: state.currentProduct?._id === action.payload ? null : state.currentProduct,
      };

    case ADMIN_ACTION_TYPES.SET_CURRENT_PRODUCT:
      return { ...state, currentProduct: action.payload };

    case ADMIN_ACTION_TYPES.SET_CATEGORIES:
      return { ...state, categories: action.payload };

    case ADMIN_ACTION_TYPES.ADD_CATEGORY:
      return { ...state, categories: [action.payload, ...state.categories] };

    case ADMIN_ACTION_TYPES.UPDATE_CATEGORY:
      return {
        ...state,
        categories: state.categories.map(category =>
          category._id === action.payload._id ? action.payload : category
        ),
      };

    case ADMIN_ACTION_TYPES.DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(category => category._id !== action.payload),
      };

    case ADMIN_ACTION_TYPES.SET_DASHBOARD_STATS:
      return { ...state, dashboardStats: action.payload };

    case ADMIN_ACTION_TYPES.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case ADMIN_ACTION_TYPES.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case ADMIN_ACTION_TYPES.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload),
      };

    case ADMIN_ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload };

    case ADMIN_ACTION_TYPES.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

// Create context
const AdminContext = createContext();

// AdminProvider component
export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      const adminData = localStorage.getItem('adminUser');
      
      if (token && adminData) {
        try {
          const admin = JSON.parse(adminData);
          dispatch({
            type: ADMIN_ACTION_TYPES.SET_AUTH,
            payload: {
              isAuthenticated: true,
              admin: admin,
              token: token,
            },
          });
        } catch (error) {
          console.error('Auth restoration failed:', error);
          clearAuth();
        }
      } else {
        dispatch({ type: ADMIN_ACTION_TYPES.SET_LOADING, payload: false });
      }
    };

    checkAuth();
  }, []);

  // =============================================
  // UTILITY FUNCTIONS
  // =============================================
  
  // Format currency in KES
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'KES 0';
    
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return 'KES 0';
    
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  };

  // Format date
  const formatDate = (date, options = {}) => {
    if (!date) return '';
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    
    try {
      return new Date(date).toLocaleDateString('en-KE', defaultOptions);
    } catch (error) {
      console.error('Date formatting error:', error);
      return date;
    }
  };

  // Add notification
  const addNotification = (notification) => {
    const notificationWithId = {
      id: Date.now(),
      type: 'info',
      duration: 5000,
      ...notification,
    };

    dispatch({
      type: ADMIN_ACTION_TYPES.ADD_NOTIFICATION,
      payload: notificationWithId,
    });

    // Auto-remove after duration
    if (notificationWithId.duration > 0) {
      setTimeout(() => {
        removeNotification(notificationWithId.id);
      }, notificationWithId.duration);
    }
  };

  // Remove notification
  const removeNotification = (id) => {
    dispatch({
      type: ADMIN_ACTION_TYPES.REMOVE_NOTIFICATION,
      payload: id,
    });
  };

  // Clear authentication
  const clearAuth = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    dispatch({ type: ADMIN_ACTION_TYPES.CLEAR_AUTH });
  };

  // =============================================
  // AUTHENTICATION FUNCTIONS
  // =============================================
  
  const login = async (credentials) => {
    try {
      dispatch({ type: ADMIN_ACTION_TYPES.SET_LOADING, payload: true });
      
      const response = await adminApi.loginAdmin(credentials);
      
      if (response.success) {
        localStorage.setItem('adminToken', response.token || response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.admin || response.data.admin));
        
        dispatch({
          type: ADMIN_ACTION_TYPES.LOGIN_SUCCESS,
          payload: {
            admin: response.admin || response.data.admin,
            token: response.token || response.data.token,
          },
        });
        
        addNotification({
          type: 'success',
          message: `Welcome back, ${(response.admin || response.data.admin).name}!`
        });
        
        return { success: true };
      } else {
        addNotification({
          type: 'error',
          message: response.message || 'Login failed'
        });
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      const errorMessage = error.message || 'Login failed. Please try again.';
      addNotification({
        type: 'error',
        message: errorMessage
      });
      
      dispatch({ type: ADMIN_ACTION_TYPES.SET_LOADING, payload: false });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    clearAuth();
    addNotification({
      type: 'info',
      message: 'Logged out successfully'
    });
  };

  // =============================================
  // DASHBOARD FUNCTIONS
  // =============================================
  
  const loadDashboardStats = async () => {
    try {
      console.log('📊 Loading dashboard statistics...');
      
      const response = await adminApi.getDashboardStats();
      
      if (response.success) {
        dispatch({
          type: ADMIN_ACTION_TYPES.SET_DASHBOARD_STATS,
          payload: response.data,
        });
        
        console.log('✅ Dashboard stats loaded:', response.data);
        return { success: true, data: response.data };
      } else {
        console.warn('Dashboard stats failed:', response.message);
        // Return mock data for development
        const mockData = {
          totalRevenue: 125000,
          totalOrders: 342,
          totalProducts: state.products.length || 156,
          totalCustomers: 89,
          recentOrders: [],
          topProducts: [],
          lowStockProducts: [],
          categoryPerformance: []
        };
        
        dispatch({
          type: ADMIN_ACTION_TYPES.SET_DASHBOARD_STATS,
          payload: mockData,
        });
        
        return { success: true, data: mockData };
      }
    } catch (error) {
      console.error('❌ Dashboard stats error:', error);
      
      if (error.message && error.message.includes('token')) {
        clearAuth();
      }
      
      // Return mock data for development
      const mockData = {
        totalRevenue: 125000,
        totalOrders: 342,
        totalProducts: state.products.length || 156,
        totalCustomers: 89,
        recentOrders: [],
        topProducts: [],
        lowStockProducts: [],
        categoryPerformance: []
      };
      
      dispatch({
        type: ADMIN_ACTION_TYPES.SET_DASHBOARD_STATS,
        payload: mockData,
      });
      
      return { success: true, data: mockData };
    }
  };

  // =============================================
  // PRODUCT FUNCTIONS
  // =============================================
  
  const loadProducts = async (params = {}) => {
    try {
      dispatch({ type: ADMIN_ACTION_TYPES.SET_PRODUCTS_LOADING, payload: true });
      
      const response = await adminApi.getAdminProducts(params);
      
      if (response.success) {
        dispatch({
          type: ADMIN_ACTION_TYPES.SET_PRODUCTS,
          payload: {
            products: response.data.products || response.data || [],
            totalCount: response.data.totalCount || response.pagination?.totalProducts || (response.data.products || response.data || []).length,
          },
        });
        
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Load products error:', error);
      
      // Set empty products to prevent loading state
      dispatch({
        type: ADMIN_ACTION_TYPES.SET_PRODUCTS,
        payload: { products: [], totalCount: 0 },
      });
      
      if (error.message && error.message.includes('token')) {
        clearAuth();
      }
      
      return { success: false, error: error.message };
    }
  };

  const loadProduct = async (id) => {
    try {
      const response = await adminApi.getAdminProduct(id);
      
      if (response.success) {
        dispatch({
          type: ADMIN_ACTION_TYPES.SET_CURRENT_PRODUCT,
          payload: response.data,
        });
        
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Load product error:', error);
      
      if (error.message && error.message.includes('token')) {
        clearAuth();
      }
      
      return { success: false, error: error.message };
    }
  };

  const createProduct = async (formData, imageFiles = []) => {
    try {
      console.log('🎯 AdminContext: Creating product...');
      console.log('📝 Original formData:', formData);
      console.log('🖼️ Images received:', imageFiles?.length || 0);
      
      // ✅ VALIDATE REQUIRED FIELDS FIRST
      if (!formData.product_name?.trim()) {
        throw new Error('Product name is required');
      }
      
      if (!formData.product_description?.trim()) {
        throw new Error('Product description is required');
      }
      
      if (!formData.category) {
        throw new Error('Protection type (category) is required');
      }
      
      if (!formData.industries || formData.industries.length === 0) {
        throw new Error('At least one industry must be selected');
      }
      
      if (!imageFiles || imageFiles.length === 0) {
        throw new Error('At least one product image is required');
      }
      
      if (!formData.product_price || parseFloat(formData.product_price) <= 0) {
        throw new Error('Valid product price is required');
      }
      
      if (formData.stock === '' || parseInt(formData.stock) < 0) {
        throw new Error('Valid stock quantity is required');
      }
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // ✅ FIXED: Correct field mapping to match backend expectations
      const backendMapping = {
        // Basic Product Information
        product_name: formData.product_name?.trim(),
        product_description: formData.product_description?.trim(),
        product_brand: formData.product_brand?.trim() || '',
        
        // ✅ CRITICAL FIX: Map frontend fields to backend fields
        primaryCategory: formData.category,        // Frontend: category -> Backend: primaryCategory
        secondaryCategories: Array.isArray(formData.industries) 
          ? formData.industries.join(',') // Send as comma-separated string for FormData
          : formData.industries || '', // Frontend: industries -> Backend: secondaryCategories
        
        // Pricing & Inventory
        product_price: parseFloat(formData.product_price) || 0,
        stock: parseInt(formData.stock) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 10,
        
        // Sale Configuration
        isOnSale: Boolean(formData.isOnSale),
        salePrice: formData.isOnSale && formData.salePrice ? parseFloat(formData.salePrice) : null,
        saleStartDate: formData.saleStartDate || null,
        saleEndDate: formData.saleEndDate || null,
        
        // Status & Features
        status: formData.status || 'active',
        isFeatured: Boolean(formData.isFeatured),
        isNewArrival: Boolean(formData.isNewArrival),
        
        // SEO & Marketing (Auto-generated if not provided)
        metaTitle: formData.metaTitle?.trim() || `${formData.product_name} - ${formData.product_brand || 'Bondex Safety'} | Kenya`,
        metaDescription: formData.metaDescription?.trim() || `${formData.product_description?.substring(0, 150)}... Available in Kenya. Buy now for KES ${formData.product_price}`,
        keywords: formData.keywords?.trim() || `${formData.product_name}, safety equipment, ${formData.product_brand || 'bondex'}, kenya`,
        slug: formData.slug?.trim() || formData.product_name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        
        // Additional Arrays (if provided) - send as comma-separated strings for FormData
        features: Array.isArray(formData.features) ? formData.features.join(',') : '',
        specifications: Array.isArray(formData.specifications) ? formData.specifications.map(s => `${s.key}:${s.value}`).join(',') : '',
        tags: Array.isArray(formData.tags) ? formData.tags.join(',') : '',
        certifications: Array.isArray(formData.certifications) ? formData.certifications.join(',') : '',
        complianceStandards: Array.isArray(formData.complianceStandards) ? formData.complianceStandards.join(',') : ''
      };
      
      // ✅ ADD ALL MAPPED FIELDS TO FORMDATA
      Object.keys(backendMapping).forEach(key => {
        const value = backendMapping[key];
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });
      
      // ✅ ADD IMAGE FILES
      if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach((file, index) => {
          if (file instanceof File) {
            formDataToSend.append('images', file);
            console.log(`📎 Added image ${index + 1}: ${file.name} (${file.size} bytes)`);
          } else {
            console.warn(`⚠️ Invalid file at index ${index}:`, file);
          }
        });
      }
      
      // ✅ LOG FORMDATA CONTENTS FOR DEBUGGING
      console.log('📋 Final FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }
      
      // ✅ CALL THE NOW-EXISTING FUNCTION
      const response = await adminApi.createProductWithImages(formDataToSend);
      
      if (response.success) {
        console.log('✅ Product created successfully:', response.data);
        
        // Add to products list in context
        dispatch({
          type: ADMIN_ACTION_TYPES.ADD_PRODUCT,
          payload: response.data,
        });
        
        // Add success notification
        addNotification({
          type: 'success',
          message: '🎯 Product created successfully with multi-category targeting!'
        });
        
        return { 
          success: true, 
          data: response.data,
          message: response.message
        };
      } else {
        throw new Error(response.message || 'Failed to create product');
      }
      
    } catch (error) {
      console.error('❌ Create product error:', error);
      
      // Add error notification
      addNotification({
        type: 'error',
        message: error.message || 'Failed to create product'
      });
      
      return { 
        success: false, 
        error: error.message || 'Failed to create product' 
      };
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const response = await adminApi.updateProduct(id, productData);
      
      if (response.success) {
        dispatch({
          type: ADMIN_ACTION_TYPES.UPDATE_PRODUCT,
          payload: response.data,
        });
        
        addNotification({
          type: 'success',
          message: 'Product updated successfully!'
        });
        
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Update product error:', error);
      
      if (error.message && error.message.includes('token')) {
        clearAuth();
      }
      
      const errorMessage = error.message || 'Failed to update product';
      addNotification({
        type: 'error',
        message: errorMessage
      });
      
      return { success: false, error: errorMessage };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await adminApi.deleteProduct(id);
      
      if (response.success) {
        dispatch({
          type: ADMIN_ACTION_TYPES.DELETE_PRODUCT,
          payload: id,
        });
        
        addNotification({
          type: 'success',
          message: 'Product deleted successfully!'
        });
        
        return { success: true };
      }
    } catch (error) {
      console.error('Delete product error:', error);
      
      if (error.message && error.message.includes('token')) {
        clearAuth();
      }
      
      const errorMessage = error.message || 'Failed to delete product';
      addNotification({
        type: 'error',
        message: errorMessage
      });
      
      return { success: false, error: errorMessage };
    }
  };

  // =============================================
  // CATEGORY FUNCTIONS
  // =============================================
  
  const loadCategories = async () => {
    try {
      const response = await adminApi.getAdminCategories();
      
      if (response.success) {
        dispatch({
          type: ADMIN_ACTION_TYPES.SET_CATEGORIES,
          payload: response.data.categories || response.data || [],
        });
        
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Load categories error:', error);
      
      if (error.message && error.message.includes('token')) {
        clearAuth();
      }
      
      return { success: false, error: error.message };
    }
  };

  const createCategory = async (categoryData) => {
    try {
      const response = await adminApi.createAdminCategory(categoryData);
      
      if (response.success) {
        dispatch({
          type: ADMIN_ACTION_TYPES.ADD_CATEGORY,
          payload: response.data,
        });
        
        addNotification({
          type: 'success',
          message: 'Category created successfully!'
        });
        
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Create category error:', error);
      
      if (error.message && error.message.includes('token')) {
        clearAuth();
      }
      
      const errorMessage = error.message || 'Failed to create category';
      addNotification({
        type: 'error',
        message: errorMessage
      });
      
      return { success: false, error: errorMessage };
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const response = await adminApi.updateAdminCategory(id, categoryData);
      
      if (response.success) {
        dispatch({
          type: ADMIN_ACTION_TYPES.UPDATE_CATEGORY,
          payload: response.data,
        });
        
        addNotification({
          type: 'success',
          message: 'Category updated successfully!'
        });
        
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Update category error:', error);
      
      if (error.message && error.message.includes('token')) {
        clearAuth();
      }
      
      const errorMessage = error.message || 'Failed to update category';
      addNotification({
        type: 'error',
        message: errorMessage
      });
      
      return { success: false, error: errorMessage };
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await adminApi.deleteAdminCategory(id);
      
      if (response.success) {
        dispatch({
          type: ADMIN_ACTION_TYPES.DELETE_CATEGORY,
          payload: id,
        });
        
        addNotification({
          type: 'success',
          message: 'Category deleted successfully!'
        });
        
        return { success: true };
      }
    } catch (error) {
      console.error('Delete category error:', error);
      
      if (error.message && error.message.includes('token')) {
        clearAuth();
      }
      
      const errorMessage = error.message || 'Failed to delete category';
      addNotification({
        type: 'error',
        message: errorMessage
      });
      
      return { success: false, error: errorMessage };
    }
  };

  // =============================================
  // UI FUNCTIONS
  // =============================================
  
  const toggleSidebar = () => {
    dispatch({ type: ADMIN_ACTION_TYPES.TOGGLE_SIDEBAR });
  };

  // =============================================
  // CONTEXT VALUE
  // =============================================
  
  const contextValue = {
    // State
    ...state,
    
    // Auth functions
    login,
    logout,
    clearAuth,
    
    // Dashboard functions  
    loadDashboardStats,
    
    // Product functions
    loadProducts,
    loadProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    
    // Category functions
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    
    // Utility functions
    formatCurrency,
    formatDate,
    
    // UI functions
    toggleSidebar,
    addNotification,
    removeNotification,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook to use admin context
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext;