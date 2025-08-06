// frontend/src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid3X3, List, AlertCircle } from 'lucide-react';
import ProductFilters from '../components/ProductFilters';
import ProductCard from '../components/ProductCard';

const Products = ({ onOpenProductModal, onAddToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 12
  });

  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    protectionType: searchParams.get('category') || '',
    industry: searchParams.get('industry') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'product_name',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12
  });

  // API Base URL
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/categories`);
      const data = await response.json();
      
      console.log('Categories response:', data);
      
      if (data.success) {
        setCategories(data.data || []);
      } else {
        console.error('Failed to fetch categories:', data.message);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Build query string
      const queryParams = new URLSearchParams();
      
      // Add filters to query
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.protectionType) queryParams.append('category', filters.protectionType);
      if (filters.industry) queryParams.append('industry', filters.industry);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      queryParams.append('page', filters.page);
      queryParams.append('limit', filters.limit);
      queryParams.append('status', 'active'); // Only active products
      
      console.log('Fetching products with params:', queryParams.toString());
      
      const response = await fetch(`${API_BASE}/products?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Products response:', data);
      
      if (data.success) {
        setProducts(data.data || data.products || []);
        
        // Set pagination if provided
        if (data.pagination) {
          setPagination(data.pagination);
        } else if (data.totalCount) {
          setPagination({
            currentPage: filters.page,
            totalPages: Math.ceil(data.totalCount / filters.limit),
            totalProducts: data.totalCount,
            limit: filters.limit
          });
        }
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
      
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(`Failed to load products: ${error.message}`);
      
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 }; // Reset to page 1 when filtering
    setFilters(newFilters);

    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams);
    if (value && value.toString().trim()) {
      newSearchParams.set(key === 'protectionType' ? 'category' : key, value);
    } else {
      newSearchParams.delete(key === 'protectionType' ? 'category' : key);
    }
    
    // Reset page to 1 when changing filters
    newSearchParams.set('page', '1');
    setSearchParams(newSearchParams);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', newPage.toString());
    setSearchParams(newSearchParams);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      protectionType: '',
      industry: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'product_name',
      page: 1,
      limit: 12
    });
    setSearchParams(new URLSearchParams());
  };

  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex">
          {/* Sidebar Skeleton */}
          <div className="hidden lg:block w-64 mr-8">
            <div className="bg-gray-200 animate-pulse rounded-lg h-96"></div>
          </div>
          {/* Products Skeleton */}
          <div className="flex-1">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Safety Equipment</h1>
        <p className="text-gray-600">Professional protection gear for every workplace</p>
        {error && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800">{error}</span>
          </div>
        )}
      </div>

      <div className="flex gap-8">
        
        {/* Sidebar Filters */}
        <ProductFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          categories={categories}
          showMobile={showMobileFilters}
          onToggleMobile={toggleMobileFilters}
        />

        {/* Main Content Area */}
        <div className="flex-1">
          
          {/* Toolbar */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex items-center justify-between">
              
              {/* Results Count */}
              <div className="text-gray-600">
                <span className="font-medium text-gray-900">{products.length}</span> products
                {pagination.totalProducts && pagination.totalProducts !== products.length && (
                  <span> of {pagination.totalProducts}</span>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">View:</span>
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 border-l transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
              <button
                onClick={clearFilters}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {products.map(product => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    viewMode={viewMode}
                    onAddToCart={onAddToCart}
                    onViewProduct={onOpenProductModal}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                    
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-2 border rounded-lg transition-colors ${
                          pagination.currentPage === i + 1
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;