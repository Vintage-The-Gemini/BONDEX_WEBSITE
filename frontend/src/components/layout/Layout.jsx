// frontend/src/components/layout/Layout.jsx
import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;