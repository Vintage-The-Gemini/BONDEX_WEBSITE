// frontend/src/pages/admin/CreateProduct.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import {
  ArrowLeft,
  Upload,
  X,
  Save,
  Eye,
  EyeOff,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  Package,
  DollarSign,
  Tag,
  FileText,
  Settings,
  Sparkles
} from 'lucide-react';

const CreateProduct = () => {
  const navigate = useNavigate();
  const { categories, loadCategories, formatCurrency } = useAdmin();

  // Form state
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
    lowStockThreshold: '10'
  });

  // Images state
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  // Features and specifications state
  const [features, setFeatures] = useState(['']);
  const [specifications, setSpecifications] = useState([{ key: '', value: '' }]);
  const [tags, setTags] = useState(['']);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Form validation
  const validateForm = () => {
    const errors = [];
    
    if (!formData.product_name.trim()) errors.push('Product name is required');
    if (!formData.product_description.trim()) errors.push('Product description is required');
    if (!formData.product_brand.trim()) errors.push('Product brand is required');
    if (!formData.category) errors.push('Category is required');
    if (!formData.product_price || parseFloat(formData.product_price) <= 0) errors.push('Valid price is required');
    if (formData.stock === '' || parseInt(formData.stock) < 0) errors.push('Valid stock quantity is required');
    if (images.length === 0) errors.push('At least one product image is required');
    
    if (formData.isOnSale) {
      if (!formData.salePrice || parseFloat(formData.salePrice) <= 0) {
        errors.push('Sale price is required when product is on sale');
      }
      if (parseFloat(formData.salePrice) >= parseFloat(formData.product_price)) {
        errors.push('Sale price must be less than regular price');
      }
    }
    
    return errors;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setError('Please upload only JPEG, PNG, or WebP images');
      return;
    }
    
    // Check file sizes (max 5MB each)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('Each image must be less than 5MB');
      return;
    }

    // Add to images array
    setImages(prev => [...prev, ...files]);
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, {
          file,
          url: e.target.result,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
    
    // Clear any existing errors
    setError('');
  };

  // Remove image
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Handle features
  const addFeature = () => {
    setFeatures(prev => [...prev, '']);
  };

  const updateFeature = (index, value) => {
    setFeatures(prev => prev.map((feature, i) => i === index ? value : feature));
  };

  const removeFeature = (index) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  // Handle specifications
  const addSpecification = () => {
    setSpecifications(prev => [...prev, { key: '', value: '' }]);
  };

  const updateSpecification = (index, field, value) => {
    setSpecifications(prev => prev.map((spec, i) => 
      i === index ? { ...spec, [field]: value } : spec
    ));
  };

  const removeSpecification = (index) => {
    setSpecifications(prev => prev.filter((_, i) => i !== index));
  };

  // Handle tags
  const addTag = () => {
    setTags(prev => [...prev, '']);
  };

  const updateTag = (index, value) => {
    setTags(prev => prev.map((tag, i) => i === index ? value : tag));
  };

  const removeTag = (index) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };

  // Format price display
  const formatPrice = (price) => {
    if (!price) return 'KES 0';
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? 'KES 0' : `KES ${numPrice.toLocaleString()}`;
  };

  // Submit form - FIXED with proper error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      console.log('🔄 Creating product with data:', formData);
      console.log('📸 Submitting with', images.length, 'images');
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Append basic form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Append features (filter out empty ones)
      const validFeatures = features.filter(f => f.trim() !== '');
      if (validFeatures.length > 0) {
        formDataToSend.append('features', JSON.stringify(validFeatures));
      }
      
      // Append specifications (filter out empty ones)
      const validSpecs = specifications.filter(s => s.key.trim() !== '' && s.value.trim() !== '');
      if (validSpecs.length > 0) {
        const specsObject = {};
        validSpecs.forEach(spec => {
          specsObject[spec.key.trim()] = spec.value.trim();
        });
        formDataToSend.append('specifications', JSON.stringify(specsObject));
      }
      
      // Append tags (filter out empty ones)
      const validTags = tags.filter(t => t.trim() !== '');
      if (validTags.length > 0) {
        formDataToSend.append('keywords', JSON.stringify(validTags));
      }
      
      // Append images
      images.forEach((image, index) => {
        formDataToSend.append('images', image);
      });
      
      // Debug: Log FormData contents
      console.log('📦 FormData contents:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], typeof pair[1] === 'object' ? 'File' : pair[1]);
      }
      
      // Make API call with proper error handling
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          // Don't set Content-Type for FormData - browser sets it with boundary
        },
        body: formDataToSend
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('📦 Response data:', data);
      
      if (response.ok && data.success) {
        setSuccess('Product created successfully!');
        console.log('✅ Product created:', data.data);
        
        // Navigate after showing success message
        setTimeout(() => {
          navigate('/admin/products');
        }, 2000);
      } else {
        console.error('❌ Product creation failed:', data);
        setError(data.message || data.error || 'Failed to create product');
        
        // Show detailed errors if available
        if (data.errors && Array.isArray(data.errors)) {
          setError(data.errors.join(', '));
        }
      }
    } catch (error) {
      console.error('❌ Error creating product:', error);
      setError('Failed to create product. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate meta fields
  const generateMetaFields = () => {
    if (formData.product_name && !formData.metaTitle) {
      setFormData(prev => ({
        ...prev,
        metaTitle: formData.product_name
      }));
    }
    
    if (formData.product_description && !formData.metaDescription) {
      const description = formData.product_description.substring(0, 160);
      setFormData(prev => ({
        ...prev,
        metaDescription: description
      }));
    }
  };

  // Save as draft
  const handleSaveDraft = async () => {
    const draftData = { ...formData, status: 'draft' };
    setFormData(draftData);
    
    // Trigger form submission with draft status
    setTimeout(() => {
      const form = document.getElementById('product-form');
      if (form) {
        form.requestSubmit();
      }
    }, 100);
  };

  useEffect(() => {
    loadCategories();
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
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800">{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Safety Helmet Premium"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <input
                type="text"
                name="product_brand"
                value={formData.product_brand}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., SafetyFirst"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Description *
            </label>
            <textarea
              name="product_description"
              value={formData.product_description}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Detailed description of the safety equipment..."
              required
            />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Pricing & Inventory
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Regular Price (KES) *
              </label>
              <input
                type="number"
                name="product_price"
                value={formData.product_price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2500"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {formatPrice(formData.product_price)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Low Stock Threshold
              </label>
              <input
                type="number"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleInputChange}
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Sale Options */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isOnSale"
                  checked={formData.isOnSale}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Product is on sale</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Featured product</span>
              </label>
            </div>

            {formData.isOnSale && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sale Price (KES) *
                  </label>
                  <input
                    type="number"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1999"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formatPrice(formData.salePrice)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sale End Date
                  </label>
                  <input
                    type="date"
                    name="saleEndDate"
                    value={formData.saleEndDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-purple-600" />
            Product Images *
          </h2>
          
          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images (Required)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">Click to upload images</p>
                <p className="text-sm text-gray-500">
                  JPEG, PNG, or WebP files up to 5MB each
                </p>
              </label>
            </div>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Main
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            Product Specifications
          </h2>
          
          {specifications.map((spec, index) => (
            <div key={index} className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                value={spec.key}
                onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Material"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., High-density polyethylene"
                />
                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Minus size={16} />
                </button>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addSpecification}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus size={16} />
            Add Specification
          </button>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Tag className="h-5 w-5 text-orange-600" />
            Product Tags & Keywords
          </h2>
          
          {tags.map((tag, index) => (
            <div key={index} className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={tag}
                onChange={(e) => updateTag(index, e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., construction, safety, helmet"
              />
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Minus size={16} />
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addTag}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus size={16} />
            Add Tag
          </button>
        </div>

        {/* SEO Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            SEO Settings
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Auto-generated from product name"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.metaTitle.length}/60 characters (recommended)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Auto-generated from product description"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.metaDescription.length}/160 characters (recommended)
              </p>
            </div>
          </div>
        </div>

        {/* Product Preview */}
        {showPreview && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-600" />
              Product Preview
            </h2>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Images Preview */}
                <div>
                  {imagePreviews.length > 0 ? (
                    <div className="space-y-4">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={imagePreviews[0].url}
                          alt="Main product preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {imagePreviews.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                          {imagePreviews.slice(1, 5).map((preview, index) => (
                            <div key={index} className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                              <img
                                src={preview.url}
                                alt={`Preview ${index + 2}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Product Info Preview */}
                <div className="space-y-4">
                  <div className="text-sm text-gray-500">{formData.product_brand}</div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {formData.product_name || 'Product Name'}
                  </h1>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-blue-600">
                      {formatPrice(formData.product_price)}
                    </span>
                    {formData.isOnSale && formData.salePrice && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(formData.salePrice)}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600">
                    {formData.product_description || 'Product description will appear here...'}
                  </p>

                  {/* Features Preview */}
                  {features.filter(f => f.trim()).length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Key Features</h3>
                      <ul className="space-y-1">
                        {features.filter(f => f.trim()).map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-600 mt-1">✓</span>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Specifications Preview */}
                  {specifications.filter(s => s.key.trim() && s.value.trim()).length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Specifications</h3>
                      <div className="space-y-2">
                        {specifications.filter(s => s.key.trim() && s.value.trim()).map((spec, index) => (
                          <div key={index} className="flex justify-between py-1 border-b border-gray-100">
                            <span className="text-gray-600">{spec.key}</span>
                            <span className="text-gray-900 font-medium">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stock Status Preview */}
                  <div className="flex items-center gap-2">
                    {formData.stock > 0 ? (
                      <>
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-green-600 font-medium">
                          In Stock ({formData.stock} available)
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span className="text-red-600 font-medium">Out of Stock</span>
                      </>
                    )}
                  </div>

                  {/* Tags Preview */}
                  {tags.filter(t => t.trim()).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.filter(t => t.trim()).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Creating Product...
              </>
            ) : (
              <>
                <Save size={16} />
                Create Product
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;