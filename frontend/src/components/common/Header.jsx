// File: frontend/src/components/common/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      {/* Top bar */}
      <div className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-10 text-sm">
            <div className="flex items-center space-x-4">
              <span>🇰🇪 Kenya / English</span>
              <span>|</span>
              <span>Free shipping on orders over KSh 50,000</span>
            </div>
            <div>
              <Link to="/contact" className="hover:text-yellow-400">Contact</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xl">B</span>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">BONDEX</div>
              <div className="text-xs text-gray-500">SUPPLIERS LIMITED</div>
            </div>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for safety equipment..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:border-green-500 focus:outline-none"
              />
              <button className="absolute right-2 top-2 bg-yellow-400 p-1 rounded">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="hidden md:flex space-x-8 h-12 items-center">
            <Link to="/" className="text-gray-700 hover:text-green-600 font-medium">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-green-600 font-medium">Products</Link>
            <Link to="/categories" className="text-gray-700 hover:text-green-600 font-medium">Categories</Link>
            <Link to="/industries" className="text-gray-700 hover:text-green-600 font-medium">Industries</Link>
            <Link to="/about" className="text-gray-700 hover:text-green-600 font-medium">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-green-600 font-medium">Contact</Link>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-1">
            <Link to="/" className="block py-2 text-gray-700">Home</Link>
            <Link to="/products" className="block py-2 text-gray-700">Products</Link>
            <Link to="/categories" className="block py-2 text-gray-700">Categories</Link>
            <Link to="/industries" className="block py-2 text-gray-700">Industries</Link>
            <Link to="/about" className="block py-2 text-gray-700">About</Link>
            <Link to="/contact" className="block py-2 text-gray-700">Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;