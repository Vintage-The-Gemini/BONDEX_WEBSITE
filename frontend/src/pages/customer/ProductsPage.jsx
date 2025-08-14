// File Path: frontend/src/pages/customer/ProductsPage.jsx

import React, { useState, useEffect } from 'react'

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    category: 'all',
    industry: 'all',
    priceRange: 'all',
    sortBy: 'name',
    searchTerm: ''
  })
  const [viewMode, setViewMode] = useState('grid')

  // Fetch products from backend
  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      
      if (filters.category !== 'all') queryParams.append('category', filters.category)
      if (filters.industry !== 'all') queryParams.append('industry', filters.industry)
      if (filters.searchTerm) queryParams.append('search', filters.searchTerm)
      queryParams.append('status', 'active')
      queryParams.append('sortBy', filters.sortBy)

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      let filteredProducts = data.products || []

      // Apply price range filter
      if (filters.priceRange !== 'all') {
        filteredProducts = filteredProducts.filter(product => {
          const price = parseFloat(product.product_price)
          switch (filters.priceRange) {
            case 'under-1000': return price < 1000
            case '1000-5000': return price >= 1000 && price <= 5000
            case '5000-10000': return price > 5000 && price <= 10000
            case 'over-10000': return price > 10000
            default: return true
          }
        })
      }

      setProducts(filteredProducts)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return `KES ${parseFloat(price).toLocaleString()}`
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'head-protection', label: 'Head Protection' },
    { value: 'foot-protection', label: 'Foot Protection' },
    { value: 'hand-protection', label: 'Hand Protection' },
    { value: 'eye-protection', label: 'Eye Protection' },
    { value: 'breathing-protection', label: 'Breathing Protection' },
    { value: 'body-protection', label: 'Body Protection' }
  ]

  const industries = [
    { value: 'all', label: 'All Industries' },
    { value: 'construction', label: 'Construction' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'medical', label: 'Medical' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'chemical', label: 'Chemical' },
    { value: 'mining', label: 'Mining' }
  ]

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'under-1000', label: 'Under KES 1,000' },
    { value: '1000-5000', label: 'KES 1,000 - 5,000' },
    { value: '5000-10000', label: 'KES 5,000 - 10,000' },
    { value: 'over-10000', label: 'Over KES 10,000' }
  ]

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' }
  ]

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        Loading products...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        fontSize: '18px',
        color: '#ef4444'
      }}>
        Error: {error}
      </div>
    )
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Page Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#0f172a',
          marginBottom: '8px'
        }}>
          Safety Equipment
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          Professional safety equipment for all industries
        </p>
      </div>

      {/* Filters Section */}
      <div style={{ 
        backgroundColor: '#f8fafc',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '16px'
        }}>
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search products..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Industry Filter */}
          <div>
            <select
              value={filters.industry}
              onChange={(e) => handleFilterChange('industry', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              {industries.map(ind => (
                <option key={ind.value} value={ind.value}>{ind.label}</option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <select
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              {priceRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort and View Options */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: '#374151' }}>Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              style={{
                padding: '6px 10px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#374151' }}>View:</span>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '6px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: viewMode === 'grid' ? '#f97316' : 'white',
                color: viewMode === 'grid' ? 'white' : '#374151',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '6px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: viewMode === 'list' ? '#f97316' : 'white',
                color: viewMode === 'list' ? 'white' : '#374151',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              List
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div style={{ 
          marginTop: '16px', 
          fontSize: '14px', 
          color: '#6b7280' 
        }}>
          {products.length} product{products.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Products Grid/List */}
      {products.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          color: '#6b7280' 
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>No products found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: viewMode === 'grid' 
            ? 'repeat(auto-fill, minmax(280px, 1fr))' 
            : '1fr',
          gap: viewMode === 'grid' ? '24px' : '16px'
        }}>
          {products.map(product => (
            <ProductCard 
              key={product._id} 
              product={product} 
              viewMode={viewMode}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Product Card Component
const ProductCard = ({ product, viewMode, formatPrice }) => {
  const mainImage = product.images?.find(img => img.isMain)?.url || 
                   product.mainImage || 
                   product.product_image ||
                   'https://via.placeholder.com/300x300?text=No+Image'

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', product._id)
  }

  const handleViewDetails = () => {
    // TODO: Navigate to product detail page
    window.location.href = `/product/${product._id}`
  }

  if (viewMode === 'list') {
    return (
      <div style={{
        display: 'flex',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        gap: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '6px',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          <img
            src={mainImage}
            alt={product.product_name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold',
            color: '#0f172a',
            marginBottom: '8px'
          }}>
            {product.product_name}
          </h3>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '14px',
            lineHeight: '1.4',
            marginBottom: '12px'
          }}>
            {product.product_description?.substring(0, 120)}...
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <span style={{ 
              fontWeight: 'bold', 
              fontSize: '20px', 
              color: '#f97316' 
            }}>
              {formatPrice(product.product_price)}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleViewDetails}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #f97316',
                  backgroundColor: 'white',
                  color: '#f97316',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                View Details
              </button>
              <button
                onClick={handleAddToCart}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f97316',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
    }}
    >
      {/* Product Image */}
      <div style={{ 
        position: 'relative',
        height: '200px',
        overflow: 'hidden'
      }}>
        <img
          src={mainImage}
          alt={product.product_name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        
        {/* Badges */}
        {product.isFeatured && (
          <span style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            Featured
          </span>
        )}
        
        {product.isNewArrival && (
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: '#10b981',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            New
          </span>
        )}

        {product.stock === 0 && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div style={{ padding: '16px' }}>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '16px', 
          fontWeight: 'bold',
          color: '#0f172a',
          lineHeight: '1.3'
        }}>
          {product.product_name}
        </h3>
        
        <p style={{ 
          margin: '0 0 12px 0', 
          color: '#6b7280', 
          fontSize: '14px',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.product_description}
        </p>

        {/* Categories */}
        <div style={{ marginBottom: '12px' }}>
          <span style={{
            display: 'inline-block',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            marginRight: '4px'
          }}>
            {product.category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>

        {/* Price */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <span style={{ 
            fontWeight: 'bold', 
            fontSize: '18px', 
            color: '#f97316' 
          }}>
            {formatPrice(product.product_price)}
          </span>
          
          {product.stock < 10 && product.stock > 0 && (
            <span style={{
              fontSize: '12px',
              color: '#ef4444',
              fontWeight: '500'
            }}>
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={handleViewDetails}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: '1px solid #f97316',
              color: '#f97316',
              padding: '10px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            View Details
          </button>
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              flex: 1,
              backgroundColor: product.stock > 0 ? '#f97316' : '#9ca3af',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '6px',
              cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage