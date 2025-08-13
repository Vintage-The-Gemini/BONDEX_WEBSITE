// frontend/src/services/adminApi.jsx
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔧 AdminAPI initialized with baseURL:', API_BASE_URL);

class AdminApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // =============================================
  // CORE API METHODS
  // =============================================

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('adminToken');

    console.log('🌐 Making API request:', {
      method: options.method || 'GET',
      url,
      hasAuth: !!token,
      isMultipart: options.isMultipart || false
    });

    const config = {
      method: options.method || 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...(options.isMultipart ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
      ...options,
    };

    // Don't set Content-Type for FormData (multipart)
    if (options.isMultipart) {
      delete config.headers['Content-Type'];
    }

    try {
      const response = await fetch(url, config);

      console.log('📡 API Response status:', response.status);
      console.log('📡 Content-Type:', response.headers.get('content-type'));

      const data = await response.json();
      console.log('📦 API Response data:', data);

      if (!response.ok) {
        // ✅ ENHANCED ERROR LOGGING FOR DEBUGGING
        console.error('🚨 API ERROR DETAILS:');
        console.error('Status:', response.status);
        console.error('Status Text:', response.statusText);
        console.error('Response Data:', data);
        console.error('Error Message:', data.message);
        console.error('Error Details:', data.errors);
        console.error('Validation Details:', data.details);
        
        // Handle auth errors
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          throw new Error('Authentication failed. Please login again.');
        }
        
        // Create detailed error message
        let errorMessage = data.message || `HTTP ${response.status}: ${response.statusText}`;
        
        // Add validation details if available
        if (data.errors && Array.isArray(data.errors)) {
          errorMessage += '\nValidation Errors:\n' + data.errors.join('\n');
        }
        
        if (data.details) {
          errorMessage += '\nDetails: ' + JSON.stringify(data.details, null, 2);
        }
        
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('❌ API Request failed:', error);
      throw error;
    }
  }

  // =============================================
  // AUTHENTICATION
  // =============================================

  async loginAdmin(credentials) {
    try {
      return await this.makeRequest('/admin/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  }

  async verifyAdminAuth() {
    try {
      return await this.makeRequest('/admin/verify');
    } catch (error) {
      console.error('Admin auth verification error:', error);
      throw error;
    }
  }

  // Check if admin is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    return !!(token && user);
  }

  // Get stored admin data
  getStoredAdmin() {
    try {
      const adminData = localStorage.getItem('adminUser');
      return adminData ? JSON.parse(adminData) : null;
    } catch (error) {
      console.error('Error parsing stored admin data:', error);
      return null;
    }
  }

  // =============================================
  // DASHBOARD
  // =============================================

  async getDashboardStats() {
    try {
      return await this.makeRequest('/admin/dashboard');
    } catch (error) {
      console.warn('Dashboard stats failed, returning mock data:', error.message);
      // Return mock data to prevent loading state issues
      return {
        success: true,
        data: {
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
          lowStockProducts: 0,
          recentOrders: [],
          topProducts: []
        }
      };
    }
  }

  // =============================================
  // PRODUCT MANAGEMENT
  // =============================================

  async getAdminProducts(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/admin/products${queryString ? `?${queryString}` : ''}`;
      return await this.makeRequest(endpoint);
    } catch (error) {
      console.error('Error fetching admin products:', error);
      throw error;
    }
  }

  async getAdminProduct(productId) {
    try {
      return await this.makeRequest(`/admin/products/${productId}`);
    } catch (error) {
      console.error('Error fetching admin product:', error);
      throw error;
    }
  }

  // 🆕 CREATE PRODUCT WITH JSON DATA (No images)
  async createProduct(productData) {
    try {
      return await this.makeRequest('/admin/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // 🆕 CREATE PRODUCT WITH IMAGES (FormData) - THE MISSING FUNCTION!
  async createProductWithImages(formData) {
    try {
      console.log('🎯 AdminAPI: Creating product with images...');
      
      // Validate FormData
      if (!(formData instanceof FormData)) {
        throw new Error('Invalid data format. Expected FormData for image upload.');
      }

      // Log FormData contents for debugging
      console.log('📝 FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      return await this.makeRequest('/admin/products', {
        method: 'POST',
        body: formData,
        isMultipart: true, // This prevents Content-Type header from being set
      });
    } catch (error) {
      console.error('Error creating product with images:', error);
      throw error;
    }
  }

  // 🆕 UPDATE PRODUCT
  async updateProduct(productId, productData) {
    try {
      return await this.makeRequest(`/admin/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // 🆕 UPDATE PRODUCT WITH IMAGES
  async updateProductWithImages(productId, formData) {
    try {
      console.log('🎯 AdminAPI: Updating product with images...');
      
      if (!(formData instanceof FormData)) {
        throw new Error('Invalid data format. Expected FormData for image upload.');
      }

      return await this.makeRequest(`/admin/products/${productId}`, {
        method: 'PUT',
        body: formData,
        isMultipart: true,
      });
    } catch (error) {
      console.error('Error updating product with images:', error);
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      return await this.makeRequest(`/admin/products/${productId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // =============================================
  // CATEGORY MANAGEMENT
  // =============================================

  async getAdminCategories(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/admin/categories${queryString ? `?${queryString}` : ''}`;
      return await this.makeRequest(endpoint);
    } catch (error) {
      console.error('Error fetching admin categories:', error);
      throw error;
    }
  }

  async getAdminCategory(categoryId) {
    try {
      return await this.makeRequest(`/admin/categories/${categoryId}`);
    } catch (error) {
      console.error('Error fetching admin category:', error);
      throw error;
    }
  }

  async createAdminCategory(categoryData) {
    try {
      return await this.makeRequest('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData),
      });
    } catch (error) {
      console.error('Error creating admin category:', error);
      throw error;
    }
  }

  async updateAdminCategory(categoryId, categoryData) {
    try {
      return await this.makeRequest(`/admin/categories/${categoryId}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData),
      });
    } catch (error) {
      console.error('Error updating admin category:', error);
      throw error;
    }
  }

  async deleteAdminCategory(categoryId) {
    try {
      return await this.makeRequest(`/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting admin category:', error);
      throw error;
    }
  }

  // =============================================
  // ORDER MANAGEMENT
  // =============================================

  async getAdminOrders(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/admin/orders${queryString ? `?${queryString}` : ''}`;
      return await this.makeRequest(endpoint);
    } catch (error) {
      console.error('Error fetching admin orders:', error);
      throw error;
    }
  }

  async getAdminOrder(orderId) {
    try {
      return await this.makeRequest(`/admin/orders/${orderId}`);
    } catch (error) {
      console.error('Error fetching admin order:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      return await this.makeRequest(`/admin/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async processRefund(orderId, refundData) {
    try {
      return await this.makeRequest(`/admin/orders/${orderId}/refund`, {
        method: 'POST',
        body: JSON.stringify(refundData),
      });
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  async getOrderStats(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/admin/orders/stats${queryString ? `?${queryString}` : ''}`;
      return await this.makeRequest(endpoint);
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }

  async exportOrders(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/admin/orders/export${queryString ? `?${queryString}` : ''}`;
      return await this.makeRequest(endpoint);
    } catch (error) {
      console.error('Error exporting orders:', error);
      throw error;
    }
  }

  // =============================================
  // FILE UPLOAD
  // =============================================

  async uploadFile(file, type = 'product') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      return await this.makeRequest('/upload', {
        method: 'POST',
        body: formData,
        isMultipart: true,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async uploadMultipleFiles(files, type = 'product') {
    try {
      const formData = new FormData();
      
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      formData.append('type', type);

      return await this.makeRequest('/upload/multiple', {
        method: 'POST',
        body: formData,
        isMultipart: true,
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  formatCurrency(amount, currency = 'KES') {
    if (!amount && amount !== 0) return 'KES 0';
    
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return 'KES 0';

    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  }

  formatDate(date, options = {}) {
    if (!date) return '';
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Nairobi',
      ...options
    };

    try {
      return new Date(date).toLocaleDateString('en-KE', defaultOptions);
    } catch (error) {
      console.error('Error formatting date:', error);
      return date;
    }
  }
}

// Create and export a singleton instance
const adminApi = new AdminApiService();
export default adminApi;