// frontend/src/components/Header.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Heart,
  Phone,
  Mail,
  MapPin,
  Shield
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Cart context
  const { totalItems, toggleCart, formatPrice, finalAmount } = useCart();

  // Sample categories - replace with actual categories from your API
  const categories = [
    { name: 'Head Protection', path: '/products?category=head-protection', icon: '⛑️' },
    { name: 'Eye Protection', path: '/products?category=eye-protection', icon: '🥽' },
    { name: 'Hand Protection', path: '/products?category=hand-protection', icon: '🧤' },
    { name: 'Foot Protection', path: '/products?category=foot-protection', icon: '👢' },
    { name: 'Breathing Protection', path: '/products?category=breathing-protection', icon: '😷' },
    { name: 'Body Protection', path: '/products?category=body-protection', icon: '🦺' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsSearchOpen(false);
      setIsMenuOpen(false);
    }
  };

  const handleCartClick = () => {
    toggleCart();
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-sm">
            {/* Contact Info */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+254 700 000 000</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@bondexsafety.co.ke</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>

            {/* Top Right */}
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline">Free shipping on orders over KES 5,000</span>
              <Link to="/admin" className="hover:text-blue-400 transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Bondex Safety</h1>
                <p className="text-xs text-gray-500">Professional Safety Equipment</p>
              </div>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search safety equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="h-5 w-5 text-gray-400" />
              </button>
            </form>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Toggle for Mobile */}
            <button
              onClick={toggleSearch}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600"
            >
              <Search className="h-6 w-6" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
              title="Wishlist"
            >
              <Heart className="h-6 w-6" />
              {/* Wishlist count badge - add when wishlist is implemented */}
              {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span> */}
            </Link>

            {/* Account */}
            <Link
              to="/account"
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              title="My Account"
            >
              <User className="h-6 w-6" />
            </Link>

            {/* Cart */}
            <button
              onClick={handleCartClick}
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors group"
              title="Shopping Cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
              
              {/* Cart Preview Tooltip */}
              {totalItems > 0 && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4">
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      {totalItems} item{totalItems !== 1 ? 's' : ''} in cart
                    </div>
                    <div className="text-lg font-bold text-blue-600 mb-3">
                      {formatPrice(finalAmount)}
                    </div>
                    <button
                      onClick={handleCartClick}
                      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      View Cart
                    </button>
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Mobile Search */}
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-600 hover:text-blue-600"
            >
              <Search className="h-6 w-6" />
            </button>

            {/* Mobile Cart */}
            <button
              onClick={handleCartClick}
              className="relative p-2 text-gray-600 hover:text-blue-600"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-600 hover:text-blue-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className={`font-medium transition-colors ${
                location.pathname === '/products' 
                  ? 'text-blue-600' 
                  : 'text-gray-900 hover:text-blue-600'
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
              <button className="flex items-center space-x-1 text-gray-900 hover:text-blue-600 font-medium transition-colors">
                <span>Categories</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {showCategoriesDropdown && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    {categories.map((category, index) => (
                      <Link
                        key={index}
                        to={category.path}
                        className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        <span className="text-xl">{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Other Nav Links */}
            <Link 
              to="/brands" 
              className={`font-medium transition-colors ${
                location.pathname === '/brands' 
                  ? 'text-blue-600' 
                  : 'text-gray-900 hover:text-blue-600'
              }`}
            >
              Brands
            </Link>

            <Link 
              to="/industries" 
              className={`font-medium transition-colors ${
                location.pathname === '/industries' 
                  ? 'text-blue-600' 
                  : 'text-gray-900 hover:text-blue-600'
              }`}
            >
              Industries
            </Link>

            <Link 
              to="/about" 
              className={`font-medium transition-colors ${
                location.pathname === '/about' 
                  ? 'text-blue-600' 
                  : 'text-gray-900 hover:text-blue-600'
              }`}
            >
              About Us
            </Link>

            <Link 
              to="/contact" 
              className={`font-medium transition-colors ${
                location.pathname === '/contact' 
                  ? 'text-blue-600' 
                  : 'text-gray-900 hover:text-blue-600'
              }`}
            >
              Contact
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            <Link
              to="/products"
              className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </Link>
            
            {/* Mobile Categories */}
            <div className="space-y-1">
              <div className="px-3 py-2 text-base font-medium text-gray-700">Categories</div>
              {categories.map((category, index) => (
                <Link
                  key={index}
                  to={category.path}
                  className="flex items-center space-x-3 px-6 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </Link>
              ))}
            </div>

            <Link
              to="/brands"
              className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Brands
            </Link>

            <Link
              to="/industries"
              className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Industries
            </Link>

            <Link
              to="/about"
              className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {/* Mobile Account Links */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <Link
                to="/account"
                className="flex items-center space-x-3 px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>My Account</span>
              </Link>

              <Link
                to="/wishlist"
                className="flex items-center space-x-3 px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-5 w-5" />
                <span>Wishlist</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;