// frontend/src/components/common/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      {/* Top Bar */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 text-sm">
            <div className="flex items-center space-x-6">
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="text-gray-300">Kenya / English</span>
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-300">Free shipping on orders over KSh 50,000</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-gray-900 text-2xl font-bold">B</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">BONDEX</h1>
              <p className="text-xs text-yellow-400 font-semibold tracking-wider">SUPPLIERS LIMITED</p>
            </div>
          </Link>
          
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for safety equipment..."
                  className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 text-gray-900 p-2 rounded-md hover:bg-yellow-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-gray-300 hover:text-yellow-400"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="hidden md:flex space-x-8 py-4">
            <Link to="/" className="text-gray-300 hover:text-yellow-400 transition-colors font-medium flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </Link>
            <Link to="/products" className="text-gray-300 hover:text-yellow-400 transition-colors font-medium">Products</Link>
            <div className="relative group">
              <button className="text-gray-300 hover:text-yellow-400 transition-colors font-medium flex items-center space-x-1">
                <span>Categories</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link to="/products?category=head" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Head Protection</div>
                    <div className="text-xs text-gray-500">Hard hats, helmets</div>
                  </div>
                </Link>
                <Link to="/products?category=eye" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Eye Protection</div>
                    <div className="text-xs text-gray-500">Safety glasses, goggles</div>
                  </div>
                </Link>
                <Link to="/products?category=hand" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Hand Protection</div>
                    <div className="text-xs text-gray-500">Work gloves, cut resistant</div>
                  </div>
                </Link>
                <Link to="/products?category=foot" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Foot Protection</div>
                    <div className="text-xs text-gray-500">Safety boots, steel toe</div>
                  </div>
                </Link>
              </div>
            </div>
            <Link to="/industries" className="text-gray-300 hover:text-yellow-400 transition-colors font-medium">Industries</Link>
            <Link to="/about" className="text-gray-300 hover:text-yellow-400 transition-colors font-medium">About</Link>
            <Link to="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors font-medium">Contact</Link>
          </nav>
        </div>
      </div>
        
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 py-4 space-y-2">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for safety equipment..."
                  className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 text-gray-900 p-2 rounded-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            <Link to="/" className="block text-gray-300 hover:text-yellow-400 transition-colors font-medium py-2">Home</Link>
            <Link to="/products" className="block text-gray-300 hover:text-yellow-400 transition-colors font-medium py-2">Products</Link>
            <Link to="/industries" className="block text-gray-300 hover:text-yellow-400 transition-colors font-medium py-2">Industries</Link>
            <Link to="/about" className="block text-gray-300 hover:text-yellow-400 transition-colors font-medium py-2">About</Link>
            <Link to="/contact" className="block text-gray-300 hover:text-yellow-400 transition-colors font-medium py-2">Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;