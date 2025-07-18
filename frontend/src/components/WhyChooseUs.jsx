// src/components/WhyChooseUs.jsx
import React from 'react';
import { Shield, Award, Truck, HeadphonesIcon, Clock, Users, CheckCircle, Star } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      icon: <Shield className="h-8 w-8" />,
      title: "Certified Quality",
      description: "All our products meet international safety standards including CE, ANSI, and ISO certifications.",
      highlight: "International Standards"
    },
    {
      id: 2,
      icon: <Truck className="h-8 w-8" />,
      title: "Fast & Free Delivery",
      description: "Free delivery within Nairobi and same-day dispatch for orders placed before 2 PM.",
      highlight: "Same-Day Dispatch"
    },
    {
      id: 3,
      icon: <Award className="h-8 w-8" />,
      title: "Expert Advice",
      description: "Our safety experts provide professional consultation to help you choose the right equipment.",
      highlight: "Professional Consultation"
    },
    {
      id: 4,
      icon: <HeadphonesIcon className="h-8 w-8" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support to assist with orders, product information, and technical queries.",
      highlight: "Always Available"
    },
    {
      id: 5,
      icon: <Clock className="h-8 w-8" />,
      title: "5+ Years Experience",
      description: "Established safety equipment provider with extensive experience serving Kenyan industries.",
      highlight: "Proven Track Record"
    },
    {
      id: 6,
      icon: <Users className="h-8 w-8" />,
      title: "Bulk Discounts",
      description: "Special pricing for bulk orders and corporate clients. Volume discounts available for large purchases.",
      highlight: "Corporate Pricing"
    }
  ];

  const certifications = [
    { name: "CE Marking", code: "CE", description: "European Conformity" },
    { name: "ANSI Standards", code: "ANSI", description: "American National Standards" },
    { name: "ISO Certified", code: "ISO", description: "International Organization" },
    { name: "KEBS Approved", code: "KEBS", description: "Kenya Bureau of Standards" }
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Bondex Safety?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're committed to providing the highest quality safety equipment with exceptional 
            service. Here's what sets us apart from other suppliers in Kenya.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-gray-50 rounded-xl p-6 hover:bg-primary-50 transition-colors duration-300 group"
            >
              <div className="text-primary-500 mb-4 group-hover:text-primary-600 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-3 leading-relaxed">
                {feature.description}
              </p>
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-primary-600 font-medium">
                  {feature.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Certifications Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Quality Certifications & Standards
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="bg-primary-500 text-white text-lg font-bold rounded-lg p-3 mb-3 mx-auto w-16 h-16 flex items-center justify-center">
                  {cert.code}
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  {cert.name}
                </h4>
                <p className="text-gray-600 text-xs">
                  {cert.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats & Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-10 w-10 text-primary-600" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">Premium Quality</h4>
            <p className="text-gray-600">
              Only the finest safety equipment from trusted global manufacturers.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Star className="h-10 w-10 text-green-600" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">Customer First</h4>
            <p className="text-gray-600">
              Dedicated to exceeding customer expectations with every interaction.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-blue-600" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">Local Expertise</h4>
            <p className="text-gray-600">
              Deep understanding of Kenyan industry safety requirements and regulations.
            </p>
          </div>
        </div>

        {/* Promise Section */}
        <div className="bg-primary-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">
            Our Promise to You
          </h3>
          <p className="text-xl mb-6 text-primary-100 max-w-3xl mx-auto">
            When you choose Bondex Safety, you're not just buying equipment – 
            you're investing in the safety and wellbeing of your team with a partner 
            who truly cares about your success.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-primary-700 rounded-lg p-4">
              <h4 className="font-bold mb-2">Quality Guarantee</h4>
              <p className="text-sm text-primary-200">
                100% satisfaction or money back
              </p>
            </div>
            <div className="bg-primary-700 rounded-lg p-4">
              <h4 className="font-bold mb-2">Expert Support</h4>
              <p className="text-sm text-primary-200">
                Professional guidance every step
              </p>
            </div>
            <div className="bg-primary-700 rounded-lg p-4">
              <h4 className="font-bold mb-2">Reliable Service</h4>
              <p className="text-sm text-primary-200">
                Consistent delivery and support
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;