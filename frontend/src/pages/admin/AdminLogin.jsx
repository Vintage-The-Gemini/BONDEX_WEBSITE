// File Path: frontend/src/pages/admin/AdminLogin.jsx

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

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
      // TODO: Replace with actual API call
      // For now, using demo credentials
      if (formData.email === 'admin@bondexsafety.com' && formData.password === 'admin123') {
        // Store admin session
        localStorage.setItem('bondex_admin_token', 'demo_admin_token')
        localStorage.setItem('bondex_admin_user', JSON.stringify({
          id: 1,
          name: 'Admin User',
          email: 'admin@bondexsafety.com',
          role: 'admin'
        }))
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard')
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '400px'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#0f172a',
          color: 'white',
          padding: '32px 32px 24px',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            color: '#0f172a',
            padding: '12px 16px',
            borderRadius: '6px',
            display: 'inline-block',
            marginBottom: '16px'
          }}>
            <span style={{ 
              fontSize: '20px', 
              fontWeight: 'bold' 
            }}>
              BONDEX
            </span>
            <br />
            <span style={{ 
              fontSize: '12px', 
              fontWeight: 'bold',
              backgroundColor: '#facc15',
              color: '#000',
              padding: '2px 8px',
              borderRadius: '3px'
            }}>
              SAFETY
            </span>
          </div>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            margin: '0 0 8px 0'
          }}>
            Admin Login
          </h1>
          <p style={{ 
            fontSize: '14px',
            opacity: 0.8,
            margin: 0
          }}>
            Access the admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <div style={{ padding: '32px' }}>
          {/* Demo Credentials Info */}
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <h4 style={{ 
              fontSize: '14px', 
              fontWeight: '600',
              color: '#92400e',
              margin: '0 0 8px 0'
            }}>
              Demo Credentials
            </h4>
            <p style={{ 
              fontSize: '12px',
              color: '#92400e',
              margin: '0 0 8px 0'
            }}>
              <strong>Email:</strong> admin@bondexsafety.com
            </p>
            <p style={{ 
              fontSize: '12px',
              color: '#92400e',
              margin: 0
            }}>
              <strong>Password:</strong> admin123
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#f97316'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#f97316'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '20px'
              }}>
                <p style={{ 
                  fontSize: '14px',
                  color: '#dc2626',
                  margin: 0
                }}>
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: isLoading ? '#9ca3af' : '#f97316',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Logging in...
                </>
              ) : (
                'Login to Admin Panel'
              )}
            </button>
          </form>

          {/* Back to Site */}
          <div style={{ 
            textAlign: 'center',
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <a 
              href="/"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#f97316'}
              onMouseLeave={(e) => e.target.style.color = '#6b7280'}
            >
              ← Back to Bondex Safety
            </a>
          </div>
        </div>
      </div>

      {/* Spinner Animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}

export default AdminLogin