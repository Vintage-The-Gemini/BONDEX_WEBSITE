// frontend/src/components/admin/Toast.jsx
import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const Toast = ({ success, error, onClose }) => {
  if (!success && !error) return null;

  return (
    <div className={`fixed bottom-6 right-6 max-w-md p-6 rounded-2xl shadow-2xl border z-50 transform transition-all duration-300 ${
      success 
        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
        : 'bg-red-50 border-red-200 text-red-800'
    }`}>
      <div className="flex items-center gap-3">
        {success ? (
          <CheckCircle size={24} className="text-emerald-600 flex-shrink-0" />
        ) : (
          <AlertTriangle size={24} className="text-red-600 flex-shrink-0" />
        )}
        <div className="flex-1">
          <p className="font-semibold">{success || error}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XCircle size={20} />
        </button>
      </div>
    </div>
  );
};

export default Toast;