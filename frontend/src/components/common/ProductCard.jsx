import { Link } from 'react-router-dom'
import { ShoppingCartIcon, HeartIcon, EyeIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { Card, CardBody } from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

const ProductCard = ({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  isWishlisted = false,
  className 
}) => {
  const {
    id,
    name,
    price,
    originalPrice,
    image,
    category,
    industry,
    rating,
    reviewCount,
    inStock,
    isOnSale,
    isFeatured
  } = product

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <Card className={`group hover:shadow-medium transition-all duration-300 ${className}`}>
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img 
          src={image || '/images/placeholder-product.jpg'} 
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {isOnSale && discount > 0 && (
            <Badge variant="danger" size="sm">-{discount}%</Badge>
          )}
          {isFeatured && (
            <Badge variant="warning" size="sm">⭐ Featured</Badge>
          )}
          {!inStock && (
            <Badge variant="default" size="sm">Out of Stock</Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-1">
          <button
            onClick={() => onToggleWishlist?.(product)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            {isWishlisted ? (
              <HeartSolidIcon className="h-4 w-4 text-danger-500" />
            ) : (
              <HeartIcon className="h-4 w-4 text-gray-600" />
            )}
          </button>
          <Link
            to={`/products/${id}`}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors block"
          >
            <EyeIcon className="h-4 w-4 text-gray-600" />
          </Link>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-2 left-2">
          <Badge variant={category?.badge || 'default'} size="sm">
            {category?.icon} {category?.name}
          </Badge>
        </div>
      </div>

      <CardBody className="space-y-3">
        {/* Product Info */}
        <div>
          <Link 
            to={`/products/${id}`}
            className="font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-2"
          >
            {name}
          </Link>
          
          {industry && (
            <p className="text-sm text-gray-500 mt-1">
              {industry.icon} {industry.name}
            </p>
          )}
        </div>

        {/* Rating */}
        {rating && (
          <div className="flex items-center space-x-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-sm ${i < Math.floor(rating) ? '★' : '☆'}`}>
                  {i < Math.floor(rating) ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({reviewCount || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-primary-600">
            ${price.toFixed(2)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-500 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          variant="primary"
          size="sm"
          disabled={!inStock}
          onClick={() => onAddToCart?.(product)}
          className="w-full"
        >
          <ShoppingCartIcon className="h-4 w-4 mr-2" />
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardBody>
    </Card>
  )
}

export default ProductCard