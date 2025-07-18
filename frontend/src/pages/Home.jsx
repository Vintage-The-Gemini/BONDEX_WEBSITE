// File: frontend/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Professional Safety Equipment
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Quality safety gear for construction, industrial and workplace protection
            </p>
            <div className="space-x-4">
              <Link 
                to="/products" 
                className="bg-green-600 text-white px-8 py-3 rounded font-semibold hover:bg-green-700"
              >
                Shop Now
              </Link>
              <Link 
                to="/contact" 
                className="bg-yellow-500 text-black px-8 py-3 rounded font-semibold hover:bg-yellow-600"
              >
                Get Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600">500+</div>
              <div className="text-gray-600">Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">2,000+</div>
              <div className="text-gray-600">Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">15+</div>
              <div className="text-gray-600">Years</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">47</div>
              <div className="text-gray-600">Cities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Safety Categories</h2>
          <div className="grid grid-cols-3 gap-8">
            <Link to="/products?category=head" className="bg-white border rounded-lg p-6 hover:shadow-lg">
              <div className="text-4xl mb-4">🪖</div>
              <h3 className="text-xl font-semibold mb-2">Head Protection</h3>
              <p className="text-gray-600">Hard hats and helmets</p>
            </Link>
            <Link to="/products?category=eye" className="bg-white border rounded-lg p-6 hover:shadow-lg">
              <div className="text-4xl mb-4">🥽</div>
              <h3 className="text-xl font-semibold mb-2">Eye Protection</h3>
              <p className="text-gray-600">Safety glasses and goggles</p>
            </Link>
            <Link to="/products?category=hand" className="bg-white border rounded-lg p-6 hover:shadow-lg">
              <div className="text-4xl mb-4">🧤</div>
              <h3 className="text-xl font-semibold mb-2">Hand Protection</h3>
              <p className="text-gray-600">Work gloves and gear</p>
            </Link>
            <Link to="/products?category=foot" className="bg-white border rounded-lg p-6 hover:shadow-lg">
              <div className="text-4xl mb-4">🥾</div>
              <h3 className="text-xl font-semibold mb-2">Foot Protection</h3>
              <p className="text-gray-600">Safety boots and shoes</p>
            </Link>
            <Link to="/products?category=respiratory" className="bg-white border rounded-lg p-6 hover:shadow-lg">
              <div className="text-4xl mb-4">😷</div>
              <h3 className="text-xl font-semibold mb-2">Respiratory</h3>
              <p className="text-gray-600">Masks and respirators</p>
            </Link>
            <Link to="/products?category=visibility" className="bg-white border rounded-lg p-6 hover:shadow-lg">
              <div className="text-4xl mb-4">🦺</div>
              <h3 className="text-xl font-semibold mb-2">High Visibility</h3>
              <p className="text-gray-600">Reflective clothing</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Bondex</h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Certified</h3>
              <p className="text-gray-600">All products meet international safety standards</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Free shipping on orders over KES 50,000</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-600">Professional guidance for your safety needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-gray-300">Browse our catalog or contact us for a custom quote</p>
          <div className="space-x-4">
            <Link 
              to="/products" 
              className="bg-green-600 text-white px-8 py-3 rounded font-semibold hover:bg-green-700"
            >
              Browse Products
            </Link>
            <Link 
              to="/contact" 
              className="bg-yellow-500 text-black px-8 py-3 rounded font-semibold hover:bg-yellow-600"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;