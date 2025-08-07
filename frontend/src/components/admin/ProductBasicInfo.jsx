// frontend/src/components/admin/ProductBasicInfo.jsx
import React from 'react';
import { 
  Package, 
  AlertCircle, 
  CheckCircle,
  Building2,
  Tag as TagIcon,
  FileText
} from 'lucide-react';

const ProductBasicInfo = ({ 
  formData, 
  onInputChange, 
  validationErrors = {} 
}) => {

  // Real-time character count and validation
  const getCharacterCountStyle = (current, min, max) => {
    if (current < min) return 'text-red-500';
    if (current > max) return 'text-red-500';
    if (current >= min && current <= max * 0.8) return 'text-green-600';
    return 'text-yellow-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Package className="h-6 w-6 text-green-600" />
        Product Information
        <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
          📦 BASIC INFO
        </span>
      </h2>
      
      <div className="space-y-6">
        
        {/* Product Name & Brand Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Product Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Product Name *
              <span className="text-xs text-gray-500 ml-2 font-normal">(SEO Important)</span>
            </label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={onInputChange}
              className={`w-full p-4 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium transition-all ${
                validationErrors.product_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="e.g., Professional Steel Toe Safety Boots"
              maxLength={200}
            />
            
            <div className="flex justify-between items-center mt-2">
              <span className={`text-sm font-medium ${
                getCharacterCountStyle(formData.product_name.length, 10, 200)
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
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Brand *
              <span className="text-xs text-gray-500 ml-2 font-normal">(Manufacturer)</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="product_brand"
                value={formData.product_brand}
                onChange={onInputChange}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium transition-all ${
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
          <label className="block text-sm font-bold text-gray-700 mb-3">
            Product Description *
            <span className="text-xs text-gray-500 ml-2 font-normal">(Minimum 50 characters for SEO)</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
            <textarea
              name="product_description"
              value={formData.product_description}
              onChange={onInputChange}
              rows={5}
              className={`w-full pl-12 pr-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium resize-none transition-all ${
                validationErrors.product_description ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Detailed description of the safety equipment:
• What protection does it provide?
• What industries/applications is it suitable for?
• Key features and benefits
• Technical specifications
• Compliance standards met"
              maxLength={2000}
            />
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-4">
              <span className={`text-sm font-medium ${
                getCharacterCountStyle(formData.product_description.length, 50, 2000)
              }`}>
                {formData.product_description.length}/2000 characters
              </span>
              
              {/* SEO Quality Indicator */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  formData.product_description.length >= 150 ? 'bg-green-500' :
                  formData.product_description.length >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-xs text-gray-600">
                  SEO Quality: {
                    formData.product_description.length >= 150 ? 'Excellent' :
                    formData.product_description.length >= 100 ? 'Good' :
                    formData.product_description.length >= 50 ? 'Fair' : 'Poor'
                  }
                </span>
              </div>
            </div>
            
            {validationErrors.product_description ? (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {validationErrors.product_description}
              </p>
            ) : formData.product_description.length >= 50 && (
              <p className="text-green-500 text-sm flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                SEO optimized
              </p>
            )}
          </div>
        </div>

        {/* Quick SEO Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            💡 SEO Writing Tips
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-blue-800">
                <span className="font-medium">Product Name:</span> Include main keyword and brand
              </p>
              <p className="text-blue-800">
                <span className="font-medium">Description:</span> Start with key benefits
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-blue-800">
                <span className="font-medium">Keywords:</span> Include industry applications
              </p>
              <p className="text-blue-800">
                <span className="font-medium">Location:</span> Mention Kenya/Nairobi for local SEO
              </p>
            </div>
          </div>
        </div>

        {/* Product Name Suggestions (if empty) */}
        {!formData.product_name && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">📝 Product Name Examples:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <button
                type="button"
                onClick={() => onInputChange({ target: { name: 'product_name', value: 'Professional Steel Toe Safety Boots' } })}
                className="text-left p-2 bg-white rounded hover:bg-yellow-100 transition-colors"
              >
                • Professional Steel Toe Safety Boots
              </button>
              <button
                type="button"
                onClick={() => onInputChange({ target: { name: 'product_name', value: 'Anti-Fog Safety Goggles with UV Protection' } })}
                className="text-left p-2 bg-white rounded hover:bg-yellow-100 transition-colors"
              >
                • Anti-Fog Safety Goggles with UV Protection
              </button>
              <button
                type="button"
                onClick={() => onInputChange({ target: { name: 'product_name', value: 'Cut-Resistant Work Gloves Level 5' } })}
                className="text-left p-2 bg-white rounded hover:bg-yellow-100 transition-colors"
              >
                • Cut-Resistant Work Gloves Level 5
              </button>
              <button
                type="button"
                onClick={() => onInputChange({ target: { name: 'product_name', value: 'N95 Respirator Mask with Valve' } })}
                className="text-left p-2 bg-white rounded hover:bg-yellow-100 transition-colors"
              >
                • N95 Respirator Mask with Valve
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductBasicInfo;