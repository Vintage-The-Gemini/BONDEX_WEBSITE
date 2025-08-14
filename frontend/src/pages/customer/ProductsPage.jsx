// File Path: frontend/src/pages/customer/ProductsPage.jsx

import React, { useState } from 'react'

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState('grid') // grid or list

  // Mock product data - in real app this would come from API
  const products = [
    {
      id: 1,
      name: 'Safety Boots Steel Toe',
      price: 8500,
      originalPrice: 9500,
      category: 'foot-protection',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=300',
      badge: 'Best Seller',
      rating: 4.8,
      inStock: true,
      description: 'Professional steel toe safety boots with slip-resistant sole'
    },
    {
      id: 2,
      name: 'Hard Hat with Chin Strap',
      price: 2800,
      category: 'head-protection',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300',
      badge: 'New',
      rating: 4.6,
      inStock: true,
      description: 'ANSI-certified hard hat with adjustable chin strap'
    },
    {
      id: 3,
      name: 'Cut-Resistant Gloves',
      price: 1200,
      category: 'hand-protection',
      image: 'https://images.unsplash.com/photo-1582560475093-ba66ac3b8fa7?w=300',
      rating: 4.7,
      inStock: true,
      description: 'Level 5 cut-resistant gloves with grip coating'
    },
    {
      id: 4,
      name: 'High-Visibility Vest',
      price: 1800,
      originalPrice: 2200,
      category: 'body-protection',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
      badge: 'Sale',
      rating: 4.5,
      inStock: true,
      description: 'Class 2 high-visibility safety vest with reflective strips'
    },
    {
      id: 5,
      name: 'Safety Goggles',
      price: 950,
      category: 'eye-protection',
      image: 'https://images.unsplash.com/photo-1621905515940-b2b96d5e0b9e?w=300',
      rating: 4.4,
      inStock: false,
      description: 'Anti-fog safety goggles with UV protection'
    },
    {
      id: 6,
      name: 'Respirator Mask N95',
      price: 450,
      category: 'breathing-protection',
      image: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=300',
      rating: 4.9,
      inStock: true,
      description: 'NIOSH-approved N95 respirator mask'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'head-protection', name: 'Head Protection', count: products.filter(p => p.category === 'head-protection').length },
    { id: 'foot-protection', name: 'Foot Protection', count: products.filter(p => p.category === 'foot-protection').length },
    { id: 'hand-protection', name: 'Hand Protection', count: products.filter(p => p.category === 'hand-protection').length },
    { id: 'eye-protection', name: 'Eye Protection', count: products.filter(p => p.category === 'eye-protection').length },
    { id: 'body-protection', name: 'Body Protection', count: products.filter(p => p.category === 'body-protection').length },
    { id: 'breathing-protection', name: 'Breathing Protection', count: products.filter(p => p.category === 'breathing-protection').length }
  ]

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      default:
        return a.name.localeCompare(b.name)
    }
  })

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price)
  }

  const ProductCard = ({ product }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      cursor: 'pointer',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      border: '1px solid #e5e7eb'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'
    }}>
      <div style={{ position: 'relative' }}>
        <img 
          src={product.image}
          alt={product.name}
          style={{ 
            width: '100%', 
            height: '220px', 
            objectFit: 'cover' 
          }}
        />
        {product.badge && (
          <span style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: product.badge === 'Sale' ? '#ef4444' : '#f97316',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {product.badge}
          </span>
        )}
        {!product.inStock && (
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
      <div style={{ padding: '20px' }}>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '16px', 
          fontWeight: 'bold',
          color: '#0f172a'
        }}>
          {product.name}
        </h3>
        <p style={{ 
          margin: '0 0 12px 0', 
          color: '#6b7280', 
          fontSize: '14px',
          lineHeight: '1.4'
        }}>
          {product.description}
        </p>
        
        {/* Rating */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '12px' 
        }}>
          <div style={{ color: '#facc15', marginRight: '8px' }}>
            {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
          </div>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            {product.rating}
          </span>
        </div>

        {/* Price */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <span style={{ 
            fontWeight: 'bold', 
            fontSize: '18px', 
            color: '#f97316' 
          }}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span style={{ 
              fontSize: '14px', 
              color: '#9ca3af',
              textDecoration: 'line-through',
              marginLeft: '8px'
            }}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            style={{
              flex: 1,
              backgroundColor: product.inStock ? '#f97316' : '#9ca3af',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '6px',
              cursor: product.inStock ? 'pointer' : 'not-allowed',
              fontWeight: '500',
              fontSize: '14px'
            }}
            disabled={!product.inStock}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
          <button style={{
            backgroundColor: 'transparent',
            color: '#f97316',
            border: '1px solid #f97316',
            padding: '10px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            ♡
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ 
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '40px 20px'
        }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '8px',
            color: '#0f172a'
          }}>
            Safety Equipment
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: '#6b7280',
            margin: 0
          }}>
            Professional safety gear for every workplace in Kenya
          </p>
        </div>
      </div>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px 20px'
      }}>
        <div style={{ display: 'flex', gap: '40px' }}>
          
          {/* Sidebar Filters */}
          <div style={{ 
            width: '250px',
            flexShrink: 0
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              marginBottom: '24px'
            }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                marginBottom: '16px',
                color: '#0f172a'
              }}>
                Categories
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {categories.map(category => (
                  <li key={category.id} style={{ marginBottom: '8px' }}>
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        backgroundColor: selectedCategory === category.id ? '#fef3e2' : 'transparent',
                        color: selectedCategory === category.id ? '#f97316' : '#374151',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span>{category.name}</span>
                      <span style={{ 
                        fontSize: '12px',
                        backgroundColor: selectedCategory === category.id ? '#f97316' : '#e5e7eb',
                        color: selectedCategory === category.id ? 'white' : '#6b7280',
                        padding: '2px 6px',
                        borderRadius: '10px'
                      }}>
                        {category.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div style={{ flex: 1 }}>
            
            {/* Controls */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              backgroundColor: 'white',
              padding: '16px 20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {sortedProducts.length} products found
              </div>
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '24px' 
            }}>
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Empty State */}
            {sortedProducts.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: 'white',
                borderRadius: '12px'
              }}>
                <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#374151' }}>
                  No products found
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                  Try adjusting your filters or search for something else
                </p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  style={{
                    backgroundColor: '#f97316',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  View All Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage