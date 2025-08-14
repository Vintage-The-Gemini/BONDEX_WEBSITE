// File Path: frontend/src/pages/admin/AdminDashboard.jsx

import React, { useState } from 'react'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data - in real app this would come from API
  const dashboardStats = {
    totalProducts: 156,
    totalOrders: 89,
    totalCustomers: 234,
    monthlyRevenue: 2850000, // KES
    lowStockItems: 12,
    pendingOrders: 15
  }

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const recentOrders = [
    { id: 'ORD-001', customer: 'SafeBuild Construction', amount: 45000, status: 'pending', date: '2024-08-13' },
    { id: 'ORD-002', customer: 'Medical Plus Clinic', amount: 12500, status: 'completed', date: '2024-08-12' },
    { id: 'ORD-003', customer: 'Industrial Solutions', amount: 78000, status: 'processing', date: '2024-08-12' },
    { id: 'ORD-004', customer: 'Mining Corp Kenya', amount: 156000, status: 'completed', date: '2024-08-11' },
    { id: 'ORD-005', customer: 'Construction Plus', amount: 23400, status: 'pending', date: '2024-08-11' }
  ]

  const lowStockProducts = [
    { name: 'Safety Boots Size 42', stock: 5, category: 'Foot Protection' },
    { name: 'Hard Hat Yellow', stock: 3, category: 'Head Protection' },
    { name: 'Cut-Resistant Gloves L', stock: 8, category: 'Hand Protection' },
    { name: 'High-Vis Vest XL', stock: 2, category: 'Body Protection' }
  ]

  const StatCard = ({ title, value, subtitle, color = '#f97316', icon }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: '500',
            color: '#6b7280',
            margin: '0 0 8px 0'
          }}>
            {title}
          </h3>
          <p style={{ 
            fontSize: '28px', 
            fontWeight: 'bold',
            color: '#0f172a',
            margin: '0 0 4px 0'
          }}>
            {value}
          </p>
          {subtitle && (
            <p style={{ 
              fontSize: '12px',
              color: '#6b7280',
              margin: 0
            }}>
              {subtitle}
            </p>
          )}
        </div>
        <div style={{
          backgroundColor: color,
          borderRadius: '8px',
          padding: '8px',
          color: 'white',
          fontSize: '20px'
        }}>
          {icon}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Admin Header */}
      <div style={{ 
        backgroundColor: '#0f172a',
        color: 'white',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold',
              margin: '0 0 4px 0'
            }}>
              Bondex Safety Admin
            </h1>
            <p style={{ 
              fontSize: '14px',
              opacity: 0.8,
              margin: 0
            }}>
              Manage your safety equipment business
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', opacity: 0.8 }}>
              Welcome, Admin
            </span>
            <button style={{
              backgroundColor: '#f97316',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ 
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto',
          display: 'flex',
          gap: '0'
        }}>
          {[
            { id: 'overview', name: 'Overview', icon: '📊' },
            { id: 'products', name: 'Products', icon: '📦' },
            { id: 'orders', name: 'Orders', icon: '🛒' },
            { id: 'customers', name: 'Customers', icon: '👥' },
            { id: 'analytics', name: 'Analytics', icon: '📈' },
            { id: 'settings', name: 'Settings', icon: '⚙️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                backgroundColor: activeTab === tab.id ? '#f97316' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#374151',
                border: 'none',
                padding: '16px 24px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderBottom: activeTab === tab.id ? 'none' : '2px solid transparent'
              }}
            >
              <span>{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        
        {activeTab === 'overview' && (
          <div>
            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px',
              marginBottom: '40px'
            }}>
              <StatCard 
                title="Total Products" 
                value={dashboardStats.totalProducts}
                subtitle="Active in catalog"
                icon="📦"
                color="#3b82f6"
              />
              <StatCard 
                title="Total Orders" 
                value={dashboardStats.totalOrders}
                subtitle="This month"
                icon="🛒"
                color="#22c55e"
              />
              <StatCard 
                title="Total Customers" 
                value={dashboardStats.totalCustomers}
                subtitle="Registered users"
                icon="👥"
                color="#8b5cf6"
              />
              <StatCard 
                title="Monthly Revenue" 
                value={formatPrice(dashboardStats.monthlyRevenue)}
                subtitle="August 2024"
                icon="💰"
                color="#f97316"
              />
              <StatCard 
                title="Low Stock Items" 
                value={dashboardStats.lowStockItems}
                subtitle="Need restocking"
                icon="⚠️"
                color="#ef4444"
              />
              <StatCard 
                title="Pending Orders" 
                value={dashboardStats.pendingOrders}
                subtitle="Require attention"
                icon="⏳"
                color="#facc15"
              />
            </div>

            {/* Recent Activity */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '40px'
            }}>
              
              {/* Recent Orders */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold',
                    color: '#0f172a',
                    margin: 0
                  }}>
                    Recent Orders
                  </h3>
                  <button style={{
                    backgroundColor: 'transparent',
                    color: '#f97316',
                    border: '1px solid #f97316',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}>
                    View All
                  </button>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>ORDER ID</th>
                        <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>CUSTOMER</th>
                        <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>AMOUNT</th>
                        <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>STATUS</th>
                        <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>DATE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px 0', fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>
                            {order.id}
                          </td>
                          <td style={{ padding: '12px 0', fontSize: '14px', color: '#374151' }}>
                            {order.customer}
                          </td>
                          <td style={{ padding: '12px 0', fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>
                            {formatPrice(order.amount)}
                          </td>
                          <td style={{ padding: '12px 0' }}>
                            <span style={{
                              backgroundColor: order.status === 'completed' ? '#dcfce7' : order.status === 'processing' ? '#fef3c7' : '#fef2f2',
                              color: order.status === 'completed' ? '#166534' : order.status === 'processing' ? '#92400e' : '#991b1b',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500',
                              textTransform: 'capitalize'
                            }}>
                              {order.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 0', fontSize: '14px', color: '#6b7280' }}>
                            {order.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Low Stock Alert */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold',
                  color: '#0f172a',
                  margin: '0 0 20px 0'
                }}>
                  Low Stock Alert
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {lowStockProducts.map((product, index) => (
                    <div key={index} style={{
                      padding: '16px',
                      backgroundColor: '#fef2f2',
                      borderRadius: '8px',
                      border: '1px solid #fecaca'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <h4 style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#0f172a',
                          margin: 0
                        }}>
                          {product.name}
                        </h4>
                        <span style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {product.stock} left
                        </span>
                      </div>
                      <p style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        margin: '0 0 12px 0'
                      }}>
                        {product.category}
                      </p>
                      <button style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        Restock Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#0f172a' }}>
              Product Management
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              Manage your safety equipment catalog
            </p>
            <button style={{
              backgroundColor: '#f97316',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}>
              Add New Product
            </button>
          </div>
        )}

        {['orders', 'customers', 'analytics', 'settings'].includes(activeTab) && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '60px 24px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#0f172a', textTransform: 'capitalize' }}>
              {activeTab} Management
            </h2>
            <p style={{ color: '#6b7280' }}>
              {activeTab} management functionality coming soon...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard