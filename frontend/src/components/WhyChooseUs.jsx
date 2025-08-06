// frontend/src/components/WhyChooseUs.jsx
import React from 'react';

const WhyChooseUs = () => {
  const features = [
    {
      title: "Quality Guaranteed",
      description: "All products meet international safety standards with manufacturer warranties",
      stat: "100%",
      statLabel: "Certified"
    },
    {
      title: "Fast Delivery",
      description: "Same-day delivery in Nairobi, countrywide shipping within 2-3 business days",
      stat: "24hrs",
      statLabel: "Delivery"
    },
    {
      title: "Expert Support",
      description: "Professional advice from safety experts to help you choose the right equipment",
      stat: "24/7",
      statLabel: "Support"
    },
    {
      title: "Trusted by Professionals",
      description: "Over 1000+ companies trust us for their workplace safety equipment needs",
      stat: "1000+",
      statLabel: "Companies"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to protecting Kenya's workforce with quality equipment and professional service
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow"
            >
              {/* Stat */}
              <div className="mb-4">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {feature.stat}
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">
                  {feature.statLabel}
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="bg-blue-600 text-white rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Protect Your Team?</h3>
            <p className="mb-6">
              Get expert recommendations for your industry-specific safety needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Expert
              </a>
              <a 
                href="tel:+254700000000"
                className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;