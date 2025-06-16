import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Public Pages
import Home from './pages/Home'
import Layout from './components/layout/Layout'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'

// Import components for demo
import { Card, CardHeader, CardBody, CardFooter } from './components/ui/Card'
import Button from './components/ui/Button'
import Badge from './components/ui/Badge'
import Input from './components/ui/Input'
import { Spinner, LoadingCard } from './components/ui/Loading'
import { ProductCard, CategoryCard, SearchBar } from './components/common'
import { PROTECTION_CATEGORIES, INDUSTRIES } from './constants'

import './App.css'

// Demo Page Component
const ComponentsDemo = () => {
  // Mock product for demo
  const demoProduct = {
    id: 1,
    name: "Professional Hard Hat with 4-Point Suspension System",
    price: 29.99,
    originalPrice: 39.99,
    image: "/images/products/hard-hat-demo.jpg",
    category: PROTECTION_CATEGORIES.HEAD,
    industry: INDUSTRIES.CONSTRUCTION,
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    isOnSale: true,
    isFeatured: true
  }

  return (
    <Layout>
      <div className="container-custom py-8 space-y-12">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gradient-safety mb-4">
            🛡️ Bondex Components Demo
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Showcasing all the beautiful components we've built for our safety equipment store.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="bg-primary-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-primary-800 mb-4">🚀 Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/" className="block">
              <div className="bg-white p-4 rounded-lg border border-primary-200 hover:border-primary-400 transition-colors">
                <h3 className="font-semibold text-primary-700">🏠 Home Page</h3>
                <p className="text-sm text-gray-600 mt-1">Complete homepage with all features</p>
              </div>
            </a>
            <a href="/admin/dashboard" className="block">
              <div className="bg-white p-4 rounded-lg border border-secondary-200 hover:border-secondary-400 transition-colors">
                <h3 className="font-semibold text-secondary-700">⚙️ Admin Dashboard</h3>
                <p className="text-sm text-gray-600 mt-1">Complete admin panel with stats</p>
              </div>
            </a>
            <a href="/demo" className="block">
              <div className="bg-white p-4 rounded-lg border border-success-200 hover:border-success-400 transition-colors">
                <h3 className="font-semibold text-success-700">🎨 Components Demo</h3>
                <p className="text-sm text-gray-600 mt-1">All UI components showcase</p>
              </div>
            </a>
          </div>
        </div>

        {/* Buttons Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Button Variants</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary (Yellow)</Button>
              <Button variant="yellow">Yellow Button</Button>
              <Button variant="black">Black Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="success">Success Button</Button>
              <Button variant="danger">Danger Button</Button>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
              <Button variant="primary" size="xl">Extra Large</Button>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" loading>Loading Button</Button>
              <Button variant="secondary" disabled>Disabled Button</Button>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Card Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default">
              <CardHeader>
                <h3 className="font-semibold">Default Card</h3>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600">This is a default card with standard styling.</p>
              </CardBody>
              <CardFooter>
                <Button variant="outline" size="sm">Learn More</Button>
              </CardFooter>
            </Card>

            <Card variant="green">
              <CardHeader variant="green">
                <h3 className="font-semibold">Green Safety Card</h3>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600">Green themed card for safety equipment categories.</p>
              </CardBody>
              <CardFooter variant="green">
                <Button variant="primary" size="sm">Shop Now</Button>
              </CardFooter>
            </Card>

            <Card variant="yellow">
              <CardHeader variant="yellow">
                <h3 className="font-semibold">Yellow Warning Card</h3>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600">Yellow themed card for warnings and caution items.</p>
              </CardBody>
              <CardFooter variant="yellow">
                <Button variant="yellow" size="sm">View Details</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Badges Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Safety Equipment Badges</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Badge variant="head">👷 Head Protection</Badge>
              <Badge variant="foot">👢 Foot Protection</Badge>
              <Badge variant="eye">👓 Eye Protection</Badge>
              <Badge variant="hand">🧤 Hand Protection</Badge>
              <Badge variant="breathing">😷 Breathing Protection</Badge>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Badge variant="primary" size="sm">Small</Badge>
              <Badge variant="secondary" size="md">Medium</Badge>
              <Badge variant="success" size="lg">Large</Badge>
            </div>
          </div>
        </section>

        {/* Product Card */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Card</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCard 
              product={demoProduct}
              onAddToCart={(product) => alert(`Added ${product.name} to cart!`)}
              onToggleWishlist={(product) => alert(`Toggled ${product.name} in wishlist!`)}
              isWishlisted={false}
            />
            <ProductCard 
              product={{...demoProduct, id: 2, inStock: false, name: "Out of Stock Item"}}
              onAddToCart={(product) => alert(`Added ${product.name} to cart!`)}
              onToggleWishlist={(product) => alert(`Toggled ${product.name} in wishlist!`)}
              isWishlisted={true}
            />
          </div>
        </section>
      </div>
    </Layout>
  )
}

// Admin Access Component
const AdminAccess = () => {
  return (
    <Layout>
      <div className="container-custom py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">🛡️</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Bondex Safety Admin Panel
            </h1>
            <p className="text-xl text-gray-600">
              Professional safety equipment store administration
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Panel Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-primary-500">✅</span>
                  <span>Dashboard with real-time stats</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-primary-500">✅</span>
                  <span>Product management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-primary-500">✅</span>
                  <span>Order processing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-primary-500">✅</span>
                  <span>Customer management</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-primary-500">✅</span>
                  <span>Inventory tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-primary-500">✅</span>
                  <span>Analytics & reporting</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-primary-500">✅</span>
                  <span>Low stock alerts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-primary-500">✅</span>
                  <span>Settings management</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <a href="/admin/dashboard">
              <Button variant="primary" size="lg" className="w-full md:w-auto">
                🚀 Access Admin Dashboard
              </Button>
            </a>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/">
                <Button variant="outline" size="md">
                  🏠 Back to Home
                </Button>
              </a>
              <a href="/demo">
                <Button variant="outline" size="md">
                  🎨 View Components
                </Button>
              </a>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> This is a demo admin panel. In production, you would implement proper authentication and authorization.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

// Main App Component
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/demo" element={<ComponentsDemo />} />
          <Route path="/admin" element={<AdminAccess />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Placeholder routes for future admin pages */}
          <Route path="/admin/products" element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Products Management</h1>
                <p className="text-gray-600 mb-4">Coming soon...</p>
                <a href="/admin/dashboard">
                  <Button variant="primary">Back to Dashboard</Button>
                </a>
              </div>
            </div>
          } />
          
          <Route path="/admin/orders" element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Orders Management</h1>
                <p className="text-gray-600 mb-4">Coming soon...</p>
                <a href="/admin/dashboard">
                  <Button variant="primary">Back to Dashboard</Button>
                </a>
              </div>
            </div>
          } />
          
          <Route path="/admin/customers" element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Customer Management</h1>
                <p className="text-gray-600 mb-4">Coming soon...</p>
                <a href="/admin/dashboard">
                  <Button variant="primary">Back to Dashboard</Button>
                </a>
              </div>
            </div>
          } />
          
          <Route path="/admin/analytics" element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Analytics & Reports</h1>
                <p className="text-gray-600 mb-4">Coming soon...</p>
                <a href="/admin/dashboard">
                  <Button variant="primary">Back to Dashboard</Button>
                </a>
              </div>
            </div>
          } />
          
          <Route path="/admin/settings" element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
                <p className="text-gray-600 mb-4">Coming soon...</p>
                <a href="/admin/dashboard">
                  <Button variant="primary">Back to Dashboard</Button>
                </a>
              </div>
            </div>
          } />

          {/* 404 Route */}
          <Route path="*" element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-4">Page not found</p>
                <a href="/">
                  <Button variant="primary">Go Home</Button>
                </a>
              </div>
            </div>
          } />
        </Routes>
        
        {/* Toast notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#16a34a',
              color: '#fff',
            },
            success: {
              style: {
                background: '#16a34a',
              },
            },
            error: {
              style: {
                background: '#dc2626',
              },
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App