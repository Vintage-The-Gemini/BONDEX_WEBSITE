// frontend/src/components/admin/AdminProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  Edit, 
  Star, 
  Image as ImageIcon,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const AdminProductCard = ({ 
  product, 
  isSelected, 
  onSelect, 
  formatPrice, 
  getStatusConfig, 
  getStockStatus 
}) => {
  const statusConfig = getStatusConfig(product.status);
  const stockStatus = getStockStatus(product.stock, product.lowStockThreshold);

  return (
    <div className={`group relative bg-white rounded-xl border-2 overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer ${
      isSelected 
        ? 'border-orange-500 shadow-lg' 
        : 'border-gray-100 hover:border-orange-200'
    }`}>
      
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(product._id)}
          className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
        />
      </div>

      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {product.mainImage || product.product_image ? (
          <img
            src={product.mainImage || product.product_image}
            alt={product.product_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={24} className="text-gray-400" />
          </div>
        )}
        
        {/* Status & Featured Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
              <Star size={10} className="fill-current" />
              Featured
            </span>
          )}
          
          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full shadow-sm ${
            product.status === 'active' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : product.status === 'draft'
              ? 'bg-orange-100 text-orange-700 border border-orange-200'
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {product.status === 'active' && <CheckCircle size={10} />}
            {product.status === 'draft' && <Clock size={10} />}
            {product.status === 'inactive' && <AlertTriangle size={10} />}
            {product.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Name & Category */}
        <div className="mb-3">
          <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
            {product.product_name}
          </h3>
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {product.protectionType}
          </p>
        </div>

        {/* Price & Stock Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              stockStatus.level === 'good' ? 'bg-green-500' :
              stockStatus.level === 'warning' ? 'bg-orange-500' : 'bg-red-500'
            }`}></div>
            <span className={`text-xs font-medium ${stockStatus.color}`}>
              {product.stock} units
            </span>
          </div>
        </div>

        {/* Stock Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                stockStatus.level === 'good' ? 'bg-green-500' :
                stockStatus.level === 'warning' ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ 
                width: `${Math.min((product.stock / (product.lowStockThreshold || 10)) * 100, 100)}%` 
              }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/admin/products/${product._id}`}
            className="flex items-center justify-center gap-1 py-2 px-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-all duration-200 text-sm font-medium border border-orange-200"
          >
            <Eye size={14} />
            View
          </Link>
          <Link
            to={`/admin/products/${product._id}/edit`}
            className="flex items-center justify-center gap-1 py-2 px-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-all duration-200 text-sm font-medium"
          >
            <Edit size={14} />
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center py-20">
    <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-6">
      <Package className="w-12 h-12 text-orange-600" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
    <p className="text-gray-600 mb-8 max-w-md text-center leading-relaxed">
      Start building your safety equipment inventory by adding your first product to the catalog.
    </p>
    <Link
      to="/admin/products/create"
      className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-black text-white rounded-xl hover:from-orange-600 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
    >
      <Plus size={18} />
      Add Your First Product
    </Link>
  </div>
);

const AdminProductGridView = ({ 
  products, 
  selectedProducts, 
  onProductSelect, 
  onProductDelete, 
  formatPrice, 
  getStatusConfig, 
  getStockStatus 
}) => {
  if (products.length === 0) {
    return (
      <div className="grid grid-cols-1">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {products.map((product) => (
        <AdminProductCard
          key={product._id}
          product={product}
          isSelected={selectedProducts.includes(product._id)}
          onSelect={onProductSelect}
          onDelete={onProductDelete}
          formatPrice={formatPrice}
          getStatusConfig={getStatusConfig}
          getStockStatus={getStockStatus}
        />
      ))}
    </div>
  );
};

export default AdminProductGridView;