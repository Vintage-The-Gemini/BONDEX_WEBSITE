// frontend/src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Heart,
  Eye,
  ShoppingCart,
  X,
  ChevronDown,
  SlidersHorizontal,
  Package,
  TrendingUp,
  Award,
  Shield,
  RefreshCw,
  Plus,
  Minus
} from 'lucide-react';
import apiClient from '../utils/ApiClient'; // Use your existing API client

const Products = () => {
  // State Management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // Default to grid view as requested
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  
  // Filter and Search States
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    brand: searchParams.get('brand') || '',
    rating: searchParams.get('rating') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12,
    status: 'active'
  });

  // Pagination State
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNext: false,
    hasPrev: false
  });

  const navigate = useNavigate();

  // Test API connection on component mount
  useEffect(() => {
    testApiConnection();
  }, []);

  // Test API connectivity
  const testApiConnection = async () => {
    try {
      console.log('🧪 Testing API connection...');
      await apiClient.healthCheck();
      console.log('✅ API connection successful');
    } catch (error) {
      console.warn('⚠️ API health check failed, but continuing with fallback data:', error.message);
    }
  };

  // Fetch products using existing API client
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔍 Fetching products with filters:', filters);
      
      // Clean filters - remove empty values
      const cleanFilters = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          cleanFilters[key] = value;
        }
      });

      // Use existing API client method
      const data = await apiClient.getProducts(cleanFilters);
      
      if (data.success) {
        setProducts(data.data || data.products || []);
        setPagination({
          currentPage: data.pagination?.currentPage || data.currentPage || 1,
          totalPages: data.pagination?.totalPages || data.totalPages || 1,
          totalProducts: data.pagination?.totalProducts || data.totalProducts || 0,
          hasNext: data.pagination?.hasNextPage || data.hasNext || false,
          hasPrev: data.pagination?.hasPrevPage || data.hasPrev || false
        });
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      setError(err.message || 'Failed to load products');
      
      // Fallback mock data for development
      console.log('🔄 Using fallback mock data');
      setProducts([
        {
          _id: '1',
          product_name: 'Safety Helmet Premium',
          product_brand: 'SafetyFirst',
          product_price: 2500,
          product_description: 'High-quality safety helmet with adjustable straps and ventilation system.',
          product_image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=300&h=300&fit=crop&auto=format',
          category: { name: 'Head Protection', _id: 'cat1' },
          stock: 15,
          averageRating: 4.5,
          reviewCount: 23
        },
        {
          _id: '2',
          product_name: 'Safety Goggles Clear',
          product_brand: 'VisionPro',
          product_price: 800,
          product_description: 'Clear safety goggles with anti-fog coating and comfortable fit.',
          product_image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop&auto=format',
          category: { name: 'Eye Protection', _id: 'cat2' },
          stock: 32,
          averageRating: 4.2,
          reviewCount: 15
        },
        {
          _id: '3',
          product_name: 'Work Gloves Heavy Duty',
          product_brand: 'GripPro',
          product_price: 1200,
          product_description: 'Heavy-duty work gloves with enhanced grip and protection.',
          product_image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop&auto=format',
          category: { name: 'Hand Protection', _id: 'cat3' },
          stock: 8,
          averageRating: 4.7,
          reviewCount: 31
        }
      ]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalProducts: 3,
        hasNext: false,
        hasPrev: false
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch Categories using existing API client
  const fetchCategories = async () => {
    try {
      console.log('🔍 Fetching categories...');
      
      // Use existing API client method
      const data = await apiClient.getCategories({ status: 'active' });
      
      if (data.success) {
        setCategories(data.data || data.categories || []);
      }
    } catch (err) {
      console.error('❌ Error fetching categories:', err);
      // Fallback mock categories
      console.log('🔄 Using fallback mock categories');
      setCategories([
        { _id: 'cat1', name: 'Head Protection' },
        { _id: 'cat2', name: 'Eye Protection' },
        { _id: 'cat3', name: 'Hand Protection' },
        { _id: 'cat4', name: 'Foot Protection' },
        { _id: 'cat5', name: 'Breathing Protection' }
      ]);
    }
  };

  // Helper function to get fallback image
  const getFallbackImage = (product) => {
    if (product?.product_images?.length > 0) {
      return typeof product.product_images[0] === 'string' 
        ? product.product_images[0] 
        : product.product_images[0].url;
    }
    if (product?.product_image) {
      return product.product_image;
    }
    // Fallback to a safety equipment placeholder
    return 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=300&h=300&fit=crop&auto=format';
  };

  // Load data on component mount and filter changes
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined && key !== 'limit' && key !== 'status') {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    console.log(`🔧 Filter changed: ${key} = ${value}`);
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    console.log('🧹 Clearing all filters');
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      brand: '',
      rating: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 12,
      status: 'active'
    });
  };

  // Format price in KES
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Render star rating
  const renderStars = (rating, reviewCount) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return (
      <div className="flex items-center space-x-1">
        <div className="flex">{stars}</div>
        {reviewCount && <span className="text-sm text-gray-500">({reviewCount})</span>}
      </div>
    );
  };

  // Handle product click to view details
  const handleProductClick = (product) => {
    console.log('👆 Product clicked:', product.product_name);
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  // Handle add to cart
  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    console.log('🛒 Adding to cart:', product.product_name);
    // Add to cart logic here
    alert(`Added ${product.product_name} to cart!`);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    console.log('📄 Page changed to:', page);
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Safety Equipment</h1>
              <p className="text-gray-600 mt-2">
                Discover our comprehensive range of safety equipment for every industry
              </p>
            </div>
            
            {/* Total Products Count */}
            <div className="text-sm text-gray-500">
              {pagination.totalProducts} products found
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Products
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Search safety equipment..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (KES)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="Min"
                    className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="Max"
                    className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="product_price-asc">Price: Low to High</option>
                  <option value="product_price-desc">Price: High to Low</option>
                  <option value="product_name-asc">Name: A to Z</option>
                  <option value="product_name-desc">Name: Z to A</option>
                  <option value="averageRating-desc">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Top Controls */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </button>

                  {/* View Mode Toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                        viewMode === 'list'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <List className="h-4 w-4" />
                      List
                    </button>
                  </div>
                </div>

                {/* Results Info */}
                <div className="text-sm text-gray-600">
                  Showing {((pagination.currentPage - 1) * filters.limit) + 1} - {Math.min(pagination.currentPage * filters.limit, pagination.totalProducts)} of {pagination.totalProducts} products
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading products...</span>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Package className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      API Connection Issue
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Unable to connect to the backend API. Showing sample data instead.</p>
                      <p className="mt-1">Error: {error}</p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={fetchProducts}
                        className="text-yellow-800 hover:text-yellow-900 underline font-medium"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid/List */}
            {!loading && (
              <>
                {products.length === 0 ? (
                  <div className="text-center py-20">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className={viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                  }>
                    {products.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        viewMode={viewMode}
                        onProductClick={handleProductClick}
                        onAddToCart={handleAddToCart}
                        formatPrice={formatPrice}
                        renderStars={renderStars}
                        getFallbackImage={getFallbackImage}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrev}
                        className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm border rounded-md ${
                            page === pagination.currentPage
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNext}
                        className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {showProductModal && selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => {
            console.log('❌ Closing product modal');
            setShowProductModal(false);
            setSelectedProduct(null);
          }}
          formatPrice={formatPrice}
          renderStars={renderStars}
          getFallbackImage={getFallbackImage}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ 
  product, 
  viewMode, 
  onProductClick, 
  onAddToCart, 
  formatPrice, 
  renderStars, 
  getFallbackImage 
}) => {
  const getCategoryName = (category) => {
    if (!category) return 'Safety Equipment';
    if (typeof category === 'string') return category;
    if (typeof category === 'object' && category.name) return category.name;
    return 'Safety Equipment';
  };

  if (viewMode === 'grid') {
    return (
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
        onClick={() => onProductClick(product)}
      >
        <div className="relative aspect-square">
          <img
            src={getFallbackImage(product)}
            alt={product.product_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=300&h=300&fit=crop&auto=format';
            }}
          />
          
          {/* Stock Status */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
          
          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
              title="Quick View"
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </button>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
              title="Add to Wishlist"
            >
              <Heart className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="text-sm text-gray-500 mb-1">{product.product_brand}</div>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.product_name}
          </h3>
          
          <div className="text-sm text-blue-600 mb-2">
            {getCategoryName(product.category)}
          </div>
          
          {product.averageRating && (
            <div className="mb-2">
              {renderStars(product.averageRating, product.reviewCount)}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(product.product_price)}
            </span>
            
            <button
              onClick={(e) => onAddToCart(product, e)}
              disabled={product.stock === 0}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="text-sm">Add</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => onProductClick(product)}
    >
      <div className="flex">
        <div className="w-48 h-32 flex-shrink-0">
          <img
            src={getFallbackImage(product)}
            alt={product.product_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=300&h=300&fit=crop&auto=format';
            }}
          />
        </div>
        
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">{product.product_brand}</div>
              <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                {product.product_name}
              </h3>
              
              <div className="text-sm text-blue-600 mb-2">
                {getCategoryName(product.category)}
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.product_description}
              </p>
              
              {product.averageRating && (
                <div className="mb-2">
                  {renderStars(product.averageRating, product.reviewCount)}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-blue-600">
                  {formatPrice(product.product_price)}
                </span>
                
                <div className="flex items-center gap-2">
                  {product.stock === 0 ? (
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  ) : (
                    <span className="text-green-600 font-medium">In Stock ({product.stock})</span>
                  )}
                  
                  <button
                    onClick={(e) => onAddToCart(product, e)}
                    disabled={product.stock === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Detail Modal Component
const ProductDetailModal = ({ 
  product, 
  onClose, 
  formatPrice, 
  renderStars, 
  getFallbackImage, 
  onAddToCart 
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const getCategoryName = (category) => {
    if (!category) return 'Safety Equipment';
    if (typeof category === 'string') return category;
    if (typeof category === 'object' && category.name) return category.name;
    return 'Safety Equipment';
  };

  const images = product.product_images || [product.product_image || getFallbackImage(product)];

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={images[selectedImageIndex] ? 
                    (typeof images[selectedImageIndex] === 'string' ? images[selectedImageIndex] : images[selectedImageIndex].url) :
                    getFallbackImage(product)
                  }
                  alt={product.product_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=500&h=500&fit=crop&auto=format';
                  }}
                />
              </div>
              
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index ? 'border-blue-600' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={typeof image === 'string' ? image : image.url}
                        alt={`${product.product_name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=100&h=100&fit=crop&auto=format';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="text-sm text-gray-500 mb-2">{product.product_brand}</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.product_name}</h1>
              
              <div className="text-sm text-blue-600 mb-4">
                {getCategoryName(product.category)}
              </div>
              
              {product.averageRating && (
                <div className="mb-4">
                  {renderStars(product.averageRating, product.reviewCount)}
                </div>
              )}
              
              <div className="text-4xl font-bold text-blue-600 mb-6">
                {formatPrice(product.product_price)}
              </div>
              
              <div className="prose prose-sm text-gray-600 mb-6">
                <p>{product.product_description}</p>
              </div>
              
              {/* Stock Status */}
              <div className="mb-6">
                {product.stock === 0 ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Out of Stock
                  </span>
                ) : product.stock <= 5 ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    Only {product.stock} left in stock
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    In Stock ({product.stock} available)
                  </span>
                )}
              </div>
              
              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <label className="text-sm font-medium text-gray-700 mr-3">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 text-gray-900 min-w-[3rem] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={(e) => onAddToCart(product, e)}
                  disabled={product.stock === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </button>
              </div>
              
              {/* Product Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 capitalize">{key.replace('_', ' ')}</span>
                        <span className="text-gray-900 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="h-4 w-4" />
                  Add to Wishlist
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Eye className="h-4 w-4" />
                  Compare
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;