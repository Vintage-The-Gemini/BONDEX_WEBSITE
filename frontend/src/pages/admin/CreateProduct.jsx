{/* Form */}
      <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Product Information - DIRECT INPUTS */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Package className="h-6 w-6 text-orange-500" />
            Product Information
            <span className="text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium">
              BASIC INFO
            </span>
          </h2>
          
          <div className="space-y-6">
            
            {/* Product Name & Brand Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Product Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Product Name *
                  <span className="text-xs text-gray-500 ml-2 font-normal">(SEO Important)</span>
                </label>
                <input
                  type="text"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleInputChange}
                  className={`w-full p-4 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium transition-all ${
                    validationErrors.product_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Professional Steel Toe Safety Boots"
                  maxLength={200}
                />
                
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-sm font-medium ${
                    formData.product_name.length < 10 ? 'text-red-500' :
                    formData.product_name.length > 200 ? 'text-red-500' :
                    formData.product_name.length >= 10 && formData.product_name.length <= 160 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {formData.product_name.length}/200 characters
                    {formData.product_name.length < 10 && ' (too short)'}
                  </span>
                  
                  {validationErrors.product_name ? (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {validationErrors.product_name}
                    </p>
                  ) : formData.product_name.length >= 10 && (
                    <p className="text-green-500 text-sm flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Good length
                    </p>
                  )}
                </div>
              </div>

              {/* Product Brand */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Brand *
                  <span className="text-xs text-gray-500 ml-2 font-normal">(Manufacturer)</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="product_brand"
                    value={formData.product_brand}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium transition-all ${
                      validationErrors.product_brand ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 3M, Honeywell, MSA, DuPont"
                    maxLength={100}
                  />
                </div>
                
                {validationErrors.product_brand && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {validationErrors.product_brand}
                  </p>
                )}
              </div>
            </div>

            {/* Product Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Product Description *
                <span className="text-xs text-gray-500 ml-2 font-normal">(Minimum 50 characters for SEO)</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                <textarea
                  name="product_description"
                  value={formData.product_description}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium resize-none transition-all ${
                    validationErrors.product_description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Detailed description of the safety equipment:
• What protection does it provide?
• What industries/applications is it suitable for?
• Key features and benefits
• Technical specifications
• Certification standards"
                  maxLength={2000}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className={`text-sm font-medium ${
                  formData.product_description.length < 50 ? 'text-red-500' :
                  formData.product_description.length >= 50 && formData.product_description.length <= 300 ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {formData.product_description.length}/2000 characters
                  {formData.product_description.length < 50 && ' (SEO needs 50+)'}
                </span>
                {validationErrors.product_description && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {validationErrors.product_description}
                  </p>
                )}
              </div>
            </div>

            {/* SEO Writing Tips */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                💡 SEO Writing Tips
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-blue-800 text-sm">
                    <span className="font-medium">Product Name:</span> Include main keyword and brand
                  </p>
                  <p className="text-blue-800 text-sm">
                    <span className="font-medium">Description:</span> Start with key benefits
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-blue-800 text-sm">
                    <span className="font-medium">Keywords:</span> Include industry applications
                  </p>
                  <p className="text-blue-800 text-sm">
                    <span className="font-medium">Location:</span> Mention Kenya/Nairobi for local SEO
                  </p>
                </div>
              </div>
            </div>

            {/* Product Name Examples */}
            {!formData.product_name && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">📝 Product Name Examples:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, product_name: 'Professional Steel Toe Safety Boots' }))}
                    className="text-left p-2 bg-white rounded hover:bg-yellow-100 transition-colors"
                  >
                    • Professional Steel Toe Safety Boots
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, product_name: 'Anti-Fog Safety Goggles with UV Protection' }))}
                    className="text-left p-2 bg-white rounded hover:bg-yellow-100 transition-colors"
                  >
                    • Anti-Fog Safety Goggles with UV Protection
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, product_name: 'Cut-Resistant Work Gloves Level 5' }))}
                    className="text-left p-2 bg-white rounded hover:bg-yellow-100 transition-colors"
                  >
                    • Cut-Resistant Work Gloves Level 5
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, product_name: 'N95 Respirator Mask with Valve' }))}
                    className="text-left p-2 bg-white rounded hover:bg-yellow-100 transition-colors"
                  >
                    • N95 Respirator Mask with Valve
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Multi-Category Selection */}
        <MultiCategorySelector
          categories={categories}
          selectedCategory={formData.category}
          selectedIndustries={formData.industries}
          onCategoryChange={(categoryId) => setFormData(prev => ({ ...prev, category: categoryId }))}
          onIndustriesChange={handleIndustriesChange}
          validationErrors={validationErrors}
        />

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-500" />
            Pricing & Inventory
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Price */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Price (KES) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="product_price"
                  value={formData.product_price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
                    validationErrors.product_price ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 6000"
                />
              </div>
              {validationErrors.product_price && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.product_price}
                </p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
                    validationErrors.stock ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 50"
                />
              </div>
              {validationErrors.stock && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.stock}
                </p>
              )}
            </div>

            {/* Low Stock Threshold */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Low Stock Alert
              </label>
              <input
                type="number"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleInputChange}
                min="1"
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="10"
              />
              <p className="text-xs text-gray-500 mt-1">Alert when stock falls below this number</p>
            </div>
          </div>

          {/* Sale Configuration */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                name="isOnSale"
                checked={formData.isOnSale}
                onChange={handleInputChange}
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <label className="text-sm font-bold text-gray-700">
                Product is on sale
              </label>
            </div>
            
            {formData.isOnSale && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sale Price (KES) *
                </label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="e.g., 4500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Additional Product Details */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Additional Details</h2>
          
          <div className="space-y-6">
            
            {/* Features */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Key Features
              </label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-all"
                placeholder="List key features, separated by commas or new lines"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Product Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="safety, boots, steel toe, work boots, kenya"
              />
              <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
            </div>
          </div>
        </div>

        {/* SEO Information */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-500" />
            SEO Information
          </h2>
          
          <div className="space-y-6">
            
            {/* Meta Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Meta Title
              </label>
              <input
                type="text// frontend/src/pages/admin/CreateProduct.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

// Only import components that work properly
import MultiCategorySelector from '../../components/admin/MultiCategorySelector';

import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Target,
  Sparkles,
  Package,
  Building2,
  FileText,
  DollarSign,
  Hash,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

const CreateProduct = () => {
  const navigate = useNavigate();
  const { categories, loadCategories, addNotification } = useAdmin();

  // Simple form state - matching your working version
  const [formData, setFormData] = useState({
    product_name: '',
    product_description: '',
    product_brand: '',
    category: '',
    industries: [],
    product_price: '',
    stock: '',
    lowStockThreshold: '10',
    isOnSale: false,
    salePrice: '',
    isFeatured: false,
    status: 'active',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    features: '',
    specifications: '',
    tags: '',
    certifications: '',
    complianceStandards: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Validation function
  const validateForm = () => {
    const errors = {};
    
    // Basic product info
    if (!formData.product_name.trim()) {
      errors.product_name = 'Product name is required';
    } else if (formData.product_name.length < 3) {
      errors.product_name = 'Product name must be at least 3 characters';
    }
    
    if (!formData.product_description.trim()) {
      errors.product_description = 'Product description is required';
    } else if (formData.product_description.length < 50) {
      errors.product_description = 'Description must be at least 50 characters for SEO';
    }
    
    if (!formData.product_brand.trim()) {
      errors.product_brand = 'Product brand is required';
    }
    
    // Category validation - FIXED
    if (!formData.category) {
      errors.category = 'Protection type selection is required';
    }
    
    if (!formData.industries || formData.industries.length === 0) {
      errors.industries = 'At least one industry/sector must be selected';
    }
    
    // Pricing validation
    if (!formData.product_price || parseFloat(formData.product_price) <= 0) {
      errors.product_price = 'Valid price is required (in KES)';
    }
    
    if (formData.stock === '' || parseInt(formData.stock) < 0) {
      errors.stock = 'Valid stock quantity is required';
    }
    
    // Sale validation
    if (formData.isOnSale) {
      if (!formData.salePrice || parseFloat(formData.salePrice) <= 0) {
        errors.salePrice = 'Sale price is required when product is on sale';
      } else if (parseFloat(formData.salePrice) >= parseFloat(formData.product_price)) {
        errors.salePrice = 'Sale price must be less than regular price';
      }
    }
    
    // Image validation
    if (images.length === 0) {
      errors.images = 'At least one product image is required';
    }
    
    // SEO validation
    if (!formData.metaTitle || formData.metaTitle.length < 30) {
      errors.metaTitle = 'Meta title should be at least 30 characters';
    }
    
    if (!formData.metaDescription || formData.metaDescription.length < 120) {
      errors.metaDescription = 'Meta description should be at least 120 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes - SIMPLE VERSION
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log('Input change:', name, type === 'checkbox' ? checked : value);
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear validation error
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle multiple select for industries
  const handleIndustriesChange = (industries) => {
    setFormData(prev => ({
      ...prev,
      industries: industries
    }));
  };

  // Submit form - FIXED
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the validation errors before submitting');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      console.log('🎯 Creating product with data:', formData);
      
      const response = await fetch(`${API_BASE}/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSuccess('Product created successfully!');
        addNotification('Product created successfully!', 'success');
        setTimeout(() => {
          navigate(`/admin/products/${result.data._id}`);
        }, 1500);
      } else {
        throw new Error(result.message || 'Failed to create product');
      }
      
    } catch (error) {
      console.error('❌ Creation error:', error);
      const errorMessage = error.message || 'Failed to create product. Please check your connection and try again.';
      setError(errorMessage);
      addNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Get protection types and industries
  const protectionTypes = categories.filter(cat => cat.type === 'protection');
  const industries = categories.filter(cat => cat.type === 'industry');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div>
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-orange-500" />
              <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
              <div className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                🎯 MULTI-CATEGORY
              </div>
            </div>
            <p className="text-gray-600 mt-1">
              Add safety equipment with precision multi-category targeting and advanced SEO optimization
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPreview ? 'Hide' : 'Show'} Preview
          </button>
          
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <Package size={16} />
            Save Draft
          </button>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle size={16} />
          {success}
        </div>
      )}

      {/* Form */}
      <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
        
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="SEO-optimized title for search engines"
                maxLength={60}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.metaTitle.length}/60 characters</p>
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-all"
                placeholder="Brief description for search engine results"
                maxLength={160}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.metaDescription.length}/160 characters</p>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Keywords
              </label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="safety boots, steel toe, work boots, kenya"
              />
              <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
            </div>
          </div>
        </div>

        {/* Product Settings */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Product Settings</h2>
          
          <div className="space-y-4">
            
            {/* Status */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              >
                <option value="active">Active - Visible to customers</option>
                <option value="draft">Draft - Hidden from customers</option>
                <option value="inactive">Inactive - Temporarily disabled</option>
              </select>
            </div>

            {/* Featured Product */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Featured Product
              </label>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-3 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 shadow-lg flex items-center gap-2"
          >
            {loading ? (
              <>
                <Save className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Create Product
              </>
            )}
          </button>
        </div>
      </form>

      {/* Product Preview */}
      {showPreview && (
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Product Preview</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <Package className="h-12 w-12 text-gray-400" />
              <span className="ml-2 text-gray-500">No image uploaded</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900">{formData.product_name || 'Product Name'}</h4>
                <p className="text-gray-600">{formData.product_brand || 'Brand'}</p>
              </div>
              
              <div className="text-2xl font-bold text-orange-600">
                KES {formData.product_price ? parseFloat(formData.product_price).toLocaleString() : '0'}
              </div>
              
              <p className="text-gray-700">
                {formData.product_description || 'Product description will appear here...'}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {formData.category && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                    {categories.find(c => c._id === formData.category)?.name || 'Protection Type'}
                  </span>
                )}
                {formData.industries && formData.industries.map((industry, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {categories.find(c => c._id === industry)?.name || industry}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProduct;