// frontend/src/pages/Home.jsx
import React from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import WhyChooseUs from '../components/WhyChooseUs';

const Home = ({ onOpenProductModal, onAddToCart }) => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Categories />
      <FeaturedProducts 
        onOpenProductModal={onOpenProductModal} 
        onAddToCart={onAddToCart}
      />
      <WhyChooseUs />
    </div>
  );
};

export default Home;