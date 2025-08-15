// File Path: frontend/src/pages/customer/ProductsPage.jsx

import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    industry: searchParams.get('industry') || 'all',
    search: searchParams.get('search') || '',
    priceRange: 'all',
    sortBy: 'name',
    inStock: false,
    safetyStandard: 'all'
  })
  
  const [viewMode, setViewMode] = useState('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)

  // Get API URL function
  const getApiUrl = () => {
    if (typeof window !== 'undefined' && window.location) {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5000';
      }
      return 'https://your-backend-url.render.com';
    }
    return 'http://localhost:5000';
  };

  // Comprehensive Safety Categories (matching backend)
  const safetyCategories = [
    { value: 'all', label: 'All Products', icon: '🛡️' },
    { value: 'head-protection', label: 'Head Protection', icon: '⛑️' },
    { value: 'eye-protection', label: 'Eye Protection', icon: '🥽' },
    { value: 'hand-protection', label: 'Hand Protection', icon: '🧤' },
    { value: 'foot-protection', label: 'Foot Protection', icon: '👢' },
    { value: 'body-protection', label: 'Body Protection', icon: '🦺' },
    { value: 'respiratory-protection', label: 'Respiratory Protection', icon: '😷' },
    { value: 'hearing-protection', label: 'Hearing Protection', icon: '🎧' },
    { value: 'fall-protection', label: 'Fall Protection', icon: '🪢' },
    { value: 'workwear-clothing', label: 'Workwear & Clothing', icon: '👕' },
    { value: 'chemical-protection', label: 'Chemical Protection', icon: '🧪' },
    { value: 'fire-protection', label: 'Fire Protection', icon: '🔥' }
  ]

  // Industry Categories (matching backend)
  const industryCategories = [
    { value: 'all', label: 'All Industries', icon: '🏭' },
    { value: 'construction-infrastructure', label: 'Construction & Infrastructure', icon: '🏗️' },
    { value: 'manufacturing-industrial', label: 'Manufacturing & Industrial', icon: '🏭' },
    { value: 'healthcare-medical', label: 'Healthcare & Medical', icon: '🏥' },
    { value: 'oil-gas-energy', label: 'Oil, Gas & Energy', icon: '⛽' },
    { value: 'mining-quarrying', label: 'Mining & Quarrying', icon: '⛏️' },
    { value: 'agriculture-farming', label: 'Agriculture & Farming', icon: '🚜' },
    { value: 'transportation-logistics', label: 'Transportation & Logistics', icon: '🚚' },
    { value: 'utilities-public-services', label: 'Utilities & Public Services', icon: '💡' },
    { value: 'fire-emergency-services', label: 'Fire & Emergency Services', icon: '🚒' },
    { value: 'laboratories-research', label: 'Laboratories & Research', icon: '🔬' }
  ]

  // Safety Standards
  const safetyStandards = [
    { value: 'all', label: 'All Standards' },
    { value: 'en-iso', label: 'EN ISO Standards' },
    { value: 'ansi', label: 'ANSI Standards' },
    { value: 'ce-marked', label: 'CE Marked' },
    { value: 'astm', label: 'ASTM Standards' },
    { value: 'osha', label: 'OSHA Compliant' }
  ]

  // Price Ranges (KES)
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'under-2000', label: 'Under KES 2,000' },
    { value: '2000-5000', label: 'KES 2,000 - 5,000' },
    { value: '5000-10000', label: 'KES 5,000 - 10,000' },
    { value: '10000-20000', label: 'KES 10,000 - 20,000' },
    { value: 'over-20000', label: 'Over KES 20,000' }
  ]

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' }
  ]

  // Fetch products and categories
  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [filters, currentPage])

  const fetchCategories = async () => {
    try {
      const apiUrl = getApiUrl()
      const response = await fetch(`${apiUrl}/api/categories`)
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data || [])
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      
      if (filters.category !== 'all') queryParams.append('category', filters.category)
      if (filters.industry !== 'all') queryParams.append('industry', filters.industry)
      if (filters.search) queryParams.append('search', filters.search)
      if (filters.inStock) queryParams.append('inStock', 'true')
      queryParams.append('page', currentPage)
      queryParams.append('limit', itemsPerPage)
      queryParams.append('sort', filters.sortBy)

      const apiUrl = getApiUrl()
      const response = await fetch(`${apiUrl}/api/products?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      let fetchedProducts = data.data || data.products || []

      // Apply client-side price filtering
      if (filters.priceRange !== 'all') {
        fetchedProducts = fetchedProducts.filter(product => {
          const price = parseFloat(product.product_price)
          switch (filters.priceRange) {
            case 'under-2000': return price < 2000
            case '2000-5000': return price >= 2000 && price <= 5000
            case '5000-10000': return price > 5000 && price <= 10000
            case '10000-20000': return price > 10000 && price <= 20000
            case 'over-20000': return price > 20000
            default: return true
          }
        })
      }

      setProducts(fetchedProducts)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
    setCurrentPage(1)
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams)
    if (filterType === 'category' && value !== 'all') {
      newParams.set('category', value)
    } else if (filterType === 'category') {
      newParams.delete('category')
    }
    if (filterType === 'search' && value) {
      newParams.set('search', value)
    } else if (filterType === 'search') {
      newParams.delete('search')
    }
    setSearchParams(newParams)
  }

  const clearAllFilters = () => {
    setFilters({
      category: 'all',
      industry: 'all',
      search: '',
      priceRange: 'all',
      sortBy: 'name',
      inStock: false,
      safetyStandard: 'all'
    })
    setSearchParams({});
  };

  const formatPrice = (price) => {
    return `KES ${parseFloat(price).toLocaleString()}`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Connection Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={fetchProducts}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Professional Header Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Breadcrumb & Title */}
            <div>
              {/* Safety Standards */}
              {product.complianceStandards && product.complianceStandards.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {product.complianceStandards.map((standard, index) => (
                      <span key={index} className="bg-yellow-400 text-black px-2 py-1 rounded text-sm font-bold">
                        {standard}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price and Actions */}
            <div className="text-right ml-6 flex-shrink-0">
              <div className="mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.product_price)}
                </span>
                {product.salePrice && (
                  <div className="text-gray-500 line-through text-lg">
                    {formatPrice(product.salePrice)}
                  </div>
                )}
              </div>

              {/* Stock Status */}
              {product.stock <= 5 && product.stock > 0 && (
                <div className="text-orange-600 text-sm font-medium mb-3">
                  Only {product.stock} left in stock
                </div>
              )}

              <div className="space-y-2">
                <button
                  onClick={handleViewDetails}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded font-medium transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>

              {/* Compare Option */}
              <div className="mt-3">
                <label className="flex items-center justify-end text-sm text-gray-600">
                  <input type="checkbox" className="mr-2 rounded" />
                  Compare
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage<nav className="text-sm text-gray-500 mb-2">
                <span className="hover:text-orange-500 cursor-pointer" onClick={() => navigate('/')}>Home</span>
                <span className="mx-2">/</span>
                <span>Safety Equipment</span>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900">
                {filters.category !== 'all' 
                  ? safetyCategories.find(c => c.value === filters.category)?.label 
                  : 'Professional Safety Equipment'
                }
              </h1>
              <p className="text-gray-600 mt-1">
                {loading ? 'Loading...' : `${products.length} products available`}
                {filters.search && ` for "${filters.search}"`}
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md lg:max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products, models, brands..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Professional Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border sticky top-6">
              {/* Filter Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Clear all
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-6">
                {/* Categories */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                  <div className="space-y-2">
                    {safetyCategories.map(cat => (
                      <label key={cat.value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={filters.category === cat.value}
                          onChange={() => handleFilterChange('category', cat.value)}
                          className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          {cat.icon} {cat.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Industries */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Industry Application</h4>
                  <select
                    value={filters.industry}
                    onChange={(e) => handleFilterChange('industry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 text-sm"
                  >
                    {industryCategories.map(industry => (
                      <option key={industry.value} value={industry.value}>
                        {industry.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    {priceRanges.map(range => (
                      <label key={range.value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={filters.priceRange === range.value}
                          onChange={() => handleFilterChange('priceRange', range.value)}
                          className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          {range.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Safety Standards */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Safety Standards</h4>
                  <select
                    value={filters.safetyStandard}
                    onChange={(e) => handleFilterChange('safetyStandard', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 text-sm"
                  >
                    {safetyStandards.map(standard => (
                      <option key={standard.value} value={standard.value}>
                        {standard.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stock Filter */}
                <div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">In Stock Only</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products Area */}
          <div className="lg:col-span-3 mt-6 lg:mt-0">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-gray-600 text-sm">
                    {loading ? 'Loading products...' : `Showing ${products.length} results`}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Sort by:</span>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500"
                    >
                      {sortOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* View Toggle */}
                  <div className="flex bg-gray-100 rounded p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-white shadow-sm text-orange-600' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-white shadow-sm text-orange-600' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
                <p className="text-gray-600 text-lg">Loading safety equipment...</p>
              </div>
            )}

            {/* Products Grid/List */}
            {!loading && (
              <ProductsGrid 
                products={products} 
                viewMode={viewMode} 
                formatPrice={formatPrice}
                navigate={navigate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Products Grid Component
const ProductsGrid = ({ products, viewMode, formatPrice, navigate }) => {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
        <p className="text-gray-600 mb-6">
          We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>• Check if all filters are necessary</p>
          <p>• Try broader search terms</p>
          <p>• Browse different categories</p>
        </div>
      </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map(product => (
          <ProductListCard 
            key={product._id} 
            product={product} 
            formatPrice={formatPrice}
            navigate={navigate}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductGridCard 
          key={product._id} 
          product={product} 
          formatPrice={formatPrice}
          navigate={navigate}
        />
      ))}
    </div>
  )
}

// Professional Product Grid Card (Safety Jogger style)
const ProductGridCard = ({ product, formatPrice, navigate }) => {
  const mainImage = product.images?.find(img => img.isMain)?.url || 
                   product.mainImage || 
                   product.product_image ||
                   'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=Safety+Equipment'

  const handleViewDetails = () => {
    navigate(`/product/${product._id}`)
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    console.log('Add to cart:', product._id)
  }

  return (
    <div 
      onClick={handleViewDetails}
      className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={mainImage}
          alt={product.product_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Safety Standards Badge */}
        {product.complianceStandards && product.complianceStandards.length > 0 && (
          <div className="absolute top-3 left-3">
            <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
              {product.complianceStandards[0]}
            </span>
          </div>
        )}

        {/* Stock Status */}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
            Only {product.stock} left
          </span>
        )}

        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-6 py-2 rounded font-medium"
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {product.product_name}
        </h3>

        {/* Model/SKU */}
        {product.sku && (
          <p className="text-gray-500 text-sm mb-2 uppercase tracking-wide">
            {product.sku}
          </p>
        )}

        {/* Features/Technologies */}
        {product.features && product.features.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.product_price)}
            </span>
            {product.salePrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.salePrice)}
              </span>
            )}
          </div>

          {/* Compare Checkbox */}
          <label className="flex items-center text-sm text-gray-600">
            <input type="checkbox" className="mr-1 rounded" />
            Compare
          </label>
        </div>
      </div>
    </div>
  )
}

// Professional Product List Card
const ProductListCard = ({ product, formatPrice, navigate }) => {
  const mainImage = product.images?.find(img => img.isMain)?.url || 
                   product.mainImage || 
                   product.product_image ||
                   'https://via.placeholder.com/150x150/f3f4f6/9ca3af?text=Safety+Equipment'

  const handleViewDetails = () => {
    navigate(`/product/${product._id}`)
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    console.log('Add to cart:', product._id)
  }

  return (
    <div 
      onClick={handleViewDetails}
      className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="p-4 flex gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-50">
            <img
              src={mainImage}
              alt={product.product_name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-orange-600 transition-colors">
                {product.product_name}
              </h3>
              
              {product.sku && (
                <p className="text-gray-500 text-sm mb-2 uppercase tracking-wide">
                  Model: {product.sku}
                </p>
              )}
              
              <p className="text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                {product.product_description}
              </p>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {product.features.slice(0, 4).map((feature, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">
                        ✓ {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}