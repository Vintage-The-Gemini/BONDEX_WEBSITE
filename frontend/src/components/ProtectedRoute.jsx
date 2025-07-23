// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { Shield, AlertTriangle } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, admin } = useAdmin();
  const location = useLocation();

  console.log('🔐 ProtectedRoute check:', { isAuthenticated, loading, admin: !!admin });

  // Show loading state while AdminContext is checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Loading Admin Panel
            </h2>
            <p className="text-gray-600 mb-4">
              Please wait while we prepare your dashboard...
            </p>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, show access denied with dev login option
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              You need administrator privileges to access this area.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  console.log('🔧 Setting up dev authentication...');
                  // Set up dev auth
                  localStorage.setItem('adminToken', 'dev-admin-token-2025');
                  localStorage.setItem('adminUser', JSON.stringify({
                    _id: 'dev-admin-123',
                    email: 'admin@bondex.com',
                    name: 'Development Admin',
                    role: 'admin',
                    status: 'active',
                    permissions: ['all']
                  }));
                  console.log('✅ Dev auth set up, reloading...');
                  window.location.reload();
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                🔧 Enable Dev Access
              </button>
              <button
                onClick={() => {
                  console.log('🔄 Navigating to admin login...');
                  window.location.href = '/admin/login';
                }}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Go to Login
              </button>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600">
                  💡 <strong>Dev Mode:</strong> Click "Enable Dev Access" to bypass login for development
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated, render the protected content
  console.log('✅ ProtectedRoute: Access granted, rendering children');
  return children;
};

export default ProtectedRoute;