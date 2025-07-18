// src/components/UrgencyBanner.jsx
import React, { useState, useEffect } from 'react';
import { Clock, Flame, TrendingUp, Users, X } from 'lucide-react';

const UrgencyBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });
  const [isVisible, setIsVisible] = useState(true);
  const [currentOffer, setCurrentOffer] = useState(0);

  const offers = [
    {
      id: 1,
      type: "flash_sale",
      title: "🔥 FLASH SALE ENDING SOON!",
      description: "Get 25% OFF all Safety Helmets",
      action: "Shop Helmets Now",
      bgColor: "bg-red-600",
      icon: <Flame className="h-5 w-5" />
    },
    {
      id: 2,
      type: "limited_stock",
      title: "⚡ LIMITED STOCK ALERT!",
      description: "Only 12 Steel Toe Boots left in stock",
      action: "Secure Yours Now",
      bgColor: "bg-orange-600",
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      id: 3,
      type: "bulk_discount",
      title: "💰 BULK DISCOUNT AVAILABLE!",
      description: "Buy 10+ items, save 30% - Perfect for companies",
      action: "Get Bulk Quote",
      bgColor: "bg-green-600",
      icon: <Users className="h-5 w-5" />
    }
  ];

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Rotate offers
  useEffect(() => {
    const offerTimer = setInterval(() => {
      setCurrentOffer(prev => (prev + 1) % offers.length);
    }, 5000);

    return () => clearInterval(offerTimer);
  }, []);

  if (!isVisible) return null;

  const current = offers[currentOffer];

  return (
    <div className={`${current.bgColor} text-white py-3 px-4 relative overflow-hidden`}>
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Icon */}
            <div className="bg-white/20 p-2 rounded-full">
              {current.icon}
            </div>

            {/* Offer Content */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
              <div>
                <h3 className="font-bold text-lg">{current.title}</h3>
                <p className="text-sm opacity-90">{current.description}</p>
              </div>

              {/* Countdown Timer */}
              {current.type === "flash_sale" && (
                <div className="flex items-center space-x-2 mt-2 md:mt-0">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Ends in:</span>
                  <div className="flex space-x-1">
                    <div className="bg-white/20 px-2 py-1 rounded text-sm font-bold">
                      {String(timeLeft.hours).padStart(2, '0')}h
                    </div>
                    <div className="bg-white/20 px-2 py-1 rounded text-sm font-bold">
                      {String(timeLeft.minutes).padStart(2, '0')}m
                    </div>
                    <div className="bg-white/20 px-2 py-1 rounded text-sm font-bold">
                      {String(timeLeft.seconds).padStart(2, '0')}s
                    </div>
                  </div>
                </div>
              )}

              {/* Stock Counter */}
              {current.type === "limited_stock" && (
                <div className="flex items-center space-x-2 mt-2 md:mt-0">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Stock Level: Critical</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action & Close */}
          <div className="flex items-center space-x-3">
            <button className="bg-white text-gray-900 hover:bg-gray-100 font-bold py-2 px-4 rounded-lg transition-colors text-sm whitespace-nowrap">
              {current.action}
            </button>
            
            <button
              onClick={() => setIsVisible(false)}
              className="text-white/70 hover:text-white p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center mt-2 space-x-1">
          {offers.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-8 rounded-full transition-all ${
                index === currentOffer ? 'bg-white' : 'bg-white/30'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UrgencyBanner;