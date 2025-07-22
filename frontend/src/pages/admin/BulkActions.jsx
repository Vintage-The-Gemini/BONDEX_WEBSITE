// frontend/src/components/admin/BulkActions.jsx
import React from 'react';
import { CheckCircle, Trash2 } from 'lucide-react';

const BulkActions = ({ selectedProducts, onClearSelection, onBulkDelete }) => {
  if (selectedProducts.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 mb-8 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl shadow-lg">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-blue-900 text-lg">
              {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
            </h3>
            <p className="text-blue-700">Choose an action to apply to selected items</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onBulkDelete}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium shadow-lg"
          >
            <Trash2 size={16} />
            Delete Selected
          </button>
          <button
            onClick={onClearSelection}
            className="flex items-center gap-2 px-6 py-3 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;