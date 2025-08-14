// File Path: frontend/src/components/product/ProductCard.jsx
import React from 'react'

const ProductCard = ({ product }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      cursor: 'pointer'
    }}>
      <img 
        src={product.image || '/images/placeholder.jpg'} 
        alt={product.name}
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
      />
      <div style={{ padding: '16px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>{product.name}</h3>
        <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '14px' }}>{product.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#f97316' }}>
            KSh {product.price}
          </span>
          <button style={{
            backgroundColor: '#f97316',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
