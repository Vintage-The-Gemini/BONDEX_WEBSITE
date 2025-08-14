// File Path: frontend/src/App.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import { AdminLayout } from './components'

// Import existing pages
import HomePage from './pages/customer/HomePage'
import ProductsPage from './pages/customer/ProductsPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'

// Auth Context (keeping existing implementation)
const AuthContext = createContext()

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// API Client
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// Auth Provider
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('bondex_admin_token')
    const userData = localStorage.getItem('bondex_admin_user')
    
    if (token && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
      apiClient.defaults.headers.Authorization = `Bearer ${token}`
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const response = await apiClient.post('/admin/login', credentials)
      const { token, data } = response.data
      
      localStorage.setItem('bondex_admin_token', token)
      localStorage.setItem('bondex_admin_user', JSON.stringify(data.user))
      apiClient.defaults.headers.Authorization = `Bearer ${token}`
      
      setIsAuthenticated(true)
      setUser(data.user)
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' }
    }
  }

  const logout = () => {
    localStorage.removeItem('bondex_admin_token')
    localStorage.removeItem('bondex_admin_user')
    delete apiClient.defaults.headers.Authorization
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Loading Spinner
const LoadingSpinner = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid #e5e7eb',
      borderTop: '4px solid #f97316',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <style dangerouslySetInnerHTML={{
      __html: `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`
    }} />
  </div>
)

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) return <LoadingSpinner />
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />
}

// Main App
function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          
          {/* Admin Login (No Layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Admin Routes with Layout - ONLY EXISTING PAGES */}
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  {/* Other admin routes will be added as pages are created */}
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          {/* Fallback Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App