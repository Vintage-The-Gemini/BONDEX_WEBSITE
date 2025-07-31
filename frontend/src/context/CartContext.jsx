// frontend/src/contexts/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Cart Actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
  APPLY_DISCOUNT: 'APPLY_DISCOUNT',
  REMOVE_DISCOUNT: 'REMOVE_DISCOUNT'
};

// Initial Cart State
const initialCartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  discount: null,
  discountAmount: 0,
  finalAmount: 0,
  isOpen: false
};

// Cart Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product._id);
      
      let updatedItems;
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        updatedItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem = {
          id: product._id,
          name: product.product_name,
          price: product.product_price,
          image: product.product_image || product.product_images?.[0] || 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=150&h=150&fit=crop&auto=format',
          brand: product.product_brand,
          category: typeof product.category === 'object' ? product.category.name : product.category,
          stock: product.stock,
          quantity: quantity
        };
        updatedItems = [...state.items, newItem];
      }

      return calculateCartTotals({ ...state, items: updatedItems });
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const updatedItems = state.items.filter(item => item.id !== action.payload.id);
      return calculateCartTotals({ ...state, items: updatedItems });
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        const updatedItems = state.items.filter(item => item.id !== id);
        return calculateCartTotals({ ...state, items: updatedItems });
      }

      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, quantity: Math.min(quantity, item.stock) } : item
      );

      return calculateCartTotals({ ...state, items: updatedItems });
    }

    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...initialCartState,
        isOpen: state.isOpen
      };
    }

    case CART_ACTIONS.LOAD_CART: {
      return calculateCartTotals({ ...state, ...action.payload });
    }

    case CART_ACTIONS.APPLY_DISCOUNT: {
      const { code, type, value } = action.payload;
      const discount = { code, type, value };
      return calculateCartTotals({ ...state, discount });
    }

    case CART_ACTIONS.REMOVE_DISCOUNT: {
      return calculateCartTotals({ ...state, discount: null });
    }

    default:
      return state;
  }
};

// Helper function to calculate cart totals
const calculateCartTotals = (state) => {
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let discountAmount = 0;
  if (state.discount) {
    if (state.discount.type === 'percentage') {
      discountAmount = (totalAmount * state.discount.value) / 100;
    } else if (state.discount.type === 'fixed') {
      discountAmount = Math.min(state.discount.value, totalAmount);
    }
  }
  
  const finalAmount = Math.max(0, totalAmount - discountAmount);

  return {
    ...state,
    totalItems,
    totalAmount,
    discountAmount,
    finalAmount
  };
};

// Create Cart Context
const CartContext = createContext(null);

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialCartState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('bondex_cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
        console.log('🛒 Cart loaded from localStorage:', parsedCart);
      }
    } catch (error) {
      console.error('❌ Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('bondex_cart', JSON.stringify({
        items: cartState.items,
        discount: cartState.discount
      }));
      console.log('💾 Cart saved to localStorage');
    } catch (error) {
      console.error('❌ Error saving cart to localStorage:', error);
    }
  }, [cartState.items, cartState.discount]);

  // Cart Actions
  const addToCart = (product, quantity = 1) => {
    console.log('🛒 Adding to cart:', product.product_name, 'Quantity:', quantity);
    dispatch({ 
      type: CART_ACTIONS.ADD_ITEM, 
      payload: { product, quantity } 
    });
  };

  const removeFromCart = (id) => {
    console.log('🗑️ Removing from cart:', id);
    dispatch({ 
      type: CART_ACTIONS.REMOVE_ITEM, 
      payload: { id } 
    });
  };

  const updateQuantity = (id, quantity) => {
    console.log('📊 Updating quantity:', id, 'New quantity:', quantity);
    dispatch({ 
      type: CART_ACTIONS.UPDATE_QUANTITY, 
      payload: { id, quantity } 
    });
  };

  const clearCart = () => {
    console.log('🧹 Clearing cart');
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const applyDiscount = (discountCode, type, value) => {
    console.log('🎫 Applying discount:', discountCode, type, value);
    dispatch({ 
      type: CART_ACTIONS.APPLY_DISCOUNT, 
      payload: { code: discountCode, type, value } 
    });
  };

  const removeDiscount = () => {
    console.log('❌ Removing discount');
    dispatch({ type: CART_ACTIONS.REMOVE_DISCOUNT });
  };

  const toggleCart = () => {
    dispatch({ 
      type: CART_ACTIONS.LOAD_CART, 
      payload: { isOpen: !cartState.isOpen } 
    });
  };

  const openCart = () => {
    dispatch({ 
      type: CART_ACTIONS.LOAD_CART, 
      payload: { isOpen: true } 
    });
  };

  const closeCart = () => {
    dispatch({ 
      type: CART_ACTIONS.LOAD_CART, 
      payload: { isOpen: false } 
    });
  };

  // Helper function to check if item is in cart
  const isInCart = (productId) => {
    return cartState.items.some(item => item.id === productId);
  };

  // Helper function to get item quantity in cart
  const getItemQuantity = (productId) => {
    const item = cartState.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Format price in KES
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Cart context value
  const value = {
    // State
    items: cartState.items,
    totalItems: cartState.totalItems,
    totalAmount: cartState.totalAmount,
    discount: cartState.discount,
    discountAmount: cartState.discountAmount,
    finalAmount: cartState.finalAmount,
    isOpen: cartState.isOpen,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyDiscount,
    removeDiscount,
    toggleCart,
    openCart,
    closeCart,
    
    // Helpers
    isInCart,
    getItemQuantity,
    formatPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;