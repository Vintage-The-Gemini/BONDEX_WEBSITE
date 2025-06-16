import AdminSidebar from '../admin/AdminSidebar'
import AdminHeader from '../admin/AdminHeader'

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout