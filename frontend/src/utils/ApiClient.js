// frontend/src/utils/ApiClient.js
class ApiClient {
  constructor() {
    // Fix: Use import.meta.env instead of process.env in Vite
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    console.log('🔧 ApiClient initialized with baseURL:', this.baseURL);
  }

  // Helper method for API requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include', // Include cookies for session management
      ...options,
    };

    // Add auth token if available (for logged-in customers)
    const token = localStorage.getItem('token');
    if (token) {
      defaultOptions.headers.Authorization = `Bearer ${token}`;
    }

    console.log('📡 Making API request:', {
      method: defaultOptions.method || 'GET',
      url,
      headers: defaultOptions.headers
    });

    try {
      const response = await fetch(url, defaultOptions);
      
      console.log('📡 API Response status:', response.status);
      console.log('📡 Content-Type:', response.headers.get('content-type'));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('📦 API Response data:', data);
      
      return data;
      
    } catch (error) {
      console.error('❌ API Request failed:', {
        endpoint,
        error: error.message,
        options: defaultOptions
      });
      
      // Provide user-friendly error messages
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to backend server. Please ensure the backend is running on http://localhost:5000');
      }
      
      throw error;
    }
  }

  // ===============================================
  // HEALTH CHECK & TESTING
  // ===============================================
  
  async healthCheck() {
    try {
      return await this.makeRequest('/health');
    } catch (error) {
      console.warn('Health check failed:', error.message);
      throw error;
    }
  }

  async testConnection() {
    try {
      return await this.makeRequest('/test');
    } catch (error) {
      console.warn('Test connection failed:', error.message);
      throw error;
    }
  }

  // ===============================================
  // CUSTOMER PRODUCT ENDPOINTS
  // ===============================================

  // Get all products (public - no auth required)
  async getProducts(params = {}) {
    try {
      console.log('🔍 Fetching products with params:', params);
      
      // Clean up empty parameters
      const cleanParams = {};
      Object.entries(params).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          cleanParams[key] = value;
        }
      });
      
      const queryString = new URLSearchParams(cleanParams).toString();
      const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
      
      return await this.makeRequest(endpoint);
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      throw error;
    }
  }

  // Get single product by ID (public)
  async getProduct(productId) {
    try {
      console.log('🔍 Fetching product:', productId);
      return await this.makeRequest(`/products/${productId}`);
    } catch (error) {
      console.error('❌ Error fetching product:', error);
      throw error;
    }
  }

  // Get featured products (public)
  async getFeaturedProducts(limit = 8) {
    try {
      console.log('⭐ Fetching featured products, limit:', limit);
      return await this.makeRequest(`/products?featured=true&limit=${limit}&status=active`);
    } catch (error) {
      console.error('❌ Error fetching featured products:', error);
      throw error;
    }
  }

  // Search products (public)
  async searchProducts(searchQuery, filters = {}) {
    try {
      console.log('🔍 Searching products:', searchQuery, filters);
      const params = {
        search: searchQuery,
        ...filters,
        status: 'active'
      };
      return await this.getProducts(params);
    } catch (error) {
      console.error('❌ Error searching products:', error);
      throw error;
    }
  }

  // ===============================================
  // CUSTOMER CATEGORY ENDPOINTS
  // ===============================================

  // Get all categories (public)
  async getCategories(params = {}) {
    try {
      console.log('📂 Fetching categories with params:', params);
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/categories${queryString ? `?${queryString}` : ''}`;
      
      return await this.makeRequest(endpoint);
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      throw error;
    }
  }

  // Get single category (public)
  async getCategory(categoryId) {
    try {
      console.log('📂 Fetching category:', categoryId);
      return await this.makeRequest(`/categories/${categoryId}`);
    } catch (error) {
      console.error('❌ Error fetching category:', error);
      throw error;
    }
  }

  // Get products by category (public)
  async getProductsByCategory(categoryId, params = {}) {
    try {
      console.log('📂 Fetching products by category:', categoryId, params);
      const allParams = {
        category: categoryId,
        status: 'active',
        ...params
      };
      return await this.getProducts(allParams);
    } catch (error) {
      console.error('❌ Error fetching products by category:', error);
      throw error;
    }
  }

  // ===============================================
  // CUSTOMER ORDER ENDPOINTS
  // ===============================================

  // Create order (public - guest checkout allowed)
  async createOrder(orderData) {
    try {
      console.log('🛒 Creating order:', orderData);
      return await this.makeRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
    } catch (error) {
      console.error('❌ Error creating order:', error);
      throw error;
    }
  }

  // Get customer's orders (requires auth)
  async getMyOrders() {
    try {
      console.log('📋 Fetching customer orders');
      return await this.makeRequest('/orders/my-orders');
    } catch (error) {
      console.error('❌ Error fetching customer orders:', error);
      throw error;
    }
  }

  // Track order by order number (public)
  async trackOrder(orderNumber) {
    try {
      console.log('🔍 Tracking order:', orderNumber);
      return await this.makeRequest(`/orders/tracking/${orderNumber}`);
    } catch (error) {
      console.error('❌ Error tracking order:', error);
      throw error;
    }
  }

  // ===============================================
  // CUSTOMER AUTHENTICATION (Future)
  // ===============================================

  // Customer registration
  async register(userData) {
    try {
      console.log('👤 Registering user');
      return await this.makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error('❌ Error registering user:', error);
      throw error;
    }
  }

  // Customer login
  async login(credentials) {
    try {
      console.log('🔐 Logging in user');
      const response = await this.makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      // Store token if login successful
      if (response.success && response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      console.error('❌ Error logging in:', error);
      throw error;
    }
  }

  // Customer logout
  async logout() {
    try {
      console.log('🔐 Logging out user');
      await this.makeRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Continue with cleanup even if request fails
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  // Check if customer is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  // Get stored customer data
  getStoredUser() {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }

  // ===============================================
  // UTILITY METHODS
  // ===============================================

  // Format price in KES
  formatPrice(price) {
    if (!price) return 'KES 0';
    return `KES ${Number(price).toLocaleString('en-KE')}`;
  }

  // Get fallback image for products
  getFallbackImage() {
    return '/images/placeholder-product.jpg';
  }

  // Get category icon fallback
  getCategoryIcon(category) {
    const icons = {
      'head protection': '⛑️',
      'eye protection': '👁️',
      'hand protection': '🧤',
      'foot protection': '👢',
      'breathing protection': '😷',
      'default': '🛡️'
    };
    
    const categoryName = category?.name?.toLowerCase() || '';
    return icons[categoryName] || icons.default;
  }
}

// Create and export singleton instance
const apiClient = new ApiClient();
export default apiClient;