// frontend/src/pages/Industries.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Industries = () => {
  const industries = [
    {
      id: 'construction',
      name: 'Construction',
      description: 'Heavy-duty protection for construction sites and building projects',
      image: '/images/industries/construction.jpg',
      requirements: [
        'Head protection from falling objects',
        'High-visibility clothing',
        'Steel toe safety boots',
        'Fall protection equipment',
        'Hand and eye protection'
      ],
      products: [
        { name: 'Hard Hats & Helmets', price: 'From KSh 850' },
        { name: 'High-Vis Safety Vests', price: 'From KSh 890' },
        { name: 'Steel Toe Boots', price: 'From KSh 2,800' },
        { name: 'Safety Harnesses', price: 'From KSh 4,500' }
      ],
      stats: { clients: '200+', projects: '500+' }
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing',
      description: 'Precision safety for manufacturing environments and industrial operations',
      image: '/images/industries/manufacturing.jpg',
      requirements: [
        'Machine guarding protection',
        'Chemical resistant equipment',
        'Hearing protection',
        'Cut-resistant gloves',
        'Respiratory protection'
      ],
      products: [
        { name: 'Cut-Resistant Gloves', price: 'From KSh 450' },
        { name: 'Safety Glasses', price: 'From KSh 320' },
        { name: 'Hearing Protection', price: 'From KSh 750' },
        { name: 'Respirator Masks', price: 'From KSh 85' }
      ],
      stats: { clients: '150+', facilities: '300+' }
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      description: 'Medical-grade protective equipment for healthcare professionals',
      image: '/images/industries/healthcare.jpg',
      requirements: [
        'Infection control barriers',
        'Disposable protective equipment',
        'Surgical masks and N95s',
        'Protective gowns and aprons',
        'Eye and face protection'
      ],
      products: [
        { name: 'N95 Respirators', price: 'From KSh 85' },
        { name: 'Surgical Masks', price: 'From KSh 25' },
        { name: 'Face Shields', price: 'From KSh 320' },
        { name: 'Disposable Gloves', price: 'From KSh 15' }
      ],
      stats: { hospitals: '50+', clinics: '200+' }
    },
    {
      id: 'mining',
      name: 'Mining',
      description: 'Specialized equipment for mining operations and underground work',
      image: '/images/industries/mining.jpg',
      requirements: [
        'Underground breathing apparatus',
        'Explosion-proof equipment',
        'Heavy-duty protective clothing',
        'Emergency rescue equipment',
        'Gas detection systems'
      ],
      products: [
        { name: 'Mining Helmets', price: 'From KSh 2,500' },
        { name: 'Gas Detectors', price: 'From KSh 15,000' },
        { name: 'Rescue Equipment', price: 'From KSh 8,500' },
        { name: 'Protective Suits', price: 'From KSh 3,200' }
      ],
      stats: { mines: '25+', workers: '5,000+' }
    },
    {
      id: 'agriculture',
      name: 'Agriculture',
      description: 'Weather-resistant protection for outdoor agricultural work',
      image: '/images/industries/agriculture.jpg',
      requirements: [
        'Sun and weather protection',
        'Chemical-resistant equipment',
        'Ergonomic support gear',
        'Respiratory protection',
        'Cut and puncture protection'
      ],
      products: [
        { name: 'Sun Protection Gear', price: 'From KSh 650' },
        { name: 'Chemical Suits', price: 'From KSh 1,850' },
        { name: 'Work Boots', price: 'From KSh 2,200' },
        { name: 'Protective Gloves', price: 'From KSh 380' }
      ],
      stats: { farms: '300+', cooperatives: '50+' }
    },
    {
      id: 'logistics',
      name: 'Logistics & Warehousing',
      description: 'Safety solutions for warehouse operations and logistics centers',
      image: '/images/industries/logistics.jpg',
      requirements: [
        'Back support equipment',
        'Slip-resistant footwear',
        'High-visibility clothing',
        'Material handling protection',
        'Vehicle safety equipment'
      ],
      products: [
        { name: 'Back Support Belts', price: 'From KSh 1,200' },
        { name: 'Safety Shoes', price: 'From KSh 2,800' },
        { name: 'Reflective Vests', price: 'From KSh 890' },
        { name: 'Work Gloves', price: 'From KSh 320' }
      ],
      stats: { warehouses: '100+', drivers: '2,000+' }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Industries We Serve</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Specialized safety solutions tailored to your industry's unique requirements
            </p>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {industries.map((industry, index) => (
              <div key={industry.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                {/* Image */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="relative h-96 bg-gradient-to-br from-gray-200 to-gray-400 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-12 h-12 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold">{industry.name}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <h2 className="text-3xl font-bold text-gray-900">{industry.name}</h2>
                      <div className="flex space-x-4 text-sm text-gray-600">
                        {Object.entries(industry.stats).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="font-bold text-yellow-600">{value}</div>
                            <div className="capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-lg mb-6">{industry.description}</p>

                    {/* Requirements */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Safety Requirements:</h4>
                      <ul className="space-y-2">
                        {industry.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Popular Products */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Popular Products:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {industry.products.map((product, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-3">
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-yellow-600 font-semibold">{product.price}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        to={`/products?industry=${industry.id}`}
                        className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors text-center"
                      >
                        View {industry.name} Products
                      </Link>
                      <Link
                        to="/contact"
                        className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-gray-400 transition-colors text-center"
                      >
                        Get Custom Quote
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-Industry Solutions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cross-Industry Solutions</h2>
            <p className="text-xl text-gray-600">Essential safety equipment used across multiple industries</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'PPE Kits',
                description: 'Complete personal protective equipment packages',
                industries: ['Healthcare', 'Manufacturing', 'Construction'],
                price: 'From KSh 2,500'
              },
              {
                name: 'Safety Training',
                description: 'Professional safety training and certification',
                industries: ['All Industries'],
                price: 'Custom Pricing'
              },
              {
                name: 'Emergency Equipment',
                description: 'First aid and emergency response equipment',
                industries: ['All Industries'],
                price: 'From KSh 1,200'
              },
              {
                name: 'Safety Signage',
                description: 'Warning signs and safety communication',
                industries: ['All Industries'],
                price: 'From KSh 150'
              }
            ].map((solution, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-yellow-50 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{solution.name}</h3>
                <p className="text-gray-600 mb-4">{solution.description}</p>
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">Used in:</div>
                  <div className="flex flex-wrap gap-1">
                    {solution.industries.map((industry, idx) => (
                      <span key={idx} className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-yellow-600 font-bold">{solution.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't See Your Industry?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            We work with businesses across all sectors. Contact us to discuss your specific safety requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors"
            >
              Contact Our Experts
            </Link>
            <Link 
              to="/products" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-gray-900 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Industries;