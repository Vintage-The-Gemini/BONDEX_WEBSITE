// File Path: frontend/src/components/admin/AddProductForm.jsx
import React, { useState } from 'react'
import { useToast } from '../ui/Toast'

const AddProductForm = ({ onClose, onSuccess, categories }) => {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('basic')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    product_name: '',
    product_description: '',
    product_price: '',
    category: '', // 🔧 FIXED: Changed from 'primaryCategory' to 'category'
    industries: [], // 🔧 FIXED: Changed from 'secondaryCategories' to 'industries'
    stock: '',
    sku: '',
    product_brand: '',
    status: 'active'
  })
  
  const [seoData, setSeoData] = useState({
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    slug: ''
  })
  
  const [images, setImages] = useState([])
  const [imageFiles, setImageFiles] = useState([])

  // Separate categories by type
  const protectionTypes = categories.filter(cat => cat.type === 'protection_type')
  const industriesList = categories.filter(cat => cat.type === 'industry')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const updated = { ...prev, [name]: value }
      
      // 🔧 FIX: AUTO-GENERATE ALL SEO - No thinking required!
      if (name === 'product_name' && value) {
        const slug = value.toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .trim()
        
        // Smart title generation - max 30 chars to be EXTRA safe
        const metaTitle = value.length > 20 
          ? `${value.substring(0, 20)}... - Bondex`
          : `${value} - Bondex`
        
        const metaDescription = `${value} from Bondex Safety Kenya. Professional safety equipment for workplace protection. KES pricing available. Shop now!`
        
        // Auto-generate keywords from product name
        const keywords = [
          value.toLowerCase(),
          'safety equipment',
          'PPE Kenya',
          'workplace safety',
          'Bondex Safety'
        ].join(', ')
        
        // ALWAYS override SEO - don't preserve old values
        setSeoData({
          slug,
          metaTitle,
          metaDescription,
          keywords
        })
      }
      
      return updated
    })
    if (error) setError('')
  }

  const handleSEOChange = (field, value) => {
    setSeoData(prev => ({ ...prev, [field]: value }))
  }

  const handleSecondaryCategories = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      industries: prev.industries.includes(categoryId) // 🔧 FIXED: Changed to 'industries'
        ? prev.industries.filter(id => id !== categoryId)
        : [...prev.industries, categoryId]
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const invalidFiles = files.filter(file => !validTypes.includes(file.type))
    
    if (invalidFiles.length > 0) {
      setError('Only JPEG, PNG, and WebP images are allowed')
      return
    }

    // Validate file sizes (max 5MB each)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setError('Each image must be smaller than 5MB')
      return
    }

    // Limit to 10 images
    if (imageFiles.length + files.length > 10) {
      setError('Maximum 10 images allowed per product')
      return
    }

    // Create preview URLs
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }))

    setImageFiles(prev => [...prev, ...files])
    setImages(prev => [...prev, ...newImages])
    setError('')
  }

  const removeImage = (index) => {
    setImages(prev => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
    setImageFiles(prev => {
      const updated = [...prev]
      updated.splice(index, 1)
      return updated
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('🚀 Submitting product with data:', formData)
      
      // ✅ VALIDATION: Check required fields before sending
      if (!formData.product_name?.trim()) {
        setError('Product name is required')
        return
      }
      
      if (!formData.product_description?.trim()) {
        setError('Product description is required')
        return
      }
      
      if (!formData.category) {
        setError('Primary category (protection type) is required')
        return
      }
      
      if (!formData.product_price || parseFloat(formData.product_price) <= 0) {
        setError('Valid product price is required')
        return
      }

      // 🔧 FIX: Validate images are uploaded
      if (imageFiles.length === 0) {
        setError('At least one product image is required')
        return
      }

      // Create FormData for file upload
      const formDataToSend = new FormData()
      
      // 🔧 FIXED: Add form fields with correct names that match backend expectations
      formDataToSend.append('product_name', formData.product_name.trim())
      formDataToSend.append('product_description', formData.product_description.trim())
      formDataToSend.append('product_price', parseFloat(formData.product_price))
      formDataToSend.append('category', formData.category) // Backend expects 'category'
      formDataToSend.append('industries', JSON.stringify(formData.industries)) // Backend expects 'industries'
      formDataToSend.append('stock', parseInt(formData.stock) || 0)
      formDataToSend.append('lowStockThreshold', 10)
      formDataToSend.append('status', formData.status)
      
      // Optional fields
      if (formData.sku?.trim()) {
        formDataToSend.append('sku', formData.sku.trim())
      }
      if (formData.product_brand?.trim()) {
        formDataToSend.append('product_brand', formData.product_brand.trim())
      }

      // Add SEO data (all auto-generated, no validation needed)
      Object.keys(seoData).forEach(key => {
        if (seoData[key]) {
          if (key === 'keywords') {
            formDataToSend.append(key, seoData[key]) // Send as string, not JSON
          } else {
            formDataToSend.append(key, seoData[key])
          }
        }
      })

      // Add images
      imageFiles.forEach((file) => {
        formDataToSend.append('images', file)
      })

      console.log('📦 FormData being sent:')
      for (let pair of formDataToSend.entries()) {
        console.log(`${pair[0]}:`, pair[1])
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bondex_admin_token')}`
        },
        body: formDataToSend
      })

      const result = await response.json()
      console.log('📥 Server response:', result)
      
      if (result.success) {
        toast.success('🎉 Product added successfully!', 5000)
        onSuccess()
        onClose()
      } else {
        setError(result.message || 'Failed to add product')
        toast.error('❌ ' + (result.message || 'Failed to add product'))
        console.error('❌ Server error:', result)
      }
    } catch (err) {
      console.error('❌ Failed to add product:', err)
      const errorMessage = 'Failed to add product. Please try again.'
      setError(errorMessage)
      toast.error('❌ ' + errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'basic', name: 'Basic Info', icon: '📝' },
    { id: 'images', name: 'Images', icon: '📸' },
    { id: 'seo', name: 'SEO', icon: '🔍' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-orange-500 text-orange-600 bg-orange-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
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
                      placeholder="e.g., Safety Helmet with Chin Strap"
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
                      placeholder="e.g., SH-001-WHT"
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
                      placeholder="0.00"
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
                      placeholder="0"
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
                      placeholder="e.g., Delta Plus, Safety Jogger"
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
                    placeholder="Detailed product description, features, specifications..."
                  />
                </div>

                {/* Categories */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Categories</h4>
                  
                  {/* Primary Category */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Category (Protection Type) *</label>
                    <select
                      name="category" // 🔧 FIXED: Changed from 'primaryCategory' to 'category'
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
                            checked={formData.industries.includes(category._id)} // 🔧 FIXED: Changed to 'industries'
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
              </div>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Images *
                    <span className="text-red-500 text-xs ml-1">(At least 1 required)</span>
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload up to 10 images (JPEG, PNG, WebP). Max 5MB each. First image will be the main product image.
                  </p>
                </div>

                {/* Image Preview */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.preview}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SEO Tab - AUTO-GENERATED */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-700 text-sm">
                    ✅ SEO automatically generated! No manual input needed.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title (Auto-Generated)</label>
                    <input
                      type="text"
                      value={seoData.metaTitle}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      placeholder="Will auto-generate when you enter product name"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      ✅ Optimized length: {seoData.metaTitle.length} characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description (Auto-Generated)</label>
                    <textarea
                      value={seoData.metaDescription}
                      readOnly
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      placeholder="Will auto-generate when you enter product name"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      ✅ Optimized length: {seoData.metaDescription.length} characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Keywords (Auto-Generated)</label>
                    <input
                      type="text"
                      value={seoData.keywords}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      placeholder="Will auto-generate when you enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug (Auto-Generated)</label>
                    <input
                      type="text"
                      value={seoData.slug}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      placeholder="Will auto-generate when you enter product name"
                    />
                  </div>

                  {/* SEO Preview */}
                  <div className="border-t pt-6">
                    <h5 className="text-md font-medium text-gray-900 mb-4">🔍 Google Search Preview</h5>
                    
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                        {seoData.metaTitle || 'Product Title - Bondex Safety'}
                      </div>
                      <div className="text-green-700 text-sm mt-1">
                        bondexsafety.com/products/{seoData.slug || 'product-name'}
                      </div>
                      <div className="text-gray-600 text-sm mt-2">
                        {seoData.metaDescription || 'Product description will appear here...'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-between items-center pt-6 mt-6 border-t">
              <div className="text-sm text-gray-500">
                {activeTab === 'basic' && 'Fill in product details'}
                {activeTab === 'images' && 'Upload product images'}
                {activeTab === 'seo' && 'Optimize for search engines'}
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
                  {loading ? 'Adding Product...' : 'Add Product'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddProductForm