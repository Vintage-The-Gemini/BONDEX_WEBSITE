import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ShoppingCartIcon, 
  UserIcon, 
  MagnifyingGlassIcon, 
  Bars3Icon,
  XMarkIcon 
} from '@heroicons/react/24/outline'
import Button from '../ui/Button'
import { PROTECTION_CATEGORIES, INDUSTRIES } from '../../constants'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0) // This will come from Redux later

  const categories = Object.values(PROTECTION_CATEGORIES)
  const industries = Object.values(INDUSTRIES)

  return (
    <header className="bg-white shadow-sm border-b-4 border-primary-500 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-brandBlack text-white">
        <div className="container-custom py-2">
          <div className="flex justify-between items-center text-sm">
            <span>🚚 Free shipping on orders over $100</span>
            <div className="hidden md:flex space-x-4">
              <span>📞 1-800-BONDEX</span>
              <span>📧 info@bondex.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl">🛡️</span>
            <div>
              <h1 className="text-2xl font-bold text-primary-600">Bondex</h1>
              <p className="text-xs text-gray-600">Safety Equipment</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search safety equipment..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <Button variant="primary" className="ml-2">
              Search
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary-500 text-brandBlack text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <Link to="/auth/login" className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <UserIcon className="h-6 w-6" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search safety equipment..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="safety-nav">
        <div className="container-custom">
          <div className="hidden md:flex space-x-1">
            <Link to="/" className="safety-nav-item">
              🏠 Home
            </Link>
            {categories.map((category) => (
              <Link 
                key={category.id}
                to={`/category/${category.id}`} 
                className="safety-nav-item"
              >
                {category.icon} {category.name}
              </Link>
            ))}
            <div className="relative group">
              <button className="safety-nav-item">
                🏭 Industries
              </button>
              {/* Industries Dropdown */}
              <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg border border-gray-200 py-2 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {industries.map((industry) => (
                  <Link
                    key={industry.id}
                    to={`/industry/${industry.id}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                  >
                    {industry.icon} {industry.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-700">
              <div className="space-y-2">
                <Link to="/" className="block py-2 text-white hover:text-primary-400">
                  🏠 Home
                </Link>
                {categories.map((category) => (
                  <Link 
                    key={category.id}
                    to={`/category/${category.id}`} 
                    className="block py-2 text-white hover:text-primary-400"
                  >
                    {category.icon} {category.name}
                  </Link>
                ))}
                <div className="pt-2 border-t border-gray-700">
                  <p className="text-gray-400 text-sm mb-2">Industries</p>
                  {industries.map((industry) => (
                    <Link
                      key={industry.id}
                      to={`/industry/${industry.id}`}
                      className="block py-2 pl-4 text-white hover:text-primary-400"
                    >
                      {industry.icon} {industry.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header