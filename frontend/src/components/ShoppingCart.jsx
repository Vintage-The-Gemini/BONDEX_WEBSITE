// src/components/ShoppingCart.jsx
import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, Truck, Gift, AlertCircle } from 'lucide-react';

const ShoppingCart = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Professional Safety Helmet",
      price: 2500,
      originalPrice: 3000,
      quantity: 2,
      image: "🪖",
      category: "Head Protection",
      inStock: 15,
      urgent: false
    },
    {
      id: 2,
      name: "Steel Toe Safety Boots",
      price: 4800,
      originalPrice: null,
      quantity: 1,
      image: "🥾",
      category: "Foot Protection",
      inStock: 3,
      urgent: true
    },
    {
      id: 3,
      name: "N95 Face Masks (50 Pack)",
      price: 2800,
      originalPrice: 3200,
      quantity: 1,
      image: "😷",
      category: "Breathing Protection",
      inStock: 25,
      urgent: false
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    const validCodes = {
      'WELCOME10': { discount: 0.10, type: 'percentage', description: '10% off' },
      'BULK15': { discount: 0.15, type: 'percentage', description: '15% off bulk orders' },
      'SAVE500': { discount: 500, type: 'fixed', description: 'KES 500 off' }
    };

    if (validCodes[promoCode.toUpperCase()]) {
      setAppliedPromo(validCodes[promoCode.toUpperCase()]);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + ((item.originalPrice - item.price) * item.quantity);
    }
    return sum;
  }, 0);

  const promoDiscount = appliedPromo ? 
    (appliedPromo.type === 'percentage' ? subtotal * appliedPromo.discount : appliedPromo.discount) : 0;

  const deliveryFee = subtotal >= 5000 ? 0 : 300; // Free delivery over KES 5,000
  const total = subtotal - promoDiscount + deliveryFee;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="bg-primary-600 text-white p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6" />
              <span>Shopping Cart ({cartItems.length})</span>
            </h2>
            <button onClick={onClose} className="text-white hover:text-primary-200">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some safety equipment to get started!</p>
            <button 
              onClick={onClose}
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="p-4 space-y-4">
              {/* Urgency Alert */}
              {cartItems.some(item => item.urgent) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Limited Stock Alert!</p>
                    <p className="text-xs text-red-600">Some items have low stock. Complete your order now to avoid disappointment.</p>
                  </div>
                </div>
              )}

              {/* Free Delivery Progress */}
              {subtotal < 5000 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-800">Free Delivery Progress</span>
                    <span className="text-sm text-green-600">{formatPrice(5000 - subtotal)} to go!</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${(subtotal / 5000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {cartItems.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-3xl">{item.image}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-600">{item.category}</p>
                      
                      {/* Stock Status */}
                      <div className="flex items-center space-x-2 mt-1">
                        {item.inStock <= 5 ? (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            Only {item.inStock} left!
                          </span>
                        ) : (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            In Stock
                          </span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="font-bold text-gray-900">{formatPrice(item.price)}</span>
                        {item.originalPrice && (
                          <span className="text-xs text-gray-500 line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="bg-white border border-gray-300 rounded-md p-1 hover:bg-gray-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-white border border-gray-300 rounded-md p-1 hover:bg-gray-50"
                            disabled={item.quantity >= item.inStock}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code */}
            <div className="px-4 py-2 border-t border-gray-200">
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <Gift className="h-4 w-4" />
                    <span className="text-sm">Promo applied: {appliedPromo.description}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                {savings > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>You Save:</span>
                    <span>-{formatPrice(savings)}</span>
                  </div>
                )}

                {appliedPromo && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Promo Discount:</span>
                    <span>-{formatPrice(promoDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="flex items-center space-x-1">
                    <Truck className="h-4 w-4" />
                    <span>Delivery:</span>
                  </span>
                  <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                    {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                  </span>
                </div>

                <hr className="my-2" />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-primary-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Actions */}
            <div className="p-4 space-y-3 border-t border-gray-200">
              <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Checkout Now - {formatPrice(total)}</span>
              </button>
              
              <button 
                onClick={onClose}
                className="w-full border-2 border-primary-500 text-primary-500 hover:bg-primary-50 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Continue Shopping
              </button>
              
              {/* Trust Badges */}
              <div className="text-center pt-2">
                <div className="flex justify-center space-x-4 text-xs text-gray-500">
                  <span>🔒 Secure Payment</span>
                  <span>🚚 Fast Delivery</span>
                  <span>✅ Quality Guaranteed</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;