import { Link } from 'react-router-dom'
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { PROTECTION_CATEGORIES, INDUSTRIES, APP_CONFIG } from '../../constants'

const Footer = () => {
  const categories = Object.values(PROTECTION_CATEGORIES)
  const industries = Object.values(INDUSTRIES)

  return (
    <footer className="gradient-dark text-white">
      {/* Main Footer Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="h-8 w-8 text-primary-400" />
              <div>
                <h3 className="text-xl font-bold text-white">Bondex Safety</h3>
                <p className="text-sm text-gray-400">Professional Equipment</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted partner for professional safety equipment across medical, 
              construction, and manufacturing industries. Quality gear that protects lives.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <PhoneIcon className="h-4 w-4 text-primary-400" />
                <span>{APP_CONFIG.contact.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <EnvelopeIcon className="h-4 w-4 text-primary-400" />
                <span>{APP_CONFIG.contact.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPinIcon className="h-4 w-4 text-primary-400" />
                <span>{APP_CONFIG.contact.address}</span>
              </div>
            </div>
          </div>

          {/* Safety Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-primary-400">Safety Equipment</h4>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link 
                    to={`/category/${category.id}`}
                    className="text-gray-300 hover:text-secondary-400 transition-colors text-sm flex items-center space-x-2"
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-primary-400">Industries</h4>
            <ul className="space-y-2">
              {industries.map((industry) => (
                <li key={industry.id}>
                  <Link 
                    to={`/industry/${industry.id}`}
                    className="text-gray-300 hover:text-secondary-400 transition-colors text-sm flex items-center space-x-2"
                  >
                    <span>{industry.icon}</span>
                    <span>{industry.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-gray-700">
              <h5 className="text-sm font-medium text-white mb-2">Quick Links</h5>
              <ul className="space-y-1">
                <li><Link to="/about" className="text-gray-300 hover:text-secondary-400 transition-colors text-sm">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-secondary-400 transition-colors text-sm">Contact</Link></li>
                <li><Link to="/shipping" className="text-gray-300 hover:text-secondary-400 transition-colors text-sm">Shipping Info</Link></li>
                <li><Link to="/returns" className="text-gray-300 hover:text-secondary-400 transition-colors text-sm">Returns</Link></li>
              </ul>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-primary-400">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/customer/orders" className="text-gray-300 hover:text-secondary-400 transition-colors">Track Your Order</Link></li>
              <li><Link to="/customer/profile" className="text-gray-300 hover:text-secondary-400 transition-colors">My Account</Link></li>
              <li><Link to="/help" className="text-gray-300 hover:text-secondary-400 transition-colors">Help Center</Link></li>
              <li><Link to="/size-guide" className="text-gray-300 hover:text-secondary-400 transition-colors">Size Guide</Link></li>
              <li><Link to="/safety-standards" className="text-gray-300 hover:text-secondary-400 transition-colors">Safety Standards</Link></li>
            </ul>

            {/* Certifications */}
            <div className="pt-4 border-t border-gray-700">
              <h5 className="text-sm font-medium text-white mb-2">Certifications</h5>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-primary-600 text-white text-xs rounded">OSHA</span>
                <span className="px-2 py-1 bg-secondary-600 text-brandBlack text-xs rounded">ANSI</span>
                <span className="px-2 py-1 bg-success-600 text-white text-xs rounded">ISO</span>
                <span className="px-2 py-1 bg-warning-600 text-brandBlack text-xs rounded">CSA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
              <span>&copy; 2024 {APP_CONFIG.name}. All rights reserved.</span>
              <div className="flex space-x-4">
                <Link to="/privacy" className="hover:text-secondary-400 transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-secondary-400 transition-colors">Terms of Service</Link>
                <Link to="/cookies" className="hover:text-secondary-400 transition-colors">Cookie Policy</Link>
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">We Accept:</span>
              <div className="flex space-x-2">
                <div className="w-8 h-5 bg-white rounded text-xs flex items-center justify-center text-gray-800 font-bold">💳</div>
                <div className="w-8 h-5 bg-blue-600 rounded text-xs flex items-center justify-center text-white font-bold">V</div>
                <div className="w-8 h-5 bg-red-600 rounded text-xs flex items-center justify-center text-white font-bold">M</div>
                <div className="w-8 h-5 bg-yellow-500 rounded text-xs flex items-center justify-center text-white font-bold">D</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer