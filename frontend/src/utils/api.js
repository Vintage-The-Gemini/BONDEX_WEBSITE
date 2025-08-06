// frontend/src/utils/api.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config = {
      headers: { ...defaultHeaders, ...options.headers },
      ...options,
    };

    try {
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ API Response:`, data);
      
      return data;
    } catch (error) {
      console.error(`❌ API Error: ${error.message}`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Products API
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async getProductById(id) {
    return this.request(`/products/${id}`);
  }

  // Categories API
  async getCategories(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/categories${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async getCategoryById(id) {
    return this.request(`/categories/${id}`);
  }

  // Search API
  async searchProducts(searchTerm, filters = {}) {
    const params = {
      search: searchTerm,
      ...filters
    };
    return this.getProducts(params);
  }

  // Featured products
  async getFeaturedProducts(limit = 8) {
    return this.getProducts({ 
      featured: true, 
      limit,
      status: 'active' 
    });
  }

  // Products by category
  async getProductsByCategory(categoryId, params = {}) {
    return this.getProducts({ 
      category: categoryId, 
      ...params 
    });
  }

  // Products by industry
  async getProductsByIndustry(industryId, params = {}) {
    return this.getProducts({ 
      industry: industryId, 
      ...params 
    });
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Helper functions
export const fetchProducts = async (filters = {}) => {
  try {
    const response = await apiClient.getProducts(filters);
    return {
      success: true,
      products: response.data || response.products || [],
      pagination: response.pagination,
      totalCount: response.totalCount || response.total
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      products: []
    };
  }
};

export const fetchCategories = async () => {
  try {
    const response = await apiClient.getCategories();
    return {
      success: true,
      categories: response.data || response.categories || []
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      categories: []
    };
  }
};

export const searchProducts = async (searchTerm, filters = {}) => {
  try {
    const response = await apiClient.searchProducts(searchTerm, filters);
    return {
      success: true,
      products: response.data || response.products || [],
      pagination: response.pagination
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      products: []
    };
  }
};

export default apiClient;