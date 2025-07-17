// frontend/src/pages/About.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const stats = [
    { label: "Years in Business", value: "15+" },
    { label: "Happy Clients", value: "500+" },
    { label: "Products in Stock", value: "50,000+" },
    { label: "Industries Served", value: "20+" }
  ];

  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Quality First",
      description: "We source only certified, high-quality safety equipment that meets international standards."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Customer Focus",
      description: "Our customers' safety needs drive everything we do. We provide personalized service and expert guidance."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Innovation",
      description: "We continuously seek out the latest safety technologies to keep our clients protected."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Reliability",
      description: "Dependable supply chain and consistent service delivery you can count on."
    }
  ];

  const team = [
    {
      name: "David Mwangi",
      position: "Managing Director",
      description: "20+ years experience in safety equipment industry",
      image: "/images/team/david.jpg"
    },
    {
      name: "Sarah Wanjiku",
      position: "Operations Manager", 
      description: "Expert in safety compliance and quality assurance",
      image: "/images/team/sarah.jpg"
    },
    {
      name: "James Kiprotich",
      position: "Technical Advisor",
      description: "Industrial safety specialist and training coordinator",
      image: "/images/team/james.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About Bondex Suppliers</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Kenya's leading safety equipment provider, protecting workers across industries for over 15 years
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-yellow-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Bondex Suppliers Limited was founded in 2010 with a simple mission: to provide Kenya's workforce 
                  with access to world-class safety equipment that protects lives and prevents workplace injuries.
                </p>
                <p>
                  Starting as a small distributor in Nairobi, we recognized the critical need for reliable, 
                  certified safety equipment across Kenya's growing industrial sectors. Our founders, with 
                  backgrounds in engineering and occupational safety, were determined to bridge the gap between 
                  international safety standards and local accessibility.
                </p>
                <p>
                  Today, we serve over 500 companies across construction, manufacturing, healthcare, mining, 
                  and agriculture industries. Our commitment to quality, competitive pricing, and exceptional 
                  customer service has made us Kenya's trusted safety partner.
                </p>
                <p>
                  We maintain strategic partnerships with leading international manufacturers while supporting 
                  local businesses through flexible payment terms, bulk pricing, and comprehensive safety 
                  consultation services.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl p-8 text-gray-900">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-lg leading-relaxed mb-6">
                  To provide comprehensive safety solutions that protect workers and enhance productivity 
                  across all industries in Kenya and beyond.
                </p>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-lg leading-relaxed">
                  To be East Africa's leading safety equipment supplier, recognized for quality, 
                  innovation, and exceptional customer service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600 group-hover:bg-yellow-400 group-hover:text-white transition-all duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experienced professionals dedicated to your safety
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <div className="text-yellow-600 font-medium mb-3">{member.position}</div>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Certifications & Standards</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We maintain the highest standards and certifications
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['ISO 9001', 'ANSI', 'CE Marking', 'OSHA'].map((cert, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center hover:bg-yellow-50 transition-colors">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="font-bold text-gray-900">{cert}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Partner With Us?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join hundreds of companies who trust Bondex Suppliers for their safety equipment needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg"
            >
              Get in Touch
            </Link>
            <Link 
              to="/products" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-gray-900 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;