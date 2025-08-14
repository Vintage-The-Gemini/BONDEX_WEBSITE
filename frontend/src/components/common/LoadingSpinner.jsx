// File Path: frontend/src/components/common/LoadingSpinner.jsx
import React from 'react'

const LoadingSpinner = ({ size = 'medium' }) => {
  const sizes = {
    small: '20px',
    medium: '40px',
    large: '60px'
  }

  return (
    <div style={{
      width: sizes[size],
      height: sizes[size],
      border: '3px solid #f3f3f3',
      borderTop: '3px solid #f97316',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}>
      <style>
        {@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }}
      </style>
    </div>
  )
}

export default LoadingSpinner
