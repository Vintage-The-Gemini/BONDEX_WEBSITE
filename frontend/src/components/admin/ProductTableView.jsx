// frontend/src/components/admin/ProductTableView.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Star, 
  Image as ImageIcon,
  SortAsc,
  SortDesc,
  Package,
  Plus
} from 'lucide-react';

const TableHeader = ({ sortBy, sortOrder, onSortChange, onSelectAll, selectedCount, totalCount }) => (
  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
    <tr>
      <th className="px-6 py-4 text-left w-12">
        <input
          type="checkbox"
          checked={selectedCount === totalCount && totalCount > 0}
          onChange={onSelectAll}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
        />
      </th>
      <th 
        className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors rounded-lg"
        onClick={() => onSortChange('stock')}
      >
        <div className="flex items-center gap-2">
          Stock Level
          {sortBy === 'stock' && (
            <div className="text-blue-600">
              {sortOrder === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />}
            </div>
          )}
        </div>
      </th>
      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
        Status & Features
      </th>
      <th 
        className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors rounded-lg"
        onClick={() => onSortChange('createdAt')}
      >
        <div className="flex items-center gap-2">
          Created Date
          {sortBy === 'createdAt' && (
            <div className="text-blue-600">
              {sortOrder === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />}
            </div>
          )}
        </div>
      </th>
      <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
        Actions
      </th>
    </tr>
  </thead>
);

const ProductRow = ({ 
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
    <tr className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200 group">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(product._id)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
        />
      </td>
      
      {/* Product Details */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-16 h-16 relative">
            {product.mainImage || product.product_image ? (
              <img
                src={product.mainImage || product.product_image}
                alt={product.product_name}
                className="w-16 h-16 rounded-xl object-cover border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow duration-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border border-gray-200">
                <ImageIcon size={24} className="text-gray-400" />
              </div>
            )}
            {/* Small status indicator on image */}
            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${statusConfig.dot}`}></div>
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {product.product_name}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  {product.category?.name || 'No category'}
                </p>
                {product.product_brand && (
                  <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                    {product.product_brand}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="px-6 py-4">
        <div className="text-sm">
          {product.isOnSale && product.salePrice ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold text-emerald-600">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                  -{Math.round(((product.product_price - product.salePrice) / product.product_price) * 100)}%
                </span>
              </div>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.product_price)}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.product_price)}
            </span>
          )}
        </div>
      </td>

      {/* Stock */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-bold ${stockStatus.color}`}>
                {product.stock || 0}
              </span>
              <span className={`text-xs ${stockStatus.color}`}>
                {stockStatus.text}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  stockStatus.level === 'good' ? 'bg-emerald-500' :
                  stockStatus.level === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ 
                  width: `${Math.min((product.stock / Math.max(product.lowStockThreshold || 10, 1)) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </td>

      {/* Status & Features */}
      <td className="px-6 py-4">
        <div className="flex flex-col gap-2">
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color} w-fit`}>
            <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></div>
            {statusConfig.text}
          </span>
          
          <div className="flex items-center gap-1">
            {product.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                <Star size={10} className="fill-current" />
                Featured
              </span>
            )}
            {product.isOnSale && (
              <span className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                Sale
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Created Date */}
      <td className="px-6 py-4 text-sm text-gray-600">
        {new Date(product.createdAt).toLocaleDateString('en-KE', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/admin/products/${product._id}`}
            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
            title="View product details"
          >
            <Eye size={16} />
          </Link>
          <Link
            to={`/admin/products/${product._id}/edit`}
            className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
            title="Edit product"
          >
            <Edit size={16} />
          </Link>
          <button
            onClick={() => onDelete(product)}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Delete product"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const EmptyState = () => (
  <tr>
    <td colSpan="7" className="px-6 py-20 text-center">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6">
          <Package className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">No products found</h3>
        <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
          Your product inventory is empty. Start by adding your first safety equipment product.
        </p>
        <Link
          to="/admin/products/create"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg font-medium"
        >
          <Plus size={16} />
          Add Your First Product
        </Link>
      </div>
    </td>
  </tr>
);

const ProductTableView = ({ 
  products, 
  selectedProducts, 
  onProductSelect, 
  onProductDelete, 
  onSelectAll,
  sortBy,
  sortOrder,
  onSortChange,
  formatPrice, 
  getStatusConfig, 
  getStockStatus 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={onSortChange}
            onSelectAll={onSelectAll}
            selectedCount={selectedProducts.length}
            totalCount={products.length}
          />
          <tbody className="bg-white divide-y divide-gray-100">
            {products.length === 0 ? (
              <EmptyState />
            ) : (
              products.map((product) => (
                <ProductRow
                  key={product._id}
                  product={product}
                  isSelected={selectedProducts.includes(product._id)}
                  onSelect={onProductSelect}
                  onDelete={onProductDelete}
                  formatPrice={formatPrice}
                  getStatusConfig={getStatusConfig}
                  getStockStatus={getStockStatus}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTableView;
      