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
  const { categories, loadCategories, addNotification, createProduct } = useAdmin();

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
    }
    
    if (!formData.product_description?.trim()) {
      errors.product_description = 'Product description is required';
    }
    
    if (!formData.product_brand?.trim()) {
      errors.product_brand = 'Product brand is required';
    }
    
    // Categories
    if (!formData.category) {
      errors.category = 'Protection type (category) is required';
    }
    
    if (!formData.industries || formData.industries.length === 0) {
      errors.industries = 'At least one industry must be selected';
    }
    
    // Pricing
    if (!formData.product_price || parseFloat(formData.product_price) <= 0) {
      errors.product_price = 'Valid product price is required';
    }
    
    if (!formData.stock || parseInt(formData.stock) < 0) {
      errors.stock = 'Valid stock quantity is required';
    }
    
    // Images
    if (!images || images.length === 0) {
      errors.images = 'At least one product image is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form data changes
  const handleFormDataChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle input changes (for direct input elements)
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    handleFormDataChange(name, newValue);
  };

  // 🆕 FIXED SUBMIT FUNCTION - Proper image handling
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
      
      // ✅ FIXED: Extract File objects from images array
      const imageFiles = images
        .map(img => {
          // Handle different image object structures
          if (img instanceof File) {
            return img; // Already a File object
          } else if (img.file instanceof File) {
            return img.file; // Extract File from wrapper object
          } else if (img.originalFile instanceof File) {
            return img.originalFile; // Extract from another wrapper structure
          }
          console.warn('Unknown image structure:', img);
          return null;
        })
        .filter(file => file !== null); // Remove any null values

      console.log('🔍 Extracted image files:', imageFiles.length, imageFiles);
      
      // Validate that we have actual File objects
      if (imageFiles.length === 0) {
        throw new Error('At least one product image is required');
      }
      
      // Validate all items are File objects
      const invalidFiles = imageFiles.filter(file => !(file instanceof File));
      if (invalidFiles.length > 0) {
        console.error('❌ Invalid file objects found:', invalidFiles);
        throw new Error('Invalid image files detected. Please re-upload your images.');
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
      
      // ✅ FIXED: Pass actual File objects to createProduct
      const result = await createProduct(formData, imageFiles);
      
      if (result.success) {
        setSuccess('🎯 Product created successfully with multi-category targeting!');
        console.log('✅ Product created:', result.data);
        
        // Clear form
        setFormData({
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
          saleStartDate: '',
          saleEndDate: '',
          status: 'active',
          isFeatured: false,
          isNewArrival: false,
          metaTitle: '',
          metaDescription: '',
          keywords: '',
          slug: ''
        });
        setImages([]);
        setImagePreviews([]);
        setFeatures(['']);
        setSpecifications([{ key: '', value: '' }]);
        setTags(['']);
        setCertifications(['']);
        setComplianceStandards(['']);
        
        // Navigate to products list after brief delay
        setTimeout(() => {
          navigate('/admin/products');
        }, 1500);
      } else {
        throw new Error(result.error || 'Failed to create product');
      }
      
    } catch (error) {
      console.error('❌ Creation error:', error);
      const errorMessage = error.message || 'Failed to create product. Please check your connection and try again.';
      setError(errorMessage);
      
      // Add notification
      addNotification({
        type: 'error',
        message: errorMessage
      });
      
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  // Handle save as draft
  const handleSaveDraft = async () => {
    const draftData = {
      ...formData,
      status: 'draft',
      images: images,
      features: features,
      specifications: specifications,
      tags: tags,
      certifications: certifications,
      complianceStandards: complianceStandards
    };
    
    try {
      localStorage.setItem('productDraft', JSON.stringify(draftData));
      addNotification({
        type: 'success',
        message: 'Draft saved successfully!'
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      addNotification({
        type: 'error',
        message: 'Failed to save draft'
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Product</h1>
            <p className="text-gray-600">Add a new safety equipment product to your catalog</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
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
          categories={categories}
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

        {/* ✅ ADVANCED SEO Section */}
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
                  KES {formData.product_price ? Number(formData.product_price).toLocaleString() : '0'}
                </span>
                {formData.isOnSale && formData.salePrice && (
                  <span className="text-lg text-gray-500 line-through">
                    KES {Number(formData.salePrice).toLocaleString()}
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 text-sm">
                {formData.product_description || 'Product description will appear here...'}
              </p>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Package className="h-4 w-4" />
                <span>Stock: {formData.stock || '0'} units</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProduct;