import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Card, CardBody } from '../ui/Card'

const CategoryCard = ({ category, productCount = 0, className }) => {
  const { id, name, description, icon, color } = category

  return (
    <Link to={`/category/${id}`}>
      <Card 
        variant={color === 'primary' ? 'green' : color === 'secondary' ? 'yellow' : 'default'}
        className={`group hover:shadow-medium transition-all duration-300 cursor-pointer ${className}`}
      >
        <CardBody className="text-center space-y-4 p-8">
          {/* Icon */}
          <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          
          {/* Content */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              {name}
            </h3>
            <p className="text-gray-600 text-sm">
              {description}
            </p>
            {productCount > 0 && (
              <p className="text-sm text-gray-500">
                {productCount} Products Available
              </p>
            )}
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </CardBody>
      </Card>
    </Link>
  )
}

export default CategoryCard