// frontend/src/routes/AdminRouter.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

// Admin Layout
import AdminLayout from '../layouts/AdminLayout';

// Admin Authentication
import AdminLogin from '../pages/admin/AdminLogin';

// Admin Dashboard
import AdminDashboard from '../pages/admin/AdminDashboard';

// Product Management
import ProductList from '../pages/admin/ProductList';
import CreateProduct from '../pages/admin/CreateProduct';
import EditProduct from '../pages/admin/EditProduct';
import ProductDetails from '../components/admin/ProductDetails';

// Category Management
import CategoryList from '../pages/admin/CategoryList';
import CreateCategory from '../pages/admin/CreateCategory';
import EditCategory from '../pages/admin/EditCategory';

// Order Management
import OrderList from '../pages/admin/OrderList';

// Analytics
import SEOAnalytics from '../pages/admin/SEOAnalytics';

// Components
import ProtectedRoute from '../components/ProtectedRoute';

const AdminRouter = () => {
  const { isAuthenticated, loading } = useAdmin();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Admin Routes (No Authentication Required) */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />
      } />

      {/* Protected Admin Routes (Authentication Required) */}
      <Route path="/" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        {/* Dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* Product Management */}
        <Route path="products" element={<ProductList />} />
        <Route path="products/create" element={<CreateProduct />} />
        <Route path="products/:id/edit" element={<EditProduct />} />
        <Route path="products/:id" element={<ProductDetails />} />

        {/* Category Management */}
        <Route path="categories" element={<CategoryList />} />
        <Route path="categories/create" element={<CreateCategory />} />
        <Route path="categories/:id/edit" element={<EditCategory />} />
        <Route path="categories/:id" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Category Details</h1>
            <p className="text-gray-600 mt-2">Category detail component coming soon...</p>
            <div className="mt-4">
              <a 
                href="/admin/categories" 
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Back to Categories
              </a>
            </div>
          </div>
        } />

        {/* Orders Management */}
        <Route path="orders" element={<OrderList />} />
        <Route path="orders/:id" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Order Details</h1>
            <p className="text-gray-600 mt-2">Order detail component coming soon...</p>
            <div className="mt-4">
              <a 
                href="/admin/orders" 
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Back to Orders
              </a>
            </div>
          </div>
        } />

        {/* Customer Management */}
        <Route path="customers" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Customers</h1>
            <p className="text-gray-600 mt-2">Customer management coming soon...</p>
          </div>
        } />

        {/* Analytics Routes */}
        <Route path="analytics/seo" element={<SEOAnalytics />} />
        <Route path="analytics/sales" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Sales Analytics</h1>
            <p className="text-gray-600 mt-2">Sales analytics dashboard coming soon...</p>
          </div>
        } />
        <Route path="analytics/site" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Site Analytics</h1>
            <p className="text-gray-600 mt-2">Site traffic analytics coming soon...</p>
          </div>
        } />
        <Route path="analytics" element={<Navigate to="/admin/analytics/seo" replace />} />

        {/* Settings */}
        <Route path="settings" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-gray-600 mt-2">Admin settings coming soon...</p>
          </div>
        } />

        {/* 404 for admin routes */}
        <Route path="*" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Page Not Found</h1>
            <p className="text-gray-600 mt-2">This admin page doesn't exist.</p>
            <a 
              href="/admin/dashboard" 
              className="mt-4 inline-block bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Back to Dashboard
            </a>
          </div>
        } />
      </Route>

      {/* Catch all other admin routes */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AdminRouter;