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

// API Client with environment variable support
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
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('bondex_admin_token');
    localStorage.removeItem('bondex_admin_user');
    delete apiClient.defaults.headers.Authorization;
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc'
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

// Protected Route for Admin
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

// Customer Layout Wrapper
const CustomerLayout = ({ children }) => {
  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header />
      <main style={{ 
        flex: 1,
        paddingTop: '0' // Header has its own spacing
      }}>
        {children}
      </main>
      <Footer />
    </div>
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
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: '#f8fafc',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            maxWidth: '500px'
          }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#ef4444',
              marginBottom: '16px'
            }}>
              Something went wrong
            </h1>
            <p style={{
              color: '#6b7280',
              marginBottom: '24px',
              lineHeight: '1.6'
            }}>
              We're sorry, but there was an error loading the application. 
              Please refresh the page or contact support if the problem persists.
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
        </div>
      );
    }

    return this.props.children;
  }
}

// Not Found Page Component
const NotFoundPage = () => (
  <CustomerLayout>
    <div style={{
      minHeight: '400px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      textAlign: 'center',
      padding: '60px 20px'
    }}>
      <h1 style={{
        fontSize: '48px',
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
        marginBottom: '16px'
      }}>
        Page Not Found
      </h2>
      <p style={{
        color: '#6b7280',
        marginBottom: '32px',
        maxWidth: '400px',
        lineHeight: '1.6'
      }}>
        Sorry, we couldn't find the page you're looking for. 
        The page might have been moved or doesn't exist.
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

              {/* Category-specific product routes */}
              <Route 
                path="/products/category/:category" 
                element={
                  <CustomerLayout>
                    <ProductsPage />
                  </CustomerLayout>
                } 
              />

              {/* Industry-specific product routes */}
              <Route 
                path="/products/industry/:industry" 
                element={
                  <CustomerLayout>
                    <ProductsPage />
                  </CustomerLayout>
                } 
              />

              {/* Individual product page */}
              <Route 
                path="/product/:id" 
                element={
                  <CustomerLayout>
                    <ProductDetailPage />
                  </CustomerLayout>
                } 
              />

              {/* Contact page (placeholder) */}
              <Route 
                path="/contact" 
                element={
                  <CustomerLayout>
                    <div style={{ 
                      minHeight: '400px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexDirection: 'column',
                      textAlign: 'center',
                      padding: '60px 20px'
                    }}>
                      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px' }}>
                        Contact Us
                      </h2>
                      <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                        Email: info@bondexsafety.co.ke
                      </p>
                      <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                        Phone: +254 700 000 000
                      </p>
                      <p style={{ color: '#6b7280' }}>
                        Address: Nairobi, Kenya
                      </p>
                    </div>
                  </CustomerLayout>
                } 
              />

              {/* ============================================ */}
              {/* ADMIN ROUTES (separate layout) */}
              {/* ============================================ */}
              
              {/* Admin Login (no layout) */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected Admin Routes */}
              <Route path="/admin/*" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route index element={<Navigate to="/admin/dashboard" replace />} />
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="products" element={<AdminProducts />} />
                      {/* Add more admin routes here as you build them */}
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              } />
              
              {/* Admin redirect */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              
              {/* ============================================ */}
              {/* CATCH-ALL ROUTES */}
              {/* ============================================ */}
              
              {/* 404 Not Found */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

// Export auth hook for use in other components
export { useAuth };
export default App;