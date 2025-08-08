// frontend/src/context/AdminContext.jsx - COMPLETE WORKING VERSION
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import adminApi from '../services/adminApi';
import { cleanInvalidTokens, getTokenInfo } from '../utils/tokenValidator';

// Initial state
const initialState = {
  // Auth state
  isAuthenticated: false,
  admin: null,
  token: null,
  loading: false,
  authChecked: false,
  
  // Dashboard data
  dashboardStats: null,
  
  // Products
  products: [],
  currentProduct: null,
  productsLoading: false,
  productsTotalCount: 0,
  
  // Categories
  categories: [],
  currentCategory: null,
  categoriesLoading: false,
  
  // UI state
  sidebarOpen: true,
  notifications: [],
  
  // Error handling
  error: null,
};

// Action types
const ADMIN_ACTION_TYPES = {
  // Auth actions
  AUTH_CHECK_START: 'AUTH_CHECK_START',
  AUTH_CHECK_SUCCESS: 'AUTH_CHECK_SUCCESS',
  AUTH_CHECK_FAILURE: 'AUTH_CHECK_FAILURE',
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  LOAD_ADMIN: 'LOAD_ADMIN',
  
  // Dashboard actions
  SET_DASHBOARD_STATS: 'SET_DASHBOARD_STATS',
  
  // Product actions
  SET_PRODUCTS_LOADING: 'SET_PRODUCTS_LOADING',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_CURRENT_PRODUCT: 'SET_CURRENT_PRODUCT',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  
  // Category actions
  SET_CATEGORIES_LOADING: 'SET_CATEGORIES_LOADING',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_CURRENT_CATEGORY: 'SET_CURRENT_CATEGORY',
  ADD_CATEGORY: 'ADD_CATEGORY',
  UPDATE_CATEGORY: 'UPDATE_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
  
  // UI actions
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  
  // Error handling
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer function
const adminReducer = (state, action) => {
  switch (action.type) {
    // Auth cases
    case ADMIN_ACTION_TYPES.AUTH_CHECK_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case ADMIN_ACTION_TYPES.AUTH_CHECK_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        admin: action.payload,
        loading: false,
        authChecked: true,
        error: null,
      };
      
    case ADMIN_ACTION_TYPES.AUTH_CHECK_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        admin: null,
        token: null,
        loading: false,
        authChecked: true,
        error: action.payload,
      };
    
    case ADMIN_ACTION_TYPES.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case ADMIN_ACTION_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        admin: action.payload.admin,
        token: action.payload.token,
        loading: false,
        authChecked: true,
        error: null,
      };
      
    case ADMIN_ACTION_TYPES.LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        admin: null,
        token: null,
        loading: false,
        authChecked: true,
        error: action.payload,
      };
      
    case ADMIN_ACTION_TYPES.LOGOUT:
      return {
        ...initialState,
        authChecked: true,
      };
      
    // Dashboard cases
    case ADMIN_ACTION_TYPES.SET_DASHBOARD_STATS:
      return {
        ...state,
        dashboardStats: action.payload,
      };
      
    // Product cases
    case ADMIN_ACTION_TYPES.SET_PRODUCTS_LOADING:
      return {
        ...state,
        productsLoading: action.payload,
      };
      
    case ADMIN_ACTION_TYPES.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload.products,
        productsTotalCount: action.payload.totalCount,
        productsLoading: false,
      };
      
    case ADMIN_ACTION_TYPES.SET_CURRENT_PRODUCT:
      return {
        ...state,
        currentProduct: action.payload,
      };
      
    case ADMIN_ACTION_TYPES.ADD_PRODUCT:
      return {
        ...state,
        products: [action.payload, ...state.products],
        productsTotalCount: state.productsTotalCount + 1,
      };
      
    case ADMIN_ACTION_TYPES.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map(product => 
          product._id === action.payload._id ? action.payload : product
        ),
        currentProduct: state.currentProduct?._id === action.payload._id 
          ? action.payload 
          : state.currentProduct,
      };
      
    case ADMIN_ACTION_TYPES.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(product => product._id !== action.payload),
        currentProduct: state.currentProduct?._id === action.payload 
          ? null 
          : state.currentProduct,
        productsTotalCount: Math.max(0, state.productsTotalCount - 1),
      };
      
    // Category cases
    case ADMIN_ACTION_TYPES.SET_CATEGORIES_LOADING:
      return {
        ...state,
        categoriesLoading: action.payload,
      };
      
    case ADMIN_ACTION_TYPES.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
        categoriesLoading: false,
      };
      
    case ADMIN_ACTION_TYPES.SET_CURRENT_CATEGORY:
      return {
        ...state,
        currentCategory: action.payload,
      };
      
    case ADMIN_ACTION_TYPES.ADD_CATEGORY:
      return {
        ...state,
        categories: [action.payload, ...state.categories],
      };
      
    case ADMIN_ACTION_TYPES.UPDATE_CATEGORY:
      return {
        ...state,
        categories: state.categories.map(category => 
          category._id === action.payload._id ? action.payload : category
        ),
        currentCategory: state.currentCategory?._id === action.payload._id 
          ? action.payload 
          : state.currentCategory,
      };
      
    case ADMIN_ACTION_TYPES.DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(category => category._id !== action.payload),
        currentCategory: state.currentCategory?._id === action.payload 
          ? null 
          : state.currentCategory,
      };
      
    // UI cases
    case ADMIN_ACTION_TYPES.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };
      
    case ADMIN_ACTION_TYPES.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, {
          id: Date.now(),
          ...action.payload,
        }],
      };
      
    case ADMIN_ACTION_TYPES.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload),
      };
      
    // Error cases
    case ADMIN_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
      
    case ADMIN_ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
      
    default:
      return state;
  }
};

