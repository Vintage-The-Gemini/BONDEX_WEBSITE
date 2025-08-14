// File Path: frontend/src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Export apiClient for use in other components
export { apiClient }

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    const token = localStorage.getItem('bondex_admin_token')
    const userData = localStorage.getItem('bondex_admin_user')
    
    if (token && userData) {
      try {
        setIsAuthenticated(true)
        setUser(JSON.parse(userData))
        // Set the authorization header for all requests
        apiClient.defaults.headers.Authorization = `Bearer ${token}`
      } catch (error) {
        console.error('Error parsing user data:', error)
        logout()
      }
    }
    setIsLoading(false)
  }

  const login = async (credentials) => {
    try {
      console.log('Attempting login with:', credentials.email)
      
      const response = await apiClient.post('/admin/login', credentials)
      console.log('Login response:', response.data)
      
      const { token, data } = response.data
      const admin = data.user
      
      // Store token and user data
      localStorage.setItem('bondex_admin_token', token)
      localStorage.setItem('bondex_admin_user', JSON.stringify(admin))
      
      // Set authorization header for future requests
      apiClient.defaults.headers.Authorization = `Bearer ${token}`
      
      setIsAuthenticated(true)
      setUser(admin)
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('bondex_admin_token')
    localStorage.removeItem('bondex_admin_user')
    delete apiClient.defaults.headers.Authorization
    setIsAuthenticated(false)
    setUser(null)
  }

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    apiClient // Export apiClient through context
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}