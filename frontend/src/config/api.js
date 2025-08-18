// File Path: frontend/src/config/api.js

// API Configuration
const getApiUrl = () => {
  // Check if we're in development or production
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname
    
    // Development environment
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000/api'
    }
    
    // Production environment - UPDATE THIS WITH YOUR ACTUAL BACKEND URL
    if (hostname.includes('render.com') || hostname.includes('your-domain.com')) {
      return 'https://your-backend-url.render.com/api'
    }
  }
  
  // Fallback to localhost
  return 'http://localhost:5000/api'
}

// Export the API URL
export const API_URL = getApiUrl()

// Export a fetch wrapper for consistent API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  // Merge options
  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }

  try {
    console.log(`🔄 API Call: ${options.method || 'GET'} ${url}`)
    const response = await fetch(url, finalOptions)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log(`✅ API Success: ${options.method || 'GET'} ${url}`)
    return data
  } catch (error) {
    console.error(`❌ API Error: ${options.method || 'GET'} ${url}`, error)
    throw error
  }
}

// Helper functions for common API calls
export const api = {
  // GET request
  get: (endpoint) => apiCall(endpoint),
  
  // POST request
  post: (endpoint, data) => apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // PUT request
  put: (endpoint, data) => apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // DELETE request
  delete: (endpoint) => apiCall(endpoint, {
    method: 'DELETE',
  }),
}

// Enhanced product API functions for filtering
export const productsAPI = {
  // Get products with advanced filtering
  getProducts: async (filters = {}) => {
    const queryParams = new URLSearchParams()
    
    // Add all filter parameters, handling different data types
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '' && value !== 'all' && value !== false) {
        queryParams.append(key, value.toString())
      }
    })

    const endpoint = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return apiCall(endpoint)
  },

  // Get single product
  getProduct: async (id) => {
    return apiCall(`/products/${id}`)
  },

  // Search products
  searchProducts: async (query, limit = 10) => {
    const queryParams = new URLSearchParams({ q: query, limit: limit.toString() })
    return apiCall(`/products/search?${queryParams}`)
  },

  // Get products by category
  getProductsByCategory: async (categorySlug, options = {}) => {
    const queryParams = new URLSearchParams(options)
    return apiCall(`/products/categories/${categorySlug}?${queryParams}`)
  }
}

// Categories API functions
export const categoriesAPI = {
  // Get all categories
  getCategories: async () => {
    return apiCall('/categories')
  },

  // Get single category
  getCategory: async (id) => {
    return apiCall(`/categories/${id}`)
  }
}

// Utility functions
export const formatPrice = (price) => {
  const numPrice = parseFloat(price) || 0
  return `KES ${numPrice.toLocaleString()}`
}

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Filter utility functions
export const filterUtils = {
  // Build query params from filters object
  buildQueryParams: (filters) => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '' && value !== 'all' && value !== false) {
        params.append(key, value.toString())
      }
    })
    
    return params.toString()
  },

  // Clean filters (remove empty/default values)
  cleanFilters: (filters) => {
    const cleaned = {}
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '' && value !== 'all' && value !== false) {
        cleaned[key] = value
      }
    })
    
    return cleaned
  },

  // Parse URL search params to filters object
  parseSearchParams: (searchParams) => {
    const filters = {}
    
    for (const [key, value] of searchParams.entries()) {
      if (value === 'true') {
        filters[key] = true
      } else if (value === 'false') {
        filters[key] = false
      } else if (!isNaN(value) && value !== '') {
        filters[key] = parseFloat(value)
      } else {
        filters[key] = value
      }
    }
    
    return filters
  }
}

console.log('🔧 API Configuration loaded:', API_URL)