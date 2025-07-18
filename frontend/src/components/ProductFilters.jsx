// src/components/ProductFilters.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star, X } from 'lucide-react';

const ProductFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  productCount 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    industry: true,
    brand: false,
    price: true,
    features: false,
    rating: true,
    availability: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const filterSections = [
    {
      key: 'category',
      title: 'Protection Type',
      items: [
        'Head Protection',
        'Foot Protection', 
        'Eye Protection',
        'Hand Protection',
        'Breathing Protection',
        'Workwear'
      ]
    },
    {
      key: 'industry',
      title: 'Industry',
      items: [
        'Construction',
        'Medical',
        'Manufacturing',
        'Oil & Gas',
        'Mining',
        'Agriculture'
      ]
    },
    {
      key: 'brand',
      title: 'Brand',
      items: [
        'SafetyFirst',
        'SteelGuard',
        'VisionSafe',
        'ChemGuard',
        'VisiBright',
        'BreatheSafe',
        'CutShield',
        'AirGuard'
      ]
    }
  ];

  const FilterSection = ({ section, title, children }) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
      >
        <span>{title}</span>
        {expandedSections[section] ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      {expandedSections[section] && children}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Filters ({productCount} products)
        </h3>
        <button
          onClick={onClearFilters}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
        >
          <X className="h-4 w-4" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Active Filters */}
      {(filters.selectedCategories.length > 0 || 
        filters.selectedIndustries.length > 0 || 
        filters.selectedBrands.length > 0) && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {[...filters.selectedCategories, ...filters.selectedIndustries, ...filters.selectedBrands].map((filter, index) => (
              <span
                key={index}
                className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1"
              >
                <span>{filter}</span>
                <button
                  onClick={() => {
                    if (filters.selectedCategories.includes(filter)) {
                      onFilterChange('selectedCategories', filters.selectedCategories.filter(c => c !== filter));
                    } else if (filters.selectedIndustries.includes(filter)) {
                      onFilterChange('selectedIndustries', filters.selectedIndustries.filter(i => i !== filter));
                    } else if (filters.selectedBrands.includes(filter)) {
                      onFilterChange('selectedBrands', filters.selectedBrands.filter(b => b !== filter));
                    }
                  }}
                  className="text-primary-600 hover:text-primary-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filter Sections */}
      {filterSections.map(({ key, title, items }) => (
        <FilterSection key={key} section={key} title={title}>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {items.map(item => {
              const isSelected = filters[`selected${key.charAt(0).toUpperCase() + key.slice(1)}s`]?.includes(item);
              return (
                <label key={item} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const filterKey = `selected${key.charAt(0).toUpperCase() + key.slice(1)}s`;
                      const currentFilters = filters[filterKey] || [];
                      const newFilters = e.target.checked
                        ? [...currentFilters, item]
                        : currentFilters.filter(f => f !== item);
                      onFilterChange(filterKey, newFilters);
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{item}</span>
                </label>
              );
            })}
          </div>
        </FilterSection>
      ))}

      {/* Price Range */}
      <FilterSection section="price" title="Price Range (KES)">
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange[0]}
              onChange={(e) => onFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange[1]}
              onChange={(e) => onFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 50000])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <input
            type="range"
            min="0"
            max="50000"
            step="100"
            value={filters.priceRange[1]}
            onChange={(e) => onFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatPrice(filters.priceRange[0])}</span>
            <span>{formatPrice(filters.priceRange[1])}</span>
          </div>
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection section="rating" title="Minimum Rating">
        <div className="space-y-2">
          {[4, 3, 2, 1].map(rating => (
            <label key={rating} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.selectedRating === rating}
                onChange={() => onFilterChange('selectedRating', rating)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <div className="ml-2 flex items-center">
                {renderStars(rating)}
                <span className="ml-1 text-sm text-gray-700">& up</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection section="availability" title="Availability">
        <div className="space-y-3">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => onFilterChange('inStockOnly', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
          </label>
          
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.onSaleOnly}
              onChange={(e) => onFilterChange('onSaleOnly', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">On Sale Only</span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.freeShipping}
              onChange={(e) => onFilterChange('freeShipping', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Free Shipping</span>
          </label>
        </div>
      </FilterSection>

      {/* Quick Filters */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Quick Filters</h4>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Best Sellers', filter: 'bestSellers' },
            { label: 'New Arrivals', filter: 'newArrivals' },
            { label: 'Premium Quality', filter: 'premium' },
            { label: 'Bulk Discounts', filter: 'bulkDiscount' }
          ].map(({ label, filter }) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter, !filters[filter])}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filters[filter]
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;