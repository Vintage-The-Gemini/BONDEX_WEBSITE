// frontend/src/components/admin/ProductBasicInfo.jsx
import React from 'react';
import {
  Package,
  Building2,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

const ProductBasicInfo = ({ 
  formData, 
  onFormDataChange, 
  validationErrors = {} 
}) => {

  // Handle input changes and pass to parent
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    // Call parent's onChange handler
    onFormDataChange(name, newValue);
  };

  // Character count helper
  const getCharacterCountColor = (current, min, max) => {
    if (current === 0) return 'text-gray-500';
    if (current < min) return 'text-red-500';
    if (current > max) return 'text-red-500';
    if (current >= min && current <= (max * 0.8)) return 'text-green-600';
    return 'text-yellow-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border p-8">
      <div className="flex items-center gap-3 mb-6">
        <Package className="h-6 w-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-900">Basic Product Information</h2>
        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          ✨ ESSENTIAL
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Product Name *
            <span className="text-xs text-gray-500 ml-2 font-normal">
              (Be specific and descriptive for better SEO)
            </span>
          </label>
          
          <div className="space-y-2">
            <input
              type="text"
              name="product_name"
              value={formData.product_name || ''}
              onChange={handleInputChange}
              className={`w-full p-4 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium transition-all ${
                validationErrors.product_name 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400 focus:border-orange-500'
              }`}
              placeholder="e.g., 3M SecureFit Safety Helmet with Adjustable Ratchet - H700 Series"
              maxLength={200}
            />
            
            <div className="flex items-center justify-between">
              <span className={`text-xs ${getCharacterCountColor(
                formData.product_name?.length || 0, 10, 200
              )}`}>
                {formData.product_name?.length || 0}/200 characters
                {(formData.product_name?.length || 0) < 10 && ' (minimum 10 for SEO)'}
              </span>
              
              {validationErrors.product_name ? (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.product_name}
                </p>
              ) : (formData.product_name?.length || 0) >= 10 && (
                <p className="text-green-500 text-sm flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Good length
                </p>
              )}
            </div>
            
            {/* SEO Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800">
                  <strong>SEO Tip:</strong> Include brand, model, and key features. 
                  Avoid generic terms like "Best" or "Premium" - be specific about functionality.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Brand */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Brand/Manufacturer *
            <span className="text-xs text-gray-500 ml-2 font-normal">
              (Trusted brands rank higher in search)
            </span>
          </label>
          
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="product_brand"
              value={formData.product_brand || ''}
              onChange={handleInputChange}
              className={`w-full pl-12 pr-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium transition-all ${
                validationErrors.product_brand 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400 focus:border-orange-500'
              }`}
              placeholder="e.g., 3M, Honeywell, MSA, Uvex, DuPont"
              list="common-brands"
            />
            
            {/* Common Brands Datalist */}
            <datalist id="common-brands">
              <option value="3M" />
              <option value="Honeywell" />
              <option value="MSA Safety" />
              <option value="Uvex" />
              <option value="DuPont" />
              <option value="Ansell" />
              <option value="Kimberly-Clark" />
              <option value="Moldex" />
              <option value="North Safety" />
              <option value="Dräger" />
              <option value="Scott Safety" />
              <option value="Bullard" />
            </datalist>
            
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
            <span className="text-xs text-gray-500 ml-2 font-normal">
              (Detailed description for SEO and customer understanding)
            </span>
          </label>
          
          <div className="space-y-2">
            <textarea
              name="product_description"
              value={formData.product_description || ''}
              onChange={handleInputChange}
              rows={6}
              className={`w-full p-4 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none ${
                validationErrors.product_description 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400 focus:border-orange-500'
              }`}
              placeholder="Write a comprehensive description including:&#10;• Key features and benefits&#10;• Applications and use cases&#10;• Compliance standards (ANSI, OSHA, etc.)&#10;• Technical specifications&#10;• What problems it solves&#10;• Why customers should choose this product"
              maxLength={2000}
            />
            
            <div className="flex items-center justify-between">
              <span className={`text-xs ${getCharacterCountColor(
                formData.product_description?.length || 0, 50, 2000
              )}`}>
                {formData.product_description?.length || 0}/2000 characters
                {(formData.product_description?.length || 0) < 50 && ' (minimum 50 for SEO)'}
              </span>
              
              {validationErrors.product_description ? (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.product_description}
                </p>
              ) : (formData.product_description?.length || 0) >= 50 && (
                <p className="text-green-500 text-sm flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  SEO optimized
                </p>
              )}
            </div>
            
            {/* Description Writing Tips */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-green-800">
                  <strong>Writing Tips:</strong> Start with primary function, mention certifications, 
                  include use cases, and end with key benefits. Use keywords naturally.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Status Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured || false}
              onChange={handleInputChange}
              className="w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
            />
            <label className="text-sm font-medium text-gray-700">
              Featured Product
              <span className="block text-xs text-gray-500">Show on homepage</span>
            </label>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isNewArrival"
              checked={formData.isNewArrival || false}
              onChange={handleInputChange}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label className="text-sm font-medium text-gray-700">
              New Arrival
              <span className="block text-xs text-gray-500">Mark as new</span>
            </label>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              name="status"
              value={formData.status || 'active'}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="inactive">Inactive</option>
            </select>
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Status
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBasicInfo;