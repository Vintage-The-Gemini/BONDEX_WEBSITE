// src/components/ProductModal.jsx
import React, { useState } from 'react';
import { X, Star, ShoppingCart, Heart, Share, Truck, Shield, Award, Plus, Minus, AlertTriangle } from 'lucide-react';

const ProductModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);

  if (!isOpen || !product) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price);
  };

  const variants = [
    { id: 1, name: "Standard Size", price: product.price, stock: 15 },
    { id: 2, name: "Large Size", price: product.price + 500, stock: 8 },
    { id: 3, name: "Extra Large", price: product.price + 800, stock: 3 }
  ];

  const currentVariant = variants[selectedVariant];
  const isLowStock = currentVariant.stock <= 5;
  const isUrgent = currentVariant.stock <= 3;

  const calculateSavings = () => {
    if (product.originalPrice) {
      const savings = (product.originalPrice - currentVariant.price) * quantity;
      const percentage = Math.round(((product.originalPrice - currentVariant.price) / product.originalPrice) * 100);
      return { amount: savings, percentage };
    }
    return null;
  };

  const savings = calculateSavings();

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      variant: currentVariant.name,
      price: currentVariant.price,
      quantity: quantity
    });
    // Show success message or update cart count
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose}></div>

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="relative bg-primary-600 text-white p-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-primary-200"
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* Urgency Banner */}
            {isUrgent && (
              <div className="bg-red-500 text-white text-center py-2 px-4 rounded-lg mb-4 flex items-center justify-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-bold">HURRY! Only {currentVariant.stock} left in stock!</span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* Product Image & Gallery */}
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <div className="text-8xl mb-4">{product.image}</div>
                
                {/* Badges */}
                <div className="flex justify-center space-x-2 mb-4">
                  {product.badge && (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.badge === 'Sale' ? 'bg-red-500 text-white' :
                      product.badge === 'New Arrival' ? 'bg-green-500 text-white' :
                      product.badge === 'Best Seller' ? 'bg-primary-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {product.badge}
                    </span>
                  )}
                  
                  {savings && (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">
                      Save {savings.percentage}%
                    </span>
                  )}
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-green-50 text-green-700 p-2 rounded">
                    <Shield className="h-4 w-4 mx-auto mb-1" />
                    <div>Certified</div>
                  </div>
                  <div className="bg-blue-50 text-blue-700 p-2 rounded">
                    <Award className="h-4 w-4 mx-auto mb-1" />
                    <div>Quality</div>
                  </div>
                  <div className="bg-yellow-50 text-yellow-700 p-2 rounded">
                    <Truck className="h-4 w-4 mx-auto mb-1" />
                    <div>Fast Ship</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="text-sm text-primary-600 font-medium mb-1">{product.category}</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                
                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex">
                    {[1,2,3,4,5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-baseline space-x-3 mb-2">
                  <span className="text-3xl font-bold text-primary-600">
                    {formatPrice(currentVariant.price * quantity)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.originalPrice * quantity)}
                    </span>
                  )}
                </div>
                
                {savings && (
                  <div className="text-green-600 font-medium">
                    You save {formatPrice(savings.amount * quantity)} ({savings.percentage}% off)
                  </div>
                )}
                
                <div className="text-sm text-gray-600 mt-2">
                  Price per unit: {formatPrice(currentVariant.price)}
                </div>
              </div>

              {/* Variants */}
              <div>
                <h4 className="font-semibold mb-3">Choose Size:</h4>
                <div className="grid grid-cols-3 gap-2">
                  {variants.map((variant, index) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(index)}
                      className={`p-3 border rounded-lg text-sm ${
                        selectedVariant === index
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium">{variant.name}</div>
                      <div className="text-xs text-gray-600">{formatPrice(variant.price)}</div>
                      <div className={`text-xs ${variant.stock <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                        {variant.stock} left
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h4 className="font-semibold mb-3">Quantity:</h4>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(currentVariant.stock, quantity + 1))}
                      className="p-2 hover:bg-gray-100"
                      disabled={quantity >= currentVariant.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {isLowStock && (
                    <span className="text-sm text-red-600 font-medium">
                      Only {currentVariant.stock} available!
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-semibold mb-3">Key Features:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart - {formatPrice(currentVariant.price * quantity)}</span>
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button className="border-2 border-gray-300 text-gray-700 hover:border-gray-400 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <Heart className="h-4 w-4" />
                    <span>Wishlist</span>
                  </button>
                  <button className="border-2 border-gray-300 text-gray-700 hover:border-gray-400 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <Share className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Truck className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">Free Delivery in Nairobi</span>
                </div>
                <p className="text-sm text-green-700">
                  Order before 2 PM for same-day dispatch. Delivery within 1-2 business days.
                </p>
              </div>

              {/* Bulk Pricing */}
              {quantity >= 5 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">🎉 Bulk Discount Applied!</h4>
                  <p className="text-sm text-blue-700">
                    Save an additional 5% on orders of 5+ items. Contact us for even better prices on bulk orders!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;