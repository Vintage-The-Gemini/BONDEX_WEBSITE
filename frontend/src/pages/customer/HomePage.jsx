// File Path: frontend/src/pages/customer/HomePage.jsx

import React, { useState, useEffect } from 'react'

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchHomePageData()
  }, [])

  const fetchHomePageData = async () => {
    try {
      setLoading(true)
      
      // Fetch featured products
      const featuredResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/products?status=active&isFeatured=true&limit=8`
      )
      const featuredData = await featuredResponse.json()

      // Fetch new arrivals
      const newResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/products?status=active&isNewArrival=true&limit=8`
      )
      const newData = await newResponse.json()

      setFeaturedProducts(featuredData.products || [])
      setNewArrivals(newData.products || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return `KES ${parseFloat(price).toLocaleString()}`
  }

  const handleShopNow = () => {
    window.location.href = '/products'
  }

  const handleViewProduct = (productId) => {
    window.location.href = `/product/${productId}`
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            Professional Safety Equipment
          </h1>
          <p style={{
            fontSize: '20px',
            marginBottom: '40px',
            color: '#d1d5db',
            maxWidth: '600px',
            margin: '0 auto 40px auto'
          }}>
            Protect your workforce with high-quality safety equipment from trusted brands. 
            From head to toe, we've got you covered.
          </p>
          <button
            onClick={handleShopNow}
            style={{
              backgroundColor: '#f97316',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: 'bold',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#ea580c'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f97316'}
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ padding: '60px 20px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '48px',
            color: '#0f172a'
          }}>
            Shop by Protection Type
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                title: 'Head Protection',
                description: 'Hard hats, helmets & bump caps',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
                link: '/products?category=head-protection'
              },
              {
                title: 'Foot Protection',
                description: 'Safety boots & shoes',
                image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=300&h=200&fit=crop',
                link: '/products?category=foot-protection'
              },
              {
                title: 'Hand Protection',
                description: 'Gloves for every task',
                image: 'https://images.unsplash.com/photo-1582560475093-ba66ac3b8fa7?w=300&h=200&fit=crop',
                link: '/products?category=hand-protection'
              },
              {
                title: 'Eye Protection',
                description: 'Safety glasses & goggles',
                image: 'https://images.unsplash.com/photo-1621905515940-b2b96d5e0b9e?w=300&h=200&fit=crop',
                link: '/products?category=eye-protection'
              },
              {
                title: 'Breathing Protection',
                description: 'Respirators & masks',
                image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=300&h=200&fit=crop',
                link: '/products?category=breathing-protection'
              },
              {
                title: 'Body Protection',
                description: 'Hi-vis vests & workwear',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
                link: '/products?category=body-protection'
              }
            ].map((category, index) => (
              <div
                key={index}
                onClick={() => window.location.href = category.link}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ height: '160px', overflow: 'hidden' }}>
                  <img
                    src={category.image}
                    alt={category.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    color: '#0f172a'
                  }}>
                    {category.title}
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}>
                    {category.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {!loading && featuredProducts.length > 0 && (
        <section style={{ padding: '60px 20px', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '48px'
            }}>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#0f172a'
              }}>
                Featured Products
              </h2>
              <button
                onClick={handleShopNow}
                style={{
                  backgroundColor: 'transparent',
                  border: '2px solid #f97316',
                  color: '#f97316',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px'
                }}
              >
                View All Products
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {featuredProducts.slice(0, 4).map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  formatPrice={formatPrice}
                  onViewProduct={handleViewProduct}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      {!loading && newArrivals.length > 0 && (
        <section style={{ padding: '60px 20px', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '48px'
            }}>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#0f172a'
              }}>
                New Arrivals
              </h2>
              <button
                onClick={() => window.location.href = '/products?sortBy=newest'}
                style={{
                  backgroundColor: 'transparent',
                  border: '2px solid #f97316',
                  color: '#f97316',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px'
                }}
              >
                View All New Products
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {newArrivals.slice(0, 4).map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  formatPrice={formatPrice}
                  onViewProduct={handleViewProduct}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section style={{ padding: '60px 20px', backgroundColor: '#1f2937', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '48px'
          }}>
            Why Choose Bondex Safety
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px'
          }}>
            {[
              {
                icon: '🛡️',
                title: 'Certified Quality',
                description: 'All products meet international safety standards and certifications'
              },
              {
                icon: '🚚',
                title: 'Fast Delivery',
                description: 'Quick delivery across Kenya with reliable shipping partners'
              },
              {
                icon: '💼',
                title: 'Expert Support',
                description: 'Professional advice to help you choose the right safety equipment'
              },
              {
                icon: '💰',
                title: 'Competitive Prices',
                description: 'Best prices in Kenya with bulk discounts for large orders'
              }
            ].map((feature, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '12px'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#d1d5db',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section style={{ padding: '60px 20px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '48px',
            color: '#0f172a'
          }}>
            Industries We Serve
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                name: 'Construction',
                icon: '🏗️',
                link: '/products?industry=construction'
              },
              {
                name: 'Manufacturing',
                icon: '🏭',
                link: '/products?industry=manufacturing'
              },
              {
                name: 'Medical',
                icon: '🏥',
                link: '/products?industry=medical'
              },
              {
                name: 'Automotive',
                icon: '🚗',
                link: '/products?industry=automotive'
              },
              {
                name: 'Chemical',
                icon: '⚗️',
                link: '/products?industry=chemical'
              },
              {
                name: 'Mining',
                icon: '⛏️',
                link: '/products?industry=mining'
              }
            ].map((industry, index) => (
              <div
                key={index}
                onClick={() => window.location.href = industry.link}
                style={{
                  backgroundColor: '#f8fafc',
                  padding: '24px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f97316'
                  e.currentTarget.style.color = 'white'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc'
                  e.currentTarget.style.color = '#0f172a'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{
                  fontSize: '36px',
                  marginBottom: '12px'
                }}>
                  {industry.icon}
                </div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  {industry.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        backgroundColor: '#f97316',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '16px'
          }}>
            Ready to Protect Your Team?
          </h2>
          <p style={{
            fontSize: '18px',
            marginBottom: '32px',
            opacity: 0.9
          }}>
            Browse our complete catalog of professional safety equipment or contact us for expert advice.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleShopNow}
              style={{
                backgroundColor: 'white',
                color: '#f97316',
                border: 'none',
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: 'bold',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Shop All Products
            </button>
            <button
              onClick={() => window.location.href = '/contact'}
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: 'bold',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          fontSize: '18px',
          color: '#6b7280'
        }}>
          Loading...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          fontSize: '18px',
          color: '#ef4444'
        }}>
          Error loading homepage data: {error}
        </div>
      )}
    </div>
  )
}

