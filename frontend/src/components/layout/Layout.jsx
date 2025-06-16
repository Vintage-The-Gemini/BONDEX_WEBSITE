import Header from './Header'
import Footer from './Footer'
import DevNavigation from './DevNavigation'

const Layout = ({ children, showDevNav = true }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      
      {/* Development Navigation - remove in production */}
      {showDevNav && import.meta.env.DEV && <DevNavigation />}
    </div>
  )
}

export default Layout