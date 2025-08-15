// File Path: frontend/src/components/layout/Header.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-slate-900 text-white shadow-lg">
      {/* Top Bar */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6 text-gray-300">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +254 700 000 000
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@bondexsafety.co.ke
              </span>
            </div>
            <div className="hidden md:flex items-center text-gray-300">
              <svg className="w-4 h-4 mr-1 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H19a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Free delivery on orders over KES 5,000
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
                <div className="text-white font-bold text-xl leading-none">B</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">BONDEX</div>
                <div className="text-xs text-orange-400 font-medium tracking-wider">SAFETY EQUIPMENT</div>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search safety equipment..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-white text-gray-900 rounded-lg border-0 shadow-sm focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-md transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart Icon */}
              <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="hidden md:block bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-8">
            {/* Main Navigation Links */}
            <Link 
              to="/"
              className="flex items-center px-4 py-4 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>

            <Link 
              to="/products"
              className="flex items-center px-4 py-4 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              All Products
            </Link>

            {/* Category Dropdown */}
            <div className="relative group">
              <button className="flex items-center px-4 py-4 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors font-medium">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Categories
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <button
                    onClick={() => handleCategoryClick('head-protection')}
                    className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center text-gray-700"
                  >
                    <span className="mr-3 text-lg">⛑️</span>
                    Head Protection
                  </button>
                  <button
                    onClick={() => handleCategoryClick('eye-protection')}
                    className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center text-gray-700"
                  >
                    <span className="mr-3 text-lg">🥽</span>
                    Eye Protection
                  </button>
                  <button
                    onClick={() => handleCategoryClick('hand-protection')}
                    className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center text-gray-700"
                  >
                    <span className="mr-3 text-lg">🧤</span>
                    Hand Protection
                  </button>
                  <button
                    onClick={() => handleCategoryClick('foot-protection')}
                    className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center text-gray-700"
                  >
                    <span className="mr-3 text-lg">👢</span>
                    Foot Protection
                  </button>
                  <button
                    onClick={() => handleCategoryClick('respiratory-protection')}
                    className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center text-gray-700"
                  >
                    <span className="mr-3 text-lg">😷</span>
                    Respiratory Protection
                  </button>
                  <button
                    onClick={() => handleCategoryClick('high-visibility')}
                    className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center text-gray-700"
                  >
                    <span className="mr-3 text-lg">🦺</span>
                    High Visibility
                  </button>
                </div>
              </div>
            </div>

            <Link 
              to="/about"
              className="flex items-center px-4 py-4 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About
            </Link>

            <Link 
              to="/contact"
              className="flex items-center px-4 py-4 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-800 border-b border-slate-700">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-white text-gray-900 rounded-lg border-0 placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <Link 
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                🏠 Home
              </Link>
              
              <Link 
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                📦 All Products
              </Link>

              {/* Mobile Categories */}
              <div className="pl-4">
                <div className="text-sm text-gray-400 font-medium mb-2">Categories:</div>
                <button
                  onClick={() => handleCategoryClick('head-protection')}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm"
                >
                  ⛑️ Head Protection
                </button>
                <button
                  onClick={() => handleCategoryClick('eye-protection')}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm"
                >
                  🥽 Eye Protection
                </button>
                <button
                  onClick={() => handleCategoryClick('hand-protection')}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm"
                >
                  🧤 Hand Protection
                </button>
                <button
                  onClick={() => handleCategoryClick('foot-protection')}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm"
                >
                  👢 Foot Protection
                </button>
                <button
                  onClick={() => handleCategoryClick('respiratory-protection')}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm"
                >
                  😷 Respiratory Protection
                </button>
                <button
                  onClick={() => handleCategoryClick('high-visibility')}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm"
                >
                  🦺 High Visibility
                </button>
              </div>
              
              <Link 
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                ℹ️ About
              </Link>
              
              <Link 
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                📞 Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;