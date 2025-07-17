import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-900 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">B</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-blue-900">BONDEX</h1>
                  <p className="text-xs text-green-600 font-medium">SUPPLIERS LIMITED</p>
                </div>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="/" className="text-gray-600 hover:text-blue-900 font-medium">Home</a>
                <a href="/products" className="text-gray-600 hover:text-blue-900 font-medium">Products</a>
                <a href="/about" className="text-gray-600 hover:text-blue-900 font-medium">About</a>
                <a href="/contact" className="text-gray-600 hover:text-blue-900 font-medium">Contact</a>
              </nav>
              <button className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors">Login</button>
            </div>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={
              <div>
                <section className="bg-gradient-to-br from-blue-50 to-green-50 py-20">
                  <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="bg-green-500 text-white p-4 rounded-lg mb-8 inline-block font-bold">
                      ✅ FIXED! TailwindCSS Working with Bondex Colors!
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                      Professional Safety Equipment
                      <span className="block text-blue-900 mt-2">Made in Kenya</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                      Bondex Suppliers Limited - Your trusted partner for high-quality safety equipment.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button className="bg-blue-900 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-800 transition-colors shadow-lg">
                        Shop Now
                      </button>
                      <button className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-600 hover:text-white transition-colors">
                        View Catalog
                      </button>
                    </div>
                  </div>
                </section>

                <section className="py-16 bg-white">
                  <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-bold text-blue-900 mb-4">Safety Equipment Categories</h2>
                      <div className="w-24 h-1 bg-gradient-to-r from-blue-900 to-green-600 mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="text-4xl mb-4">🪖</div>
                        <h3 className="text-xl font-semibold text-blue-900 mb-2">Head Protection</h3>
                        <p className="text-gray-600 mb-4">Hard hats, helmets, and protective headgear</p>
                        <div className="flex justify-between items-center">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">25 items</span>
                          <span className="font-semibold text-green-600">KSh 500 - 3,000</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="text-4xl mb-4">🥽</div>
                        <h3 className="text-xl font-semibold text-blue-900 mb-2">Eye Protection</h3>
                        <p className="text-gray-600 mb-4">Safety glasses, goggles, and face shields</p>
                        <div className="flex justify-between items-center">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">18 items</span>
                          <span className="font-semibold text-green-600">KSh 200 - 1,500</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="text-4xl mb-4">🧤</div>
                        <h3 className="text-xl font-semibold text-blue-900 mb-2">Hand Protection</h3>
                        <p className="text-gray-600 mb-4">Work gloves, safety gloves, and hand guards</p>
                        <div className="flex justify-between items-center">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">32 items</span>
                          <span className="font-semibold text-green-600">KSh 150 - 800</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="text-4xl mb-4">🥾</div>
                        <h3 className="text-xl font-semibold text-blue-900 mb-2">Foot Protection</h3>
                        <p className="text-gray-600 mb-4">Safety boots, steel-toe shoes, and protective footwear</p>
                        <div className="flex justify-between items-center">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">15 items</span>
                          <span className="font-semibold text-green-600">KSh 2,000 - 8,000</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="text-4xl mb-4">😷</div>
                        <h3 className="text-xl font-semibold text-blue-900 mb-2">Breathing Protection</h3>
                        <p className="text-gray-600 mb-4">Masks, respirators, and air filtration</p>
                        <div className="flex justify-between items-center">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">22 items</span>
                          <span className="font-semibold text-green-600">KSh 100 - 2,500</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="text-4xl mb-4">🦺</div>
                        <h3 className="text-xl font-semibold text-blue-900 mb-2">Body Protection</h3>
                        <p className="text-gray-600 mb-4">Safety vests, coveralls, and protective clothing</p>
                        <div className="flex justify-between items-center">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">28 items</span>
                          <span className="font-semibold text-green-600">KSh 800 - 4,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="py-16 bg-gradient-to-r from-blue-900 to-green-600">
                  <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-8">Why Choose Bondex Suppliers Limited?</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-white mb-2">5,000+</div>
                        <div className="text-blue-100">Happy Customers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-white mb-2">150+</div>
                        <div className="text-blue-100">Products Available</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-white mb-2">99%</div>
                        <div className="text-blue-100">Customer Satisfaction</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-white mb-2">24/7</div>
                        <div className="text-blue-100">Customer Support</div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="py-16 bg-gray-100">
                  <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-blue-900 mb-8">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✅</div>
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Quality Assured</h3>
                        <p className="text-gray-600 text-sm">International safety standards</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🇰🇪</div>
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Kenya Made</h3>
                        <p className="text-gray-600 text-sm">Supporting local economy</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">��</div>
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Fast Delivery</h3>
                        <p className="text-gray-600 text-sm">24-48 hours across Kenya</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🛠️</div>
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Expert Support</h3>
                        <p className="text-gray-600 text-sm">Professional advice</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            } />
            <Route path="/products" element={
              <div className="py-16 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 text-center">
                  <h1 className="text-4xl font-bold mb-4 text-blue-900">Our Products</h1>
                  <div className="bg-white p-8 rounded-xl shadow-md">
                    <h3 className="text-2xl font-semibold mb-4">Coming Soon</h3>
                    <p className="text-gray-600">Product catalog under development</p>
                  </div>
                </div>
              </div>
            } />
            <Route path="*" element={
              <div className="py-16 text-center">
                <h1 className="text-3xl font-bold text-blue-900">404 - Page Not Found</h1>
                <a href="/" className="bg-blue-900 text-white px-6 py-3 rounded-lg mt-4 inline-block">Go Home</a>
              </div>
            } />
          </Routes>
        </main>

        <footer className="bg-blue-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-800 to-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">B</span>
                  </div>
                  <div>
                    <div className="text-white font-bold">BONDEX</div>
                    <div className="text-green-400 text-xs">SUPPLIERS LIMITED</div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">Your trusted partner for professional safety equipment across Kenya.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="/" className="hover:text-green-400">Home</a></li>
                  <li><a href="/products" className="hover:text-green-400">Products</a></li>
                  <li><a href="/about" className="hover:text-green-400">About</a></li>
                  <li><a href="/contact" className="hover:text-green-400">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Categories</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>Head Protection</li>
                  <li>Eye Protection</li>
                  <li>Hand Protection</li>
                  <li>Foot Protection</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>📞 +254 700 000 000</li>
                  <li>✉️ info@bondexsuppliers.co.ke</li>
                  <li>📍 Nairobi, Kenya</li>
                  <li>🕒 Mon-Fri: 8AM-6PM</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
              <p>&copy; 2025 Bondex Suppliers Limited. All rights reserved. | Currency: KES | Made in Kenya 🇰🇪</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