// Product Card Component for Homepage
const ProductCard = ({ product, formatPrice, onViewProduct }) => {
  const mainImage = product.images?.find(img => img.isMain)?.url || 
                   product.mainImage || 
                   product.product_image ||
                   'https://via.placeholder.com/300x300?text=No+Image'

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', product._id)
  }

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
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
      {/* Product Image */}
      <div style={{ 
        position: 'relative',
        height: '200px',
        overflow: 'hidden'
      }}
      onClick={() => onViewProduct(product._id)}
      >
        <img
          src={mainImage}
          alt={product.product_name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        
        {/* Badges */}
        {product.isFeatured && (
          <span style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            Featured
          </span>
        )}
        
        {product.isNewArrival && (
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: '#10b981',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            New
          </span>
        )}

        {product.stock === 0 && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div style={{ padding: '16px' }}>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '16px', 
          fontWeight: 'bold',
          color: '#0f172a',
          lineHeight: '1.3'
        }}>
          {product.product_name}
        </h3>
        
        <p style={{ 
          margin: '0 0 12px 0', 
          color: '#6b7280', 
          fontSize: '14px',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.product_description}
        </p>

        {/* Price */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <span style={{ 
            fontWeight: 'bold', 
            fontSize: '18px', 
            color: '#f97316' 
          }}>
            {formatPrice(product.product_price)}
          </span>
          
          {product.stock < 10 && product.stock > 0 && (
            <span style={{
              fontSize: '12px',
              color: '#ef4444',
              fontWeight: '500'
            }}>
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => onViewProduct(product._id)}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: '1px solid #f97316',
              color: '#f97316',
              padding: '10px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            View Details
          </button>
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              flex: 1,
              backgroundColor: product.stock > 0 ? '#f97316' : '#9ca3af',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '6px',
              cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomePage