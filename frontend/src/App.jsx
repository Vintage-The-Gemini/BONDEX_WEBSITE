// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductList from './pages/admin/ProductList';
import CreateProduct from './pages/admin/CreateProduct';
import EditProduct from './pages/admin/EditProduct';
import ProductDetail from './pages/admin/ProductDetail';

// Customer Components (will be created later)
// import CustomerLayout from './components/customer/CustomerLayout';
// import HomePage from './pages/customer/HomePage';
// import ProductCatalog from './pages/customer/ProductCatalog';
// import ProductPage from './pages/customer/ProductPage';

// Utility Components
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

// Global CSS
import './index.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            },
            success: {
              style: {
                border: '1px solid #10b981',
                color: '#065f46'
              }
            },
            error: {
              style: {
                border: '1px solid #ef4444',
                color: '#7f1d1d'
              }
            }
          }}
        />

        <Routes>
          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />

          {/* Admin Authentication Routes (No Layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes (With AdminLayout) */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    {/* Admin Dashboard */}
                    <Route path="dashboard" element={<AdminDashboard />} />
                    
                    {/* Product Management Routes */}
                    <Route path="products" element={<ProductList />} />
                    <Route path="products/create" element={<CreateProduct />} />
                    <Route path="products/new" element={<CreateProduct />} />
                    <Route path="products/:id" element={<ProductDetail />} />
                    <Route path="products/:id/edit" element={<EditProduct />} />
                    
                    {/* Category Management Routes (to be created) */}
                    {/* <Route path="categories" element={<CategoryList />} />
                    <Route path="categories/create" element={<CreateCategory />} />
                    <Route path="categories/:id/edit" element={<EditCategory />} /> */}
                    
                    {/* Order Management Routes (to be created) */}
                    {/* <Route path="orders" element={<OrderList />} />
                    <Route path="orders/:id" element={<OrderDetail />} /> */}
                    
                    {/* Customer Management Routes (to be created) */}
                    {/* <Route path="customers" element={<CustomerList />} />
                    <Route path="customers/:id" element={<CustomerDetail />} /> */}
                    
                    {/* Analytics Routes (to be created) */}
                    {/* <Route path="analytics" element={<Analytics />} />
                    <Route path="analytics/sales" element={<SalesAnalytics />} />
                    <Route path="analytics/products" element={<ProductAnalytics />} /> */}
                    
                    {/* Settings Routes (to be created) */}
                    {/* <Route path="settings" element={<Settings />} />
                    <Route path="settings/profile" element={<AdminProfile />} />
                    <Route path="settings/general" element={<GeneralSettings />} /> */}
                    
                    {/* Admin Default Route */}
                    <Route path="" element={<Navigate to="dashboard" replace />} />
                    
                    {/* Admin 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Customer Routes (Public - to be implemented later) */}
          {/* <Route path="/shop/*" element={
            <CustomerLayout>
              <Routes>
                <Route path="" element={<HomePage />} />
                <Route path="products" element={<ProductCatalog />} />
                <Route path="products/:slug" element={<ProductPage />} />
                <Route path="categories/:category" element={<ProductCatalog />} />
                <Route path="cart" element={<ShoppingCart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="orders" element={<OrderHistory />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </CustomerLayout>
          } /> */}

          {/* Global 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;