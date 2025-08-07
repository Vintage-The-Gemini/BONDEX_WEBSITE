// frontend/src/components/admin/ProductGridView.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  Edit, 
  Star, 
  Image as ImageIcon,
  Package,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const CompactProductCard = ({ 
  product, 
  isSelected, 
  onSelect, 
  formatPrice, 
  getStatusConfig, 
  getStockStatus 
}) => {
  const stockStatus = getStockStatus(product.stock, product.lowStockThreshold);

  return (
    <div className={`relative bg-white rounded-lg border transition-all duration-200 hover:shadow-md ${
      isSelected 
        ? 'border-orange-500 shadow-md' 
        : 'border-gray-200 hover:border-orange-300'
    }`}>
      
      {/* Selection Checkbox */}
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(product._id)}
          className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
        />
      </div>

      {/* Product Image - Compact */}
      <div className="relative h-32 bg-gray-50 overflow-hidden rounded-t-lg">
        {product.mainImage || product.product_image ? (
          <img
            src={product.mainImage || product.product_image}
            alt={product.product_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={20} className="text-gray-400" />
          </div>
        )}
        
        {/* Status Badge - Compact */}
        <div className="absolute top-2 right-2">
          <div className={`w-3 h-3 rounded-full ${
            product.status === 'active' ? 'bg-green-500' :
            product.status === 'draft' ? 'bg-orange-500' : 'bg-red-500'
          }`}></div>
        </div>

        {/* Featured Badge */}
        {product.isFeatured && (
          <div className="absolute bottom-2 left-2">
            <Star size={12} className="text-orange-500 fill-current" />
          </div>
        )}
      </div>

      {/* Product Info - Very Compact */}
      <div className="p-3">
        {/* Name */}
        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 min-h-[2.5rem]">
          {product.product_name}
        </h3>
        
        {/* Price & Stock in one row */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-gray-900 text-base">
            {formatPrice(product.price || product.product_price)}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            stockStatus.level === 'good' ? 'bg-green-100 text-green-700' :
            stockStatus.level === 'warning' ? 'bg-orange-100 text-orange-700' : 
            'bg-red-100 text-red-700'
          }`}>
            {product.stock} left
          </span>
        </div>

        {/* Action Buttons - Compact */}
        <div className="flex gap-1">
          <Link
            to={`/admin/products/${product._id}`}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs bg-orange-50 text-orange-700 rounded border border-orange-200 hover:bg-orange-100 transition-colors"
          >
            <Eye size={12} />
            View
          </Link>
          <Link
            to={`/admin/products/${product._id}/edit`}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs bg-gray-900 text-white rounded hover:bg-black transition-colors"
          >
            <Edit size={12} />
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center py-12">
    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
      <Package className="w-8 h-8 text-orange-600" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
    <p className="text-gray-600 mb-6 text-center">
      Start building your safety equipment inventory
    </p>
    <Link
      to="/admin/products/create"
      className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
    >
      <Plus size={16} />
      Add Product
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {products.map((product) => (
        <CompactProductCard
          key={product._id}
          product={product}
          isSelected={selectedProducts.includes(product._id)}
          onSelect={onProductSelect}
          formatPrice={formatPrice}
          getStatusConfig={getStatusConfig}
          getStockStatus={getStockStatus}
        />
      ))}
    </div>
  );
};

export default ProductGridView;