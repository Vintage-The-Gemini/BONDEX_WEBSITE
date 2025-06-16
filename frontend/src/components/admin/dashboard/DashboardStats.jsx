import { Card, CardBody } from '../../ui/Card'

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts?.toLocaleString() || '0',
      change: '+12%',
      changeType: 'increase',
      icon: '📦',
      color: 'primary',
      description: 'from last month'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders?.toLocaleString() || '0',
      change: '+8%',
      changeType: 'increase',
      icon: '🛒',
      color: 'secondary',
      description: 'from last week'
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers?.toLocaleString() || '0',
      change: '+15%',
      changeType: 'increase',
      icon: '👥',
      color: 'success',
      description: 'from last month'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue?.toLocaleString() || '0'}`,
      change: '+22%',
      changeType: 'increase',
      icon: '💰',
      color: 'primary',
      description: 'from last month'
    }
  ]

  const getColorClasses = (color) => {
    const colorMap = {
      primary: {
        bg: 'bg-primary-100',
        value: 'text-primary-600',
        border: 'border-l-primary-500'
      },
      secondary: {
        bg: 'bg-secondary-100',
        value: 'text-secondary-600',
        border: 'border-l-secondary-500'
      },
      success: {
        bg: 'bg-success-100',
        value: 'text-success-600',
        border: 'border-l-success-500'
      }
    }
    return colorMap[color] || colorMap.primary
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const colors = getColorClasses(stat.color)
        return (
          <Card key={index} className={`border-l-4 ${colors.border} hover:shadow-medium transition-shadow duration-200`}>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className={`text-3xl font-bold ${colors.value} mb-2`}>
                    {stat.value}
                  </p>
                  <div className="flex items-center text-sm">
                    <span className="text-lg mr-1">
                      {stat.changeType === 'increase' ? '📈' : '📉'}
                    </span>
                    <span className={`${
                      stat.changeType === 'increase' ? 'text-success-600' : 'text-danger-600'
                    } font-medium mr-1`}>
                      {stat.change}
                    </span>
                    <span className="text-gray-500">{stat.description}</span>
                  </div>
                </div>
                <div className={`p-3 ${colors.bg} rounded-full`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        )
      })}
    </div>
  )
}

export default DashboardStats