// frontend/src/hooks/useCategories.js
import { useState, useEffect } from 'react';

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching categories...');
      
      const response = await fetch('/api/categories', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers.get('content-type'));

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('❌ Expected JSON but got:', textResponse.substring(0, 200));
        throw new Error(`Server returned ${contentType} instead of JSON. Check your API endpoint.`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch categories`);
      }

      const data = await response.json();
      console.log('✅ Categories data received:', data);

      if (data.success && Array.isArray(data.data)) {
        setCategories(data.data);
        console.log(`✅ ${data.data.length} categories loaded`);
      } else {
        console.warn('⚠️ Unexpected data format:', data);
        setCategories([]);
      }

    } catch (err) {
      console.error('❌ Error fetching categories:', err);
      setError(err.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const refetchCategories = () => {
    fetchCategories();
  };

  return {
    categories,
    loading,
    error,
    refetchCategories,
    setCategories
  };
};

export default useCategories;