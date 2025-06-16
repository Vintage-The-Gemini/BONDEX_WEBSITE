import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { ProductCard, SearchBar } from '../components/common'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { Card, CardBody } from '../components/ui/Card'
import { PROTECTION_CATEGORIES, INDUSTRIES } from '../constants'
import {
  AdjustmentsHorizontalIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [sortBy, setSortBy] = useState('name')
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    industry: searchParams.get('industry') || '',
    priceRange: '',
    inStock: true,
    onSale: false
  })

  // Mock products data - will come from API later
  const mockProducts = [
    {
      id: 1,
      name: "Professional Hard Hat with 4-Point Suspension",
      price: 29.99,
      originalPrice: 39.99,
      image: "/images/products/hard-hat-1.jpg",
      category: PROTECTION_CATEGORIES.HEAD,
      industry: INDUSTRIES.CONSTRUCTION,
      rating: 4.8,
      reviewCount: 124,
      inStock: true,
      isOnSale: true,
      isFeatured: true,
      sku: "HH-4PS-001",
      description: "ANSI Z89.1 compliant hard hat with superior impact protection"
    },
    {
      id: 2,
      name: "N95 Respirator Masks (Box of 20)",
      price: 24.99,
      image: "/images/products/n95-masks.jpg",
      category: PROTECTION_CATEGORIES.BREATHING,
      industry: INDUSTRIES.MEDICAL,
      rating: 4.9,
      reviewCount: 89,
      inStock: true,
      isFeatured: true,
      sku: "N95-020-BOX",
      description: "NIOSH approved N95 respirators for medical and industrial use"
    },
    {
      id: 3,
      name: "Steel Toe Safety Boots - Waterproof",
      price: 89.99,
      originalPrice: 120.00,
      image: "/images/products/steel-toe-boots.jpg",
      category: PROTECTION_CATEGORIES.FOOT,
      industry: INDUSTRIES.CONSTRUCTION,
      rating: 4.7,
      reviewCount: 156,
      inStock: true,
      isOnSale: true,
      sku: "STB-WP-10",
      description: "ASTM F2413 compliant steel toe boots with waterproof membrane"
    },
    {
      id: 4,
      name: "Cut-Resistant Work Gloves Level 5",
      price: 15.99,
      image: "/images/products/cut-resistant-gloves.jpg",
      category: PROTECTION_CATEGORIES.HAND,
      industry: INDUSTRIES.MANUFACTURING,
      rating: 4.6,
      reviewCount: 73,
      inStock: true,
      sku: "CRG-L5-001",
      description: "ANSI/ISEA 105 Level 5 cut protection with excellent dexterity"
    },
    {
      id: 5,
      name: "Safety Glasses with Anti-Fog Coating",
      price: 12.99,
      image: "/images/products/safety-glasses.jpg",
      category: PROTECTION_CATEGORIES.EYE,
      industry: INDUSTRIES.MANUFACTURING,
      rating: 4.5,
      reviewCount: 92,
      inStock: true,
      sku: "SG-AF-001",
      description: "ANSI Z87.1+ certified safety glasses with anti-fog technology"
    },
    {
      id: 6,
      name: "High-Visibility Safety Vest Class 2",
      price: 18.99,
      image: "/images/products/hi-vis-vest.jpg",
      category: PROTECTION_CATEGORIES.BODY,
      industry: INDUSTRIES.CONSTRUCTION,
      rating: 4.4,
      reviewCount: 67,
      inStock: false,
      sku: "HV-C2-001",
      description: "ANSI/ISEA 107 Class 2 high-visibility vest for road work"
    }
  ]

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredProducts = products.filter(product => {
    if (filters.category && product.category.id !== filters.category) return false
    if (filters.industry && product.industry.id !== filters.industry) return false
    if (filters.inStock && !product.inStock) return false
    if (filters.onSale && !product.isOnSale) return false
    return true
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      default:
        return 0
    }
  })

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      industry: '',
      priceRange: '',
      inStock: true,
      onSale: false
    })
    setSearchParams({})
  }

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🛡️ Safety Equipment Products
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Browse our comprehensive selection of professional safety equipment. 
            All products meet industry standards and certifications.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchBar 
                placeholder="Search safety equipment..."
                onSearch={(query) => console.log('Searching:', query)}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <div className="flex border rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                >
                  <Squares2X2Icon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                >
                  <ListBulletIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="hidden lg:block w-64 space-y-6">
            {/* Categories Filter */}
            <Card>
              <CardBody className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={filters.category === ''}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm">All Categories</span>
                  </label>
                  {Object.values(PROTECTION_CATEGORIES).map(category => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={filters.category === category.id}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm">{category.icon} {category.name}</span>
                    </label>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Industries Filter */}
            <Card>
              <CardBody className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Industries</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="industry"
                      value=""
                      checked={filters.industry === ''}
                      onChange={(e) => handleFilterChange('industry', e.target.value)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm">All Industries</span>
                  </label>
                  {Object.values(INDUSTRIES).map(industry => (
                    <label key={industry.id} className="flex items-center">
                      <input
                        type="radio"
                        name="industry"
                        value={industry.id}
                        checked={filters.industry === industry.id}
                        onChange={(e) => handleFilterChange('industry', e.target.value)}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm">{industry.icon} {industry.name}</span>
                    </label>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Other Filters */}
            <Card>
              <CardBody className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm">In Stock Only</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.onSale}
                      onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm">On Sale</span>
                  </label>
                </div>
              </CardBody>
            </Card>

            <Button variant="outline" onClick={clearFilters} className="w-full">
              Clear All Filters
            </Button>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort and Results */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-600">
                  Showing {sortedProducts.length} of {products.length} products
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products Display */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button variant="primary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
              }>
                {sortedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(product) => console.log('Add to cart:', product)}
                    onToggleWishlist={(product) => console.log('Toggle wishlist:', product)}
                    className={viewMode === 'list' ? 'flex' : ''}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Products