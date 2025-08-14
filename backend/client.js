// File Path: frontend/src/api/client.js

import axios from 'axios'

// API Base URL - Update this to match your backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bondex_admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle auth errors and responses
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('bondex_admin_token')
      localStorage.removeItem('bondex_admin_user')
      window.location.href = '/admin/login'
    }
    
    return Promise.reject(error)
  }
)

// Auth API functions
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/admin/login', credentials)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      }
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/admin/logout')
      return { success: true }
    } catch (error) {
      return { success: false }
    }
  },

  verifyToken: async () => {
    try {
      const response = await apiClient.get('/auth/admin/verify')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Token verification failed'
      }
    }
  }
}

// Products API functions
export const productsAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get('/products', { params })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch products'
      }
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch product'
      }
    }
  },

  create: async (productData) => {
    try {
      const response = await apiClient.post('/products', productData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create product'
      }
    }
  },

  update: async (id, productData) => {
    try {
      const response = await apiClient.put(`/products/${id}`, productData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update product'
      }
    }
  },

  delete: async (id) => {
    try {
      await apiClient.delete(`/products/${id}`)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete product'
      }
    }
  },

  uploadImage: async (file) => {
    try {
      const formData = new FormData()
      formData.append('image', file)
      
      const response = await apiClient.post('/products/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload image'
      }
    }
  }
}

// Categories API functions
export const categoriesAPI = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/categories')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch categories'
      }
    }
  },

  create: async (categoryData) => {
    try {
      const response = await apiClient.post('/categories', categoryData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create category'
      }
    }
  },

  update: async (id, categoryData) => {
    try {
      const response = await apiClient.put(`/categories/${id}`, categoryData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update category'
      }
    }
  },

  delete: async (id) => {
    try {
      await apiClient.delete(`/categories/${id}`)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete category'
      }
    }
  }
}

// Orders API functions (for admin)
export const ordersAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get('/admin/orders', { params })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch orders'
      }
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/admin/orders/${id}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch order'
      }
    }
  },

  updateStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(`/admin/orders/${id}/status`, { status })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update order status'
      }
    }
  }
}

// Analytics API functions
export const analyticsAPI = {
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get('/admin/analytics/dashboard')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch dashboard stats'
      }
    }
  },

  getSalesData: async (period = '30d') => {
    try {
      const response = await apiClient.get(`/admin/analytics/sales?period=${period}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch sales data'
      }
    }
  },

  getProductPerformance: async () => {
    try {
      const response = await apiClient.get('/admin/analytics/products')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch product performance'
      }
    }
  }
}

// Customers API functions
export const customersAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get('/admin/customers', { params })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch customers'
      }
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/admin/customers/${id}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch customer'
      }
    }
  },

  update: async (id, customerData) => {
    try {
      const response = await apiClient.put(`/admin/customers/${id}`, customerData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update customer'
      }
    }
  }
}

// Export the main client for custom requests
export default apiClient

// Utility function to handle API responses consistently
export const handleApiResponse = (response) => {
  if (response.success) {
    return response.data
  } else {
    throw new Error(response.error)
  }
}

// Error handling utility
export const getErrorMessage = (error) => {
  if (error.response) {
    return error.response.data?.message || 'An error occurred'
  } else if (error.request) {
    return 'Network error. Please check your connection.'
  } else {
    return error.message || 'Something went wrong'
  }
}