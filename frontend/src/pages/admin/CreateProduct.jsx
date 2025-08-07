// frontend/src/pages/admin/CreateProduct.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

// 🎯 COMPONENT IMPORTS - Broken down for precision
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
  const { categories, loadCategories } = useAdmin();

  // 🎯 ENHANCED: Multi-Category Form State
  const [formData, setFormData] = useState({
    // Basic Product Information
    product_name: '',
    product_description: '',
    product_brand: '',
    
    // 🚀 NEW: Multi-Category Support
    primaryCategory: '', // Protection type (required)
    secondaryCategories: [], // Industries (multiple)
    
    // Legacy support (will be auto-populated)
    category: '',
    
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
    
    // 🎯 ENHANCED SEO FIELDS
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

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // 🎯 VALIDATION with Multi-Category Logic
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
    
    // 🎯 MULTI-CATEGORY VALIDATION
    if (!formData.primaryCategory) {
      errors.protectionType = 'Protection type selection is required';
    }
    
    if (!formData.secondaryCategories || formData.secondaryCategories.length === 0) {
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
      
      if (!formData.saleEndDate) {
        errors.saleEndDate = 'Sale end date is required';
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

  // 🚀 FORM DATA CHANGE HANDLER with Auto-Population
  const handleFormDataChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-populate legacy category field for backward compatibility
      if (field === 'primaryCategory') {
        updated.category = value;
      }
      
      return updated;
    });
    
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

  // 📸 ENHANCED IMAGE HANDLING
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

    // Check total image count
    if (images.length + files.length > 5) {
      setError('Maximum 5 images allowed per product');
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
    if (validationErrors.images) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };

  // Remove image with re-indexing
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Set main image
  const setMainImage = (index) => {
    const newPreviews = [...imagePreviews];
    const [mainImage] = newPreviews.splice(index, 1);
    newPreviews.unshift(mainImage);
    setImagePreviews(newPreviews);
    
    const newImages = [...images];
    const [mainFile] = newImages.splice(index, 1);
    newImages.unshift(mainFile);
    setImages(newImages);
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

  // 🚀 ENHANCED SUBMIT with Multi-Category Support
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
      console.log('🎯 PRECISION: Creating multi-category product');
      console.log('Protection Type:', formData.primaryCategory);
      console.log('Industries:', formData.secondaryCategories);
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
          // Handle arrays properly
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
        formDataToSend.append('productTags', JSON.stringify(validTags));
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
      
      // API call with proper headers
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include'
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSuccess('🎯 Product created successfully with multi-category targeting!');
        console.log('✅ PRECISION SUCCESS:', result.data);
        
        // Navigate to product view after brief delay
        setTimeout(() => {
          navigate(`/admin/products/${result.data._id}`);
        }, 2000);
      } else {
        throw new Error(result.message || 'Failed to create product');
      }
      
    } catch (error) {
      console.error('❌ Creation error:', error);
      setError(error.message || 'Failed to create product. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get categories for components
  const protectionTypes = categories.filter(cat => cat.type === 'protection_type');
  const industries = categories.filter(cat => cat.type === 'industry');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* 🎯 ENHANCED HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/products')}
              className="p-3 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-white shadow-sm transition-all"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <Target className="h-8 w-8 text-blue-600" />
                Create New Product
                <span className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full font-medium">
                  🎯 MULTI-CATEGORY
                </span>
              </h1>
              <p className="text-gray-600 mt-2">
                Add safety equipment with precision multi-category targeting and advanced SEO optimization
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-6 py-3 text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 flex items-center gap-2 transition-all font-medium"
            >
              {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={loading}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 flex items-center gap-2 transition-all font-medium disabled:opacity-50"
            >
              <Save size={18} />
              Save Draft
            </button>
          </div>
        </div>

        {/* 🚨 ERROR/SUCCESS ALERTS */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-800">{error}</span>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">{success}</span>
            </div>
          </div>
        )}

        <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
          
          {/* 🎯 STEP 1: Multi-Category Selection */}
          <MultiCategorySelector
            selectedProtectionType={formData.primaryCategory}
            selectedIndustries={formData.secondaryCategories}
            onProtectionTypeChange={(typeId) => handleFormDataChange('primaryCategory', typeId)}
            onIndustriesChange={(industryIds) => handleFormDataChange('secondaryCategories', industryIds)}
            errors={validationErrors}
          />

          {/* 🚀 STEP 2: Advanced SEO Optimization */}
          <AdvancedSEO
            formData={formData}
            onFormDataChange={handleFormDataChange}
            selectedProtectionType={formData.primaryCategory}
            selectedIndustries={formData.secondaryCategories}
            protectionTypes={protectionTypes}
            industries={industries}
          />

          {/* 📦 STEP 3: Basic Product Information */}
          <ProductBasicInfo
            formData={formData}
            onInputChange={handleInputChange}
            validationErrors={validationErrors}
          />

          {/* 💰 STEP 4: Pricing & Inventory */}
          <ProductPricingInventory
            formData={formData}
            onInputChange={handleInputChange}
            validationErrors={validationErrors}
          />

          {/* 📸 STEP 5: Product Images */}
          <ProductImages
            images={images}
            imagePreviews={imagePreviews}
            onImageUpload={handleImageUpload}
            onRemoveImage={removeImage}
            onSetMainImage={setMainImage}
            validationErrors={validationErrors}
          />

          {/* 🏷️ STEP 6: Product Details & Specifications */}
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

          {/* 👁️ STEP 7: Product Preview */}
          {showPreview && (
            <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Eye className="h-6 w-6 text-blue-600" />
                Product Preview
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                  Customer View
                </span>
              </h2>
              
              <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Product Images Preview */}
                  <div>
                    {imagePreviews.length > 0 ? (
                      <div className="space-y-4">
                        <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-md">
                          <img
                            src={imagePreviews[0].url}
                            alt="Main product"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {imagePreviews.length > 1 && (
                          <div className="grid grid-cols-4 gap-2">
                            {imagePreviews.slice(1).map((preview, index) => (
                              <div key={index} className="aspect-square rounded-md overflow-hidden bg-white shadow-sm">
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
                      <div className="aspect-square rounded-lg bg-gray-200 flex items-center justify-center">
                        <Package className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Info Preview */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {formData.product_name || 'Product Name'}
                      </h3>
                      <p className="text-lg text-gray-600 mt-1">
                        by {formData.product_brand || 'Brand Name'}
                      </p>
                    </div>

                    {/* Category Badges */}
                    <div className="flex flex-wrap gap-2">
                      {formData.primaryCategory && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {protectionTypes.find(p => p._id === formData.primaryCategory)?.name}
                        </span>
                      )}
                      
                      {formData.secondaryCategories.map(industryId => {
                        const industry = industries.find(i => i._id === industryId);
                        return industry ? (
                          <span
                            key={industryId}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                          >
                            {industry.name}
                          </span>
                        ) : null;
                      })}
                    </div>

                    {/* Price Display */}
                    <div className="flex items-center gap-4">
                      {formData.isOnSale && formData.salePrice ? (
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-bold text-red-600">
                            KES {parseInt(formData.salePrice || 0).toLocaleString()}
                          </span>
                          <span className="text-xl text-gray-500 line-through">
                            KES {parseInt(formData.product_price || 0).toLocaleString()}
                          </span>
                          <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                            SALE
                          </span>
                        </div>
                      ) : (
                        <span className="text-3xl font-bold text-blue-600">
                          KES {parseInt(formData.product_price || 0).toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        parseInt(formData.stock) > 20 ? 'bg-green-500' :
                        parseInt(formData.stock) > 5 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm font-medium">
                        {parseInt(formData.stock) > 0 
                          ? `${formData.stock} units in stock` 
                          : 'Out of stock'
                        }
                      </span>
                    </div>

                    {/* Description Preview */}
                    <div>
                      <p className="text-gray-700 leading-relaxed">
                        {formData.product_description || 'Product description will appear here...'}
                      </p>
                    </div>

                    {/* Features Preview */}
                    {features.some(f => f.trim()) && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                        <ul className="space-y-1">
                          {features.filter(f => f.trim()).map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 🚀 SUBMIT SECTION */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Form Completion Status */}
              <div className="text-white">
                <h3 className="text-xl font-bold mb-2">🎯 Multi-Category Product Creation</h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      formData.primaryCategory ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <span>Protection Type</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      formData.secondaryCategories.length > 0 ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <span>Industries ({formData.secondaryCategories.length})</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      formData.metaTitle && formData.metaDescription ? 'bg-green-400' : 'bg-yellow-400'
                    }`}></div>
                    <span>SEO Optimized</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      images.length > 0 ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <span>Images ({images.length})</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-6 py-3 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all font-medium"
                >
                  ⬆️ Review Form
                </button>
                
                <button
                  type="submit"
                  disabled={loading || Object.keys(validationErrors).length > 0}
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 flex items-center gap-3 transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      Creating Product...
                    </>
                  ) : (
                    <>
                      <Target className="h-5 w-5" />
                      🎯 CREATE PRODUCT
                      <Sparkles className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* 📊 VALIDATION SUMMARY (when errors exist) */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="mt-8 bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Validation Errors ({Object.keys(validationErrors).length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(validationErrors).map(([field, message]) => (
                <div key={field} className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span className="font-medium text-red-700">{field}:</span>
                  <span className="text-red-600">{message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateProduct;