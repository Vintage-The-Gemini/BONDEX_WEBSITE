import { Link, useLocation } from 'react-router-dom'
import Button from '../ui/Button'

const DevNavigation = () => {
  const location = useLocation()
  
  const routes = [
    { path: '/', label: '🏠 Home Page', variant: 'primary' },
    { path: '/demo', label: '🎨 Components Demo', variant: 'yellow' }
  ]

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 space-y-2">
        <p className="text-xs font-medium text-gray-600 text-center">Dev Navigation</p>
        {routes.map((route) => (
          <Link key={route.path} to={route.path}>
            <Button 
              variant={location.pathname === route.path ? 'black' : route.variant}
              size="sm" 
              className="w-full justify-start"
            >
              {route.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default DevNavigation