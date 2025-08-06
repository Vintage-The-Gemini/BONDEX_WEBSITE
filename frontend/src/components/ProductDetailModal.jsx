// frontend/src/components/ProductDetailModal.jsx
import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Shield,
  Truck,
  RotateCcw,
  Award,
  AlertTriangle,
  CheckCircle,
  Package
} from 'lucide-react';

const ProductDetailModal = ({ 
  product, 
  onClose, 
  formatPrice, 
  renderStars, 
  getFallbackImage, 
  onAddToCart 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  if (!product) return null;

  // Helper functions
  const getCategoryName = (category) => {
    if (!category) return 'Safety Equipment';
    if (typeof category === 'string') return category;
    if (typeof category === 'object') return category.name || 'Safety Equipment';
    return 'Safety Equipment';
  };

  const getProductImages = () => {
    if (product.product_images && product.product_images.length > 0) {
      return product.product_images.map(img => img.url || img);
    }
    if (product.image) return [product.image];
    return [getFallbackImage()];
  };

  const images = getProductImages();
  const hasDiscount = product.sale_price && product.sale_price < product.regular_price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100)
    : 0;

  const currentPrice = product.sale_price || product.regular_price;
  const isInStock = product.stock_quantity > 0;
  const isLowStock = product.stock_quantity <= 10 && product.stock_quantity > 0;

  // Handle quantity changes
  const increaseQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= product.stock_quantity) {
      setQuantity(value);
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!isInStock) return;
    
    setAddingToCart(true);
    try {
      await onAddToCart(product, quantity);
      // Show success feedback
      console.log('✅ Product added to cart successfully');
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex h-full max-h-[90vh]">
          
          {/* Left Side - Images */}
          <div className="w-1/2 bg-gray-50 p-6">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>

            {/* Main Image */}
            <div className="w-full h-80 bg-white rounded-lg overflow-hidden mb-4">
              <img
                src={images[selectedImageIndex]}
                alt={product.product_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = getFallbackImage();
                }}
              />
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 bg-white rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? 'border-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.product_name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = getFallbackImage();
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Product Details */}
          <div className="w-1/2 p-6 overflow-y-auto">
            
            {/* Product Header */}
            <div className="mb-6">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {getCategoryName(product.primaryCategory)}
                </span>
                {product.is_featured && (
                  <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    Featured
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Product Name */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {product.product_name}
              </h1>

              {/* Brand */}
              {product.product_brand && (
                <p className="text-gray-600 mb-3">
                  Brand: <span className="font-medium">{product.product_brand}</span>
                </p>
              )}

              {/* Rating */}
              {product.average_rating > 0 && (
                <div className="flex items-center gap-3 mb-4">
                  {renderStars(product.average_rating, product.total_reviews)}
                  <span className="text-sm text-gray-600">
                    ({product.total_reviews} review{product.total_reviews !== 1 ? 's' : ''})
                  </span>
                </div>
              )}
            </div>

            {/* Price Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                {hasDiscount ? (
                  <>
                    <span className="text-3xl font-bold text-red-600">
                      {formatPrice(product.sale_price)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.regular_price)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.regular_price)}
                  </span>
                )}
              </div>
              
              {hasDiscount && (
                <p className="text-sm text-green-600 font-medium">
                  You save {formatPrice(product.regular_price - product.sale_price)}
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {isInStock ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-medium">
                    {isLowStock 
                      ? `Only ${product.stock_quantity} left in stock`
                      : 'In Stock'
                    }
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {isInStock && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityInput}
                      min="1"
                      max={product.stock_quantity}
                      className="w-16 text-center border-0 focus:outline-none"
                    />
                    <button
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock_quantity}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <span className="text-sm text-gray-600">
                    Total: {formatPrice(currentPrice * quantity)}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={!isInStock || addingToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {addingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    {isInStock ? 'Add to Cart' : 'Out of Stock'}
                  </>
                )}
              </button>
              
              <button className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              
              <button className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* Product Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.product_description}
              </p>
            </div>

            {/* Product Features */}
            {product.product_features && product.product_features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <ul className="space-y-2">
                  {product.product_features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <dl className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-700 capitalize">
                          {key.replace(/_/g, ' ')}:
                        </dt>
                        <dd className="text-sm text-gray-600">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            {/* Safety Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Safety Information
              </h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    CE Certified for workplace safety
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    Meets Kenyan safety standards
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    Professional grade quality
                  </li>
                  {product.certifications && product.certifications.length > 0 && (
                    product.certifications.map((cert, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-blue-600" />
                        {cert}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            {/* Shipping & Returns */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping & Returns</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="font-medium">Free shipping within Nairobi</div>
                    <div>Delivery in 1-2 business days</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <RotateCcw className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="font-medium">30-day return policy</div>
                    <div>Free returns for defective items</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="font-medium">Quality guarantee</div>
                    <div>1-year manufacturer warranty</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Reviews Summary */}
            {product.average_rating > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Reviews</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-3xl font-bold text-gray-900">
                      {product.average_rating.toFixed(1)}
                    </div>
                    <div>
                      {renderStars(product.average_rating)}
                      <p className="text-sm text-gray-600 mt-1">
                        Based on {product.total_reviews} review{product.total_reviews !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  {/* Rating Breakdown (if available) */}
                  {product.rating_breakdown && (
                    <div className="space-y-1">
                      {[5, 4, 3, 2, 1].map(rating => {
                        const count = product.rating_breakdown[rating] || 0;
                        const percentage = product.total_reviews > 0 
                          ? (count / product.total_reviews) * 100 
                          : 0;
                        
                        return (
                          <div key={rating} className="flex items-center gap-2 text-sm">
                            <span className="w-8">{rating} ★</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="w-8 text-gray-500">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Product Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">SKU:</span>
                <span className="text-gray-600 ml-2">
                  {product.product_sku || product._id.slice(-8)}
                </span>
              </div>
              
              {product.weight && (
                <div>
                  <span className="font-medium text-gray-700">Weight:</span>
                  <span className="text-gray-600 ml-2">{product.weight}</span>
                </div>
              )}
              
              {product.dimensions && (
                <div>
                  <span className="font-medium text-gray-700">Dimensions:</span>
                  <span className="text-gray-600 ml-2">{product.dimensions}</span>
                </div>
              )}
              
              <div>
                <span className="font-medium text-gray-700">Availability:</span>
                <span className={`ml-2 ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
                  {isInStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;