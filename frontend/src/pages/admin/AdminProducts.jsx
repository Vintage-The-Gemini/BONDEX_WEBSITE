// File Path: frontend/src/pages/admin/AdminProducts.jsx

import React, { useState } from 'react'

const AdminProducts = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Mock products data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Safety Boots Steel Toe',
      price: 8500,
      originalPrice: 9500,
      category: 'foot-protection',
      stock: 45,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=300',
      sku: 'SB-001',
      description: 'Professional steel toe safety boots with slip-resistant sole'
    },
    {
      id: 2,
      name: 'Hard Hat with Chin Strap',
      price: 2800,
      category: 'head-protection',
      stock: 23,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300',
      sku: 'HH-002',
      description: 'ANSI-certified hard hat with adjustable chin strap'
    },
    {
      id: 3,
      name: 'Cut-Resistant Gloves',
      price: 1200,
      category: 'hand-protection',
      stock: 8,
      status: 'low-stock',
      image: 'https://images.unsplash.com/photo-1582560475093-ba66ac3b8fa7?w=300',
      sku: 'CG-003',
      description: 'Level 5 cut-resistant gloves with grip coating'
    },
    {
      id: 4,
      name: 'High-Visibility Vest',
      price: 1800,
      originalPrice: 2200,
      category: 'body-protection',
      stock: 0,
      status: 'out-of-stock',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
      sku: 'HV-004',
      description: 'Class 2 high-visibility safety vest with reflective strips'
    }
  ])

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'head-protection', name: 'Head Protection' },
    { id: 'foot-protection', name: 'Foot Protection' },
    { id: 'hand-protection', name: 'Hand Protection' },
    { id: 'eye-protection', name: 'Eye Protection' },
    { id: 'body-protection', name: 'Body Protection' },
    { id: 'breathing-protection', name: 'Breathing Protection' }
  ]

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return { bg: '#dcfce7', color: '#166534' }
      case 'low-stock':
        return { bg: '#fef3c7', color: '#92400e' }
      case 'out-of-stock':
        return { bg: '#fef2f2', color: '#991b1b' }
      default:
        return { bg: '#f3f4f6', color: '#374151' }
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const AddProductForm = () => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      marginBottom: '24px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
          Add New Product
        </h3>
        <button
          onClick={() => setShowAddForm(false)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#6b7280'
          }}
        >
          ×
        </button>
      </div>

      <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            Product Name *
          </label>
          <input
            type="text"
            placeholder="Enter product name"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            SKU *
          </label>
          <input
            type="text"
            placeholder="e.g., SB-005"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            Category *
          </label>
          <select style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none'
          }}>
            <option value="">Select category</option>
            {categories.filter(cat => cat.id !== 'all').map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            Price (KES) *
          </label>
          <input
            type="number"
            placeholder="0"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            Original Price (KES)
          </label>
          <input
            type="number"
            placeholder="0"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            Stock Quantity *
          </label>
          <input
            type="number"
            placeholder="0"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            Description
          </label>
          <textarea
            placeholder="Enter product description"
            rows="3"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            Product Image
          </label>
          <div style={{
            border: '2px dashed #d1d5db',
            borderRadius: '8px',
            padding: '24px',
            textAlign: 'center',
            backgroundColor: '#f9fafb'
          }}>
            <p style={{ margin: '0 0 8px 0', color: '#6b7280' }}>Drag and drop image here or</p>
            <button type="button" style={{
              backgroundColor: '#f97316',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              Choose File
            </button>
          </div>
        </div>

        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => setShowAddForm(false)}
            style={{
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              backgroundColor: '#f97316',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  )

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 4px 0' }}>
              Products Management
            </h1>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Manage your safety equipment catalog
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              backgroundColor: '#f97316',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            + Add New Product
          </button>
        </div>

        {/* Add Product Form */}
        {showAddForm && <AddProductForm />}

        {/* Filters and Search */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Search */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  minWidth: '180px'
                }}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              {filteredProducts.length} products found
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Product
                  </th>
                  <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    SKU
                  </th>
                  <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Category
                  </th>
                  <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Price
                  </th>
                  <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Stock
                  </th>
                  <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Status
                  </th>
                  <th style={{ textAlign: 'center', padding: '16px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => {
                  const statusStyle = getStatusColor(product.status)
                  return (
                    <tr key={product.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{
                              width: '60px',
                              height: '60px',
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                          />
                          <div>
                            <h4 style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#0f172a',
                              margin: '0 0 4px 0'
                            }}>
                              {product.name}
                            </h4>
                            <p style={{
                              fontSize: '12px',
                              color: '#6b7280',
                              margin: 0,
                              maxWidth: '200px'
                            }}>
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#374151', fontFamily: 'monospace' }}>
                        {product.sku}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#374151', textTransform: 'capitalize' }}>
                        {product.category.replace('-', ' ')}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span style={{
                              fontSize: '12px',
                              color: '#9ca3af',
                              textDecoration: 'line-through',
                              marginLeft: '8px'
                            }}>
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: product.stock <= 10 ? '#ef4444' : '#0f172a'
                        }}>
                          {product.stock}
                        </span>
                        {product.stock <= 10 && product.stock > 0 && (
                          <span style={{
                            fontSize: '12px',
                            color: '#ef4444',
                            display: 'block'
                          }}>
                            Low stock
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {product.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button style={{
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}>
                            Edit
                          </button>
                          <button style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '18px', color: '#374151', marginBottom: '8px' }}>
                No products found
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start by adding your first product'
                }
              </p>
              {!searchQuery && selectedCategory === 'all' && (
                <button
                  onClick={() => setShowAddForm(true)}
                  style={{
                    backgroundColor: '#f97316',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Add Your First Product
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {filteredProducts.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            marginTop: '24px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
              Bulk Actions
            </h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button style={{
                backgroundColor: '#22c55e',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                Export Products
              </button>
              <button style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                Import Products
              </button>
              <button style={{
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                Update Prices
              </button>
              <button style={{
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                Manage Categories
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminProducts