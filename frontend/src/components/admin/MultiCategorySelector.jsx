// frontend/src/components/admin/MultiCategorySelector.jsx
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Search, 
  Layers, 
  Building,
  AlertCircle,
  Target,
  Zap,
  Tags,
  Filter,
  Plus
} from 'lucide-react';

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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [industrySearch, setIndustrySearch] = useState('');

  // 🎯 SNIPER PRECISION: Load categories with enhanced separation
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (data.success) {
        // 🚀 PRECISION SEPARATION: Protection types vs Industries
        const protection = data.data.filter(cat => 
          cat.type === 'protection_type' && cat.status === 'active'
        ).sort((a, b) => a.sortOrder - b.sortOrder);
        
        const sectors = data.data.filter(cat => 
          cat.type === 'industry' && cat.status === 'active'
        ).sort((a, b) => a.sortOrder - b.sortOrder);
        
        setProtectionTypes(protection);
        setIndustries(sectors);
        
        console.log('🎯 LOADED WITH PRECISION:');
        console.log('Protection Types:', protection.length);
        console.log('Industries/Sectors:', sectors.length);
      }
    } catch (error) {
      console.error('❌ Category loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 PRECISION: Handle protection type selection (single)
  const handleProtectionTypeChange = (typeId) => {
    console.log('🎯 Protection Type Selected:', typeId);
    onProtectionTypeChange(typeId);
    
    // Auto-suggest compatible industries based on protection type
    if (typeId && selectedIndustries.length === 0) {
      suggestCompatibleIndustries(typeId);
    }
  };

  // 🚀 SMART SUGGESTION: Auto-suggest industries based on protection type
  const suggestCompatibleIndustries = (protectionTypeId) => {
    const protectionType = protectionTypes.find(p => p._id === protectionTypeId);
    if (!protectionType) return;

    const suggestions = [];
    const typeName = protectionType.name.toLowerCase();

    // Smart industry suggestions based on protection type
    if (typeName.includes('foot') || typeName.includes('boot')) {
      suggestions.push(
        industries.find(i => i.name.includes('Construction')),
        industries.find(i => i.name.includes('Manufacturing')),
        industries.find(i => i.name.includes('Oil'))
      );
    } else if (typeName.includes('breathing') || typeName.includes('mask')) {
      suggestions.push(
        industries.find(i => i.name.includes('Medical')),
        industries.find(i => i.name.includes('Manufacturing')),
        industries.find(i => i.name.includes('Mining'))
      );
    } else if (typeName.includes('eye') || typeName.includes('goggle')) {
      suggestions.push(
        industries.find(i => i.name.includes('Manufacturing')),
        industries.find(i => i.name.includes('Construction')),
        industries.find(i => i.name.includes('Medical'))
      );
    }

    // Auto-select the most relevant suggestions
    const relevantIds = suggestions.filter(Boolean).slice(0, 2).map(s => s._id);
    if (relevantIds.length > 0) {
      onIndustriesChange(relevantIds);
    }
  };

  // 🎯 PRECISION: Handle industry toggle (multiple selection)
  const handleIndustryToggle = (industryId) => {
    const currentIndustries = selectedIndustries || [];
    const isSelected = currentIndustries.includes(industryId);
    
    let updatedIndustries;
    if (isSelected) {
      updatedIndustries = currentIndustries.filter(id => id !== industryId);
    } else {
      updatedIndustries = [...currentIndustries, industryId];
    }
    
    console.log('🎯 Industries updated:', updatedIndustries.length, 'selected');
    onIndustriesChange(updatedIndustries);
  };

  // 🔍 Filter industries based on search
  const filteredIndustries = industries.filter(industry =>
    industry.name.toLowerCase().includes(industrySearch.toLowerCase()) ||
    industry.description.toLowerCase().includes(industrySearch.toLowerCase())
  );

  // 📊 Get selection stats
  const getSelectionStats = () => {
    const protectionTypeName = protectionTypes.find(p => p._id === selectedProtectionType)?.name;
    return {
      protectionType: protectionTypeName,
      industriesCount: selectedIndustries.length,
      industries: industries
        .filter(i => selectedIndustries.includes(i._id))
        .map(i => i.name)
    };
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const stats = getSelectionStats();

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Multi-Category Classification
          <span className="text-sm bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full font-medium">
            🎯 PRECISION TARGETING
          </span>
        </h2>
        
        {/* Selection Summary */}
        <div className="flex items-center gap-4">
          {stats.protectionType && (
            <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
              Protection: {stats.protectionType}
            </span>
          )}
          {stats.industriesCount > 0 && (
            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
              {stats.industriesCount} Sectors
            </span>
          )}
        </div>
      </div>

      <div className="space-y-8">
        
        {/* STEP 1: Protection Type Selection (Single - REQUIRED) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-600" />
              Step 1: Protection Type *
              <span className="text-sm font-normal text-gray-600">(Required - Select One)</span>
            </label>
            
            {selectedProtectionType && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Selected</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {protectionTypes.map(type => {
              const isSelected = selectedProtectionType === type._id;
              
              return (
                <label
                  key={type._id}
                  className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg transform hover:scale-[1.02] ${
                    isSelected
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="protectionType"
                    value={type._id}
                    checked={isSelected}
                    onChange={() => handleProtectionTypeChange(type._id)}
                    className="sr-only"
                  />
                  
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{type.icon}</span>
                      <span className="font-semibold text-gray-900">{type.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {type.description}
                    </p>
                    {type.productCount > 0 && (
                      <div className="mt-2">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {type.productCount} products
                        </span>
                      </div>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
          
          {errors.protectionType && (
            <p className="text-red-500 text-sm mt-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {errors.protectionType}
            </p>
          )}
        </div>

        {/* STEP 2: Industries/Sectors Selection (Multiple - REQUIRED) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Building className="h-5 w-5 text-green-600" />
              Step 2: Industries/Sectors *
              <span className="text-sm font-normal text-gray-600">(Select All Applicable)</span>
            </label>
            
            <div className="flex items-center gap-4">
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                selectedIndustries.length > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {selectedIndustries.length} selected
              </span>
              
              {selectedIndustries.length > 0 && (
                <button
                  type="button"
                  onClick={() => onIndustriesChange([])}
                  className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline"
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
              placeholder="Search industries and sectors..."
              value={industrySearch}
              onChange={(e) => setIndustrySearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
            {filteredIndustries.map(industry => {
              const isSelected = selectedIndustries.includes(industry._id);
              
              return (
                <label
                  key={industry._id}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg transform hover:scale-[1.02] ${
                    isSelected
                      ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-md'
                      : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleIndustryToggle(industry._id)}
                    className="sr-only"
                  />
                  
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  )}
                  
                  <div className="flex-1 relative">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{industry.icon}</span>
                      <span className="font-semibold text-gray-900">{industry.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {industry.description}
                    </p>
                    
                    {/* Industry stats */}
                    <div className="mt-3 flex items-center gap-2">
                      {industry.productCount > 0 && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {industry.productCount} products
                        </span>
                      )}
                      
                      {isSelected && (
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">
                          ✓ Active
                        </span>
                      )}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
          
          {errors.industries && (
            <p className="text-red-500 text-sm mt-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {errors.industries}
            </p>
          )}
        </div>

        {/* 🎯 PRECISION: Classification Preview & Cross-Reference */}
        {selectedProtectionType && selectedIndustries.length > 0 && (
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 rounded-xl border-2 border-purple-200 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              🎯 Multi-Category Classification Summary
            </h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Primary Classification */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-purple-700">Primary Protection:</span>
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                    <span className="text-lg">
                      {protectionTypes.find(p => p._id === selectedProtectionType)?.icon}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {protectionTypes.find(p => p._id === selectedProtectionType)?.name}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="text-sm font-bold text-green-700 min-w-fit">
                    Target Sectors ({selectedIndustries.length}):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {industries
                      .filter(i => selectedIndustries.includes(i._id))
                      .map(industry => (
                        <div 
                          key={industry._id}
                          className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm"
                        >
                          <span>{industry.icon}</span>
                          <span className="text-sm font-medium text-gray-900">
                            {industry.name}
                          </span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>

              {/* Cross-Category Intelligence */}
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Smart Targeting
                </h5>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Market Reach:</span>
                    <span className="font-semibold text-blue-600">
                      {selectedIndustries.length === 1 ? 'Specialized' : 
                       selectedIndustries.length <= 3 ? 'Multi-Sector' : 'Universal'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">SEO Impact:</span>
                    <span className="font-semibold text-green-600">
                      {selectedIndustries.length > 0 ? 'Enhanced' : 'Basic'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Filter Coverage:</span>
                    <span className="font-semibold text-purple-600">
                      {selectedIndustries.length + 1} paths
                    </span>
                  </div>
                </div>
                
                {/* Quick Action Suggestions */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">💡 Optimization Tips:</p>
                  <div className="space-y-1 text-xs text-gray-600">
                    {selectedIndustries.length === 1 && (
                      <p>• Consider adding 1-2 more sectors for broader reach</p>
                    )}
                    {selectedIndustries.length > 5 && (
                      <p>• Too many sectors may dilute targeting</p>
                    )}
                    {selectedIndustries.length >= 2 && selectedIndustries.length <= 4 && (
                      <p>• ✅ Perfect balance for multi-sector products</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Preview */}
            <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Product Classification:</span>
                <span className="ml-2">
                  This product will be discoverable through {selectedIndustries.length + 1} different filter paths:
                </span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Protection → {stats.protectionType}
                </span>
                {stats.industries.map((industryName, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                  >
                    Sector → {industryName}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Smart Suggestions */}
        {selectedProtectionType && selectedIndustries.length === 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-yellow-800">Smart Suggestions</span>
            </div>
            <p className="text-sm text-yellow-700 mb-3">
              Based on your protection type selection, consider these compatible industries:
            </p>
            
            <div className="flex flex-wrap gap-2">
              {/* This would show suggested industries based on protection type */}
              <button
                type="button"
                onClick={() => suggestCompatibleIndustries(selectedProtectionType)}
                className="text-xs bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full hover:bg-yellow-300 transition-colors"
              >
                Auto-suggest sectors
              </button>
            </div>
          </div>
        )}

        {/* Validation Summary */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              selectedProtectionType && selectedIndustries.length > 0 
                ? 'bg-green-500' 
                : 'bg-red-500'
            }`}></div>
            <span className="text-sm font-medium text-gray-700">
              Classification Status
            </span>
          </div>
          
          <div className="text-sm">
            {selectedProtectionType && selectedIndustries.length > 0 ? (
              <span className="text-green-600 font-semibold">✅ Ready for SEO optimization</span>
            ) : (
              <span className="text-red-600 font-semibold">❌ Complete both selections</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiCategorySelector;