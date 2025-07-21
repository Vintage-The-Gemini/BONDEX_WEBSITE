// frontend/src/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import NotificationToast from '../components/admin/NotificationToast';

const AdminLayout = () => {
  const { sidebarOpen, notifications } = useAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
      }`}>
        {/* Header */}
        <AdminHeader />
        
        {/* Page Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminLayout;