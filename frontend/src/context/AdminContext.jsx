// frontend/src/context/AdminContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as adminApi from '../utils/adminApi';

// Action types
const ADMIN_ACTION_TYPES = {
  // Auth actions
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  
  // Products actions
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_PRODUCTS_LOADING: 'SET_PRODUCTS_LOADING',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  SET_CURRENT_PRODUCT: 'SET_CURRENT_PRODUCT',
  
  // Categories actions
  SET_CATEGORIES: 'SET_CATEGORIES',
  ADD_CATEGORY: 'ADD_CATEGORY',
  UPDATE_CATEGORY: 'UPDATE_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
  
  // UI actions
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  
  // Error actions
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Initial state
const initialState = {
  // Auth state
  admin: JSON.parse(localStorage.getItem('adminUser')) || null,
  token: localStorage.getItem('adminToken') || null,
  isAuthenticated: !!localStorage.getItem('adminToken'),
  loading: false,
  
  // Products state
  products: [],
  currentProduct: null,
  productsLoading: false,
  totalProducts: 0,
  
  // Categories state
  categories: [],
  
  // UI state
  sidebarOpen: true,
  notifications: [],
  
  // Error state
  error: null,
};

// Reducer
const adminReducer = (state, action) => {
  switch (action.type) {
    // Auth cases
    case ADMIN_ACTION_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        admin: action.payload.admin,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
      
    case ADMIN_ACTION_TYPES.LOGOUT:
      return {
        ...state,
        admin: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
      
    case ADMIN_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
      
    // Products cases
    case ADMIN_ACTION_TYPES.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload.products || [],
        totalProducts: action.payload.totalCount || 0,
        productsLoading: false,
      };
      
    case ADMIN_ACTION_TYPES.SET_PRODUCTS_LOADING:
      return {
        ...state,
        productsLoading: action.payload,
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
          ? action.payload 
          : state.currentProduct,
      };
      
    case ADMIN_ACTION_TYPES.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(product => product._id !== action.payload),
        totalProducts: Math.max(0, state.totalProducts - 1),
        currentProduct: state.currentProduct?._id === action.payload 
          ? null 
          : state.currentProduct,
      };
      
    case ADMIN_ACTION_TYPES.SET_CURRENT_PRODUCT:
      return {
        ...state,
        currentProduct: action.payload,
      };
      
    // Categories cases
    case ADMIN_ACTION_TYPES.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
      
    case ADMIN_ACTION_TYPES.ADD_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, action.payload],
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
      message: 'Session expired. Please login again.'
    });
  };

  // =============================================
  // AUTHENTICATION FUNCTIONS
  // =============================================
  
  const login = async (email, password) => {
    try {
      dispatch({ type: ADMIN_ACTION_TYPES.SET_LOADING, payload: true });
      
      const response = await adminApi.loginAdmin({ email, password });
      
      if (response.success) {
        localStorage.setItem('adminToken', response.token);
        localStorage.setItem('adminUser', JSON.stringify(response.admin));
        
        dispatch({
          type: ADMIN_ACTION_TYPES.LOGIN_SUCCESS,
          payload: { admin: response.admin, token: response.token },
        });
        
        addNotification({
          type: 'success',
          message: `Welcome back, ${response.admin.name}!`
        });
        
        return { success: true, admin: response.admin };
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: ADMIN_ACTION_TYPES.SET_LOADING, payload: false });
      
      const errorMessage = error.message || 'Login failed. Please try again.';
      addNotification({
        type: 'error',
        message: errorMessage
      });
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    dispatch({ type: ADMIN_ACTION_TYPES.LOGOUT });
    addNotification({
      type: 'info',
      message: 'Logged out successfully'
    });
  };

  // =============================================
  // PRODUCTS FUNCTIONS
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

  // 🆕 CREATE PRODUCT METHOD - MAIN FIX WITH CORRECT FIELD MAPPING
  const createProduct = async (formData, images) => {
    try {
      console.log('🎯 AdminContext: Creating product...');
      console.log('📝 Original formData:', formData);
      console.log('🖼️ Images received:', images?.length || 0);
      
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
      
      if (!images || images.length === 0) {
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
        secondaryCategories: JSON.stringify(formData.industries || []), // Frontend: industries -> Backend: secondaryCategories
        
        // Pricing & Inventory
        product_price: parseFloat(formData.product_price) || 0,
        stock: parseInt(formData.stock) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 10,
        
        // Sale Configuration
        isOnSale: Boolean(formData.isOnSale),
        salePrice: formData.isOnSale && formData.salePrice ? parseFloat(formData.salePrice) : '',
        saleStartDate: formData.saleStartDate || '',
        saleEndDate: formData.saleEndDate || '',
        
        // Status & Features
        status: formData.status || 'active',
        isFeatured: Boolean(formData.isFeatured),
        isNewArrival: Boolean(formData.isNewArrival),
        
        // SEO Fields
        metaTitle: formData.metaTitle || '',
        metaDescription: formData.metaDescription || '',
        keywords: formData.keywords || '',
        slug: formData.slug || '',
        focusKeyword: formData.focusKeyword || ''
      };
      
      console.log('🔄 Backend field mapping:', backendMapping);
      
      // ✅ APPEND ONLY NON-EMPTY VALUES
      Object.keys(backendMapping).forEach(key => {
        const value = backendMapping[key];
        if (value !== '' && value !== null && value !== undefined) {
          formDataToSend.append(key, value);
          console.log(`✅ Added field: ${key} = ${value}`);
        }
      });
      
      // ✅ APPEND IMAGES - VALIDATE THEY ARE FILE OBJECTS
      console.log('🔍 Processing images...');
      if (images && images.length > 0) {
        images.forEach((image, index) => {
          if (image instanceof File) {
            formDataToSend.append('images', image);
            console.log(`✅ Added image ${index + 1}: ${image.name} (${(image.size / 1024 / 1024).toFixed(2)}MB)`);
          } else {
            console.error(`❌ Image ${index + 1} is not a File object:`, image);
            throw new Error(`Image ${index + 1} is not a valid file object`);
          }
        });
      } else {
        throw new Error('No images provided for upload');
      }
      
      // ✅ MAKE API CALL WITH PROPER AUTH
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      console.log('🚀 Sending product creation request to:', `${API_BASE}/admin/products`);
      
      // Log FormData contents for debugging
      console.log('📦 FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }
      
      const response = await fetch(`${API_BASE}/admin/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // ⚠️ DON'T set Content-Type for FormData - browser sets it automatically with boundary
        },
        body: formDataToSend
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);
      
      const result = await response.json();
      console.log('📡 Response data:', result);
      
      if (!response.ok) {
        // Enhanced error handling
        let errorMessage = result.message || `HTTP ${response.status}: ${response.statusText}`;
        
        // Handle specific validation errors
        if (response.status === 400 && result.message) {
          errorMessage = result.message;
        } else if (response.status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
          // Clear invalid token
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        } else if (response.status === 403) {
          errorMessage = 'You do not have permission to create products.';
        } else if (response.status === 413) {
          errorMessage = 'Files are too large. Please reduce image sizes.';
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        throw new Error(errorMessage);
      }
      
      if (result.success) {
        console.log('✅ Product created successfully:', result.data);
        
        // Add to products list in context
        dispatch({
          type: ADMIN_ACTION_TYPES.ADD_PRODUCT,
          payload: result.data,
        });
        
        // Add success notification
        addNotification({
          type: 'success',
          message: '🎯 Product created successfully with multi-category targeting!'
        });
        
        return { 
          success: true, 
          data: result.data,
          message: result.message
        };
      } else {
        throw new Error(result.message || 'Failed to create product');
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

  const updateProduct = async (id, formData) => {
    try {
      const response = await adminApi.updateAdminProduct(id, formData);
      
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
      
      if (error.message.includes('Invalid or expired token')) {
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
      const response = await adminApi.deleteAdminProduct(id);
      
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
      
      if (error.message.includes('Invalid or expired token')) {
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
  // CATEGORIES FUNCTIONS
  // =============================================
  
  const loadCategories = async () => {
    try {
      const response = await adminApi.getAdminCategories();
      
      if (response.success) {
        dispatch({
          type: ADMIN_ACTION_TYPES.SET_CATEGORIES,
          payload: response.data || [],
        });
      }
    } catch (error) {
      console.error('Load categories error:', error);
      
      if (error.message.includes('Invalid or expired token')) {
        clearAuth();
      }
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
      
      if (error.message.includes('Invalid or expired token')) {
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
      
      if (error.message.includes('Invalid or expired token')) {
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
      
      if (error.message.includes('Invalid or expired token')) {
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
    
    // Products functions
    loadProducts,
    loadProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    
    // Categories functions
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    
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