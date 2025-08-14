// File Path: frontend/src/pages/admin/AdminLogin.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../components/ui/Toast'
import axios from 'axios'

const AdminLogin = () => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // API client setup
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('🔐 Attempting admin login with:', formData.email)
      
      // Make real API call to backend
      const response = await axios.post(`${API_BASE_URL}/admin/login`, {
        email: formData.email,
        password: formData.password
      })

      console.log('✅ Login successful:', response.data)

      // Check response structure
      const responseData = response.data
      let token, admin

      // Handle different possible response structures
      if (responseData.data && responseData.data.token) {
        token = responseData.data.token
        admin = responseData.data.user
      } else if (responseData.token) {
        token = responseData.token
        admin = responseData.data?.user
      } else {
        console.error('❌ Unexpected response structure:', responseData)
        throw new Error('Invalid response structure from server')
      }
      
      // Check if token exists
      if (!token) {
        console.error('❌ No token found in response')
        throw new Error('No token received from server')
      }
      
      if (!admin) {
        console.error('❌ No user data found in response')
        throw new Error('No user data received from server')
      }

      // Store the real token and user data
      localStorage.setItem('bondex_admin_token', token)
      localStorage.setItem('bondex_admin_user', JSON.stringify(admin))
      
      console.log('💾 Token stored:', token.substring(0, 20) + '...')
      console.log('👤 User data stored:', admin.email)
      
      // 🔥 SUCCESS TOAST - Beautiful welcome message
      toast.success(`🎉 Welcome back, ${admin.name || admin.email.split('@')[0]}!`, 4000)
      
      // Redirect to admin dashboard
      navigate('/admin/dashboard')
      
    } catch (err) {
      console.error('❌ Login error:', err)
      
      let errorMessage = 'Login failed. Please try again.'
      
      if (err.response?.status === 401) {
        errorMessage = 'Invalid email or password'
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data.message || 'Please fill in all fields'
      } else if (err.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to server. Please make sure the backend is running.'
      } else {
        errorMessage = err.response?.data?.message || 'Login failed. Please try again.'
      }
      
      setError(errorMessage)
      // 🔥 ERROR TOAST - Clear error message
      toast.error(errorMessage, 6000)
      
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-2xl font-bold">B</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Bondex Safety Equipment Admin Panel
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Keep error display for immediate feedback */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <span className="text-red-400 text-lg mr-3">⚠️</span>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Login Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Sign in to Admin Panel'
              )}
            </button>
          </div>

          <div className="text-center">
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials</h3>
              <p className="text-xs text-blue-700">
                <strong>Email:</strong> admin@bondexsafety.co.ke<br />
                <strong>Password:</strong> admin123
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin