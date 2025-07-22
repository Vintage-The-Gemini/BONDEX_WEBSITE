// frontend/src/pages/admin/CreateProduct.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  AlertCircle,
  Package,
  DollarSign,
  Tag,
  FileText,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  Loader
} from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    product_name: '',
    product_description: '',
    product_brand: '',
    category: '',
    product_price: '',
    stock: '',
    status: 'active',
    isOnSale: false,
    isFeatured: false,
    salePrice: '',
    saleEndDate: '',
    metaTitle: '',
    metaDescription: '',
    tags: [],
    lowStockThreshold: '10',
    specifications: {
      weight: '',
      dimensions: '',
      material: '',
      certification: '',
      warranty: ''
    }
  });
  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
  const navigate = useNavigate();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCategories(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('specifications.')) {
      const specKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear errors when user starts typing
    if (error) setError('');
  };

  // Handle boolean toggles
  const handleToggle = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Add tag
  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim().toLowerCase()]
      }));
      setCurrentTag('');
    }
  };

  // Remove tag
  const removeTag = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Auto-generate meta fields
  const generateMetaFields = () => {
    if (formData.product_name && !formData.metaTitle) {
      setFormData(prev => ({
        ...prev,
        metaTitle: prev.product_name.length > 60 
          ? prev.product_name.substring(0, 57) + '...' 
          : prev.product_name
      }));
    }
    
    if (formData.product_description && !formData.metaDescription) {
      setFormData(prev => ({
        ...prev,
        metaDescription: prev.product_description.length > 155 
          ? prev.product_description.substring(0, 155) + '...' 
          : `Buy ${prev.product_name} from Bondex Safety. High-quality safety equipment for professionals.`
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = [];
    
    if (!formData.product_name.trim()) errors.push('Product name is required');
    if (!formData.product_description.trim()) errors.push('Product description is required');
    if (!formData.category) errors.push('Category is required');
    if (!formData.product_price || parseFloat(formData.product_price) <= 0) errors.push('Valid price is required');
    if (!formData.stock || parseInt(formData.stock) < 0) errors.push('Valid stock quantity is required');
    if (images.length === 0) errors.push('At least one product image is required');
    
    if (formData.isOnSale) {
      if (!formData.salePrice || parseFloat(formData.salePrice) <= 0) {
        errors.push('Sale price is required when product is on sale');
      } else if (parseFloat(formData.salePrice) >= parseFloat(formData.product_price)) {
        errors.push('Sale price must be less than regular price');
      }
    }
    
    return errors;
  };

  // Calculate price in KES
  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? 'KES 0' : `KES ${numPrice.toLocaleString()}`;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setError('Please log in as admin');
        navigate('/admin/login');
        return;
      }
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Append form fields
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'specifications') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Append images
      images.forEach((image, index) => {
        formDataToSend.append('images', image);
      });
      
      console.log('Submitting product with', images.length, 'images');
      
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSuccess('Product created successfully!');
        console.log('✅ Product created:', data.data);
        
        // Navigate after showing success message
        setTimeout(() => {
          navigate('/admin/products');
        }, 2000);
      } else {
        console.error('❌ Product creation failed:', data);
        setError(data.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setError('Failed to create product. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Save as draft
  const handleSaveDraft = async () => {
    const draftData = { ...formData, status: 'draft' };
    setFormData(draftData);
    
    // Trigger form submission with draft status
    setTimeout(() => {
      document.getElementById('product-form').requestSubmit();
    }, 100);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    generateMetaFields();
  }, [formData.product_name, formData.product_description]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
            <p className="text-gray-600 mt-1">Add a new safety equipment product to your inventory</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            <Eye size={16} />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <CheckCircle size={20} />
          <span className="font-medium">{success}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <AlertCircle size={20} />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Package size={20} />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="product_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="product_name"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter product name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="product_brand" className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    id="product_brand"
                    name="product_brand"
                    value={formData.product_brand}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter brand name"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="product_description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="product_description"
                    name="product_description"
                    value={formData.product_description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter detailed product description"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <DollarSign size={20} />
                Pricing & Inventory
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="product_price" className="block text-sm font-medium text-gray-700 mb-2">
                    Regular Price (KES) *
                  </label>
                  <input
                    type="number"
                    id="product_price"
                    name="product_price"
                    value={formData.product_price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                  {formData.product_price && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formatPrice(formData.product_price)}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="0"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700 mb-2">
                    Low Stock Alert
                  </label>
                  <input
                    type="number"
                    id="lowStockThreshold"
                    name="lowStockThreshold"
                    value={formData.lowStockThreshold}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="10"
                  />
                </div>
              </div>
              
              {/* Sale Section */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-gray-700">
                    Put this product on sale
                  </label>
                  <button
                    type="button"
                    onClick={() => handleToggle('isOnSale')}
                    className="flex items-center"
                  >
                    {formData.isOnSale ? (
                      <ToggleRight size={24} className="text-yellow-500" />
                    ) : (
                      <ToggleLeft size={24} className="text-gray-400" />
                    )}
                  </button>
                </div>
                
                {formData.isOnSale && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 mb-2">
                        Sale Price (KES) *
                      </label>
                      <input
                        type="number"
                        id="salePrice"
                        name="salePrice"
                        value={formData.salePrice}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                      {formData.salePrice && (
                        <p className="text-sm text-green-600 mt-1">
                          {formatPrice(formData.salePrice)}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="saleEndDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Sale End Date
                      </label>
                      <input
                        type="date"
                        id="saleEndDate"
                        name="saleEndDate"
                        value={formData.saleEndDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <ImageUpload
                images={images}
                setImages={setImages}
                imagePreviews={imagePreviews}
                setImagePreviews={setImagePreviews}
                maxImages={5}
                maxSizePerImage={5}
                title="Product Images"
                subtitle="Upload high-quality images of your safety equipment product"
              />
            </div>

            {/* Product Specifications */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText size={20} />
                Product Specifications
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="specifications.weight" className="block text-sm font-medium text-gray-700 mb-2">
                    Weight
                  </label>
                  <input
                    type="text"
                    id="specifications.weight"
                    name="specifications.weight"
                    value={formData.specifications.weight}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="e.g., 500g, 1.2kg"
                  />
                </div>
                
                <div>
                  <label htmlFor="specifications.dimensions" className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    id="specifications.dimensions"
                    name="specifications.dimensions"
                    value={formData.specifications.dimensions}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="e.g., 25cm x 15cm x 10cm"
                  />
                </div>
                
                <div>
                  <label htmlFor="specifications.material" className="block text-sm font-medium text-gray-700 mb-2">
                    Material
                  </label>
                  <input
                    type="text"
                    id="specifications.material"
                    name="specifications.material"
                    value={formData.specifications.material}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="e.g., Polycarbonate, Steel, Leather"
                  />
                </div>
                
                <div>
                  <label htmlFor="specifications.certification" className="block text-sm font-medium text-gray-700 mb-2">
                    Certification
                  </label>
                  <input
                    type="text"
                    id="specifications.certification"
                    name="specifications.certification"
                    value={formData.specifications.certification}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="e.g., CE, ANSI Z87.1, EN 166"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="specifications.warranty" className="block text-sm font-medium text-gray-700 mb-2">
                    Warranty
                  </label>
                  <input
                    type="text"
                    id="specifications.warranty"
                    name="specifications.warranty"
                    value={formData.specifications.warranty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="e.g., 1 year manufacturer warranty"
                  />
                </div>
              </div>
            </div>

            {/* Tags & SEO */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Tag size={20} />
                Tags & SEO
              </h2>
              
              {/* Tags */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Tags
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Add tags for better searchability"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 font-medium"
                  >
                    Add
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* SEO Fields */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title (SEO)
                  </label>
                  <input
                    type="text"
                    id="metaTitle"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleInputChange}
                    maxLength={60}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Auto-generated from product name"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.metaTitle.length}/60 characters
                  </p>
                </div>
                
                <div>
                  <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description (SEO)
                  </label>
                  <textarea
                    id="metaDescription"
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    maxLength={160}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Auto-generated from product description"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.metaDescription.length}/160 characters
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publish</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Featured Product
                  </label>
                  <button
                    type="button"
                    onClick={() => handleToggle('isFeatured')}
                    className="flex items-center"
                  >
                    {formData.isFeatured ? (
                      <ToggleRight size={24} className="text-yellow-500" />
                    ) : (
                      <ToggleLeft size={24} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={loading}
                  className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Save as Draft
                </button>
                
                <button
                  type="submit"
                  disabled={loading || images.length === 0}
                  className="w-full px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Create Product
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Product Preview */}
            {showPreview && formData.product_name && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                
                <div className="space-y-3">
                  {imagePreviews.length > 0 && (
                    <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={imagePreviews[0].url}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-gray-900">{formData.product_name}</h4>
                    {formData.product_brand && (
                      <p className="text-sm text-gray-600">by {formData.product_brand}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {formData.isOnSale && formData.salePrice ? (
                      <>
                        <span className="text-lg font-bold text-green-600">
                          {formatPrice(formData.salePrice)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(formData.product_price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(formData.product_price)}
                      </span>
                    )}
                  </div>
                  
                  {formData.product_description && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {formData.product_description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      parseInt(formData.stock) > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {parseInt(formData.stock) > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                    
                    {formData.isFeatured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        Featured
                      </span>
                    )}
                    
                    {formData.isOnSale && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                        On Sale
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;