import { Link } from 'react-router-dom'
import { ShieldCheckIcon, TruckIcon, StarIcon, UsersIcon } from '@heroicons/react/24/outline'
import Layout from '../components/layout/Layout'
import { Card, CardBody } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { CategoryCard, ProductCard } from '../components/common'
import { PROTECTION_CATEGORIES, INDUSTRIES } from '../constants'

const Home = () => {
  const categories = Object.values(PROTECTION_CATEGORIES)
  const industries = Object.values(INDUSTRIES)

  // Mock featured products - these will come from API later
  const featuredProducts = [
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
      isFeatured: true
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
      isFeatured: true
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
      isFeatured: true
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
      isFeatured: true
    }
  ]

  const stats = [
    { icon: ShieldCheckIcon, value: '10,000+', label: 'Products Sold', color: 'primary' },
    { icon: UsersIcon, value: '2,500+', label: 'Happy Customers', color: 'secondary' },
    { icon: StarIcon, value: '4.9', label: 'Average Rating', color: 'warning' },
    { icon: TruckIcon, value: '24h', label: 'Fast Shipping', color: 'success' }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="gradient-safety text-white">
        <div className="container-custom py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Professional Safety Equipment for Every Industry
            </h1>
            <p className="text-xl text-gray-100 max-w-2xl mx-auto">
              Protect your workforce with our comprehensive range of safety equipment. 
              From hard hats to respirators, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="yellow" size="lg" className="text-lg px-8">
                🛒 Shop Now
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary-600">
                📋 View Catalog
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${stat.color}-100 flex items-center justify-center`}>
                  <stat.icon className={`h-8 w-8 text-${stat.color}-600`} />
                </div>
                <div className={`text-3xl font-bold text-${stat.color}-600 mb-1`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Protection Type
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find the right safety equipment for your specific needs. 
              Our products meet industry standards and certifications.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categories.map((category) => (
              <CategoryCard 
                key={category.id} 
                category={category}
                productCount={Math.floor(Math.random() * 50) + 10} // Mock count
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-gray-600">
                Hand-picked products for maximum protection and value
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline">
                View All Products
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onAddToCart={(product) => console.log('Add to cart:', product)}
                onToggleWishlist={(product) => console.log('Toggle wishlist:', product)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Industries We Serve
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Specialized safety solutions for different industry requirements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {industries.map((industry) => (
              <Link key={industry.id} to={`/industry/${industry.id}`}>
                <Card className="group hover:shadow-medium transition-all duration-300 cursor-pointer">
                  <CardBody className="text-center space-y-4 p-8">
                    <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {industry.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {industry.name}
                    </h3>
                    <p className="text-gray-600">
                      {industry.description}
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      {industry.requirements.map((req, index) => (
                        <li key={index}>✓ {req}</li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 gradient-dark text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Protect Your Team?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Get started with our safety equipment today. Free shipping on orders over $100, 
            and expert support to help you choose the right gear.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg">
              📞 Contact Sales
            </Button>
            <Button variant="yellow" size="lg">
              📋 Request Quote
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Home