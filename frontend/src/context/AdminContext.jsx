// frontend/src/context/AdminContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import adminApi from '../services/adminApi';

// Initial state
const initialState = {
  // Auth state
  isAuthenticated: false,
  admin: null,
  token: null,
  loading: true,
  
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
        error: null,
      };
      
    case ADMIN_ACTION_TYPES.LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        admin: null,
        token: null,
        loading: false,
        error: action.payload,
      };
      
    case ADMIN_ACTION_TYPES.LOGOUT:
      return {
        ...initialState,
        loading: false,
      };
      
    case ADMIN_ACTION_TYPES.LOAD_ADMIN:
      return {
        ...state,
        isAuthenticated: true,
        admin: action.payload,
        loading: false,
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
        productsTotalCount: state.productsTotalCount - 1,
        currentProduct: state.currentProduct?._id === action.payload 
          ? null 
          : state.currentProduct,
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
        notifications: [...state.notifications, action.payload],
      };
      
    case ADMIN_ACTION_TYPES.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(notification => 
          notification.id !== action.payload
        ),
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

// Context provider component
export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Initialize admin on app load
  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        if (adminApi.isAuthenticated()) {
          const response = await adminApi.getAdminProfile();
          if (response.success) {
            dispatch({
              type: ADMIN_ACTION_TYPES.LOAD_ADMIN,
              payload: response.data,
            });
          } else {
            adminApi.removeToken();
            dispatch({ type: ADMIN_ACTION_TYPES.LOGOUT });
          }
        } else {
          dispatch({ type: ADMIN_ACTION_TYPES.LOGOUT });
        }
      } catch (error) {
        console.error('Admin initialization error:', error);
        adminApi.removeToken();
        dispatch({ type: ADMIN_ACTION_TYPES.LOGOUT });
      }
    };

    initializeAdmin();
  }, []);

  // =============================================
  // AUTH ACTIONS
  // =============================================

  const login = async (credentials) => {
    try {
      dispatch({ type: ADMIN_ACTION_TYPES.LOGIN_START });
      
      const response = await adminApi.adminLogin(credentials);
      
      if (response.success) {
        dispatch({
          type: ADMIN_ACTION_TYPES.LOGIN_SUCCESS,
          payload: {
            admin: response.data.user,
            token: response.data.token,
          },
        });
        
        addNotification({
          type: 'success',
          message: 'Login successful! Welcome back.',
        });
        
        return { success: true };
      } else {
        throw new Error(response.message);
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
      await adminApi.adminLogout();
      dispatch({ type: ADMIN_ACTION_TYPES.LOGOUT });
      
      addNotification({
        type: 'success',
        message: 'Logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({ type: ADMIN_ACTION_TYPES.LOGOUT });
    }
  };

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
      addNotification({
        type: 'error',
        message: 'Failed to load dashboard statistics',
      });
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
            products: response.data,
            totalCount: response.totalCount || response.data.length,
          },
        });
      }
    } catch (error) {
      console.error('Load products error:', error);
      addNotification({
        type: 'error',
        message: 'Failed to load products',
      });
    }
  };

  const createProduct = async (productData) => {
    try {
      const response = await adminApi.createProduct(productData);
      
      if (response.success) {
        dispatch({
          type: ADMIN_ACTION_TYPES.ADD_PRODUCT,
          payload: response.data,
        });
        
        addNotification({
          type: 'success',
          message: 'Product created successfully!',
        });
        
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Create product error:', error);
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
      addNotification({
        type: 'error',
        message: error.message || 'Failed to update product',
      });
      
      return { success: false, error: error.message };
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
          message: 'Product deleted successfully!',
        });
        
        return { success: true };
      }
    } catch (error) {
      console.error('Delete product error:', error);
      addNotification({
        type: 'error',
        message: error.message || 'Failed to delete product',
      });
      
      return { success: false, error: error.message };
    }
  };

  // =============================================
  // CATEGORY ACTIONS
  // =============================================

  const loadCategories = async (params = {}) => {
    try {
      dispatch({ type: ADMIN_ACTION_TYPES.SET_CATEGORIES_LOADING, payload: true });
      
      const response = await adminApi.getAdminCategories(params);
      
      if (response.success) {
        dispatch({
          type: ADMIN_ACTION_TYPES.SET_CATEGORIES,
          payload: response.data,
        });
      }
    } catch (error) {
      console.error('Load categories error:', error);
      addNotification({
        type: 'error',
        message: 'Failed to load categories',
      });
    }
  };

  // =============================================
  // UI ACTIONS
  // =============================================

  const toggleSidebar = () => {
    dispatch({ type: ADMIN_ACTION_TYPES.TOGGLE_SIDEBAR });
  };

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    dispatch({
      type: ADMIN_ACTION_TYPES.ADD_NOTIFICATION,
      payload: {
        id,
        ...notification,
        timestamp: new Date(),
      },
    });

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    dispatch({
      type: ADMIN_ACTION_TYPES.REMOVE_NOTIFICATION,
      payload: id,
    });
  };

  const clearError = () => {
    dispatch({ type: ADMIN_ACTION_TYPES.CLEAR_ERROR });
  };

  // Context value
  const value = {
    // State
    ...state,
    
    // Auth actions
    login,
    logout,
    
    // Dashboard actions
    loadDashboardStats,
    
    // Product actions
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    
    // Category actions
    loadCategories,
    
    // UI actions
    toggleSidebar,
    addNotification,
    removeNotification,
    clearError,
    
    // Utility
    formatCurrency: adminApi.formatCurrency,
    formatDate: adminApi.formatDate,
  };

  return (
    <AdminContext.Provider value={value}>
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