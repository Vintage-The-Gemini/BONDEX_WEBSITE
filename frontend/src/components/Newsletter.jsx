// src/components/Newsletter.jsx
import React, { useState } from 'react';
import { Mail, CheckCircle, Gift, Bell, TrendingUp } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription logic here
    console.log('Newsletter subscription:', email);
    setIsSubscribed(true);
    setTimeout(() => {
      setIsSubscribed(false);
      setEmail('');
    }, 3000);
  };

  const benefits = [
    {
      icon: <Gift className="h-5 w-5" />,
      text: "Exclusive discounts and early access to sales"
    },
    {
      icon: <Bell className="h-5 w-5" />,
      text: "New product announcements and updates"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      text: "Industry safety tips and best practices"
    }
  ];

  return (
    <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-white/20 p-3 rounded-lg">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Stay Safe & Informed
                </h2>
                <p className="text-primary-100 text-lg">
                  Join our safety community
                </p>
              </div>
            </div>

            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Get the latest safety equipment updates, exclusive discounts, and expert 
              safety tips delivered straight to your inbox. Join over 5,000 safety 
              professionals across Kenya.
            </p>

            {/* Benefits List */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="text-primary-200 flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <span className="text-primary-100">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">5,000+</div>
                  <div className="text-xs text-primary-200">Subscribers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">Weekly</div>
                  <div className="text-xs text-primary-200">Updates</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-xs text-primary-200">Spam</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Newsletter Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Subscribe Today
                  </h3>
                  <p className="text-gray-600">
                    Get exclusive access to safety insights and special offers
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                        required
                      />
                      <Mail className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                      Industry (Optional)
                    </label>
                    <select
                      id="industry"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                    >
                      <option value="">Select your industry</option>
                      <option value="healthcare">Healthcare & Medical</option>
                      <option value="construction">Construction & Building</option>
                      <option value="manufacturing">Manufacturing & Industrial</option>
                      <option value="oil-gas">Oil & Gas</option>
                      <option value="mining">Mining & Quarrying</option>
                      <option value="agriculture">Agriculture & Forestry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Special Offer */}
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Gift className="h-5 w-5 text-primary-600" />
                    <span className="font-semibold text-primary-800">Welcome Offer</span>
                  </div>
                  <p className="text-sm text-primary-700">
                    Get 10% off your first order when you subscribe today!
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Mail className="h-5 w-5" />
                  <span>Subscribe & Get 10% Off</span>
                </button>

                <p className="text-xs text-gray-500 text-center">
                  We respect your privacy. Unsubscribe at any time. 
                  <br />
                  <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
                </p>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome to Bondex Safety!
                </h3>
                <p className="text-gray-600 mb-4">
                  Thank you for subscribing. Check your email for your 10% discount code!
                </p>
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <p className="text-sm text-primary-800 font-medium">
                    🎉 Your discount code: <span className="font-bold">WELCOME10</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;