// frontend/src/services/adminApi.jsx
class AdminApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    this.adminToken = localStorage.getItem('adminToken');
    
    console.log('🔧 AdminAPI initialized with baseURL:', this.baseURL);
  }

  // Get authentication headers
  getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Get multipart headers for file uploads
  getMultipartHeaders() {
    const token = localStorage.getItem('adminToken');
    return {
      ...(token && { Authorization: `Bearer ${token}` }),
      // Don't set Content-Type for FormData - browser will set it with boundary
    };
  }

  // Generic request method with better error handling
  async makeRequest(endpoint, options = {}) {
    try {
      // Ensure endpoint starts with /
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      const url = `${this.baseURL}${cleanEndpoint}`;
      
      console.log('🌐 Making API request:', {
        url,
        method: options.method || 'GET',
        hasBody: !!options.body
      });

      const response = await fetch(url, {
        headers: options.isMultipart ? this.getMultipartHeaders() : this.getAuthHeaders(),
        credentials: 'include',
        ...options,
      });

      console.log('📡 API Response status:', response.status);
      console.log('📡 Content-Type:', response.headers.get('content-type'));

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('❌ Expected JSON but got:', textResponse.substring(0, 200));
        
        // If it's HTML, the server might be down or misconfigured
        if (textResponse.includes('<!DOCTYPE') || textResponse.includes('<html')) {
          throw new Error('Server returned HTML instead of JSON. Backend server may not be running on the correct port.');
        }
        
        throw new Error(`Server returned ${contentType || 'unknown content type'} instead of JSON`);
      }

      const data = await response.json();
      console.log('📦 API Response data:', data);

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          console.log('🔐 Authentication failed, clearing tokens');
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          throw new Error(data.message || 'Authentication required');
        }
        
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
      
    } catch (error) {
      console.error('❌ API Request failed:', {
        endpoint: cleanEndpoint,
        error: error.message,
        options
      });
      
      // Provide user-friendly error messages
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to backend server. Please ensure the backend is running on http://localhost:5000');
      }
      
      throw error;
    }
  }

  // =============================================
  // AUTHENTICATION - FIXED
  // =============================================

  async login(credentials) {
    try {
      const data = await this.makeRequest('/admin/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      console.log('🔑 Full login response:', data);

      if (data.success) {
        // The backend response structure is: { success: true, data: { user: {...}, token: "..." } }
        const token = data.data?.token || data.token; // Try both locations
        const adminData = data.data?.user || data.admin || data.data;

        console.log('🔑 Extracted token:', token);
        console.log('👤 Extracted admin data:', adminData);

        if (token) {
          localStorage.setItem('adminToken', token);
          localStorage.setItem('adminUser', JSON.stringify(adminData));
          this.adminToken = token;
          console.log('✅ Login successful, token stored in localStorage');
          console.log('🔑 Stored token:', localStorage.getItem('adminToken'));
          
          // Verify token was stored
          const storedToken = localStorage.getItem('adminToken');
          if (storedToken !== token) {
            console.error('❌ Token storage failed!');
            throw new Error('Failed to store authentication token');
          }
        } else {
          console.error('❌ No token found in response');
          throw new Error('No authentication token received');
        }
      }

      return data;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  }

  // Alias for adminLogin (for backward compatibility)
  async adminLogin(credentials) {
    return this.login(credentials);
  }

  async logout() {
    try {
      await this.makeRequest('/admin/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with cleanup even if request fails
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      this.adminToken = null;
      console.log('🔐 Logout complete, tokens cleared');
    }
  }

  async getProfile() {
    return this.makeRequest('/admin/profile');
  }

  // Check if user is authenticated
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
  // PRODUCT MANAGEMENT (FIXED ENDPOINTS)
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

  async createCategory(categoryData) {
    try {
      return await this.makeRequest('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData),
      });
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async updateCategory(categoryId, categoryData) {
    try {
      return await this.makeRequest(`/admin/categories/${categoryId}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData),
      });
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async deleteCategory(categoryId) {
    try {
      return await this.makeRequest(`/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // =============================================
  // ORDER MANAGEMENT
  // =============================================

  async getOrders(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/orders${queryString ? `?${queryString}` : ''}`;
      return await this.makeRequest(endpoint);
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async getOrder(orderId) {
    try {
      return await this.makeRequest(`/orders/${orderId}`);
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId, status, note) {
    try {
      return await this.makeRequest(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note }),
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async addTrackingInfo(orderId, trackingNumber, carrier) {
    try {
      return await this.makeRequest(`/orders/${orderId}/tracking`, {
        method: 'PATCH',
        body: JSON.stringify({ trackingNumber, carrier }),
      });
    } catch (error) {
      console.error('Error adding tracking info:', error);
      throw error;
    }
  }

  async processRefund(orderId, amount, reason) {
    try {
      return await this.makeRequest(`/orders/${orderId}/refund`, {
        method: 'POST',
        body: JSON.stringify({ amount, reason }),
      });
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  async getOrderStats(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/orders/stats${queryString ? `?${queryString}` : ''}`;
      return await this.makeRequest(endpoint);
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }

  async exportOrders(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/orders/export${queryString ? `?${queryString}` : ''}`;
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
}

// Create and export a singleton instance
const adminApi = new AdminApiService();
export default adminApi;