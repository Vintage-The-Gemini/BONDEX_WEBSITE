// frontend/src/components/ProductFilters.jsx
import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';

const ProductFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  categories = [],
  showMobile = false,
  onToggleMobile 
}) => {
  
  // Get protection types from categories
  const protectionTypes = categories
    .filter(cat => cat.type === 'protection_type')
    .map(cat => ({
      value: cat._id,
      label: cat.name,
      icon: cat.icon
    }));

  // Get industries from categories  
  const industries = categories
    .filter(cat => cat.type === 'industry')
    .map(cat => ({
      value: cat._id,
      label: cat.name,
      icon: cat.icon
    }));

  const priceRanges = [
    { label: 'Under KES 500', min: 0, max: 500 },
    { label: 'KES 500 - 1,000', min: 500, max: 1000 },
    { label: 'KES 1,000 - 2,500', min: 1000, max: 2500 },
    { label: 'KES 2,500 - 5,000', min: 2500, max: 5000 },
    { label: 'Over KES 5,000', min: 5000, max: 50000 }
  ];

  // Check if filters are active
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'page' || key === 'limit' || key === 'sortBy') return false;
    return value && value.toString().trim();
  });

  const FilterSection = ({ title, children }) => (
    <div className="mb-6">
      <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
      {children}
    </div>
  );

  const sidebarContent = (
    <div className="space-y-6">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="w-full text-center text-orange-600 hover:text-orange-700 font-medium py-2 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
        >
          Clear All Filters
        </button>
      )}

      {/* Protection Types */}
      <FilterSection title="Protection Types">
        <div className="space-y-2">
          {protectionTypes.map(type => (
            <label key={type.value} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="protectionType"
                value={type.value}
                checked={filters.protectionType === type.value}
                onChange={(e) => onFilterChange('protectionType', e.target.value)}
                className="text-orange-500 focus:ring-orange-500 border-gray-300"
              />
              <span className="ml-3 flex items-center">
                <span className="text-lg mr-2">{type.icon}</span>
                <span className="text-gray-700 group-hover:text-orange-600 transition-colors">
                  {type.label}
                </span>
              </span>
            </label>
          ))}
          {filters.protectionType && (
            <button
              onClick={() => onFilterChange('protectionType', '')}
              className="text-sm text-gray-500 hover:text-orange-600 ml-6"
            >
              Clear selection
            </button>
          )}
        </div>
      </FilterSection>

      {/* Industries */}
      <FilterSection title="Industries">
        <div className="space-y-2">
          {industries.map(industry => (
            <label key={industry.value} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="industry"
                value={industry.value}
                checked={filters.industry === industry.value}
                onChange={(e) => onFilterChange('industry', e.target.value)}
                className="text-orange-500 focus:ring-orange-500 border-gray-300"
              />
              <span className="ml-3 flex items-center">
                <span className="text-lg mr-2">{industry.icon}</span>
                <span className="text-gray-700 group-hover:text-orange-600 transition-colors">
                  {industry.label}
                </span>
              </span>
            </label>
          ))}
          {filters.industry && (
            <button
              onClick={() => onFilterChange('industry', '')}
              className="text-sm text-gray-500 hover:text-orange-600 ml-6"
            >
              Clear selection
            </button>
          )}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-2">
          {priceRanges.map((range, index) => (
            <label key={index} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="priceRange"
                checked={filters.minPrice == range.min && filters.maxPrice == range.max}
                onChange={() => {
                  onFilterChange('minPrice', range.min);
                  onFilterChange('maxPrice', range.max);
                }}
                className="text-orange-500 focus:ring-orange-500 border-gray-300"
              />
              <span className="ml-3 text-gray-700 group-hover:text-orange-600 transition-colors">
                {range.label}
              </span>
            </label>
          ))}
          
          {/* Custom Price Range */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Custom Range (KES)</p>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => onFilterChange('minPrice', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <SlidersHorizontal className="h-5 w-5 text-gray-400" />
          </div>
          {sidebarContent}
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={onToggleMobile}
          className="flex items-center justify-center w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          <span>Filters & Sort</span>
          {hasActiveFilters && (
            <span className="ml-2 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
              {Object.values(filters).filter(v => v && v.toString().trim()).length}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filter Panel */}
      {showMobile && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onToggleMobile} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={onToggleMobile}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductFilters;