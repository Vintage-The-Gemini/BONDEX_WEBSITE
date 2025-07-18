// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Shield, ChevronDown } from 'lucide-react';

const Header = ({ onOpenCart, cartCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showIndustriesDropdown, setShowIndustriesDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsSearchOpen(false);
    }
  };

  const categories = [
    { name: 'Head Protection', path: '/products/head-protection', icon: '🪖' },
    { name: 'Foot Protection', path: '/products/foot-protection', icon: '🥾' },
    { name: 'Eye Protection', path: '/products/eye-protection', icon: '🥽' },
    { name: 'Hand Protection', path: '/products/hand-protection', icon: '🧤' },
    { name: 'Breathing Protection', path: '/products/breathing-protection', icon: '😷' },
    { name: 'Workwear', path: '/products/workwear', icon: '🦺' }
  ];

  const industries = [
    { name: 'Medical & Healthcare', path: '/industries/medical', icon: '🏥' },
    { name: 'Construction', path: '/industries/construction', icon: '🏗️' },
    { name: 'Manufacturing', path: '/industries/manufacturing', icon: '🏭' }
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span>📞 +254 700 000 000</span>
              <span>📧 info@bondexsafety.co.ke</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/sale" className="hover:text-primary-200 font-medium">
                🔥 Flash Sale - Up to 30% Off!
              </Link>
              <span>🚚 Free Delivery in Nairobi</span>
              <span>💰 All Prices in KES</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-primary-500 p-2 rounded-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bondex Safety</h1>
              <p className="text-sm text-gray-600">Professional Safety Equipment</p>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search safety equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button type="submit" className="absolute left-3 top-2.5">
                <Search className="h-5 w-5 text-gray-400" />
              </button>
            </form>
          </div>

          {/* Desktop Navigation Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={toggleSearch}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600"
            >
              <Search className="h-6 w-6" />
            </button>
            
            <Link to="/account" className="p-2 text-gray-600 hover:text-primary-600">
              <User className="h-6 w-6" />
            </Link>
            
            <button 
              onClick={onOpenCart}
              className="relative p-2 text-gray-600 hover:text-primary-600"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-600 hover:text-primary-600"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search safety equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button type="submit" className="absolute left-3 top-2.5">
                <Search className="h-5 w-5 text-gray-400" />
              </button>
            </form>
          </div>
        )}

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:block border-t border-gray-200 py-4">
          <div className="flex items-center justify-center space-x-8">
            {/* All Products */}
            <Link 
              to="/products" 
              className={`font-medium ${
                location.pathname === '/products' 
                  ? 'text-primary-600' 
                  : 'text-gray-900 hover:text-primary-600'
              }`}
            >
              All Products
            </Link>

            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowCategoriesDropdown(true)}
              onMouseLeave={() => setShowCategoriesDropdown(false)}
            >
              <button className="flex items-center space-x-1 text-gray-900 hover:text-primary-600 font-medium">
                <span>Categories</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {showCategoriesDropdown && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    {categories.map((category) => (
                      <Link
                        key={category.path}
                        to={category.path}
                        className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        onClick={() => setShowCategoriesDropdown(false)}
                      >
                        <span className="text-xl">{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 p-2">
                    <Link
                      to="/products"
                      className="block text-center text-primary-600 hover:text-primary-700 font-medium py-2"
                      onClick={() => setShowCategoriesDropdown(false)}
                    >
                      View All Categories →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Industries Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowIndustriesDropdown(true)}
              onMouseLeave={() => setShowIndustriesDropdown(false)}
            >
              <button className="flex items-center space-x-1 text-gray-900 hover:text-primary-600 font-medium">
                <span>Industries</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {showIndustriesDropdown && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    {industries.map((industry) => (
                      <Link
                        key={industry.path}
                        to={industry.path}
                        className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        onClick={() => setShowIndustriesDropdown(false)}
                      >
                        <span className="text-xl">{industry.icon}</span>
                        <span className="font-medium">{industry.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sale Link */}
            <Link 
              to="/sale" 
              className={`font-medium text-red-600 hover:text-red-700 ${
                location.pathname === '/sale' ? 'text-red-700' : ''
              }`}
            >
              🔥 Sale
            </Link>

            {/* Quick Links */}
            <Link 
              to="/bulk-orders" 
              className="text-gray-900 hover:text-primary-600 font-medium"
            >
              Bulk Orders
            </Link>

            <Link 
              to="/contact" 
              className="text-gray-900 hover:text-primary-600 font-medium"
            >
              Contact
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {/* Mobile Search */}
            <div className="pb-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search safety equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button type="submit" className="absolute left-3 top-2.5">
                  <Search className="h-5 w-5 text-gray-400" />
                </button>
              </form>
            </div>

            {/* Mobile Navigation Links */}
            <Link 
              to="/products" 
              className="block px-3 py-2 text-gray-900 hover:bg-primary-50 hover:text-primary-600 rounded-md font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </Link>

            {/* Mobile Categories */}
            <div className="py-2">
              <h4 className="px-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">Categories</h4>
              {categories.map((category) => (
                <Link
                  key={category.path}
                  to={category.path}
                  className="flex items-center space-x-3 px-3 py-2 text-gray-900 hover:bg-primary-50 hover:text-primary-600 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Industries */}
            <div className="py-2">
              <h4 className="px-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">Industries</h4>
              {industries.map((industry) => (
                <Link
                  key={industry.path}
                  to={industry.path}
                  className="flex items-center space-x-3 px-3 py-2 text-gray-900 hover:bg-primary-50 hover:text-primary-600 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{industry.icon}</span>
                  <span>{industry.name}</span>
                </Link>
              ))}
            </div>
            
            <hr className="my-2" />
            
            {/* Mobile Actions */}
            <div className="flex items-center justify-around py-2">
              <Link 
                to="/account"
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Account</span>
              </Link>
              <button 
                onClick={() => { onOpenCart(); setIsMenuOpen(false); }}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Cart ({cartCount})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;