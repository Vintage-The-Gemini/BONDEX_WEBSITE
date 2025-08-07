// frontend/src/components/admin/ProductPricingInventory.jsx
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Package,
  AlertTriangle,
  TrendingUp,
  Calculator,
  AlertCircle,
  CheckCircle,
  Percent,
  Calendar,
  Eye,
  Star
} from 'lucide-react';

const ProductPricingInventory = ({ 
  formData, 
  onInputChange, 
  validationErrors = {} 
}) => {
  const [priceAnalysis, setPriceAnalysis] = useState({});
  const [showSaleConfig, setShowSaleConfig] = useState(formData.isOnSale || false);

  // Calculate pricing insights
  useEffect(() => {
    calculatePriceAnalysis();
  }, [formData.product_price, formData.salePrice]);

  const calculatePriceAnalysis = () => {
    const regularPrice = parseFloat(formData.product_price) || 0;
    const salePrice = parseFloat(formData.salePrice) || 0;
    
    const analysis = {
      regularPrice,
      salePrice,
      savings: regularPrice - salePrice,
      savingsPercent: regularPrice > 0 ? ((regularPrice - salePrice) / regularPrice * 100) : 0,
      profitMargin: regularPrice * 0.4, // Assumed 40% target margin
      isCompetitive: regularPrice > 100 && regularPrice < 50000 // KES range check
    };
    
    setPriceAnalysis(analysis);
  };

  // Format currency for display
  const formatKES = (amount) => {
    if (!amount || isNaN(amount)) return 'KES 0';
    return `KES ${parseInt(amount).toLocaleString()}`;
  };

  // Handle sale toggle
  const handleSaleToggle = (checked) => {
    setShowSaleConfig(checked);
    onInputChange({ target: { name: 'isOnSale', type: 'checkbox', checked } });
    
    // Clear sale fields if disabling
    if (!checked) {
      onInputChange({ target: { name: 'salePrice', value: '' } });
      onInputChange({ target: { name: 'saleStartDate', value: '' } });
      onInputChange({ target: { name: 'saleEndDate', value: '' } });
    }
  };

  // Stock level indicator
  const getStockLevelInfo = (stock) => {
    const stockNum = parseInt(stock) || 0;
    if (stockNum === 0) return { color: 'red', label: 'Out of Stock', icon: '🔴' };
    if (stockNum <= 5) return { color: 'red', label: 'Critical', icon: '🚨' };
    if (stockNum <= 20) return { color: 'yellow', label: 'Low Stock', icon: '⚠️' };
    if (stockNum <= 50) return { color: 'blue', label: 'Good', icon: '📦' };
    return { color: 'green', label: 'Well Stocked', icon: '✅' };
  };

  const stockInfo = getStockLevelInfo(formData.stock);

  return (
    <div className="bg-white rounded-xl shadow-lg border p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <DollarSign className="h-6 w-6 text-yellow-600" />
        Pricing & Inventory
        <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
          💰 KES CURRENCY
        </span>
      </h2>
      
      <div className="space-y-8">
        
        {/* Primary Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Regular Price */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Regular Price (KES) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-lg">
                KES
              </span>
              <input
                type="number"
                name="product_price"
                value={formData.product_price}
                onChange={onInputChange}
                min="0"
                step="0.01"
                className={`w-full pl-20 pr-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-xl transition-all ${
                  validationErrors.product_price ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
            </div>
            
            {validationErrors.product_price ? (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {validationErrors.product_price}
              </p>
            ) : formData.product_price && (
              <p className="text-blue-600 text-sm mt-2 font-medium">
                Display: {formatKES(formData.product_price)}
              </p>
            )}
          </div>

          {/* Stock Quantity */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Stock Quantity *
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={onInputChange}
                min="0"
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-xl transition-all ${
                  validationErrors.stock ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="100"
              />
            </div>
            
            {/* Stock Level Indicator */}
            <div className="flex justify-between items-center mt-2">
              {validationErrors.stock ? (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.stock}
                </p>
              ) : formData.stock && (
                <div className="flex items-center gap-2">
                  <span className="text-lg">{stockInfo.icon}</span>
                  <span className={`text-sm font-medium text-${stockInfo.color}-600`}>
                    {stockInfo.label}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Low Stock Alert Threshold */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Low Stock Alert
            </label>
            <div className="relative">
              <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-yellow-500" />
              <input
                type="number"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={onInputChange}
                min="0"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 font-medium"
                placeholder="10"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              🔔 Alert when stock falls below this number
            </p>
          </div>
        </div>

        {/* Sale Configuration */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isOnSale"
                checked={formData.isOnSale}
                onChange={(e) => handleSaleToggle(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <div className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-red-600" />
                <span className="font-bold text-gray-900">This product is on sale</span>
              </div>
            </label>
            
            {formData.isOnSale && priceAnalysis.savingsPercent > 0 && (
              <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg font-bold">
                {priceAnalysis.savingsPercent.toFixed(0)}% OFF
              </div>
            )}
          </div>
          
          {showSaleConfig && (
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border-2 border-red-200">
              <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                🔥 Sale Configuration
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Sale Price */}
                <div>
                  <label className="block text-sm font-bold text-red-700 mb-2">
                    Sale Price (KES) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500 font-bold">
                      KES
                    </span>
                    <input
                      type="number"
                      name="salePrice"
                      value={formData.salePrice}
                      onChange={onInputChange}
                      min="0"
                      step="0.01"
                      className={`w-full pl-20 pr-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-red-500 font-bold text-lg transition-all ${
                        validationErrors.salePrice ? 'border-red-500' : 'border-red-300'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  
                  {validationErrors.salePrice ? (
                    <p className="text-red-500 text-sm mt-2">{validationErrors.salePrice}</p>
                  ) : formData.salePrice && (
                    <div className="mt-2 space-y-1">
                      <p className="text-red-600 text-sm font-medium">
                        Sale: {formatKES(formData.salePrice)}
                      </p>
                      {priceAnalysis.savings > 0 && (
                        <p className="text-green-600 text-xs font-medium">
                          💰 Customer saves: {formatKES(priceAnalysis.savings)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Sale Start Date */}
                <div>
                  <label className="block text-sm font-bold text-red-700 mb-2">
                    Sale Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-400" />
                    <input
                      type="date"
                      name="saleStartDate"
                      value={formData.saleStartDate}
                      onChange={onInputChange}
                      className="w-full pl-12 pr-4 py-4 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    📅 Leave empty to start immediately
                  </p>
                </div>
                
                {/* Sale End Date */}
                <div>
                  <label className="block text-sm font-bold text-red-700 mb-2">
                    Sale End Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-400" />
                    <input
                      type="date"
                      name="saleEndDate"
                      value={formData.saleEndDate}
                      onChange={onInputChange}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-red-500 transition-all ${
                        validationErrors.saleEndDate ? 'border-red-500' : 'border-red-300'
                      }`}
                      min={formData.saleStartDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  {validationErrors.saleEndDate && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {validationErrors.saleEndDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Sale Summary */}
              {formData.product_price && formData.salePrice && (
                <div className="mt-6 p-4 bg-white rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-3">🔥 Sale Impact Preview</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-gray-600 line-through">
                        {formatKES(formData.product_price)}
                      </div>
                      <div className="text-xs text-gray-500">Regular Price</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-red-600">
                        {formatKES(formData.salePrice)}
                      </div>
                      <div className="text-xs text-red-600">Sale Price</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        {formatKES(priceAnalysis.savings)}
                      </div>
                      <div className="text-xs text-green-600">Customer Saves</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">
                        {priceAnalysis.savingsPercent.toFixed(0)}%
                      </div>
                      <div className="text-xs text-purple-600">Discount</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product Status & Visibility */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-600" />
            Product Status & Visibility
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Product Status */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={onInputChange}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="active">🟢 Active (Live on site)</option>
                <option value="draft">📝 Draft (Not visible)</option>
                <option value="inactive">🔴 Inactive (Hidden)</option>
              </select>
            </div>

            {/* Featured Product */}
            <div className="flex flex-col justify-center">
              <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={onInputChange}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-900">Featured Product</span>
                </div>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-4">
                🌟 Shows on homepage and gets priority in search
              </p>
            </div>

            {/* New Arrival */}
            <div className="flex flex-col justify-center">
              <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all">
                <input
                  type="checkbox"
                  name="isNewArrival"
                  checked={formData.isNewArrival}
                  onChange={onInputChange}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">New Arrival</span>
                </div>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-4">
                🆕 Shows "New" badge for 30 days
              </p>
            </div>

            {/* Stock Alert Configuration */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Low Stock Alert
              </label>
              <div className="relative">
                <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-yellow-500" />
                <input
                  type="number"
                  name="lowStockThreshold"
                  value={formData.lowStockThreshold}
                  onChange={onInputChange}
                  min="0"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 font-medium"
                  placeholder="10"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                🔔 Get notified when stock falls below this number
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Intelligence Panel */}
        {formData.product_price && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              💰 Pricing Intelligence
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Current Price */}
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-600">
                  {formatKES(formData.product_price)}
                </div>
                <div className="text-sm text-gray-600">Current Price</div>
              </div>
              
              {/* Price Category */}
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-lg font-bold text-purple-600">
                  {priceAnalysis.regularPrice < 1000 ? 'Budget' :
                   priceAnalysis.regularPrice < 5000 ? 'Mid-Range' :
                   priceAnalysis.regularPrice < 20000 ? 'Premium' : 'Enterprise'}
                </div>
                <div className="text-sm text-gray-600">Price Category</div>
              </div>
              
              {/* Estimated Margin */}
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-lg font-bold text-green-600">
                  {formatKES(priceAnalysis.profitMargin)}
                </div>
                <div className="text-sm text-gray-600">Est. Margin (40%)</div>
              </div>
              
              {/* Market Position */}
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-lg font-bold text-orange-600">
                  {priceAnalysis.isCompetitive ? '✅ Good' : '⚠️ Check'}
                </div>
                <div className="text-sm text-gray-600">Market Position</div>
              </div>
            </div>

            {/* Pricing Recommendations */}
            <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <span className="font-medium">💡 Pricing Tips:</span>
                {priceAnalysis.regularPrice < 100 && " Consider bundling with accessories for higher value."}
                {priceAnalysis.regularPrice >= 100 && priceAnalysis.regularPrice < 1000 && " Good entry-level pricing for safety equipment."}
                {priceAnalysis.regularPrice >= 1000 && priceAnalysis.regularPrice < 10000 && " Professional-grade pricing. Highlight quality and certifications."}
                {priceAnalysis.regularPrice >= 10000 && " Premium pricing. Emphasize advanced features and ROI."}
              </p>
            </div>
          </div>
        )}

        {/* Stock Management Intelligence */}
        {formData.stock && (
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              📦 Inventory Intelligence
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Current Stock */}
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className={`text-2xl font-bold text-${stockInfo.color}-600`}>
                  {formData.stock || 0}
                </div>
                <div className="text-sm text-gray-600">Units Available</div>
                <div className="text-xs mt-1 flex items-center justify-center gap-1">
                  <span>{stockInfo.icon}</span>
                  <span className={`text-${stockInfo.color}-600 font-medium`}>
                    {stockInfo.label}
                  </span>
                </div>
              </div>
              
              {/* Days Supply */}
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-lg font-bold text-blue-600">
                  {Math.floor((parseInt(formData.stock) || 0) / 2)}
                </div>
                <div className="text-sm text-gray-600">Days Supply</div>
                <div className="text-xs text-gray-500 mt-1">
                  (Est. 2 units/day)
                </div>
              </div>
              
              {/* Reorder Level */}
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-lg font-bold text-yellow-600">
                  {formData.lowStockThreshold || 10}
                </div>
                <div className="text-sm text-gray-600">Reorder Level</div>
                <div className="text-xs text-gray-500 mt-1">
                  Alert threshold
                </div>
              </div>
              
              {/* Stock Value */}
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-lg font-bold text-purple-600">
                  {formatKES((parseInt(formData.stock) || 0) * (parseFloat(formData.product_price) || 0))}
                </div>
                <div className="text-sm text-gray-600">Total Stock Value</div>
                <div className="text-xs text-gray-500 mt-1">
                  Inventory worth
                </div>
              </div>
            </div>

            {/* Stock Recommendations */}
            <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <span className="font-medium">📊 Stock Recommendations:</span>
                {parseInt(formData.stock) === 0 && " ⚠️ Zero stock - product won't be visible to customers."}
                {parseInt(formData.stock) > 0 && parseInt(formData.stock) <= 5 && " 🚨 Critical stock level - consider immediate reorder."}
                {parseInt(formData.stock) > 5 && parseInt(formData.stock) <= 20 && " ⚠️ Low stock - plan reorder soon."}
                {parseInt(formData.stock) > 20 && parseInt(formData.stock) <= 100 && " ✅ Good stock level for consistent sales."}
                {parseInt(formData.stock) > 100 && " 💪 Excellent stock level - ready for promotions."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPricingInventory;