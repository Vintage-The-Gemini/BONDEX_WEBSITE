// frontend/src/pages/admin/CreateProduct.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

// Component Imports
import MultiCategorySelector from '../../components/admin/MultiCategorySelector';
import AdvancedSEO from '../../components/admin/AdvancedSEO';
import ProductBasicInfo from '../../components/admin/ProductBasicInfo';
import ProductPricingInventory from '../../components/admin/ProductPricingInventory';
import ProductImages from '../../components/admin/ProductImages';
import ProductDetails from '../../components/admin/ProductDetails';

import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Target,
  Sparkles,
  Package
} from 'lucide-react';

const CreateProduct = () => {
  const navigate = useNavigate();
  const { categories, loadCategories, addNotification } = useAdmin();

  // Form State - Fixed to match backend validation
  const [formData, setFormData] = useState({
    // Basic Product Information
    product_name: '',
    product_description: '',
    product_brand: '',
    
    // FIXED: Match backend field names
    category: '', // Protection type (backend expects 'category')
    industries: [], // Industries (backend expects 'industries')
    
    // Pricing & Inventory
    product_price: '',
    stock: '',
    lowStockThreshold: '10',
    
    // Sale Configuration
    isOnSale: false,
    salePrice: '',
    saleStartDate: '',
    saleEndDate: '',
    
    // Status & Features
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    
    // SEO FIELDS
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    slug: '',
    focusKeyword: '',
    seoScore: 0
  });

  // Images and Media
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  // Product Details
  const [features, setFeatures] = useState(['']);
  const [specifications, setSpecifications] = useState([{ key: '', value: '' }]);
  const [tags, setTags] = useState(['']);
  
  // Certifications and Compliance
  const [certifications, setCertifications] = useState(['']);
  const [complianceStandards, setComplianceStandards] = useState(['']);

  // UI State
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

  // Handle form data changes
  const handleFormDataChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific validation error when field is updated
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    handleFormDataChange(name, newValue);
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
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Append all form fields with proper names
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
          if (Array.isArray(formData[key])) {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });
      
      // Append features (filter empty)
      const validFeatures = features.filter(f => f.trim() !== '');
      if (validFeatures.length > 0) {
        formDataToSend.append('features', JSON.stringify(validFeatures));
      }
      
      // Append specifications (filter empty)
      const validSpecs = specifications.filter(s => s.key.trim() !== '' && s.value.trim() !== '');
      if (validSpecs.length > 0) {
        const specsObject = {};
        validSpecs.forEach(spec => {
          specsObject[spec.key.trim()] = spec.value.trim();
        });
        formDataToSend.append('specifications', JSON.stringify(specsObject));
      }
      
      // Append tags (filter empty)
      const validTags = tags.filter(t => t.trim() !== '');
      if (validTags.length > 0) {
        formDataToSend.append('tags', JSON.stringify(validTags));
      }
      
      // Append certifications
      const validCertifications = certifications.filter(c => c.trim() !== '');
      if (validCertifications.length > 0) {
        formDataToSend.append('certifications', JSON.stringify(validCertifications));
      }
      
      // Append compliance standards
      const validCompliance = complianceStandards.filter(c => c.trim() !== '');
      if (validCompliance.length > 0) {
        formDataToSend.append('complianceStandards', JSON.stringify(validCompliance));
      }
      
      // Append images
      images.forEach((image, index) => {
        formDataToSend.append('images', image);
      });
      
      // FIXED: Use proper API endpoint with auth headers
      const response = await fetch(`${API_BASE}/admin/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formDataToSend
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSuccess('Product created successfully!');
        addNotification('Product created successfully!', 'success');
        console.log('✅ Product created:', result.data);
        
        // Navigate to product view after brief delay
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

  // Save as draft
  const handleSaveDraft = async () => {
    const draftData = { ...formData, status: 'draft' };
    setFormData(draftData);
    
    // Auto-submit after brief delay
    setTimeout(() => {
      const form = document.getElementById('product-form');
      if (form) form.requestSubmit();
    }, 100);
  };

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
        
        {/* Basic Product Information */}
        <ProductBasicInfo
          formData={formData}
          onFormDataChange={handleFormDataChange}
          validationErrors={validationErrors}
        />

        {/* Multi-Category Selection - FIXED PROP NAMES */}
        <MultiCategorySelector
          selectedProtectionType={formData.category}
          selectedIndustries={formData.industries}
          onProtectionTypeChange={(categoryId) => handleFormDataChange('category', categoryId)}
          onIndustriesChange={(industries) => handleFormDataChange('industries', industries)}
          errors={validationErrors}
        />

        {/* Product Images */}
        <ProductImages
          images={images}
          imagePreviews={imagePreviews}
          onImagesChange={setImages}
          onImagePreviewsChange={setImagePreviews}
          validationErrors={validationErrors}
        />

        {/* Pricing & Inventory */}
        <ProductPricingInventory
          formData={formData}
          onFormDataChange={handleFormDataChange}
          onInputChange={handleInputChange}
          validationErrors={validationErrors}
        />

        {/* Product Details */}
        <ProductDetails
          features={features}
          specifications={specifications}
          tags={tags}
          certifications={certifications}
          complianceStandards={complianceStandards}
          onFeaturesChange={setFeatures}
          onSpecificationsChange={setSpecifications}
          onTagsChange={setTags}
          onCertificationsChange={setCertifications}
          onComplianceChange={setComplianceStandards}
        />

        {/* Advanced SEO */}
        <AdvancedSEO
          formData={formData}
          onFormDataChange={handleFormDataChange}
          productName={formData.product_name}
          validationErrors={validationErrors}
        />

        {/* Submit Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-3 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              onClick={handleSaveDraft}
              className="px-6 py-3 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Package className="w-4 h-4 animate-spin inline mr-2" />
                  Saving Draft...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 inline mr-2" />
                  Save Draft
                </>
              )}
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200 font-medium disabled:opacity-50 shadow-lg flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Save className="w-4 h-4 animate-spin" />
                  Creating Product...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Product
                </>
              )}
            </button>
          </div>
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
            <div>
              {imagePreviews.length > 0 ? (
                <img
                  src={imagePreviews[0].url || imagePreviews[0]}
                  alt="Product preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="h-12 w-12 text-gray-400" />
                  <span className="ml-2 text-gray-500">No image uploaded</span>
                </div>
              )}
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
              
              {/* Preview Features */}
              {features.filter(f => f.trim()).length > 0 && (
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Key Features:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {features.filter(f => f.trim()).slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProduct;