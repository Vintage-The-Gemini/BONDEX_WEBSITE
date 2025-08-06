// frontend/src/App.jsx
import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

// Essential customer-facing components
import Header from './components/Header'
import UrgencyBanner from './components/UrgencyBanner'
import Footer from './components/Footer'
import ShoppingCart from './components/ShoppingCart'
import ProductModal from './components/ProductModal'

// Pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'

// Admin components and context
import { AdminProvider } from './context/AdminContext'
import AdminRouter from './routes/AdminRouter'

// Cart context
import { CartProvider } from './context/CartContext'

// Customer App Component
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
    
    console.log('Item added to cart successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UrgencyBanner />
      <Header 
        onOpenCart={openCart}
        cartItems={cartItems}
      />
      
      <Routes>
        {/* Home Page */}
        <Route 
          path="/" 
          element={
            <Home 
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />
        
        {/* Product Detail Page */}
        <Route 
          path="/products/:id" 
          element={
            <ProductDetail 
              onAddToCart={addToCart}
            />
          } 
        />

        {/* Products Page */}
        <Route 
          path="/products" 
          element={
            <Products 
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />

        {/* Category & Industry Pages */}
        <Route 
          path="/category/:category" 
          element={
            <Products 
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />

        <Route 
          path="/industry/:industry" 
          element={
            <Products 
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />

        {/* Search & Sale Pages */}
        <Route 
          path="/search" 
          element={
            <Products 
              onOpenProductModal={openProductModal} 
              onAddToCart={addToCart}
            />
          } 
        />
        
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

        {/* Simple About Page */}
        <Route 
          path="/about" 
          element={
            <div className="max-w-4xl mx-auto px-4 py-16">
              <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
              <div className="bg-white rounded-lg p-8 space-y-6 text-lg text-gray-700">
                <p>
                  Kenya's leading supplier of professional safety equipment, serving healthcare, 
                  construction, and industrial sectors since 2020.
                </p>
                <p>
                  We provide high-quality, certified safety gear that meets international standards 
                  to protect Kenya's workforce.
                </p>
              </div>
            </div>
          } 
        />

        {/* Simple Contact Page */}
        <Route 
          path="/contact" 
          element={
            <div className="max-w-2xl mx-auto px-4 py-16">
              <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
              <div className="bg-white rounded-lg p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                  <div className="space-y-3">
                    <div><strong>Phone:</strong> +254 700 000 000</div>
                    <div><strong>Email:</strong> info@safetyequipment.co.ke</div>
                    <div><strong>Address:</strong> Nairobi, Kenya</div>
                  </div>
                </div>
                <a 
                  href="tel:+254700000000" 
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Call Now
                </a>
              </div>
            </div>
          } 
        />

        {/* 404 Page */}
        <Route 
          path="*" 
          element={
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
              <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
              <a 
                href="/" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go Home
              </a>
            </div>
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
      <CartProvider>
        <Routes>
          {/* Admin Panel Routes */}
          <Route path="/admin/*" element={<AdminRouter />} />
          
          {/* Customer-facing Routes */}
          <Route path="/*" element={<CustomerApp />} />
        </Routes>
      </CartProvider>
    </AdminProvider>
  )
}

export default App