// Create context
const AdminContext = createContext();

// AdminProvider component
export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // =============================================
  // UTILITY FUNCTIONS
  // =============================================
  
  const addNotification = (notification) => {
    const notificationWithId = {
      id: Date.now(),
      type: 'info',
      ...notification,
    };
    
    dispatch({
      type: ADMIN_ACTION_TYPES.ADD_NOTIFICATION,
      payload: notificationWithId,
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(notificationWithId.id);
    }, 5000);
  };
  
  const removeNotification = (id) => {
    dispatch({
      type: ADMIN_ACTION_TYPES.REMOVE_NOTIFICATION,
      payload: id,
    });
  };

  // Clear authentication manually
  const clearAuth = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    dispatch({ type: ADMIN_ACTION_TYPES.LOGOUT });
    addNotification({
      type: 'warning',
      message: 'Session expired. Please login again.',
    });
  };

  // =============================================
  // AUTHENTICATION ACTIONS
  // =============================================

  const login = async (credentials) => {
    try {
      dispatch({ type: ADMIN_ACTION_TYPES.LOGIN_START });
      
      const response = await adminApi.login(credentials);
      
      if (response.success) {
        const { admin, token } = response.data;
        
        // Store in localStorage
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(admin));
        
        dispatch({
          type: ADMIN_ACTION_TYPES.LOGIN_SUCCESS,
          payload: { admin, token },
        });
        
        addNotification({
          type: 'success',
          message: `Welcome back, ${admin.name}!`,
        });
        
        return { success: true };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      dispatch({
        type: ADMIN_ACTION_TYPES.LOGIN_FAILURE,
        payload: error.message,
      });
      
      addNotification({
        type: 'error',
        message: error.message || 'Login failed',
      });
      
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await adminApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      dispatch({ type: ADMIN_ACTION_TYPES.LOGOUT });
      
      addNotification({
        type: 'info',
        message: 'Logged out successfully',
      });
    }
  };

  // Check authentication on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch({ type: ADMIN_ACTION_TYPES.AUTH_CHECK_START });
        
        // Clean any invalid tokens first
        cleanInvalidTokens();
        
        // Get token info for debugging
        const tokenInfo = getTokenInfo();
        console.log('🔍 Current token info:', tokenInfo);
        
        // Check if we have valid stored authentication
        if (adminApi.isAuthenticated() && tokenInfo.isValid) {
          const storedAdmin = adminApi.getStoredAdmin();
          console.log('🔐 Found valid stored authentication:', storedAdmin);
          
          // Verify the token is still valid with backend by making a test call
          try {
            console.log('🔍 Verifying token with backend...');
            const profileResponse = await adminApi.getProfile();
            
            if (profileResponse.success) {
              console.log('✅ Token verified with backend successfully');
              dispatch({
                type: ADMIN_ACTION_TYPES.AUTH_CHECK_SUCCESS,
                payload: storedAdmin,
              });
              return;
            }
          } catch (verifyError) {
            console.log('❌ Token verification failed:', verifyError.message);
            // Token is invalid, clear it and continue to failure state
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
          }
        }
        
        // No valid auth found or token verification failed
        console.log('🔓 AdminContext: No valid authentication found');
        dispatch({ 
          type: ADMIN_ACTION_TYPES.AUTH_CHECK_FAILURE, 
          payload: null 
        });
        
      } catch (error) {
        console.error('❌ AdminContext: Authentication initialization error:', error);
        dispatch({ 
          type: ADMIN_ACTION_TYPES.AUTH_CHECK_FAILURE,
          payload: error.message 
        });
      }
    };

    checkAuth();
  }, []);

  // =============================================
  // DASHBOARD ACTIONS
  // =============================================

  const loadDashboardStats = async () => {
    try {
      const response = await adminApi.getDashboardStats();
      if (response.success) {
        dispatch({
          type: ADMIN_ACTION_TYPES.SET_DASHBOARD_STATS,
          payload: response.data,
        });
      }
    } catch (error) {
      console.error('Dashboard stats error:', error);
      // Don't show error notification for dashboard stats
    }
  };

  // =============================================
  // PRODUCT ACTIONS
  // =============================================

  const loadProducts = async (params = {}) => {
    try {
      dispatch({ type: ADMIN_ACTION_TYPES.SET_PRODUCTS_LOADING, payload: true });
      
      const response = await adminApi.getAdminProducts(params);
      
      if (response.success) {
        dispatch({
          type: ADMIN_ACTION_TYPES.SET_PRODUCTS,
          payload: {
            products: response.data || [],
            totalCount: response.pagination?.totalProducts || response.data?.length || 0,
          },
        });
      }
    } catch (error) {
      console.error('Load products error:', error);
      // Set empty products instead of leaving in loading state
      dispatch({
        type: ADMIN_ACTION_TYPES.SET_PRODUCTS,
        payload: { products: [], totalCount: 0 },
      });
      
      // Handle authentication errors
      if (error.message.includes('Invalid or expired token')) {
        clearAuth();
      }
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
      
      if (error.message.includes('Invalid or expired token')) {
        clearAuth();
      }
      
      return { success: false, error: error.message };
    }
  };

  // 🆕 CREATE PRODUCT METHOD - MAIN FIX
  const createProduct = async (formData, images) => {
    try {
      console.log('🎯 AdminContext: Creating product...');
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // FIXED: Backend field mapping
      const backendMapping = {
        product_name: formData.product_name,
        product_description: formData.product_description,
        product_brand: formData.product_brand,
        
        // FIXED: Correct backend field names
        primaryCategory: formData.category,  // Single protection type
        secondaryCategories: JSON.stringify(formData.industries || []), // Industries array
        
        // Pricing & Inventory
        product_price: formData.product_price,
        stock: formData.stock,
        lowStockThreshold: formData.lowStockThreshold || '10',
        
        // Sale Configuration
        isOnSale: formData.isOnSale || false,
        salePrice: formData.salePrice || '',
        saleStartDate: formData.saleStartDate || '',
        saleEndDate: formData.saleEndDate || '',
        
        // Status & Features
        status: formData.status || 'active',
        isFeatured: formData.isFeatured || false,
        isNewArrival: formData.isNewArrival || false,
        
        // SEO Fields (advanced)
        metaTitle: formData.metaTitle || '',
        metaDescription: formData.metaDescription || '',
        keywords: formData.keywords || '',
        slug: formData.slug || '',
        focusKeyword: formData.focusKeyword || ''
      };
      
      // Append all form fields
      Object.keys(backendMapping).forEach(key => {
        if (backendMapping[key] !== '' && backendMapping[key] !== null && backendMapping[key] !== undefined) {
          formDataToSend.append(key, backendMapping[key]);
        }
      });
      
      // Append images
      if (images && images.length > 0) {
        images.forEach((image) => {
          formDataToSend.append('images', image);
        });
      }
      
      // Make API call with proper auth
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      console.log('🚀 Sending product creation request...');
      
      const response = await fetch(`${API_BASE}/admin/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      if (result.success) {
        // Add to products list
        dispatch({
          type: ADMIN_ACTION_TYPES.ADD_PRODUCT,
          payload: result.data,
        });
        
        addNotification({
          type: 'success',
          message: '🎯 Product created successfully with multi-category targeting!',
        });
        
        console.log('✅ Product created successfully:', result.data._id);
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || 'Failed to create product');
      }
      
    } catch (error) {
      console.error('❌ Create product error:', error);
      
      if (error.message.includes('Invalid or expired token')) {
        clearAuth();
      }
      
      addNotification({
        type: 'error',
        message: error.message || 'Failed to create product',
      });
      
      return { success: false, error: error.message };
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
          message: 'Product updated successfully!',
        });
        
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Update product error:', error);
      
      if (error.message.includes('Invalid or expired token')) {
        clearAuth();
      }
      
      addNotification({
        type: 'error',
        message: error.message || 'Failed to update product',
      });
      
      return { success: false, error: error.message };
    }
  };

  // =============================================
  // CATEGORY ACTIONS
  // =============================================

  const loadCategories = async () => {
    try {
      dispatch({ type: ADMIN_ACTION_TYPES.SET_CATEGORIES_LOADING, payload: true });
      
      const response = await adminApi.getAdminCategories();
      
      if (response.success) {
        dispatch({
          type: ADMIN_ACTION_TYPES.SET_CATEGORIES,
          payload: response.data || [],
        });
      }
    } catch (error) {
      console.error('Load categories error:', error);
      // Set empty categories instead of leaving in loading state
      dispatch({
        type: ADMIN_ACTION_TYPES.SET_CATEGORIES,
        payload: [],
      });
      
      // Handle authentication errors
      if (error.message.includes('Invalid or expired token')) {
        clearAuth();
      }
    }
  };

  const loadCategory = async (id) => {
    try {
      const response = await adminApi.getAdminCategory(id);
      if (response.success) {
        dispatch({
          type: ADMIN_ACTION_TYPES.SET_CURRENT_CATEGORY,
          payload: response.data,
        });
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Load category error:', error);
      
      if (error.message.includes('Invalid or expired token')) {
        clearAuth();
      }
      
      return { success: false, error: error.message };
    }
  };

  const createCategory = async (categoryData) => {
    try {
      const response = await adminApi.createCategory(categoryData);
      
      if (response.success) {
        dispatch({
          type: ADMIN_ACTION_TYPES.ADD_CATEGORY,
          payload: response.data,
        });
        
        addNotification({
          type: 'success',
          message: 'Category created successfully!',
        });
        
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Create category error:', error);
      
      if (error.message.includes('Invalid or expired token')) {
        clearAuth();
      }
      
      addNotification({
        type: 'error',
        message: error.message || 'Failed to create category',
      });
      
      return { success: false, error: error.message };
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const response = await adminApi.updateCategory(id, categoryData);
      
      if (response.success) {
        dispatch({
          type: ADMIN_ACTION_TYPES.UPDATE_CATEGORY,
          payload: response.data,
        });
        
        addNotification({
          type: 'success',
          message: 'Category updated successfully!',
        });
        
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Update category error:', error);
      
      if (error.message.includes('Invalid or expired token')) {
        clearAuth();
      }
      
      addNotification({
        type: 'error',
        message: error.message || 'Failed to update category',
      });
      
      return { success: false, error: error.message };
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await adminApi.deleteCategory(id);
      
      if (response.success) {
        dispatch({
          type: ADMIN_ACTION_TYPES.DELETE_CATEGORY,
          payload: id,
        });
        
        addNotification({
          type: 'success',
          message: 'Category deleted successfully!',
        });
        
        return { success: true };
      }
    } catch (error) {
      console.error('Delete category error:', error);
      
      if (error.message.includes('Invalid or expired token')) {
        clearAuth();
      }
      
      addNotification({
        type: 'error',
        message: error.message || 'Failed to delete category',
      });
      
      return { success: false, error: error.message };
    }
  };

  // =============================================
  // UI ACTIONS
  // =============================================

  const toggleSidebar = () => {
    dispatch({ type: ADMIN_ACTION_TYPES.TOGGLE_SIDEBAR });
  };

  // Context value
  const contextValue = {
    // State
    ...state,
    
    // Auth actions
    login,
    logout,
    clearAuth,
    
    // Dashboard actions
    loadDashboardStats,
    
    // Product actions
    loadProducts,
    loadProduct,
    createProduct, // 🆕 NEW METHOD ADDED
    updateProduct,
    
    // Category actions
    loadCategories,
    loadCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    
    // UI actions
    toggleSidebar,
    
    // Notification actions
    addNotification,
    removeNotification,
    
    // Utility functions
    formatCurrency: adminApi.formatCurrency,
    formatDate: adminApi.formatDate,
    
    // Debug utilities
    getTokenInfo,
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