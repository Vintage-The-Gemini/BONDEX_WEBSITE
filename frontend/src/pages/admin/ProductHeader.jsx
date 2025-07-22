// frontend/src/components/admin/ProductHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';

const ProductHeader = ({ totalProducts, refreshing, onRefresh }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
      <div className="px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Product Inventory
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Manage your safety equipment catalog • {totalProducts} total products
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            
            <Link
              to="/admin/products/create"
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
            >
              <Plus size={18} />
              Add Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;