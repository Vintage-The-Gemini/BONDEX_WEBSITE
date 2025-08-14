// File Path: frontend/src/components/layout/Header.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
    setIsMenuOpen(false);
  };

  return (
    <header style={{ backgroundColor: '#0f172a', color: 'white' }}>
      {/* Top Bar */}
      <div style={{ backgroundColor: '#374151', padding: '8px 0', fontSize: '14px' }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ color: '#d1d5db' }}>
            📞 +254 700 000 000 | 📧 info@bondexsafety.co.ke
          </div>
          <div style={{ color: '#d1d5db' }}>
            🚚 Free delivery on orders over KES 5,000
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div style={{ padding: '16px 0', borderBottom: '1px solid #374151' }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px'
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <div style={{
              backgroundColor: 'white',
              color: '#0f172a',
              padding: '8px 12px',
              borderRadius: '4px',
              marginRight: '12px'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>BONDEX</div>
              <div style={{ 
                fontSize: '10px', 
                fontWeight: 'bold',
                backgroundColor: '#facc15',
                color: '#000',
                padding: '2px 6px',
                borderRadius: '2px'
              }}>
                SAFETY
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af', lineHeight: '1.2' }}>
              Professional Safety<br />Equipment Kenya
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '400px' }}>
            <div style={{ display: 'flex', border: '1px solid #4b5563', borderRadius: '6px', overflow: 'hidden' }}>
              <input
                type="text"
                placeholder="Search safety equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: 'none',
                  backgroundColor: 'white',
                  color: '#000',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  width: '44px',
                  backgroundColor: '#facc15',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                🔍
              </button>
            </div>
          </form>

          {/* Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link 
              to="/contact"
              style={{ 
                backgroundColor: 'transparent', 
                color: '#facc15', 
                border: '1px solid #facc15', 
                padding: '8px 16px', 
                borderRadius: '4px', 
                fontWeight: 'bold',
                textDecoration: 'none',
                fontSize: '12px'
              }}
            >
              Get Quote
            </Link>

            <button 
              onClick={() => alert('Cart functionality coming soon!')}
              style={{ 
                backgroundColor: '#facc15', 
                color: '#000', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '4px', 
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🛒 Cart (0)
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ 
                display: 'none',
                background: 'none', 
                border: '1px solid #facc15', 
                color: '#facc15',
                cursor: 'pointer', 
                fontSize: '18px',
                padding: '8px 12px',
                borderRadius: '4px'
              }}
              className="mobile-menu-btn"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div style={{ backgroundColor: '#1f2937' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <nav style={{ display: 'flex', alignItems: 'center', height: '50px' }}>
            <Link 
              to="/"
              style={{ 
                color: '#facc15', 
                textDecoration: 'none', 
                fontWeight: '600',
                fontSize: '14px',
                padding: '15px 20px'
              }}
            >
              🏠 Home
            </Link>
            
            <Link 
              to="/products"
              style={{ 
                color: 'white', 
                textDecoration: 'none', 
                fontWeight: '500',
                fontSize: '14px',
                padding: '15px 20px'
              }}
            >
              🛡️ All Products
            </Link>

            <button 
              onClick={() => handleCategoryClick('head-protection')}
              style={{ 
                color: 'white', 
                background: 'none',
                border: 'none',
                fontWeight: '500',
                fontSize: '14px',
                padding: '15px 20px',
                cursor: 'pointer'
              }}
            >
              ⛑️ Head Protection
            </button>

            <button 
              onClick={() => handleCategoryClick('foot-protection')}
              style={{ 
                color: 'white', 
                background: 'none',
                border: 'none',
                fontWeight: '500',
                fontSize: '14px',
                padding: '15px 20px',
                cursor: 'pointer'
              }}
            >
              👢 Safety Shoes
            </button>

            <button 
              onClick={() => handleCategoryClick('hand-protection')}
              style={{ 
                color: 'white', 
                background: 'none',
                border: 'none',
                fontWeight: '500',
                fontSize: '14px',
                padding: '15px 20px',
                cursor: 'pointer'
              }}
            >
              🧤 Gloves
            </button>

            <button 
              onClick={() => handleCategoryClick('body-protection')}
              style={{ 
                color: 'white', 
                background: 'none',
                border: 'none',
                fontWeight: '500',
                fontSize: '14px',
                padding: '15px 20px',
                cursor: 'pointer'
              }}
            >
              🦺 Workwear
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={{ backgroundColor: '#1f2937', padding: '20px' }}>
          {/* Mobile Search */}
          <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #4b5563',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  color: '#000'
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#facc15',
                  border: 'none',
                  padding: '12px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                🔍
              </button>
            </div>
          </form>

          {/* Mobile Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Link 
              to="/"
              onClick={() => setIsMenuOpen(false)}
              style={{ 
                color: '#facc15', 
                textDecoration: 'none', 
                padding: '12px 0',
                borderBottom: '1px solid #374151',
                fontSize: '16px'
              }}
            >
              🏠 Home
            </Link>
            
            <Link 
              to="/products"
              onClick={() => setIsMenuOpen(false)}
              style={{ 
                color: 'white', 
                textDecoration: 'none', 
                padding: '12px 0',
                borderBottom: '1px solid #374151',
                fontSize: '16px'
              }}
            >
              🛡️ All Products
            </Link>
            
            <button 
              onClick={() => handleCategoryClick('head-protection')}
              style={{ 
                color: 'white', 
                background: 'none',
                border: 'none',
                textAlign: 'left',
                padding: '12px 0',
                borderBottom: '1px solid #374151',
                fontSize: '16px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              ⛑️ Head Protection
            </button>
            
            <button 
              onClick={() => handleCategoryClick('foot-protection')}
              style={{ 
                color: 'white', 
                background: 'none',
                border: 'none',
                textAlign: 'left',
                padding: '12px 0',
                borderBottom: '1px solid #374151',
                fontSize: '16px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              👢 Safety Shoes
            </button>
            
            <button 
              onClick={() => handleCategoryClick('hand-protection')}
              style={{ 
                color: 'white', 
                background: 'none',
                border: 'none',
                textAlign: 'left',
                padding: '12px 0',
                borderBottom: '1px solid #374151',
                fontSize: '16px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              🧤 Gloves
            </button>
            
            <button 
              onClick={() => handleCategoryClick('body-protection')}
              style={{ 
                color: 'white', 
                background: 'none',
                border: 'none',
                textAlign: 'left',
                padding: '12px 0',
                borderBottom: '1px solid #374151',
                fontSize: '16px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              🦺 Workwear
            </button>
            
            <Link 
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              style={{ 
                color: 'white', 
                textDecoration: 'none', 
                padding: '12px 0',
                borderBottom: '1px solid #374151',
                fontSize: '16px'
              }}
            >
              ℹ️ About Us
            </Link>
            
            <Link 
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              style={{ 
                color: 'white', 
                textDecoration: 'none', 
                padding: '12px 0',
                fontSize: '16px'
              }}
            >
              📞 Contact
            </Link>
          </div>
        </div>
      )}

      {/* Mobile responsive styles */}
      <style>
        {`
          @media (max-width: 768px) {
            .mobile-menu-btn { 
              display: block !important; 
            }
            form {
              display: none !important;
            }
            .header-actions {
              display: none !important;
            }
          }
        `}
      </style>
    </header>
  );
};

export default Header;