// frontend/src/components/Header.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Phone } from 'lucide-react';

const Header = ({ onOpenCart, cartItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();

  // Safety Equipment Categories - Aligned with your business
  const protectionCategories = [
    { name: 'Head Protection', path: '/products?category=head-protection', icon: '⛑️' },
    { name: 'Eye Protection', path: '/products?category=eye-protection', icon: '🥽' },
    { name: 'Hand Protection', path: '/products?category=hand-protection', icon: '🧤' },
    { name: 'Foot Protection', path: '/products?category=foot-protection', icon: '🥾' },
    { name: 'Breathing Protection', path: '/products?category=breathing-protection', icon: '😷' },
    { name: 'High-Vis Clothing', path: '/products?category=high-vis-clothing', icon: '🦺' }
  ];

  // Industry Categories
  const industryCategories = [
    { name: 'Medical & Healthcare', path: '/products?industry=medical', icon: '🏥' },
    { name: 'Construction & Building', path: '/products?industry=construction', icon: '🏗️' },
    { name: 'Manufacturing & Industrial', path: '/products?industry=manufacturing', icon: '🏭' }
  ];

  const totalItems = cartItems?.length || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>+254 700 000 000</span>
            </div>
            <span>Free delivery in Nairobi • Same day delivery available</span>
          </div>
          <div className="hidden md:block">
            Professional Safety Equipment Supplier
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              🛡️
            </div>
            <div>
              <div className="font-bold text-xl text-gray-900">SafeGuard</div>
              <div className="text-xs text-gray-500">Safety Equipment</div>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search safety equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/contact" className="text-gray-600 hover:text-blue-600 font-medium">
              Contact
            </Link>
            <button className="text-gray-600 hover:text-blue-600">
              <User className="h-6 w-6" />
            </button>
            <button 
              onClick={onOpenCart}
              className="relative text-gray-600 hover:text-blue-600"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={onOpenCart}
              className="relative text-gray-600 hover:text-blue-600"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search safety equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block border-t border-gray-200">
          <div className="flex items-center justify-center space-x-8 py-4">
            
            {/* All Products */}
            <Link 
              to="/products" 
              className="font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              All Products
            </Link>

            {/* Protection Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowCategoriesDropdown(true)}
              onMouseLeave={() => setShowCategoriesDropdown(false)}
            >
              <button className="font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center">
                Protection Types <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {showCategoriesDropdown && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {protectionCategories.map((category) => (
                        <Link
                          key={category.name}
                          to={category.path}
                          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-lg">{category.icon}</span>
                          <span className="text-sm font-medium">{category.name}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t mt-4 pt-4">
                      <h4 className="font-semibold text-gray-800 mb-2">By Industry</h4>
                      <div className="space-y-1">
                        {industryCategories.map((industry) => (
                          <Link
                            key={industry.name}
                            to={industry.path}
                            className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-lg">{industry.icon}</span>
                            <span className="text-sm">{industry.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Industry Links */}
            <Link 
              to="/products?industry=medical" 
              className="font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Medical PPE
            </Link>

            <Link 
              to="/products?industry=construction" 
              className="font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Construction
            </Link>

            <Link 
              to="/products?industry=manufacturing" 
              className="font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Industrial
            </Link>

            <Link 
              to="/products?sale=true" 
              className="font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              Sale
            </Link>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <Link 
                to="/products" 
                className="block font-medium text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                All Products
              </Link>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Protection Types</h4>
                <div className="space-y-2 pl-4">
                  {protectionCategories.map((category) => (
                    <Link
                      key={category.name}
                      to={category.path}
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Industries</h4>
                <div className="space-y-2 pl-4">
                  {industryCategories.map((industry) => (
                    <Link
                      key={industry.name}
                      to={industry.path}
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>{industry.icon}</span>
                      <span>{industry.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link 
                to="/products?sale=true" 
                className="block font-medium text-red-600 hover:text-red-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Sale Items
              </Link>

              <Link 
                to="/contact" 
                className="block font-medium text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;