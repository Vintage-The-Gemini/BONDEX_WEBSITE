import { Link } from 'react-router-dom'
import {
  ShoppingCartIcon,
  EyeIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { Card, CardHeader, CardBody } from '../../ui/Card'
import Button from '../../ui/Button'
import Badge from '../../ui/Badge'

const RecentOrders = ({ orders = [] }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', label: 'Pending', color: 'text-warning-700' },
      processing: { variant: 'primary', label: 'Processing', color: 'text-primary-700' },
      shipped: { variant: 'success', label: 'Shipped', color: 'text-success-700' },
      delivered: { variant: 'success', label: 'Delivered', color: 'text-success-700' },
      cancelled: { variant: 'danger', label: 'Cancelled', color: 'text-danger-700' }
    }
    return statusConfig[status] || { variant: 'default', label: status, color: 'text-gray-700' }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPriorityIcon = (status) => {
    if (status === 'pending') return '🟡'
    if (status === 'processing') return '🔵'
    if (status === 'shipped') return '🟢'
    if (status === 'delivered') return '✅'
    if (status === 'cancelled') return '🔴'
    return '⚪'
  }

  return (
    <Card className="border-primary-200">
      <CardHeader className="bg-primary-50 border-primary-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCartIcon className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-primary-800">
              Recent Orders ({orders.length})
            </h3>
          </div>
          <Link to="/admin/orders">
            <Button variant="primary" size="sm">
              View All Orders
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardBody className="p-0">
        {orders.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-gray-400 mb-2">
              <ShoppingCartIcon className="h-12 w-12 mx-auto opacity-50" />
            </div>
            <p className="text-gray-500">No recent orders</p>
          </div>
        ) : (<div className="space-y-0">
            {orders.map((order, index) => {
              const statusBadge = getStatusBadge(order.status)
              
              return (
                <div 
                  key={order.id} 
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    index !== orders.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getPriorityIcon(order.status)}</span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900">
                              {order.id}
                            </h4>
                            <Badge variant={statusBadge.variant} size="sm">
                              {statusBadge.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {order.customer}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              {formatDate(order.date)}
                            </span>
                            <span>{order.items} items</span>
                            <span className="font-medium text-primary-600">
                              ${order.total.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Link to={`/admin/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      {order.status === 'pending' && (
                        <Button variant="primary" size="sm">
                          Process
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Order progress bar for processing orders */}
                  {order.status === 'processing' && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Order Progress</span>
                        <span>Processing...</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-primary-500 h-1.5 rounded-full animate-pulse" style={{ width: '60%' }} />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default RecentOrders