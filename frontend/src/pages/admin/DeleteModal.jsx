// frontend/src/components/admin/DeleteModal.jsx
import React from 'react';
import { AlertTriangle, Trash2, Package } from 'lucide-react';

const DeleteModal = ({ show, product, onClose, onConfirm, formatPrice }) => {
  if (!show || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-shrink-0 w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Delete Product
            </h3>
            <p className="text-gray-600 mt-1">
              This action cannot be undone
            </p>
          </div>
        </div>
        
        <div className="mb-8">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete <strong>"{product.product_name}"</strong>?
          </p>
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              {product.mainImage || product.product_image ? (
                <img
                  src={product.mainImage || product.product_image}
                  alt={product.product_name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center">
                  <Package size={20} className="text-gray-400" />
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900">{product.product_name}</p>
                <p className="text-sm text-gray-600">{formatPrice(product.product_price)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;