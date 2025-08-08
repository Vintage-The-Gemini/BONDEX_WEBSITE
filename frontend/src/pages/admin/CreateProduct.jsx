// frontend/src/pages/admin/CreateProduct.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

// Component Imports
import MultiCategorySelector from '../../components/admin/MultiCategorySelector';
import AdvancedSEO from '../../components/admin/AdvancedSEO'; // ✅ CORRECT IMPORT
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
  const { categories, loadCategories, addNotification, createProduct } = useAdmin(); // 🆕 ADDED createProduct

  // Form State - Fixed to match backend validation
  const [formData, setFormData] = useState({
    // Basic Product Information
    product_name: '',
    product_description: '',
    product_brand: '',
    
    // FIXED: Match backend field names
    category: '', // Protection type (backend expects 'primaryCategory')
    industries: [], // Industries (backend expects 'secondaryCategories')
    
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
    
    // 🆕 SIMPLIFIED SEO FIELDS
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    slug: ''
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

  // 🔍 DEBUG: Log what we're passing to ProductImages
  useEffect(() => {
    console.log('🔍 CreateProduct - Images state:', images?.length || 0);
    console.log('🔍 CreateProduct - ImagePreviews state:', imagePreviews?.length || 0);
    console.log('🔍 CreateProduct - setImages function:', typeof setImages);
    console.log('🔍 CreateProduct - setImagePreviews function:', typeof setImagePreviews);
  }, [images, imagePreviews]);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // 🔍 DEBUG: Log categories when they change
  useEffect(() => {
    console.log('🔍 Categories in CreateProduct:', categories?.length || 0, categories);
  }, [categories]);

  // 🆕 SIMPLIFIED VALIDATION FUNCTION
  const validateForm = () => {
    const errors = {};
    
    // Basic product info
    if (!formData.product_name?.trim()) {
      errors.product_name = 'Product name is required';
    } else if (formData.product_name.length < 3) {
      errors.product_name = 'Product name must be at least 3 characters';
    }
    
    if (!formData.product_description?.trim()) {
      errors.product_description = 'Product description is required';
    } else if (formData.product_description.length < 20) {
      errors.product_description = 'Description must be at least 20 characters';
    }
    
    if (!formData.product_brand?.trim()) {
      errors.product_brand = 'Product brand is required';
    }
    
    // FIXED: Category validation
    if (!formData.category) {
      errors.category = 'Protection type selection is required';
    }
    
    if (!formData.industries || formData.industries.length === 0) {
      errors.industries = 'At least one industry must be selected';
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
    if (!images || images.length === 0) {
      errors.images = 'At least one product image is required';
    }
    
    // 🆕 SIMPLIFIED SEO validation (removed complex scoring)
    if (!formData.metaTitle || formData.metaTitle.length < 20) {
      errors.metaTitle = 'Meta title should be at least 20 characters';
    }
    
    if (!formData.metaDescription || formData.metaDescription.length < 50) {
      errors.metaDescription = 'Meta description should be at least 50 characters';
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
    
    // 🆕 AUTO-GENERATE SLUG from product name
    if (field === 'product_name' && value) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50);
      setFormData(prev => ({ ...prev, slug }));
    }
    
    // 🆕 AUTO-GENERATE META TITLE from product name + brand
    if ((field === 'product_name' || field === 'product_brand') && formData.product_name && formData.product_brand) {
      const metaTitle = `${formData.product_brand} ${formData.product_name} - Safety Equipment Kenya`;
      setFormData(prev => ({ ...prev, metaTitle }));
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    handleFormDataChange(name, newValue);
  };

  // 🆕 FIXED SUBMIT FUNCTION - Using AdminContext
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
      
      // Validate images
      if (!images || images.length === 0) {
        throw new Error('At least one product image is required');
      }
      
      // Validate required fields
      if (!formData.product_name?.trim()) {
        throw new Error('Product name is required');
      }
      
      if (!formData.category) {
        throw new Error('Protection type (category) is required');
      }
      
      if (!formData.industries || formData.industries.length === 0) {
        throw new Error('At least one industry must be selected');
      }
      
      // 🆕 FIXED: Use AdminContext createProduct method
      const result = await createProduct(formData, images);
      
      if (result.success) {
        setSuccess('🎯 Product created successfully with multi-category targeting!');
        console.log('✅ Product created:', result.data);
        
        // Navigate to product view after brief delay
        setTimeout(() => {
          navigate(`/admin/products/${result.data._id}`);
        }, 1500);
      } else {
        throw new Error(result.error || 'Failed to create product');
      }
      
    } catch (error) {
      console.error('❌ Creation error:', error);
      const errorMessage = error.message || 'Failed to create product. Please check your connection and try again.';
      setError(errorMessage);
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
              Add safety equipment with precision multi-category targeting
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
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
      </div>

      {/* 🆕 SUCCESS/ERROR MESSAGES */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800 font-medium">Error</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">Success</span>
          </div>
          <p className="text-green-700 mt-1">{success}</p>
        </div>
      )}

      {/* Main Form */}
      <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
        
        {/* Product Basic Information */}
        <ProductBasicInfo
          formData={formData}
          onFormDataChange={handleFormDataChange}
          handleInputChange={handleInputChange}
          validationErrors={validationErrors}
        />

        {/* Multi-Category Selector */}
        <MultiCategorySelector
          formData={formData}
          onFormDataChange={handleFormDataChange}
          categories={categories} // ✅ PASS CATEGORIES FROM ADMIN CONTEXT
          validationErrors={validationErrors}
        />

        {/* Pricing & Inventory */}
        <ProductPricingInventory
          formData={formData}
          onFormDataChange={handleFormDataChange}
          handleInputChange={handleInputChange}
          validationErrors={validationErrors}
        />

        {/* Product Images */}
        <ProductImages
          images={images}
          setImages={setImages}
          imagePreviews={imagePreviews}
          setImagePreviews={setImagePreviews}
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

        {/* ✅ ADVANCED SEO Section (using your existing component) */}
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
              type="button"
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
                <div className="space-y-2">
                  <img
                    src={imagePreviews[0]}
                    alt={formData.product_name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {imagePreviews.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {imagePreviews.slice(1, 5).map((preview, index) => (
                        <img
                          key={index}
                          src={preview}
                          alt={`${formData.product_name} ${index + 2}`}
                          className="w-full h-16 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No images uploaded</span>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {formData.product_name || 'Product Name'}
                </h3>
                <p className="text-gray-600 text-sm">
                  by {formData.product_brand || 'Brand Name'}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-orange-500">
                  KES {formData.product_price ? parseFloat(formData.product_price).toLocaleString() : '0'}
                </span>
                {formData.isOnSale && formData.salePrice && (
                  <span className="text-lg text-gray-500 line-through">
                    KES {parseFloat(formData.salePrice).toLocaleString()}
                  </span>
                )}
              </div>
              
              <p className="text-gray-700">
                {formData.product_description || 'Product description will appear here...'}
              </p>
              
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Category:</span> {formData.category || 'Not selected'}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Industries:</span> {formData.industries?.join(', ') || 'None selected'}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Stock:</span> {formData.stock || '0'} units
                </div>
                <div className="text-sm">
                  <span className="font-medium">Status:</span> {formData.status || 'active'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProduct;