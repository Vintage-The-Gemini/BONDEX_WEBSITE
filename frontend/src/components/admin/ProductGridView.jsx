// frontend/src/components/admin/ProductGridView.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Star, 
  Image as ImageIcon,
  Package,
  Plus
} from 'lucide-react';

const ProductCard = ({ 
  product, 
  isSelected, 
  onSelect, 
  onDelete, 
  formatPrice, 
  getStatusConfig, 
  getStockStatus 
}) => {
  const statusConfig = getStatusConfig(product.status);
  const stockStatus = getStockStatus(product.stock, product.lowStockThreshold);

  return (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100">
        {product.mainImage || product.product_image ? (
          <img
            src={product.mainImage || product.product_image}
            alt={product.product_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="p-6 bg-gray-200 rounded-full">
              <ImageIcon size={32} className="text-gray-400" />
            </div>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-semibold rounded-full shadow-lg">
              <Star size={12} className="fill-current" />
              Featured
            </span>
          )}
          {product.isOnSale && (
            <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold rounded-full shadow-lg">
              Sale
            </span>
          )}
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium shadow-lg ${statusConfig.color}`}>
            <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></div>
            {statusConfig.text}
          </span>
        </div>

        {/* Selection Checkbox */}
        <div className="absolute top-4 right-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(product._id)}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white shadow-lg"
          />
        </div>

        {/* Quick Actions (Visible on Hover) */}
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Link
            to={`/admin/products/${product._id}`}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-blue-50 transition-colors"
            title="View product"
          >
            <Eye size={16} className="text-blue-600" />
          </Link>
          <Link
            to={`/admin/products/${product._id}/edit`}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            title="Edit product"
          >
            <Edit size={16} className="text-gray-600" />
          </Link>
          <button
            onClick={() => onDelete(product)}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
            title="Delete product"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.product_name}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{product.category?.name || 'No category'}</span>
            {product.product_brand && (
              <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium">
                {product.product_brand}
              </span>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          {product.isOnSale && product.salePrice ? (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-emerald-600">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.product_price)}
              </span>
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                -{Math.round(((product.product_price - product.salePrice) / product.product_price) * 100)}%
              </span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.product_price)}
            </span>
          )}
        </div>

        {/* Stock Info */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Stock Level</span>
            <span className={`text-sm font-bold ${stockStatus.color}`}>
              {product.stock || 0} units
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                stockStatus.level === 'good' ? 'bg-emerald-500' :
                stockStatus.level === 'warning' ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ 
                width: `${Math.min((product.stock / (product.lowStockThreshold || 10)) * 100, 100)}%` 
              }}
            ></div>
          </div>
          <span className={`text-xs ${stockStatus.color} mt-1 block`}>
            {stockStatus.text}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/admin/products/${product._id}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all duration-200 text-sm font-medium"
          >
            <Eye size={14} />
            View
          </Link>
          <Link
            to={`/admin/products/${product._id}/edit`}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 text-sm font-medium"
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
    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6">
      <Package className="w-12 h-12 text-blue-600" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
    <p className="text-gray-600 mb-8 max-w-md text-center leading-relaxed">
      Start building your safety equipment inventory by adding your first product to the catalog.
    </p>
    <Link
      to="/admin/products/create"
      className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
    >
      <Plus size={18} />
      Add Your First Product
    </Link>
  </div>
);

const ProductGridView = ({ 
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard
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

export default ProductGridView;