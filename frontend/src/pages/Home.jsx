// frontend/src/pages/Home.jsx - COMPLETE VERSION
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const industries = [
    {
      id: 'construction',
      name: 'CONSTRUCTION',
      description: 'Heavy-duty protection for construction sites and building projects',
      products: ['Hard hats', 'Safety boots', 'High-vis vests', 'Fall protection'],
      stats: '200+ Projects'
    },
    {
      id: 'manufacturing',
      name: 'MANUFACTURING', 
      description: 'Precision safety for manufacturing environments and industrial operations',
      products: ['Safety glasses', 'Work gloves', 'Hearing protection', 'Machine guards'],
      stats: '150+ Facilities'
    },
    {
      id: 'healthcare',
      name: 'HEALTHCARE',
      description: 'Medical-grade protective equipment for healthcare professionals',
      products: ['Disposable gloves', 'Face masks', 'Protective gowns', 'Face shields'],
      stats: '50+ Hospitals'
    },
    {
      id: 'mining',
      name: 'MINING',
      description: 'Specialized equipment for mining operations and underground work',
      products: ['Respiratory protection', 'Cut-resistant gloves', 'Steel toe boots', 'Gas detectors'],
      stats: '25+ Mining Sites'
    },
    {
      id: 'logistics',
      name: 'LOGISTICS',
      description: 'Safety solutions for warehouse operations and logistics centers',
      products: ['Back support', 'Safety shoes', 'High-vis clothing', 'Loading equipment'],
      stats: '100+ Warehouses'
    },
    {
      id: 'agriculture',
      name: 'AGRICULTURE',
      description: 'Weather-resistant protection for outdoor agricultural work',
      products: ['Rain gear', 'Sun protection', 'Chemical resistant gloves', 'Respiratory masks'],
      stats: '300+ Farms'
    }
  ];

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Certified Quality',
      description: 'All products meet international safety standards including CE, ANSI, ISO, and OSHA certifications.',
      highlight: '100% Certified'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Fast Delivery',
      description: 'Same-day delivery in Nairobi, next-day delivery nationwide. Express shipping available.',
      highlight: 'Same Day Delivery'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Expert Support',
      description: 'Professional consultation and technical support with certified safety experts available 24/7.',
      highlight: '24/7 Support'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      title: 'Best Prices',
      description: 'Competitive pricing with bulk discounts up to 25%. Direct import savings passed to customers.',
      highlight: 'Up to 25% Off'
    }
  ];

  const categories = [
    {
      id: 'head',
      name: 'Head Protection',
      description: 'Hard hats, safety helmets, and bump caps',
      price: 'From KSh 850',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      badge: 'CERTIFIED',
      color: 'blue'
    },
    {
      id: 'eye',
      name: 'Eye Protection',
      description: 'Safety glasses, goggles, and face shields',
      price: 'From KSh 450',
      icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
      badge: 'UV PROTECTION',
      color: 'green'
    },
    {
      id: 'hand',
      name: 'Hand Protection',
      description: 'Work gloves, chemical resistant, cut resistant',
      price: 'From KSh 320',
      icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4 4 4 0 004-4V5z',
      badge: 'CUT RESISTANT',
      color: 'purple'
    },
    {
      id: 'foot',
      name: 'Foot Protection',
      description: 'Safety boots, steel toe, slip resistant',
      price: 'From KSh 2,800',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      badge: 'STEEL TOE',
      color: 'orange'
    }
  ];

  const testimonials = [
    {
      name: 'John Kamau',
      position: 'Site Manager',
      company: 'ABC Construction',
      rating: 5,
      image: 'JK',
      testimonial: 'Excellent service and quality products. We\'ve been using Bondex for our construction projects for 3 years now. Their safety boots are the most comfortable we\'ve found and the delivery is always on time.'
    },
    {
      name: 'Mary Wanjiku',
      position: 'Safety Officer',
      company: 'Kenya Manufacturing Co.',
      rating: 5,
      image: 'MW',
      testimonial: 'Perfect solution for our manufacturing facility. The bulk pricing is competitive and delivery is always on time. Highly recommend for industrial safety needs. Their technical support is exceptional.'
    },
    {
      name: 'David Kiprotich',
      position: 'Operations Manager',
      company: 'East Africa Mining Ltd',
      rating: 5,
      image: 'DK',
      testimonial: 'Outstanding quality and service. Bondex understands mining safety requirements and provides exactly what we need. Their gas detection equipment has been crucial for our operations.'
    }
  ];

  const events = [
    {
      title: 'Kenya Safety Expo 2025',
      date: 'March 15-17, 2025',
      location: 'KICC, Nairobi',
      description: 'Visit us at Booth A-12 for live product demonstrations and exclusive expo pricing',
      type: 'expo'
    },
    {
      title: 'Construction Safety Summit',
      date: 'May 8-10, 2025',
      location: 'Mombasa Convention Centre',
      description: 'Special construction industry pricing and new product launches',
      type: 'summit'
    },
    {
      title: 'Industrial Safety Conference',
      date: 'August 22-24, 2025',
      location: 'Kisumu Hotel',
      description: 'Manufacturing safety workshops and technical training sessions',
      type: 'conference'
    },
    {
      title: 'Mining Safety Workshop',
      date: 'November 5-6, 2025',
      location: 'Eldoret',
      description: 'Specialized mining safety equipment showcase and training',
      type: 'workshop'
    }
  ];

  const partners = [
    'Safaricom', 'KenGen', 'Bamburi Cement', 'KPLC', 'Kenya Airways', 'Equity Bank',
    'East African Breweries', 'Mumias Sugar', 'Kenya Pipeline', 'Kenol Kobil',
    'Diamond Trust Bank', 'Standard Chartered'
  ];

  const benefits = [
    'Unique quality/price ratio',
    'Always-in-stock guarantee',
    'Advanced technology & innovation',
    'Only specialized distributor channels',
    'Technical support & live chat',
    'Well-balanced product collection',
    'Contemporary & timeless design',
    'Global marketing support',
    'Available nationwide',
    'Bulk pricing discounts',
    'Same-day delivery Nairobi',
    '30-day return policy'
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 opacity-10"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center bg-yellow-400 bg-opacity-20 border border-yellow-400 border-opacity-30 rounded-full px-6 py-3 text-yellow-300 text-sm font-medium mb-8">
                <span className="w-3 h-3 bg-yellow-400 rounded-full mr-3 animate-pulse"></span>
                Kenya's Leading Safety Equipment Supplier
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Solutions for every
                <span className="block text-yellow-400 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">workplace</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                Protecting Kenya's workforce with world-class safety solutions. 
                From construction sites to hospitals, we provide certified equipment that saves lives.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 mb-12">
                <Link 
                  to="/products" 
                  className="bg-yellow-400 text-gray-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 hover:scale-105 transition-all duration-300 shadow-2xl text-center"
                >
                  Shop Now
                </Link>
                <Link 
                  to="/industries" 
                  className="border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 text-center"
                >
                  View Industries
                </Link>
              </div>
              
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-yellow-400">500+</div>
                  <div className="text-gray-400 text-sm">Happy Clients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400">50K+</div>
                  <div className="text-gray-400 text-sm">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400">24/7</div>
                  <div className="text-gray-400 text-sm">Support</div>
                </div>
              </div>
            </div>
            
            <div className="relative animate-slide-in">
              <div className="bg-gradient-to-br from-yellow-400 from-opacity-20 to-transparent rounded-3xl p-8 backdrop-blur-sm border border-yellow-400 border-opacity-20">
                <div className="text-center">
                  <div className="text-5xl font-bold text-yellow-400 mb-4">50,000+</div>
                  <div className="text-gray-300 mb-8 text-xl">Products in Stock</div>
                  
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-white bg-opacity-10 rounded-xl p-6 hover:bg-opacity-20 transition-colors">
                      <div className="text-3xl font-bold text-white">15+</div>
                      <div className="text-gray-400">Years Experience</div>
                    </div>
                    <div className="bg-white bg-opacity-10 rounded-xl p-6 hover:bg-opacity-20 transition-colors">
                      <div className="text-3xl font-bold text-white">20+</div>
                      <div className="text-gray-400">Industries Served</div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-400 text-gray-900 rounded-xl p-6">
                    <div className="font-bold text-xl mb-2">Free Consultation</div>
                    <div className="text-sm mb-4">Get personalized safety recommendations</div>
                    <Link to="/contact" className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Solutions for every workplace
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Professional-grade protection tailored to your industry's specific safety requirements. 
              Trusted by Kenya's leading companies across all sectors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <Link 
                key={industry.id}
                to={`/products?industry=${industry.id}`}
                className="relative overflow-hidden rounded-3xl bg-gray-900 aspect-[4/3] hover:scale-105 transition-all duration-500 shadow-2xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black via-opacity-40 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-600"></div>
                
                <div className="relative z-20 h-full flex flex-col justify-end p-8 text-white">
                  <div className="bg-yellow-400 text-gray-900 text-xs font-bold px-4 py-2 rounded-full inline-block w-fit mb-4">
                    {industry.name}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 hover:text-yellow-400 transition-colors">
                    {industry.description}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {industry.products.slice(0, 3).map((product, idx) => (
                      <span key={idx} className="text-xs bg-white bg-opacity-20 rounded-full px-3 py-1">
                        {product}
                      </span>
                    ))}
                    {industry.products.length > 3 && (
                      <span className="text-xs bg-white bg-opacity-20 rounded-full px-3 py-1">
                        +{industry.products.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="text-yellow-400 font-semibold text-sm">{industry.stats}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Safety Equipment Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional-grade protection for every part of your body. All products certified to international standards.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <div key={category.id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className={`h-56 bg-gradient-to-br from-${category.color}-100 to-${category.color}-200 flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute top-6 left-6">
                    <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                      {category.badge}
                    </span>
                  </div>
                  <div className={`w-24 h-24 bg-${category.color}-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-2xl`}>
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category.icon} />
                    </svg>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{category.name}</h3>
                  <p className="text-gray-600 mb-6">{category.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-yellow-600 font-bold text-xl">{category.price}</p>
                    <Link 
                      to={`/products?category=${category.id}`}
                      className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-yellow-300 transition-colors shadow-lg"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Bondex Suppliers?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kenya's trusted partner for workplace safety solutions with unmatched service and quality
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center relative">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600 hover:bg-yellow-400 hover:text-white transition-all duration-300 shadow-lg">
                  {feature.icon}
                </div>
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {feature.highlight}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Technical features
              </h2>
              <p className="text-xl text-gray-600 mb-12">
                We develop cutting-edge technologies for better protection and comfort during your work activities
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    title: 'Anti-slip technology for maximum grip',
                    description: 'Advanced sole compounds engineered for superior traction on all surfaces',
                    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  },
                  {
                    title: 'Breathable materials for all-day comfort', 
                    description: 'Moisture-wicking fabrics and ventilation systems keep you dry and comfortable',
                    icon: 'M13 10V3L4 14h7v7l9-11h-7z'
                  },
                  {
                    title: 'Individual orthopedic solutions',
                    description: 'Custom insoles and ergonomic designs for enhanced comfort and support',
                    icon: 'M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-6 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                    <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-3xl p-10 text-white shadow-2xl">
                <h3 className="text-3xl font-bold mb-6">Steel or composite toe boots, what do I need?</h3>
                <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                  Get expert advice on choosing the right safety footwear for your specific work environment and requirements. 
                  Our certified safety specialists will help you make the best choice.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Free safety assessment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Expert recommendations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Try before you buy</span>
                  </div>
                </div>
                <Link to="/contact" className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition-colors shadow-lg">
                  Get Expert Advice
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Stories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-12">Customer stories</h2>
              <div className="space-y-8">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-gray-50