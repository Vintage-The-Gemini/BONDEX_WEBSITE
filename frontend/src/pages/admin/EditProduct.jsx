// frontend/src/pages/admin/EditProduct.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  Save, 
  Eye, 
  AlertCircle,
  Image as ImageIcon,
  DollarSign,
  Package,
  Tag,
  FileText,
  Star,
  ToggleLeft,
  ToggleRight,
  Trash2,
  RefreshCw
} from 'lucide-react';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [originalProduct, setOriginalProduct] = useState(null);
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
    lowStockThreshold: '10'
  });
  
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Fetch product data
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const response = await fetch(`/api/admin/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Product not found');
          setTimeout(() => navigate('/admin/products'), 2000);
          return;
        }
        throw new Error('Failed to fetch product');
      }

      const data = await response.json();
      
      if (data.success) {
        const product = data.data;
        setOriginalProduct(product);
        
        // Set form data
        setFormData({
          product_name: product.product_name || '',
          product_description: product.product_description || '',
          product_brand: product.product_brand || '',
          category: product.category || '',
          product_price: product.product_price || '',
          stock: product.stock || '',
          status: product.status || 'active',
          isOnSale: product.isOnSale || false,
          isFeatured: product.isFeatured || false,
          salePrice: product.salePrice || '',
          saleEndDate: product.saleEndDate ? product.saleEndDate.split('T')[0] : '',
          metaTitle: product.metaTitle || '',
          metaDescription: product.metaDescription || '',
          tags: product.tags || [],
          lowStockThreshold: product.lowStockThreshold || '10'
        });
        
        // Set existing images
        setExistingImages(product.images || []);
      } else {
        setError(data.message || 'Failed to fetch product');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to fetch product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setHasChanges(true);
  };

  // Handle new image upload
  const handleImageUpload = (files) => {
    const fileArray = Array.from(files);
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = fileArray.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setError('Please upload only JPEG, PNG, or WebP images');
      return;
    }
    
    // Validate file sizes (max 5MB each)
    const oversizedFiles = fileArray.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('Each image must be less than 5MB');
      return;
    }
    
    // Check total images (max 5)
    const totalImages = existingImages.length + newImages.length + fileArray.length;
    if (totalImages > 5) {
      setError('Maximum 5 images allowed');
      return;
    }
    
    // Create previews
    const newPreviews = [];
    const newImageFiles = [];
    
    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target.result);
        if (newPreviews.length === fileArray.length) {
          setNewImagePreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
      newImageFiles.push(file);
    });
    
    setNewImages(prev => [...prev, ...newImageFiles]);
    setHasChanges(true);
    setError('');
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  // Remove existing image
  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  // Remove new image
  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  // Handle tag input
  const handleTagInput = (e) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(currentTag.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, currentTag.trim()]
        }));
        setHasChanges(true);
      }
      setCurrentTag('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
    setHasChanges(true);
  };

  // Reset form to original values
  const resetForm = () => {
    if (originalProduct) {
      setFormData({
        product_name: originalProduct.product_name || '',
        product_description: originalProduct.product_description || '',
        product_brand: originalProduct.product_brand || '',
        category: originalProduct.category || '',
        product_price: originalProduct.product_price || '',
        stock: originalProduct.stock || '',
        status: originalProduct.status || 'active',
        isOnSale: originalProduct.isOnSale || false,
        isFeatured: originalProduct.isFeatured || false,
        salePrice: originalProduct.salePrice || '',
        saleEndDate: originalProduct.saleEndDate ? originalProduct.saleEndDate.split('T')[0] : '',
        metaTitle: originalProduct.metaTitle || '',
        metaDescription: originalProduct.metaDescription || '',
        tags: originalProduct.tags || [],
        lowStockThreshold: originalProduct.lowStockThreshold || '10'
      });
      setExistingImages(originalProduct.images || []);
      setNewImages([]);
      setNewImagePreviews([]);
      setHasChanges(false);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = [];
    
    if (!formData.product_name.trim()) errors.push('Product name is required');
    if (!formData.product_description.trim()) errors.push('Product description is required');
    if (!formData.category) errors.push('Category is required');
    if (!formData.product_price || formData.product_price <= 0) errors.push('Valid price is required');
    if (!formData.stock || formData.stock < 0) errors.push('Valid stock quantity is required');
    
    const totalImages = existingImages.length + newImages.length;
    if (totalImages === 0) errors.push('At least one product image is required');
    
    if (formData.isOnSale) {
      if (!formData.salePrice || formData.salePrice <= 0) errors.push('Sale price is required when product is on sale');
      if (formData.salePrice >= formData.product_price) errors.push('Sale price must be less than regular price');
    }
    
    return errors;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }
    
    setSaving(true);
    setError('');
    
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        navigate('/admin/login');
        return;
      }
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Append form fields
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Append existing images info (for backend to know which to keep)
      formDataToSend.append('existingImages', JSON.stringify(existingImages));
      
      // Append new images
      newImages.forEach((image, index) => {
        formDataToSend.append('images', image);
      });
      
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSuccess('Product updated successfully!');
        setHasChanges(false);
        // Refresh product data
        setTimeout(() => {
          fetchProduct();
          setSuccess('');
        }, 1500);
      } else {
        setError(data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle navigation with unsaved changes
  const handleNavigation = (path) => {
    if (hasChanges) {
      setShowDiscardConfirm(true);
    } else {
      navigate(path);
    }
  };

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(price);
  };

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [id]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleNavigation('/admin/products')}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600 mt-1">Update product information and settings</p>
          </div>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <button
              onClick={resetForm}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Reset
            </button>
          )}
          <button
            onClick={() => navigate(`/admin/products/${id}`)}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Eye size={16} />
            View
          </button>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      {hasChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <p className="text-amber-700">You have unsaved changes</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetForm}
                className="text-amber-700 hover:text-amber-900 text-sm"
              >
                Discard
              </button>
              <button
                onClick={handleSubmit}
                className="bg-amber-600 text-white px-3 py-1 rounded text-sm hover:bg-amber-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package size={20} />
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <input
                type="text"
                name="product_brand"
                value={formData.product_brand}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter brand name"
              />
            </div>
            
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Description *
              </label>
              <textarea
                name="product_description"
                value={formData.product_description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the product features, benefits, and specifications"
                required
              />
            </div>
          </div>
        </div>

        {/* Category and Pricing */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign size={20} />
            Category & Pricing
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Featured Product
                </label>
                <p className="text-xs text-gray-500">
                  Show on homepage
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, isFeatured: !prev.isFeatured }));
                  setHasChanges(true);
                }}
                className="flex items-center"
              >
                {formData.isFeatured ? (
                  <ToggleRight size={24} className="text-blue-600" />
                ) : (
                  <ToggleLeft size={24} className="text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={20} />
            SEO Settings
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleInputChange}
                maxLength="60"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Auto-generated from product name"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.metaTitle.length}/60 characters
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
                maxLength="155"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Auto-generated from product description"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.metaDescription.length}/155 characters
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            type="button"
            onClick={() => handleNavigation('/admin/products')}
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !hasChanges}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <Save size={16} />
            )}
            {saving ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>

      {/* Discard Changes Confirmation Modal */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Discard Changes?
            </h3>
            <p className="text-gray-600 mb-6">
              You have unsaved changes. Are you sure you want to leave without saving?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDiscardConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDiscardConfirm(false);
                  setHasChanges(false);
                  navigate('/admin/products');
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
};

export default EditProduct;
                