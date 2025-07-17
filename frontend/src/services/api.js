// frontend/src/services/api.js
import { API_BASE_URL } from '../utils/constants';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = {$this.baseURL}{ndpoint};
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = Bearer {$token};
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Product endpoints
  getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(/products?{$queryString});
  }

  getProduct(id) {
    return this.request(/products/{$id});
  }

  // Auth endpoints
  login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  register(userData) {
    return this.request('/auth/register', {
      method: 'POST', 
      body: JSON.stringify(userData),
    });
  }

  // Cart endpoints
  getCart() {
    return this.request('/cart');
  }

  addToCart(productId, quantity) {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  updateCartItem(itemId, quantity) {
    return this.request(/cart/{$itemId}, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  removeFromCart(itemId) {
    return this.request(/cart/{$itemId}, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();
