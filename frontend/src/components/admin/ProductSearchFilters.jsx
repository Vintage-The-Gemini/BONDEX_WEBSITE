// frontend/src/components/admin/ProductSearchFilters.jsx
import React from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Grid3X3, 
  List, 
  SortAsc,
  SortDesc,
  Download,
  Upload
} from 'lucide-react';

const ProductSearchFilters = ({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  categories,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode,
  onClearFilters,
  hasActiveFilters,
  onExport,
  onImport
}) => {
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search Section */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products by name, brand, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-wrap gap-4">
          {/* Category Filter */}
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-w-[160px]"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-w-[140px]"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <div className={`w-2 h-2 rounded-full ${
                filterStatus === 'active' ? 'bg-green-500' :
                filterStatus === 'inactive' ? 'bg-red-500' :
                filterStatus === 'draft' ? 'bg-yellow-500' :
                filterStatus === 'out_of_stock' ? 'bg-gray-500' : 'bg-gray-300'
              }`}></div>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => handleSortChange('product_name')}
              className={`px-4 py-4 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                sortBy === 'product_name' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Name
              {sortBy === 'product_name' && (
                sortOrder === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
              )}
            </button>
            <button
              onClick={() => handleSortChange('product_price')}
              className={`px-4 py-4 text-sm font-medium transition-all duration-200 flex items-center gap-2 border-l border-gray-200 ${
                sortBy === 'product_price' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Price
              {sortBy === 'product_price' && (
                sortOrder === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
              )}
            </button>
            <button
              onClick={() => handleSortChange('stock')}
              className={`px-4 py-4 text-sm font-medium transition-all duration-200 flex items-center gap-2 border-l border-gray-200 ${
                sortBy === 'stock' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Stock
              {sortBy === 'stock' && (
                sortOrder === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
              )}
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-4 transition-all duration-200 ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-4 transition-all duration-200 border-l border-gray-200 ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Grid3X3 size={18} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onExport}
              className="px-4 py-4 bg-green-50 text-green-700 border border-green-200 rounded-xl hover:bg-green-100 transition-all duration-200 flex items-center gap-2"
              title="Export Products"
            >
              <Download size={16} />
            </button>
            <button
              onClick={onImport}
              className="px-4 py-4 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl hover:bg-purple-100 transition-all duration-200 flex items-center gap-2"
              title="Import Products"
            >
              <Upload size={16} />
            </button>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="px-4 py-4 bg-red-50 text-red-700 border border-red-200 rounded-xl hover:bg-red-100 transition-all duration-200 flex items-center gap-2"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-600">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="hover:text-blue-600">
                  <X size={12} />
                </button>
              </span>
            )}
            {filterCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm">
                Category: {categories.find(c => c._id === filterCategory)?.name}
                <button onClick={() => setFilterCategory('')} className="hover:text-purple-600">
                  <X size={12} />
                </button>
              </span>
            )}
            {filterStatus && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm">
                Status: {filterStatus}
                <button onClick={() => setFilterStatus('')} className="hover:text-green-600">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearchFilters;