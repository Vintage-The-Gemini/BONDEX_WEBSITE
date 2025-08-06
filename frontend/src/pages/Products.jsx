// frontend/src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Grid3X3,
  List,
  Star,
  Heart,
  Eye,
  ShoppingCart,
  Package,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import apiClient from '../utils/ApiClient';
import ProductDetailModal from '../components/ProductDetailModal';

// Product Card Component - MOVED OUTSIDE
const ProductCard = ({ 
  product, 
  viewMode, 
  onProductClick, 
  onAddToCart, 
  formatPrice, 
  renderStars, 
  getFallbackImage,
  getCategoryName 
}) => {
  const getProductImage = () => {
    if (product.product_images && product.product_images.length > 0) {
      return product.product_images[0].url || product.product_images[0];
    }
    if (product.image) return product.image;
    return getFallbackImage();
  };

  const hasDiscount = product.sale_price && product.sale_price < product.regular_price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100)
    : 0;

  // Grid View
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 group">
      {/* Product Image */}
      <div className="relative w-full h-48 bg-gray-100 rounded-t-lg overflow-hidden">
        <img
          src={getProductImage()}
          alt={product.product_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = getFallbackImage();
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_featured && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Featured
            </span>
          )}
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onProductClick(product)}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
            title="Quick View"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </button>
          <button
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
            title="Add to Wishlist"
          >
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Stock Badge */}
        {product.stock_quantity <= 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {getCategoryName(product.primaryCategory)}
          </span>
          {product.product_brand && (
            <span className="text-xs text-gray-500">
              {product.product_brand}
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 
          className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors line-clamp-2"
          onClick={() => onProductClick(product)}
        >
          {product.product_name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.product_description}
        </p>

        {/* Rating */}
        {product.average_rating > 0 && (
          <div className="mb-3">
            {renderStars(product.average_rating, product.total_reviews)}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          {hasDiscount ? (
            <div>
              <span className="text-xl font-bold text-red-600">
                {formatPrice(product.sale_price)}
              </span>
              <span className="text-sm text-gray-500 line-through ml-2">
                {formatPrice(product.regular_price)}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.regular_price)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          {product.stock_quantity <= 0 ? (
            <span className="text-sm text-red-600 font-medium">Out of Stock</span>
          ) : product.stock_quantity <= 10 ? (
            <span className="text-sm text-orange-600 font-medium">
              Only {product.stock_quantity} left
            </span>
          ) : (
            <span className="text-sm text-green-600 font-medium">In Stock</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock_quantity <= 0}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="h-4 w-4" />
          {product.stock_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

// Main Products Component
const Products = ({ defaultFilter = '', onOpenProductModal, onAddToCart }) => {
  // State Management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid');
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

  // Fetch data on mount
  useEffect(() => {
    testApiConnection();
    fetchCategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  // Test API connectivity
  const testApiConnection = async () => {
    try {
      await apiClient.healthCheck();
      console.log('✅ API connection successful');
    } catch (error) {
      console.warn('⚠️ API health check failed:', error.message);
      setError('Unable to connect to server. Showing sample data.');
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await apiClient.getCategories({ status: 'active', type: 'safety' });
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.warn('⚠️ Failed to load categories:', error.message);
      setCategories([
        { _id: '1', name: 'Head Protection', icon: '⛑️' },
        { _id: '2', name: 'Eye Protection', icon: '👁️' },
        { _id: '3', name: 'Hand Protection', icon: '🧤' }
      ]);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiClient.getProducts(filters);
      
      if (response.success) {
        setProducts(response.data || []);
        
        if (response.pagination) {
          setPagination(response.pagination);
        }
        
        const uniqueBrands = [...new Set(response.data?.map(p => p.product_brand).filter(Boolean))];
        setBrands(uniqueBrands);
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
      
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setError(error.message);
      setProducts(getSampleProducts());
    } finally {
      setLoading(false);
    }
  };

  // Sample data fallback
  const getSampleProducts = () => [
    {
      _id: 'sample-1',
      product_name: 'Safety Helmet - Yellow',
      product_description: 'High-quality industrial safety helmet with adjustable suspension.',
      regular_price: 2500,
      sale_price: 2200,
      product_brand: 'SafeGuard',
      primaryCategory: { name: 'Head Protection' },
      product_images: [{ url: '/images/helmet-yellow.jpg' }],
      stock_quantity: 45,
      average_rating: 4.5,
      total_reviews: 28,
      is_featured: true,
      status: 'active'
    }
  ];

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  // Handle product click
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
    
    if (onOpenProductModal) {
      onOpenProductModal(product);
    }
  };

  // Handle add to cart
  const handleAddToCart = (product, quantity = 1) => {
    const cartItem = {
      id: product._id,
      name: product.product_name,
      price: product.sale_price || product.regular_price,
      image: product.product_images?.[0]?.url || getFallbackImage(),
      quantity: quantity,
      brand: product.product_brand,
      category: getCategoryName(product.primaryCategory)
    };
    
    if (onAddToCart) {
      onAddToCart(cartItem);
    }
    
    alert(`${product.product_name} added to cart!`);
  };

  // Clear filters
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
    if (!price) return 'KES 0';
    return `KES ${Number(price).toLocaleString('en-KE')}`;
  };

  // Render stars
  const renderStars = (rating, totalReviews = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    
    return (
      <div className="flex items-center gap-1">
        <div className="flex">{stars}</div>
        {totalReviews > 0 && (
          <span className="text-sm text-gray-500">({totalReviews})</span>
        )}
      </div>
    );
  };

  // Get fallback image
  const getFallbackImage = () => {
    return '/images/placeholder-product.jpg';
  };

  // Get category name
  const getCategoryName = (category) => {
    if (!category) return 'Safety Equipment';
    if (typeof category === 'string') return category;
    if (typeof category === 'object') return category.name || 'Safety Equipment';
    return 'Safety Equipment';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Safety Equipment
          </h1>
          <p className="text-gray-600">
            Professional safety equipment for workplace protection
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.icon} {category.name}
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="Max"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Brand Filter */}
              {brands.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Brands</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Sort Options */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Sort by:</label>
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-');
                      setFilters(prev => ({ ...prev, sortBy, sortOrder, page: 1 }));
                    }}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="createdAt-desc">Newest First</option>
                    <option value="regular_price-asc">Price: Low to High</option>
                    <option value="regular_price-desc">Price: High to Low</option>
                    <option value="product_name-asc">Name: A to Z</option>
                  </select>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">View:</span>
                  <div className="flex bg-gray-100 rounded-md p-1">
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
                  Showing {products.length} product{products.length !== 1 ? 's' : ''}
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
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">Connection Issue</h3>
                    <p className="text-sm text-yellow-700 mt-1">{error}</p>
                    <button
                      onClick={fetchProducts}
                      className="text-yellow-800 hover:text-yellow-900 underline font-medium mt-2"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Products Display */}
            {!loading && (
              <div>
                {products.length === 0 ? (
                  <div className="text-center py-20">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
                    <p className="text-gray-600 mb-4">No products match your current filters.</p>
                    <button
                      onClick={clearFilters}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className={`gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                      : 'flex flex-col space-y-4'
                  }`}>
                    {products.map(product => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        viewMode={viewMode}
                        onProductClick={handleProductClick}
                        onAddToCart={handleAddToCart}
                        formatPrice={formatPrice}
                        renderStars={renderStars}
                        getFallbackImage={getFallbackImage}
                        getCategoryName={getCategoryName}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {showProductModal && selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => {
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

export default Products;