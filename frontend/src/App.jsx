// frontend/src/App.jsx
import React, { useState } from 'react'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-lg border-b-2 border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-900 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">B</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-900">BONDEX</h1>
              <p className="text-xs text-green-600 font-medium">SUPPLIERS LIMITED</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-700 hover:text-blue-900 transition-colors font-medium">Home</a>
            <a href="#products" className="text-gray-700 hover:text-blue-900 transition-colors font-medium">Products</a>
            <a href="#categories" className="text-gray-700 hover:text-blue-900 transition-colors font-medium">Categories</a>
            <a href="#about" className="text-gray-700 hover:text-blue-900 transition-colors font-medium">About</a>
            <a href="#contact" className="text-gray-700 hover:text-blue-900 transition-colors font-medium">Contact</a>
          </nav>
          
          {/* Right side */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-sm text-gray-600">
              Sample: <span className="font-semibold text-green-600">KSh 1,250</span>
            </div>
            <button className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors font-medium shadow-md">
              Login
            </button>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              <a href="#home" className="py-2 text-gray-700 hover:text-blue-900">Home</a>
              <a href="#products" className="py-2 text-gray-700 hover:text-blue-900">Products</a>
              <a href="#categories" className="py-2 text-gray-700 hover:text-blue-900">Categories</a>
              <a href="#about" className="py-2 text-gray-700 hover:text-blue-900">About</a>
              <a href="#contact" className="py-2 text-gray-700 hover:text-blue-900">Contact</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section id="home" className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="bg-green-500 text-white p-4 rounded-lg mb-8 inline-block font-bold">
            ✅ Bondex Suppliers - Professional Safety Equipment
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Professional Safety Equipment
            <span className="block text-blue-900 mt-2">Made in Kenya</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Bondex Suppliers Limited - Your trusted partner for high-quality safety equipment. 
            From hard hats to safety boots, we have everything you need to keep your team safe.
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
      </div>
    </section>
  )
}

function Features() {
  const features = [
    {
      title: "Quality Assured",
      description: "All products meet international safety standards",
      icon: "✅",
      bgColor: "bg-green-100",
      textColor: "text-green-800"
    },
    {
      title: "Kenya Made",
      description: "Supporting local manufacturing and economy",
      icon: "🇰🇪",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800"
    },
    {
      title: "Fast Delivery",
      description: "Quick delivery across Kenya within 24-48 hours",
      icon: "🚚",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800"
    },
    {
      title: "Expert Support",
      description: "Professional advice from safety equipment experts",
      icon: "🛠️",
      bgColor: "bg-green-100",
      textColor: "text-green-800"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">
            Why Choose Bondex Suppliers Limited?
          </h2>
          <p className="text-lg text-gray-600">
            Your trusted safety equipment partner in Kenya
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6">
              <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Categories() {
  const categories = [
    {
      title: "Head Protection",
      description: "Hard hats, helmets, and protective headgear for construction and industrial use",
      icon: "🪖",
      count: 25,
      price: "KSh 500 - KSh 3,000"
    },
    {
      title: "Eye Protection",
      description: "Safety glasses, goggles, and face shields for comprehensive eye protection",
      icon: "🥽",
      count: 18,
      price: "KSh 200 - KSh 1,500"
    },
    {
      title: "Hand Protection",
      description: "Work gloves, safety gloves, and hand guards for various industries",
      icon: "🧤",
      count: 32,
      price: "KSh 150 - KSh 800"
    },
    {
      title: "Foot Protection",
      description: "Safety boots, steel-toe shoes, and protective footwear",
      icon: "🥾",
      count: 15,
      price: "KSh 2,000 - KSh 8,000"
    },
    {
      title: "Breathing Protection",
      description: "Masks, respirators, and air filtration equipment",
      icon: "😷",
      count: 22,
      price: "KSh 100 - KSh 2,500"
    },
    {
      title: "Body Protection",
      description: "Safety vests, coveralls, and protective clothing",
      icon: "🦺",
      count: 28,
      price: "KSh 800 - KSh 4,000"
    }
  ];

  return (
    <section id="categories" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">
            Safety Equipment Categories
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Professional-grade safety equipment for all industries across Kenya
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-900 to-green-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">{category.title}</h3>
              <p className="text-gray-600 mb-4 text-sm">{category.description}</p>
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {category.count} items
                </span>
                <span className="font-semibold text-green-600 text-sm">{category.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stats() {
  const stats = [
    { number: "5,000+", label: "Happy Customers", icon: "👥" },
    { number: "150+", label: "Products Available", icon: "📦" },
    { number: "99%", label: "Customer Satisfaction", icon: "⭐" },
    { number: "24/7", label: "Customer Support", icon: "📞" }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-blue-900 to-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Why Choose Bondex Suppliers Limited?
          </h2>
          <p className="text-blue-100 text-lg">
            Trusted by thousands of customers across Kenya
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-blue-100 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer id="contact" className="bg-blue-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-800 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">B</span>
              </div>
              <div>
                <div className="text-white font-bold text-lg">BONDEX</div>
                <div className="text-green-400 text-xs">SUPPLIERS LIMITED</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted partner for professional safety equipment across Kenya. 
              Quality products at competitive prices.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#home" className="hover:text-green-400 transition-colors">Home</a></li>
              <li><a href="#products" className="hover:text-green-400 transition-colors">Products</a></li>
              <li><a href="#categories" className="hover:text-green-400 transition-colors">Categories</a></li>
              <li><a href="#about" className="hover:text-green-400 transition-colors">About Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Product Categories</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-green-400 transition-colors">Head Protection</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Eye Protection</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Hand Protection</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Foot Protection</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact Information</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center space-x-2">
                <span className="text-green-400">📞</span>
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-400">✉️</span>
                <span>info@bondexsuppliers.co.ke</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-400">📍</span>
                <span>Nairobi, Kenya</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-400">🕒</span>
                <span>Mon-Fri: 8AM-6PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2025 Bondex Suppliers Limited. All rights reserved. | Currency: KES | Made in Kenya 🇰🇪
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Professional Safety Equipment • Quality Assured • Trusted by Thousands
          </p>
        </div>
      </div>
    </footer>
  )
}

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <Features />
        <Categories />
        <Stats />
      </main>
      <Footer />
    </div>
  )
}

export default App