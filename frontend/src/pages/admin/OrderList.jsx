// frontend/src/pages/admin/OrderList.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  ShoppingCart,
  Search,
  Filter,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Truck,
  Eye,
  Edit,
  MoreVertical,
  Calendar,
  DollarSign,
  Package,
  AlertTriangle
} from 'lucide-react';

const OrderList = () => {
  const { addNotification, admin, isAuthenticated } = useAdmin();
  
  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedOrders, setSelectedOrders] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const itemsPerPage = 20;

  // Fetch orders from backend
  const fetchOrders = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      if (!isAuthenticated) {
        throw new Error('Not authenticated. Please login again.');
      }

      const token = localStorage.getItem('adminToken');
      console.log('🔑 Token found:', token ? 'YES' : 'NO');
      console.log('🔑 Token preview:', token ? token.substring(0, 20) + '...' : 'null');
      
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        sortBy,
        sortOrder,
        ...filters
      });

      if (searchTerm) queryParams.append('search', searchTerm);
      if (filterStatus) queryParams.append('status', filterStatus);
      if (filterPaymentStatus) queryParams.append('paymentStatus', filterPaymentStatus);

      console.log('🔄 Fetching orders with params:', queryParams.toString());

      const response = await fetch(`http://localhost:5000/api/orders?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Admin authentication required');
        }
        if (response.status === 403) {
          throw new Error('Access denied - Admin privileges required');
        }
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Orders fetched successfully:', data);

      if (data.success) {
        setOrders(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalOrders(data.pagination?.totalOrders || 0);
        setCurrentPage(data.pagination?.currentPage || 1);
      } else {
        throw new Error(data.message || 'Failed to fetch orders');
      }

    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      setError(error.message);
      setOrders([]);
      
      addNotification({
        type: 'error',
        message: `Failed to fetch orders: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders(1);
    }
  }, [isAuthenticated]);

  // Refetch when filters change
  useEffect(() => {
    if (isAuthenticated && (searchTerm || filterStatus || filterPaymentStatus || orders.length > 0)) {
      fetchOrders(1, {
        search: searchTerm,
        status: filterStatus,
        paymentStatus: filterPaymentStatus
      });
    }
  }, [searchTerm, filterStatus, filterPaymentStatus, sortBy, sortOrder, isAuthenticated]);

  // Format currency (KES)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status configuration
  const getStatusConfig = (status) => {
    const statusConfigs = {
      pending: { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: Clock, 
        label: 'Pending' 
      },
      confirmed: { 
        color: 'bg-blue-100 text-blue-800', 
        icon: CheckCircle, 
        label: 'Confirmed' 
      },
      processing: { 
        color: 'bg-indigo-100 text-indigo-800', 
        icon: RefreshCw, 
        label: 'Processing' 
      },
      shipped: { 
        color: 'bg-purple-100 text-purple-800', 
        icon: Truck, 
        label: 'Shipped' 
      },
      delivered: { 
        color: 'bg-green-100 text-green-800', 
        icon: CheckCircle, 
        label: 'Delivered' 
      },
      cancelled: { 
        color: 'bg-red-100 text-red-800', 
        icon: XCircle, 
        label: 'Cancelled' 
      },
      refunded: { 
        color: 'bg-gray-100 text-gray-800', 
        icon: XCircle, 
        label: 'Refunded' 
      }
    };
    return statusConfigs[status] || statusConfigs.pending;
  };

  // Get payment status configuration
  const getPaymentStatusConfig = (status) => {
    const paymentConfigs = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Paid' },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
      refunded: { color: 'bg-gray-100 text-gray-800', label: 'Refunded' }
    };
    return paymentConfigs[status] || paymentConfigs.pending;
  };

  // Handle order selection
  const handleOrderSelect = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order._id));
    }
  };

  // Update order status
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      if (!isAuthenticated) {
        addNotification({
          type: 'error',
          message: 'Not authenticated. Please login again.'
        });
        return;
      }

      // Optimistic update
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );

      const token = localStorage.getItem('adminToken');
      if (!token) {
        addNotification({
          type: 'error',
          message: 'Authentication token not found. Please login again.'
        });
        return;
      }

      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: newStatus,
          note: `Status updated to ${newStatus} by admin`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const data = await response.json();
      
      if (data.success) {
        addNotification({
          type: 'success',
          message: 'Order status updated successfully!'
        });
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      
      // Revert optimistic update on error
      fetchOrders(currentPage);
      
      addNotification({
        type: 'error',
        message: 'Failed to update order status'
      });
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchOrders(newPage);
  };

  // Statistics calculation
  const stats = useMemo(() => {
    const totalOrdersCount = orders.length;
    const pendingCount = orders.filter(order => order.status === 'pending').length;
    const processingCount = orders.filter(order => order.status === 'processing').length;
    const shippedCount = orders.filter(order => order.status === 'shipped').length;
    const deliveredCount = orders.filter(order => order.status === 'delivered').length;
    
    return {
      total: totalOrdersCount,
      pending: pendingCount,
      processing: processingCount,
      shipped: shippedCount,
      delivered: deliveredCount
    };
  }, [orders]);

  // Don't show content if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600 mb-4">Please login to access the orders page.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchOrders(1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            Orders
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track customer orders ({totalOrders} total)
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => fetchOrders(currentPage)}
            disabled={loading}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{stats.total}</h3>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{stats.pending}</h3>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <RefreshCw className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{stats.processing}</h3>
              <p className="text-sm text-gray-600">Processing</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{stats.shipped}</h3>
              <p className="text-sm text-gray-600">Shipped</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{stats.delivered}</h3>
              <p className="text-sm text-gray-600">Delivered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by order number, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Payment Status Filter */}
            <div className="w-full md:w-48">
              <select
                value={filterPaymentStatus}
                onChange={(e) => setFilterPaymentStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Payment Status</option>
                <option value="pending">Payment Pending</option>
                <option value="completed">Paid</option>
                <option value="failed">Payment Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === orders.length && orders.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                      <p className="text-gray-500">Loading orders...</p>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <ShoppingCart className="w-12 h-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                      <p className="text-gray-500">
                        {searchTerm || filterStatus || filterPaymentStatus 
                          ? 'No orders match your current filters.' 
                          : 'Orders will appear here when customers place them.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  const paymentConfig = getPaymentStatusConfig(order.payment?.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => handleOrderSelect(order._id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.customerInfo?.name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customerInfo?.email || 'N/A'}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentConfig.color}`}>
                          {paymentConfig.label}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(order.pricing?.totalAmount || 0)}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.createdAt)}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {/* Navigate to order details */}}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <div className="relative">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                              className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;