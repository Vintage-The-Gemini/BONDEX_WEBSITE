// src/components/Testimonials.jsx
import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Dr. Sarah Kimani",
      role: "Chief Medical Officer",
      company: "Nairobi Hospital",
      image: "👩‍⚕️",
      rating: 5,
      text: "Bondex Safety has been our trusted partner for medical PPE. Their N95 masks and protective gowns have kept our healthcare workers safe throughout the pandemic. Excellent quality and fast delivery.",
      industry: "Healthcare"
    },
    {
      id: 2,
      name: "James Mwangi",
      role: "Site Manager",
      company: "Kenya Construction Ltd",
      image: "👷‍♂️",
      rating: 5,
      text: "The safety helmets and boots from Bondex are top quality. We've equipped over 200 workers and the durability is impressive. Great value for money and professional service.",
      industry: "Construction"
    },
    {
      id: 3,
      name: "Mary Wanjiku",
      role: "Safety Officer",
      company: "East Africa Breweries",
      image: "👩‍🔬",
      rating: 5,
      text: "Their industrial safety equipment meets all our compliance requirements. The team at Bondex understands our needs and always delivers on time. Highly recommended for manufacturing facilities.",
      industry: "Manufacturing"
    },
    {
      id: 4,
      name: "Peter Ochieng",
      role: "Operations Manager",
      company: "Tullow Oil Kenya",
      image: "👨‍💼",
      rating: 5,
      text: "Working in the oil industry requires the highest safety standards. Bondex provides certified equipment that we can trust. Their expertise in industrial safety is unmatched in Kenya.",
      industry: "Oil & Gas"
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trusted by leading companies across Kenya. Here's what our customers 
            have to say about our safety equipment and service.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6">
                <Quote className="h-8 w-8 text-primary-200" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {renderStars(testimonial.rating)}
                <span className="ml-2 text-sm text-gray-600">
                  {testimonial.rating}.0
                </span>
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-gray-700 leading-relaxed mb-6 text-lg">
                "{testimonial.text}"
              </blockquote>

              {/* Customer Info */}
              <div className="flex items-center">
                <div className="text-4xl mr-4">{testimonial.image}</div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  <p className="text-primary-600 text-sm font-medium">
                    {testimonial.company}
                  </p>
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full mt-1">
                    {testimonial.industry}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">5,000+</div>
              <div className="text-gray-600">Products Delivered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">99%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Join hundreds of satisfied customers who trust Bondex Safety
          </p>
          <button className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Start Shopping Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;