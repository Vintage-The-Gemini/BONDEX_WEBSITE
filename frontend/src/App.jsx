// frontend/src/App.jsx
import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

// Customer-facing components (existing)
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

// Admin components and context (existing)
import { AdminProvider } from './context/AdminContext'
import AdminRouter from './routes/AdminRouter'

// Cart context (new)
import { CartProvider } from './context/CartContext'

// Homepage Component (existing)
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

// Customer App Component (enhanced existing functionality)
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
    
    // Show success notification
    console.log('Item added to cart successfully!');
    openCart(); // Open cart to show the added item
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <UrgencyBanner />
      <Header 
        cartCount={cartCount}
        onCartClick={openCart}
        onAddToCart={addToCart}
      />
      
      <Routes>
        {/* Homepage Route */}
        <Route 
          path="/" 
          element={<HomePage onOpenProductModal={openProductModal} />} 
        />
        
        {/* Products Page Route */}
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
              defaultCategory="head-protection"
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />
        <Route 
          path="/products/eye-protection" 
          element={
            <Products 
              defaultCategory="eye-protection"
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />
        <Route 
          path="/products/hand-protection" 
          element={
            <Products 
              defaultCategory="hand-protection"
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />
        <Route 
          path="/products/foot-protection" 
          element={
            <Products 
              defaultCategory="foot-protection"
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />
        <Route 
          path="/products/breathing-protection" 
          element={
            <Products 
              defaultCategory="breathing-protection"
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />

        {/* Industry Routes */}
        <Route 
          path="/industry/medical" 
          element={
            <Products 
              defaultIndustry="medical"
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />
        <Route 
          path="/industry/construction" 
          element={
            <Products 
              defaultIndustry="construction"
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />
        <Route 
          path="/industry/manufacturing" 
          element={
            <Products 
              defaultIndustry="manufacturing"
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
      
      {/* Shopping Cart Sidebar (existing) */}
      <ShoppingCart 
        isOpen={isCartOpen} 
        onClose={closeCart}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
      
      {/* Product Quick View Modal (existing) */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        onAddToCart={addToCart}
      />
    </div>
  );
};

// Main App Component (enhanced existing)
function App() {
  return (
    <AdminProvider>
      <CartProvider>
        <Routes>
          {/* Admin Panel Routes (existing) */}
          <Route path="/admin/*" element={<AdminRouter />} />
          
          {/* Customer-facing Routes (existing + enhanced) */}
          <Route path="/*" element={<CustomerApp />} />
        </Routes>
      </CartProvider>
    </AdminProvider>
  )
}

export default App