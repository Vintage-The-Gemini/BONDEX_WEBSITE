// frontend/src/hooks/useCategories.js
import { useState, useEffect } from 'react';

const useCategories = (type = null, options = {}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    autoFetch = true,
    onSuccess,
    onError
  } = options;

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build URL with query parameters
      let url = '/api/categories';
      const params = new URLSearchParams();
      
      if (type) {
        params.append('type', type);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      console.log('🔄 Fetching categories from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response OK:', response.ok);

      // Check if response is HTML (the main problem)
      const contentType = response.headers.get('content-type');
      console.log('📡 Content-Type:', contentType);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('❌ Server returned non-JSON response:', responseText.substring(0, 200));
        
        if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
          throw new Error('Server returned HTML instead of JSON. The API endpoint is not working correctly.');
        }
        
        throw new Error(`Server returned invalid content type: ${contentType}`);
      }

      const data = await response.json();
      console.log('✅ Categories data received:', data);

      if (data.success) {
        setCategories(data.data || []);
        if (onSuccess) onSuccess(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch categories');
      }

    } catch (err) {
      console.error('❌ Error fetching categories:', err);
      
      let errorMessage = err.message;
      
      // Provide user-friendly error messages
      if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      } else if (err.message.includes('HTML instead of JSON')) {
        errorMessage = 'Server configuration error. API endpoint is not set up correctly.';
      } else if (err.message.includes('NetworkError')) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setError(errorMessage);
      if (onError) onError(err);
      
    } finally {
      setLoading(false);
    }
  };

  // Refresh function for manual refetch
  const refresh = () => {
    fetchCategories();
  };

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchCategories();
    }
  }, [type, autoFetch]);

  return {
    categories,
    loading,
    error,
    refresh,
    fetchCategories
  };
};

export default useCategories;