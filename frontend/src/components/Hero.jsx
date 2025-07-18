// src/components/Hero.jsx
import React from 'react';
import { ArrowRight, Shield, Truck, Award, Users } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative">
      {/* Main Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px] py-16">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Professional
                  <span className="block text-primary-400">Safety Equipment</span>
                  <span className="block text-3xl lg:text-4xl font-medium text-gray-300">
                    for Every Workplace
                  </span>
                </h1>
                <p className="text-xl text-gray-300 max-w-lg">
                  Protect your team with premium safety gear. From construction sites to medical facilities, 
                  we provide certified equipment that keeps professionals safe across Kenya.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2 transition-colors">
                  <span>Shop Now</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                  View Catalog
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-400">500+</div>
                  <div className="text-sm text-gray-300">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-400">50+</div>
                  <div className="text-sm text-gray-300">Brands</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-400">24/7</div>
                  <div className="text-sm text-gray-300">Support</div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl p-8 relative overflow-hidden">
                {/* Placeholder for main product image */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
                  <div className="bg-white/20 rounded-full p-6 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                    <Shield className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Featured Product</h3>
                  <p className="text-primary-100 mb-4">Professional Safety Helmet</p>
                  <div className="text-3xl font-bold text-primary-100">KES 2,500</div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 bg-white/10 rounded-full p-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -bottom-2 -left-2 bg-white/10 rounded-full p-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <div className="bg-primary-50 border-b border-primary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-500 p-2 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Free Delivery</h4>
                <p className="text-sm text-gray-600">Within Nairobi</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-primary-500 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Certified Quality</h4>
                <p className="text-sm text-gray-600">International Standards</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-primary-500 p-2 rounded-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Expert Support</h4>
                <p className="text-sm text-gray-600">Professional Advice</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-primary-500 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Trusted Partner</h4>
                <p className="text-sm text-gray-600">5+ Years Experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Solutions Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Solutions for Every Industry
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From medical facilities to construction sites, we provide specialized safety equipment 
              tailored to your industry's unique requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Medical */}
            <div className="bg-blue-50 rounded-xl p-6 hover:bg-blue-100 transition-colors cursor-pointer">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Medical & Healthcare</h3>
              <p className="text-gray-600 mb-4">
                PPE for hospitals, clinics, and healthcare professionals. Face masks, gloves, protective gowns.
              </p>
              <a href="#" className="text-primary-600 font-semibold hover:text-primary-700 flex items-center space-x-1">
                <span>Explore Medical PPE</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Construction */}
            <div className="bg-orange-50 rounded-xl p-6 hover:bg-orange-100 transition-colors cursor-pointer">
              <div className="text-4xl mb-4">🏗️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Construction & Building</h3>
              <p className="text-gray-600 mb-4">
                Hard hats, safety boots, high-visibility vests, and fall protection equipment for construction sites.
              </p>
              <a href="#" className="text-primary-600 font-semibold hover:text-primary-700 flex items-center space-x-1">
                <span>Shop Construction Gear</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Manufacturing */}
            <div className="bg-green-50 rounded-xl p-6 hover:bg-green-100 transition-colors cursor-pointer">
              <div className="text-4xl mb-4">🏭</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Manufacturing & Industrial</h3>
              <p className="text-gray-600 mb-4">
                Protective equipment for factories and industrial environments. Safety glasses, ear protection, gloves.
              </p>
              <a href="#" className="text-primary-600 font-semibold hover:text-primary-700 flex items-center space-x-1">
                <span>View Industrial Safety</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;