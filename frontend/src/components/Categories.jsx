// src/components/Categories.jsx
import React from 'react';
import { ArrowRight, Shield, Eye, Footprints, Hand, Wind, Shirt } from 'lucide-react';

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: "Head Protection",
      description: "Safety helmets, hard hats, and bump caps",
      icon: "🪖",
      productCount: 45,
      bgColor: "from-blue-500 to-blue-600",
      textColor: "text-blue-600"
    },
    {
      id: 2,
      name: "Foot Protection",
      description: "Safety boots, shoes, and toe caps",
      icon: "🥾",
      productCount: 67,
      bgColor: "from-green-500 to-green-600",
      textColor: "text-green-600"
    },
    {
      id: 3,
      name: "Eye Protection",
      description: "Safety glasses, goggles, and face shields",
      icon: "🥽",
      productCount: 34,
      bgColor: "from-purple-500 to-purple-600",
      textColor: "text-purple-600"
    },
    {
      id: 4,
      name: "Hand Protection",
      description: "Work gloves, chemical resistant gloves",
      icon: "🧤",
      productCount: 89,
      bgColor: "from-red-500 to-red-600",
      textColor: "text-red-600"
    },
    {
      id: 5,
      name: "Breathing Protection",
      description: "Masks, respirators, and filters",
      icon: "😷",
      productCount: 56,
      bgColor: "from-indigo-500 to-indigo-600",
      textColor: "text-indigo-600"
    },
    {
      id: 6,
      name: "Workwear & Clothing",
      description: "High-vis vests, coveralls, and uniforms",
      icon: "🦺",
      productCount: 78,
      bgColor: "from-orange-500 to-orange-600",
      textColor: "text-orange-600"
    }
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Shop by Protection Type
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the right safety equipment for your specific needs. All our products meet 
            international safety standards and come with quality guarantees.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.bgColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative p-8">
                {/* Icon */}
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{category.icon}</div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 ${category.textColor}`}>
                    {category.productCount} Products
                  </div>
                </div>

                {/* Category Info */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {category.description}
                  </p>
                </div>

                {/* Popular Items Preview */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Popular Items:</h4>
                  <div className="space-y-2">
                    {category.id === 1 && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Hard Hat with Chin Strap</span>
                          <span className="text-gray-900 font-medium">KES 2,500</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Bump Cap Lightweight</span>
                          <span className="text-gray-900 font-medium">KES 1,800</span>
                        </div>
                      </>
                    )}
                    {category.id === 2 && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Steel Toe Safety Boots</span>
                          <span className="text-gray-900 font-medium">KES 4,800</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Slip Resistant Shoes</span>
                          <span className="text-gray-900 font-medium">KES 3,200</span>
                        </div>
                      </>
                    )}
                    {category.id === 3 && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Safety Goggles Clear</span>
                          <span className="text-gray-900 font-medium">KES 800</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Face Shield Full</span>
                          <span className="text-gray-900 font-medium">KES 1,200</span>
                        </div>
                      </>
                    )}
                    {category.id === 4 && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Nitrile Work Gloves</span>
                          <span className="text-gray-900 font-medium">KES 350</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Cut Resistant Gloves</span>
                          <span className="text-gray-900 font-medium">KES 650</span>
                        </div>
                      </>
                    )}
                    {category.id === 5 && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">N95 Masks (50 Pack)</span>
                          <span className="text-gray-900 font-medium">KES 2,800</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">P2 Respirator</span>
                          <span className="text-gray-900 font-medium">KES 450</span>
                        </div>
                      </>
                    )}
                    {category.id === 6 && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">High-Vis Safety Vest</span>
                          <span className="text-gray-900 font-medium">KES 1,200</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Coverall Suit</span>
                          <span className="text-gray-900 font-medium">KES 2,800</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Shop Category Button */}
                <button className={`w-full ${category.textColor} bg-gray-50 hover:bg-gray-100 border border-gray-200 font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105`}>
                  <span>Shop {category.name}</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Hover Effect Border */}
              <div className={`absolute inset-0 border-2 border-transparent group-hover:bg-gradient-to-br group-hover:${category.bgColor} group-hover:opacity-10 rounded-2xl transition-all duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-primary-50 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need Help Choosing the Right Equipment?
            </h3>
            <p className="text-gray-600 mb-6">
              Our safety experts are here to help you find the perfect protection for your industry. 
              Get personalized recommendations based on your specific requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Get Expert Advice
              </button>
              <button className="border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Download Catalog
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;