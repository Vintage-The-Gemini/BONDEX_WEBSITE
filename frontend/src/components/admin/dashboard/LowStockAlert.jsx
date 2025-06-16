import {
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { Card, CardHeader, CardBody } from '../../ui/Card'
import Button from '../../ui/Button'
import Badge from '../../ui/Badge'

const LowStockAlert = ({ lowStockItems = [], onReorder }) => {
  const getStockStatusBadge = (status) => {
    const statusConfig = {
      critical: { variant: 'danger', label: 'Critical' },
      low: { variant: 'warning', label: 'Low Stock' },
      normal: { variant: 'success', label: 'Normal' }
    }
    return statusConfig[status] || { variant: 'default', label: status }
  }

  const getStockStatus = (current, reorder) => {
    if (current === 0) return 'critical'
    if (current <= reorder * 0.2) return 'critical'
    if (current <= reorder * 0.5) return 'low'
    return 'normal'
  }

  return (
    <Card className="border-warning-200">
      <CardHeader className="bg-warning-50 border-warning-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-warning-600" />
            <h3 className="text-lg font-semibold text-warning-800">
              Low Stock Alert ({lowStockItems.length} items)
            </h3>
          </div>
          <Button variant="warning" size="sm">
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardBody className="p-0">
        {lowStockItems.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-success-500 mb-2">
              <ExclamationTriangleIcon className="h-12 w-12 mx-auto opacity-50" />
            </div>
            <p className="text-gray-500">All products are well stocked!</p>
          </div>
        ) : (
          <div className="space-y-0">
            {lowStockItems.map((product, index) => {
              const status = getStockStatus(product.currentStock, product.reorderLevel)
              const statusBadge = getStockStatusBadge(status)
              
              return (
                <div 
                  key={product.id} 
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    index !== lowStockItems.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 truncate">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-1">
                            {product.category}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Current: <span className="font-medium">{product.currentStock}</span></span>
                            <span>Reorder at: <span className="font-medium">{product.reorderLevel}</span></span>
                            <span>SKU: <span className="font-medium">{product.sku || 'N/A'}</span></span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={statusBadge.variant} size="sm">
                            {statusBadge.label}
                          </Badge>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => onReorder?.(product)}
                          >
                            <ArrowPathIcon className="h-4 w-4 mr-1" />
                            Reorder
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stock level visual indicator */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Stock Level</span>
                      <span>{Math.round((product.currentStock / product.reorderLevel) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          status === 'critical' ? 'bg-danger-500' : 
                          status === 'low' ? 'bg-warning-500' : 'bg-success-500'
                        }`}
                        style={{ 
                          width: `${Math.min((product.currentStock / product.reorderLevel) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        {lowStockItems.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <Button variant="warning" className="w-full">
              View All Low Stock Items ({lowStockItems.length})
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default LowStockAlert