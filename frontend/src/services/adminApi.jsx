// frontend/src/services/adminApi.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class AdminApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('adminToken');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('adminToken', token);
  }

  // Remove authentication token
  removeToken() {
    this.token = null;
    localStorage.removeItem('adminToken');
  }

  // Get auth headers
  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Generic request handler
  async makeRequest(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        credentials: 'include', // Include cookies
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          this.removeToken();
          window.location.href = '/admin/login';
          throw new Error('Authentication required');
        }
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // =============================================
  // ADMIN AUTHENTICATION
  // =============================================

  async adminLogin(credentials) {
    const data = await this.makeRequest('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (data.success && data.data.token) {
      this.setToken(data.data.token);
    }
    
    return data;
  }

  async adminLogout() {
    const data = await this.makeRequest('/admin/logout', {
      method: 'POST',
    });
    
    this.removeToken();
    return data;
  }

  async getAdminProfile() {
    return this.makeRequest('/admin/profile');
  }

  async getDashboardStats() {
    return this.makeRequest('/admin/dashboard');
  }

  // =============================================
  // PRODUCT MANAGEMENT
  // =============================================

  async getAdminProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/admin/products${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest(endpoint);
  }

  async getAdminProduct(id) {
    return this.makeRequest(`/admin/products/${id}`);
  }

  async createProduct(productData) {
    return this.makeRequest('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.makeRequest(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.makeRequest(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  }

  async updateProductStatus(id, status) {
    return this.makeRequest(`/admin/products/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async bulkUpdateProducts(productIds, updateData) {
    return this.makeRequest('/admin/products/bulk-update', {
      method: 'PATCH',
      body: JSON.stringify({ productIds, updateData }),
    });
  }

  // =============================================
  // CATEGORY MANAGEMENT
  // =============================================

  async getAdminCategories(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/admin/categories${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest(endpoint);
  }

  async getAdminCategory(id) {
    return this.makeRequest(`/admin/categories/${id}`);
  }

  async createCategory(categoryData) {
    return this.makeRequest('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id, categoryData) {
    return this.makeRequest(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id) {
    return this.makeRequest(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
  }

  async seedCategories() {
    return this.makeRequest('/categories/seed', {
      method: 'POST',
    });
  }

  // =============================================
  // IMAGE UPLOAD
  // =============================================

  async uploadImage(file, folder = 'products') {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    return this.makeRequest('/upload/image', {
      method: 'POST',
      headers: {
        // Don't set Content-Type, let browser set it for FormData
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });
  }

  async uploadMultipleImages(files, folder = 'products') {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    formData.append('folder', folder);

    return this.makeRequest('/upload/multiple', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });
  }

  async deleteImage(publicId) {
    return this.makeRequest('/upload/delete', {
      method: 'DELETE',
      body: JSON.stringify({ publicId }),
    });
  }

  // =============================================
  // ANALYTICS & REPORTS
  // =============================================

  async getProductAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/admin/analytics/products${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest(endpoint);
  }

  async getCategoryAnalytics() {
    return this.makeRequest('/admin/analytics/categories');
  }

  async getSalesReport(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/admin/reports/sales${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest(endpoint);
  }

  async getInventoryReport() {
    return this.makeRequest('/admin/reports/inventory');
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  async healthCheck() {
    return this.makeRequest('/health');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }

  // Format currency for Kenya (KES)
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  // Format date for Kenya timezone
  formatDate(date) {
    return new Intl.DateTimeFormat('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }
}

// Create and export a singleton instance
const adminApi = new AdminApiService();
export default adminApi;