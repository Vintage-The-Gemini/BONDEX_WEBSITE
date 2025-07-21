// frontend/src/components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'yellow', 
  text = null,
  className = '' 
}) => {
  // Size configurations
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  // Color configurations
  const colorClasses = {
    yellow: 'border-yellow-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    gray: 'border-gray-500',
    white: 'border-white'
  };

  // Text size based on spinner size
  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
    xlarge: 'text-lg'
  };

  const spinnerClass = `
    animate-spin rounded-full border-2 border-gray-200 
    ${sizeClasses[size]} 
    ${colorClasses[color]}
    border-t-transparent
    ${className}
  `;

  if (text) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className={spinnerClass} />
        <p className={`text-gray-600 ${textSizeClasses[size]}`}>
          {text}
        </p>
      </div>
    );
  }

  return <div className={spinnerClass} />;
};

// Preset spinner components for common use cases
export const PageLoadingSpinner = ({ text = "Loading..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <LoadingSpinner size="large" text={text} />
  </div>
);

export const ButtonLoadingSpinner = () => (
  <LoadingSpinner size="small" color="white" />
);

export const CardLoadingSpinner = ({ text = "Loading data..." }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <LoadingSpinner size="medium" text={text} />
  </div>
);

export const InlineLoadingSpinner = () => (
  <LoadingSpinner size="small" className="inline-block" />
);

// Loading skeleton components
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow border animate-pulse">
    <div className="h-48 bg-gray-200 rounded-t-lg" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
    </div>
  </div>
);

export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr className="animate-pulse">
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </td>
    ))}
  </tr>
);

export const FormFieldSkeleton = () => (
  <div className="space-y-2 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/4" />
    <div className="h-10 bg-gray-200 rounded" />
  </div>
);

// Loading overlay for forms
export const LoadingOverlay = ({ isLoading, children, text = "Processing..." }) => (
  <div className="relative">
    {children}
    {isLoading && (
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <LoadingSpinner size="large" text={text} />
      </div>
    )}
  </div>
);

// Full page loading screen
export const FullPageLoader = ({ text = "Loading Bondex Safety Admin..." }) => (
  <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <LoadingSpinner size="large" text={text} />
    </div>
  </div>
);

export default LoadingSpinner;