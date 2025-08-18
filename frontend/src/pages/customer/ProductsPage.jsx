// File Path: frontend/src/pages/customer/ProductsPage.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { productsAPI, categoriesAPI, formatPrice, debounce, filterUtils } from '../../config/api';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Filter states - separated by Protection Type and Industry
  const [filters, setFilters] = useState({
    protectionType: searchParams.get('protectionType') || 'all',
    industry: searchParams.get('industry') || 'all',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'name',
    inStock: searchParams.get('inStock') === 'true',
    featured: searchParams.get('featured') === 'true',
    onSale: searchParams.get('onSale') === 'true'
  });
  
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [pagination, setPagination] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Format price function (using imported one)
  const formatPriceValue = formatPrice;

  // Separate categories by type
  const protectionTypes = categories.filter(cat => cat.type === 'protection_type');
  const industries = categories.filter(cat => cat.type === 'industry');

  // Fetch categories using your existing API
  const fetchCategories = async () => {
    try {
      const data = await categoriesAPI.getCategories();
      
      if (data.success) {
        console.log('📂 Categories fetched:', data.data?.length);
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Fetch products with filters using your existing API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare filters object for API call - map frontend names to backend parameters
      const apiFilters = {
        page: currentPage,
        limit: 12
      };

      // Map protection type to 'category' parameter for backend
      if (filters.protectionType !== 'all') {
        apiFilters.category = filters.protectionType;
      }
      
      // Map industry to 'industry' parameter for backend  
      if (filters.industry !== 'all') {
        apiFilters.industry = filters.industry;
      }

      // Add other filters
      if (filters.search) apiFilters.search = filters.search;
      if (filters.minPrice) apiFilters.minPrice = filters.minPrice;
      if (filters.maxPrice) apiFilters.maxPrice = filters.maxPrice;
      if (filters.sort) apiFilters.sort = filters.sort;
      if (filters.inStock) apiFilters.inStock = true;
      if (filters.featured) apiFilters.featured = true;
      if (filters.onSale) apiFilters.onSale = true;

      console.log('🔍 Fetching products with filters:', apiFilters);

      // Use your existing productsAPI
      const data = await productsAPI.getProducts(apiFilters);
      
      if (data.success) {
        setProducts(data.data || []);
        setPagination(data.pagination || {});
        console.log('✅ Products fetched successfully:', data.data?.length);
        console.log('📊 First product sample:', data.data?.[0]);
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }

    } catch (err) {
      console.error('❌ Error fetching products:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Update URL with current filters
  const updateURL = () => {
    const newSearchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== false && value !== '') {
        newSearchParams.set(key, value);
      }
    });
    
    if (currentPage > 1) {
      newSearchParams.set('page', currentPage.toString());
    }
    
    setSearchParams(newSearchParams);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      protectionType: 'all',
      industry: 'all',
      search: '',
      minPrice: '',
      maxPrice: '',
      sort: 'name',
      inStock: false,
      featured: false,
      onSale: false
    });
    setCurrentPage(1);
  };

  // Effects
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage]);

  useEffect(() => {
    updateURL();
  }, [filters, currentPage]);

  // Get display name for current filters
  const getDisplayTitle = () => {
    const parts = [];
    
    if (filters.protectionType !== 'all') {
      const cat = protectionTypes.find(cat => cat.slug === filters.protectionType);
      if (cat) parts.push(cat.name);
    }
    
    if (filters.industry !== 'all') {
      const cat = industries.find(cat => cat.slug === filters.industry);
      if (cat) parts.push(`for ${cat.name}`);
    }
    
    if (parts.length === 0) return 'Safety Equipment';
    return parts.join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="py-4 text-sm">
            <ol className="flex items-center space-x-2 text-gray-500">
              <li>
                <button 
                  onClick={() => navigate('/')}
                  className="hover:text-orange-600 transition-colors"
                >
                  Home
                </button>
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 font-medium">Products</span>
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {getDisplayTitle()}
                </h1>
                <p className="mt-2 text-gray-600">
                  Professional safety equipment for workplace protection
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Results count */}
                <span className="text-sm text-gray-500">
                  {loading ? 'Loading...' : `${pagination.totalProducts || 0} products`}
                </span>
                
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                  </svg>
                  Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          
          {/* Filters Sidebar */}
          <div className={`lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
              
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Search Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Search Products
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Search safety equipment..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                  <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Protection Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  🛡️ Protection Type
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="protectionType"
                      value="all"
                      checked={filters.protectionType === 'all'}
                      onChange={(e) => handleFilterChange('protectionType', e.target.value)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700 font-medium">All Protection Types</span>
                  </label>
                  
                  {protectionTypes.map((category) => (
                    <label key={category._id} className="flex items-center">
                      <input
                        type="radio"
                        name="protectionType"
                        value={category.slug}
                        checked={filters.protectionType === category.slug}
                        onChange={(e) => handleFilterChange('protectionType', e.target.value)}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm text-gray-700 flex items-center">
                        {category.icon && <span className="mr-2">{category.icon}</span>}
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Industry Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  🏭 Industry / Sector
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="industry"
                      value="all"
                      checked={filters.industry === 'all'}
                      onChange={(e) => handleFilterChange('industry', e.target.value)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700 font-medium">All Industries</span>
                  </label>
                  
                  {industries.map((category) => (
                    <label key={category._id} className="flex items-center">
                      <input
                        type="radio"
                        name="industry"
                        value={category.slug}
                        checked={filters.industry === category.slug}
                        onChange={(e) => handleFilterChange('industry', e.target.value)}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm text-gray-700 flex items-center">
                        {category.icon && <span className="mr-2">{category.icon}</span>}
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  💰 Price Range (KES)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ⚡ Quick Filters
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">📦 In Stock Only</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.featured}
                      onChange={(e) => handleFilterChange('featured', e.target.checked)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">⭐ Featured Products</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.onSale}
                      onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">🏷️ On Sale</span>
                  </label>
                </div>
              </div>

              {/* Sort Options */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  📊 Sort By
                </label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                
                {/* Results Info */}
                <div className="text-sm text-gray-600">
                  {!loading && pagination.totalProducts !== undefined && (
                    <>Showing {((currentPage - 1) * 12) + 1}-{Math.min(currentPage * 12, pagination.totalProducts)} of {pagination.totalProducts} products</>
                  )}
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">View:</span>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-white shadow-sm text-orange-600' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-white shadow-sm text-orange-600' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-red-800 font-medium">Error loading products</h3>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
                <p className="text-gray-600 text-lg">Loading safety equipment...</p>
              </div>
            )}

            {/* Products Grid/List */}
            {!loading && !error && (
              <ProductsGrid 
                products={products} 
                viewMode={viewMode} 
                formatPrice={formatPriceValue}
                navigate={navigate}
              />
            )}

            {/* Pagination */}
            {!loading && !error && pagination.total > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination 
                  pagination={pagination}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Products Grid Component
const ProductsGrid = ({ products, viewMode, formatPrice: formatPriceFunc, navigate }) => {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
        <p className="text-gray-600 mb-6">
          We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Reset Search
        </button>
      </div>
    );
  }

  return (
    <div className={
      viewMode === 'grid' 
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'space-y-4'
    }>
      {products.map((product) => (
        <ProductCard 
          key={product._id} 
          product={product} 
          viewMode={viewMode}
          formatPrice={formatPriceFunc}
          navigate={navigate}
        />
      ))}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, viewMode, formatPrice: formatPriceFunc, navigate }) => {
  const handleViewDetails = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = () => {
    console.log('Adding to cart:', product._id);
    // TODO: Implement cart functionality
  };

  // Get the product price - handle both direct price and formatted price
  const getProductPrice = () => {
    if (product.formattedPrice) return product.formattedPrice;
    return formatPriceFunc(product.product_price);
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200">
        <div className="p-6">
          <div className="flex items-center gap-6">
            {/* Product Image */}
            <div className="flex-shrink-0">
              <img
                src={product.images?.[0]?.url || product.mainImage || '/api/placeholder/120/120'}
                alt={product.product_name}
                className="w-24 h-24 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/api/placeholder/120/120';
                }}
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate mb-2">
                {product.product_name}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {product.short_description || product.product_description}
              </p>
              
              {/* Category & Stock */}
              <div className="flex items-center gap-4 text-sm">
                {product.primaryCategory && (
                  <span className="text-gray-500">
                    {product.primaryCategory.name}
                  </span>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="text-orange-600 font-medium">
                    Only {product.stock} left
                  </span>
                )}
              </div>
            </div>

            {/* Price and Actions */}
            <div className="text-right">
              <div className="mb-4">
                <span className="text-xl font-bold text-gray-900">
                  {getProductPrice()}
                </span>
                {product.saleFormattedPrice && (
                  <div className="text-gray-500 line-through text-sm">
                    {product.saleFormattedPrice}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleViewDetails}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 group">
      {/* Product Image */}
      <div className="aspect-square relative overflow-hidden rounded-t-xl">
        <img
          src={product.images?.[0]?.url || product.mainImage || '/api/placeholder/300/300'}
          alt={product.product_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/api/placeholder/300/300';
          }}
        />
        
        {/* Sale Badge */}
        {product.isOnSale && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
            SALE
          </div>
        )}

        {/* Stock Badge */}
        {product.stock === 0 && (
          <div className="absolute top-3 right-3 bg-gray-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
            OUT OF STOCK
          </div>
        )}

        {/* Featured Badge */}
        {product.isFeatured && !product.isOnSale && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
            FEATURED
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.product_name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.short_description || product.product_description}
        </p>

        {/* Category */}
        {product.primaryCategory && (
          <div className="mb-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {product.primaryCategory.icon && <span className="mr-1">{product.primaryCategory.icon}</span>}
              {product.primaryCategory.name}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mb-4">
          <span className="text-xl font-bold text-gray-900">
            {getProductPrice()}
          </span>
          {product.saleFormattedPrice && (
            <span className="text-gray-500 line-through text-sm ml-2">
              {product.saleFormattedPrice}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="text-orange-600 text-sm font-medium mb-4">
            Only {product.stock} left in stock
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={handleViewDetails}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
          >
            View Details
          </button>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({ pagination, currentPage, onPageChange }) => {
  const { total, hasNext, hasPrev } = pagination;
  
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(total, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex space-x-1">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              page === currentPage
                ? 'bg-orange-500 text-white border border-orange-500'
                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
};

export default ProductsPage;