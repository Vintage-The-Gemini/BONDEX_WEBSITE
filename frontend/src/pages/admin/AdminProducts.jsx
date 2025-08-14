// File Path: frontend/src/pages/admin/AdminProducts.jsx
import React, { useState, useEffect } from 'react'
import { useToast } from '../../components/ui/Toast'
import AddProductForm from '../../components/admin/AddProductForm'
import EditProductForm from '../../components/admin/EditProductForm'

const AdminProducts = () => {
  const { toast } = useToast()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // API client setup
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    await Promise.all([fetchProducts(), fetchCategories()])
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      console.log('🔍 Fetching admin products...')
      
      const response = await fetch(`${API_BASE_URL}/admin/products`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bondex_admin_token')}`
        }
      })
      
      const result = await response.json()
      console.log('📦 Products response:', result)
      
      if (result.success) {
        setProducts(result.data || [])
      } else {
        console.error('Failed to fetch products:', result.message)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      console.log('📂 Fetching categories...')
      const response = await fetch(`${API_BASE_URL}/categories`)
      const result = await response.json()
      
      if (result.success) {
        setCategories(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price || 0)
  }

  const getStatusBadge = (status, stock) => {
    if (stock === 0) {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
          Out of Stock
        </span>
      )
    }
    if (stock < 10) {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
          Low Stock
        </span>
      )
    }
    if (status === 'active') {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
          Active
        </span>
      )
    }
    return (
      <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
        Inactive
      </span>
    )
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setShowEditForm(true)
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    
    try {
      console.log('🗑️ Deleting product:', productId)
      
      const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bondex_admin_token')}`
        }
      })
      
      const result = await response.json()
      
      if (result.success) {
        setProducts(products.filter(p => p._id !== productId))
        toast.success('🗑️ Product deleted successfully!', 4000)
      } else {
        toast.error('❌ Failed to delete product: ' + result.message)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('❌ Error deleting product')
    }
  }

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.product_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.product_brand?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = filterCategory === 'all' || 
                           product.primaryCategory?._id === filterCategory ||
                           product.allCategories?.includes(filterCategory)
    
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Get product image with fallback
  const getProductImage = (product) => {
    console.log('🖼️ Product images:', product.images)
    
    if (product.images && product.images.length > 0) {
      // Use the first image URL
      return product.images[0].url || product.images[0].web_url
    }
    
    // Fallback images
    return product.mainImage || 
           product.product_image || 
           'https://via.placeholder.com/80/f3f4f6/9ca3af?text=No+Image'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products ({products.length})</h1>
            <p className="text-gray-600 mt-1">Manage your safety equipment catalog</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{products.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Products</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {products.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {products.filter(p => p.stock < 10).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {products.filter(p => p.stock === 0).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl">❌</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Start by adding your first product'
              }
            </p>
            {!searchTerm && filterCategory === 'all' && filterStatus === 'all' && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Add Your First Product
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={getProductImage(product)}
                          alt={product.product_name} 
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                          onError={(e) => {
                            console.log('🖼️ Image failed to load, using placeholder')
                            e.target.src = 'https://via.placeholder.com/80/f3f4f6/9ca3af?text=No+Image'
                          }}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.product_name}</div>
                          <div className="text-sm text-gray-500">
                            SKU: {product.sku || 'N/A'} • Brand: {product.product_brand || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {product.primaryCategory?.icon} {product.primaryCategory?.name || 'Uncategorized'}
                        </span>
                        {product.secondaryCategories && product.secondaryCategories.length > 0 && (
                          <span className="text-xs text-gray-500 mt-1">
                            +{product.secondaryCategories.length} industries
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(product.product_price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`font-medium ${
                        product.stock === 0 ? 'text-red-600' : 
                        product.stock < 10 ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
                        {product.stock || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(product.status, product.stock)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

      {/* Edit Product Form */}
      {showEditForm && editingProduct && (
        <EditProductForm 
          product={editingProduct}
          onClose={() => {
            setShowEditForm(false)
            setEditingProduct(null)
          }}
          onSuccess={() => {
            setShowEditForm(false)
            setEditingProduct(null)
            fetchProducts()
          }}
          categories={categories}
        />
      )}
    </div>
  )
}

export default AdminProducts