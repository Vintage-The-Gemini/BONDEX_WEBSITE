// File Path: frontend/src/components/common/Button.jsx
import React from 'react'

const Button = ({ children, variant = 'primary', ...props }) => {
  const styles = {
    primary: {
      backgroundColor: '#f97316',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold'
    },
    secondary: {
      backgroundColor: '#facc15',
      color: '#000',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold'
    }
  }

  return (
    <button style={styles[variant]} {...props}>
      {children}
    </button>
  )
}

export default Button
