// File Path: frontend/src/components/layout/Header.jsx

import React, { useState } from 'react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
    // TODO: Implement search functionality
  }

  return (
    <header style={{ 
      backgroundColor: '#0f172a', 
      color: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {/* Top Bar */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 20px' 
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          height: '60px',
          fontSize: '14px'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              backgroundColor: 'white',
              color: '#0f172a',
              padding: '8px 12px',
              borderRadius: '4px',
              marginRight: '12px'
            }}>
              <span style={{ 
                fontSize: '18px', 
                fontWeight: 'bold' 
              }}>
                BONDEX
              </span>
              <br />
              <span style={{ 
                fontSize: '10px', 
                fontWeight: 'bold',
                backgroundColor: '#facc15',
                color: '#000',
                padding: '2px 6px',
                borderRadius: '2px'
              }}>
                SAFETY
              </span>
            </div>
            <span style={{ 
              backgroundColor: '#facc15', 
              color: '#000', 
              fontSize: '10px', 
              padding: '2px 6px', 
              borderRadius: '4px', 
              fontWeight: 'bold'
            }}>
              WORKS
            </span>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ 
            flex: 1, 
            maxWidth: '400px', 
            margin: '0 32px',
            position: 'relative'
          }}>
            <input
              type="text"
              placeholder="Search for safety equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: '4px',
                top: '4px',
                backgroundColor: '#f97316',
                border: 'none',
                borderRadius: '16px',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                color: 'white'
              }}
            >
              🔍
            </button>
          </form>

          {/* Right Side Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              cursor: 'pointer',
              fontSize: '12px'
            }}>
              Get more information
            </button>

            <button style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              cursor: 'pointer',
              fontSize: '12px'
            }}>
              Jobs
            </button>

            <button style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              cursor: 'pointer',
              fontSize: '12px'
            }}>
              Find a store
            </button>

            <button style={{ 
              backgroundColor: '#facc15', 
              color: '#000', 
              border: 'none', 
              padding: '6px 12px', 
              borderRadius: '4px', 
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '12px'
            }}>
              Dealer Login/Register
            </button>

            <div style={{ 
              fontSize: '12px', 
              color: '#9ca3af' 
            }}>
              Kenya / English
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ 
                display: 'none',
                background: 'none', 
                border: 'none', 
                color: 'white',
                cursor: 'pointer', 
                fontSize: '18px'
              }}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div style={{ 
        borderTop: '1px solid #374151',
        backgroundColor: '#1f2937'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px' 
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {/* Left Navigation */}
            <nav style={{ 
              display: 'flex', 
              gap: '32px',
              alignItems: 'center',
              height: '48px'
            }}>
              <a href="/" style={{ 
                color: '#facc15', 
                textDecoration: 'none', 
                fontWeight: '600',
                fontSize: '14px'
              }}>
                New & featured
              </a>
              <a href="/categories" style={{ 
                color: 'white', 
                textDecoration: 'none', 
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Categories
              </a>
            </nav>

            {/* Right Navigation */}
            <div style={{
              display: 'flex',
              gap: '24px',
              alignItems: 'center'
            }}>
              <a href="/adventure" style={{ 
                color: 'white', 
                textDecoration: 'none', 
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Adventure
              </a>
              <a href="/lifestyle" style={{ 
                color: 'white', 
                textDecoration: 'none', 
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Lifestyle
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Product Categories Bar */}
      <div style={{ 
        backgroundColor: '#374151',
        borderTop: '1px solid #4b5563'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px' 
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '32px',
            alignItems: 'center',
            height: '44px',
            overflow: 'auto'
          }}>
            <a href="/shoes" style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontWeight: '500',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}>
              Shoes
            </a>
            <a href="/overshoes" style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontWeight: '500',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}>
              Overshoes
            </a>
            <a href="/workwear" style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontWeight: '500',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}>
              Workwear
            </a>
            <a href="/head-protection" style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontWeight: '500',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}>
              Head protection
            </a>
            <a href="/gloves" style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontWeight: '500',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}>
              Gloves
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={{ 
          backgroundColor: '#1f2937',
          borderTop: '1px solid #374151',
          padding: '16px 20px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a href="/" style={{ color: '#facc15', textDecoration: 'none', padding: '8px 0' }}>New & Featured</a>
            <a href="/categories" style={{ color: 'white', textDecoration: 'none', padding: '8px 0' }}>Categories</a>
            <a href="/shoes" style={{ color: 'white', textDecoration: 'none', padding: '8px 0' }}>Shoes</a>
            <a href="/workwear" style={{ color: 'white', textDecoration: 'none', padding: '8px 0' }}>Workwear</a>
            <a href="/head-protection" style={{ color: 'white', textDecoration: 'none', padding: '8px 0' }}>Head Protection</a>
            <a href="/gloves" style={{ color: 'white', textDecoration: 'none', padding: '8px 0' }}>Gloves</a>
          </div>
        </div>
      )}

      {/* Mobile responsive styles */}
      <style>
        {`
          @media (max-width: 768px) {
            .header-search { display: none !important; }
            .header-actions { display: none !important; }
            .header-mobile-btn { display: block !important; }
          }
        `}
      </style>
    </header>
  )
}

export default Header