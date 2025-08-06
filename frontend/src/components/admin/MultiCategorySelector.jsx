// frontend/src/components/admin/MultiCategorySelector.jsx
import React, { useState, useEffect } from 'react';
import { CheckCircle, Search, Layers, Building } from 'lucide-react';

const MultiCategorySelector = ({ 
  selectedProtectionType, 
  selectedIndustries = [], 
  onProtectionTypeChange, 
  onIndustriesChange,
  errors = {}
}) => {
  const [protectionTypes, setProtectionTypes] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch categories with PRECISION separation
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (data.success) {
        // SNIPER PRECISION: Separate protection types and industries
        const protection = data.data.filter(cat => 
          cat.type === 'protection_type' || 
          ['Head Protection', 'Eye Protection', 'Hand Protection', 'Foot Protection', 'Breathing Protection', 'High-Vis Clothing', 'Workwear & Clothing'].includes(cat.name)
        );
        
        const sectors = data.data.filter(cat => 
          cat.type === 'industry' || 
          ['Medical & Healthcare', 'Construction & Building', 'Manufacturing & Industrial', 'Oil & Gas', 'Mining', 'Agriculture', 'Transportation', 'Food Processing'].includes(cat.name)
        );
        
        setProtectionTypes(protection);
        setIndustries(sectors);
        
        console.log('🎯 PRECISION LOADED:');
        console.log('Protection Types:', protection.length);
        console.log('Industries:', sectors.length);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle industry toggle (multiple selection)
  const handleIndustryToggle = (industryId) => {
    const currentIndustries = selectedIndustries || [];
    const isSelected = currentIndustries.includes(industryId);
    
    let updatedIndustries;
    if (isSelected) {
      updatedIndustries = currentIndustries.filter(id => id !== industryId);
    } else {
      updatedIndustries = [...currentIndustries, industryId];
    }
    
    console.log('🎯 Industries updated:', updatedIndustries);
    onIndustriesChange(updatedIndustries);
  };

  // Filter industries based on search
  const filteredIndustries = industries.filter(industry =>
    industry.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Layers className="h-5 w-5 text-purple-600" />
        Multi-Category Classification
        <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
          🎯 SNIPER PRECISION
        </span>
      </h2>
      
      {/* Protection Type Selection (Single - REQUIRED) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium text-gray-700">
            Protection Type * (Select One)
          </label>
          {selectedProtectionType && (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              Selected
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {protectionTypes.map(type => (
            <label
              key={type._id}
              className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                selectedProtectionType === type._id 
                  ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200' 
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <input
                type="radio"
                name="protectionType"
                value={type._id}
                checked={selectedProtectionType === type._id}
                onChange={(e) => onProtectionTypeChange(e.target.value)}
                className="sr-only"
              />
              
              <div className="flex items-center w-full">
                <span className="text-3xl mr-3">{type.icon || '🛡️'}</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{type.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {type.description?.substring(0, 40)}...
                  </div>
                </div>
                {selectedProtectionType === type._id && (
                  <CheckCircle className="h-5 w-5 text-purple-600 ml-2" />
                )}
              </div>
            </label>
          ))}
        </div>
        
        {errors.protectionType && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.protectionType}
          </p>
        )}
      </div>

      {/* Industries/Sectors Selection (Multiple - REQUIRED) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium text-gray-700">
            Industries/Sectors * (Select All Applicable)
          </label>
          <div className="flex items-center gap-4">
            <span className="text-sm text-blue-600 font-medium">
              {selectedIndustries.length} selected
            </span>
            {selectedIndustries.length > 0 && (
              <button
                type="button"
                onClick={() => onIndustriesChange([])}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Industry Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search industries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
          {filteredIndustries.map(industry => {
            const isSelected = selectedIndustries.includes(industry._id);
            
            return (
              <label
                key={industry._id}
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                  isSelected
                    ? 'border-green-500 bg-green-50 ring-2 ring-green-200' 
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleIndustryToggle(industry._id)}
                  className="sr-only"
                />
                
                <div className="flex items-center w-full">
                  <span className="text-3xl mr-3">{industry.icon || '🏭'}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{industry.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {industry.description?.substring(0, 50)}...
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
                  )}
                </div>
              </label>
            );
          })}
        </div>
        
        {errors.industries && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.industries}
          </p>
        )}

        {/* Selected Industries Summary */}
        {selectedIndustries.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Selected Industries:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedIndustries.map(industryId => {
                const industry = industries.find(i => i._id === industryId);
                return industry ? (
                  <span
                    key={industryId}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    <span>{industry.icon}</span>
                    <span>{industry.name}</span>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Classification Preview */}
        {selectedProtectionType && selectedIndustries.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-green-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              🎯 Classification Summary
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-purple-700">Protection Type:</span>
                <span className="text-gray-700">
                  {protectionTypes.find(p => p._id === selectedProtectionType)?.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-green-700">Industries ({selectedIndustries.length}):</span>
                <span className="text-gray-700">
                  {industries
                    .filter(i => selectedIndustries.includes(i._id))
                    .map(i => i.name)
                    .join(', ')
                  }
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiCategorySelector;