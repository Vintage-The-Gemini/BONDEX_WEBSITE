// frontend/src/components/CartSidebar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Tag,
  ArrowRight,
  Package,
  CreditCard,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartSidebar = () => {
  const {
    items,
    totalItems,
    totalAmount,
    finalAmount,
    discountAmount,
    discount,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    formatPrice
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Handle quantity update
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Add checkout logic here
    console.log('🛒 Proceeding to checkout...');
    // Navigate to checkout page
    // navigate('/checkout');
  };

  // Handle clear cart
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Cart Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Shopping Cart
            </h2>
            {totalItems > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            /* Empty Cart */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <Package className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-6">
                Add some safety equipment to get started
              </p>
              <Link
                to="/products"
                onClick={closeCart}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto">
                {/* Clear Cart Button */}
                {items.length > 0 && (
                  <div className="p-4 border-b border-gray-100">
                    <button
                      onClick={handleClearCart}
                      className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear Cart
                    </button>
                  </div>
                )}

                {/* Item List */}
                <div className="p-4 space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-16 h-16 bg-white rounded-md overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=150&h=150&fit=crop&auto=format';
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.brand} • {item.category}
                        </p>
                        <p className="text-sm font-semibold text-blue-600 mt-1">
                          {formatPrice(item.price)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-gray-200 rounded-md">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-l-md transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            
                            <span className="px-3 py-1 text-sm font-medium text-gray-900 min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-r-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-red-400 hover:text-red-600 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Stock Warning */}
                        {item.quantity >= item.stock && (
                          <p className="text-xs text-amber-600 mt-1">
                            Only {item.stock} in stock
                          </p>
                        )}

                        {/* Item Total */}
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          Total: {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="border-t border-gray-200 bg-gray-50">
                {/* Discount Section */}
                {discount && (
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-green-600">
                        <Tag className="h-4 w-4" />
                        <span>Discount ({discount.code})</span>
                      </div>
                      <span className="font-medium">-{formatPrice(discountAmount)}</span>
                    </div>
                  </div>
                )}

                {/* Totals */}
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                    <span className="font-medium">{formatPrice(totalAmount)}</span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>

                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-blue-600">
                        {formatPrice(finalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 space-y-2">
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut || items.length === 0}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isCheckingOut ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        Checkout
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <Link
                    to="/products"
                    onClick={closeCart}
                    className="w-full flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Continue Shopping
                  </Link>
                </div>

                {/* Free Shipping Notice */}
                <div className="p-4 bg-green-50 border-t border-green-100">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <Truck className="h-4 w-4" />
                    <span>Free shipping on all orders in Kenya!</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;