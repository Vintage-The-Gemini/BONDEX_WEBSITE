import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { Card, CardBody } from '../components/ui/Card'
import { ProductCard } from '../components/common'
import { PROTECTION_CATEGORIES, INDUSTRIES } from '../constants'
import {
  HeartIcon,
  ShareIcon,
  StarIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  // Mock product data
  const mockProduct = {
    id: 1,
    name: "Professional Hard Hat with 4-Point Suspension System",
    price: 29.99,
    originalPrice: 39.99,
    images: [
      "/images/products/hard-hat-1.jpg",
      "/images/products/hard-hat-2.jpg",
      "/images/products/hard-hat-3.jpg"
    ],
    category: PROTECTION_CATEGORIES.HEAD,
    industry: INDUSTRIES.CONSTRUCTION,
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    stockCount: 45,
    isOnSale: true,
    isFeatured: true,
    sku: "HH-4PS-001",
    description: "This professional hard hat features a 4-point suspension system for superior comfort and protection. ANSI Z89.1 compliant with Type I and Class C ratings. Perfect for construction, industrial, and utility work environments.",
    features: [
      "ANSI Z89.1 Type I and Class C compliant",
      "4-point suspension system for comfort",
      "Adjustable ratchet headband",
      "Non-slip grip design",
      "Meets electrical safety standards",
      "Lightweight ABS shell construction",
      "Available in multiple colors",
      "Accessory slots for face shields and earmuffs"
    ],
    specifications: {
      "Material": "ABS Plastic Shell",
      "Weight": "0.8 lbs",
      "Size Range": "6.5 - 8 inches",
      "Certification": "ANSI Z89.1 Type I Class C",
      "Color Options": "White, Yellow, Orange, Blue",
      "Shell Thickness": "2.5mm",
      "Temperature Range": "-20°F to 140°F"
    },
    shipping: {
      "Standard Shipping": "5-7 business days - FREE over $100",
      "Express Shipping": "2-3 business days - $15.99",
      "Next Day": "1 business day - $29.99"
    },
    warranty: "2-year manufacturer warranty against defects"
  }

  const relatedProducts = [
    {
      id: 2,
      name: "Safety Glasses with Anti-Fog",
      price: 12.99,
      image: "/images/products/safety-glasses.jpg",
      category: PROTECTION_CATEGORIES.EYE,
      industry: INDUSTRIES.CONSTRUCTION,
      rating: 4.5,
      reviewCount: 92,
      inStock: true
    },
    {
      id: 3,
      name: "High-Visibility Safety Vest",
      price: 18.99,
      image: "/images/products/hi-vis-vest.jpg",
      category: PROTECTION_CATEGORIES.BODY,
      industry: INDUSTRIES.CONSTRUCTION,
      rating: 4.4,
      reviewCount: 67,
      inStock: true
    }
  ]

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setProduct(mockProduct)
      setLoading(false)
    }, 1000)
  }, [id])

  const handleAddToCart = () => {
    alert(`Added ${quantity} ${product.name} to cart!`)
  }

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  if (loading) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!product) {
    return (
      <Layout>
        <div className="container-custom py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
          <Link to="/products">
            <Button variant="primary" className="mt-4">
              Back to Products
            </Button>
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-600">Products</Link>
          <span>/</span>
          <Link to={`/category/${product.category.id}`} className="hover:text-primary-600">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Back Button */}
        <Link to="/products" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Products
        </Link>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage] || "/images/placeholder-product.jpg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Badges */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant={product.category.badge}>{product.category.name}</Badge>
                <Badge variant="outline">{product.industry.name}</Badge>
                {product.isOnSale && <Badge variant="danger">Sale</Badge>}
                {product.isFeatured && <Badge variant="warning">Featured</Badge>}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600">SKU: {product.sku}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-primary-600">${product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <Badge variant="danger">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </Badge>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.inStock ? (
                <>
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span className="text-success-600 font-medium">
                    In Stock ({product.stockCount} available)
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-danger-500 rounded-full"></div>
                  <span className="text-danger-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="primary"
                  size="lg"
                  disabled={!product.inStock}
                  onClick={handleAddToCart}
                  className="flex-1"
                >
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </Button>
                <button
                  onClick={handleToggleWishlist}
                  className="p-3 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  {isWishlisted ? (
                    <HeartSolidIcon className="h-6 w-6 text-danger-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6 text-gray-400" />
                  )}
                </button>
                <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-50">
                  <ShareIcon className="h-6 w-6 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center space-x-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="h-5 w-5 text-primary-500" />
                <span className="text-sm text-gray-600">Certified Safe</span>
              </div>
              <div className="flex items-center space-x-2">
                <TruckIcon className="h-5 w-5 text-primary-500" />
                <span className="text-sm text-gray-600">Free Shipping $100+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="mb-12">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['description', 'specifications', 'shipping', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-sm font-medium border-b-2 ${
                    activeTab === tab
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <CardBody className="p-6">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p className="text-gray-700">{product.description}</p>
                <h4 className="font-semibold text-gray-900">Key Features:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="text-primary-500">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Technical Specifications:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(