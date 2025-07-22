// src/App.jsx
import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

// Customer-facing components (your existing components)
import Header from './components/Header'
import UrgencyBanner from './components/UrgencyBanner'
import Hero from './components/Hero'
import Categories from './components/Categories'
import FeaturedProducts from './components/FeaturedProducts'
import QuickBuy from './components/QuickBuy'
import WhyChooseUs from './components/WhyChooseUs'
import Testimonials from './components/Testimonials'
import Newsletter from './components/Newsletter'
import CallToAction from './components/CallToAction'
import Footer from './components/Footer'
import ShoppingCart from './components/ShoppingCart'
import ProductModal from './components/ProductModal'
import Products from './pages/Products'

// Admin components and context
import { AdminProvider } from './context/AdminContext'
import AdminRouter from './routes/AdminRouter'

// Homepage Component (your existing)
const HomePage = ({ onOpenProductModal }) => (
  <>
    <Hero />
    <Categories />
    <FeaturedProducts onOpenProductModal={onOpenProductModal} />
    <QuickBuy />
    <WhyChooseUs />
    <Testimonials />
    <Newsletter />
    <CallToAction />
  </>
);

// Customer App Component (your existing functionality)
const CustomerApp = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  const addToCart = (product) => {
    console.log('Adding to cart:', product);
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
    
    // Show success notification (you can implement toast notifications here)
    console.log('Item added to cart successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Urgency Banner for immediate conversions */}
      <UrgencyBanner />
      
      <Header onOpenCart={openCart} cartCount={cartItems.length} />
      
      <Routes>
        {/* Homepage Route */}
        <Route 
          path="/" 
          element={<HomePage onOpenProductModal={openProductModal} />} 
        />
        
        {/* Products Catalog Route */}
        <Route 
          path="/products" 
          element={
            <Products 
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />
        
        {/* Category Routes */}
        <Route 
          path="/products/head-protection" 
          element={
            <Products 
              defaultCategory="Head Protection"
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />
        <Route 
          path="/products/foot-protection" 
          element={
            <Products 
              defaultCategory="Foot Protection"
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />
        <Route 
          path="/products/eye-protection" 
          element={
            <Products 
              defaultCategory="Eye Protection"
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />
        <Route 
          path="/products/hand-protection" 
          element={
            <Products 
              defaultCategory="Hand Protection"
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />
        <Route 
          path="/products/breathing-protection" 
          element={
            <Products 
              defaultCategory="Breathing Protection"
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />
        <Route 
          path="/products/workwear" 
          element={
            <Products 
              defaultCategory="Workwear"
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />
        
        {/* Industry Routes */}
        <Route 
          path="/industries/medical" 
          element={
            <Products 
              defaultIndustry="Medical"
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />
        <Route 
          path="/industries/construction" 
          element={
            <Products 
              defaultIndustry="Construction"
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />
        <Route 
          path="/industries/manufacturing" 
          element={
            <Products 
              defaultIndustry="Manufacturing"
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />

        {/* Search Results Route */}
        <Route 
          path="/search" 
          element={
            <Products 
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />
        
        {/* Sale/Special Offers Route */}
        <Route 
          path="/sale" 
          element={
            <Products 
              defaultFilter="onSale"
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />
      </Routes>
      
      <Footer />
      
      {/* Shopping Cart Sidebar */}
      <ShoppingCart 
        isOpen={isCartOpen} 
        onClose={closeCart}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
      
      {/* Product Quick View Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        onAddToCart={addToCart}
      />
    </div>
  );
};

// Main App Component
function App() {
  return (
    <AdminProvider>
      <Routes>
        {/* Admin Panel Routes */}
        <Route path="/admin/*" element={<AdminRouter />} />
        
        {/* Customer-facing Routes (your existing app) */}
        <Route path="/*" element={<CustomerApp />} />
      </Routes>
    </AdminProvider>
  )
}

export default App// frontend/src/App.jsx
