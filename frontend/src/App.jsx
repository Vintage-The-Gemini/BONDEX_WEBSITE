// File Path: frontend/src/App.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AdminLayout, Header, Footer } from './components';
import { ToastProvider } from './components/ui/Toast';

// Import existing pages
import HomePage from './pages/customer/HomePage';
import ProductsPage from './pages/customer/ProductsPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import AboutPage from './pages/customer/AboutPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';

// Auth Context
const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// API Client with environment variable support (Fixed for browser)
const getApiUrl = () => {
  // Check if we're in development or production
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
    // For production, you'll need to set this to your actual backend URL
    return 'https://your-backend-url.render.com/api';
  }
  return 'http://localhost:5000/api';
};

const apiClient = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Auth Provider
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bondex_admin_token');
    const userData = localStorage.getItem('bondex_admin_user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      apiClient.defaults.headers.Authorization = `Bearer ${token}`;
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiClient.post('/admin/login', credentials);
      const { token, data } = response.data;
      
      localStorage.setItem('bondex_admin_token', token);
      localStorage.setItem('bondex_admin_user', JSON.stringify(data.user));
      apiClient.defaults.headers.Authorization = `Bearer ${token}`;
      
      setIsAuthenticated(true);
      setUser(data.user);
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('bondex_admin_token');
    localStorage.removeItem('bondex_admin_user');
    delete apiClient.defaults.headers.Authorization;
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    apiClient
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            color: '#ef4444', 
            marginBottom: '16px' 
          }}>
            Something went wrong
          </h1>
          <p style={{ 
            color: '#6b7280', 
            marginBottom: '24px',
            maxWidth: '500px'
          }}>
            We're sorry, but something unexpected happened. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#f97316',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #f97316',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

// Customer Layout Component
const CustomerLayout = ({ children }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Header />
    <main style={{ flex: 1 }}>
      {children}
    </main>
    <Footer />
  </div>
);

// 404 Not Found Component
const NotFound = () => (
  <CustomerLayout>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '40px 20px'
    }}>
      <h1 style={{
        fontSize: '72px',
        fontWeight: 'bold',
        color: '#f97316',
        marginBottom: '16px'
      }}>
        404
      </h1>
      <h2 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: '12px'
      }}>
        Page Not Found
      </h2>
      <p style={{
        color: '#6b7280',
        marginBottom: '32px',
        maxWidth: '500px',
        lineHeight: '1.6'
      }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            backgroundColor: '#f97316',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Go Home
        </button>
        <button
          onClick={() => window.location.href = '/products'}
          style={{
            backgroundColor: 'transparent',
            color: '#f97316',
            border: '2px solid #f97316',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Browse Products
        </button>
      </div>
    </div>
  </CustomerLayout>
);

// Main App Component
function App() {
  console.log('🚀 App starting with API URL:', getApiUrl());

  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              {/* ============================================ */}
              {/* CUSTOMER ROUTES (with Header/Footer Layout) */}
              {/* ============================================ */}
              
              {/* Homepage */}
              <Route 
                path="/" 
                element={
                  <CustomerLayout>
                    <HomePage />
                  </CustomerLayout>
                } 
              />
              
              {/* Products Page */}
              <Route 
                path="/products" 
                element={
                  <CustomerLayout>
                    <ProductsPage />
                  </CustomerLayout>
                } 
              />
              
              {/* About Page */}
              <Route 
                path="/about" 
                element={
                  <CustomerLayout>
                    <AboutPage />
                  </CustomerLayout>
                } 
              />
              
              {/* Product Detail Page */}
              <Route 
                path="/product/:id" 
                element={
                  <CustomerLayout>
                    <ProductDetailPage />
                  </CustomerLayout>
                } 
              />

              {/* ============================================ */}
              {/* ADMIN ROUTES (with Admin Layout) */}
              {/* ============================================ */}
              
              {/* Admin Login - Public */}
              <Route 
                path="/admin/login" 
                element={<AdminLogin />} 
              />
              
              {/* Protected Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin/products" 
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <AdminProducts />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />

              {/* Admin Root Redirect */}
              <Route 
                path="/admin" 
                element={<Navigate to="/admin/dashboard" replace />} 
              />

              {/* ============================================ */}
              {/* FALLBACK ROUTES */}
              {/* ============================================ */}
              
              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
export { useAuth, getApiUrl };