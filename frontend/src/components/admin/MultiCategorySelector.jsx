// frontend/src/components/admin/MultiCategorySelector.jsx - FIXED TO MATCH YOUR CREATEPRODUCT
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
  formData,
  onFormDataChange,
  categories = [],
  validationErrors = {}
}) => {
  const [protectionTypes, setProtectionTypes] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [industrySearch, setIndustrySearch] = useState('');

  // Process categories when they change
  useEffect(() => {
    if (categories && categories.length > 0) {
      console.log('🎯 Processing categories:', categories.length);
      
      // 🔧 FIX: Match your database types
      const protection = categories.filter(cat => 
        cat.type === 'protection_type' && cat.status === 'active' // ✅ Changed to protection_type
      ).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      
      const sectors = categories.filter(cat => 
        (cat.type === 'industry' || cat.type === 'sector') && cat.status === 'active' // ✅ Added sector as backup
      ).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      
      setProtectionTypes(protection);
      setIndustries(sectors);
      
      console.log('🎯 LOADED:');
      console.log('Protection Types:', protection.length);
      console.log('Industries/Sectors:', sectors.length);
      console.log('Sample protection type:', protection[0]?.name, protection[0]?.type);
      console.log('Sample industry:', sectors[0]?.name, sectors[0]?.type);
    } else {
      console.log('⚠️ No categories available');
      setProtectionTypes([]);
      setIndustries([]);
    }
  }, [categories]);

  // Handle protection type selection (single)
  const handleProtectionTypeChange = (typeId) => {
    console.log('🎯 Protection Type Selected:', typeId);
    onFormDataChange('category', typeId);
  };

  // Handle industry toggle (multiple selection)
  const handleIndustryToggle = (industryId) => {
    const currentIndustries = formData.industries || [];
    const isSelected = currentIndustries.includes(industryId);
    
    let updatedIndustries;
    if (isSelected) {
      updatedIndustries = currentIndustries.filter(id => id !== industryId);
    } else {
      updatedIndustries = [...currentIndustries, industryId];
    }
    
    console.log('🎯 Industries updated:', updatedIndustries.length, 'selected');
    onFormDataChange('industries', updatedIndustries);
  };

  // Filter functions
  const filteredProtectionTypes = protectionTypes.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (type.description && type.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredIndustries = industries.filter(industry =>
    industry.name.toLowerCase().includes(industrySearch.toLowerCase()) ||
    (industry.description && industry.description.toLowerCase().includes(industrySearch.toLowerCase()))
  );

  // Get selection stats
  const getSelectionStats = () => {
    const protectionTypeName = protectionTypes.find(p => p._id === formData.category)?.name;
    return {
      protectionType: protectionTypeName,
      industriesCount: (formData.industries || []).length,
      industries: industries
        .filter(i => (formData.industries || []).includes(i._id))
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
    <div className="bg-white rounded-xl shadow-lg border p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900">Multi-Category Classification</h2>
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            🎯 PRECISION TARGETING
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-600">
            {(formData.industries || []).length} Sectors
          </div>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* STEP 1: Protection Type Selection (Single - REQUIRED) */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600" />
            Step 1: Protection Type *
            <span className="text-sm font-normal text-gray-600">(Required - Select One)</span>
          </label>

          {/* Search Protection Types */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="🔍 Search protection types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          
          {/* Protection Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {filteredProtectionTypes.length > 0 ? (
              filteredProtectionTypes.map(type => {
                const isSelected = formData.category === type._id;
                
                return (
                  <label
                    key={type._id}
                    className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg transform hover:scale-[1.02] ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
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
                    
                    {isSelected && (
                      <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-blue-600" />
                    )}
                    
                    <div className="text-center">
                      <div className="text-3xl mb-3">
                        {type.icon || '🛡️'}
                      </div>
                      
                      <h3 className={`font-semibold text-sm mb-2 ${
                        isSelected ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {type.name}
                      </h3>
                      
                      {type.description && (
                        <p className={`text-xs leading-relaxed ${
                          isSelected ? 'text-blue-700' : 'text-gray-600'
                        }`}>
                          {type.description}
                        </p>
                      )}
                    </div>
                  </label>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                {protectionTypes.length === 0 ? (
                  <div className="space-y-2">
                    <AlertCircle className="h-8 w-8 mx-auto text-orange-500" />
                    <p className="font-medium">No protection types available</p>
                    <p className="text-sm">Please add protection categories first</p>
                  </div>
                ) : (
                  <p>No protection types match your search</p>
                )}
              </div>
            )}
          </div>

          {/* Validation Error */}
          {validationErrors.category && (
            <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              {validationErrors.category}
            </div>
          )}
        </div>

        {/* STEP 2: Industries/Sectors Selection (Multiple - REQUIRED) */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Building className="h-5 w-5 text-green-600" />
            Step 2: Industries/Sectors *
            <span className="text-sm font-normal text-gray-600">(Select All Applicable)</span>
            <div className="ml-auto text-right">
              <span className="text-sm font-medium text-green-600">
                {(formData.industries || []).length} selected
              </span>
            </div>
          </label>

          {/* Search Industries */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="🔍 Search industries and sectors..."
              value={industrySearch}
              onChange={(e) => setIndustrySearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            />
          </div>
          
          {/* Industries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredIndustries.length > 0 ? (
              filteredIndustries.map(industry => {
                const isSelected = (formData.industries || []).includes(industry._id);
                
                return (
                  <label
                    key={industry._id}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      isSelected
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleIndustryToggle(industry._id)}
                      className="sr-only"
                    />
                    
                    <div className={`flex-shrink-0 w-6 h-6 border-2 rounded flex items-center justify-center ${
                      isSelected 
                        ? 'border-green-500 bg-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <CheckCircle className="h-4 w-4 text-white" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {industry.icon || '🏭'}
                        </span>
                        <span className={`font-medium text-sm truncate ${
                          isSelected ? 'text-green-900' : 'text-gray-900'
                        }`}>
                          {industry.name}
                        </span>
                      </div>
                      
                      {industry.description && (
                        <p className={`text-xs mt-1 ${
                          isSelected ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          {industry.description}
                        </p>
                      )}
                    </div>
                  </label>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                {industries.length === 0 ? (
                  <div className="space-y-2">
                    <AlertCircle className="h-8 w-8 mx-auto text-orange-500" />
                    <p className="font-medium">No industries available</p>
                    <p className="text-sm">Please add industry categories first</p>
                  </div>
                ) : (
                  <p>No industries match your search</p>
                )}
              </div>
            )}
          </div>

          {/* Validation Error */}
          {validationErrors.industries && (
            <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              {validationErrors.industries}
            </div>
          )}
        </div>

        {/* Classification Status */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Classification Status</span>
            </div>
            
            <div className="flex items-center gap-2">
              {formData.category && (formData.industries || []).length > 0 ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">
                    ✅ Complete both selections
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600">
                    ❌ Complete both selections
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Selection Summary */}
        {formData.category && (formData.industries || []).length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              🎯 Multi-Category Classification Summary
            </h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Primary Classification */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-blue-700">Primary Protection:</span>
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                    <span className="text-lg">
                      {protectionTypes.find(p => p._id === formData.category)?.icon || '🛡️'}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {protectionTypes.find(p => p._id === formData.category)?.name}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-bold text-green-700">Target Industries:</span>
                  <div className="flex flex-wrap gap-2">
                    {(formData.industries || []).map(industryId => {
                      const industry = industries.find(i => i._id === industryId);
                      return industry ? (
                        <div key={industryId} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                          <span className="text-sm">{industry.icon || '🏭'}</span>
                          <span className="text-sm font-medium text-gray-900">{industry.name}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>

              {/* Multi-Category Advantages */}
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  🚀 Multi-Category Advantages
                </h5>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {1 + (formData.industries || []).length}
                    </div>
                    <div className="text-xs text-blue-700 font-medium">Discovery Paths</div>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {(formData.industries || []).length}x
                    </div>
                    <div className="text-xs text-green-700 font-medium">Industry Reach</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiCategorySelector;