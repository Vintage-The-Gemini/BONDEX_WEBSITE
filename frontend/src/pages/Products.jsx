// frontend/src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  ShoppingCart,
  Eye,
  Heart,
  ChevronDown,
  X,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';

const Products = ({ onOpenProductModal, onAddToCart, defaultFilter = null }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  
  // State management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter state
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

  // Apply default filter if provided
  useEffect(() => {
    if (defaultFilter) {
      if (defaultFilter === 'onSale') {
        setFilters(prev => ({ ...prev, isOnSale: true }));
      }
    }
  }, [defaultFilter]);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`/api/products?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const result = await response.json();
      
      if (result.success) {
        setProducts(result.data || []);
        setTotalProducts(result.totalProducts || 0);
        setTotalPages(result.totalPages || 1);
        setCurrentPage(result.currentPage || 1);
        setError(null);
      } else {
        throw new Error(result.message || 'Failed to load products');
      }
    } catch (err) {
      console.error('Products fetch error:', err);
      setError(err.message);
      // Fallback to sample data
      setProducts(getSampleProducts());
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for filter
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?status=active');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setCategories(result.data || []);
        }
      }
    } catch (err) {
      console.error('Categories fetch error:', err);
      // Fallback categories
      setCategories([
        { _id: '1', name: 'Head Protection' },
        { _id: '2', name: 'Eye Protection' },
        { _id: '3', name: 'Foot Protection' },
        { _id: '4', name: 'Hand Protection' },
        { _id: '5', name: 'Breathing Protection' }
      ]);
    }
  };

  // Sample products for fallback
  const getSampleProducts = () => [
    {
      _id: 'sample-1',
      product_name: 'Professional Safety Helmet',
      product_description: 'Heavy-duty construction helmet with adjustable suspension system',
      product_price: 2500,
      category: 'Head Protection',
      product_brand: 'SafeGuard Pro',
      product_images: ['https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop'],
      averageRating: 4.8,
      reviewCount: 24,
      stock: 45,
      isFeatured: true,
      isOnSale: false
    },
    {
      _id: 'sample-2',
      product_name: 'Medical Face Masks N95',
      product_description: 'CDC approved N95 respirator masks for medical use',
      product_price: 150,
      category: 'Face Protection',
      product_brand: 'MedSafe',
      product_images: ['https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=300&h=300&fit=crop'],
      averageRating: 4.9,
      reviewCount: 156,
      stock: 200,
      isFeatured: true,
      isOnSale: true,
      originalPrice: 200
    }
  ];

  // Get default image based on category
  const getDefaultImage = (category, productName) => {
    const categoryLower = (typeof category === 'object' ? category.name : category)?.toLowerCase() || '';
    
    if (categoryLower.includes('head') || categoryLower.includes('helmet')) {
      return 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop&auto=format';
    } else if (categoryLower.includes('face') || categoryLower.includes('mask')) {
      return 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=300&h=300&fit=crop&auto=format';
    } else if (categoryLower.includes('foot') || categoryLower.includes('boot')) {
      return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop&auto=format';
    } else if (categoryLower.includes('eye') || categoryLower.includes('goggle')) {
      return 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=300&h=300&fit=crop&auto=format';
    } else if (categoryLower.includes('hand') || categoryLower.includes('glove')) {
      return 'https://images.unsplash.com/photo-1559226947-8cffc3a59d82?w=300&h=300&fit=crop&auto=format';
    } else if (categoryLower.includes('body') || categoryLower.includes('vest')) {
      return 'https://images.unsplash.com/photo-1594608661623-4b64b4de8e63?w=300&h=300&fit=crop&auto=format';
    } else {
      // Default safety equipment image
      return 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=300&h=300&fit=crop&auto=format';
    }
  };

  // Load data on component mount and filter changes
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filters]);

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
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page
    }));
  };

  // Clear all filters
  const clearFilters = () => {
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

  // Format price
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

  // Handle add to cart
  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart({
        id: product._id,
        name: product.product_name,
        price: product.product_price,
        image: product.product_images?.[0],
        brand: product.product_brand,
        quantity: 1
      });
    }
  };

  // Handle product view
  const handleViewProduct = (product) => {
    if (onOpenProductModal) {
      onOpenProductModal(product);
    }
  };

  // Pagination
  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Safety Equipment
              </h1>
              <p className="text-gray-600 mt-1">
                {totalProducts} products available
                {filters.category && ` in ${filters.category}`}
                {filters.search && ` matching "${filters.search}"`}
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
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
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  placeholder="Enter brand name"
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4 stars & up</option>
                  <option value="3">3 stars & up</option>
                  <option value="2">2 stars & up</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                  >
                    <SlidersHorizontal className="h-5 w-5" />
                    <span>Filters</span>
                  </button>

                  <div className="text-sm text-gray-600">
                    Showing {((filters.page - 1) * filters.limit) + 1}-{Math.min(filters.page * filters.limit, totalProducts)} of {totalProducts} products
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Sort Options */}
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-');
                      handleFilterChange('sortBy', sortBy);
                      handleFilterChange('sortOrder', sortOrder);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="createdAt-desc">Newest First</option>
                    <option value="createdAt-asc">Oldest First</option>
                    <option value="product_price-asc">Price: Low to High</option>
                    <option value="product_price-desc">Price: High to Low</option>
                    <option value="product_name-asc">Name: A to Z</option>
                    <option value="product_name-desc">Name: Z to A</option>
                  </select>

                  {/* View Mode Toggle */}
                  <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Grid3X3 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border animate-pulse">
                    <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">Failed to load products: {error}</p>
                <button
                  onClick={fetchProducts}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Products Grid/List */}
            {!loading && !error && (
              <>
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">No products found matching your criteria.</p>
                    <button
                      onClick={clearFilters}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className={
                    viewMode === 'grid'
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }>
                    {products.map((product) => (
                      <div
                        key={product._id}
                        className={`bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                          viewMode === 'list' ? 'flex' : ''
                        }`}
                        onClick={() => handleViewProduct(product)}
                      >
                        {/* Product Image */}
                        <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'rounded-t-lg'}`}>
                          <img
                            src={product.product_images?.[0] || '/api/placeholder/300/300'}
                            alt={product.product_name}
                            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                              viewMode === 'list' ? 'w-full h-full rounded-l-lg' : 'w-full h-48'
                            }`}
                          />
                          
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col space-y-2">
                            {product.isFeatured && (
                              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                Featured
                              </span>
                            )}
                            {product.isOnSale && (
                              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                Sale
                              </span>
                            )}
                            {product.stock < 10 && product.stock > 0 && (
                              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                Low Stock
                              </span>
                            )}
                          </div>

                          {/* Hover Actions */}
                          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewProduct(product);
                              }}
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

                        {/* Product Info */}
                        <div className="p-6 flex-1">
                          <div className="flex flex-col h-full">
                            {/* Brand */}
                            <div className="text-sm text-gray-500 mb-1">{product.product_brand}</div>
                            
                            {/* Product Name */}
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {product.product_name}
                            </h3>

                            {/* Category */}
                            <div className="text-sm text-blue-600 mb-2">
                              {typeof product.category === 'object' ? product.category.name : product.category}
                            </div>

                            {/* Description (List view only) */}
                            {viewMode === 'list' && (
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {product.product_description}
                              </p>
                            )}

                            {/* Rating */}
                            {product.averageRating && (
                              <div className="mb-3">
                                {renderStars(product.averageRating, product.reviewCount || 0)}
                              </div>
                            )}

                            {/* Stock Status */}
                            <div className="mb-3">
                              {product.stock === 0 ? (
                                <span className="text-red-600 text-sm font-medium">Out of Stock</span>
                              ) : product.stock < 10 ? (
                                <span className="text-orange-600 text-sm font-medium">
                                  Only {product.stock} left in stock
                                </span>
                              ) : (
                                <span className="text-green-600 text-sm font-medium">In Stock</span>
                              )}
                            </div>

                            {/* Price and Actions */}
                            <div className="mt-auto">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xl font-bold text-gray-900">
                                    {formatPrice(product.product_price)}
                                  </span>
                                  {product.isOnSale && product.originalPrice && (
                                    <span className="text-sm text-gray-500 line-through">
                                      {formatPrice(product.originalPrice)}
                                    </span>
                                  )}
                                </div>
                                {product.isOnSale && product.originalPrice && (
                                  <span className="text-sm font-medium text-red-600">
                                    Save {Math.round(((product.originalPrice - product.product_price) / product.originalPrice) * 100)}%
                                  </span>
                                )}
                              </div>

                              {/* Add to Cart Button */}
                              <button
                                onClick={(e) => handleAddToCart(product, e)}
                                disabled={product.stock === 0}
                                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                                  product.stock === 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                              >
                                <ShoppingCart className="h-4 w-4" />
                                <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 border rounded-lg ${
                              pageNum === currentPage
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
    </div>
  );
};

export default Products;