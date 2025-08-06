// frontend/src/components/Categories.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: "Head Protection",
      description: "Safety helmets & hard hats",
      icon: "⛑️",
      productCount: 45,
      bgGradient: "from-blue-500 to-cyan-400",
      image: "https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=400&h=300&fit=crop",
      popular: true
    },
    {
      id: 2,
      name: "Eye Protection", 
      description: "Safety glasses & goggles",
      icon: "🥽",
      productCount: 34,
      bgGradient: "from-purple-500 to-pink-400",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
      popular: false
    },
    {
      id: 3,
      name: "Hand Protection",
      description: "Work gloves & safety gear",
      icon: "🧤", 
      productCount: 89,
      bgGradient: "from-red-500 to-orange-400",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop",
      popular: true
    },
    {
      id: 4,
      name: "Foot Protection",
      description: "Safety boots & shoes",
      icon: "🥾",
      productCount: 67,
      bgGradient: "from-green-500 to-teal-400", 
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
      popular: false
    },
    {
      id: 5,
      name: "Breathing Protection",
      description: "Masks & respirators",
      icon: "😷",
      productCount: 56,
      bgGradient: "from-indigo-500 to-blue-400",
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=300&fit=crop",
      popular: true
    },
    {
      id: 6,
      name: "High-Vis Clothing",
      description: "Vests & safety uniforms", 
      icon: "🦺",
      productCount: 78,
      bgGradient: "from-yellow-500 to-orange-400",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional safety equipment for every workplace. All products certified to international standards.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.name.toLowerCase().replace(' ', '-')}`}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              {/* Popular Badge */}
              {category.popular && (
                <div className="absolute top-4 right-4 z-10 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>Popular</span>
                </div>
              )}

              {/* Category Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-80 group-hover:opacity-90 transition-opacity`} />
                
                {/* Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl transform group-hover:scale-125 transition-transform duration-300">
                    {category.icon}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {category.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    {category.productCount}+
                  </span>
                  <span className="text-sm text-gray-500">
                    Products Available
                  </span>
                </div>

                {/* CTA Button */}
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                    Shop Now
                  </span>
                  <ArrowRight className="h-5 w-5 text-blue-600 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-2xl transition-colors" />
            </Link>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">
            Can't Find What You Need?
          </h3>
          <p className="text-lg mb-6 text-blue-100">
            Our safety experts are ready to help you find the perfect equipment for your industry
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Expert
            </Link>
            <Link
              to="/products"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Categories;