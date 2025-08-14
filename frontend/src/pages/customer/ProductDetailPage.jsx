// File Path: frontend/src/pages/customer/ProductDetailPage.jsx

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  const getApiUrl = () => {
    if (typeof window !== 'undefined' && window.location) {
      const hostname = window.location.hostname
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5000/api'
      }
    }
    return 'http://localhost:5000/api'
  }

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const apiUrl = getApiUrl()
      const response = await fetch(`${apiUrl}/products/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found')
        }
        throw new Error(`Failed to load product: ${response.status}`)
      }

      const data = await response.json()
      console.log('Product API Response:', data)
      
      if (data.success && data.data) {
        setProduct(data.data)
        setRelatedProducts(data.data.relatedProducts || [])
      } else {
        throw new Error('Invalid product data')
      }
    } catch (err) {
      console.error('Error fetching product:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return `KES ${parseFloat(price).toLocaleString()}`
  }

  const handleAddToCart = async () => {
    setAddingToCart(true)
    try {
      // TODO: Implement actual add to cart API call
      console.log('Adding to cart:', { 
        productId: product._id, 
        quantity: quantity,
        price: product.product_price 
      })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert(`Added ${quantity} ${product.product_name}(s) to cart!`)
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add to cart. Please try again.')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = () => {
    // TODO: Implement buy now functionality
    console.log('Buy now:', { 
      productId: product._id, 
      quantity: quantity,
      price: product.product_price 
    })
    alert('Buy now functionality coming soon!')
  }

  const getProductImages = () => {
    if (!product) return []
    
    const images = []
    
    // Add main image first
    if (product.mainImage) {
      images.push(product.mainImage)
    }
    
    // Add other images from images array
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        const imageUrl = typeof img === 'string' ? img : img.url
        if (imageUrl && !images.includes(imageUrl)) {
          images.push(imageUrl)
        }
      })
    }
    
    // Add product_image if different and exists
    if (product.product_image && !images.includes(product.product_image)) {
      images.push(product.product_image)
    }

    // Fallback if no images
    if (images.length === 0) {
      images.push('https://via.placeholder.com/600x600?text=No+Image+Available')
    }

    return images
  }

  const getCategoryName = (category) => {
    if (typeof category === 'string') {
      return category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
    if (category && category.name) {
      return category.name
    }
    return 'Uncategorized'
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #f97316',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span>Loading product details...</span>
        </div>
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

  if (error || !product) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '60px 20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          maxWidth: '500px'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#ef4444', 
            marginBottom: '16px' 
          }}>
            Product Not Found
          </h2>
          <p style={{ 
            color: '#6b7280', 
            marginBottom: '24px',
            lineHeight: '1.6'
          }}>
            {error || 'The product you are looking for does not exist or has been removed.'}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/products')}
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
              Browse All Products
            </button>
            <button
              onClick={() => navigate('/')}
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
              Go Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  const productImages = getProductImages()

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Breadcrumb */}
      <div style={{ 
        marginBottom: '24px',
        fontSize: '14px',
        color: '#6b7280'
      }}>
        <span 
          onClick={() => navigate('/')}
          style={{ 
            cursor: 'pointer', 
            color: '#f97316',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
        >
          Home
        </span>
        <span style={{ margin: '0 8px' }}>/</span>
        <span 
          onClick={() => navigate('/products')}
          style={{ 
            cursor: 'pointer', 
            color: '#f97316',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
        >
          Products
        </span>
        <span style={{ margin: '0 8px' }}>/</span>
        <span>{product.product_name}</span>
      </div>

      {/* Product Detail Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '40px',
        marginBottom: '60px'
      }}>
        {/* Product Images */}
        <div>
          {/* Main Image */}
          <div style={{
            marginBottom: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#f8fafc'
          }}>
            <img
              src={productImages[selectedImageIndex]}
              alt={product.product_name}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x600?text=Image+Not+Available'
              }}
            />
          </div>

          {/* Image Thumbnails */}
          {productImages.length > 1 && (
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {productImages.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  style={{
                    width: '80px',
                    height: '80px',
                    border: selectedImageIndex === index ? '2px solid #f97316' : '1px solid #e5e7eb',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    backgroundColor: '#f8fafc'
                  }}
                >
                  <img
                    src={image}
                    alt={`${product.product_name} ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div>
          {/* Product Title and Brand */}
          <div style={{ marginBottom: '16px' }}>
            {product.product_brand && (
              <div style={{
                fontSize: '14px',
                color: '#6b7280',
                textTransform: 'uppercase',
                fontWeight: '600',
                letterSpacing: '0.5px',
                marginBottom: '8px'
              }}>
                {product.product_brand}
              </div>
            )}
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#0f172a',
              lineHeight: '1.3',
              margin: 0
            }}>
              {product.product_name}
            </h1>
          </div>

          {/* Price and Sale Price */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#f97316'
              }}>
                {product.saleFormattedPrice || formatPrice(product.product_price)}
              </span>
              {product.saleFormattedPrice && (
                <span style={{
                  fontSize: '20px',
                  color: '#9ca3af',
                  textDecoration: 'line-through'
                }}>
                  {formatPrice(product.product_price)}
                </span>
              )}
              {product.saleFormattedPrice && (
                <span style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  SALE
                </span>
              )}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Price includes VAT
            </div>
          </div>

          {/* Categories and Tags */}
          <div style={{ marginBottom: '20px' }}>
            {product.primaryCategory && (
              <span style={{
                display: 'inline-block',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '14px',
                marginRight: '8px',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                {getCategoryName(product.primaryCategory)}
              </span>
            )}
            {product.secondaryCategories?.map((cat, index) => (
              <span key={index} style={{
                display: 'inline-block',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '14px',
                marginRight: '8px',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                {getCategoryName(cat)}
              </span>
            ))}
          </div>

          {/* Stock Status */}
          <div style={{ marginBottom: '24px' }}>
            {product.inStock ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%'
                }}></span>
                <span style={{ color: '#10b981', fontWeight: '500' }}>
                  In Stock ({product.stock} available)
                </span>
                {product.lowStock && (
                  <span style={{
                    backgroundColor: '#fef3c7',
                    color: '#d97706',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    marginLeft: '8px'
                  }}>
                    Low Stock
                  </span>
                )}
              </div>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#ef4444',
                  borderRadius: '50%'
                }}></span>
                <span style={{ color: '#ef4444', fontWeight: '500' }}>
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* SKU */}
          {product.sku && (
            <div style={{ marginBottom: '24px', fontSize: '14px', color: '#6b7280' }}>
              <strong>SKU:</strong> {product.sku}
            </div>
          )}

          {/* Description */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#0f172a',
              marginBottom: '12px'
            }}>
              Description
            </h3>
            <div style={{
              color: '#4b5563',
              lineHeight: '1.7',
              fontSize: '16px'
            }}>
              {product.product_description.split('\n').map((paragraph, index) => (
                <p key={index} style={{ marginBottom: '12px' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          {product.inStock && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '20px',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Quantity:
                  </label>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{
                        backgroundColor: '#f3f4f6',
                        border: 'none',
                        padding: '10px 12px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: '#374151'
                      }}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                      style={{
                        width: '60px',
                        padding: '10px 8px',
                        border: 'none',
                        textAlign: 'center',
                        fontSize: '16px'
                      }}
                      min="1"
                      max={product.stock}
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      style={{
                        backgroundColor: '#f3f4f6',
                        border: 'none',
                        padding: '10px 12px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: '#374151'
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  Total: <strong style={{ color: '#f97316' }}>
                    {formatPrice(product.product_price * quantity)}
                  </strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    backgroundColor: addingToCart ? '#d1d5db' : '#f97316',
                    color: 'white',
                    border: 'none',
                    padding: '16px 24px',
                    borderRadius: '8px',
                    cursor: addingToCart ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '16px',
                    transition: 'background-color 0.2s'
                  }}
                >
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    backgroundColor: 'transparent',
                    border: '2px solid #f97316',
                    color: '#f97316',
                    padding: '16px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f97316'
                    e.target.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent'
                    e.target.style.color = '#f97316'
                  }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#0f172a',
                marginBottom: '16px'
              }}>
                Key Features
              </h3>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                color: '#4b5563',
                lineHeight: '1.7'
              }}>
                {product.features.map((feature, index) => (
                  <li key={index} style={{ marginBottom: '8px' }}>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#0f172a',
                marginBottom: '16px'
              }}>
                Specifications
              </h3>
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px'
              }}>
                {Object.entries(product.specifications).map(([key, value], index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: index < Object.keys(product.specifications).length - 1 ? '1px solid #e5e7eb' : 'none'
                  }}>
                    <span style={{ fontWeight: '500', color: '#374151' }}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </span>
                    <span style={{ color: '#6b7280' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {product.certifications && product.certifications.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#0f172a',
                marginBottom: '16px'
              }}>
                Certifications & Standards
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {product.certifications.map((cert, index) => (
                  <span key={index} style={{
                    backgroundColor: '#dbeafe',
                    color: '#1d4ed8',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Compliance Standards */}
          {product.complianceStandards && product.complianceStandards.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#0f172a',
                marginBottom: '16px'
              }}>
                Compliance Standards
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {product.complianceStandards.map((standard, index) => (
                  <span key={index} style={{
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {standard}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div style={{ marginTop: '60px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#0f172a',
            marginBottom: '24px'
          }}>
            Related Products
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {relatedProducts.map(relatedProduct => (
              <RelatedProductCard 
                key={relatedProduct._id} 
                product={relatedProduct}
                formatPrice={formatPrice}
                onProductClick={(productId) => {
                  navigate(`/product/${productId}`)
                  window.scrollTo(0, 0)
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Related Product Card Component
const RelatedProductCard = ({ product, formatPrice, onProductClick }) => {
  const mainImage = product.images?.find(img => img.isMain)?.url || 
                   product.mainImage || 
                   product.product_image ||
                   'https://via.placeholder.com/250x250?text=No+Image'

  return (
    <div 
      onClick={() => onProductClick(product._id)}
      style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ height: '180px', overflow: 'hidden' }}>
        <img
          src={mainImage}
          alt={product.product_name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/250x250?text=No+Image'
          }}
        />
      </div>
      <div style={{ padding: '16px' }}>
        <h4 style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#0f172a',
          marginBottom: '8px',
          lineHeight: '1.3',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.product_name}
        </h4>
        <p style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#f97316',
          margin: 0
        }}>
          {formatPrice(product.product_price)}
        </p>
      </div>
    </div>
  )
}

export default ProductDetailPage