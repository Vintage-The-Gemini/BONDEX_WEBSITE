// frontend/src/components/admin/ProductPricingInventory.jsx
import React from 'react';
import {
  DollarSign,
  Hash,
  AlertCircle,
  TrendingUp,
  Package,
  Calendar,
  Info,
  Target
} from 'lucide-react';

const ProductPricingInventory = ({ 
  formData, 
  onFormDataChange, 
  onInputChange,
  validationErrors = {} 
}) => {

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (onInputChange) {
      onInputChange(e);
    } else {
      const newValue = type === 'checkbox' ? checked : value;
      onFormDataChange(name, newValue);
    }
  };

  // Calculate discount information
  const calculateDiscount = () => {
    const regularPrice = parseFloat(formData.product_price) || 0;
    const salePrice = parseFloat(formData.salePrice) || 0;
    
    if (regularPrice > 0 && salePrice > 0 && salePrice < regularPrice) {
      const discount = regularPrice - salePrice;
      const percentage = Math.round((discount / regularPrice) * 100);
      return { discount: discount.toFixed(2), percentage };
    }
    return null;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const discountInfo = calculateDiscount();

  return (
    <div className="bg-white rounded-xl shadow-lg border p-8">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="h-6 w-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-900">Pricing & Inventory</h2>
        <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
          💰 PRICING
        </div>
      </div>
      
      <div className="space-y-8">
        
        {/* Regular Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Regular Price */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Regular Price (KES) *
              <span className="text-xs text-gray-500 ml-2 font-normal">
                (Competitive pricing recommended)
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                KES
              </span>
              <input
                type="number"
                name="product_price"
                value={formData.product_price || ''}
                onChange={handleInputChange}
                className={`w-full pl-16 pr-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-bold text-lg transition-all ${
                  validationErrors.product_price 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400 focus:border-orange-500'
                }`}
                placeholder="0"
                min="0"
                step="0.01"
              />
              {formData.product_price && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  {formatCurrency(formData.product_price)}
                </div>
              )}
              {validationErrors.product_price && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.product_price}
                </p>
              )}
            </div>
          </div>

          {/* Stock Quantity */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Stock Quantity *
              <span className="text-xs text-gray-500 ml-2 font-normal">
                (Available units)
              </span>
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="stock"
                value={formData.stock || ''}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-bold text-lg transition-all ${
                  validationErrors.stock 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400 focus:border-orange-500'
                }`}
                placeholder="0"
                min="0"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                units
              </div>
              {validationErrors.stock && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.stock}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Low Stock Alert Threshold
              <span className="text-xs text-gray-500 ml-2 font-normal">
                (Get notified when stock is low)
              </span>
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="lowStockThreshold"
                value={formData.lowStockThreshold || '10'}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="10"
                min="0"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                units
              </div>
            </div>
          </div>

          {/* Stock Status Indicator */}
          <div className="flex items-end">
            <div className={`w-full p-4 rounded-lg border-2 ${
              parseInt(formData.stock || 0) === 0 
                ? 'border-red-200 bg-red-50' 
                : parseInt(formData.stock || 0) <= parseInt(formData.lowStockThreshold || 10)
                ? 'border-yellow-200 bg-yellow-50'
                : 'border-green-200 bg-green-50'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  parseInt(formData.stock || 0) === 0 
                    ? 'bg-red-500' 
                    : parseInt(formData.stock || 0) <= parseInt(formData.lowStockThreshold || 10)
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}></div>
                <span className={`text-sm font-medium ${
                  parseInt(formData.stock || 0) === 0 
                    ? 'text-red-800' 
                    : parseInt(formData.stock || 0) <= parseInt(formData.lowStockThreshold || 10)
                    ? 'text-yellow-800'
                    : 'text-green-800'
                }`}>
                  {parseInt(formData.stock || 0) === 0 
                    ? 'Out of Stock' 
                    : parseInt(formData.stock || 0) <= parseInt(formData.lowStockThreshold || 10)
                    ? 'Low Stock Alert'
                    : 'In Stock'
                  }
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Current: {formData.stock || 0} units
              </div>
            </div>
          </div>
        </div>

        {/* Sale Configuration */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              name="isOnSale"
              checked={formData.isOnSale || false}
              onChange={handleInputChange}
              className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
            />
            <label className="text-lg font-bold text-gray-900">
              This product is on sale
            </label>
            <TrendingUp className="h-5 w-5 text-red-500" />
          </div>
          
          {formData.isOnSale && (
            <div className="space-y-6 pl-8 border-l-4 border-red-200 bg-red-50 p-6 rounded-r-lg">
              
              {/* Sale Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-red-700 mb-2">
                    Sale Price (KES) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600 font-bold">
                      KES
                    </span>
                    <input
                      type="number"
                      name="salePrice"
                      value={formData.salePrice || ''}
                      onChange={handleInputChange}
                      className={`w-full pl-16 pr-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-bold text-lg text-red-600 transition-all ${
                        validationErrors.salePrice 
                          ? 'border-red-500 bg-red-100' 
                          : 'border-red-300 hover:border-red-400 focus:border-red-500 bg-white'
                      }`}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                    {formData.salePrice && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-red-600">
                        {formatCurrency(formData.salePrice)}
                      </div>
                    )}
                    {validationErrors.salePrice && (
                      <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {validationErrors.salePrice}
                      </p>
                    )}
                  </div>
                </div>

                {/* Discount Information */}
                <div className="flex items-end">
                  <div className="w-full p-4 bg-white border-2 border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-bold text-green-800">Discount Analysis</span>
                    </div>
                    {discountInfo ? (
                      <div className="space-y-1">
                        <div className="text-sm text-gray-700">
                          You save: <span className="font-bold text-green-600">KES {discountInfo.discount}</span>
                        </div>
                        <div className="text-sm text-gray-700">
                          Discount: <span className="font-bold text-green-600">{discountInfo.percentage}% off</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Great discount! This will attract customers.
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Enter both prices to see discount
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sale Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-red-700 mb-2">
                    Sale Start Date
                    <span className="text-xs text-red-500 ml-2 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-400" />
                    <input
                      type="datetime-local"
                      name="saleStartDate"
                      value={formData.saleStartDate || ''}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-red-700 mb-2">
                    Sale End Date
                    <span className="text-xs text-red-500 ml-2 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-400" />
                    <input
                      type="datetime-local"
                      name="saleEndDate"
                      value={formData.saleEndDate || ''}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Sale Tips */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-orange-800">
                    <strong>Marketing Tip:</strong> Sales with 15-30% discounts perform best. 
                    Time-limited sales create urgency and boost conversions.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Strategy Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-blue-900 mb-2">Pricing Strategy for Kenya Market</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Consider import duties and local taxes in pricing</li>
                <li>• Research competitor prices for similar safety equipment</li>
                <li>• Factor in bulk purchase discounts for corporate clients</li>
                <li>• Set competitive prices for the Kenyan safety equipment market</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPricingInventory;