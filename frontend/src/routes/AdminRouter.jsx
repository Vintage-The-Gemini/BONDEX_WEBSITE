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

// Product Management - Import the actual ProductList component
import ProductList from '../pages/admin/ProductList';
import CreateProduct from '../pages/admin/CreateProduct';
import EditProduct from '../pages/admin/EditProduct';

// Components
import ProtectedRoute from '../components/admin/ProtectedRoute';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminRouter = () => {
  const { isAuthenticated, loading } = useAdmin();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Admin Routes (No Authentication Required) */}
      <Route path="/login" element={
        isAuthenticated ? 
          <Navigate to="/admin/dashboard" replace /> : 
          <AdminLogin />
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

        {/* Product Management - NOW USING THE ACTUAL COMPONENTS */}
        <Route path="products" element={<ProductList />} />
        <Route path="products/create" element={<CreateProduct />} />
        <Route path="products/:id/edit" element={<EditProduct />} />
        <Route path="products/:id" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Product Details</h1>
            <p className="text-gray-600 mt-2">Product detail component coming soon...</p>
            <div className="mt-4">
              <a 
                href="/admin/products" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Products
              </a>
            </div>
          </div>
        } />

        {/* Category Management */}
        <Route path="categories" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Categories</h1>
            <p className="text-gray-600 mt-2">Category management coming soon...</p>
            <div className="mt-4">
              <button className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors">
                Create Category
              </button>
            </div>
          </div>
        } />

        {/* Analytics */}
        <Route path="analytics" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-gray-600 mt-2">Analytics dashboard coming soon...</p>
          </div>
        } />

        {/* Reports */}
        <Route path="reports" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-gray-600 mt-2">Reports section coming soon...</p>
          </div>
        } />

        {/* Profile */}
        <Route path="profile" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Admin Profile</h1>
            <p className="text-gray-600 mt-2">Profile settings coming soon...</p>
          </div>
        } />

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
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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