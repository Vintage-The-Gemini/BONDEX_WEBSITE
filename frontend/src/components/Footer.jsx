// src/components/Footer.jsx
import React from 'react';
import { Shield, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-500 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Bondex Safety</h3>
                <p className="text-gray-400 text-sm">Professional Safety Equipment</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted partner for professional safety equipment in Kenya. 
              We provide certified, high-quality PPE for medical, construction, 
              and manufacturing industries.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Product Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Head Protection
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Foot Protection
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Eye Protection
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Hand Protection
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Breathing Protection
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Workwear & Clothing
                </a>
              </li>
            </ul>
          </div>

          {/* Industries */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Industries We Serve</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Medical & Healthcare
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Construction & Building
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Manufacturing & Industrial
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Oil & Gas
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Mining & Quarrying
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Agriculture & Forestry
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Information</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">
                    Bondex Safety Equipment Store<br />
                    Industrial Area, Nairobi<br />
                    Kenya
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">+254 700 000 000</p>
                  <p className="text-gray-300">+254 722 000 000</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">info@bondexsafety.co.ke</p>
                  <p className="text-gray-300">sales@bondexsafety.co.ke</p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h5 className="font-semibold mb-2 text-primary-400">Business Hours</h5>
              <div className="text-sm text-gray-300 space-y-1">
                <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                <p>Saturday: 9:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h4 className="text-xl font-semibold mb-2">Stay Updated</h4>
              <p className="text-gray-300 text-sm">
                Subscribe to our newsletter for the latest safety equipment updates, 
                industry news, and exclusive offers.
              </p>
            </div>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
              />
              <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p>&copy; 2025 Bondex Safety. All rights reserved.</p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-primary-400 transition-colors">Return Policy</a>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <span>Payments:</span>
              <div className="flex space-x-2">
                <div className="bg-gray-700 px-2 py-1 rounded text-xs">M-PESA</div>
                <div className="bg-gray-700 px-2 py-1 rounded text-xs">VISA</div>
                <div className="bg-gray-700 px-2 py-1 rounded text-xs">MASTERCARD</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;