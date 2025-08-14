// File Path: frontend/src/components/admin/EditProductForm.jsx
import React, { useState, useEffect } from 'react'
import { useToast } from '../ui/Toast'

const EditProductForm = ({ product, onClose, onSuccess, categories }) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    product_name: '',
    product_description: '',
    product_price: '',
    category: '',
    industries: [],
    stock: '',
    sku: '',
    product_brand: '',
    status: 'active'
  })

  // Separate categories by type
  const protectionTypes = categories.filter(cat => cat.type === 'protection_type')
  const industriesList = categories.filter(cat => cat.type === 'industry')

  // Initialize form with product data
  useEffect(() => {
    if (product) {
      console.log('📝 Initializing edit form with product:', product)
      
      setFormData({
        product_name: product.product_name || '',
        product_description: product.product_description || '',
        product_price: product.product_price || '',
        category: product.primaryCategory?._id || '',
        industries: product.secondaryCategories?.map(cat => cat._id) || [],
        stock: product.stock || '',
        sku: product.sku || '',
        product_brand: product.product_brand || '',
        status: product.status || 'active'
      })
    }
  }, [product])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSecondaryCategories = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      industries: prev.industries.includes(categoryId)
        ? prev.industries.filter(id => id !== categoryId)
        : [...prev.industries, categoryId]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('🔄 Updating product with data:', formData)
      
      // Validation
      if (!formData.product_name?.trim()) {
        setError('Product name is required')
        return
      }
      
      if (!formData.product_description?.trim()) {
        setError('Product description is required')
        return
      }
      
      if (!formData.category) {
        setError('Primary category is required')
        return
      }
      
      if (!formData.product_price || parseFloat(formData.product_price) <= 0) {
        setError('Valid product price is required')
        return
      }

      // Prepare update data
      const updateData = {
        product_name: formData.product_name.trim(),
        product_description: formData.product_description.trim(),
        product_price: parseFloat(formData.product_price),
        category: formData.category,
        industries: JSON.stringify(formData.industries),
        stock: parseInt(formData.stock) || 0,
        sku: formData.sku?.trim() || '',
        product_brand: formData.product_brand?.trim() || '',
        status: formData.status
      }

      console.log('📤 Sending update data:', updateData)

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('bondex_admin_token')}`
        },
        body: JSON.stringify(updateData)
      })

      const result = await response.json()
      console.log('📥 Update response:', result)
      
      if (result.success) {
        toast.success('✅ Product updated successfully!', 4000)
        onSuccess()
        onClose()
      } else {
        const errorMessage = result.message || 'Failed to update product'
        setError(errorMessage)
        toast.error('❌ ' + errorMessage)
      }
    } catch (err) {
      console.error('❌ Failed to update product:', err)
      const errorMessage = 'Failed to update product. Please try again.'
      setError(errorMessage)
      toast.error('❌ ' + errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">Edit Product</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (KES) *</label>
                <input
                  type="number"
                  name="product_price"
                  value={formData.product_price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <input
                  type="text"
                  name="product_brand"
                  value={formData.product_brand}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                name="product_description"
                value={formData.product_description}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Categories */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Categories</h4>
              
              {/* Primary Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Category (Protection Type) *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select Protection Type</option>
                  {protectionTypes.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Secondary Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Categories (Industries/Sectors)</label>
                <p className="text-xs text-gray-500 mb-3">Select all industries where this product is used</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {industriesList.map(category => (
                    <label key={category._id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.industries.includes(category._id)}
                        onChange={() => handleSecondaryCategories(category._id)}
                        className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">
                        {category.icon} {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-between items-center pt-6 mt-6 border-t">
              <div className="text-sm text-gray-500">
                Update product details and categories
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                  {loading ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProductForm