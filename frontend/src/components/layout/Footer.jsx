// File Path: frontend/src/components/layout/Footer.jsx

import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{ 
      backgroundColor: '#0f172a', 
      color: 'white',
      borderTop: '1px solid #374151'
    }}>
      {/* Main Footer Content */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '60px 20px 40px' 
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '40px',
          marginBottom: '40px'
        }}>
          
          {/* Company Info */}
          <div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                backgroundColor: 'white',
                color: '#0f172a',
                padding: '8px 12px',
                borderRadius: '4px',
                display: 'inline-block',
                marginBottom: '8px'
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
            </div>
            <p style={{ 
              fontSize: '14px', 
              lineHeight: '1.6',
              color: '#9ca3af',
              marginBottom: '20px'
            }}>
              Kenya's premier safety equipment supplier. We provide professional-grade safety gear and equipment for all industries, ensuring your workforce stays protected.
            </p>
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                marginBottom: '8px',
                color: '#facc15'
              }}>
                Contact Information
              </h4>
              <p style={{ fontSize: '14px', color: '#9ca3af', margin: '4px 0' }}>
                📍 Nairobi, Kenya
              </p>
              <p style={{ fontSize: '14px', color: '#9ca3af', margin: '4px 0' }}>
                📞 +254 700 000 000
              </p>
              <p style={{ fontSize: '14px', color: '#9ca3af', margin: '4px 0' }}>
                ✉️ info@bondexsafety.com
              </p>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              marginBottom: '20px',
              color: '#facc15'
            }}>
              Safety Equipment
            </h3>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0 
            }}>
              {[
                'Head Protection',
                'Foot Protection', 
                'Eye Protection',
                'Hand Protection',
                'Breathing Protection',
                'Body Protection',
                'Fall Protection',
                'Hearing Protection'
              ].map((item, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  <a 
                    href={`/products/${item.toLowerCase().replace(' ', '-')}`}
                    style={{ 
                      color: '#9ca3af', 
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#f97316'}
                    onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              marginBottom: '20px',
              color: '#facc15'
            }}>
              Industries We Serve
            </h3>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0 
            }}>
              {[
                'Construction & Building',
                'Manufacturing',
                'Healthcare & Medical',
                'Mining & Quarrying',
                'Oil & Gas',
                'Agriculture',
                'Transportation',
                'Food Processing'
              ].map((item, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  <a 
                    href={`/industries/${item.toLowerCase().replace(/\s+/g, '-').replace('&', 'and')}`}
                    style={{ 
                      color: '#9ca3af', 
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#f97316'}
                    onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              marginBottom: '20px',
              color: '#facc15'
            }}>
              Company
            </h3>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0,
              marginBottom: '24px'
            }}>
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Our Story', href: '/our-story' },
                { name: 'Careers', href: '/careers' },
                { name: 'Contact Us', href: '/contact' },
                { name: 'Become a Dealer', href: '/dealer-registration' },
                { name: 'Bulk Orders', href: '/bulk-orders' },
                { name: 'Technical Support', href: '/support' }
              ].map((item, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  <a 
                    href={item.href}
                    style={{ 
                      color: '#9ca3af', 
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#f97316'}
                    onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Newsletter Signup */}
            <div>
              <h4 style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                marginBottom: '12px',
                color: 'white'
              }}>
                Stay Updated
              </h4>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="email"
                  placeholder="Your email"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid #374151',
                    backgroundColor: '#1f2937',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button style={{
                  backgroundColor: '#f97316',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  Subscribe
                </button>
              </div>
              <p style={{ 
                fontSize: '12px', 
                color: '#6b7280',
                margin: 0
              }}>
                Get safety tips and product updates
              </p>
            </div>
          </div>
        </div>

        {/* Certifications & Partners */}
        <div style={{ 
          borderTop: '1px solid #374151',
          paddingTop: '30px',
          marginBottom: '30px'
        }}>
          <h4 style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            color: '#facc15',
            textAlign: 'center'
          }}>
            Trusted by Leading Companies
          </h4>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            gap: '40px',
            flexWrap: 'wrap'
          }}>
            {[
              'SafeGuard Industries',
              'Kenya Construction Co.',
              'Medical Plus',
              'Mining Corp Kenya',
              'Industrial Solutions'
            ].map((company, index) => (
              <div 
                key={index}
                style={{ 
                  color: '#6b7280',
                  fontSize: '12px',
                  fontWeight: '500',
                  textAlign: 'center'
                }}
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ 
        borderTop: '1px solid #374151',
        backgroundColor: '#111827'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ 
            fontSize: '14px', 
            color: '#6b7280'
          }}>
            © {currentYear} Bondex Safety. All rights reserved. | Professional Safety Equipment Kenya
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '20px',
            fontSize: '12px'
          }}>
            <a 
              href="/privacy-policy" 
              style={{ 
                color: '#6b7280', 
                textDecoration: 'none'
              }}
            >
              Privacy Policy
            </a>
            <a 
              href="/terms-of-service" 
              style={{ 
                color: '#6b7280', 
                textDecoration: 'none'
              }}
            >
              Terms of Service
            </a>
            <a 
              href="/warranty" 
              style={{ 
                color: '#6b7280', 
                textDecoration: 'none'
              }}
            >
              Warranty
            </a>
            <a 
              href="/shipping" 
              style={{ 
                color: '#6b7280', 
                textDecoration: 'none'
              }}
            >
              Shipping Info
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer