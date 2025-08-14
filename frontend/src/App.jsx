// File Path: frontend/src/App.jsx

import React, { createContext, useContext, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'

// Auth Context
const AuthContext = createContext()

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// API Client
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// Auth Provider
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('bondex_admin_token')
    const userData = localStorage.getItem('bondex_admin_user')
    
    if (token && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
      apiClient.defaults.headers.Authorization = `Bearer ${token}`
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const response = await apiClient.post('/admin/login', credentials)
      const { token, data } = response.data
      
      localStorage.setItem('bondex_admin_token', token)
      localStorage.setItem('bondex_admin_user', JSON.stringify(data.user))
      apiClient.defaults.headers.Authorization = `Bearer ${token}`
      
      setIsAuthenticated(true)
      setUser(data.user)
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' }
    }
  }

  const logout = () => {
    localStorage.removeItem('bondex_admin_token')
    localStorage.removeItem('bondex_admin_user')
    delete apiClient.defaults.headers.Authorization
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Loading Spinner
const LoadingSpinner = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid #e5e7eb',
      borderTop: '4px solid #f97316',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <style dangerouslySetInnerHTML={{
      __html: `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`
    }} />
  </div>
)

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) return <LoadingSpinner />
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />
}

// Homepage
const HomePage = () => (
  <div style={{
    backgroundColor: '#0f172a',
    color: 'white',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '20px'
  }}>
    <div>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>
        Bondex Safety
      </h1>
      <p style={{ fontSize: '20px', marginBottom: '32px', opacity: 0.9 }}>
        Professional Safety Equipment for Kenya
      </p>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="/products" style={{ textDecoration: 'none' }}>
          <button style={{
            backgroundColor: '#f97316',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            View Products
          </button>
        </a>
        <a href="/admin/login" style={{ textDecoration: 'none' }}>
          <button style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: '2px solid white',
            padding: '16px 32px',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Admin Login
          </button>
        </a>
      </div>
    </div>
  </div>
)

// Products Page
const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/products')
        setProducts(response.data.data || response.data.products || [])
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>
            Safety Equipment Catalog
          </h1>
          <a href="/" style={{ color: '#f97316', textDecoration: 'none', fontSize: '16px' }}>
            ← Back to Home
          </a>
        </div>

        {products.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {products.map(product => (
              <div key={product._id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s'
              }}>
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 'bold' }}>
                    {product.name}
                  </h3>
                  <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '14px' }}>
                    {product.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#f97316' }}>
                      KSh {product.price?.toLocaleString()}
                    </span>
                    <button style={{
                      backgroundColor: '#f97316',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <h3>No products available</h3>
            <p style={{ color: '#6b7280' }}>Check back later for our safety equipment catalog.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Admin Login
const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, isAuthenticated } = useAuth()

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(formData)
    if (!result.success) {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{
          backgroundColor: '#0f172a',
          color: 'white',
          padding: '40px 30px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
            Bondex Safety
          </h1>
          <p style={{ fontSize: '16px', opacity: 0.8, margin: 0 }}>
            Admin Dashboard
          </p>
        </div>

        <div style={{ padding: '40px 30px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="admin@bondexsafety.co.ke"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '20px'
              }}>
                <p style={{ fontSize: '14px', color: '#dc2626', margin: 0 }}>
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: loading ? '#9ca3af' : '#f97316',
                color: 'white',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{
            textAlign: 'center',
            marginTop: '30px',
            paddingTop: '30px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <a href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}>
              ← Back to Bondex Safety
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// Admin Dashboard
const AdminDashboard = () => {
  const { logout, user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/admin/dashboard')
        setStats(response.data.data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#0f172a',
        color: 'white',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
              Bondex Safety Admin
            </h1>
            <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>
              Welcome back, {user?.name || 'Admin'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <a href="/admin/products" style={{ color: 'white', textDecoration: 'none' }}>
              Products
            </a>
            <button
              onClick={logout}
              style={{
                backgroundColor: '#f97316',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #f97316',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p>Loading dashboard...</p>
          </div>
        ) : (
          <div>
            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px',
              marginBottom: '40px'
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>
                  Total Products
                </h3>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                  {stats?.totalProducts || '0'}
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>
                  Total Orders
                </h3>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                  {stats?.totalOrders || '0'}
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>
                  Monthly Revenue
                </h3>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                  KSh {stats?.monthlyRevenue?.toLocaleString() || '0'}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
                Quick Actions
              </h2>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <a href="/admin/products" style={{ textDecoration: 'none' }}>
                  <button style={{
                    backgroundColor: '#f97316',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Manage Products
                  </button>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Admin Products
const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/admin/products')
      setProducts(response.data.data?.products || response.data.products || [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/categories')
      setCategories(response.data.data || response.data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      await apiClient.delete(`/admin/products/${productId}`)
      setProducts(products.filter(p => p._id !== productId))
      alert('Product deleted successfully!')
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Failed to delete product')
    }
  }

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>
            Products Management
          </h1>
          <div style={{ display: 'flex', gap: '16px' }}>
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
              + Add Product
            </button>
            <a href="/admin/dashboard" style={{ color: '#f97316', textDecoration: 'none', padding: '12px' }}>
              ← Dashboard
            </a>
          </div>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <AddProductForm 
            onClose={() => setShowAddForm(false)}
            onSuccess={() => {
              setShowAddForm(false)
              fetchProducts()
            }}
            categories={categories}
          />
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            padding: '24px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
              All Products ({products.length})
            </h2>

            {products.length > 0 ? (
              <div style={{ display: 'grid', gap: '16px' }}>
                {products.map(product => (
                  <div key={product._id} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                      )}
                      <div>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
                          {product.name}
                        </h3>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                          KSh {product.price?.toLocaleString()} • Stock: {product.stock || 0}
                        </p>
                        {product.sku && (
                          <p style={{ margin: '4px 0 0 0', color: '#9ca3af', fontSize: '12px' }}>
                            SKU: {product.sku}
                          </p>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}>
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product._id)}
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <h3>No products found</h3>
                <p style={{ color: '#6b7280', marginBottom: '20px' }}>Add your first product to get started.</p>
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Add Product Form Component
const AddProductForm = ({ onClose, onSuccess, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    sku: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        status: 'active'
      }

      const response = await apiClient.post('/admin/products', productData)
      
      if (response.data.success) {
        alert('Product added successfully!')
        onSuccess()
      } else {
        setError(response.data.message || 'Failed to add product')
      }
    } catch (error) {
      console.error('Failed to add product:', error)
      setError(error.response?.data?.message || 'Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
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
          onClick={onClose}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#6b7280'
          }}
        >
          ×
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px'
        }}>
          <p style={{ fontSize: '14px', color: '#dc2626', margin: 0 }}>
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '6px' 
            }}>
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Safety Boots Steel Toe"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '6px' 
            }}>
              SKU
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              placeholder="e.g., SB-001"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '6px' 
            }}>
              Price (KES) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0"
              required
              min="0"
              step="0.01"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '6px' 
            }}>
              Stock Quantity *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="0"
              required
              min="0"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '6px' 
            }}>
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151', 
            marginBottom: '6px' 
          }}>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
            rows="4"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? '#9ca3af' : '#f97316',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

// Main App
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute>
              <AdminProducts />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App