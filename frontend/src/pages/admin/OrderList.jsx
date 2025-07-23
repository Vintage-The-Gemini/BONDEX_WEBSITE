// frontend/src/pages/admin/OrderList.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { 
  ShoppingCart,
  RefreshCw,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Calendar,
  User,
  DollarSign,
  MapPin
} from 'lucide-react';

const OrderList = () => {
  const { formatCurrency, formatDate, addNotification } = useAdmin();
  const navigate = useNavigate();
  
  // Mock orders data (replace with API call later)
  const [orders] = useState([
    {
      id: 'ORD-001',
      orderNumber: '#BONDEX-001',
      customer: {
        name: 'John Construction Co.',
        email: 'john@construction.co.ke',
        phone: '+254-700-123-456'
      },
      items: [
        { name: 'Safety Helmet Professional', quantity: 5, price: 2500 },
        { name: 'Safety Goggles Clear', quantity: 10, price: 1200 }
      ],
      totalAmount: 24500,
      status: 'processing',
      paymentStatus: 'paid',
      shippingAddress: 'Nairobi CBD, Kenya',
      orderDate: new Date('2025-01-20'),
      updatedAt: new Date('2025-01-21'),
      trackingNumber: 'TRK123456789'
    },
    {
      id: 'ORD-002',
      orderNumber: '#BONDEX-002',
      customer: {
        name: 'Safety First Ltd.',
        email: 'orders@safetyfirst.co.ke',
        phone: '+254-722-987-654'
      },
      items: [
        { name: 'Work Gloves Heavy Duty', quantity: 20, price: 800 },
        { name: 'High-Vis Vest', quantity: 15, price: 600 }
      ],
      totalAmount: 25000,
      status: 'shipped',
      paymentStatus: 'paid',
      shippingAddress: 'Mombasa, Kenya',
      orderDate: new Date('2025-01-19'),
      updatedAt: new Date('2025-01-20'),
      trackingNumber: 'TRK987654321'
    },
    {
      id: 'ORD-003',
      orderNumber: '#BONDEX-003',
      customer: {
        name: 'Industrial Solutions',
        email: 'procurement@industrial.co.ke',
        phone: '+254-733-456-789'
      },
      items: [
        { name: 'Safety Boots Steel Toe', quantity: 8, price: 3500 }
      ],
      totalAmount: 28000,
      status: 'delivered',
      paymentStatus: 'paid',
      shippingAddress: 'Kisumu, Kenya',
      orderDate: new Date('2025-01-18'),
      updatedAt: new Date('2025-01-19'),
      trackingNumber: 'TRK456789123'
    },
    {
      id: 'ORD-004',
      orderNumber: '#BONDEX-004',
      customer: {
        name: 'WorkSafe Inc.',
        email: 'admin@worksafe.co.ke',
        phone: '+254-711-222-333'
      },
      items: [
        { name: 'Breathing Mask N95', quantity: 50, price: 150 }
      ],
      totalAmount: 7500,
      status: 'pending',
      paymentStatus: 'pending',
      shippingAddress: 'Eldoret, Kenya',
      orderDate: new Date('2025-01-22'),
      updatedAt: new Date('2025-01-22'),
      trackingNumber: null
    },
    {
      id: 'ORD-005',
      orderNumber: '#BONDEX-005',
      customer: {
        name: 'ProTech Equipment',
        email: 'orders@protech.co.ke',
        phone: '+254-756-444-555'
      },
      items: [
        { name: 'Safety Harness Full Body', quantity: 3, price: 4500 },
        { name: 'Safety Rope 10m', quantity: 5, price: 800 }
      ],
      totalAmount: 17500,
      status: 'cancelled',
      paymentStatus: 'refunded',
      shippingAddress: 'Nakuru, Kenya',
      orderDate: new Date('2025-01-17'),
      updatedAt: new Date('2025-01-18'),
      trackingNumber: null
    }
  ]);

  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
  const [sortBy, setSortBy] = useState('orderDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter and sort orders
  useEffect(() => {
    let filtered = orders.filter(order => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = !filterStatus || order.status === filterStatus;
      const matchesPaymentStatus = !filterPaymentStatus || order.paymentStatus === filterPaymentStatus;
      
      return matchesSearch && matchesStatus && matchesPaymentStatus;
    });

    // Sort orders
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'orderDate' || sortBy === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortBy === 'totalAmount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (sortBy === 'customer.name') {
        aValue = a.customer.name.toLowerCase();
        bValue = b.customer.name.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredOrders(filtered);
  }, [searchTerm, filterStatus, filterPaymentStatus, sortBy, sortOrder]);

  // Get status configuration
  const getStatusConfig = (status) => {
    const statusConfigs = {
      pending: { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: Clock, 
        label: 'Pending' 
      },
      processing: { 
        color: 'bg-blue-100 text-blue-800', 
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
      }
    };
    return statusConfigs[status] || statusConfigs.pending;
  };

  // Get payment status configuration
  const getPaymentStatusConfig = (status) => {
    const paymentConfigs = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      paid: { color: 'bg-green-100 text-green-800', label: 'Paid' },
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
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  // Export orders
  const handleExportOrders = () => {
    const csvData = filteredOrders.map(order => ({
      'Order Number': order.orderNumber,
      'Customer': order.customer.name,
      'Email': order.customer.email,
      'Total Amount': order.totalAmount,
      'Status': order.status,
      'Payment Status': order.paymentStatus,
      'Order Date': formatDate ? formatDate(order.orderDate) : order.orderDate.toLocaleDateString(),
      'Shipping Address': order.shippingAddress,
      'Tracking Number': order.trackingNumber || 'N/A'
    }));

    // Convert to CSV string
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => Object.values(row).join(','));
    const csvContent = [headers, ...rows].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    addNotification({
      type: 'success',
      message: 'Orders exported successfully!'
    });
  };

  // Update order status
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setLoading(true);
      
      // TODO: API call to update order status
      console.log(`Updating order ${orderId} to status: ${newStatus}`);
      
      addNotification({
        type: 'success',
        message: 'Order status updated successfully!'
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      addNotification({
        type: 'error',
        message: 'Failed to update order status'
      });
    } finally {
      setLoading(false);
    }
  };

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
            Manage and track customer orders
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportOrders}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
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
              <h3 className="text-lg font-semibold text-gray-900">{orders.length}</h3>
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
              <h3 className="text-lg font-semibold text-gray-900">
                {orders.filter(o => o.status === 'pending').length}
              </h3>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <RefreshCw className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {orders.filter(o => o.status === 'processing').length}
              </h3>
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
              <h3 className="text-lg font-semibold text-gray-900">
                {orders.filter(o => o.status === 'shipped').length}
              </h3>
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
              <h3 className="text-lg font-semibold text-gray-900">
                {orders.filter(o => o.status === 'delivered').length}
              </h3>
              <p className="text-sm text-gray-600">Delivered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders, customers, or products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="orderDate-desc">Newest First</option>
              <option value="orderDate-asc">Oldest First</option>
              <option value="totalAmount-desc">Highest Amount</option>
              <option value="totalAmount-asc">Lowest Amount</option>
              <option value="customer.name-asc">Customer A-Z</option>
              <option value="customer.name-desc">Customer Z-A</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="p-4 bg-blue-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedOrders.length} order(s) selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => console.log('Bulk update status')}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Update Status
                </button>
                <button
                  onClick={() => console.log('Send bulk emails')}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
        )}
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
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                      <span className="text-gray-500">Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
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
                filteredOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  const paymentConfig = getPaymentStatusConfig(order.paymentStatus);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleOrderSelect(order.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-500" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {order.customer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.customer.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <StatusIcon className="w-4 h-4 mr-2" />
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentConfig.color}`}>
                          {paymentConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency ? formatCurrency(order.totalAmount) : `KES ${order.totalAmount.toLocaleString()}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate ? formatDate(order.orderDate) : order.orderDate.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                            title="View order details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/orders/${order.id}/edit`}
                            className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg"
                            title="Edit order"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'processing')}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg"
                            title="Update status"
                          >
                            <Package className="w-4 h-4" />
                          </button>
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