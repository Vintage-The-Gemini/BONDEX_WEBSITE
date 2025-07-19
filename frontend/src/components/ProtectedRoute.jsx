// frontend/src/components/ProtectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Shield, AlertTriangle } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading, true/false = auth state
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    validateAuth();
  }, []);

  const validateAuth = async () => {
    try {
      setIsValidating(true);
      setError('');

      // Check for token and user in localStorage
      const token = localStorage.getItem('adminToken');
      const userStr = localStorage.getItem('adminUser');

      if (!token || !userStr) {
        setIsAuthenticated(false);
        return;
      }

      // Parse user data
      let user;
      try {
        user = JSON.parse(userStr);
      } catch (parseError) {
        console.error('Error parsing user data:', parseError);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setIsAuthenticated(false);
        return;
      }

      // Validate token with backend
      const response = await fetch('/api/admin/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Update user data in localStorage if it has changed
          const currentUser = JSON.stringify(data.data);
          if (currentUser !== userStr) {
            localStorage.setItem('adminUser', currentUser);
          }
          setIsAuthenticated(true);
        } else {
          throw new Error('Invalid response from server');
        }
      } else if (response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setIsAuthenticated(false);
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (error) {
      console.error('Auth validation error:', error);
      
      // If it's a network error, check if we have basic auth data
      const token = localStorage.getItem('adminToken');
      const userStr = localStorage.getItem('adminUser');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.role === 'admin') {
            // Allow access but show warning
            setError('Unable to verify authentication. Working offline.');
            setIsAuthenticated(true);
            return;
          }
        } catch (parseError) {
          // Invalid user data
        }
      }
      
      // Clear invalid auth data
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setIsAuthenticated(false);
      setError('Authentication failed. Please login again.');
    } finally {
      setIsValidating(false);
    }
  };

  // Show loading state while validating
  if (isValidating || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Verifying Authentication
            </h2>
            <p className="text-gray-600 mb-4">
              Please wait while we verify your credentials...
            </p>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there's an authentication error
  if (error && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Error
            </h2>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <button
              onClick={() => window.location.href = '/admin/login'}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Show offline warning if there was an error but user is still authenticated
  return (
    <>
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
};

export default ProtectedRoute;