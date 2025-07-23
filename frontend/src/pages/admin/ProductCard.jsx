// frontend/src/components/admin/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Package, 
  Star, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Heart,
  Share2,
  MoreVertical,
  Archive,
  Copy,
  Tag,
  Zap
} from 'lucide-react';

const ProductCard = ({ 
  product, 
  isSelected, 
  onSelect, 
  onDelete, 
  onDuplicate, 
  onToggleStatus,
  showAnalytics = false 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'archived': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { 
      color: 'text-red-600 bg-red-50 border-red-200', 
      text: 'Out of Stock',
      icon: XCircle
    };
    if (stock <= 10) return { 
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200', 
      text: 'Low Stock',
      icon: AlertTriangle
    };
    return { 
      color: 'text-green-600 bg-green-50 border-green-200', 
      text: 'In Stock',
      icon: CheckCircle
    };
  };

  const stockStatus = getStockStatus(product.stock);
  const StockIcon = stockStatus.icon;

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Calculate discount percentage
  const discountPercentage = product.isOnSale && product.salePrice 
    ? Math.round(((product.product_price - product.salePrice) / product.product_price) * 100)
    : 0;

  return (
    <div className={`
      group relative bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 overflow-hidden
      ${isSelected 
        ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105' 
        : 'border-gray-100 hover:border-gray-200 hover:shadow-md hover:-translate-y-1'
      }
    `}>
      {/* Selection Checkbox */}
      <div className="absolute top-4 left-4 z-10">
        <div className={`
          w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 cursor-pointer
          ${isSelected 
            ? 'bg-blue-600 border-blue-600' 
            : 'bg-white border-gray-300 group-hover:border-gray-400'
          }
        `} onClick={onSelect}>
          {isSelected && (
            <CheckCircle className="w-4 h-4 text-white" />
          )}
        </div>
      </div>

      {/* Actions Dropdown */}
      <div className="absolute top-4 right-4 z-10">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
              <Link
                to={`/admin/products/${product._id}`}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setShowDropdown(false)}
              >
                <Eye className="w-4 h-4" />
                View Details
              </Link>
              <Link
                to={`/admin/products/${product._id}/edit`}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setShowDropdown(false)}
              >
                <Edit className="w-4 h-4" />
                Edit Product
              </Link>
              <button
                onClick={() => {
                  onDuplicate?.(product);
                  setShowDropdown(false);
                }}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
              >
                <Copy className="w-4 h-4" />
                Duplicate
              </button>
              <button
                onClick={() => {
                  onToggleStatus?.(product);
                  setShowDropdown(false);
                }}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
              >
                <Archive className="w-4 h-4" />
                {product.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
              <hr className="my-2 border-gray-100" />
              <button
                onClick={() => {
                  onDelete(product);
                  setShowDropdown(false);
                }}
                className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
          </div>
        )}
        
        {product.mainImage && !imageError ? (
          <img
            src={product.mainImage}
            alt={product.product_name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <Package className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isFeatured && (
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </div>
          )}
          
          {product.isOnSale && discountPercentage > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded-full text-xs font-medium">
              <Tag className="w-3 h-3" />
              -{discountPercentage}%
            </div>
          )}
        </div>

        {/* Stock Status Badge */}
        <div className="absolute bottom-3 right-3">
          <div className={`
            flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border
            ${stockStatus.color}
          `}>
            <StockIcon className="w-3 h-3" />
            {stockStatus.text}
          </div>
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            to={`/admin/products/${product._id}`}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            title="View Details"
          >
            <Eye className="w-5 h-5 text-gray-700" />
          </Link>
          <Link
            to={`/admin/products/${product._id}/edit`}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            title="Edit Product"
          >
            <Edit className="w-5 h-5 text-gray-700" />
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Product Name & Brand */}
        <div className="mb-3">
          <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2 leading-tight">
            {product.product_name}
          </h3>
          <p className="text-sm text-gray-500 font-medium">
            {product.product_brand}
          </p>
        </div>

        {/* Category */}
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border">
            {product.category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>

        {/* Price Section */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            {product.isOnSale && product.salePrice ? (
              <>
                <span className="text-xl font-bold text-red-600">
                  KES {product.salePrice.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  KES {product.product_price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-900">
                KES {product.product_price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Stock Info */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Stock:</span>
            <span className={`font-semibold ${
              product.stock === 0 ? 'text-red-600' : 
              product.stock <= 10 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {product.stock} units
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <span className={`
            inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
            ${getStatusColor(product.status)}
          `}>
            {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
          </span>
        </div>

        {/* Analytics Section (if enabled) */}
        {showAnalytics && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Performance</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Views:</span>
                <span className="ml-1 font-semibold">{product.views || 0}</span>
              </div>
              <div>
                <span className="text-gray-500">Orders:</span>
                <span className="ml-1 font-semibold">{product.totalOrders || 0}</span>
              </div>
            </div>
          </div>
        )}

        {/* Created Date */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          Created {new Date(product.createdAt).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 pb-5">
        <div className="flex gap-2">
          <Link
            to={`/admin/products/${product._id}/edit`}
            className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors text-center"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(product)}
            className="px-4 py-2 bg-red-100 text-red-600 text-sm font-medium rounded-xl hover:bg-red-200 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {imageLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;