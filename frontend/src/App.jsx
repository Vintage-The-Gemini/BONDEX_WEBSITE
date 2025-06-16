import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container-custom py-4">
          <h1 className="text-2xl font-bold text-primary-600">
            {import.meta.env.VITE_APP_NAME || 'Bondex Safety Equipment Store'}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-custom py-8">
        <div className="text-center">
          <div className="card max-w-md mx-auto">
            <div className="card-body">
              <h2 className="text-xl font-semibold mb-4">Welcome to Bondex!</h2>
              <p className="text-gray-600 mb-6">
                Your MERN stack safety equipment store is ready to be built.
              </p>
              
              {/* Counter Demo */}
              <div className="space-y-4">
                <p className="text-lg">Count: <span className="font-bold text-primary-600">{count}</span></p>
                <div className="space-x-2">
                  <button 
                    className="btn-primary"
                    onClick={() => setCount(count + 1)}
                  >
                    Increment
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => setCount(count - 1)}
                  >
                    Decrement
                  </button>
                  <button 
                    className="btn-outline"
                    onClick={() => setCount(0)}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="card">
              <div className="card-body text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Vite + React</h3>
                <p className="text-gray-600">Lightning fast development with hot module replacement</p>
              </div>
            </div>

            <div className="card">
              <div className="card-body text-center">
                <div className="w-12 h-12 bg-success-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M15 5l2 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Tailwind CSS</h3>
                <p className="text-gray-600">Beautiful, responsive design with utility-first CSS</p>
              </div>
            </div>

            <div className="card">
              <div className="card-body text-center">
                <div className="w-12 h-12 bg-warning-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Safety First</h3>
                <p className="text-gray-600">Professional safety equipment for all industries</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary-800 text-white mt-16">
        <div className="container-custom py-8">
          <div className="text-center">
            <p>&copy; 2024 Bondex Safety Equipment Store. All rights reserved.</p>
            <p className="text-secondary-400 mt-2">
              Built with Vite + React + Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App