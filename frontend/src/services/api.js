// File Path: frontend/src/services/api.js
import axios from 'axios'

// API Base URL
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

// Response interceptor - Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bondex_admin_token')
      localStorage.removeItem('bondex_admin_user')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    try {
      const response = await apiClient.get('/admin/dashboard')
      return {
        success: true,
        data: response.data.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch dashboard stats'
      }
    }
  }
}

// Products API
export const productsAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get('/admin/products', { params })
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination
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
      const response = await apiClient.get(`/admin/products/${id}`)
      return {
        success: true,
        data: response.data.data
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
      const response = await apiClient.post('/admin/products', productData)
      return {
        success: true,
        data: response.data.data
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
      const response = await apiClient.put(`/admin/products/${id}`, productData)
      return {
        success: true,
        data: response.data.data
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
      const response = await apiClient.delete(`/admin/products/${id}`)
      return {
        success: true,
        data: response.data.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete product'
      }
    }
  }
}

// Orders API
export const ordersAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get('/admin/orders', { params })
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch orders'
      }
    }
  },

  getStats: async () => {
    try {
      const response = await apiClient.get('/orders/stats')
      return {
        success: true,
        data: response.data.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch order stats'
      }
    }
  },

  getRecent: async () => {
    try {
      const response = await apiClient.get('/orders/recent')
      return {
        success: true,
        data: response.data.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch recent orders'
      }
    }
  },

  updateStatus: async (id, status) => {
    try {
      const response = await apiClient.put(`/admin/orders/${id}/status`, { status })
      return {
        success: true,
        data: response.data.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update order status'
      }
    }
  }
}

// Categories API
export const categoriesAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get('/admin/categories', { params })
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination
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
      const response = await apiClient.post('/admin/categories', categoryData)
      return {
        success: true,
        data: response.data.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create category'
      }
    }
  }
}

export default apiClient