// src/components/CallToAction.jsx
import React from 'react';
import { ShoppingCart, Phone, Download, ArrowRight, Shield, Clock, Truck } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Protect Your Team?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Don't wait for an accident to happen. Equip your workplace with professional 
            safety equipment today and ensure everyone goes home safe.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors flex items-center justify-center space-x-2 text-lg">
              <ShoppingCart className="h-6 w-6" />
              <span>Shop Safety Equipment</span>
            </button>
            
            <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-4 px-8 rounded-lg transition-colors flex items-center justify-center space-x-2 text-lg">
              <Phone className="h-6 w-6" />
              <span>Call for Expert Advice</span>
            </button>
            
            <button className="border-2 border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white font-semibold py-4 px-8 rounded-lg transition-colors flex items-center justify-center space-x-2 text-lg">
              <Download className="h-6 w-6" />
              <span>Download Catalog</span>
            </button>
          </div>

          {/* Urgency Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-800 rounded-2xl p-8">
            <div className="text-center">
              <div className="bg-primary-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Same-Day Dispatch</h3>
              <p className="text-gray-300 text-sm">
                Orders placed before 2 PM are dispatched the same day
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Quality Guaranteed</h3>
              <p className="text-gray-300 text-sm">
                100% certified products with international standards
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
              <p className="text-gray-300 text-sm">
                Expert assistance whenever you need it
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="bg-red-600 rounded-2xl p-8 text-center mb-16">
          <h3 className="text-2xl font-bold mb-4">
            🚨 Urgent Safety Equipment Needed?
          </h3>
          <p className="text-lg mb-6 text-red-100">
            For immediate safety equipment requirements or emergency orders, 
            call our hotline now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+254700000000"
              className="bg-white text-red-600 hover:bg-red-50 font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Phone className="h-5 w-5" />
              <span>+254 700 000 000</span>
            </a>
            <a 
              href="mailto:emergency@bondexsafety.co.ke"
              className="border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold py-3 px-6 rounded-lg transition-colors"
            >
              emergency@bondexsafety.co.ke
            </a>
          </div>
        </div>

        {/* Industry-Specific CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Healthcare */}
          <div className="bg-blue-600 rounded-xl p-6 text-center hover:bg-blue-700 transition-colors cursor-pointer">
            <div className="text-4xl mb-4">🏥</div>
            <h4 className="text-xl font-bold mb-2">Healthcare Facilities</h4>
            <p className="text-blue-100 mb-4 text-sm">
              Medical PPE, surgical masks, protective gowns, and more
            </p>
            <button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-1 mx-auto">
              <span>Shop Medical PPE</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Construction */}
          <div className="bg-orange-600 rounded-xl p-6 text-center hover:bg-orange-700 transition-colors cursor-pointer">
            <div className="text-4xl mb-4">🏗️</div>
            <h4 className="text-xl font-bold mb-2">Construction Sites</h4>
            <p className="text-orange-100 mb-4 text-sm">
              Hard hats, safety boots, high-vis vests, fall protection
            </p>
            <button className="bg-white text-orange-600 hover:bg-orange-50 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-1 mx-auto">
              <span>Shop Construction</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Manufacturing */}
          <div className="bg-green-600 rounded-xl p-6 text-center hover:bg-green-700 transition-colors cursor-pointer">
            <div className="text-4xl mb-4">🏭</div>
            <h4 className="text-xl font-bold mb-2">Manufacturing</h4>
            <p className="text-green-100 mb-4 text-sm">
              Industrial gloves, safety glasses, ear protection, more
            </p>
            <button className="bg-white text-green-600 hover:bg-green-50 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-1 mx-auto">
              <span>Shop Industrial</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Final Message */}
        <div className="text-center mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">
            Your Safety is Our Priority
          </h3>
          <p className="text-lg text-primary-100 mb-6 max-w-2xl mx-auto">
            At Bondex Safety, we believe that every worker deserves to return home safely. 
            Let us help you create a safer workplace with our premium safety equipment.
          </p>
          <button className="bg-white text-primary-600 hover:bg-primary-50 font-bold py-3 px-8 rounded-lg transition-colors text-lg">
            Start Shopping Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;