// src/components/FeaturedProducts.jsx
import React from 'react';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';

const FeaturedProducts = () => {
  // Sample product data - will be replaced with API data later
  const featuredProducts = [
    {
      id: 1,
      name: "Professional Safety Helmet",
      category: "Head Protection",
      price: 2500,
      originalPrice: 3000,
      rating: 4.8,
      reviews: 124,
      image: "🪖",
      badge: "Best Seller",
      features: ["CE Certified", "Adjustable", "Lightweight"]
    },
    {
      id: 2,
      name: "Steel Toe Safety Boots",
      category: "Foot Protection",
      price: 4800,
      originalPrice: null,
      rating: 4.9,
      reviews: 89,
      image: "🥾",
      badge: "New Arrival",
      features: ["Steel Toe", "Slip Resistant", "Waterproof"]
    },
    {
      id: 3,
      name: "Safety Goggles Clear",
      category: "Eye Protection",
      price: 800,
      originalPrice: 1200,
      rating: 4.7,
      reviews: 156,
      image: "🥽",
      badge: "Sale",
      features: ["Anti-Fog", "UV Protection", "Comfortable"]
    },
    {
      id: 4,
      name: "Nitrile Work Gloves",
      category: "Hand Protection",
      price: 350,
      originalPrice: null,
      rating: 4.6,
      reviews: 203,
      image: "🧤",
      badge: null,
      features: ["Chemical Resistant", "Durable", "Comfortable Grip"]
    },
    {
      id: 5,
      name: "High-Vis Safety Vest",
      category: "Workwear",
      price: 1200,
      originalPrice: 1500,
      rating: 4.5,
      reviews: 78,
      image: "🦺",
      badge: "Popular",
      features: ["Reflective Strips", "Breathable", "Machine Washable"]
    },
    {
      id: 6,
      name: "N95 Face Masks (50 Pack)",
      category: "Breathing Protection",
      price: 2800,
      originalPrice: null,
      rating: 4.9,
      reviews: 312,
      image: "😷",
      badge: "Medical Grade",
      features: ["FDA Approved", "Comfortable Fit", "95% Filtration"]
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured Safety Equipment
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our most popular safety products trusted by professionals across Kenya. 
            All items come with quality guarantees and fast delivery.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
              {/* Product Image & Badge */}
              <div className="relative bg-gray-100 p-8 text-center">
                <div className="text-6xl mb-4">{product.image}</div>
                
                {product.badge && (
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
                    product.badge === 'Sale' ? 'bg-red-500 text-white' :
                    product.badge === 'New Arrival' ? 'bg-green-500 text-white' :
                    product.badge === 'Best Seller' ? 'bg-primary-500 text-white' :
                    product.badge === 'Medical Grade' ? 'bg-blue-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {product.badge}
                  </span>
                )}

                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                  <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
                    <Eye className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="mb-2">
                  <span className="text-sm text-primary-600 font-medium">{product.category}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {product.features.map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <span className="bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded">
                      Save {formatPrice(product.originalPrice - product.price)}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center mt-12">
          <button className="bg-white border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;