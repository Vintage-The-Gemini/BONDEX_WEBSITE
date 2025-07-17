// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import Layout from './components/layout/Layout';

// Page Components
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Industries from './pages/Industries';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />
          
          <Route path="/products" element={
            <Layout>
              <Products />
            </Layout>
          } />
          
          <Route path="/products/:id" element={
            <Layout>
              <ProductDetail />
            </Layout>
          } />
          
          <Route path="/industries" element={
            <Layout>
              <Industries />
            </Layout>
          } />
          
          <Route path="/about" element={
            <Layout>
              <About />
            </Layout>
          } />
          
          <Route path="/contact" element={
            <Layout>
              <Contact />
            </Layout>
          } />

          {/* 404 Route */}
          <Route path="*" element={
            <Layout>
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-8">Page not found</p>
                  <a 
                    href="/" 
                    className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                  >
                    Back to Home
                  </a>
                </div>
              </div>
            </Layout>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;