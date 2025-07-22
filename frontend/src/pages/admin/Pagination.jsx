// frontend/src/components/admin/Pagination.jsx
import React from 'react';

const Pagination = ({ currentPage, totalPages, totalProducts, limit, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-12 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 px-8 py-6">
      <div className="text-gray-700 font-medium">
        Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalProducts)} of {totalProducts} products
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-6 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          Previous
        </button>
        
        {/* Page Numbers */}
        {[...Array(Math.min(totalPages, 5))].map((_, index) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = index + 1;
          } else if (currentPage <= 3) {
            pageNum = index + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + index;
          } else {
            pageNum = currentPage - 2 + index;
          }
          
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-4 py-3 font-medium rounded-xl transition-all duration-200 ${
                currentPage === pageNum
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-6 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;