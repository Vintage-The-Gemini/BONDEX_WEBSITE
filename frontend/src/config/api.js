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
      throw new Error(`HTTP error! status: ${response.status}`)
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

console.log('🔧 API Configuration loaded:', API_URL)