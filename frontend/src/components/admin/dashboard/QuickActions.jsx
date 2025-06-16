import { Link } from 'react-router-dom'
import {
  PlusIcon,
  CubeIcon,
  ShoppingCartIcon,
  UsersIcon,
  ChartBarIcon,
  DocumentPlusIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { Card, CardHeader, CardBody } from '../../ui/Card'
import Button from '../../ui/Button'

const QuickActions = ({ stats }) => {
  const quickActions = [
    {
      title: 'Add Product',
      description: 'Add new safety equipment',
      icon: PlusIcon,
      href: '/admin/products/add',
      variant: 'primary',
      count: null
    },
    {
      title: 'Process Orders',
      description: 'Review pending orders',
      icon: ShoppingCartIcon,
      href: '/admin/orders/pending',
      variant: 'secondary',
      count: stats?.pendingOrders || 0,
      urgent: stats?.pendingOrders > 10
    },
    {
      title: 'Manage Inventory',
      description: 'Update stock levels',
      icon: CubeIcon,
      href: '/admin/products/inventory',
      variant: 'success',
      count: stats?.lowStockItems || 0,
      urgent: stats?.lowStockItems > 5
    },
    {
      title: 'View Analytics',
      description: 'Sales and performance',
      icon: ChartBarIcon,
      href: '/admin/analytics',
      variant: 'accent',
      count: null
    },
    {
      title: 'Customer Support',
      description: 'Help customers',
      icon: UsersIcon,
      href: '/admin/customers',
      variant: 'primary',
      count: stats?.pendingSupport || 0
    },
    {
      title: 'Generate Reports',
      description: 'Export data and reports',
      icon: DocumentPlusIcon,
      href: '/admin/analytics/reports',
      variant: 'outline',
      count: null
    },
    {
      title: 'System Settings',
      description: 'Configure store settings',
      icon: Cog6ToothIcon,
      href: '/admin/settings',
      variant: 'black',
      count: null
    },
    {
      title: 'Safety Alerts',
      description: 'Review safety notifications',
      icon: ExclamationTriangleIcon,
      href: '/admin/safety/alerts',
      variant: 'warning',
      count: stats?.safetyAlerts || 0,
      urgent: stats?.safetyAlerts > 0
    }
  ]

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <p className="text-sm text-gray-600 mt-1">
          Common tasks and shortcuts for efficient store management
        </p>
      </CardHeader>
      
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.href} className="block">
              <div className="group relative p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200 cursor-pointer">
                {/* Urgent indicator */}
                {action.urgent && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-danger-500 rounded-full animate-pulse" />
                )}
                
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Icon */}
                  <div className={`p-3 rounded-full transition-colors duration-200 ${
                    action.variant === 'primary' ? 'bg-primary-100 text-primary-600 group-hover:bg-primary-200' :
                    action.variant === 'secondary' ? 'bg-secondary-100 text-secondary-600 group-hover:bg-secondary-200' :
                    action.variant === 'success' ? 'bg-success-100 text-success-600 group-hover:bg-success-200' :
                    action.variant === 'warning' ? 'bg-warning-100 text-warning-600 group-hover:bg-warning-200' :
                    action.variant === 'accent' ? 'bg-accent-100 text-accent-600 group-hover:bg-accent-200' :
                    action.variant === 'black' ? 'bg-gray-100 text-gray-600 group-hover:bg-gray-200' :
                    'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-center space-x-2">
                      <h4 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                        {action.title}
                      </h4>
                      {action.count !== null && action.count > 0 && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          action.urgent 
                            ? 'bg-danger-100 text-danger-800' 
                            : 'bg-primary-100 text-primary-800'
                        }`}>
                          {action.count}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Additional quick shortcuts */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="outline" size="sm">
              📊 Export Today's Sales
            </Button>
            <Button variant="outline" size="sm">
              📧 Send Newsletter
            </Button>
            <Button variant="outline" size="sm">
              🔄 Sync Inventory
            </Button>
            <Button variant="outline" size="sm">
              🎯 Marketing Campaign
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default QuickActions