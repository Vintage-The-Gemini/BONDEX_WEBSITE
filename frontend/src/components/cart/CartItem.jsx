// frontend/src/components/cart/CartItem.jsx
import React from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex items-center space-x-4 py-4 border-b">
      <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0">
        {item.image && (
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover rounded-md"
          />
        )}
      </div>
      <div className="flex-grow">
        <h4 className="font-medium text-gray-900">{item.name}</h4>
        <p className="text-sm text-gray-600">KSh {item.price.toLocaleString()}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
        >
          -
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button 
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
        >
          +
        </button>
      </div>
      <button 
        onClick={() => onRemove(item.id)}
        className="text-red-500 hover:text-red-700"
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
