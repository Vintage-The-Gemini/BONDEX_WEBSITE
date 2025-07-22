// frontend/src/utils/apiClient.js
class ApiClient {
  constructor() {
    // 🔧 FIXED: Ensure correct base URL for development
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    console.log('🔧 ApiClient initialized with baseURL:', this.baseURL);
  }

  // Get authentication token
  getAuthToken() {
    return localStorage.getItem('adminToken');
  }

  // Get request headers with auth
  getHeaders(customHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    
    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      credentials: 'include',
      ...options,
      headers: this.getHeaders(options.headers)
    };

    try {
      console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      
      console.log(`📡 Response Status: ${response.status}`);
      console.log(`📡 Content-Type: ${response.headers.get('content-type')}`);

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('❌ Expected JSON but got:', textResponse.substring(0, 200));
        throw new Error(`Server returned ${contentType || 'unknown'} instead of JSON`);
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          window.location.href = '/admin/login';
          throw new Error('Authentication required');
        }
        
        throw new Error(data.message || `HTTP ${response.status}: Request failed`);
      }

      return data;

    } catch (error) {
      console.error('❌ API Request Error:', error);
      
      // Network or parsing errors
      if (error.name === 'TypeError' || error.name === 'SyntaxError') {
        throw new Error('Network error or server is not responding properly');
      }
      
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET'
    });
  }

  // POST request
  async post(endpoint, data = null) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : null
    });
  }

  // PUT request
  async put(endpoint, data = null) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : null
    });
  }

  // PATCH request
  async patch(endpoint, data = null) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : null
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }

  // File upload (multipart/form-data)
  async uploadFile(endpoint, formData) {
    const headers = {};
    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    // Don't set Content-Type for FormData - browser will set it with boundary

    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: formData
    });
  }

  // Specific API methods for categories
  async getCategories(params = {}) {
    return this.get('/api/categories', params);
  }

  async getCategory(id) {
    return this.get(`/api/categories/${id}`);
  }

  async createCategory(categoryData) {
    return this.post('/api/categories', categoryData);
  }

  async updateCategory(id, categoryData) {
    return this.put(`/api/categories/${id}`, categoryData);
  }

  async deleteCategory(id) {
    return this.delete(`/api/categories/${id}`);
  }

  // Specific API methods for products
  async getProducts(params = {}) {
    return this.get('/api/products', params);
  }

  async getProduct(id) {
    return this.get(`/api/products/${id}`);
  }

  async createProduct(productData) {
    return this.post('/api/admin/products', productData);
  }

  async updateProduct(id, productData) {
    return this.put(`/api/admin/products/${id}`, productData);
  }

  async deleteProduct(id) {
    return this.delete(`/api/admin/products/${id}`);
  }

  // Admin authentication
  async adminLogin(credentials) {
    return this.post('/api/admin/login', credentials);
  }

  async adminLogout() {
    const result = await this.post('/api/admin/logout');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    return result;
  }

  async getAdminProfile() {
    return this.get('/api/admin/profile');
  }

  async getDashboardStats() {
    return this.get('/api/admin/dashboard');
  }

  // Health check
  async healthCheck() {
    return this.get('/api/health');
  }

  // Test endpoint
  async testConnection() {
    return this.get('/api/test');
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;

// Also export the class for testing
export { ApiClient };